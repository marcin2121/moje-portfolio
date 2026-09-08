import { describe, it, expect } from 'vitest';
import { buildEvidenceSummary, generateQuickCriticalIssues, extractTrackingSignals, PageTrackingSignals } from '../app/api/audit-master/utils/crawler';
import { PageAuditResult } from '../app/api/audit-master/types';
import { generateDeterministicReport } from '../app/api/audit-master/utils/geminiAI';

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

  it('generuje rzetelną syntezę inżynieryjną dla witryny ze 100% czystym SEO (nie wymyśla braków H1 ani canonicali)', () => {
    const page: PageAuditResult = { ...mockPage, url: 'https://molendadevelopment.pl', title: 'Marcin Molenda', canonical: 'https://molendadevelopment.pl', wordCount: 500, isThinContent: false };
    const signals: PageTrackingSignals[] = [{ hasGoogleAds: false, hasGtm: false, hasGa4: false, hasMetaPixel: false, hasTikTokPixel: false, hasConsentModeV2: false, hasDataLayer: true, hasAddToCartTracking: false, hasPurchaseTracking: false, hasCartButtons: false, hasLeadForms: true }];
    const evidence = buildEvidenceSummary([page], signals, 'services');

    const report = generateDeterministicReport(
      'https://molendadevelopment.pl',
      81,
      'Next.js / React (Serverless Edge)',
      13,
      false, // services
      evidence,
      { jquery: false, badScripts: 0, domElements: 1058, inlineStyles: 12, pageBuilders: [], trackers: [] }
    );

    // Nie może halucynować o braku H1 ani o brakujących canonicalach!
    expect(report).not.toContain('brak odpowiednich nagłówków semantycznych');
    expect(report).not.toContain('uporządkuję strukturę nagłówków i canonicali');
    expect(report).not.toContain('add_to_cart');
    // Powinien podkreślić czystą strukturę lub skupić się na telemetrii i renderowaniu DOM
    expect(report).toContain('struktura semantyczna i indeksacja są w 100% czyste');
  });

  it('generuje poprawną gramatycznie deklinację polską dla wykrytych uchybień (np. 2 podstrony bez H1, 1 grupa)', () => {
    const page1: PageAuditResult = { ...mockPage, url: 'https://test.pl/1', h1Count: 0, canonical: null, title: 'Duplikat' };
    const page2: PageAuditResult = { ...mockPage, url: 'https://test.pl/2', h1Count: 0, canonical: null, title: 'Duplikat' };
    const signals: PageTrackingSignals[] = [
      { hasGoogleAds: false, hasGtm: false, hasGa4: false, hasMetaPixel: false, hasTikTokPixel: false, hasConsentModeV2: false, hasDataLayer: false, hasAddToCartTracking: false, hasPurchaseTracking: false, hasCartButtons: false, hasLeadForms: true },
      { hasGoogleAds: false, hasGtm: false, hasGa4: false, hasMetaPixel: false, hasTikTokPixel: false, hasConsentModeV2: false, hasDataLayer: false, hasAddToCartTracking: false, hasPurchaseTracking: false, hasCartButtons: false, hasLeadForms: true }
    ];
    const evidence = buildEvidenceSummary([page1, page2], signals, 'services');

    const report = generateDeterministicReport(
      'https://test.pl',
      60,
      'WordPress',
      25,
      false,
      evidence
    );

    // Poprawna deklinacja w języku polskim
    expect(report).toContain('2 podstrony bez nagłówka H1');
    expect(report).toContain('1 grupę ze zduplikowanymi tagami Title');
    expect(report).toContain('2 adresy bez linku kanonicznego');
  });

  describe('extractTrackingSignals (Parsowanie surowego HTML)', () => {
    it('wykrywa Meta Pixel i wyciąga ID z konfiguracji PixelYourSite (kazus tropilapka.pl)', () => {
      const tropilapkaHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <script type="text/javascript">
              /* <![CDATA[ */
              var pysOptions = {"staticEvents":{"facebook":{"init":[]}},"pixelIds":["2018990982314087"],"dynamicEvents":[]};
              /* ]]> */
            </script>
            <noscript>
              <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2018990982314087&ev=PageView&noscript=1" />
            </noscript>
            <script src="/wp-content/plugins/pixelyoursite/dist/scripts/public.js"></script>
          </head>
          <body>
            <button name="add-to-cart" value="123">Dodaj do koszyka</button>
          </body>
        </html>
      `;

      const signals = extractTrackingSignals(tropilapkaHtml);
      expect(signals.hasMetaPixel).toBe(true);
      expect(signals.metaPixelId).toBe('2018990982314087');
      expect(signals.hasCartButtons).toBe(true);
    });

    it('wykrywa Google Analytics 4 z formatem Google Tag GT- z Google Site Kit (kazus tropilapka.pl)', () => {
      const tropilapkaSiteKitHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://www.googletagmanager.com/gtag/js?id=GT-NGKQSSXM" id="google_gtagjs-js" async></script>
            <script id="google_gtagjs-js-after">
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag("set","linker",{"domains":["tropilapka.pl"]});
              gtag("js", new Date());
              gtag("set", "developer_id.dZTNiMT", true);
              gtag("config", "GT-NGKQSSXM", {"groups":"default"});
            </script>
          </head>
          <body>
            <h1>Tropiłapka</h1>
          </body>
        </html>
      `;

      const signals = extractTrackingSignals(tropilapkaSiteKitHtml);
      expect(signals.hasGa4).toBe(true);
      expect(signals.ga4Id).toBe('GT-NGKQSSXM');
      expect(signals.hasDataLayer).toBe(true);
      // Upewnij się, że NIE zgłasza fałszywego GTM (ponieważ jest to gtag/js, a nie kontener GTM!)
      expect(signals.hasGtm).toBe(false);
      expect(signals.gtmId).toBeUndefined();
    });

    it('wykrywa standardowy kontener GTM, gdy zainstalowano gtm.js z kodem GTM-', () => {
      const gtmHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K39X9WZ');</script>
          </head>
          <body></body>
        </html>
      `;

      const signals = extractTrackingSignals(gtmHtml);
      expect(signals.hasGtm).toBe(true);
      expect(signals.gtmId).toBe('GTM-K39X9WZ');
    });

    it('nie generuje fałszywego hasAddToCartTracking ze zwykłych klas CSS WooCommerce (.add_to_cart_button) ani tablic konfiguracyjnych (kazus tropilapka.pl)', () => {
      const wooCommerceButtonHtml = `
        <html>
          <body>
            <div class="product">
              <a href="?add-to-cart=99" class="button product_type_simple add_to_cart_button ajax_add_to_cart">Dodaj do koszyka</a>
              <script>
                window._googlesitekit = { wcdata: { eventsToTrack: ["add_to_cart","purchase"] } };
                var cartbounty = { custom_button_selectors: ".cartbounty-add-to-cart, .add_to_cart_button" };
              </script>
            </div>
          </body>
        </html>
      `;

      const signals = extractTrackingSignals(wooCommerceButtonHtml);
      expect(signals.hasCartButtons).toBe(true);
      // Nie może być uznane za add_to_cart tracking, dopóki nie ma realnej emisji eventu JS!
      expect(signals.hasAddToCartTracking).toBe(false);
      expect(signals.hasPurchaseTracking).toBe(false);
    });

    it('poprawnie wykrywa rzeczywistą emisję add_to_cart przez dataLayer.push lub fbq/gtag', () => {
      const dataLayerHtml = `
        <script>
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'add_to_cart',
            ecommerce: {
              currency: 'PLN',
              value: 149.00,
              items: [{ item_id: 'LEG-1', item_name: 'Legowisko' }]
            }
          });
        </script>
      `;
      expect(extractTrackingSignals(dataLayerHtml).hasAddToCartTracking).toBe(true);

      const fbqHtml = `<script>fbq('track', 'AddToCart', { content_name: 'Legowisko', value: 149, currency: 'PLN' });</script>`;
      expect(extractTrackingSignals(fbqHtml).hasAddToCartTracking).toBe(true);

      const gtagHtml = `<script>gtag('event', 'add_to_cart', { items: [{ id: '123' }] });</script>`;
      expect(extractTrackingSignals(gtagHtml).hasAddToCartTracking).toBe(true);
    });
  });
});

