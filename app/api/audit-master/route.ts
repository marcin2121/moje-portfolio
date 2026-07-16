import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio'; // Bezpieczny, błyskawiczny parser HTML
import { checkRateLimit } from './utils/rateLimiter';
import { generateGeminiReport } from './utils/geminiAI';
import { getInterpretation } from './utils/interpretation';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-vercel-ip') ?? req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',').pop()?.trim() ?? 'unknown-ip';
    const host = req.headers.get('host') || '';
    
    // 🛡️ SECURITY FIX: Zabezpieczenie przed wyczerpaniem limitów (Denial of Wallet)
    const rateLimitCheck = checkRateLimit(ip, host);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({ error: rateLimitCheck.error }, { status: 429 });
    }

    const { url } = await req.json();
    
    // 🛡️ SECURITY FIX: Walidacja długości i typu (Zapobieganie DoS / parser choke)
    if (!url || typeof url !== 'string' || url.length > 500) {
      return NextResponse.json({ error: 'URL jest nieprawidłowy lub zbyt długi' }, { status: 400 });
    }

    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // 🛡️ SECURITY FIX: Zabezpieczenie przed SSRF (Server-Side Request Forgery)
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
    const apiKey = process.env.PAGESPEED_API_KEY;

    let performanceScore = 45;
    let seoScore = 55;
    let securityScore = 30;
    let scalabilityScore = 30;
    let automationScore = 30;
    let html = '';
    let detectedPlatform = 'Własny kod / Nierozpoznano';
    const codeSmells = { jquery: false, badScripts: 0, h1Count: 0, inlineStyles: 0 };
    let wafDetected = false;

    // Helper: PageSpeed
    interface PageSpeedData {
      lighthouseResult?: {
        categories?: {
          performance?: { score?: number };
          seo?: { score?: number };
        };
      };
    }

    const fetchPageSpeed = async (retries = 2): Promise<PageSpeedData | null> => {
      const psUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=desktop&category=performance&category=seo${apiKey ? `&key=${apiKey}` : ''}`;
      for (let i = 0; i < retries; i++) {
        try {
          const psRes = await fetch(psUrl, {
            cache: 'no-store',
            signal: AbortSignal.timeout(120000),
            headers: { 'Referer': 'https://molendadevelopment.pl/' }
          });
          if (!psRes.ok) throw new Error(`HTTP Error: ${psRes.status}`);
          return (await psRes.json()) as PageSpeedData;
        } catch (err: unknown) {
          if (i === retries - 1) throw err;
        }
      }
      return null;
    };

    // Helper: HTML
    const fetchSiteHTML = async () => {
      const siteRes = await fetch(targetUrl, {
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' }
      });
      const htmlText = await siteRes.text();
      return { siteRes, htmlText };
    };

    const [psDataResult, siteHtmlResult] = await Promise.allSettled([
      fetchPageSpeed(2),
      fetchSiteHTML()
    ]);

    if (psDataResult.status === 'fulfilled' && psDataResult.value) {
      performanceScore = (psDataResult.value?.lighthouseResult?.categories?.performance?.score || 0.4) * 100;
      seoScore = (psDataResult.value?.lighthouseResult?.categories?.seo?.score || 0.5) * 100;
    }

    if (siteHtmlResult.status === 'fulfilled' && siteHtmlResult.value) {
      const { siteRes, htmlText } = siteHtmlResult.value;
      html = htmlText;

      const isCloudflare = html.includes('Just a moment...') || html.includes('Attention Required!') || siteRes.status === 403;
      
      if (isCloudflare) {
        wafDetected = true;
        detectedPlatform = 'Zabezpieczenie WAF / Cloudflare';
        securityScore = 95;
        scalabilityScore = 80;
        automationScore = 50;
      } else {
        let secScore = 20;
        if (siteRes.headers.get('strict-transport-security')) secScore += 30;
        if (siteRes.headers.get('content-security-policy')) secScore += 30;
        if (siteRes.headers.get('x-frame-options')) secScore += 20;
        securityScore = secScore;

        // BŁYSKAWICZNA ANALIZA CHEERIO (Zamiast niebezpiecznych Regexów)
        const $ = cheerio.load(html);
        // Zmienne pageTitle i pageDesc zostały usunięte ze względu na linter

        codeSmells.jquery = html.toLowerCase().includes('jquery');
        codeSmells.h1Count = $('h1').length;
        codeSmells.inlineStyles = $('[style]').length;

        // Liczymy skrypty bez async/defer
        $('script[src]').each((_, el) => {
          const isAsync = $(el).attr('async') !== undefined;
          const isDefer = $(el).attr('defer') !== undefined;
          if (!isAsync && !isDefer) codeSmells.badScripts++;
        });

        // Detekcja platform
        if (html.includes('__NEXT_DATA__') || html.includes('/_next/static/')) {
          scalabilityScore = 95; automationScore = 95; detectedPlatform = 'Next.js / React (Serverless)';
        } else if (html.includes('cdn.shopify.com')) {
          scalabilityScore = 80; automationScore = 70; detectedPlatform = 'Shopify';
        } else if (html.includes('wp-content')) {
          scalabilityScore = 40; automationScore = 30; detectedPlatform = 'WordPress / WooCommerce';
        }
      }
    }

    const avgScore = Math.round((performanceScore + seoScore + securityScore + scalabilityScore + automationScore) / 5);
    const lossPercentage = Math.max(5, Math.round((100 - avgScore) / 1.5));

    // --- GEMINI AI (Poprawione wyjście Markdown) ---
    let aiReport = '';
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      aiReport = await generateGeminiReport(
        targetUrl,
        avgScore,
        performanceScore,
        seoScore,
        detectedPlatform,
        wafDetected,
        codeSmells,
        lossPercentage,
        geminiKey
      );
    } else {
      aiReport = `*Moduł sztucznej inteligencji nie został skonfigurowany w środowisku.*`;
    }

    return NextResponse.json({
      url: targetUrl,
      overallScore: avgScore,
      lossPercentage,
      aiReport,
      pillars: [
        { name: 'Szybkość', score: Math.round(performanceScore), interpretation: getInterpretation(performanceScore, 'Szybkość') },
        { name: 'SEO', score: Math.round(seoScore), interpretation: getInterpretation(seoScore, 'SEO') },
        { name: 'Skalowalność', score: Math.round(scalabilityScore), interpretation: getInterpretation(scalabilityScore, 'Skalowalność') },
        { name: 'Automatyzacja', score: Math.round(automationScore), interpretation: getInterpretation(automationScore, 'Automatyzacja') },
        { name: 'Bezpieczeństwo', score: Math.round(securityScore), interpretation: getInterpretation(securityScore, 'Bezpieczeństwo') }
      ]
    });

  } catch {
    return NextResponse.json({ error: 'Błąd silnika podczas audytu' }, { status: 500 });
  }
}