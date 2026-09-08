import * as cheerio from 'cheerio';
import {
  PageAuditResult,
  EvidenceSummary,
  DuplicateTitleGroup,
  CategoryStats,
  AdsAndTrackingAudit,
  TrackingIssue,
  QuickCriticalIssue,
  DetailedCodeSmells,
  SiteType,
  SITE_TYPE_LABELS,
  ProfileSignals
} from '../types';

interface CrawlOptions {
  maxPages?: number;
  maxTimeMs?: number;
  concurrency?: number;
  siteType?: SiteType;
}

export interface PageTrackingSignals {
  hasGoogleAds: boolean;
  googleAdsId?: string;
  hasGtm: boolean;
  gtmId?: string;
  hasGa4: boolean;
  ga4Id?: string;
  hasMetaPixel: boolean;
  metaPixelId?: string;
  hasTikTokPixel: boolean;
  tikTokPixelId?: string;
  hasConsentModeV2: boolean;
  hasDataLayer: boolean;
  hasAddToCartTracking: boolean;
  hasPurchaseTracking: boolean;
  hasCartButtons: boolean;
  hasLeadForms: boolean;
  // Nowe sygnały wycieków finansowych:
  hasViewItemTracking?: boolean;
  hasProductSchema?: boolean;
  hasSalePrice?: boolean;
  hasOmnibusMention?: boolean;
  hasClickablePhone?: boolean;
  hasUnclickablePhone?: boolean;
  hasClickToCallTracking?: boolean;
  hasFormSpamProtection?: boolean;
  hasOpenGraph?: boolean;
  hasExpressPayments?: boolean;
  // Sygnały profilu (Profile Signals)
  hasBipLink?: boolean;
  hasDeklaracjaDostepnosci?: boolean;
  hasEdziennik?: boolean;
  hasDonationOrKrs?: boolean;
  hasLocalBusinessSignals?: boolean;
  hasB2bSignals?: boolean;
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
  
  // Ograniczamy do maxPages, upewniając się, że homepage jest na 1. miejscu i nie ma duplikatów z trailing slash
  const normalizedTarget = normalizeUrl(targetUrl, origin);
  const normalizedDiscovered = discoveredUrls.map(u => normalizeUrl(u, origin));
  const queue = Array.from(new Set([normalizedTarget, ...normalizedDiscovered]))
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

  // 3. Autodetekcja dokładnego profilu na podstawie twardych sygnałów zebranych stron
  const detected = detectAccurateSiteType(pages, signals, origin, options.siteType);

  // 4. Agregacja twardych dowodów (Evidence Engine) wraz z telemetryką
  const evidence = buildEvidenceSummary(pages, signals, detected.profile);

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
 * Ekstrakcja sygnałów telemetrycznych, pikseli i tagów reklamowych z kodu HTML
 */
export function extractTrackingSignals(rawHtml: string, $?: cheerio.CheerioAPI): PageTrackingSignals {
  const lowerHtml = rawHtml.toLowerCase();
  const cheerioInstance = $ || cheerio.load(rawHtml);

  // 1. Google Ads
  let googleAdsId: string | undefined;
  const awMatch = rawHtml.match(/AW-[0-9]{7,12}/) || rawHtml.match(/AW-[A-Za-z0-9_-]+/);
  if (awMatch) googleAdsId = awMatch[0];
  const hasGoogleAds = !!googleAdsId || lowerHtml.includes('google_conversion_id') || lowerHtml.includes('googleadservices.com');

  // 2. Google Tag Manager (specyficzny kontener GTM, nie mylić z gtag/js)
  let gtmId: string | undefined;
  const gtmMatch = rawHtml.match(/GTM-[A-Z0-9]{4,10}/);
  if (gtmMatch) gtmId = gtmMatch[0];
  const hasGtm = !!gtmId || lowerHtml.includes('googletagmanager.com/gtm.js');

  // 3. Google Analytics 4 & Google Tag (obsługuje standardowe G- oraz ujednolicone GT- np. z Google Site Kit)
  let ga4Id: string | undefined;
  const ga4Match = rawHtml.match(/G-[A-Z0-9]{6,12}/) || rawHtml.match(/GT-[A-Za-z0-9_-]{6,16}/);
  if (ga4Match) ga4Id = ga4Match[0];
  const hasGa4 = !!ga4Id || lowerHtml.includes('google-analytics.com') ||
    lowerHtml.includes('gtag/js?id=g-') || lowerHtml.includes('gtag/js?id=gt-') ||
    lowerHtml.includes('gtag("config", "gt-') || lowerHtml.includes("gtag('config', 'gt-") ||
    lowerHtml.includes('gtag("config", "g-') || lowerHtml.includes("gtag('config', 'g-");

  // 4. Meta Pixel (Facebook Ads) - standardowy snippet fbq(), wtyczki typu PixelYourSite, noscript fallback
  let metaPixelId: string | undefined;
  const metaMatch = rawHtml.match(/fbq\(\s*['"]init['"]\s*,\s*['"]([0-9]{10,20})['"]\)/i)
    || rawHtml.match(/facebook\.com\/tr\?id=([0-9]{10,20})/i)
    || rawHtml.match(/["']pixelIds["']\s*:\s*\[\s*["']([0-9]{10,20})["']/i)
    || rawHtml.match(/["']pixel_id["']\s*:\s*["']([0-9]{10,20})["']/i)
    || rawHtml.match(/["']fbPixelId["']\s*:\s*["']([0-9]{10,20})["']/i);
  if (metaMatch) metaPixelId = metaMatch[1];
  const hasMetaPixel = !!metaPixelId || lowerHtml.includes('connect.facebook.net') ||
    lowerHtml.includes('fbq(') || lowerHtml.includes('_fbp') ||
    lowerHtml.includes('facebook.com/tr') || lowerHtml.includes('pixelyoursite');

  // TikTok Pixel
  let tikTokPixelId: string | undefined;
  const tikTokMatch = rawHtml.match(/ttq\.load\(\s*['"]([A-Z0-9]{10,25})['"]\)/i);
  if (tikTokMatch) tikTokPixelId = tikTokMatch[1];
  const hasTikTokPixel = !!tikTokPixelId || lowerHtml.includes('analytics.tiktok.com') || lowerHtml.includes('ttq.load');

  // 5. Google Consent Mode v2 (Konieczny od marca 2024 w UE dla Google Ads)
  const hasConsentModeV2 = lowerHtml.includes('ad_storage') || lowerHtml.includes('ad_user_data') || lowerHtml.includes('ad_personalization') ||
    lowerHtml.includes('consent_default') || lowerHtml.includes('cookiebot') || lowerHtml.includes('cookieyes') ||
    lowerHtml.includes('onetrust') || lowerHtml.includes('termly') || lowerHtml.includes('complianz') || lowerHtml.includes('iubenda');

  // 6. dataLayer
  const hasDataLayer = lowerHtml.includes('datalayer') || lowerHtml.includes('datalayer.push');

  // 7. Zdarzenia koszykowe (add_to_cart / purchase)
  // Weryfikacja RZECZYWISTEJ emisji zdarzenia (dataLayer.push, gtag, fbq, ttq),
  // a nie samych klas CSS WordPressa (.add_to_cart_button) czy zwykłych słów w tekście.
  const hasAddToCartTracking =
    /(?:window\.)?dataLayer\.push\s*\(\s*\{[^}]*['"](?:event['"]\s*:\s*['"])?add_to_cart['"]/i.test(rawHtml) ||
    /(?:window\.)?gtag\s*\(\s*['"]event['"]\s*,\s*['"]add_to_cart['"]/i.test(rawHtml) ||
    /(?:window\.)?fbq\s*\(\s*['"]track['"]\s*,\s*['"]AddToCart['"]/i.test(rawHtml) ||
    /(?:window\.)?ttq\.track\s*\(\s*['"]AddToCart['"]/i.test(rawHtml) ||
    /['"]dynamicEvents['"]\s*:\s*\{[^}]*['"]AddToCart['"]/i.test(rawHtml) ||
    /gtm4wp\.addProductToCartEEC/i.test(rawHtml);

  const hasPurchaseTracking =
    /(?:window\.)?dataLayer\.push\s*\(\s*\{[^}]*['"](?:event['"]\s*:\s*['"])?purchase['"]/i.test(rawHtml) ||
    /(?:window\.)?gtag\s*\(\s*['"]event['"]\s*,\s*['"]purchase['"]/i.test(rawHtml) ||
    /(?:window\.)?fbq\s*\(\s*['"]track['"]\s*,\s*['"]Purchase['"]/i.test(rawHtml) ||
    /(?:window\.)?ttq\.track\s*\(\s*['"](?:CompletePayment|PlaceAnOrder)['"]/i.test(rawHtml) ||
    /['"]dynamicEvents['"]\s*:\s*\{[^}]*['"]Purchase['"]/i.test(rawHtml);

  // 8. Przyciski koszyka w HTML (np. WooCommerce, PrestaShop, Shopify, Custom)
  const cartButtonsCount = cheerioInstance('button[name="add-to-cart"], .add_to_cart_button, .single_add_to_cart_button, [data-action="add-to-cart"], button[data-product_id], a.ajax_add_to_cart, .btn-add-to-cart, form.cart, [id*="add-to-cart"], [class*="add-to-cart"]').length;
  const buttonTexts = cheerioInstance('button, a.btn, a.button, input[type="submit"]').text().toLowerCase();
  const hasCartButtons = cartButtonsCount > 0 || buttonTexts.includes('dodaj do koszyka') || buttonTexts.includes('do koszyka') || buttonTexts.includes('add to cart');

  // 9. Formularze kontaktowe / zapytania ofertowe
  const hasLeadForms = cheerioInstance('form:not([role="search"])').length > 0;

  // 10. Zdarzenie view_item / ViewContent (Dynamiczny Remarketing E-Commerce)
  const hasViewItemTracking =
    /(?:window\.)?dataLayer\.push\s*\(\s*\{[^}]*['"](?:event['"]\s*:\s*['"])?view_item['"]/i.test(rawHtml) ||
    /(?:window\.)?gtag\s*\(\s*['"]event['"]\s*,\s*['"]view_item['"]/i.test(rawHtml) ||
    /(?:window\.)?fbq\s*\(\s*['"]track['"]\s*,\s*['"]ViewContent['"]/i.test(rawHtml) ||
    /(?:window\.)?ttq\.track\s*\(\s*['"]ViewContent['"]/i.test(rawHtml) ||
    /['"]dynamicEvents['"]\s*:\s*\{[^}]*['"]ViewContent['"]/i.test(rawHtml) ||
    /gtm4wp\.changeDetailViewEEC/i.test(rawHtml);

  // 11. Dane strukturalne Schema.org Product
  const hasProductSchema =
    lowerHtml.includes('"@type":"product"') ||
    lowerHtml.includes('"@type": "product"') ||
    lowerHtml.includes('itemtype="https://schema.org/product"') ||
    lowerHtml.includes('itemtype="http://schema.org/product"');

  // 12. Dyrektywa Omnibus (Cena promocyjna vs najniższa cena z 30 dni)
  const hasSalePrice = cheerioInstance('del, .del, .sale-price, .special-price, .old-price, .was-price, .regular-price, ins').length > 0 ||
    /cena\s+regularna|przekre[sś]lona/i.test(rawHtml);
  const hasOmnibusMention = /najni[zż]sza\s+cena\s+z\s+(?:ostatnich\s+)?30\s+dni|omnibus|cena\s+sprzed\s+obni[zż]ki/i.test(rawHtml);

  // 13. Kontakt telefoniczny (klikalne linki tel: vs goły tekst)
  const hasClickablePhone = cheerioInstance('a[href^="tel:"]').length > 0;
  
  // Oczyszczamy tekst z NIP, REGON, KRS, kont bankowych, linii kodu i cen
  const clonedBody = cheerioInstance('body').clone();
  clonedBody.find('script, style, noscript, svg').remove();
  const rawBodyText = clonedBody.text();
  const sanitizedText = rawBodyText.replace(/(?:nip|regon|krs|konto|iban|linii|element[oó]w|rok|cena|zł|pln)\s*[:.]?\s*[\d\s-]+/gi, ' ');

  // Wykrywamy numer telefonu:
  // 1. Wyraźnie sformatowany 9-cyfrowy numer z separatorami (spacja/myślnik): np. 501 234 567 lub 501-234-567
  // 2. LUB numer poprzedzony słowem kluczowym (tel, telefon, kom, infolinia, zadzwoń, kontakt, call, phone)
  const phoneFormattedRegex = /\b(?:\+48[\s-]?)?(?:[1-9]\d{2}[\s-]\d{3}[\s-]\d{3}|[1-9]\d{1}[\s-]\d{3}[\s-]\d{2}[\s-]\d{2})\b/;
  const phoneKeywordRegex = /(?:tel(?:efon)?\.?|infolinia|kom(?:[oó]rka)?\.?|zadzwo[nń]|kontakt(?:uj)?|call|phone|mobile)\s*[:.]?\s*(?:\+48\s*)?(?:[1-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}|[1-9]\d{1}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2})\b/i;

  const hasPhoneInText = phoneFormattedRegex.test(sanitizedText) || phoneKeywordRegex.test(sanitizedText);
  const hasUnclickablePhone = hasPhoneInText && !hasClickablePhone;

  // 14. Śledzenie kliknięć w połączenie telefoniczne (click_to_call)
  const hasClickToCallTracking = hasClickablePhone && (
    lowerHtml.includes('click_to_call') || lowerHtml.includes('contact_call') ||
    lowerHtml.includes('tel_click') || lowerHtml.includes('phone_click') ||
    lowerHtml.includes('contact_phone') || lowerHtml.includes('lead_call')
  );

  // 15. Zabezpieczenie antyspamowe formularzy (Turnstile / reCAPTCHA / Honeypot)
  const hasFormSpamProtection = hasLeadForms && (
    lowerHtml.includes('turnstile') || lowerHtml.includes('recaptcha') ||
    lowerHtml.includes('hcaptcha') || lowerHtml.includes('honeypot') ||
    lowerHtml.includes('cf-turnstile') || lowerHtml.includes('g-recaptcha') ||
    lowerHtml.includes('wpcf7-form-control-wrap')
  );

  // 16. Open Graph dla social media (og:image)
  const hasOpenGraph = cheerioInstance('meta[property="og:image"], meta[name="og:image"]').length > 0;

  // 17. Szybkie płatności mobilne (BLIK, Apple Pay, Google Pay, BNPL)
  const hasExpressPayments = /blik|apple\s*pay|google\s*pay|paypo|klarna|twisto/i.test(rawHtml);

  // 18. Sygnały profilu: Urząd / Administracja publiczna (BIP, deklaracja dostępności)
  const hasBipLink = cheerioInstance('a[href*="bip."], a[href*="/bip"], [src*="bip."]').length > 0 ||
    lowerHtml.includes('biuletyn informacji publicznej') ||
    lowerHtml.includes('bip.gov.pl') ||
    /uchwa[łl]a\s+rady|zarz[ąa]dzenie\s+(?:burmistrza|prezydenta|w[óo]jta)|dziennik\s+ustaw/i.test(rawHtml);

  const hasDeklaracjaDostepnosci = cheerioInstance('a[href*="deklaracja-dostepnosci"], a[href*="deklaracjadostepnosci"], a[href*="dostepnosc"]').length > 0 ||
    lowerHtml.includes('deklaracja dostępności') || lowerHtml.includes('deklaracja dostepnosci') ||
    lowerHtml.includes('dostępność cyfrowa') || lowerHtml.includes('dostepnosc cyfrowa') ||
    lowerHtml.includes('wcag 2.1') || lowerHtml.includes('wcag 2.0');

  // 19. Sygnały profilu: Szkoła / Edukacja (Librus, Vulcan, e-dziennik)
  const hasEdziennik = cheerioInstance('a[href*="vulcan.net.pl"], a[href*="librus.pl"], a[href*="mobidziennik"], a[href*="uonetplus"]').length > 0 ||
    lowerHtml.includes('e-dziennik') || lowerHtml.includes('dziennik elektroniczny') ||
    lowerHtml.includes('rada pedagogiczna') || lowerHtml.includes('samorząd uczniowski') ||
    lowerHtml.includes('plan lekcji');

  // 20. Sygnały profilu: NGO / Fundacja / Stowarzyszenie (Siepomaga, 1.5%, KRS, darowizny)
  const hasDonationOrKrs = cheerioInstance('a[href*="siepomaga.pl"], a[href*="fanimani.pl"], a[href*="zrzutka.pl"], a[href*="pomagam.pl"]').length > 0 ||
    /krs\s*0{3,4}\d{6,7}/i.test(rawHtml) ||
    /1[,.]5\s*%\s*(?:podatku|krs)/i.test(rawHtml) ||
    lowerHtml.includes('działalność statutowa') || lowerHtml.includes('dzialalnosc statutowa') ||
    lowerHtml.includes('organizacja pożytku publicznego') ||
    (lowerHtml.includes('wolontariat') && (lowerHtml.includes('stowarzyszenie') || lowerHtml.includes('fundacja') || lowerHtml.includes('pomoc')));

  // 21. Sygnały profilu: Usługi Lokalne (Google Maps, Booksy, ZnanyLekarz, godziny otwarcia)
  const hasLocalBusinessSignals = cheerioInstance('a[href*="maps.google.com"], a[href*="google.com/maps"], a[href*="maps.app.goo.gl"], a[href*="booksy.com"], a[href*="znanylekarz.pl"]').length > 0 ||
    lowerHtml.includes('"@type":"localbusiness"') || lowerHtml.includes('"@type": "localbusiness"') ||
    lowerHtml.includes('"@type":"medicalbusiness"') || lowerHtml.includes('"@type":"dentist"') ||
    lowerHtml.includes('"@type":"restaurant"') || lowerHtml.includes('"@type":"beautysalon"') ||
    lowerHtml.includes('"@type":"autorepair"') ||
    /godziny\s+otwarcia|um[óo]w\s+wizyt[ęe]|dojazd\s+do\s+(?:nas|gabinetu|salonu)|cennik\s+us[łl]ug/i.test(rawHtml);

  // 22. Sygnały profilu: Usługi B2B / Korporacyjne (LinkedIn Tag, HubSpot, Salesforce, RFP)
  const hasB2bSignals = lowerHtml.includes('snap.licdn.com') || lowerHtml.includes('linkedin.com/insight') ||
    lowerHtml.includes('js.hs-scripts.com') || lowerHtml.includes('salesforce') ||
    lowerHtml.includes('"@type":"professionalservice"') || lowerHtml.includes('"@type": "professionalservice"') ||
    /oferta\s+dla\s+firm|zapytaj\s+o\s+wycen[ęe]|case\s+study|nasze\s+wdro[żz]enia|konsultacje\s+b2b/i.test(rawHtml);

  return {
    hasGoogleAds,
    googleAdsId,
    hasGtm,
    gtmId,
    hasGa4,
    ga4Id,
    hasMetaPixel,
    metaPixelId,
    hasTikTokPixel,
    tikTokPixelId,
    hasConsentModeV2,
    hasDataLayer,
    hasAddToCartTracking,
    hasPurchaseTracking,
    hasCartButtons,
    hasLeadForms,
    hasViewItemTracking,
    hasProductSchema,
    hasSalePrice,
    hasOmnibusMention,
    hasClickablePhone,
    hasUnclickablePhone,
    hasClickToCallTracking,
    hasFormSpamProtection,
    hasOpenGraph,
    hasExpressPayments,
    hasBipLink,
    hasDeklaracjaDostepnosci,
    hasEdziennik,
    hasDonationOrKrs,
    hasLocalBusinessSignals,
    hasB2bSignals
  };
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
    const trackingSignals = extractTrackingSignals(html, $);

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

    // Dane strukturalne (JSON-LD) - wyciągamy PRZED usunięciem skryptów z Cheerio!
    // Szukamy globalnie w całym dokumencie ($('script[type="application/ld+json"]')),
    // co poprawnie obsługuje Server Components i metadane Next.js App Router (wstrzykiwane w head i body).
    const schemas: string[] = [];
    $('script[type="application/ld+json"]').each((_, script) => {
      try {
        const json = JSON.parse($(script).text());
        extractSchemaTypes(json, schemas);
      } catch {
        // Ignorujemy błędy parsowania JSON-LD
      }
    });

    // Heurystyka stron narzędziowych, kalkulatorów i interfejsowych (Thin content contextualization)
    let urlPathname = '';
    try {
      urlPathname = new URL(url).pathname.toLowerCase();
    } catch {
      urlPathname = url.toLowerCase();
    }
    const isFunctionalPath = /^\/(?:narzedzia|narzędzia|kalkulator|generator|apteczka|kontakt|kontakt-.*|pliki|pliki-do-pobrania|logowanie|login|rejestracja|register|koszyk|cart|checkout|zamowienie|pomoc|formularz|deklaracja-dostepnosci|polityka-prywatnosci|regulamin)(?:\/|$|\?)/i.test(urlPathname);

    // Wykrywanie interaktywnego DOM przed usunięciem kontrolek
    const interactiveElementsCount = $('form, button, canvas, input, select, textarea, [data-interactive], [role="button"]').length;
    const hasInteractiveDOM = interactiveElementsCount >= 2;
    const isFunctionalPage = isFunctionalPath || hasInteractiveDOM;

    // Obrazy (przed usunięciem z DOM)
    const images = $('img');
    const imagesCount = images.length;
    let missingAltCount = 0;
    images.each((_, img) => {
      const alt = $(img).attr('alt');
      if (alt === undefined || alt === null || alt.trim() === '') {
        missingAltCount++;
      }
    });

    // Robots / Noindex
    const robotsMeta = $('meta[name="robots"]').attr('content') || '';
    const hasNoIndex = robotsMeta.toLowerCase().includes('noindex');

    // Linki wewnętrzne i zewnętrzne (przed usunięciem)
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

    // Liczba słów (Thin content check - usuwamy skrypty, style, nav, footer, noscript, svg)
    $('script, style, nav, footer, noscript, svg').remove();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const words = bodyText.length > 0 ? bodyText.split(' ').filter(w => w.length > 1) : [];
    const wordCount = words.length;
    const isThinContent = !isFunctionalPage && wordCount < 200;

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
        isFunctionalPage,
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
        isFunctionalPage: false,
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
 * 3-poziomowy silnik precyzyjnej detekcji profilu witryny (HTML / DOM / TLD / Słowa kluczowe)
 */
export function detectAccurateSiteType(
  pages: PageAuditResult[],
  signals: PageTrackingSignals[],
  origin: string,
  userHint?: SiteType
): { profile: SiteType; label: string; confidence: number } {
  const lowerOrigin = origin.toLowerCase();

  let govScore = 0;
  let eduScore = 0;
  let ngoScore = 0;
  let ecomScore = 0;
  let b2bScore = 0;
  let localScore = 0;

  // 1. TLD i struktura domeny
  if (lowerOrigin.includes('.gov.pl') || lowerOrigin.includes('.bip.')) govScore += 120;
  if (lowerOrigin.includes('.edu.pl') || lowerOrigin.includes('.edu')) eduScore += 120;
  if (lowerOrigin.includes('.org.pl') || lowerOrigin.includes('.ngo')) ngoScore += 40;

  if (/\b(?:urzad|gmina|powiat|starostwo|miasto|ug-|um-)\b/i.test(lowerOrigin) || lowerOrigin.includes('/bip')) govScore += 45;
  if (/\b(?:szkola|liceum|technikum|uniwersytet|przedszkole|sp\d|lo\d|zespol-szkol)\b/i.test(lowerOrigin)) eduScore += 45;
  if (/\b(?:stowarzyszenie|fundacja|pomoc|zbiorka|ngo|krs)\b/i.test(lowerOrigin)) ngoScore += 45;
  if (/\b(?:sklep|shop|store|butik)\b/i.test(lowerOrigin)) ecomScore += 35;

  // 2. Twarde sygnały telemetryczne z podstron
  const hasBipLink = signals.some(s => s.hasBipLink);
  const hasDeklaracja = signals.some(s => s.hasDeklaracjaDostepnosci);
  const hasEdziennik = signals.some(s => s.hasEdziennik);
  const hasDonation = signals.some(s => s.hasDonationOrKrs);
  const hasLocal = signals.some(s => s.hasLocalBusinessSignals);
  const hasB2b = signals.some(s => s.hasB2bSignals);

  if (hasBipLink) govScore += 60;
  if (hasDeklaracja) {
    govScore += 30;
    eduScore += 30;
  }
  if (hasEdziennik) eduScore += 70;
  if (hasDonation) ngoScore += 60;
  if (hasLocal) localScore += 50;
  if (hasB2b) b2bScore += 45;

  // E-commerce sygnały koszykowe
  const hasAddToCart = signals.some(s => s.hasAddToCartTracking || s.hasPurchaseTracking);
  const hasCartButtons = signals.some(s => s.hasCartButtons);
  const hasProductSchema = signals.some(s => s.hasProductSchema || s.hasSalePrice || s.hasOmnibusMention);
  const hasProductUrls = pages.some(p => p.category === 'product' || p.url.includes('/produkt/') || p.url.includes('/sklep/'));

  if (hasAddToCart) ecomScore += 80;
  if (hasCartButtons) ecomScore += 45;
  if (hasProductSchema) ecomScore += 35;
  if (hasProductUrls) ecomScore += 35;

  // 3. Analiza treści, nagłówków H1 i tytułów podstron
  for (const page of pages) {
    const title = (page.title || '').toLowerCase();
    const h1 = (page.h1Text || '').toLowerCase();
    const combined = `${title} ${h1}`;

    if (/biuletyn\s+informacji\s+publicznej|bip|uchwa[łl]a\s+rady|zarz[ąa]dzenie|sesja\s+rady/i.test(combined)) govScore += 25;
    if (/szko[łl]a\s+podstawowa|liceum|technikum|plan\s+lekcji|rekrutacja\s+do\s+szko[łl]y/i.test(combined)) eduScore += 25;
    if (/stowarzyszenie|fundacja|wolontariat|podopieczn|darczy[ńn]c|1[,.]5\s*%/i.test(combined)) ngoScore += 25;
    if (/koszyk|kasa|zam[óo]wienie|sklep\s+online/i.test(combined)) ecomScore += 25;
    if (/um[óo]w\s+wizyt[ęe]|godziny\s+otwarcia|cennik|dojazd|gabinet|salon|warsztat/i.test(combined)) localScore += 20;
    if (/oferta\s+b2b|wdro[żz]enia|dla\s+firm|case\s+study|konsultacje|zapytaj\s+o\s+wycen[ęe]/i.test(combined)) b2bScore += 20;
  }

  // Wpływ userHint
  if (userHint === 'ecommerce') ecomScore += 35;
  else if (userHint === 'gov_public') govScore += 40;
  else if (userHint === 'education') eduScore += 40;
  else if (userHint === 'ngo_foundation') ngoScore += 40;
  else if (userHint === 'local_services') localScore += 40;
  else if (userHint === 'b2b_services') b2bScore += 40;

  const scores: { profile: SiteType; score: number }[] = [
    { profile: 'gov_public', score: govScore },
    { profile: 'education', score: eduScore },
    { profile: 'ngo_foundation', score: ngoScore },
    { profile: 'ecommerce', score: ecomScore },
    { profile: 'local_services', score: localScore },
    { profile: 'b2b_services', score: b2bScore }
  ];

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];

  let finalProfile: SiteType = 'b2b_services';
  if (best.score >= 30) {
    finalProfile = best.profile;
  } else if (userHint && userHint !== 'services') {
    finalProfile = userHint;
  } else if (localScore > b2bScore) {
    finalProfile = 'local_services';
  } else {
    finalProfile = 'b2b_services';
  }

  return {
    profile: finalProfile,
    label: SITE_TYPE_LABELS[finalProfile] || 'Usługi B2B & Doradztwo',
    confidence: best.score
  };
}

/**
 * Agregacja wyników w zwięzłe twarde dowody (Evidence Summary) wraz z analityką reklamową
 */
export function buildEvidenceSummary(
  pages: PageAuditResult[],
  signals: PageTrackingSignals[] = [],
  siteType: SiteType = 'services'
): EvidenceSummary {
  const isEcommerce = siteType === 'ecommerce';
  const isPublicOrNgo = siteType === 'gov_public' || siteType === 'education' || siteType === 'ngo_foundation';
  const totalPages = pages.length;

  // Sygnały profilu
  const profileSignals: ProfileSignals = {
    hasBipLink: signals.some(s => s.hasBipLink),
    hasDeklaracjaDostepnosci: signals.some(s => s.hasDeklaracjaDostepnosci),
    hasEdziennik: signals.some(s => s.hasEdziennik),
    hasDonationOrKrs: signals.some(s => s.hasDonationOrKrs),
    hasLocalBusinessSignals: signals.some(s => s.hasLocalBusinessSignals),
    hasB2bSignals: signals.some(s => s.hasB2bSignals)
  };

  // 1. Analiza telemetryki i kampanii reklamowych
  const hasGoogleAds = signals.some(s => s.hasGoogleAds);
  const googleAdsId = signals.find(s => s.googleAdsId)?.googleAdsId;
  const hasGoogleTagManager = signals.some(s => s.hasGtm);
  const gtmId = signals.find(s => s.gtmId)?.gtmId;
  const hasGA4 = signals.some(s => s.hasGa4);
  const ga4Id = signals.find(s => s.ga4Id)?.ga4Id;
  const hasMetaPixel = signals.some(s => s.hasMetaPixel);
  const metaPixelId = signals.find(s => s.metaPixelId)?.metaPixelId;
  const hasTikTokPixel = signals.some(s => s.hasTikTokPixel);
  const tikTokPixelId = signals.find(s => s.tikTokPixelId)?.tikTokPixelId;
  const hasConsentModeV2 = signals.some(s => s.hasConsentModeV2);
  const hasDataLayer = signals.some(s => s.hasDataLayer);
  const hasAddToCartTracking = signals.some(s => s.hasAddToCartTracking);
  const hasPurchaseTracking = signals.some(s => s.hasPurchaseTracking);
  const hasCartButtons = isEcommerce || signals.some(s => s.hasCartButtons);
  const hasLeadForms = signals.some(s => s.hasLeadForms);

  // Nowe sygnały wycieków finansowych
  const hasViewItemTracking = signals.some(s => s.hasViewItemTracking);
  const hasProductSchema = signals.some(s => s.hasProductSchema);
  const hasSalePrice = signals.some(s => s.hasSalePrice);
  const hasOmnibusMention = signals.some(s => s.hasOmnibusMention);
  const hasClickableContacts = signals.some(s => s.hasClickablePhone);
  const hasUnclickablePhone = signals.some(s => s.hasUnclickablePhone);
  const hasClickToCallTracking = signals.some(s => s.hasClickToCallTracking);
  const hasFormSpamProtection = signals.some(s => s.hasFormSpamProtection);
  const hasOpenGraph = signals.some(s => s.hasOpenGraph);
  const hasExpressPayments = signals.some(s => s.hasExpressPayments);

  const hasProductPages = isEcommerce || pages.some(p => p.category === 'product' || p.url.includes('/produkt/') || p.url.includes('/product/'));
  const hasOmnibusCompliance = hasSalePrice ? hasOmnibusMention : true;

  // Wykrywanie wariantów zwracających błędy (504 timeout / bardzo wolne > 2.5s)
  const variantTimeoutUrls = pages
    .filter(p => (p.url.includes('attribute_') || p.url.includes('?')) && (p.statusCode >= 500 || p.responseTimeMs >= 2500))
    .map(p => p.url);

  const trackingIssues: TrackingIssue[] = [];

  // Scenariusz 1: Płatne reklamy + profil sklepu / przycisk koszyka bez zdarzenia add_to_cart (Kazus tropilapka.pl)
  if ((hasGoogleAds || hasMetaPixel || hasTikTokPixel || hasGoogleTagManager || hasGA4) && hasCartButtons && !hasAddToCartTracking) {
    trackingIssues.push({
      id: 'leak-add-to-cart',
      title: 'Krytyczny wyciek budżetu reklamowego: brak zdarzenia add_to_cart',
      severity: 'critical',
      description: 'Wykryto kody śledzące płatnych kampanii, ale mechanizm koszyka nie wysyła zdarzenia add_to_cart do dataLayer ani pikseli reklamowych.',
      impact: 'Algorytmy Google Ads (Smart Bidding) i Meta Ads nie wiedzą, którzy użytkownicy realnie chcą kupić. Budżet jest przepalany na przypadkowe kliknięcia, a koszt pozyskania klienta (CAC) rośnie o 40-60%.',
      developerSolution: 'Wdrożę w kodzie frontendu bezpośrednie wywołanie window.dataLayer.push({ event: "add_to_cart", ecommerce: { items: [...] } }) podpięte pod akcję koszyka w 24h, co natychmiast uzbroi kampanie w realne dane zakupowe.'
    });
  }

  // Scenariusz 2: Brak Google Consent Mode v2 (Zablokowany remarketing w UE - tylko gdy są aktywne reklamy Google Ads)
  if (!isPublicOrNgo && hasGoogleAds && !hasConsentModeV2) {
    trackingIssues.push({
      id: 'leak-consent-mode-v2',
      title: 'Brak Google Consent Mode v2 (Zablokowany remarketing w UE)',
      severity: 'critical',
      description: 'Brak wymaganych od marca 2024 przez Google parametrów ad_storage, ad_user_data i ad_personalization.',
      impact: 'Google Ads blokuje odświeżanie list remarketingowych w UE, a kampanie Performance Max tracą modelowanie utraconych konwersji.',
      developerSolution: 'Skonfiguruję pełny standard Consent Mode v2 zintegrowany z banerem cookies i GTM zgodnie z wymogami Google i IAB TCF 2.2.'
    });
  } else if (!isPublicOrNgo && hasGA4 && !hasConsentModeV2 && !hasGoogleAds) {
    trackingIssues.push({
      id: 'leak-consent-mode-v2',
      title: 'Zalecenie RODO: brak integracji banera zgód Consent Mode v2 z GA4',
      severity: 'info',
      description: 'Serwis korzysta ze statystyk Google Analytics 4 bez zintegrowanego banera zgód użytkowników.',
      impact: 'Dobre praktyki ePrivacy i RODO w UE zalecają rejestrowanie statusu zgody analytics_storage.',
      developerSolution: 'Wdrożę lekki baner cookies zgodny z RODO i przesyłający parametry zgód w 24h.'
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
      developerSolution: isEcommerce
        ? 'Wdrożę natywną warstwę window.dataLayer z pełnym schematem GA4 e-commerce.'
        : 'Wdrożę uporządkowaną warstwę window.dataLayer ze schematem zdarzeń biznesowych (lead_generate, form_submit).'
    });
  }

  // Scenariusz 4: Brak śledzenia konwersji leada przy płatnych reklamach (serwisy usługowe)
  if ((hasGoogleAds || hasMetaPixel) && hasLeadForms && !hasDataLayer && !isEcommerce) {
    trackingIssues.push({
      id: 'leak-lead-conversion',
      title: 'Płatne reklamy bez precyzyjnego śledzenia zapytań ofertowych',
      severity: 'critical',
      description: 'Wykryto formularze kontaktowe i kody reklam, ale brak dedykowanego zdarzenia generate_lead po udanej wysyłce.',
      impact: 'Google Ads optymalizuje kampanie pod zwykłe wejścia na stronę zamiast pod wysłane zapytania ofertowe.',
      developerSolution: 'Podepnę dedykowane zdarzenie konwersji pod mechanizm wysyłki formularza (AJAX/Promise).'
    });
  }

  // Scenariusz 5: E-commerce / Strona produktu z pikselami/GA4, ale bez zdarzenia view_item / ViewContent (Paraliż Dynamicznego Remarketingu)
  if ((hasGoogleAds || hasMetaPixel || hasTikTokPixel || hasGA4) && hasProductPages && !hasViewItemTracking) {
    trackingIssues.push({
      id: 'leak-view-item',
      title: 'Paraliż Dynamicznego Remarketingu: brak zdarzenia view_item / ViewContent',
      severity: 'critical',
      description: 'Wykryto kody śledzące płatnych kampanii, ale karty produktów nie wysyłają zdarzenia view_item (GA4) ani ViewContent (Meta Pixel) z ID i ceną produktu.',
      impact: 'Dynamiczne reklamy produktowe (Meta DPA) oraz kampanie Google Performance Max nie wiedzą, co dokładnie oglądał użytkownik. Zamiast spersonalizowanej oferty oglądanego produktu, klient widzi przypadkowe banery, co obniża konwersję powracających o 35-50%.',
      developerSolution: 'Wdrożę w szablonie produktu automatyczny dispatch zdarzeń view_item oraz ViewContent ze zmiennymi id, price i currency w 24h.'
    });
  }

  // Scenariusz 6: Wyciek z wariantów produktów (504 Gateway Timeout / >2.5s) - kazus Tropiłapka
  if (variantTimeoutUrls.length > 0) {
    trackingIssues.push({
      id: 'leak-variant-slow-or-timeout',
      title: `Krytyczny wyciek budżetu z reklam wariantów: błędy ${variantTimeoutUrls.length} podstron (504 / >2.5s)`,
      severity: 'critical',
      description: `Podstrony z wariantami produktów zwracają błąd 504 Gateway Timeout lub ładują się powyżej 2.5 sekundy (dotyczy m.in. ${variantTimeoutUrls[0]}).`,
      impact: 'Gdy użytkownik klika w reklamę produktową z wybranym rozmiarem/kolorem z Google Shopping lub Meta Ads, widzi biały ekran błędu. 100% budżetu wydanego na to kliknięcie zostaje bezpowrotnie przepalone, a klient natychmiast kupuje u konkurencji.',
      developerSolution: 'Zoptymalizuję zapytania SQL wariantów w bazie, usunę wąskie gardła w szablonie i wdrożę object caching (Redis) w 24–48h, obniżając czas odpowiedzi poniżej 300ms.'
    });
  }

  // Scenariusz 7: Brak dyrektywy Omnibus przy cenach promocyjnych
  if (isEcommerce && hasSalePrice && !hasOmnibusMention) {
    trackingIssues.push({
      id: 'leak-omnibus-missing',
      title: 'Ryzyko kar UOKiK i utraty zaufania: brak dyrektywy Omnibus przy promocjach',
      severity: 'warning',
      description: 'Wykryto przekreślone ceny promocyjne, ale brak wymaganej prawem w UE informacji o najniższej cenie towaru z 30 dni przed obniżką.',
      impact: 'Ryzyko dotkliwych kar finansowych od Urzędu Ochrony Konkurencji i Konsumentów (UOKiK, do 10% rocznego obrotu przedsiębiorcy) oraz utrata zaufania kupujących podejrzewających sztuczne zawyżanie cen.',
      developerSolution: 'Wdrożę automatyczny, zgodny z prawem moduł dyrektywy Omnibus w szablonie karty produktu i koszyka w 24h.'
    });
  }

  // Scenariusz 8: Brak Rich Snippets w Google (Schema.org Product / Offer)
  if (isEcommerce && hasProductPages && !hasProductSchema) {
    trackingIssues.push({
      id: 'leak-schema-product-missing',
      title: 'Brak Rich Snippets w Google: brak Schema.org Product / Offer',
      severity: 'warning',
      description: 'Podstrony produktów nie zawierają pełnych danych strukturalnych Schema.org (Product, Offer, AggregateRating).',
      impact: 'Produkty w wynikach wyszukiwania Google nie wyświetlają gwiazdek ocen, aktualnej ceny ani statusu dostępności. Przez to CTR spada o 25-40% na rzecz konkurencji mającej bogate wyniki wyszukiwania.',
      developerSolution: 'Zaimplementuję zwalidowany kod JSON-LD Schema.org Product ze stanami magazynowymi i ceną zgodny z Google Rich Results w 24h.'
    });
  }

  // Scenariusz 9: Brak szybkich płatności mobilnych (BLIK, Apple Pay, Google Pay)
  if (isEcommerce && !hasExpressPayments) {
    trackingIssues.push({
      id: 'leak-express-payments-missing',
      title: 'Wysoki wskaźnik porzuconych koszyków mobilnych: brak BLIK / Apple Pay',
      severity: 'warning',
      description: 'W kodzie sklepu nie wykryto wzmianki o integracji z ekspresowymi portfelami mobilnymi (BLIK, Apple Pay, Google Pay).',
      impact: 'W polskim e-commerce ponad 70% zakupów mobilnych finalizowanych jest przez BLIK i Apple Pay. Konieczność wpisywania danych karty lub logowania do banku powoduje porzucenie do 35% koszyków na smartfonach.',
      developerSolution: 'Wdrożę bramkę płatności ekspresowych One-Click Checkout (Stripe / PayU / P24) z bezpośrednim przyciskiem Apple Pay / Google Pay na karcie produktu w 24h.'
    });
  }

  // Scenariusz 10: Nieklikalny numer telefonu w serwisie usługowym / B2B
  if (!isEcommerce && hasUnclickablePhone) {
    trackingIssues.push({
      id: 'leak-unclickable-phone-email',
      title: 'Utrata połączeń na smartfonach: nieklikalny numer telefonu w treści',
      severity: 'warning',
      description: 'Wykryto numer telefonu w treści strony, który nie jest aktywnym linkiem <a href="tel:...">.',
      impact: 'Klient wchodzący ze smartfona z płatnej reklamy nie może kliknąć, aby połączyć się z biurem – musi ręcznie kopiować lub przepisywać numer. Powoduje to utratę nawet 40-50% potencjalnych połączeń telefonicznych.',
      developerSolution: 'Przekształcę wszystkie wystąpienia numerów telefonów w klikalne przyciski tel: z mikro-animacją i podpiętą telemetrią kliknięć w 24h.'
    });
  }

  // Scenariusz 11: Brak ochrony antyspamowej formularzy
  if (hasLeadForms && !hasFormSpamProtection) {
    trackingIssues.push({
      id: 'leak-unprotected-form-spam',
      title: 'Zanieczyszczenie kampanii reklamowych: formularz bez ochrony antyspamowej',
      severity: 'warning',
      description: 'Formularze kontaktowe nie posiadają zabezpieczenia przed botami (Turnstile, reCAPTCHA v3, Honeypot).',
      impact: 'Automatyczne boty zalewają skrzynkę spamem. Co gorsza, fikcyjne wysyłki zanieczyszczają algorytmy Google/Meta Ads fałszywymi konwersjami, przez co reklamy optymalizują się pod spamerów zamiast realnych klientów.',
      developerSolution: 'Zintegruję niewidoczną dla ludzi ochronę Cloudflare Turnstile lub inteligentny honeypot bez denerwujących puzzli captcha w 24h.'
    });
  }

  // Scenariusz 12: Brak tagów Open Graph (og:image)
  if (!hasOpenGraph) {
    trackingIssues.push({
      id: 'leak-opengraph-missing',
      title: 'Martwe udostępnianie w social media: brak tagów Open Graph (og:image)',
      severity: 'info',
      description: 'Brak dedykowanych meta-tagów og:image, og:title i og:description do podglądu linków w mediach społecznościowych.',
      impact: 'Gdy potencjalny klient udostępnia link do oferty na Messengerze, WhatsAppie czy LinkedInie, pojawia się pusty szary prostokąt. Spadek klikalności (CTR) takich linków wynosi ponad 60%.',
      developerSolution: 'Wdrożę dynamiczny mechanizm Open Graph ze skalibrowanymi grafikami podglądu 1200x630px w 24h.'
    });
  }

  const hasPaidAds = hasGoogleAds || hasMetaPixel || hasTikTokPixel;
  let adBudgetLeakRisk: 'none' | 'low' | 'medium' | 'critical' = 'none';
  if (!hasPaidAds || isPublicOrNgo) {
    adBudgetLeakRisk = 'none';
  } else if (trackingIssues.some(i => i.severity === 'critical')) {
    adBudgetLeakRisk = 'critical';
  } else if (trackingIssues.some(i => i.severity === 'warning')) {
    adBudgetLeakRisk = 'medium';
  } else {
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
    metaPixelId,
    hasTikTokPixel,
    tikTokPixelId,
    hasConsentModeV2,
    hasDataLayer,
    hasAddToCartTracking,
    hasPurchaseTracking,
    hasCartButtons,
    hasLeadForms,
    hasViewItemTracking,
    hasProductSchema,
    hasOmnibusCompliance,
    hasExpressPayments,
    hasClickableContacts,
    hasUnclickablePhone,
    hasClickToCallTracking,
    hasFormSpamProtection,
    hasOpenGraph,
    variantTimeoutUrls,
    adBudgetLeakRisk,
    issues: trackingIssues,
    profileSignals
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
      },
      detectedProfile: siteType,
      profileLabel: SITE_TYPE_LABELS[siteType] || 'Usługi B2B & Doradztwo',
      profileSignals
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

    if (p.isThinContent && !p.isFunctionalPage) {
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
    },
    detectedProfile: siteType,
    profileLabel: SITE_TYPE_LABELS[siteType] || 'Usługi B2B & Doradztwo',
    profileSignals
  };
}

/**
 * Generator szybkich błędów krytycznych (Top 3-4 wycieki zysku i budżetu reklamowego)
 */
export function pluralizePolish(count: number, singular: string, few: string, many: string): string {
  if (count === 1) return `${count} ${singular}`;
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} ${few}`;
  }
  return `${count} ${many}`;
}

export function formatPodstronyPosiada(count: number): string {
  if (count === 1) return '1 podstrona posiada';
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} podstrony posiadają`;
  }
  return `${count} podstron posiada`;
}

/**
 * Selekcja Top 3-4 problemów o najwyższym wpływie biznesowym do szybkiej diagnozy krytycznej
 */
export function generateQuickCriticalIssues(
  evidence: EvidenceSummary,
  codeSmells?: DetailedCodeSmells,
  siteType: SiteType = 'services'
): QuickCriticalIssue[] {
  const issues: QuickCriticalIssue[] = [];
  const isEcommerce = siteType === 'ecommerce';

  // 1. Priorytet: Płatne kampanie i wyciek budżetu reklamowego (tylko gdy są realne błędy krytyczne kampanii)
  const criticalTracking = evidence.adsAndTracking.issues.find(i => i.severity === 'critical');
  if (criticalTracking) {
    const detailsList: { label?: string; sublabel?: string }[] = [];
    if (evidence.adsAndTracking.googleAdsId) detailsList.push({ label: `Google Ads ID: ${evidence.adsAndTracking.googleAdsId}` });
    if (evidence.adsAndTracking.gtmId) detailsList.push({ label: `Google Tag Manager: ${evidence.adsAndTracking.gtmId}` });
    if (evidence.adsAndTracking.ga4Id) detailsList.push({ label: `Google Tag / GA4 ID: ${evidence.adsAndTracking.ga4Id}` });
    if (evidence.adsAndTracking.metaPixelId) {
      detailsList.push({ label: `Meta Pixel ID: ${evidence.adsAndTracking.metaPixelId}` });
    } else if (evidence.adsAndTracking.hasMetaPixel) {
      detailsList.push({ label: 'Wykryto Meta Pixel (Facebook Ads)' });
    }
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

  // 2. Priorytet: Dla podmiotów publicznych i szkół – brak Deklaracji Dostępności (wymóg ustawowy)
  if ((siteType === 'gov_public' || siteType === 'education') && !evidence.profileSignals?.hasDeklaracjaDostepnosci) {
    issues.push({
      id: 'quick-missing-wcag-declaration',
      title: 'Brak Deklaracji Dostępności cyfrowej (Wymóg prawny WCAG)',
      type: 'security',
      severity: 'critical',
      shortDesc: 'Portal nie posiada podlinkowanej Deklaracji Dostępności wymaganej Ustawą z dnia 4 kwietnia 2019 r.',
      businessImpact: 'Ryzyko nałożenia kar finansowych do 10 000 zł przez Ministra Cyfryzacji / KPRM oraz bariera dla osób ze szczególnymi potrzebami.',
      developerAction: 'Opracuję i wdrożę w stopce zgodną z wytycznymi WCAG 2.1 AA Deklarację Dostępności z deklaracją architektoniczną w 24h.'
    });
  }

  // 3. Priorytet: Auto-kanibalizacja tytułów Title
  if (evidence.duplicateTitleGroups.length > 0) {
    const totalAffected = evidence.duplicateTitleGroups.reduce((acc, g) => acc + g.count, 0);
    const groupsText = pluralizePolish(evidence.duplicateTitleGroups.length, 'grupa', 'grupy', 'grup');
    
    let impactText = 'Zamiast jednej silnej pozycji w TOP 3, Twoje podstrony rotują i zbijają się nawzajem, marnując bezpłatne zapytania ofertowe z Google.';
    if (isEcommerce) {
      impactText = 'Zamiast jednej silnej pozycji w TOP 3, Twoje produkty i kategorie rotują i zbijają się nawzajem, marnując bezpłatną sprzedaż z Google.';
    } else if (siteType === 'gov_public') {
      impactText = 'Mieszkańcy szukający konkretnych procedur lub wniosków trafiają na przypadkowe podstrony urzędu, co potęguje frustrację i generuje niepotrzebne telefony do sekretariatu.';
    } else if (siteType === 'education') {
      impactText = 'Kandydaci i rodzice szukający informacji o naborze lub profilach klas trafiają na nieaktualne strony, co obniża pozycję szkoły w rankingu rekrutacyjnym.';
    } else if (siteType === 'ngo_foundation') {
      impactText = 'Osoby w kryzysie oraz darczyńcy szukający wsparcia lub celu 1.5% trafiają na błędne podstrony, co utrudnia dotarcie do bezpłatnej pomocy statutowej.';
    } else if (siteType === 'local_services') {
      impactText = 'Lokalni klienci szukający Twojego gabinetu lub usług w okolicy trafiają na zduplikowane podstrony i ostatecznie przechodzą do konkurencji z sąsiedniej ulicy.';
    }

    issues.push({
      id: 'quick-duplicate-titles',
      title: `Auto-kanibalizacja w Google: ${groupsText} identycznych tagów Title`,
      type: 'seo',
      severity: 'critical',
      shortDesc: `Aż ${formatPodstronyPosiada(totalAffected)} identyczne tytuły, przez co konkurują ze sobą na te same frazy w wynikach wyszukiwania.`,
      affectedCount: totalAffected,
      businessImpact: impactText,
      developerAction: 'Zaimplementuję dynamiczny szablon unikalnych tagów Title w warstwie CMS/kodu z automatycznym sufiksem wyróżniającym w 24h.',
      details: evidence.duplicateTitleGroups.slice(0, 4).map(g => ({
        label: `« ${g.title} » (${g.count} stron)`,
        sublabel: g.urls.slice(0, 2).join(', ') + (g.urls.length > 2 ? ` i ${g.urls.length - 2} więcej...` : '')
      }))
    });
  }

  // 4. Priorytet: Brakujące nagłówki semantyczne H1
  if (evidence.missingH1Count > 0) {
    issues.push({
      id: 'quick-missing-h1',
      title: `Brak nagłówków H1 na ${pluralizePolish(evidence.missingH1Count, 'podstronie', 'podstronach', 'podstronach')}`,
      type: 'seo',
      severity: 'warning',
      shortDesc: 'Strony nie posiadają głównego nagłówka semantycznego, który wskazuje robotom wyszukiwarek i modelom AI temat podstrony.',
      affectedCount: evidence.missingH1Count,
      businessImpact: 'Znacznie słabsza widoczność w Google na precyzyjne frazy z długiego ogona (long-tail) oraz gorsza interpretacja treści przez boty AI (SearchGPT, Gemini).',
      developerAction: 'Wprowadzę automatyczny, semantyczny tag <h1> w strukturze widoków szablonu bez naruszania aktualnego designu serwisu.',
      details: evidence.missingH1Urls.slice(0, 5).map(u => ({ url: u }))
    });
  }

  // 5. Priorytet: Consent Mode v2 (jeśli nie był dodany wyżej) lub Canonical / Dług techniczny
  const consentIssue = evidence.adsAndTracking.issues.find(i => i.id === 'leak-consent-mode-v2' && i.severity === 'critical');
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
    let canonicalImpact = 'Rozpraszanie autorytetu domeny PageRank i marnowanie budżetu indeksowania (Crawl Budget) Google.';
    if (siteType === 'gov_public') {
      canonicalImpact = 'Rozpraszanie autorytetu domeny i ryzyko indeksowania roboczych linków zamiast oficjalnych procedur urzędowych.';
    } else if (siteType === 'education') {
      canonicalImpact = 'Rozpraszanie widoczności portalu szkoły w wynikach wyszukiwania na rzecz nieoficjalnych lub roboczych adresów.';
    } else if (siteType === 'ngo_foundation') {
      canonicalImpact = 'Rozpraszanie widoczności programów pomocowych i zbiórek w Google na rzecz przypadkowych duplikatów.';
    }

    issues.push({
      id: 'quick-missing-canonical',
      title: `Brak tagów Canonical na ${pluralizePolish(evidence.missingCanonicalCount, 'podstronie', 'podstronach', 'podstronach')}`,
      type: 'seo',
      severity: 'warning',
      shortDesc: 'Strony nie informują wyszukiwarki o oficjalnym adresie kanonicznym, co grozi tworzeniem niekontrolowanych duplikatów.',
      affectedCount: evidence.missingCanonicalCount,
      businessImpact: canonicalImpact,
      developerAction: 'Zaimplementuję samoodnoszący się tag <link rel="canonical"> w nagłówku witryny wyliczany na bieżąco z czystego URL.',
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
      developerAction: 'Przeprowadzę refaktoryzację zasobów krytycznych, odroczę ciężkie skrypty (defer/async) i przyspieszę ładowanie poniżej 1.5s.'
    });
  }

  return issues;
}

function normalizeUrl(url: string, origin: string): string {
  try {
    const u = new URL(url, origin);
    u.hash = '';
    let res = u.toString();
    if (res.endsWith('/')) {
      res = res.slice(0, -1);
    }
    return res;
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
