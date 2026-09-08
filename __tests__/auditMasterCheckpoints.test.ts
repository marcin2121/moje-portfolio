import { describe, it, expect } from 'vitest';
import {
  CHECKPOINTS_CATALOG,
  evaluateAllCheckpoints
} from '@/app/api/audit-master/utils/checkpointsCatalog';
import {
  EvidenceSummary,
  PageAuditResult,
  DetailedCodeSmells,
  SITE_TYPE_LABELS
} from '@/app/api/audit-master/types';
import {
  detectAccurateSiteType,
  pluralizePolish,
  PageTrackingSignals
} from '@/app/api/audit-master/utils/crawler';

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

  it('correctly evaluates TTFB thresholds according to Google Core Web Vitals (molenda 672ms passed)', () => {
    const baseEvidence: EvidenceSummary = {
      totalPages: 1,
      avgResponseTimeMs: 672, // molendadevelopment.pl case
      status200Count: 1,
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
        overall: { goodCount: 1, warnCount: 0, badCount: 0 }
      }
    };

    // 1. molenda 672ms -> passed
    const resGood = evaluateAllCheckpoints(
      baseEvidence,
      [],
      { jquery: false, badScripts: 0, domElements: 500, inlineStyles: 0 },
      'services',
      { detectedPlatform: 'Next.js' }
    );
    const evalGood = resGood.evals.find(e => e.id === 'perf-ttfb-server');
    expect(evalGood?.status).toBe('passed');
    expect(evalGood?.metric).toContain('672ms');

    // 2. 950ms -> warning (Needs Improvement)
    const resWarn = evaluateAllCheckpoints(
      { ...baseEvidence, avgResponseTimeMs: 950 },
      [],
      { jquery: false, badScripts: 0, domElements: 500, inlineStyles: 0 },
      'services',
      { detectedPlatform: 'Next.js' }
    );
    const evalWarn = resWarn.evals.find(e => e.id === 'perf-ttfb-server');
    expect(evalWarn?.status).toBe('warning');

    // 3. 2200ms -> failed (Poor)
    const resFail = evaluateAllCheckpoints(
      { ...baseEvidence, avgResponseTimeMs: 2200 },
      [],
      { jquery: false, badScripts: 0, domElements: 500, inlineStyles: 0 },
      'services',
      { detectedPlatform: 'Next.js' }
    );
    const evalFail = resFail.evals.find(e => e.id === 'perf-ttfb-server');
    expect(evalFail?.status).toBe('failed');
  });

  it('correctly handles Polish pluralization grammar (1 grupa, 2 grupy, 5 grup)', () => {
    expect(pluralizePolish(1, 'grupa', 'grupy', 'grup')).toBe('1 grupa');
    expect(pluralizePolish(2, 'grupa', 'grupy', 'grup')).toBe('2 grupy');
    expect(pluralizePolish(3, 'grupa', 'grupy', 'grup')).toBe('3 grupy');
    expect(pluralizePolish(4, 'grupa', 'grupy', 'grup')).toBe('4 grupy');
    expect(pluralizePolish(5, 'grupa', 'grupy', 'grup')).toBe('5 grup');
    expect(pluralizePolish(12, 'grupa', 'grupy', 'grup')).toBe('12 grup');
    expect(pluralizePolish(21, 'grupa', 'grupy', 'grup')).toBe('21 grup');
    expect(pluralizePolish(22, 'grupa', 'grupy', 'grup')).toBe('22 grupy');
    expect(pluralizePolish(105, 'grupa', 'grupy', 'grup')).toBe('105 grup');
  });

  describe('3-Level Profile Detection Engine (detectAccurateSiteType)', () => {
    const emptySignals: PageTrackingSignals = {
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
      hasLeadForms: false,
      hasClickablePhone: false,
      hasUnclickablePhone: false,
      hasClickToCallTracking: false,
      hasFormSpamProtection: false,
      hasOpenGraph: false,
      hasProductSchema: false,
      hasExpressPayments: false,
      hasBipLink: false,
      hasDeklaracjaDostepnosci: false,
      hasEdziennik: false,
      hasDonationOrKrs: false,
      hasLocalBusinessSignals: false,
      hasB2bSignals: false
    };

    const createMockPage = (partial: Partial<PageAuditResult>): PageAuditResult => ({
      url: 'https://example.com/',
      category: 'home',
      statusCode: 200,
      responseTimeMs: 100,
      title: 'Example',
      titleLength: 7,
      metaDescription: '',
      metaLength: 0,
      h1Count: 1,
      h1Text: '',
      canonical: null,
      hasSelfCanonical: false,
      wordCount: 100,
      isThinContent: false,
      imagesCount: 0,
      missingAltCount: 0,
      schemas: [],
      hasNoIndex: false,
      internalLinksCount: 0,
      externalLinksCount: 0,
      ...partial
    });

    it('classifies stowarzyszeniekas.pl as ngo_foundation (DOM KRS + donation signals)', () => {
      const mockPages: PageAuditResult[] = [
        createMockPage({
          url: 'https://stowarzyszeniekas.pl/',
          title: 'Stowarzyszenie KAS - Wspieramy rozwój',
          metaDescription: 'Pomagamy dzieciom i młodzieży',
          h1Text: 'Stowarzyszenie KAS',
          wordCount: 450
        })
      ];

      const signals: PageTrackingSignals[] = [
        {
          ...emptySignals,
          hasDonationOrKrs: true,
          hasLeadForms: true
        }
      ];

      const detected = detectAccurateSiteType(mockPages, signals, 'https://stowarzyszeniekas.pl');
      expect(detected.profile).toBe('ngo_foundation');
      expect(detected.label).toBe(SITE_TYPE_LABELS.ngo_foundation);
    });

    it('classifies school domain (sp12.edu.pl) as education', () => {
      const mockPages: PageAuditResult[] = [
        createMockPage({
          url: 'https://sp12.edu.pl/',
          title: 'Szkoła Podstawowa nr 12',
          h1Text: 'Witamy w SP12',
          wordCount: 300
        })
      ];

      const signals: PageTrackingSignals[] = [
        {
          ...emptySignals,
          hasEdziennik: true
        }
      ];

      const detected = detectAccurateSiteType(mockPages, signals, 'https://sp12.edu.pl');
      expect(detected.profile).toBe('education');
      expect(detected.label).toBe(SITE_TYPE_LABELS.education);
    });

    it('classifies public administration (.gov.pl / BIP) as gov_public', () => {
      const mockPages: PageAuditResult[] = [
        createMockPage({
          url: 'https://ug-wieliczka.gov.pl/',
          title: 'Urząd Gminy Wieliczka - BIP',
          h1Text: 'Biuletyn Informacji Publicznej',
          wordCount: 800
        })
      ];

      const signals: PageTrackingSignals[] = [
        {
          ...emptySignals,
          hasBipLink: true,
          hasDeklaracjaDostepnosci: true
        }
      ];

      const detected = detectAccurateSiteType(mockPages, signals, 'https://ug-wieliczka.gov.pl');
      expect(detected.profile).toBe('gov_public');
      expect(detected.label).toBe(SITE_TYPE_LABELS.gov_public);
    });

    it('classifies ecommerce when cart and checkout buttons are detected', () => {
      const mockPages: PageAuditResult[] = [
        createMockPage({
          url: 'https://moj-sklep.pl/',
          title: 'Super Sklep - Kup online',
          h1Text: 'Bestsellery w super cenach',
          wordCount: 500
        })
      ];

      const signals: PageTrackingSignals[] = [
        {
          ...emptySignals,
          hasCartButtons: true,
          hasAddToCartTracking: true,
          hasProductSchema: true
        }
      ];

      const detected = detectAccurateSiteType(mockPages, signals, 'https://moj-sklep.pl');
      expect(detected.profile).toBe('ecommerce');
      expect(detected.label).toBe(SITE_TYPE_LABELS.ecommerce);
    });
  });

  describe('Conditional Checkpoint Evaluations per Profile', () => {
    it('marks Consent Mode v2 & Ad leak as PASSED for NGO without active Google Ads', () => {
      const ngoEvidence: EvidenceSummary = {
        totalPages: 10,
        avgResponseTimeMs: 100,
        status200Count: 10,
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
        detectedProfile: 'ngo_foundation',
        profileSignals: {
          hasDonationOrKrs: true,
          hasBipLink: false,
          hasDeklaracjaDostepnosci: false,
          hasEdziennik: false,
          hasLocalBusinessSignals: false,
          hasB2bSignals: false
        },
        adsAndTracking: {
          hasGoogleAds: false, // Brak reklam Google Ads!
          hasGoogleTagManager: true,
          hasGA4: true, // Jest tylko GA4
          hasMetaPixel: false,
          hasTikTokPixel: false,
          hasConsentModeV2: false,
          hasDataLayer: true,
          hasAddToCartTracking: false,
          hasPurchaseTracking: false,
          hasCartButtons: false,
          hasLeadForms: true,
          hasClickableContacts: true,
          hasClickToCallTracking: true,
          hasFormSpamProtection: false,
          hasOpenGraph: true,
          adBudgetLeakRisk: 'none',
          issues: []
        },
        categoriesSummary: {
          overall: { goodCount: 10, warnCount: 0, badCount: 0 }
        }
      };

      const { evals } = evaluateAllCheckpoints(
        ngoEvidence,
        [],
        { jquery: false, badScripts: 0, domElements: 500, inlineStyles: 0 },
        'ngo_foundation',
        { detectedPlatform: 'Next.js' }
      );

      // Consent Mode v2 nie może być oznaczony jako błąd krytyczny dla NGO bez reklam!
      const consentEval = evals.find(e => e.id === 'track-consent-mode-v2');
      expect(consentEval?.status).toBe('passed');
      expect(consentEval?.metric).toContain('Czystość telemetryczna (Brak komercyjnych pikseli)');

      // Ad leak risk musi być passed (brak wycieków z reklam)
      const adLeakEval = evals.find(e => e.id === 'track-ad-leak-risk');
      expect(adLeakEval?.status).toBe('passed');
      expect(adLeakEval?.metric).toContain('Brak wycieków budżetu');
    });

    it('enforces Deklaracja Dostępności WCAG 2.1 AA for gov_public in sec-terms-of-service', () => {
      const govEvidenceMissingDeklaracja: EvidenceSummary = {
        totalPages: 5,
        avgResponseTimeMs: 120,
        status200Count: 5,
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
        detectedProfile: 'gov_public',
        profileSignals: {
          hasBipLink: true,
          hasDeklaracjaDostepnosci: false, // Brak deklaracji dostępności!
          hasEdziennik: false,
          hasDonationOrKrs: false,
          hasLocalBusinessSignals: false,
          hasB2bSignals: false
        },
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
          overall: { goodCount: 5, warnCount: 0, badCount: 0 }
        }
      };

      const resultFail = evaluateAllCheckpoints(
        govEvidenceMissingDeklaracja,
        [],
        { jquery: false, badScripts: 0, domElements: 500, inlineStyles: 0 },
        'gov_public',
        { detectedPlatform: 'Własny kod' }
      );

      const termsEvalFail = resultFail.evals.find(e => e.id === 'sec-terms-of-service');
      expect(termsEvalFail?.status).toBe('failed');
      expect(termsEvalFail?.metric).toContain('Brak Deklaracji Dostępności WCAG');

      // Teraz z deklaracją dostępności:
      const govEvidenceWithDeklaracja: EvidenceSummary = {
        ...govEvidenceMissingDeklaracja,
        profileSignals: {
          ...govEvidenceMissingDeklaracja.profileSignals!,
          hasDeklaracjaDostepnosci: true
        }
      };

      const resultPass = evaluateAllCheckpoints(
        govEvidenceWithDeklaracja,
        [],
        { jquery: false, badScripts: 0, domElements: 500, inlineStyles: 0 },
        'gov_public',
        { detectedPlatform: 'Własny kod' }
      );

      const termsEvalPass = resultPass.evals.find(e => e.id === 'sec-terms-of-service');
      expect(termsEvalPass?.status).toBe('passed');
      expect(termsEvalPass?.metric).toContain('Deklaracja Dostępności WCAG');
    });
  });
});
