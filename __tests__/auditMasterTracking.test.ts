import { describe, it, expect } from 'vitest';
import { buildEvidenceSummary, generateQuickCriticalIssues, PageTrackingSignals } from '../app/api/audit-master/utils/crawler';
import { PageAuditResult } from '../app/api/audit-master/types';

describe('Audit Master: Telemetria Reklamowa i Wykrywanie Wycieków Budżetu', () => {
  const mockPage: PageAuditResult = {
    url: 'https://sklep-testowy.pl/produkt/buty',
    category: 'product',
    statusCode: 200,
    responseTimeMs: 95,
    title: 'Wygodne Buty Skórzane',
    titleLength: 22,
    metaDescription: 'Kup najlepsze buty online',
    metaLength: 26,
    h1Count: 1,
    h1Text: 'Buty Skórzane',
    canonical: 'https://sklep-testowy.pl/produkt/buty',
    hasSelfCanonical: true,
    wordCount: 350,
    isThinContent: false,
    imagesCount: 4,
    missingAltCount: 0,
    schemas: ['Product'],
    hasNoIndex: false,
    internalLinksCount: 12,
    externalLinksCount: 2
  };

  it('wykrywa krytyczny wyciek budżetu reklamowego, gdy sklep ma Google Ads i koszyk, ale brak add_to_cart (kazus tropilapka.pl)', () => {
    const signals: PageTrackingSignals[] = [
      {
        hasGoogleAds: true,
        googleAdsId: 'AW-1122334455',
        hasGtm: true,
        gtmId: 'GTM-ABC1234',
        hasGa4: true,
        ga4Id: 'G-XYZ9876',
        hasMetaPixel: false,
        hasTikTokPixel: false,
        hasConsentModeV2: true,
        hasDataLayer: true,
        hasAddToCartTracking: false, // BŁĄD: koszyk nie wysyła add_to_cart!
        hasPurchaseTracking: false,
        hasCartButtons: true, // Są przyciski "Dodaj do koszyka"
        hasLeadForms: false
      }
    ];

    const evidence = buildEvidenceSummary([mockPage], signals);

    expect(evidence.adsAndTracking.hasGoogleAds).toBe(true);
    expect(evidence.adsAndTracking.googleAdsId).toBe('AW-1122334455');
    expect(evidence.adsAndTracking.hasAddToCartTracking).toBe(false);
    expect(evidence.adsAndTracking.adBudgetLeakRisk).toBe('critical');

    const leakIssue = evidence.adsAndTracking.issues.find(i => i.id === 'leak-add-to-cart');
    expect(leakIssue).toBeDefined();
    expect(leakIssue?.severity).toBe('critical');
    expect(leakIssue?.impact).toContain('Smart Bidding');
    expect(leakIssue?.developerSolution).toContain('Wdrożę');
  });

  it('wykrywa brak Google Consent Mode v2 przy aktywnym GA4/Google Ads', () => {
    const signals: PageTrackingSignals[] = [
      {
        hasGoogleAds: true,
        googleAdsId: 'AW-9999999',
        hasGtm: false,
        hasGa4: true,
        ga4Id: 'G-1111111',
        hasMetaPixel: false,
        hasTikTokPixel: false,
        hasConsentModeV2: false, // BŁĄD: brak Consent Mode v2
        hasDataLayer: false,
        hasAddToCartTracking: true,
        hasPurchaseTracking: true,
        hasCartButtons: true,
        hasLeadForms: false
      }
    ];

    const evidence = buildEvidenceSummary([mockPage], signals);
    expect(evidence.adsAndTracking.hasConsentModeV2).toBe(false);

    const consentIssue = evidence.adsAndTracking.issues.find(i => i.id === 'leak-consent-mode-v2');
    expect(consentIssue).toBeDefined();
    expect(consentIssue?.severity).toBe('critical');
  });

  it('generuje QuickCriticalIssues z priorytetem dla wycieków budżetu i auto-kanibalizacji SEO', () => {
    const duplicatePage1: PageAuditResult = { ...mockPage, url: 'https://sklep.pl/p1', title: 'Identyczny Tytuł' };
    const duplicatePage2: PageAuditResult = { ...mockPage, url: 'https://sklep.pl/p2', title: 'Identyczny Tytuł' };

    const signals: PageTrackingSignals[] = [
      {
        hasGoogleAds: true,
        googleAdsId: 'AW-55555',
        hasGtm: true,
        hasGa4: true,
        hasMetaPixel: true,
        hasTikTokPixel: false,
        hasConsentModeV2: true,
        hasDataLayer: false,
        hasAddToCartTracking: false,
        hasPurchaseTracking: false,
        hasCartButtons: true,
        hasLeadForms: false
      }
    ];

    const evidence = buildEvidenceSummary([duplicatePage1, duplicatePage2], signals);
    const quickIssues = generateQuickCriticalIssues(evidence, undefined, 'ecommerce');

    expect(quickIssues.length).toBeGreaterThanOrEqual(2);

    // Pierwszy problem to wyciek budżetu reklamowego
    expect(quickIssues[0].type).toBe('tracking');
    expect(quickIssues[0].severity).toBe('critical');
    expect(quickIssues[0].developerAction).toContain('Wdrożę');

    // Drugi problem to auto-kanibalizacja zduplikowanych tytułów z poprawną polską gramatyką (1 grupa)
    expect(quickIssues[1].type).toBe('seo');
    expect(quickIssues[1].title).toBe('Auto-kanibalizacja w Google: 1 grupa identycznych tagów Title');
    expect(quickIssues[1].shortDesc).toContain('2 podstrony posiadają identyczne tytuły');
    expect(quickIssues[1].developerAction).toContain('Zaimplementuję');
    expect(quickIssues[1].affectedCount).toBe(2);
  });

  it('nie generuje błędu add_to_cart dla witryn bez koszyka (np. portfolio lub serwisy usługowe B2B)', () => {
    const signals: PageTrackingSignals[] = [
      {
        hasGoogleAds: false,
        hasGtm: false,
        hasGa4: false,
        hasMetaPixel: false,
        hasTikTokPixel: false,
        hasConsentModeV2: false,
        hasDataLayer: false,
        hasAddToCartTracking: false,
        hasPurchaseTracking: false,
        hasCartButtons: false, // Brak koszyka!
        hasLeadForms: true
      }
    ];

    const evidence = buildEvidenceSummary([mockPage], signals);
    expect(evidence.adsAndTracking.hasCartButtons).toBe(false);
    expect(evidence.adsAndTracking.issues.some(i => i.id === 'leak-add-to-cart')).toBe(false);
    expect(evidence.adsAndTracking.adBudgetLeakRisk).toBe('none');
  });

  it('potwierdza 100% canonical, 0 duplikatów title i 0 thin content dla poprawnie skonfigurowanych stron', () => {
    const page1: PageAuditResult = { ...mockPage, url: 'https://molendadevelopment.pl', title: 'Marcin Molenda | Precyzyjne Systemy', canonical: 'https://molendadevelopment.pl', wordCount: 450, isThinContent: false };
    const page2: PageAuditResult = { ...mockPage, url: 'https://molendadevelopment.pl/wdrozenia', title: 'Case Studies i Wdrożenia Headless', canonical: 'https://molendadevelopment.pl/wdrozenia', wordCount: 420, isThinContent: false };
    const page3: PageAuditResult = { ...mockPage, url: 'https://molendadevelopment.pl/narzedzia', title: 'Bezpłatne Narzędzia Inżynieryjne', canonical: 'https://molendadevelopment.pl/narzedzia', wordCount: 370, isThinContent: false };
    const page4: PageAuditResult = { ...mockPage, url: 'https://molendadevelopment.pl/polityka-prywatnosci', title: 'Polityka Prywatności i RODO', canonical: 'https://molendadevelopment.pl/polityka-prywatnosci', wordCount: 420, isThinContent: false };

    const signals: PageTrackingSignals[] = [
      { hasGoogleAds: false, hasGtm: false, hasGa4: false, hasMetaPixel: false, hasTikTokPixel: false, hasConsentModeV2: false, hasDataLayer: false, hasAddToCartTracking: false, hasPurchaseTracking: false, hasCartButtons: false, hasLeadForms: true },
      { hasGoogleAds: false, hasGtm: false, hasGa4: false, hasMetaPixel: false, hasTikTokPixel: false, hasConsentModeV2: false, hasDataLayer: false, hasAddToCartTracking: false, hasPurchaseTracking: false, hasCartButtons: false, hasLeadForms: false },
      { hasGoogleAds: false, hasGtm: false, hasGa4: false, hasMetaPixel: false, hasTikTokPixel: false, hasConsentModeV2: false, hasDataLayer: false, hasAddToCartTracking: false, hasPurchaseTracking: false, hasCartButtons: false, hasLeadForms: false },
      { hasGoogleAds: false, hasGtm: false, hasGa4: false, hasMetaPixel: false, hasTikTokPixel: false, hasConsentModeV2: false, hasDataLayer: false, hasAddToCartTracking: false, hasPurchaseTracking: false, hasCartButtons: false, hasLeadForms: false }
    ];

    const evidence = buildEvidenceSummary([page1, page2, page3, page4], signals, 'services');
    expect(evidence.missingCanonicalCount).toBe(0);
    expect(evidence.missingCanonicalUrls).toHaveLength(0);
    expect(evidence.duplicateTitleGroups).toHaveLength(0);
    expect(evidence.thinContentCount).toBe(0);
    expect(evidence.thinContentUrls).toHaveLength(0);

    const quickIssues = generateQuickCriticalIssues(evidence, undefined, 'services');
    expect(quickIssues.some(i => i.id === 'quick-missing-canonical')).toBe(false);
    expect(quickIssues.some(i => i.id === 'quick-duplicate-titles')).toBe(false);
    expect(quickIssues.some(i => i.id === 'quick-thin-content')).toBe(false);
  });
});
