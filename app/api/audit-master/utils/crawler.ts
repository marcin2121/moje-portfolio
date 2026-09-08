import * as cheerio from 'cheerio';
import {
  PageAuditResult,
  EvidenceSummary,
  DuplicateTitleGroup,
  CategoryStats,
  AdsAndTrackingAudit,
  TrackingIssue,
  QuickCriticalIssue,
  DetailedCodeSmells
} from '../types';

interface CrawlOptions {
  maxPages?: number;
  maxTimeMs?: number;
  concurrency?: number;
}

export interface PageTrackingSignals {
  hasGoogleAds: boolean;
  googleAdsId?: string;
  hasGtm: boolean;
  gtmId?: string;
  hasGa4: boolean;
  ga4Id?: string;
  hasMetaPixel: boolean;
  hasTikTokPixel: boolean;
  hasConsentModeV2: boolean;
  hasDataLayer: boolean;
  hasAddToCartTracking: boolean;
  hasPurchaseTracking: boolean;
  hasCartButtons: boolean;
  hasLeadForms: boolean;
}

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (MolendaDevAuditBot/2.0)';

export async function crawlDomain(
  targetUrl: string,
  options: CrawlOptions = {}
): Promise<{ pages: PageAuditResult[]; evidence: EvidenceSummary }> {
  const maxPages = options.maxPages ?? 35;
  const maxTimeMs = options.maxTimeMs ?? 12000; // Twardy limit 12 sekund, by zapobiec 504 na VPS
  const concurrency = options.concurrency ?? 4;

  const startTime = Date.now();
  const parsedTarget = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
  const origin = parsedTarget.origin;
  const hostname = parsedTarget.hostname.toLowerCase();

  // 1. Zbieranie listy URL-i do przeskanowania (Sitemap + fallback Homepage links)
  const discoveredUrls = await discoverUrls(origin, targetUrl);
  
  // Ograniczamy do maxPages, upewniając się, że homepage jest na 1. miejscu
  const normalizedTarget = normalizeUrl(targetUrl, origin);
  const queue = Array.from(new Set([normalizedTarget, ...discoveredUrls]))
    .filter(u => isValidInternalUrl(u, hostname))
    .slice(0, maxPages);

  const pages: PageAuditResult[] = [];
  const signals: PageTrackingSignals[] = [];

  // 2. Równoległe przetwarzanie w małych paczkach (Batching z limitem czasu)
  for (let i = 0; i < queue.length; i += concurrency) {
    // Sprawdzamy czy nie przekroczyliśmy budżetu czasu
    if (Date.now() - startTime >= maxTimeMs) {
      break;
    }

    const batch = queue.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(url => analyzeSinglePage(url, origin))
    );

    for (const res of batchResults) {
      if (res.status === 'fulfilled' && res.value) {
        pages.push(res.value.page);
        signals.push(res.value.tracking);
      }
    }
  }

  // 3. Agregacja twardych dowodów (Evidence Engine) wraz z telemetryką
  const evidence = buildEvidenceSummary(pages, signals);

  return { pages, evidence };
}

/**
 * Wykrywanie podstron z sitemapy lub linków strony głównej
 */
async function discoverUrls(origin: string, fallbackUrl: string): Promise<string[]> {
  const urls: string[] = [];
  const sitemapCandidates = [
    `${origin}/sitemap.xml`,
    `${origin}/sitemap_index.xml`,
    `${origin}/wp-sitemap.xml`
  ];

  for (const sitemapUrl of sitemapCandidates) {
    try {
      const res = await fetch(sitemapUrl, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(3000),
        cache: 'no-store'
      });

      if (res.ok) {
        const text = await res.text();
        const matches = text.match(/<loc>(https?:\/\/[^<]+)<\/loc>/gi);
        if (matches && matches.length > 0) {
          for (const match of matches) {
            const loc = match.replace(/<\/?loc>/gi, '').trim();
            // Ignorujemy pliki xml (pod-sitemapy) oraz zasoby statyczne
            if (!loc.endsWith('.xml') && !loc.match(/\.(jpg|jpeg|png|webp|gif|svg|pdf|css|js)$/i)) {
              urls.push(loc);
            }
          }
          if (urls.length >= 10) break;
        }
      }
    } catch {
      // Ignorujemy błędy pobierania sitemapy
    }
  }

  // Fallback: Jeśli sitemap dał mniej niż 5 adresów, pobierz linki z homepage
  if (urls.length < 5) {
    try {
      const res = await fetch(fallbackUrl, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(4000),
        cache: 'no-store'
      });
      if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);
        $('a[href]').each((_, el) => {
          const href = $(el).attr('href');
          if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
            try {
              const fullUrl = new URL(href, origin).toString();
              urls.push(fullUrl);
            } catch {
              // Błędny URL
            }
          }
        });
      }
    } catch {
      // Ignorujemy błędy
    }
  }

  return urls;
}

/**
 * Błyskawiczna analiza pojedynczej podstrony przez Cheerio
 */
async function analyzeSinglePage(
  url: string,
  origin: string
): Promise<{ page: PageAuditResult; tracking: PageTrackingSignals } | null> {
  const reqStart = performance.now();
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(3000),
      cache: 'no-store'
    });

    const responseTimeMs = Math.round(performance.now() - reqStart);
    const statusCode = res.status;
    const html = await res.text();
    const $ = cheerio.load(html);

    // --- TELEMETRYKA, KODY REKLAMOWE I ANALITYKA (Przed usunięciem skryptów) ---
    const rawHtml = html;
    const lowerHtml = rawHtml.toLowerCase();

    // 1. Google Ads
    let googleAdsId: string | undefined;
    const awMatch = rawHtml.match(/AW-[0-9]{7,12}/) || rawHtml.match(/AW-[A-Za-z0-9_-]+/);
    if (awMatch) googleAdsId = awMatch[0];
    const hasGoogleAds = !!googleAdsId || lowerHtml.includes('google_conversion_id') || lowerHtml.includes('googleadservices.com');

    // 2. Google Tag Manager
    let gtmId: string | undefined;
    const gtmMatch = rawHtml.match(/GTM-[A-Z0-9]{4,10}/);
    if (gtmMatch) gtmId = gtmMatch[0];
    const hasGtm = !!gtmId || lowerHtml.includes('googletagmanager.com/gtm.js');

    // 3. Google Analytics 4
    let ga4Id: string | undefined;
    const ga4Match = rawHtml.match(/G-[A-Z0-9]{6,12}/);
    if (ga4Match) ga4Id = ga4Match[0];
    const hasGa4 = !!ga4Id || lowerHtml.includes('google-analytics.com') || lowerHtml.includes('gtag/js?id=g-');

    // 4. Meta & TikTok Pixels
    const hasMetaPixel = lowerHtml.includes('connect.facebook.net') || lowerHtml.includes('fbq(') || lowerHtml.includes('_fbp');
    const hasTikTokPixel = lowerHtml.includes('analytics.tiktok.com') || lowerHtml.includes('ttq.load');

    // 5. Google Consent Mode v2 (Konieczny od marca 2024 w UE dla Google Ads)
    const hasConsentModeV2 = lowerHtml.includes('ad_storage') || lowerHtml.includes('ad_user_data') || lowerHtml.includes('ad_personalization') ||
      lowerHtml.includes('consent_default') || lowerHtml.includes('cookiebot') || lowerHtml.includes('cookieyes') ||
      lowerHtml.includes('onetrust') || lowerHtml.includes('termly') || lowerHtml.includes('complianz') || lowerHtml.includes('iubenda');

    // 6. dataLayer
    const hasDataLayer = lowerHtml.includes('datalayer') || lowerHtml.includes('datalayer.push');

    // 7. Zdarzenia koszykowe (add_to_cart / purchase)
    const hasAddToCartTracking = /add_to_cart|addtocart|'addtocart'|"addtocart"/i.test(rawHtml);
    const hasPurchaseTracking = /purchase|'purchase'|"purchase"/i.test(rawHtml);

    // 8. Przyciski koszyka w HTML (np. WooCommerce, PrestaShop, Shopify, Custom)
    const cartButtonsCount = $('button[name="add-to-cart"], .add_to_cart_button, .single_add_to_cart_button, [data-action="add-to-cart"], button[data-product_id], a.ajax_add_to_cart, .btn-add-to-cart, form.cart, [id*="add-to-cart"], [class*="add-to-cart"]').length;
    const buttonTexts = $('button, a.btn, a.button, input[type="submit"]').text().toLowerCase();
    const hasCartButtons = cartButtonsCount > 0 || buttonTexts.includes('dodaj do koszyka') || buttonTexts.includes('do koszyka') || buttonTexts.includes('add to cart');

    // 9. Formularze kontaktowe / zapytania ofertowe
    const hasLeadForms = $('form:not([role="search"])').length > 0;

    const trackingSignals: PageTrackingSignals = {
      hasGoogleAds,
      googleAdsId,
      hasGtm,
      gtmId,
      hasGa4,
      ga4Id,
      hasMetaPixel,
      hasTikTokPixel,
      hasConsentModeV2,
      hasDataLayer,
      hasAddToCartTracking,
      hasPurchaseTracking,
      hasCartButtons,
      hasLeadForms
    };

    // --- ANALIZA SEMANTYCZNA I STRUKTURALNA ---
    // Tytuł
    const title = $('title').first().text().trim();
    const titleLength = title.length;

    // Meta Description
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
    const metaLength = metaDescription.length;

    // Nagłówki H1
    const h1Elements = $('h1');
    const h1Count = h1Elements.length;
    const h1Text = h1Elements.first().text().trim().replace(/\s+/g, ' ');

    // Canonical
    const canonicalRaw = $('link[rel="canonical"]').attr('href') || null;
    const cleanCurrentUrl = url.split('?')[0].replace(/\/$/, '');
    const cleanCanonical = canonicalRaw ? canonicalRaw.split('?')[0].replace(/\/$/, '') : null;
    const hasSelfCanonical = cleanCanonical !== null && (cleanCanonical === cleanCurrentUrl || `${cleanCanonical}/` === `${cleanCurrentUrl}/`);

    // Liczba słów (Thin content check - usuwamy skrypty, style, nav, footer)
    $('script, style, nav, footer, noscript, svg').remove();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const words = bodyText.length > 0 ? bodyText.split(' ').filter(w => w.length > 1) : [];
    const wordCount = words.length;
    const isThinContent = wordCount < 200;

    // Obrazy
    const images = $('img');
    const imagesCount = images.length;
    let missingAltCount = 0;
    images.each((_, img) => {
      const alt = $(img).attr('alt');
      if (alt === undefined || alt === null || alt.trim() === '') {
        missingAltCount++;
      }
    });

    // Dane strukturalne (JSON-LD)
    const schemas: string[] = [];
    $('script[type="application/ld+json"]').each((_, script) => {
      try {
        const json = JSON.parse($(script).text());
        extractSchemaTypes(json, schemas);
      } catch {
        // Ignorujemy błędy parsowania JSON-LD
      }
    });

    // Robots / Noindex
    const robotsMeta = $('meta[name="robots"]').attr('content') || '';
    const hasNoIndex = robotsMeta.toLowerCase().includes('noindex');

    // Linki wewnętrzne i zewnętrzne
    let internalLinksCount = 0;
    let externalLinksCount = 0;
    const currentHost = new URL(origin).hostname;

    $('a[href]').each((_, a) => {
      const href = $(a).attr('href');
      if (!href) return;
      try {
        const linkUrl = new URL(href, origin);
        if (linkUrl.hostname === currentHost) {
          internalLinksCount++;
        } else {
          externalLinksCount++;
        }
      } catch {
        // Ignorujemy
      }
    });

    // Kategoryzacja URL
    const category = categorizeUrl(url, schemas, origin);

    return {
      page: {
        url,
        category,
        statusCode,
        responseTimeMs,
        title,
        titleLength,
        metaDescription,
        metaLength,
        h1Count,
        h1Text: h1Text || undefined,
        canonical: canonicalRaw,
        hasSelfCanonical,
        wordCount,
        isThinContent,
        imagesCount,
        missingAltCount,
        schemas: Array.from(new Set(schemas)),
        hasNoIndex,
        internalLinksCount,
        externalLinksCount
      },
      tracking: trackingSignals
    };
  } catch {
    // W przypadku błędu połączenia z podstroną
    return {
      page: {
        url,
        category: 'info',
        statusCode: 504,
        responseTimeMs: Math.round(performance.now() - reqStart),
        title: '',
        titleLength: 0,
        metaDescription: '',
        metaLength: 0,
        h1Count: 0,
        canonical: null,
        hasSelfCanonical: false,
        wordCount: 0,
        isThinContent: true,
        imagesCount: 0,
        missingAltCount: 0,
        schemas: [],
        hasNoIndex: false,
        internalLinksCount: 0,
        externalLinksCount: 0
      },
      tracking: {
        hasGoogleAds: false,
        hasGtm: false,
        hasGa4: false,
        hasMetaPixel: false,
        hasTikTokPixel: false,
        hasConsentModeV2: false,
        hasDataLayer: false,
        hasAddToCartTracking: false,
        hasPurchaseTracking: false,
        hasCartButtons: false,
        hasLeadForms: false
      }
    };
  }
}

/**
 * Automatyczna kategoryzacja URL-i
 */
function categorizeUrl(url: string, schemas: string[], origin: string): 'home' | 'product' | 'blog' | 'shop' | 'info' {
  const pathname = url.replace(origin, '').toLowerCase();
  
  if (pathname === '' || pathname === '/' || pathname === '/index.html' || pathname === '/index.php') {
    return 'home';
  }
  if (pathname.includes('/produkt/') || pathname.includes('/product/') || pathname.includes('/item/') || schemas.includes('Product')) {
    return 'product';
  }
  if (pathname.includes('/blog') || pathname.includes('/artykul/') || pathname.includes('/wpis/') || pathname.includes('/post/') || schemas.includes('Article') || schemas.includes('BlogPosting')) {
    return 'blog';
  }
  if (pathname.includes('/sklep') || pathname.includes('/kategoria/') || pathname.includes('/category/') || pathname.includes('/shop') || pathname.includes('/c/')) {
    return 'shop';
  }
  return 'info';
}

/**
 * Rekurencyjne wyciąganie typów Schema z JSON-LD
 */
function extractSchemaTypes(obj: unknown, results: string[]): void {
  if (!obj || typeof obj !== 'object') return;
  
  if (Array.isArray(obj)) {
    for (const item of obj) extractSchemaTypes(item, results);
    return;
  }

  const record = obj as Record<string, unknown>;
  if (record['@type']) {
    if (typeof record['@type'] === 'string') {
      results.push(record['@type']);
    } else if (Array.isArray(record['@type'])) {
      for (const t of record['@type']) {
        if (typeof t === 'string') results.push(t);
      }
    }
  }

  if (record['@graph'] && Array.isArray(record['@graph'])) {
    for (const item of record['@graph']) extractSchemaTypes(item, results);
  }
}

/**
 * Agregacja wyników w zwięzłe twarde dowody (Evidence Summary) wraz z analityką reklamową
 */
export function buildEvidenceSummary(
  pages: PageAuditResult[],
  signals: PageTrackingSignals[] = []
): EvidenceSummary {
  const totalPages = pages.length;

  // 1. Analiza telemetryki i kampanii reklamowych
  const hasGoogleAds = signals.some(s => s.hasGoogleAds);
  const googleAdsId = signals.find(s => s.googleAdsId)?.googleAdsId;
  const hasGoogleTagManager = signals.some(s => s.hasGtm);
  const gtmId = signals.find(s => s.gtmId)?.gtmId;
  const hasGA4 = signals.some(s => s.hasGa4);
  const ga4Id = signals.find(s => s.ga4Id)?.ga4Id;
  const hasMetaPixel = signals.some(s => s.hasMetaPixel);
  const hasTikTokPixel = signals.some(s => s.hasTikTokPixel);
  const hasConsentModeV2 = signals.some(s => s.hasConsentModeV2);
  const hasDataLayer = signals.some(s => s.hasDataLayer);
  const hasAddToCartTracking = signals.some(s => s.hasAddToCartTracking);
  const hasPurchaseTracking = signals.some(s => s.hasPurchaseTracking);
  const hasCartButtons = signals.some(s => s.hasCartButtons);
  const hasLeadForms = signals.some(s => s.hasLeadForms);

  const trackingIssues: TrackingIssue[] = [];

  // Scenariusz 1: Płatne reklamy + przycisk koszyka bez zdarzenia add_to_cart (Kazus tropilapka.pl)
  if ((hasGoogleAds || hasMetaPixel || hasTikTokPixel || hasGoogleTagManager) && hasCartButtons && !hasAddToCartTracking) {
    trackingIssues.push({
      id: 'leak-add-to-cart',
      title: 'Krytyczny wyciek budżetu reklamowego: brak zdarzenia add_to_cart',
      severity: 'critical',
      description: 'Wykryto kody śledzące płatnych kampanii, ale mechanizm koszyka nie wysyła zdarzenia add_to_cart do dataLayer ani pikseli reklamowych.',
      impact: 'Algorytmy Google Ads (Smart Bidding) i Meta Ads nie wiedzą, którzy użytkownicy realnie chcą kupić. Budżet jest przepalany na przypadkowe kliknięcia, a koszt pozyskania klienta (CAC) rośnie o 40-60%.',
      developerSolution: 'Marcin wdroży w kodzie frontendu bezpośrednie wywołanie window.dataLayer.push({ event: "add_to_cart", ecommerce: { items: [...] } }) podpięte pod akcję koszyka w 24h, co natychmiast uzbroi kampanie w realne dane zakupowe.'
    });
  }

  // Scenariusz 2: Brak Google Consent Mode v2 (Zablokowany remarketing w UE)
  if ((hasGoogleAds || hasGA4) && !hasConsentModeV2) {
    trackingIssues.push({
      id: 'leak-consent-mode-v2',
      title: 'Brak Google Consent Mode v2 (Zablokowany remarketing w UE)',
      severity: 'critical',
      description: 'Brak wymaganych od marca 2024 przez Google parametrów ad_storage, ad_user_data i ad_personalization.',
      impact: 'Google Ads blokuje odświeżanie list remarketingowych w UE, a kampanie Performance Max tracą modelowanie utraconych konwersji.',
      developerSolution: 'Marcin skonfiguruje pełny standard Consent Mode v2 zintegrowany z banerem cookies i GTM zgodnie z wymogami Google i IAB TCF 2.2.'
    });
  }

  // Scenariusz 3: GTM bez ustandaryzowanego dataLayer
  if (hasGoogleTagManager && !hasDataLayer) {
    trackingIssues.push({
      id: 'leak-datalayer-missing',
      title: 'Google Tag Manager bez warstwy danych dataLayer',
      severity: 'warning',
      description: 'Zainstalowano GTM, ale aplikacja nie udostępnia uporządkowanego obiektu dataLayer.',
      impact: 'Tagi analityczne opierają się na niestabilnych selektorach HTML w DOM, które psują się przy drobnych zmianach wizualnych w sklepie.',
      developerSolution: 'Marcin wdroży natywną warstwę window.dataLayer z pełnym schematem GA4 e-commerce.'
    });
  }

  // Scenariusz 4: Brak śledzenia konwersji leada przy płatnych reklamach (serwisy usługowe)
  if ((hasGoogleAds || hasMetaPixel) && hasLeadForms && !hasDataLayer && !hasCartButtons) {
    trackingIssues.push({
      id: 'leak-lead-conversion',
      title: 'Płatne reklamy bez precyzyjnego śledzenia zapytań ofertowych',
      severity: 'critical',
      description: 'Wykryto formularze kontaktowe i kody reklam, ale brak dedykowanego zdarzenia generate_lead po udanej wysyłce.',
      impact: 'Google Ads optymalizuje kampanie pod zwykłe wejścia na stronę zamiast pod wysłane zapytania ofertowe.',
      developerSolution: 'Marcin podepnie dedykowane zdarzenie konwersji pod mechanizm wysyłki formularza (AJAX/Promise).'
    });
  }

  let adBudgetLeakRisk: 'none' | 'low' | 'medium' | 'critical' = 'none';
  if (trackingIssues.some(i => i.severity === 'critical')) {
    adBudgetLeakRisk = 'critical';
  } else if (trackingIssues.some(i => i.severity === 'warning')) {
    adBudgetLeakRisk = 'medium';
  } else if (hasGoogleAds || hasMetaPixel) {
    adBudgetLeakRisk = 'low';
  }

  const adsAndTracking: AdsAndTrackingAudit = {
    hasGoogleAds,
    googleAdsId,
    hasGoogleTagManager,
    gtmId,
    hasGA4,
    ga4Id,
    hasMetaPixel,
    hasTikTokPixel,
    hasConsentModeV2,
    hasDataLayer,
    hasAddToCartTracking,
    hasPurchaseTracking,
    adBudgetLeakRisk,
    issues: trackingIssues
  };

  if (totalPages === 0) {
    return {
      totalPages: 0,
      avgResponseTimeMs: 0,
      status200Count: 0,
      redirectsCount: 0,
      errorsCount: 0,
      noIndexCount: 0,
      missingTitleCount: 0,
      duplicateTitleGroups: [],
      missingMetaCount: 0,
      avgMetaLength: 0,
      missingH1Count: 0,
      missingH1Urls: [],
      thinContentCount: 0,
      thinContentUrls: [],
      missingCanonicalCount: 0,
      missingCanonicalUrls: [],
      missingAltTotal: 0,
      adsAndTracking,
      categoriesSummary: {
        overall: { goodCount: 0, warnCount: 0, badCount: 0 }
      }
    };
  }

  let totalResponseTime = 0;
  let status200 = 0;
  let redirects = 0;
  let errors = 0;
  let noIndex = 0;
  let missingTitle = 0;
  let missingMeta = 0;
  let totalMetaLength = 0;
  let missingH1 = 0;
  const missingH1Urls: string[] = [];
  let thinContent = 0;
  const thinContentUrls: { url: string; wordCount: number }[] = [];
  let missingCanonical = 0;
  const missingCanonicalUrls: string[] = [];
  let missingAltTotal = 0;

  // Mapa do wykrywania duplikatów tytułów
  const titleMap = new Map<string, string[]>();

  // Podziały kategorii
  const productPages: PageAuditResult[] = [];
  const blogPages: PageAuditResult[] = [];

  for (const p of pages) {
    totalResponseTime += p.responseTimeMs;
    if (p.statusCode === 200) status200++;
    else if (p.statusCode >= 300 && p.statusCode < 400) redirects++;
    else errors++;

    if (p.hasNoIndex) noIndex++;

    if (!p.title || p.title.trim() === '') {
      missingTitle++;
    } else {
      const existing = titleMap.get(p.title) || [];
      existing.push(p.url);
      titleMap.set(p.title, existing);
    }

    if (!p.metaDescription || p.metaDescription.trim() === '') {
      missingMeta++;
    } else {
      totalMetaLength += p.metaLength;
    }

    if (p.h1Count === 0) {
      missingH1++;
      missingH1Urls.push(p.url);
    }

    if (p.isThinContent) {
      thinContent++;
      thinContentUrls.push({ url: p.url, wordCount: p.wordCount });
    }

    if (!p.canonical) {
      missingCanonical++;
      missingCanonicalUrls.push(p.url);
    }

    missingAltTotal += p.missingAltCount;

    if (p.category === 'product') productPages.push(p);
    if (p.category === 'blog') blogPages.push(p);
  }

  // Grupy zduplikowanych tytułów (tam gdzie więcej niż 1 URL)
  const duplicateTitleGroups: DuplicateTitleGroup[] = [];
  for (const [title, urls] of titleMap.entries()) {
    if (urls.length > 1) {
      duplicateTitleGroups.push({
        title,
        count: urls.length,
        urls
      });
    }
  }

  // Obliczenia per kategoria
  let productsStats: CategoryStats | undefined;
  if (productPages.length > 0) {
    const pMissingH1 = productPages.filter(p => p.h1Count === 0).length;
    const pMissingCanonical = productPages.filter(p => !p.canonical).length;
    const pMissingSchema = productPages.filter(p => !p.schemas.includes('Product')).length;
    const pMissingImages = productPages.filter(p => p.imagesCount === 0).length;

    let good = 0; let warn = 0; let bad = 0;
    if (pMissingH1 === 0) good++; else bad++;
    if (pMissingCanonical === 0) good++; else bad++;
    if (pMissingSchema === 0) good++; else warn++;
    if (pMissingImages === 0) good++; else warn++;

    productsStats = {
      count: productPages.length,
      missingH1: pMissingH1,
      missingCanonical: pMissingCanonical,
      missingSchema: pMissingSchema,
      missingImages: pMissingImages,
      goodCount: good,
      warnCount: warn,
      badCount: bad
    };
  }

  let blogStats: CategoryStats | undefined;
  if (blogPages.length > 0) {
    const bMissingH1 = blogPages.filter(p => p.h1Count === 0).length;
    const bMissingCanonical = blogPages.filter(p => !p.canonical).length;
    const bMissingSchema = blogPages.filter(p => !p.schemas.some(s => s.includes('Article') || s.includes('BlogPosting'))).length;
    const totalWords = blogPages.reduce((acc, curr) => acc + curr.wordCount, 0);
    const avgWordCount = Math.round(totalWords / blogPages.length);

    let good = 0; let warn = 0; let bad = 0;
    if (bMissingH1 === 0) good++; else bad++;
    if (bMissingCanonical === 0) good++; else bad++;
    if (bMissingSchema === 0) good++; else warn++;
    if (avgWordCount >= 500) good++; else warn++;

    blogStats = {
      count: blogPages.length,
      missingH1: bMissingH1,
      missingCanonical: bMissingCanonical,
      missingSchema: bMissingSchema,
      avgWordCount,
      goodCount: good,
      warnCount: warn,
      badCount: bad
    };
  }

  // Globalne podsumowanie stanu
  let overallGood = 0;
  let overallWarn = 0;
  let overallBad = 0;

  if (errors === 0) overallGood++; else overallBad++;
  if (missingTitle === 0) overallGood++; else overallBad++;
  if (duplicateTitleGroups.length === 0) overallGood++; else overallWarn++;
  if (missingMeta === 0) overallGood++; else overallWarn++;
  if (missingH1 === 0) overallGood++; else overallBad++;
  if (missingCanonical === 0) overallGood++; else overallBad++;
  if (thinContent === 0) overallGood++; else overallWarn++;
  if (missingAltTotal === 0) overallGood++; else overallWarn++;

  return {
    totalPages,
    avgResponseTimeMs: Math.round(totalResponseTime / totalPages),
    status200Count: status200,
    redirectsCount: redirects,
    errorsCount: errors,
    noIndexCount: noIndex,
    missingTitleCount: missingTitle,
    duplicateTitleGroups,
    missingMetaCount: missingMeta,
    avgMetaLength: (totalPages - missingMeta > 0) ? Math.round(totalMetaLength / (totalPages - missingMeta)) : 0,
    missingH1Count: missingH1,
    missingH1Urls,
    thinContentCount: thinContent,
    thinContentUrls,
    missingCanonicalCount: missingCanonical,
    missingCanonicalUrls,
    missingAltTotal,
    adsAndTracking,
    categoriesSummary: {
      products: productsStats,
      blog: blogStats,
      overall: {
        goodCount: overallGood,
        warnCount: overallWarn,
        badCount: overallBad
      }
    }
  };
}

/**
 * Generator szybkich błędów krytycznych (Top 3-4 wycieki zysku i budżetu reklamowego)
 */
export function generateQuickCriticalIssues(
  evidence: EvidenceSummary,
  codeSmells?: DetailedCodeSmells,
  siteType: 'ecommerce' | 'services' = 'services'
): QuickCriticalIssue[] {
  const issues: QuickCriticalIssue[] = [];
  const isEcommerce = siteType === 'ecommerce';

  // 1. Priorytet: Płatne kampanie i wyciek budżetu reklamowego (Kazus tropilapka)
  const criticalTracking = evidence.adsAndTracking.issues.find(i => i.severity === 'critical');
  if (criticalTracking) {
    const detailsList: { label?: string; sublabel?: string }[] = [];
    if (evidence.adsAndTracking.googleAdsId) detailsList.push({ label: `Google Ads ID: ${evidence.adsAndTracking.googleAdsId}` });
    if (evidence.adsAndTracking.gtmId) detailsList.push({ label: `Google Tag Manager: ${evidence.adsAndTracking.gtmId}` });
    if (evidence.adsAndTracking.ga4Id) detailsList.push({ label: `GA4 Measurement ID: ${evidence.adsAndTracking.ga4Id}` });
    if (evidence.adsAndTracking.hasMetaPixel) detailsList.push({ label: 'Wykryto Meta Pixel (Facebook Ads)' });
    detailsList.push({
      label: 'Zdarzenie koszykowe / konwersja',
      sublabel: evidence.adsAndTracking.hasAddToCartTracking ? 'Wykryto poprawnie' : 'BRAK zdarzenia w kodzie wtyczki/koszyka!'
    });

    issues.push({
      id: 'quick-tracking-leak',
      title: criticalTracking.title,
      type: 'tracking',
      severity: 'critical',
      shortDesc: criticalTracking.description,
      businessImpact: criticalTracking.impact,
      developerAction: criticalTracking.developerSolution,
      details: detailsList
    });
  }

  // 2. Priorytet: Auto-kanibalizacja tytułów Title
  if (evidence.duplicateTitleGroups.length > 0) {
    const totalAffected = evidence.duplicateTitleGroups.reduce((acc, g) => acc + g.count, 0);
    issues.push({
      id: 'quick-duplicate-titles',
      title: `Auto-kanibalizacja w Google: ${evidence.duplicateTitleGroups.length} grup identycznych tagów Title`,
      type: 'seo',
      severity: 'critical',
      shortDesc: `Aż ${totalAffected} podstron posiada identyczne tytuły, przez co konkurują ze sobą na te same frazy w wynikach wyszukiwania.`,
      affectedCount: totalAffected,
      businessImpact: isEcommerce
        ? 'Zamiast jednej silnej pozycji w TOP 3, Twoje produkty i kategorie rotują i zbijają się nawzajem, marnując bezpłatną sprzedaż z Google.'
        : 'Zamiast jednej silnej pozycji w TOP 3, Twoje podstrony rotują i zbijają się nawzajem, marnując bezpłatne zapytania ofertowe z Google.',
      developerAction: 'Marcin zaimplementuje dynamiczny szablon unikalnych tagów Title w warstwie CMS/kodu z automatycznym sufiksem wyróżniającym w 24h.',
      details: evidence.duplicateTitleGroups.slice(0, 4).map(g => ({
        label: `« ${g.title} » (${g.count} stron)`,
        sublabel: g.urls.slice(0, 2).join(', ') + (g.urls.length > 2 ? ` i ${g.urls.length - 2} więcej...` : '')
      }))
    });
  }

  // 3. Priorytet: Brakujące nagłówki semantyczne H1
  if (evidence.missingH1Count > 0) {
    issues.push({
      id: 'quick-missing-h1',
      title: `Brak nagłówków H1 na ${evidence.missingH1Count} podstronach`,
      type: 'seo',
      severity: 'warning',
      shortDesc: 'Strony nie posiadają głównego nagłówka semantycznego, który wskazuje robotom wyszukiwarek i modelom AI temat podstrony.',
      affectedCount: evidence.missingH1Count,
      businessImpact: 'Znacznie słabsza widoczność w Google na precyzyjne frazy z długiego ogona (long-tail) oraz gorsza interpretacja treści przez boty AI (SearchGPT, Gemini).',
      developerAction: 'Marcin wprowadzi automatyczny, semantyczny tag <h1> w strukturze widoków szablonu bez naruszania aktualnego designu serwisu.',
      details: evidence.missingH1Urls.slice(0, 5).map(u => ({ url: u }))
    });
  }

  // 4. Priorytet: Consent Mode v2 (jeśli nie był dodany wyżej) lub Canonical / Dług techniczny
  const consentIssue = evidence.adsAndTracking.issues.find(i => i.id === 'leak-consent-mode-v2');
  if (consentIssue && !issues.some(i => i.id === 'quick-tracking-leak')) {
    issues.push({
      id: 'quick-consent-mode',
      title: consentIssue.title,
      type: 'tracking',
      severity: 'critical',
      shortDesc: consentIssue.description,
      businessImpact: consentIssue.impact,
      developerAction: consentIssue.developerSolution
    });
  } else if (evidence.missingCanonicalCount > 0) {
    issues.push({
      id: 'quick-missing-canonical',
      title: `Brak tagów Canonical na ${evidence.missingCanonicalCount} podstronach`,
      type: 'seo',
      severity: 'warning',
      shortDesc: 'Strony nie informują wyszukiwarki o oficjalnym adresie kanonicznym, co grozi tworzeniem niekontrolowanych duplikatów.',
      affectedCount: evidence.missingCanonicalCount,
      businessImpact: 'Rozpraszanie autorytetu domeny PageRank i marnowanie budżetu indeksowania (Crawl Budget) Google.',
      developerAction: 'Marcin zaimplementuje samoodnoszący się tag <link rel="canonical"> w nagłówku witryny wyliczany na bieżąco z czystego URL.',
      details: evidence.missingCanonicalUrls.slice(0, 5).map(u => ({ url: u }))
    });
  } else if (codeSmells?.pageBuilders && codeSmells.pageBuilders.length > 0) {
    issues.push({
      id: 'quick-tech-debt',
      title: `Dług technologiczny: narzut kodu z ${codeSmells.pageBuilders.join(', ')}`,
      type: 'performance',
      severity: 'warning',
      shortDesc: `Strona generuje ${codeSmells.domElements} elementów DOM i posiada ${codeSmells.badScripts} skryptów blokujących renderowanie.`,
      businessImpact: 'Opóźnienia w interakcji na smartfonach (Core Web Vitals INP/LCP), co obniża konwersję i pozycję w wyszukiwarce mobilnej.',
      developerAction: 'Marcin przeprowadzi refaktoryzację zasobów krytycznych, odroczy ciężkie skrypty (defer/async) i przyspieszy ładowanie poniżej 1.5s.'
    });
  }

  return issues;
}

function normalizeUrl(url: string, origin: string): string {
  try {
    const u = new URL(url, origin);
    u.hash = '';
    return u.toString();
  } catch {
    return url;
  }
}

function isValidInternalUrl(urlStr: string, host: string): boolean {
  try {
    const u = new URL(urlStr);
    return u.hostname.toLowerCase() === host && !urlStr.match(/\.(jpg|jpeg|png|webp|gif|svg|pdf|css|js|xml|zip)$/i);
  } catch {
    return false;
  }
}
