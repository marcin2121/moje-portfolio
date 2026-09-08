import * as cheerio from 'cheerio';
import { extractTrackingSignals } from './crawler';
import { CompetitorBenchmark, CompetitorMetrics, EvidenceSummary } from '../types';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function normalizeUrl(urlInput: string): { normalizedUrl: string; domain: string } {
  let target = urlInput.trim();
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    target = `https://${target}`;
  }
  try {
    const u = new URL(target);
    const domain = u.hostname.replace(/^www\./, '').toLowerCase();
    return { normalizedUrl: u.toString(), domain };
  } catch {
    return { normalizedUrl: target, domain: target.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] };
  }
}

export interface RawCompetitorData {
  domain: string;
  normalizedUrl: string;
  competitorTtfb: number;
  competitorPlatform: string;
  isWaf: boolean;
  hasAddToCart: boolean;
  hasConsentMode: boolean;
  hasExpressPayments: boolean;
  hasProductSchema: boolean;
  hasCsp: boolean;
  competitorScore: number;
  isUnavailable?: boolean;
  unavailableReason?: string;
}

/**
 * Równoległe pobranie danych o stronie konkurenta (Promise.allSettled).
 * Bezpieczny timeout (4.5s) i pełny graceful fallback w razie błędów / WAF / Cloudflare.
 */
export async function fetchCompetitorData(competitorUrlStr?: string): Promise<RawCompetitorData | null> {
  if (!competitorUrlStr || competitorUrlStr.trim().length === 0) {
    return null;
  }

  const { normalizedUrl, domain } = normalizeUrl(competitorUrlStr);
  const reqStart = performance.now();

  try {
    const res = await fetch(normalizedUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(4500),
      cache: 'no-store'
    });

    const competitorTtfb = Math.round(performance.now() - reqStart);
    const html = await res.text();
    const lowerHtml = html.toLowerCase();
    const $ = cheerio.load(html);

    const isWaf = html.includes('Just a moment...') || html.includes('Attention Required!') || res.status === 403;

    // Detekcja platformy
    let competitorPlatform = 'Własny kod / Nierozpoznano';
    const isNextJs = lowerHtml.includes('/_next/static/') ||
                     lowerHtml.includes('self.__next_f') ||
                     lowerHtml.includes('__next_data__') ||
                     lowerHtml.includes('next-route-announcer');
    const isShopify = lowerHtml.includes('cdn.shopify.com');
    const isWordPress = lowerHtml.includes('wp-content') || lowerHtml.includes('wp-includes');

    if (isNextJs) competitorPlatform = 'Next.js / React (Serverless Edge)';
    else if (isShopify) competitorPlatform = 'Shopify SaaS';
    else if (isWordPress) competitorPlatform = 'WordPress / WooCommerce';
    else if (isWaf) competitorPlatform = 'Zabezpieczenie WAF / Cloudflare';

    // Telemetria
    const tracking = extractTrackingSignals(html, $);

    // Bezpieczeństwo
    let secScore = 25;
    if (res.headers.get('strict-transport-security')) secScore += 25;
    if (res.headers.get('content-security-policy')) secScore += 25;
    if (res.headers.get('x-frame-options')) secScore += 15;
    if (res.headers.get('x-content-type-options')) secScore += 10;
    const competitorSecScore = Math.min(100, secScore);

    // Szacunek punktacji
    const speedScore = competitorTtfb < 300 ? 95 : competitorTtfb < 600 ? 75 : competitorTtfb < 1000 ? 55 : 35;
    let seoScore = 50;
    if ($('title').first().text().trim().length > 0) seoScore += 15;
    if ($('h1').length === 1) seoScore += 15;
    if ($('link[rel="canonical"]').attr('href')) seoScore += 10;
    if ($('meta[name="description"]').attr('content')) seoScore += 10;

    let trackingScore = 60;
    if (tracking.hasAddToCartTracking) trackingScore += 20;
    if (tracking.hasConsentModeV2) trackingScore += 10;
    if (tracking.hasProductSchema) trackingScore += 10;

    const competitorScore = Math.max(25, Math.min(98, Math.round(
      (speedScore * 0.3) + (seoScore * 0.3) + (trackingScore * 0.25) + (competitorSecScore * 0.15)
    )));

    return {
      domain,
      normalizedUrl,
      competitorTtfb,
      competitorPlatform,
      isWaf,
      hasAddToCart: tracking.hasAddToCartTracking,
      hasConsentMode: tracking.hasConsentModeV2,
      hasExpressPayments: tracking.hasExpressPayments || false,
      hasProductSchema: tracking.hasProductSchema || false,
      hasCsp: isWaf || !!res.headers.get('content-security-policy'),
      competitorScore,
      isUnavailable: false
    };

  } catch {
    // 🛡️ Kula-odporny fallback: konkurent nie może wywalić audytu klienta!
    return {
      domain,
      normalizedUrl,
      competitorTtfb: 0,
      competitorPlatform: 'Niedostępna / Zablokowana',
      isWaf: true,
      hasAddToCart: false,
      hasConsentMode: false,
      hasExpressPayments: false,
      hasProductSchema: false,
      hasCsp: false,
      competitorScore: 0,
      isUnavailable: true,
      unavailableReason: 'Serwer konkurenta odmówił połączenia (błąd 403 / Cloudflare Challenge) lub przekroczył limit czasu (Timeout > 4.5s).'
    };
  }
}

/**
 * Zbudowanie obiektu porównawczego Head-to-Head (CompetitorBenchmark)
 */
export function buildCompetitorBenchmark(
  raw: RawCompetitorData | null,
  yourOverallScore: number,
  yourEvidence: EvidenceSummary,
  yourPlatform: string,
  siteType: 'ecommerce' | 'services' = 'services'
): CompetitorBenchmark | null {
  if (!raw) return null;

  if (raw.isUnavailable) {
    return {
      competitorDomain: raw.domain,
      competitorUrl: raw.normalizedUrl,
      isUnavailable: true,
      unavailableReason: raw.unavailableReason,
      yourScore: yourOverallScore,
      competitorScore: 0,
      scoreDiff: yourOverallScore,
      winner: 'you',
      verdict: `Twoja witryna jest stabilna i dostępna (wynik ${yourOverallScore}/100), podczas gdy serwer konkurenta (${raw.domain}) odmówił odpowiedzi lub zablokował ruch.`,
      strategicAdvice: 'Niestabilność infrastruktury lub zbyt agresywny firewall rywala powodują bezpośrednie odrzucenie klientów z reklam. To idealny moment na przejęcie jego rynku.'
    };
  }

  const scoreDiff = yourOverallScore - raw.competitorScore;
  const winner: 'you' | 'competitor' | 'tie' =
    scoreDiff > 3 ? 'you' : scoreDiff < -3 ? 'competitor' : 'tie';

  const yourTtfb = yourEvidence.avgResponseTimeMs || 120;
  const yourAddToCart = yourEvidence.adsAndTracking.hasAddToCartTracking;
  const yourConsent = yourEvidence.adsAndTracking.hasConsentModeV2;
  const yourExpress = yourEvidence.adsAndTracking.hasExpressPayments || false;
  const yourSchema = yourEvidence.adsAndTracking.hasProductSchema || false;

  const metrics: CompetitorMetrics = {
    ttfb: {
      yourValue: yourTtfb,
      competitorValue: raw.competitorTtfb,
      winner: yourTtfb < raw.competitorTtfb ? 'you' : yourTtfb > raw.competitorTtfb ? 'competitor' : 'tie'
    },
    platform: {
      yourPlatform,
      competitorPlatform: raw.competitorPlatform
    },
    addToCartTracking: {
      yourStatus: yourAddToCart,
      competitorStatus: raw.hasAddToCart,
      winner: yourAddToCart === raw.hasAddToCart ? 'tie' : yourAddToCart ? 'you' : 'competitor'
    },
    consentModeV2: {
      yourStatus: yourConsent,
      competitorStatus: raw.hasConsentMode,
      winner: yourConsent === raw.hasConsentMode ? 'tie' : yourConsent ? 'you' : 'competitor'
    },
    expressPayments: {
      yourStatus: yourExpress,
      competitorStatus: raw.hasExpressPayments,
      winner: yourExpress === raw.hasExpressPayments ? 'tie' : yourExpress ? 'you' : 'competitor'
    },
    productSchema: {
      yourStatus: yourSchema,
      competitorStatus: raw.hasProductSchema,
      winner: yourSchema === raw.hasProductSchema ? 'tie' : yourSchema ? 'you' : 'competitor'
    },
    securityWaf: {
      yourStatus: (yourEvidence.adsAndTracking.hasFormSpamProtection || false),
      competitorStatus: raw.hasCsp || raw.isWaf,
      winner: 'tie'
    }
  };

  let verdict = '';
  let strategicAdvice = '';

  if (winner === 'you') {
    verdict = `Twój serwis wyprzedza ${raw.domain} o ${scoreDiff} punktów. Posiadasz nowocześniejszą architekturę i wyższą odporność inżynieryjną.`;
    if (!raw.hasAddToCart && siteType === 'ecommerce') {
      strategicAdvice = `Konkurent nie śledzi zdarzenia add_to_cart, przez co przepala budżety na Google i Meta Ads. To idealny moment na agresywne przejęcie jego klientów w płatnych kampaniach.`;
    } else {
      strategicAdvice = `Utrzymaj przewagę technologiczną i skup się na skalowaniu ruchu oraz konwersji, bo Twoja witryna jest wyraźnie lepiej zoptymalizowana.`;
    }
  } else if (winner === 'competitor') {
    const gap = Math.abs(scoreDiff);
    verdict = `Konkurent (${raw.domain}) wyprzedza Cię o ${gap} punktów pod kątem szybkości i warstwy telemetrycznej.`;
    if (raw.hasAddToCart && !yourAddToCart) {
      strategicAdvice = `Rywal ma precyzyjnie skonfigurowany Smart Bidding i remarketing koszykowy, przez co kupuje ruch taniej. Wdrożenie warstwy telemetrycznej w 24h zniweluje tę stratę.`;
    } else {
      strategicAdvice = `Optymalizacja czasu odpowiedzi serwera oraz uzupełnienie brakujących mikrodanych pozwoli Ci przegonić konkurenta w wynikach wyszukiwania w ciągu 14 dni.`;
    }
  } else {
    verdict = `Oba serwisy reprezentują zbliżony standard inżynieryjny (różnica poniżej 3 punktów).`;
    strategicAdvice = `O zwycięstwie decydują detale: mikrosekundy czasu ładowania, wdrożenie One-Click checkoutu (BLIK) oraz automatyzacje AI lejków sprzedażowych.`;
  }

  return {
    competitorDomain: raw.domain,
    competitorUrl: raw.normalizedUrl,
    isUnavailable: false,
    yourScore: yourOverallScore,
    competitorScore: raw.competitorScore,
    scoreDiff,
    winner,
    metrics,
    verdict,
    strategicAdvice
  };
}
