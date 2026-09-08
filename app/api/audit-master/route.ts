import { NextResponse } from 'next/server';
import crypto from 'crypto';
import * as cheerio from 'cheerio';
import { checkRateLimit } from './utils/rateLimiter';
import { generateGeminiReport } from './utils/geminiAI';
import { getInterpretation } from './utils/interpretation';
import { crawlDomain, generateQuickCriticalIssues } from './utils/crawler';
import { getAuditByToken, getAuditByDomain, saveAudit } from './utils/storage';
import { evaluateAllCheckpoints } from './utils/checkpointsCatalog';
import { fetchCompetitorData, buildCompetitorBenchmark } from './utils/competitorAnalyzer';
import { notifyAuditGenerated } from './utils/discordNotifier';
import { AuditMasterResponse, DetailedCodeSmells } from './types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Brak wymaganego parametru token' }, { status: 400 });
    }

    const cachedAudit = await getAuditByToken(token);
    if (!cachedAudit) {
      return NextResponse.json({ error: 'Raport audytu nie został odnaleziony lub wygasł' }, { status: 404 });
    }

    return NextResponse.json(cachedAudit);
  } catch {
    return NextResponse.json({ error: 'Błąd podczas pobierania zapisanego audytu' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-vercel-ip') ?? req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',').pop()?.trim() ?? 'unknown-ip';
    const host = req.headers.get('host') || '';
    
    // 🛡️ Ochrona przed wyczerpaniem limitów (Denial of Wallet)
    const rateLimitCheck = checkRateLimit(ip, host);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({ error: rateLimitCheck.error }, { status: 429 });
    }

    const body = await req.json();
    const { url, siteType = 'services', token, competitorUrl } = body;

    // Jeśli przekazano token w body POST, zwróć od razu z cache
    if (token && typeof token === 'string') {
      const cached = await getAuditByToken(token);
      if (cached) return NextResponse.json(cached);
    }

    const currentSiteType: 'ecommerce' | 'services' = siteType === 'ecommerce' ? 'ecommerce' : 'services';
    
    if (!url || typeof url !== 'string' || url.length > 500) {
      return NextResponse.json({ error: 'URL jest nieprawidłowy lub zbyt długi' }, { status: 400 });
    }

    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // 🛡️ Ochrona przed SSRF (Server-Side Request Forgery)
    try {
      const parsedUrl = new URL(targetUrl);
      const hostname = parsedUrl.hostname.toLowerCase();
      
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '0.0.0.0' || hostname.includes('::ffff:127.0.0.1');
      const isCloudProviderMeta = hostname === '169.254.169.254' || hostname === '100.100.100.200';
      const isInternalIp = /^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^192\.168\./.test(hostname) || /^fc00:/i.test(hostname) || /^fe80:/i.test(hostname);
      const isLocalDomain = hostname.endsWith('.local') || hostname.endsWith('.internal');
      
      if (isLocalhost || isCloudProviderMeta || isInternalIp || isLocalDomain) {
        return NextResponse.json({ error: 'Niedozwolony adres URL (ochrona SSRF).' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Nieprawidłowy format adresu URL.' }, { status: 400 });
    }

    // Walidacja SSRF dla opcjonalnej witryny konkurenta
    let validCompetitorUrl: string | undefined = undefined;
    if (competitorUrl && typeof competitorUrl === 'string' && competitorUrl.trim().length > 0 && competitorUrl.trim().length <= 500) {
      const compTarget = competitorUrl.trim().startsWith('http') ? competitorUrl.trim() : `https://${competitorUrl.trim()}`;
      try {
        const compParsed = new URL(compTarget);
        const compHost = compParsed.hostname.toLowerCase();
        const compIsLocal = compHost === 'localhost' || compHost === '127.0.0.1' || compHost === '::1' || compHost === '0.0.0.0' || compHost.includes('::ffff:127.0.0.1');
        const compIsMeta = compHost === '169.254.169.254' || compHost === '100.100.100.200';
        const compIsInternal = /^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^192\.168\./.test(compHost) || /^fc00:/i.test(compHost) || /^fe80:/i.test(compHost);
        const compIsLocalDomain = compHost.endsWith('.local') || compHost.endsWith('.internal');
        if (!compIsLocal && !compIsMeta && !compIsInternal && !compIsLocalDomain) {
          validCompetitorUrl = compTarget;
        }
      } catch {
        // Ignoruj niepoprawny url konkurenta
      }
    }

    const cleanDomain = new URL(targetUrl).hostname.toLowerCase().replace(/^www\./, '');

    // ⚡ SPRAWDZENIE TRWAŁEGO CACHE (Supabase / local disk)
    // Jeśli użytkownik NIE podał konkurenta do benchmarku i domena była audytowana w ciągu 7 dni, zwróć cache natychmiast!
    if (!validCompetitorUrl) {
      const existingAudit = await getAuditByDomain(cleanDomain, 7, currentSiteType);
      if (existingAudit) {
        return NextResponse.json({
          ...existingAudit,
          cached: true
        });
      }
    }

    // 🚀 ODPALENIE WIELOPODSTRONICOWEGO CRAWLERA, ANALIZATORA ORAZ BENCHMARKU KONKURENTA W JEDNYM PROMISE.ALLSETTLED
    // Ograniczenie czasu i concurrency dostosowane do Hetzner VPS (4GB RAM)
    const [crawlResult, rootAnalysisResult, competitorResult] = await Promise.allSettled([
      crawlDomain(targetUrl, { maxPages: 35, maxTimeMs: 12000, concurrency: 4, siteType: currentSiteType }),
      analyzeRootUrl(targetUrl),
      validCompetitorUrl ? fetchCompetitorData(validCompetitorUrl) : Promise.resolve(null)
    ]);

    const crawlData = crawlResult.status === 'fulfilled' ? crawlResult.value : { pages: [], evidence: {
      totalPages: 1,
      avgResponseTimeMs: 80,
      status200Count: 1,
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
      adsAndTracking: {
        hasGoogleAds: false,
        hasGoogleTagManager: false,
        hasGA4: false,
        hasMetaPixel: false,
        hasTikTokPixel: false,
        hasConsentModeV2: false,
        hasDataLayer: false,
        hasAddToCartTracking: false,
        hasPurchaseTracking: false,
        adBudgetLeakRisk: 'none' as const,
        issues: []
      },
      categoriesSummary: { overall: { goodCount: 1, warnCount: 0, badCount: 0 } }
    }};

    const rootData = rootAnalysisResult.status === 'fulfilled' ? rootAnalysisResult.value : {
      performanceScore: 50,
      seoScore: 60,
      securityScore: 40,
      scalabilityScore: 40,
      automationScore: 40,
      detectedPlatform: 'Własny kod / Nierozpoznano',
      wafDetected: false,
      codeSmells: {
        jquery: false,
        badScripts: 0,
        domElements: 0,
        inlineStyles: 0,
        pageBuilders: [],
        trackers: [],
        missingAltCount: 0,
        unoptimizedImagesCount: 0
      }
    };

    // Kalibracja SEO Score z uwzględnieniem danych z crawlera
    let finalSeoScore = rootData.seoScore;
    if (crawlData.evidence.totalPages > 1) {
      let penalty = 0;
      if (crawlData.evidence.duplicateTitleGroups.length > 0) penalty += 15;
      if (crawlData.evidence.missingH1Count > 0) penalty += 15;
      if (crawlData.evidence.missingCanonicalCount > 0) penalty += 10;
      if (crawlData.evidence.thinContentCount > crawlData.evidence.totalPages * 0.3) penalty += 10;
      if (crawlData.evidence.missingTitleCount > 0) penalty += 10;

      if (penalty === 0) {
        // Wszystkie zbadane podstrony posiadają wzorowe H1, canonical, unikalne title i pełną treść
        finalSeoScore = Math.max(finalSeoScore, 98);
      } else {
        finalSeoScore = Math.max(25, Math.min(100, Math.round(finalSeoScore - penalty)));
      }
    }

    // Kalibracja Performance Score z uwzględnieniem twardych danych z crawlera (TTFB, skrypty, platforma)
    let finalPerformanceScore = rootData.performanceScore;
    const avgTtfb = crawlData.evidence.avgResponseTimeMs || 150;
    const isModernEdge = rootData.detectedPlatform.includes('Next.js') || rootData.detectedPlatform.includes('React');

    let measuredPerf = 50;
    if (avgTtfb < 150) measuredPerf += 40;
    else if (avgTtfb < 300) measuredPerf += 30;
    else if (avgTtfb < 600) measuredPerf += 15;
    else if (avgTtfb < 1000) measuredPerf += 5;

    if (rootData.codeSmells.badScripts === 0) measuredPerf += 10;
    if (rootData.codeSmells.domElements < 1400) measuredPerf += 5;
    if (isModernEdge) measuredPerf = Math.max(measuredPerf, 98);

    if (rootData.performanceScore === 55 || measuredPerf > rootData.performanceScore) {
      finalPerformanceScore = Math.min(100, measuredPerf);
    }

    // Wyliczanie szybkich błędów krytycznych (Top wycieki budżetu i SEO)
    const quickIssues = generateQuickCriticalIssues(
      crawlData.evidence,
      rootData.codeSmells,
      currentSiteType
    );

    const avgScore = Math.round(
      (finalPerformanceScore + finalSeoScore + rootData.securityScore + rootData.scalabilityScore + rootData.automationScore) / 5
    );
    const lossPercentage = avgScore >= 95 ? 2 : Math.max(5, Math.round((100 - avgScore) / 1.5));

    // Generowanie werdyktu AI (z odpornym fallbackiem w razie limitów Gemini)
    const geminiKey = process.env.GEMINI_API_KEY || '';
    const aiReport = await generateGeminiReport(
      targetUrl,
      avgScore,
      finalPerformanceScore,
      finalSeoScore,
      rootData.detectedPlatform,
      rootData.wafDetected,
      rootData.codeSmells,
      lossPercentage,
      geminiKey,
      currentSiteType,
      crawlData.evidence,
      quickIssues
    );

    // Unikalny token URL do trwałego linku (np. /narzedzia/audyt?token=a8f9c1...)
    const tokenStr = crypto.randomBytes(16).toString('hex');

    // Ewaluacja 80 punktów kontrolnych (Master Audit Checklist)
    const checkpointResult = evaluateAllCheckpoints(
      crawlData.evidence,
      crawlData.pages,
      rootData.codeSmells,
      currentSiteType,
      rootData
    );

    // Budowa obiektu porównania z konkurentem (jeśli przekazano konkurenta)
    const competitorRaw = competitorResult.status === 'fulfilled' ? competitorResult.value : null;
    const competitorBenchmark = competitorRaw
      ? buildCompetitorBenchmark(
          competitorRaw,
          avgScore,
          crawlData.evidence,
          rootData.detectedPlatform,
          currentSiteType,
          rootData.securityScore
        )
      : undefined;

    const responsePayload: AuditMasterResponse = {
      token: tokenStr,
      url: targetUrl,
      domain: cleanDomain,
      siteType: currentSiteType,
      overallScore: avgScore,
      lossPercentage,
      aiReport,
      detectedPlatform: rootData.detectedPlatform,
      wafDetected: rootData.wafDetected,
      codeSmells: rootData.codeSmells,
      evidence: crawlData.evidence,
      quickIssues,
      checkpointEvals: checkpointResult.evals,
      checkpointStats: checkpointResult.stats,
      competitorBenchmark: competitorBenchmark || undefined,
      pages: crawlData.pages,
      createdAt: new Date().toISOString(),
      pillars: [
        { name: 'Szybkość', score: Math.round(finalPerformanceScore), interpretation: getInterpretation(finalPerformanceScore, 'Szybkość', currentSiteType) },
        { name: 'SEO', score: Math.round(finalSeoScore), interpretation: getInterpretation(finalSeoScore, 'SEO', currentSiteType) },
        { name: 'Skalowalność', score: Math.round(rootData.scalabilityScore), interpretation: getInterpretation(rootData.scalabilityScore, 'Skalowalność', currentSiteType) },
        { name: 'Automatyzacja', score: Math.round(rootData.automationScore), interpretation: getInterpretation(rootData.automationScore, 'Automatyzacja', currentSiteType) },
        { name: 'Bezpieczeństwo', score: Math.round(rootData.securityScore), interpretation: getInterpretation(rootData.securityScore, 'Bezpieczeństwo', currentSiteType) }
      ]
    };

    // Zapis do trwałego cache (Supabase + lokalny plik)
    await saveAudit(responsePayload);

    // 🔔 Powiadomienie Discord (Fire-and-forget, nie blokuje odpowiedzi użytkownika)
    notifyAuditGenerated({
      domain: cleanDomain,
      token: tokenStr,
      overallScore: avgScore,
      lossPercentage,
      detectedPlatform: rootData.detectedPlatform,
      siteType: currentSiteType,
      criticalLeaksCount: quickIssues.length,
      competitorDomain: competitorBenchmark?.competitorDomain,
      competitorScore: competitorBenchmark?.competitorScore
    }).catch(err => {
      console.error('[Discord Webhook Error]', err);
    });

    return NextResponse.json(responsePayload);

  } catch {
    return NextResponse.json({ error: 'Błąd silnika podczas generowania audytu' }, { status: 500 });
  }
}

/**
 * Pomocnicza analiza strony głównej (PageSpeed + nagłówki bezpieczeństwa + dług techniczny)
 */
async function analyzeRootUrl(targetUrl: string) {
  const apiKey = process.env.PAGESPEED_API_KEY;

  let performanceScore = 55;
  let seoScore = 65;
  let securityScore = 30;
  let scalabilityScore = 40;
  let automationScore = 40;
  let detectedPlatform = 'Własny kod / Nierozpoznano';
  let wafDetected = false;

  const codeSmells: DetailedCodeSmells = {
    jquery: false,
    badScripts: 0,
    domElements: 0,
    inlineStyles: 0,
    pageBuilders: [],
    trackers: [],
    missingAltCount: 0,
    unoptimizedImagesCount: 0
  };

  // 1. PageSpeed API
  try {
    const psUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=desktop&category=performance&category=seo${apiKey ? `&key=${apiKey}` : ''}`;
    const psRes = await fetch(psUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(12000)
    });
    if (psRes.ok) {
      const psData = await psRes.json();
      const lh = psData?.lighthouseResult;
      performanceScore = (lh?.categories?.performance?.score || 0.55) * 100;
      seoScore = (lh?.categories?.seo?.score || 0.65) * 100;
      codeSmells.fcp = lh?.audits?.['first-contentful-paint']?.displayValue;
      codeSmells.lcp = lh?.audits?.['largest-contentful-paint']?.displayValue;
    }
  } catch {
    // Ignoruj błędy PageSpeed
  }

  // 2. HTML & Nagłówki
  try {
    const siteRes = await fetch(targetUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36' }
    });

    const html = await siteRes.text();
    const lowerHtml = html.toLowerCase();

    // WAF / Cloudflare
    if (html.includes('Just a moment...') || html.includes('Attention Required!') || siteRes.status === 403) {
      wafDetected = true;
      detectedPlatform = 'Zabezpieczenie WAF / Cloudflare';
      securityScore = 95;
    } else {
      let sec = 20;
      if (siteRes.headers.get('strict-transport-security')) sec += 25;
      if (siteRes.headers.get('content-security-policy')) sec += 25;
      if (siteRes.headers.get('x-frame-options')) sec += 15;
      if (siteRes.headers.get('x-content-type-options')) sec += 15;
      securityScore = Math.min(100, sec);

      const $ = cheerio.load(html);
      codeSmells.jquery = lowerHtml.includes('jquery');
      codeSmells.domElements = $('*').length;
      codeSmells.inlineStyles = $('[style]').length;
      codeSmells.missingAltCount = $('img:not([alt]), img[alt=""]').length;
      codeSmells.unoptimizedImagesCount = $('img:not([loading="lazy"])').length;

      $('script[src]').each((_, el) => {
        const isAsync = $(el).attr('async') !== undefined;
        const isDefer = $(el).attr('defer') !== undefined;
        const isNoModule = $(el).attr('nomodule') !== undefined;
        if (!isAsync && !isDefer && !isNoModule) codeSmells.badScripts++;
      });

      if (lowerHtml.includes('googletagmanager.com')) codeSmells.trackers?.push('Google Tag Manager');
      if (lowerHtml.includes('connect.facebook.net') || lowerHtml.includes('fbq(')) codeSmells.trackers?.push('Meta Pixel');
      if (lowerHtml.includes('analytics.tiktok.com')) codeSmells.trackers?.push('TikTok Pixel');
      if (lowerHtml.includes('hotjar.com')) codeSmells.trackers?.push('Hotjar');
      if (lowerHtml.includes('clarity.ms')) codeSmells.trackers?.push('Microsoft Clarity');

      // Rekalibracja progu DOM (<1400 elementów to super wynik we współczesnym frontendzie z SVG i komponentami)
      scalabilityScore = codeSmells.domElements < 1400 ? 98 : codeSmells.domElements < 2400 ? 80 : codeSmells.domElements < 3500 ? 50 : 30;
      automationScore = codeSmells.badScripts === 0 ? 90 : Math.max(30, 90 - codeSmells.badScripts * 10);

      // Uniwersalna detekcja Next.js (App Router z streamingiem self.__next_f + Pages Router __NEXT_DATA__)
      const isNextJs = lowerHtml.includes('/_next/static/') || 
                       lowerHtml.includes('self.__next_f') || 
                       lowerHtml.includes('__next_data__') ||
                       lowerHtml.includes('next-route-announcer');
      const isShopify = lowerHtml.includes('cdn.shopify.com');
      const isWordPress = lowerHtml.includes('wp-content') || lowerHtml.includes('wp-includes');

      if (isNextJs) {
        detectedPlatform = 'Next.js / React (Serverless Edge)';
        scalabilityScore = Math.max(scalabilityScore, 98);
        automationScore = Math.max(automationScore, 95);
        performanceScore = Math.max(performanceScore, 96);
        // Bezwzględnie czyścimy WordPressowe page buildery na Next.js (eliminacja false-positives np. Divi)
        codeSmells.pageBuilders = [];
      } else if (isShopify) {
        detectedPlatform = 'Shopify SaaS';
        scalabilityScore = Math.max(scalabilityScore, 80);
      } else if (isWordPress) {
        detectedPlatform = 'WordPress / WooCommerce';
        scalabilityScore = Math.min(scalabilityScore, 50);
        automationScore = Math.min(automationScore, 45);

        // Precyzyjne sprawdzanie builderów WP wyłącznie w kontekście WordPressa
        if (lowerHtml.includes('/wp-content/plugins/elementor') || lowerHtml.includes('elementor-section') || lowerHtml.includes('elementor-widget')) {
          codeSmells.pageBuilders?.push('Elementor');
        }
        if (lowerHtml.includes('/wp-content/themes/divi') || lowerHtml.includes('divi-style-css') || (lowerHtml.includes('et_pb_section') && lowerHtml.includes('wp-content'))) {
          codeSmells.pageBuilders?.push('Divi Builder');
        }
        if (lowerHtml.includes('/plugins/js_composer') || (lowerHtml.includes('wp-content') && (lowerHtml.includes('wpb_wrapper') || lowerHtml.includes('vc_row')))) {
          codeSmells.pageBuilders?.push('WPBakery');
        }
        if (lowerHtml.includes('/wp-content/plugins/oxygen') || lowerHtml.includes('ct-section')) {
          codeSmells.pageBuilders?.push('Oxygen Builder');
        }
      }
    }
  } catch {
    // Ignoruj
  }

  return {
    performanceScore,
    seoScore,
    securityScore,
    scalabilityScore,
    automationScore,
    detectedPlatform,
    wafDetected,
    codeSmells
  };
}