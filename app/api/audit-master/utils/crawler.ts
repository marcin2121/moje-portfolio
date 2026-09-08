import * as cheerio from 'cheerio';
import { PageAuditResult, EvidenceSummary, DuplicateTitleGroup, CategoryStats } from '../types';

interface CrawlOptions {
  maxPages?: number;
  maxTimeMs?: number;
  concurrency?: number;
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
        pages.push(res.value);
      }
    }
  }

  // 3. Agregacja twardych dowodów (Evidence Engine)
  const evidence = buildEvidenceSummary(pages);

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
async function analyzeSinglePage(url: string, origin: string): Promise<PageAuditResult | null> {
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
    };
  } catch {
    // W przypadku błędu połączenia z podstroną
    return {
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
 * Agregacja wyników w zwięzłe twarde dowody (Evidence Summary)
 */
function buildEvidenceSummary(pages: PageAuditResult[]): EvidenceSummary {
  const totalPages = pages.length;
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
