import { describe, it, expect } from 'vitest';
import {
  fetchCompetitorData,
  buildCompetitorBenchmark,
  RawCompetitorData
} from '@/app/api/audit-master/utils/competitorAnalyzer';
import { notifyAuditGenerated, notifyLeadReceived } from '@/app/api/audit-master/utils/discordNotifier';
import { EvidenceSummary } from '@/app/api/audit-master/types';

describe('Audit Master: Head-to-Head Competitor Benchmark & Discord Engine', () => {
  const mockEvidence: EvidenceSummary = {
    totalPages: 10,
    avgResponseTimeMs: 110,
    status200Count: 10,
    redirectsCount: 0,
    errorsCount: 0,
    noIndexCount: 0,
    missingTitleCount: 0,
    duplicateTitleGroups: [],
    missingMetaCount: 0,
    avgMetaLength: 150,
    missingH1Count: 0,
    missingH1Urls: [],
    thinContentCount: 0,
    thinContentUrls: [],
    missingCanonicalCount: 0,
    missingCanonicalUrls: [],
    missingAltTotal: 0,
    adsAndTracking: {
      hasGoogleAds: true,
      hasGoogleTagManager: true,
      hasGA4: true,
      hasMetaPixel: true,
      hasTikTokPixel: false,
      hasConsentModeV2: true,
      hasDataLayer: true,
      hasAddToCartTracking: true,
      hasPurchaseTracking: true,
      hasCartButtons: true,
      hasLeadForms: true,
      hasFormSpamProtection: true,
      hasExpressPayments: true,
      hasProductSchema: true,
      adBudgetLeakRisk: 'none',
      issues: []
    },
    categoriesSummary: {
      overall: { goodCount: 10, warnCount: 0, badCount: 0 }
    }
  };

  it('fetchCompetitorData returns null when competitor url is empty', async () => {
    const result1 = await fetchCompetitorData('');
    const result2 = await fetchCompetitorData(undefined);
    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });

  it('buildCompetitorBenchmark returns null when raw data is null', () => {
    const benchmark = buildCompetitorBenchmark(null, 85, mockEvidence, 'Next.js');
    expect(benchmark).toBeNull();
  });

  it('gracefully handles competitor downtime / WAF block with graceful fallback', () => {
    const unavailableRaw: RawCompetitorData = {
      domain: 'rywal-zablokowany.pl',
      normalizedUrl: 'https://rywal-zablokowany.pl',
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
      unavailableReason: 'Serwer konkurenta odmówił połączenia (błąd 403 / Cloudflare Challenge).'
    };

    const benchmark = buildCompetitorBenchmark(unavailableRaw, 85, mockEvidence, 'Next.js');
    expect(benchmark).not.toBeNull();
    expect(benchmark?.isUnavailable).toBe(true);
    expect(benchmark?.winner).toBe('you');
    expect(benchmark?.verdict).toContain('Twoja witryna jest stabilna i dostępna');
    expect(benchmark?.strategicAdvice).toContain('przejęcie jego rynku');
  });

  it('correctly calculates victory when client has superior metrics and score', () => {
    const competitorRaw: RawCompetitorData = {
      domain: 'wolny-sklep.pl',
      normalizedUrl: 'https://wolny-sklep.pl',
      competitorTtfb: 750,
      competitorPlatform: 'WordPress / WooCommerce',
      isWaf: false,
      hasAddToCart: false,
      hasConsentMode: false,
      hasExpressPayments: false,
      hasProductSchema: false,
      hasCsp: false,
      competitorScore: 45
    };

    const benchmark = buildCompetitorBenchmark(competitorRaw, 88, mockEvidence, 'Next.js App Router', 'ecommerce');
    expect(benchmark).not.toBeNull();
    expect(benchmark?.winner).toBe('you');
    expect(benchmark?.scoreDiff).toBe(43);
    expect(benchmark?.metrics?.ttfb.winner).toBe('you');
    expect(benchmark?.metrics?.addToCartTracking.winner).toBe('you');
    expect(benchmark?.metrics?.consentModeV2.winner).toBe('you');
    expect(benchmark?.strategicAdvice).toContain('nie śledzi zdarzenia add_to_cart');
  });

  it('correctly diagnoses when competitor has lead and advises on recovery in 24-48h', () => {
    const inferiorEvidence: EvidenceSummary = {
      ...mockEvidence,
      avgResponseTimeMs: 900,
      adsAndTracking: {
        ...mockEvidence.adsAndTracking,
        hasAddToCartTracking: false,
        hasConsentModeV2: false
      }
    };

    const strongCompetitorRaw: RawCompetitorData = {
      domain: 'lider-branzy.pl',
      normalizedUrl: 'https://lider-branzy.pl',
      competitorTtfb: 150,
      competitorPlatform: 'Shopify SaaS',
      isWaf: true,
      hasAddToCart: true,
      hasConsentMode: true,
      hasExpressPayments: true,
      hasProductSchema: true,
      hasCsp: true,
      competitorScore: 92
    };

    const benchmark = buildCompetitorBenchmark(strongCompetitorRaw, 52, inferiorEvidence, 'WordPress', 'ecommerce');
    expect(benchmark).not.toBeNull();
    expect(benchmark?.winner).toBe('competitor');
    expect(benchmark?.scoreDiff).toBe(-40);
    expect(benchmark?.metrics?.addToCartTracking.winner).toBe('competitor');
    expect(benchmark?.strategicAdvice).toContain('Smart Bidding');
  });

  it('discord notifier executes fire-and-forget without throwing error even without webhook configured', async () => {
    // Testuje odporność na brak DISCORD_WEBHOOK_URL lub błędy sieciowe
    await expect(notifyAuditGenerated({
      domain: 'test-sklep.pl',
      token: 'abcd1234efgh5678',
      overallScore: 82,
      lossPercentage: 12,
      detectedPlatform: 'Next.js',
      siteType: 'ecommerce',
      competitorDomain: 'rywal.pl',
      competitorScore: 65
    })).resolves.not.toThrow();

    await expect(notifyLeadReceived({
      domain: 'test-sklep.pl',
      email: 'klient@test-sklep.pl',
      phone: '+48 500 600 700',
      token: 'abcd1234efgh5678',
      notes: 'Zależy mi na audycie i wdrożeniu BLIK oraz add_to_cart.'
    })).resolves.not.toThrow();
  });
});
