import { describe, it, expect } from 'vitest';
import {
  CHECKPOINTS_CATALOG,
  evaluateAllCheckpoints
} from '@/app/api/audit-master/utils/checkpointsCatalog';
import {
  EvidenceSummary,
  PageAuditResult,
  DetailedCodeSmells
} from '@/app/api/audit-master/types';

describe('Audit Master: 80 Checkpoints Engine & ROI Benefits', () => {
  it('should have exactly 80 structured checkpoints in the knowledge base catalog', () => {
    const keys = Object.keys(CHECKPOINTS_CATALOG);
    expect(keys.length).toBe(80);
  });

  it('every checkpoint must have a non-empty business benefit, impact, and developer solution', () => {
    for (const [id, cp] of Object.entries(CHECKPOINTS_CATALOG)) {
      expect(cp.id).toBe(id);
      expect(cp.name).toBeTruthy();
      expect(cp.category).toBeTruthy();
      expect(['tracking_ads', 'ecommerce_cro', 'seo_indexing', 'performance_vitals', 'ux_mobile', 'security_compliance']).toContain(cp.category);
      expect(cp.businessBenefit.length).toBeGreaterThan(15);
      expect(cp.businessImpact.length).toBeGreaterThan(15);
      expect(cp.developerSolution.length).toBeGreaterThan(15);
    }
  });

  it('correctly evaluates healthy Next.js website (kajaki-u-macka.pl case: 614 DOM elements, 0 page builders)', () => {
    const mockEvidence: EvidenceSummary = {
      totalPages: 8,
      avgResponseTimeMs: 140,
      status200Count: 8,
      redirectsCount: 0,
      errorsCount: 0,
      noIndexCount: 0,
      missingTitleCount: 0,
      duplicateTitleGroups: [],
      missingMetaCount: 0,
      avgMetaLength: 145,
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
        hasCartButtons: false,
        hasLeadForms: true,
        hasClickableContacts: true,
        hasClickToCallTracking: true,
        hasFormSpamProtection: true,
        hasOpenGraph: true,
        adBudgetLeakRisk: 'none',
        issues: []
      },
      categoriesSummary: {
        overall: { goodCount: 8, warnCount: 0, badCount: 0 }
      }
    };

    const mockPages: PageAuditResult[] = [];
    const mockCodeSmells: DetailedCodeSmells = {
      jquery: false,
      badScripts: 0,
      domElements: 614, // 614 elementów DOM – super lekki wynik!
      inlineStyles: 12,
      pageBuilders: [],
      trackers: []
    };

    const rootData = {
      detectedPlatform: 'Next.js / React (Serverless Edge)',
      securityScore: 85,
      performanceScore: 92,
      seoScore: 95,
      wafDetected: true
    };

    const { evals, stats } = evaluateAllCheckpoints(
      mockEvidence,
      mockPages,
      mockCodeSmells,
      'services',
      rootData
    );

    expect(evals.length).toBe(64);
    expect(stats.total).toBe(64);
    expect(stats.passed + stats.warning + stats.failed).toBe(64);

    // Weryfikacja kalibracji DOM: 614 elementów to status 'passed' (nie ma ostrzeżenia o długu)
    const domEval = evals.find(e => e.id === 'perf-dom-size');
    expect(domEval?.status).toBe('passed');
    expect(domEval?.metric).toContain('614 elementów DOM');

    // Weryfikacja page builderów: Next.js ma czysty kod
    const builderEval = evals.find(e => e.id === 'perf-pagebuilder-bloat');
    expect(builderEval?.status).toBe('passed');
    expect(builderEval?.metric).toContain('Next.js');

    // Brak wycieków reklamowych (serwis bez reklam)
    const leakEval = evals.find(e => e.id === 'track-ad-leak-risk');
    expect(leakEval?.status).toBe('passed');
  });

  it('correctly flags critical leaks on problematic e-commerce (tropilapka.pl case)', () => {
    const mockEvidence: EvidenceSummary = {
      totalPages: 12,
      avgResponseTimeMs: 780,
      status200Count: 10,
      redirectsCount: 0,
      errorsCount: 2,
      noIndexCount: 0,
      missingTitleCount: 0,
      duplicateTitleGroups: [{ title: 'Legowiska', count: 2, urls: ['/a', '/b'] }],
      missingMetaCount: 3,
      avgMetaLength: 80,
      missingH1Count: 4,
      missingH1Urls: ['/produkt/1', '/produkt/2'],
      thinContentCount: 2,
      thinContentUrls: [],
      missingCanonicalCount: 6,
      missingCanonicalUrls: ['/kategoria/psy'],
      missingAltTotal: 18,
      adsAndTracking: {
        hasGoogleAds: true,
        googleAdsId: 'AW-987654321',
        hasGoogleTagManager: true,
        gtmId: 'GTM-TROPI1',
        hasGA4: true,
        ga4Id: 'G-11223344',
        hasMetaPixel: true,
        metaPixelId: '123456789012345',
        hasTikTokPixel: false,
        hasConsentModeV2: false,
        hasDataLayer: true,
        hasAddToCartTracking: false, // Krytyczny wyciek!
        hasPurchaseTracking: false,
        hasCartButtons: true,
        hasLeadForms: false,
        hasViewItemTracking: false, // Paraliż remarketingu!
        hasProductSchema: false,
        hasOmnibusCompliance: false, // Brak Omnibus!
        hasExpressPayments: false, // Brak BLIK!
        hasClickableContacts: false,
        hasUnclickablePhone: true,
        hasFormSpamProtection: false,
        hasOpenGraph: false,
        variantTimeoutUrls: ['https://tropilapka.pl/produkt/legowisko/?attribute_rozmiar=xl'],
        adBudgetLeakRisk: 'critical',
        issues: []
      },
      categoriesSummary: {
        overall: { goodCount: 3, warnCount: 4, badCount: 5 }
      }
    };

    const mockPages: PageAuditResult[] = [];
    const mockCodeSmells: DetailedCodeSmells = {
      jquery: true,
      badScripts: 8,
      domElements: 2450,
      inlineStyles: 350,
      pageBuilders: ['Divi Builder'],
      trackers: ['Google Tag Manager', 'Meta Pixel']
    };

    const rootData = {
      detectedPlatform: 'WordPress / WooCommerce',
      securityScore: 35,
      performanceScore: 40,
      seoScore: 45,
      wafDetected: false
    };

    const { evals, stats } = evaluateAllCheckpoints(
      mockEvidence,
      mockPages,
      mockCodeSmells,
      'ecommerce',
      rootData
    );

    expect(evals.length).toBe(80);
    expect(stats.total).toBe(80);
    expect(stats.passed + stats.warning + stats.failed).toBe(80);
    expect(stats.failed).toBeGreaterThan(5);
    expect(stats.criticalLeaksCount).toBeGreaterThan(0);

    // Krytyczne punkty kontrolne muszą być 'failed'
    expect(evals.find(e => e.id === 'track-add-to-cart')?.status).toBe('failed');
    expect(evals.find(e => e.id === 'track-consent-mode-v2')?.status).toBe('failed');
    expect(evals.find(e => e.id === 'track-view-item')?.status).toBe('failed');
    expect(evals.find(e => e.id === 'ecom-variant-health')?.status).toBe('failed');
    expect(evals.find(e => e.id === 'ecom-omnibus-compliance')?.status).toBe('failed');
    expect(evals.find(e => e.id === 'seo-h1-presence')?.status).toBe('failed');
    expect(evals.find(e => e.id === 'seo-canonical-presence')?.status).toBe('failed');
    expect(evals.find(e => e.id === 'seo-title-cannibalization')?.status).toBe('failed');
    expect(evals.find(e => e.id === 'ux-clickable-phone')?.status).toBe('failed');
  });

  it('correctly passes ux-clickable-phone for B2B site with contact form and no phone in text (molendadevelopment.pl case)', () => {
    const mockEvidence: EvidenceSummary = {
      totalPages: 9,
      avgResponseTimeMs: 120,
      status200Count: 9,
      redirectsCount: 0,
      errorsCount: 0,
      noIndexCount: 0,
      missingTitleCount: 0,
      duplicateTitleGroups: [],
      missingMetaCount: 0,
      avgMetaLength: 140,
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
        hasDataLayer: true,
        hasAddToCartTracking: false,
        hasPurchaseTracking: false,
        hasCartButtons: false,
        hasLeadForms: true,
        hasClickableContacts: false,
        hasUnclickablePhone: false, // Brak nieklikalnego telefonu w tekście!
        hasClickToCallTracking: false,
        hasFormSpamProtection: true,
        hasOpenGraph: true,
        adBudgetLeakRisk: 'none',
        issues: []
      },
      categoriesSummary: {
        overall: { goodCount: 9, warnCount: 0, badCount: 0 }
      }
    };

    const { evals, stats } = evaluateAllCheckpoints(
      mockEvidence,
      [],
      { jquery: false, badScripts: 0, domElements: 600, inlineStyles: 10, pageBuilders: [], trackers: [] },
      'services',
      { detectedPlatform: 'Next.js / React (Serverless Edge)', performanceScore: 98, securityScore: 90, seoScore: 95, wafDetected: true }
    );

    expect(evals.length).toBe(64);
    expect(stats.total).toBe(64);
    expect(stats.failed).toBe(0);
    expect(stats.criticalLeaksCount).toBe(0);

    const phoneEval = evals.find(e => e.id === 'ux-clickable-phone');
    expect(phoneEval?.status).toBe('passed');
    expect(phoneEval?.metric).toBe('Kontakt online / Formularz');
  });

  it('verifies Next.js App Router detection signatures', () => {
    const nextAppRouterHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" href="/_next/static/css/app.css" />
        </head>
        <body>
          <div id="root">App Router Content</div>
          <script>(self.__next_f=self.__next_f||[]).push([0])</script>
          <div id="next-route-announcer"></div>
        </body>
      </html>
    `;

    const lowerHtml = nextAppRouterHtml.toLowerCase();
    const isNextJs = lowerHtml.includes('/_next/static/') || 
                     lowerHtml.includes('self.__next_f') || 
                     lowerHtml.includes('__next_data__') ||
                     lowerHtml.includes('next-route-announcer');

    expect(isNextJs).toBe(true);
  });
});
