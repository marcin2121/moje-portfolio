import { describe, it, expect } from 'vitest';
import {
  PageAuditResult,
  DetailedCodeSmells,
  SiteType
} from '../app/api/audit-master/types';
import {
  detectAccurateSiteType,
  buildEvidenceSummary,
  generateQuickCriticalIssues,
  PageTrackingSignals
} from '../app/api/audit-master/utils/crawler';
import {
  evaluateAllCheckpoints,
  CHECKPOINTS_CATALOG
} from '../app/api/audit-master/utils/checkpointsCatalog';
import { generateDeterministicReport } from '../app/api/audit-master/utils/geminiAI';
import { allocateExactPoints } from '../components/audyt/MissingPointsRoadmap';

interface AuditScenarioConfig {
  id: number;
  domain: string;
  siteType: SiteType;
  platform: string;
  pageCount: number;
  avgResponseTimeMs: number;
  hasGoogleAds: boolean;
  hasGtm: boolean;
  hasGa4: boolean;
  hasMetaPixel: boolean;
  hasConsentModeV2: boolean;
  hasAddToCartTracking: boolean;
  hasViewItemTracking: boolean;
  hasPurchaseTracking: boolean;
  hasCartButtons: boolean;
  hasLeadForms: boolean;
  hasClickablePhone: boolean;
  hasUnclickablePhone: boolean;
  hasClarity: boolean;
  hasBipLink?: boolean;
  hasDeklaracjaDostepnosci?: boolean;
  hasEdziennik?: boolean;
  hasDonationOrKrs?: boolean;
  missingH1Count: number;
  duplicateTitlesCount: number;
  missingCanonicalCount: number;
  missingAltCount: number;
  domElements: number;
  badScripts: number;
  pageBuilders?: string[];
  jquery?: boolean;
  wafDetected?: boolean;
  securityScore: number;
  expectedMinScore?: number;
  expectedMaxScore?: number;
}

// Generowanie 100 precyzyjnych scenariuszy audytowych dla wszystkich 7 typów stron
function build100AuditScenarios(): AuditScenarioConfig[] {
  const scenarios: AuditScenarioConfig[] = [];
  let id = 1;

  // 1. E-COMMERCE (20 scenariuszy)
  const ecommerceConfigs = [
    { domain: 'motherearth.store', platform: 'Shopify SaaS', pCount: 24, rTime: 790, ads: false, gtm: true, ga4: true, meta: true, consent: true, cartTrack: false, viewTrack: false, purchTrack: false, cartBtn: true, dom: 2811, scripts: 8, builders: [], unclickPhone: true },
    { domain: 'tropilapka.pl', platform: 'WooCommerce / WordPress', pCount: 15, rTime: 1200, ads: true, gtm: true, ga4: true, meta: false, consent: true, cartTrack: false, viewTrack: false, purchTrack: false, cartBtn: true, dom: 2400, scripts: 6, builders: ['Elementor'], unclickPhone: false },
    { domain: 'sklep-obuwniczy-presta.pl', platform: 'PrestaShop', pCount: 20, rTime: 650, ads: true, gtm: false, ga4: true, meta: true, consent: false, cartTrack: false, viewTrack: false, purchTrack: false, cartBtn: true, dom: 1900, scripts: 10, builders: [], unclickPhone: false },
    { domain: 'nextjs-luxury-store.com', platform: 'Next.js (Edge)', pCount: 25, rTime: 65, ads: true, gtm: true, ga4: true, meta: true, consent: true, cartTrack: true, viewTrack: true, purchTrack: true, cartBtn: true, dom: 650, scripts: 0, builders: [], unclickPhone: false },
    { domain: 'hurtownia-b2b-magento.pl', platform: 'Magento', pCount: 30, rTime: 1850, ads: false, gtm: true, ga4: true, meta: false, consent: true, cartTrack: false, viewTrack: false, purchTrack: false, cartBtn: true, dom: 4200, scripts: 18, builders: [], unclickPhone: true },
    { domain: 'eko-kosmetyki-naturalne.pl', platform: 'Shopify SaaS', pCount: 18, rTime: 420, ads: true, gtm: true, ga4: true, meta: true, consent: true, cartTrack: true, viewTrack: true, purchTrack: true, cartBtn: true, dom: 1100, scripts: 2, builders: [], unclickPhone: false },
    { domain: 'meble-design-wood.pl', platform: 'WooCommerce / WordPress', pCount: 12, rTime: 950, ads: false, gtm: false, ga4: true, meta: false, consent: false, cartTrack: false, viewTrack: false, purchTrack: false, cartBtn: true, dom: 2100, scripts: 5, builders: ['WPBakery'], unclickPhone: false },
    { domain: 'zegarki-premium-sklep.pl', platform: 'Shopify SaaS', pCount: 22, rTime: 510, ads: true, gtm: true, ga4: true, meta: true, consent: true, cartTrack: false, viewTrack: true, purchTrack: false, cartBtn: true, dom: 1450, scripts: 4, builders: [], unclickPhone: false },
    { domain: 'elektronika-agd-rtv.pl', platform: 'PrestaShop', pCount: 28, rTime: 1100, ads: true, gtm: true, ga4: true, meta: true, consent: false, cartTrack: false, viewTrack: false, purchTrack: false, cartBtn: true, dom: 3100, scripts: 12, builders: [], unclickPhone: true },
    { domain: 'ksiegarnia-edukacyjna.pl', platform: 'WooCommerce / WordPress', pCount: 16, rTime: 820, ads: false, gtm: true, ga4: true, meta: false, consent: true, cartTrack: false, viewTrack: false, purchTrack: false, cartBtn: true, dom: 1800, scripts: 4, builders: ['Divi'], unclickPhone: false },
    { domain: 'odziez-sportowa-active.pl', platform: 'Shopify SaaS', pCount: 20, rTime: 480, ads: true, gtm: true, ga4: true, meta: true, consent: true, cartTrack: true, viewTrack: true, purchTrack: false, cartBtn: true, dom: 1250, scripts: 3, builders: [], unclickPhone: false },
    { domain: 'kawa-ziarnista-palarnia.pl', platform: 'Shopify SaaS', pCount: 14, rTime: 390, ads: false, gtm: true, ga4: true, meta: false, consent: true, cartTrack: true, viewTrack: true, purchTrack: true, cartBtn: true, dom: 950, scripts: 1, builders: [], unclickPhone: false },
    { domain: 'akcesoria-rowerowe-bike.pl', platform: 'WooCommerce / WordPress', pCount: 22, rTime: 1450, ads: true, gtm: true, ga4: true, meta: true, consent: true, cartTrack: false, viewTrack: false, purchTrack: false, cartBtn: true, dom: 2750, scripts: 9, builders: ['Elementor'], unclickPhone: false },
    { domain: 'bizuteria-recznie-robiona.pl', platform: 'Next.js (Edge)', pCount: 16, rTime: 95, ads: true, gtm: true, ga4: true, meta: true, consent: true, cartTrack: true, viewTrack: true, purchTrack: true, cartBtn: true, dom: 720, scripts: 0, builders: [], unclickPhone: false },
    { domain: 'sklep-zoologiczny-zwierzaki.pl', platform: 'PrestaShop', pCount: 24, rTime: 780, ads: true, gtm: false, ga4: true, meta: false, consent: false, cartTrack: false, viewTrack: false, purchTrack: false, cartBtn: true, dom: 2300, scripts: 7, builders: [], unclickPhone: false },
    { domain: 'herbata-ziolowa-bio.pl', platform: 'Shopify SaaS', pCount: 12, rTime: 440, ads: false, gtm: true, ga4: true, meta: false, consent: true, cartTrack: true, viewTrack: false, purchTrack: false, cartBtn: true, dom: 1050, scripts: 2, builders: [], unclickPhone: false },
    { domain: 'gry-planszowe-sklep.pl', platform: 'WooCommerce / WordPress', pCount: 19, rTime: 890, ads: true, gtm: true, ga4: true, meta: true, consent: true, cartTrack: false, viewTrack: false, purchTrack: false, cartBtn: true, dom: 2150, scripts: 6, builders: ['Elementor'], unclickPhone: false },
    { domain: 'dekoracje-wnetrz-dom.pl', platform: 'Shopify SaaS', pCount: 21, rTime: 520, ads: true, gtm: true, ga4: true, meta: true, consent: true, cartTrack: false, viewTrack: true, purchTrack: false, cartBtn: true, dom: 1600, scripts: 4, builders: [], unclickPhone: true },
    { domain: 'instrumenty-muzyczne-sklep.pl', platform: 'PrestaShop', pCount: 26, rTime: 990, ads: false, gtm: true, ga4: true, meta: false, consent: false, cartTrack: false, viewTrack: false, purchTrack: false, cartBtn: true, dom: 2600, scripts: 8, builders: [], unclickPhone: false },
    { domain: 'artykuly-biurowe-papier.pl', platform: 'Next.js (Edge)', pCount: 20, rTime: 85, ads: true, gtm: true, ga4: true, meta: true, consent: true, cartTrack: true, viewTrack: true, purchTrack: true, cartBtn: true, dom: 680, scripts: 0, builders: [], unclickPhone: false }
  ];

  for (const c of ecommerceConfigs) {
    scenarios.push({
      id: id++,
      domain: c.domain,
      siteType: 'ecommerce',
      platform: c.platform,
      pageCount: c.pCount,
      avgResponseTimeMs: c.rTime,
      hasGoogleAds: c.ads,
      hasGtm: c.gtm,
      hasGa4: c.ga4,
      hasMetaPixel: c.meta,
      hasConsentModeV2: c.consent,
      hasAddToCartTracking: c.cartTrack,
      hasViewItemTracking: c.viewTrack,
      hasPurchaseTracking: c.purchTrack,
      hasCartButtons: c.cartBtn,
      hasLeadForms: false,
      hasClickablePhone: !c.unclickPhone,
      hasUnclickablePhone: c.unclickPhone,
      hasClarity: id % 2 === 0,
      missingH1Count: c.cartTrack ? 0 : 1,
      duplicateTitlesCount: c.cartTrack ? 0 : 1,
      missingCanonicalCount: 0,
      missingAltCount: c.cartTrack ? 2 : 25,
      domElements: c.dom,
      badScripts: c.scripts,
      pageBuilders: c.builders,
      securityScore: 100
    });
  }

  // 2. USŁUGI B2B & DORADZTWO (15 scenariuszy)
  const b2bConfigs = [
    { domain: 'software-house-krakow.io', platform: 'Next.js (Edge)', rTime: 55, dom: 480, scripts: 0, h1Missing: 0, dup: 0 },
    { domain: 'doradztwo-podatkowe-tax.pl', platform: 'WordPress', rTime: 650, dom: 1850, scripts: 5, h1Missing: 1, dup: 1 },
    { domain: 'agencja-reklamowa-creative.pl', platform: 'Next.js (Edge)', rTime: 90, dom: 820, scripts: 0, h1Missing: 0, dup: 0 },
    { domain: 'kancelaria-radcowska-biznes.pl', platform: 'WordPress', rTime: 820, dom: 2100, scripts: 4, h1Missing: 0, dup: 0 },
    { domain: 'consulting-zarzadczy-poland.pl', platform: 'HTML5 / Custom', rTime: 140, dom: 650, scripts: 1, h1Missing: 0, dup: 0 },
    { domain: 'cybersecurity-audyt-it.pl', platform: 'Next.js (Edge)', rTime: 60, dom: 510, scripts: 0, h1Missing: 0, dup: 0 },
    { domain: 'logistyka-spedycja-b2b.pl', platform: 'WordPress', rTime: 920, dom: 2400, scripts: 7, h1Missing: 2, dup: 1 },
    { domain: 'automatyzacja-przemyslowa-ai.pl', platform: 'Next.js (Edge)', rTime: 75, dom: 590, scripts: 0, h1Missing: 0, dup: 0 },
    { domain: 'rekrutacja-it-headhunters.pl', platform: 'WordPress', rTime: 780, dom: 1950, scripts: 6, h1Missing: 0, dup: 0 },
    { domain: 'badania-rynkowe-analytics.pl', platform: 'Next.js (Edge)', rTime: 85, dom: 630, scripts: 0, h1Missing: 0, dup: 0 },
    { domain: 'outsourcing-ksiegowosc-spolki.pl', platform: 'WordPress', rTime: 890, dom: 2200, scripts: 5, h1Missing: 1, dup: 0 },
    { domain: 'zarzadzanie-nieruchomosciami-b2b.pl', platform: 'HTML5 / Custom', rTime: 180, dom: 720, scripts: 1, h1Missing: 0, dup: 0 },
    { domain: 'systemy-erp-wdrozenia.pl', platform: 'WordPress', rTime: 1100, dom: 2800, scripts: 9, h1Missing: 2, dup: 2 },
    { domain: 'tlumaczenia-specjalistyczne-b2b.pl', platform: 'Next.js (Edge)', rTime: 70, dom: 540, scripts: 0, h1Missing: 0, dup: 0 },
    { domain: 'bezpieczenstwo-pracy-bhp-b2b.pl', platform: 'WordPress', rTime: 750, dom: 1750, scripts: 4, h1Missing: 0, dup: 0 }
  ];

  for (const c of b2bConfigs) {
    scenarios.push({
      id: id++,
      domain: c.domain,
      siteType: 'b2b_services',
      platform: c.platform,
      pageCount: 15,
      avgResponseTimeMs: c.rTime,
      hasGoogleAds: true,
      hasGtm: true,
      hasGa4: true,
      hasMetaPixel: false,
      hasConsentModeV2: true,
      hasAddToCartTracking: false,
      hasViewItemTracking: false,
      hasPurchaseTracking: false,
      hasCartButtons: false,
      hasLeadForms: true,
      hasClickablePhone: true,
      hasUnclickablePhone: false,
      hasClarity: true,
      missingH1Count: c.h1Missing,
      duplicateTitlesCount: c.dup,
      missingCanonicalCount: 0,
      missingAltCount: c.h1Missing > 0 ? 8 : 1,
      domElements: c.dom,
      badScripts: c.scripts,
      pageBuilders: c.platform === 'WordPress' ? ['Elementor'] : [],
      securityScore: 100
    });
  }

  // 3. USŁUGI LOKALNE B2C (15 scenariuszy)
  const localConfigs = [
    { domain: 'stomatolog-warszawa-usmiech.pl', platform: 'WordPress', rTime: 720, dom: 1950, scripts: 4, unclick: false },
    { domain: 'hydraulik-poznan-pogotowie.pl', platform: 'HTML5 / Custom', rTime: 120, dom: 450, scripts: 0, unclick: false },
    { domain: 'warsztat-samochodowy-wroclaw.pl', platform: 'WordPress', rTime: 850, dom: 2100, scripts: 6, unclick: true },
    { domain: 'fryzjer-kosmetyczka-gdansk.pl', platform: 'WordPress', rTime: 680, dom: 1800, scripts: 3, unclick: false },
    { domain: 'weterynarz-krakow-klinika.pl', platform: 'Next.js (Edge)', rTime: 70, dom: 620, scripts: 0, unclick: false },
    { domain: 'elektryk-lodz-calodobowo.pl', platform: 'HTML5 / Custom', rTime: 110, dom: 420, scripts: 0, unclick: false },
    { domain: 'klimatyzacja-montaz-katowice.pl', platform: 'WordPress', rTime: 790, dom: 1900, scripts: 5, unclick: false },
    { domain: 'fizjoterapia-masaz-lublin.pl', platform: 'Next.js (Edge)', rTime: 65, dom: 580, scripts: 0, unclick: false },
    { domain: 'auto-szkolar-jazdy-szczecin.pl', platform: 'WordPress', rTime: 920, dom: 2300, scripts: 7, unclick: true },
    { domain: 'okna-drzwi-montaz-bydgoszcz.pl', platform: 'WordPress', rTime: 810, dom: 2050, scripts: 5, unclick: false },
    { domain: 'restauracja-wloska-torun.pl', platform: 'WordPress', rTime: 640, dom: 1650, scripts: 2, unclick: false },
    { domain: 'pomoc-drogowa-autolaweta-radom.pl', platform: 'HTML5 / Custom', rTime: 95, dom: 380, scripts: 0, unclick: false },
    { domain: 'badania-techniczne-stacja-kielce.pl', platform: 'WordPress', rTime: 730, dom: 1850, scripts: 4, unclick: false },
    { domain: 'trener-personalny-silownia-opole.pl', platform: 'Next.js (Edge)', rTime: 80, dom: 550, scripts: 0, unclick: false },
    { domain: 'optyk-okulista-salon-bialystok.pl', platform: 'WordPress', rTime: 770, dom: 1900, scripts: 4, unclick: false }
  ];

  for (const c of localConfigs) {
    scenarios.push({
      id: id++,
      domain: c.domain,
      siteType: 'local_services',
      platform: c.platform,
      pageCount: 10,
      avgResponseTimeMs: c.rTime,
      hasGoogleAds: true,
      hasGtm: true,
      hasGa4: true,
      hasMetaPixel: true,
      hasConsentModeV2: true,
      hasAddToCartTracking: false,
      hasViewItemTracking: false,
      hasPurchaseTracking: false,
      hasCartButtons: false,
      hasLeadForms: true,
      hasClickablePhone: !c.unclick,
      hasUnclickablePhone: c.unclick,
      hasClarity: true,
      missingH1Count: c.unclick ? 1 : 0,
      duplicateTitlesCount: 0,
      missingCanonicalCount: 0,
      missingAltCount: c.unclick ? 15 : 2,
      domElements: c.dom,
      badScripts: c.scripts,
      pageBuilders: c.platform === 'WordPress' ? ['Elementor'] : [],
      securityScore: 100
    });
  }

  // 4. ORGANIZACJE POŻYTKU PUBLICZNEGO / NGO (15 scenariuszy)
  const ngoConfigs = [
    { domain: 'fundacja-pomoc-dzieciom-serce.org.pl', platform: 'WordPress', rTime: 710, krs: true, dom: 1850, scripts: 4 },
    { domain: 'stowarzyszenie-ochrony-zwierzat-azyl.pl', platform: 'Next.js (Edge)', rTime: 65, krs: true, dom: 520, scripts: 0 },
    { domain: 'fundacja-dla-seniora-nadzieja.org.pl', platform: 'WordPress', rTime: 820, krs: true, dom: 2100, scripts: 5 },
    { domain: 'hospicjum-domowe-milosierdzie.pl', platform: 'WordPress', rTime: 690, krs: true, dom: 1750, scripts: 3 },
    { domain: 'ratownictwo-wodne-wopr-mazury.pl', platform: 'HTML5 / Custom', rTime: 120, krs: false, dom: 490, scripts: 0 },
    { domain: 'fundacja-rozwoju-edukacji-przyszlosc.org.pl', platform: 'Next.js (Edge)', rTime: 70, krs: true, dom: 580, scripts: 0 },
    { domain: 'stowarzyszenie-pomocy-niepelnosprawnym.pl', platform: 'WordPress', rTime: 890, krs: true, dom: 2250, scripts: 6 },
    { domain: 'fundacja-ratujmy-lasy-natura.org.pl', platform: 'Next.js (Edge)', rTime: 75, krs: true, dom: 610, scripts: 0 },
    { domain: 'bank-zywnosci-solidarnosc-polska.pl', platform: 'WordPress', rTime: 780, krs: true, dom: 1950, scripts: 4 },
    { domain: 'towarzystwo-przyjaciol-dzieci-oddzial.pl', platform: 'WordPress', rTime: 920, krs: true, dom: 2400, scripts: 7 },
    { domain: 'fundacja-onkologiczna-walka.org.pl', platform: 'Next.js (Edge)', rTime: 80, krs: true, dom: 640, scripts: 0 },
    { domain: 'schronisko-bezdomne-psy-wolontariat.pl', platform: 'WordPress', rTime: 750, krs: true, dom: 1800, scripts: 3 },
    { domain: 'stowarzyszenie-kultury-lokalnej-tradycja.pl', platform: 'HTML5 / Custom', rTime: 150, krs: false, dom: 530, scripts: 1 },
    { domain: 'fundacja-stypendialna-talenty.org.pl', platform: 'WordPress', rTime: 810, krs: true, dom: 2000, scripts: 5 },
    { domain: 'pomoc-humanitarna-misja-pokoj.pl', platform: 'Next.js (Edge)', rTime: 60, krs: true, dom: 500, scripts: 0 }
  ];

  for (const c of ngoConfigs) {
    scenarios.push({
      id: id++,
      domain: c.domain,
      siteType: 'ngo_foundation',
      platform: c.platform,
      pageCount: 12,
      avgResponseTimeMs: c.rTime,
      hasGoogleAds: false,
      hasGtm: true,
      hasGa4: true,
      hasMetaPixel: false,
      hasConsentModeV2: true,
      hasAddToCartTracking: false,
      hasViewItemTracking: false,
      hasPurchaseTracking: false,
      hasCartButtons: false,
      hasLeadForms: true,
      hasClickablePhone: true,
      hasUnclickablePhone: false,
      hasClarity: true,
      hasDonationOrKrs: c.krs,
      missingH1Count: 0,
      duplicateTitlesCount: 0,
      missingCanonicalCount: 0,
      missingAltCount: 4,
      domElements: c.dom,
      badScripts: c.scripts,
      pageBuilders: c.platform === 'WordPress' ? ['Elementor'] : [],
      securityScore: 100
    });
  }

  // 5. URZĄD / ADMINISTRACJA PUBLICZNA - BIP & GOV (15 scenariuszy)
  const govConfigs = [
    { domain: 'bip.um.warszawa.pl', wcag: true, bip: true, rTime: 180, dom: 850, scripts: 0 },
    { domain: 'urzad-gminy-krasnik.gov.pl', wcag: true, bip: true, rTime: 450, dom: 1450, scripts: 2 },
    { domain: 'starostwo-powiatowe-radom.bip.pl', wcag: false, bip: true, rTime: 850, dom: 2100, scripts: 5 },
    { domain: 'urzad-miasta-zielona-gora.gov.pl', wcag: true, bip: true, rTime: 320, dom: 1200, scripts: 1 },
    { domain: 'bip.mops-krakow.pl', wcag: true, bip: true, rTime: 510, dom: 1650, scripts: 3 },
    { domain: 'powiatowy-urzad-pracy-lodz.gov.pl', wcag: false, bip: true, rTime: 920, dom: 2350, scripts: 6 },
    { domain: 'zarzad-drog-miejskich-poznan.pl', wcag: true, bip: true, rTime: 410, dom: 1350, scripts: 2 },
    { domain: 'urzad-marszalkowski-pomorskie.gov.pl', wcag: true, bip: true, rTime: 290, dom: 1100, scripts: 1 },
    { domain: 'bip.gmina-piaseczno.pl', wcag: true, bip: true, rTime: 380, dom: 1250, scripts: 2 },
    { domain: 'komenda-powiatowa-policji-lublin.gov.pl', wcag: true, bip: true, rTime: 340, dom: 1150, scripts: 1 },
    { domain: 'bip.straz-miejska-katowice.pl', wcag: true, bip: true, rTime: 490, dom: 1550, scripts: 3 },
    { domain: 'urzad-stanu-cywilnego-bydgoszcz.gov.pl', wcag: false, bip: true, rTime: 780, dom: 1950, scripts: 4 },
    { domain: 'wojewodzki-inspektorat-ochrony-srodowiska.gov.pl', wcag: true, bip: true, rTime: 430, dom: 1400, scripts: 2 },
    { domain: 'bip.muzeum-narodowe-wroclaw.pl', wcag: true, bip: true, rTime: 560, dom: 1700, scripts: 3 },
    { domain: 'bip.wodociagi-miejskie-szczecin.pl', wcag: true, bip: true, rTime: 620, dom: 1800, scripts: 4 }
  ];

  for (const c of govConfigs) {
    scenarios.push({
      id: id++,
      domain: c.domain,
      siteType: 'gov_public',
      platform: 'Portal Administracji (BIP / CMS)',
      pageCount: 16,
      avgResponseTimeMs: c.rTime,
      hasGoogleAds: false,
      hasGtm: false,
      hasGa4: true,
      hasMetaPixel: false,
      hasConsentModeV2: true,
      hasAddToCartTracking: false,
      hasViewItemTracking: false,
      hasPurchaseTracking: false,
      hasCartButtons: false,
      hasLeadForms: true,
      hasClickablePhone: true,
      hasUnclickablePhone: false,
      hasClarity: false,
      hasBipLink: c.bip,
      hasDeklaracjaDostepnosci: c.wcag,
      missingH1Count: c.wcag ? 0 : 2,
      duplicateTitlesCount: 0,
      missingCanonicalCount: 0,
      missingAltCount: c.wcag ? 2 : 18,
      domElements: c.dom,
      badScripts: c.scripts,
      pageBuilders: [],
      securityScore: 100
    });
  }

  // 6. SZKOŁA / EDUKACJA (10 scenariuszy)
  const eduConfigs = [
    { domain: 'sp12-szkola-podstawowa-warszawa.edu.pl', dziennik: true, wcag: true, rTime: 520, dom: 1450, scripts: 3 },
    { domain: 'lo-staszic-liceum-ogolnoksztalcace.pl', dziennik: true, wcag: true, rTime: 380, dom: 1200, scripts: 1 },
    { domain: 'technikum-elektroniczne-krakow.edu.pl', dziennik: true, wcag: false, rTime: 850, dom: 2150, scripts: 5 },
    { domain: 'przedszkole-miejskie-bajka.pl', dziennik: false, wcag: true, rTime: 620, dom: 1600, scripts: 2 },
    { domain: 'akademia-nauk-stosowanych-lodz.edu.pl', dziennik: false, wcag: true, rTime: 290, dom: 980, scripts: 0 },
    { domain: 'zespol-szkol-muzycznych-poznan.pl', dziennik: true, wcag: true, rTime: 470, dom: 1350, scripts: 2 },
    { domain: 'szkola-jezykow-obcych-oxford.pl', dziennik: false, wcag: false, rTime: 710, dom: 1850, scripts: 4 },
    { domain: 'szkola-mistrzostwa-sportowego-gdansk.pl', dziennik: true, wcag: true, rTime: 540, dom: 1500, scripts: 3 },
    { domain: 'zespol-szkol-gastronomicznych-katowice.pl', dziennik: true, wcag: false, rTime: 910, dom: 2300, scripts: 6 },
    { domain: 'uniwersytet-trzeciego-wieku-wroclaw.pl', dziennik: false, wcag: true, rTime: 490, dom: 1400, scripts: 2 }
  ];

  for (const c of eduConfigs) {
    scenarios.push({
      id: id++,
      domain: c.domain,
      siteType: 'education',
      platform: 'WordPress / EduCMS',
      pageCount: 14,
      avgResponseTimeMs: c.rTime,
      hasGoogleAds: false,
      hasGtm: true,
      hasGa4: true,
      hasMetaPixel: false,
      hasConsentModeV2: true,
      hasAddToCartTracking: false,
      hasViewItemTracking: false,
      hasPurchaseTracking: false,
      hasCartButtons: false,
      hasLeadForms: true,
      hasClickablePhone: true,
      hasUnclickablePhone: false,
      hasClarity: false,
      hasEdziennik: c.dziennik,
      hasDeklaracjaDostepnosci: c.wcag,
      missingH1Count: c.wcag ? 0 : 1,
      duplicateTitlesCount: 0,
      missingCanonicalCount: 0,
      missingAltCount: c.wcag ? 1 : 12,
      domElements: c.dom,
      badScripts: c.scripts,
      pageBuilders: ['Elementor'],
      securityScore: 100
    });
  }

  // 7. OGÓLNE USŁUGI / FIRMY (10 scenariuszy)
  const generalConfigs = [
    { domain: 'architekt-wnetrza-portfolio.pl', rTime: 1200, dom: 1950, scripts: 5, missingAlt: 45 },
    { domain: 'fotograf-slubny-galeria.pl', rTime: 1450, dom: 2200, scripts: 6, missingAlt: 60 },
    { domain: 'kancelaria-patentowa-ochrona.pl', rTime: 420, dom: 1100, scripts: 2, missingAlt: 2 },
    { domain: 'biuro-nieruchomosci-inwestycje.pl', rTime: 890, dom: 2400, scripts: 7, missingAlt: 18 },
    { domain: 'studio-reklamowe-grafika.pl', rTime: 310, dom: 950, scripts: 1, missingAlt: 5 },
    { domain: 'biuro-rachunkowe-finanse.pl', rTime: 650, dom: 1750, scripts: 3, missingAlt: 3 },
    { domain: 'spolka-inwestycyjna-capital.pl', rTime: 180, dom: 680, scripts: 0, missingAlt: 0 },
    { domain: 'serwis-komputerowy-naprawa.pl', rTime: 590, dom: 1550, scripts: 3, missingAlt: 8 },
    { domain: 'organizacja-eventow-imprezy.pl', rTime: 950, dom: 2150, scripts: 6, missingAlt: 22 },
    { domain: 'inzynieria-budowlana-projekty.pl', rTime: 490, dom: 1300, scripts: 2, missingAlt: 4 }
  ];

  for (const c of generalConfigs) {
    scenarios.push({
      id: id++,
      domain: c.domain,
      siteType: 'services',
      platform: 'WordPress / Webflow',
      pageCount: 10,
      avgResponseTimeMs: c.rTime,
      hasGoogleAds: true,
      hasGtm: true,
      hasGa4: true,
      hasMetaPixel: true,
      hasConsentModeV2: true,
      hasAddToCartTracking: false,
      hasViewItemTracking: false,
      hasPurchaseTracking: false,
      hasCartButtons: false,
      hasLeadForms: true,
      hasClickablePhone: true,
      hasUnclickablePhone: false,
      hasClarity: true,
      missingH1Count: 0,
      duplicateTitlesCount: 0,
      missingCanonicalCount: 0,
      missingAltCount: c.missingAlt,
      domElements: c.dom,
      badScripts: c.scripts,
      pageBuilders: ['Elementor'],
      securityScore: 100
    });
  }

  return scenarios;
}

describe('Audit Master: 100 Pełnych Audytów dla Każdego Typu Witryny', () => {
  const all100Scenarios = build100AuditScenarios();

  it('generuje dokładnie 100 unikalnych scenariuszy audytowych', () => {
    expect(all100Scenarios.length).toBe(100);
    const uniqueDomains = new Set(all100Scenarios.map(s => s.domain));
    expect(uniqueDomains.size).toBe(100);
  });

  it('pokrywa wszystkie 7 typów serwisów w bazie danych', () => {
    const typesPresent = new Set(all100Scenarios.map(s => s.siteType));
    expect(typesPresent.has('ecommerce')).toBe(true);
    expect(typesPresent.has('b2b_services')).toBe(true);
    expect(typesPresent.has('local_services')).toBe(true);
    expect(typesPresent.has('ngo_foundation')).toBe(true);
    expect(typesPresent.has('gov_public')).toBe(true);
    expect(typesPresent.has('education')).toBe(true);
    expect(typesPresent.has('services')).toBe(true);
  });

  // Uruchomienie każdego z 100 audytów i test twardych reguł inżynieryjnych
  describe.each(all100Scenarios)('Audyt #$id: $domain ($siteType)', (sc) => {
    it(`audytuje ${sc.domain} bez crashy, z poprawnymi ocenami i bez em-dashów`, () => {
      // 1. Budowa stron testowych
      const pages: PageAuditResult[] = [];
      const origin = `https://${sc.domain}`;

      // Strona główna
      pages.push({
        url: origin,
        category: 'home',
        statusCode: 200,
        responseTimeMs: sc.avgResponseTimeMs,
        title: `${sc.domain} - Strona Oficjalna`,
        titleLength: 35,
        metaDescription: `Oficjalny serwis internetowy domeny ${sc.domain}. Zapraszamy do kontaktu.`,
        metaLength: 75,
        h1Count: 1,
        h1Text: `Witamy w ${sc.domain}`,
        canonical: origin,
        hasSelfCanonical: true,
        wordCount: 850,
        isThinContent: false,
        imagesCount: 10,
        missingAltCount: Math.min(sc.missingAltCount, 5),
        schemas: sc.siteType === 'ecommerce' ? ['Organization', 'WebSite'] : ['Organization'],
        hasNoIndex: false,
        internalLinksCount: 25,
        externalLinksCount: 3
      });

      // Podstrony
      for (let i = 1; i < sc.pageCount; i++) {
        const isProduct = sc.siteType === 'ecommerce' && i <= 20;
        const subPath = isProduct ? `/products/produkt-${i}` : `/podstrona-${i}`;
        const subUrl = `${origin}${subPath}`;
        const hasMissingH1 = i <= sc.missingH1Count;

        pages.push({
          url: subUrl,
          category: isProduct ? 'product' : 'info',
          statusCode: 200,
          responseTimeMs: Math.round(sc.avgResponseTimeMs * (0.8 + (i % 5) * 0.1)),
          title: sc.duplicateTitlesCount > 0 && i <= sc.duplicateTitlesCount
            ? `${sc.domain} - Strona Oficjalna`
            : `Podstrona ${i} - ${sc.domain}`,
          titleLength: 30,
          metaDescription: `Opis podstrony numer ${i} w serwisie ${sc.domain}.`,
          metaLength: 55,
          h1Count: hasMissingH1 ? 0 : 1,
          h1Text: hasMissingH1 ? undefined : `Nagłówek podstrony ${i}`,
          canonical: subUrl,
          hasSelfCanonical: true,
          wordCount: 600,
          isThinContent: false,
          imagesCount: 6,
          missingAltCount: Math.max(0, Math.round(sc.missingAltCount / sc.pageCount)),
          schemas: isProduct ? ['Product'] : [],
          hasNoIndex: false,
          internalLinksCount: 15,
          externalLinksCount: 1
        });
      }

      // 2. Sygnały telemetryczne
      const trackingSignals: PageTrackingSignals[] = [
        {
          hasGoogleAds: sc.hasGoogleAds,
          googleAdsId: sc.hasGoogleAds ? 'AW-987654321' : undefined,
          hasGtm: sc.hasGtm,
          gtmId: sc.hasGtm ? 'GTM-TEST123' : undefined,
          hasGa4: sc.hasGa4,
          ga4Id: sc.hasGa4 ? 'G-TEST987' : undefined,
          hasMetaPixel: sc.hasMetaPixel,
          metaPixelId: sc.hasMetaPixel ? '1234567890' : undefined,
          hasTikTokPixel: false,
          hasConsentModeV2: sc.hasConsentModeV2,
          hasDataLayer: sc.hasGtm || sc.hasGa4,
          hasAddToCartTracking: sc.hasAddToCartTracking,
          hasPurchaseTracking: sc.hasPurchaseTracking,
          hasCartButtons: sc.hasCartButtons,
          hasLeadForms: sc.hasLeadForms,
          hasViewItemTracking: sc.hasViewItemTracking,
          hasProductSchema: sc.siteType === 'ecommerce',
          hasSalePrice: sc.siteType === 'ecommerce',
          hasOmnibusMention: true,
          hasClickablePhone: sc.hasClickablePhone,
          hasUnclickablePhone: sc.hasUnclickablePhone,
          hasClickToCallTracking: sc.hasClickablePhone,
          hasFormSpamProtection: true,
          hasOpenGraph: true,
          hasExpressPayments: sc.siteType === 'ecommerce',
          hasClarity: sc.hasClarity,
          hasHotjar: false,
          hasSessionRecording: sc.hasClarity,
          hasPrivacyAnalytics: false,
          hasBipLink: sc.hasBipLink,
          hasDeklaracjaDostepnosci: sc.hasDeklaracjaDostepnosci,
          hasEdziennik: sc.hasEdziennik,
          hasDonationOrKrs: sc.hasDonationOrKrs,
          hasLocalBusinessSignals: sc.siteType === 'local_services',
          hasB2bSignals: sc.siteType === 'b2b_services'
        }
      ];

      // 3. Detekcja profilu witryny
      const detectedResult = detectAccurateSiteType(pages, trackingSignals, origin, sc.siteType);
      expect(detectedResult.profile).toBeDefined();

      // 4. Podsumowanie dowodów (Evidence Engine)
      const evidence = buildEvidenceSummary(pages, trackingSignals, sc.siteType);
      expect(evidence.totalPages).toBe(sc.pageCount);
      expect(evidence.status200Count).toBe(sc.pageCount);

      // Sprawdzenie wykrywania wycieków budżetu w e-commerce przy aktywnych płatnych kampaniach
      if (sc.siteType === 'ecommerce' && (sc.hasGoogleAds || sc.hasMetaPixel) && sc.hasCartButtons && !sc.hasAddToCartTracking) {
        expect(evidence.adsAndTracking.adBudgetLeakRisk).toBe('critical');
      }

      // 5. Generowanie Szybkich Błędów Krytycznych
      const codeSmells: DetailedCodeSmells = {
        jquery: sc.jquery ?? (sc.platform.includes('WordPress') || sc.platform.includes('PrestaShop')),
        badScripts: sc.badScripts,
        domElements: sc.domElements,
        inlineStyles: 15,
        pageBuilders: sc.pageBuilders || []
      };

      const quickIssues = generateQuickCriticalIssues(evidence, codeSmells, sc.siteType);
      expect(Array.isArray(quickIssues)).toBe(true);

      for (const qi of quickIssues) {
        expect(qi.id).toBeTruthy();
        expect(qi.title).toBeTruthy();
        expect(qi.businessImpact).toBeTruthy();
        expect(qi.developerAction).toBeTruthy();
        // Zaden quick issue nie moze zawierac znakow em-dash ani en-dash
        expect(qi.title).not.toMatch(/[\u2014\u2013]/);
        expect(qi.businessImpact).not.toMatch(/[\u2014\u2013]/);
        expect(qi.developerAction).not.toMatch(/[\u2014\u2013]/);
      }

      // 6. Ewaluacja wszystkich 80 punktów kontrolnych
      const rootData = {
        securityScore: sc.securityScore,
        performanceScore: sc.avgResponseTimeMs < 100 ? 98 : sc.avgResponseTimeMs < 500 ? 80 : 55,
        seoScore: sc.missingH1Count === 0 && sc.duplicateTitlesCount === 0 ? 100 : 75,
        scalabilityScore: 85,
        automationScore: sc.hasAddToCartTracking ? 95 : 60,
        detectedPlatform: sc.platform,
        wafDetected: sc.wafDetected ?? true,
        codeSmells
      };

      const checkpointsResult = evaluateAllCheckpoints(
        evidence,
        pages,
        codeSmells,
        sc.siteType,
        rootData
      );

      // E-commerce ewaluuje pełną pulę 80 punktów, a serwisy usługowe/publiczne 64 punkty runtime
      const expectedCheckpointsCount = sc.siteType === 'ecommerce' ? 80 : 64;
      expect(checkpointsResult.evals.length).toBe(expectedCheckpointsCount);
      expect(checkpointsResult.stats.total).toBe(expectedCheckpointsCount);
      expect(checkpointsResult.stats.passed + checkpointsResult.stats.warning + checkpointsResult.stats.failed).toBe(expectedCheckpointsCount);

      // Zadna ewaluacja nie moze miec pustej diagnozy ani znakow em-dash / en-dash
      for (const ev of checkpointsResult.evals) {
        expect(ev.status).toMatch(/^(passed|warning|failed)$/);
        const catalogDef = CHECKPOINTS_CATALOG[ev.id];
        expect(catalogDef).toBeDefined();
        const effectiveDiagnosis = ev.customDiagnosis || (ev.status === 'passed' ? catalogDef.defaultDiagnosisPassed : catalogDef.defaultDiagnosisFailed);
        expect(effectiveDiagnosis).toBeTruthy();
        expect(effectiveDiagnosis).not.toMatch(/[\u2014\u2013]/);
      }

      // 7. Obliczenie wyniku ogólnego
      const avgScore = Math.round(
        (rootData.performanceScore + rootData.seoScore + rootData.securityScore + rootData.scalabilityScore + rootData.automationScore) / 5
      );
      expect(avgScore).toBeGreaterThanOrEqual(0);
      expect(avgScore).toBeLessThanOrEqual(100);
      expect(Number.isNaN(avgScore)).toBe(false);

      const lossPercentage = avgScore >= 100 ? 0 : avgScore >= 95 ? 2 : Math.max(5, Math.round((100 - avgScore) / 1.5));
      expect(lossPercentage).toBeGreaterThanOrEqual(0);
      expect(lossPercentage).toBeLessThanOrEqual(100);

      // 8. Raport Deterministic AI
      const report = generateDeterministicReport(
        origin,
        avgScore,
        sc.platform,
        lossPercentage,
        sc.siteType === 'ecommerce',
        evidence,
        codeSmells,
        sc.siteType
      );

      expect(report).toBeTruthy();
      expect(report.length).toBeGreaterThan(40);
      expect(report).toContain(sc.domain);

      // Bezwzgledny zakaz znakow em-dash i en-dash w generowanych raportach
      expect(report).not.toMatch(/[\u2014\u2013]/);

      // Sprawdzenie semantycznego dopasowania słownictwa biznesowego do branży
      if (sc.siteType === 'ecommerce') {
        expect(report.toLowerCase()).toMatch(/(sklep|sprzedaż|e-commerce|koszyk)/);
        // E-commerce nie może mieć zwrotów urzędowych ani szkolnych
        expect(report.toLowerCase()).not.toContain('e-urząd');
        expect(report.toLowerCase()).not.toContain('rekrutację uczniów');
        expect(report.toLowerCase()).not.toContain('1.5% podatku');
      } else if (sc.siteType === 'gov_public') {
        expect(report.toLowerCase()).toMatch(/(mieszkańców|urzęd|publiczn|bip|dostępnoś)/);
        // Urząd nie może mieć zwrotów o koszykach sklepowych
        expect(report.toLowerCase()).not.toContain('porzucone koszyki');
      } else if (sc.siteType === 'education') {
        expect(report.toLowerCase()).toMatch(/(szkoł|uczniów|rodzic|rekrutac)/);
        expect(report.toLowerCase()).not.toContain('porzucone koszyki');
      } else if (sc.siteType === 'ngo_foundation') {
        expect(report.toLowerCase()).toMatch(/(organizac|podopieczn|statut|1.5%|darczyńc)/);
        expect(report.toLowerCase()).not.toContain('porzucone koszyki');
      } else if (sc.siteType === 'local_services') {
        expect(report.toLowerCase()).toMatch(/(usług|klient|telefon|kontakt|rezerwac|okolic)/);
      } else if (sc.siteType === 'b2b_services') {
        expect(report.toLowerCase()).toMatch(/(b2b|ofert|klient|lead)/);
      }

      // 9. Weryfikacja matematycznej spojnosci Roadmapy brakujacych punktow
      const missingPoints = 100 - avgScore;
      if (missingPoints > 0) {
        const mockDeductions = [
          { id: 'd1', pillar: 'Szybkosc', category: 'Wydajnosc', pointsLost: 10, title: 'T1', shortDiagnosis: 'D1', technicalReason: 'R1', stepsToMax: [], businessGain: 'G1', icon: null },
          { id: 'd2', pillar: 'SEO', category: 'SEO', pointsLost: 5, title: 'T2', shortDiagnosis: 'D2', technicalReason: 'R2', stepsToMax: [], businessGain: 'G2', icon: null },
          { id: 'd3', pillar: 'Analityka', category: 'Analityka', pointsLost: 15, title: 'T3', shortDiagnosis: 'D3', technicalReason: 'R3', stepsToMax: [], businessGain: 'G3', icon: null }
        ];
        const allocated = allocateExactPoints(mockDeductions, missingPoints);
        const sumAllocated = allocated.reduce((s, it) => s + it.pointsLost, 0);
        expect(sumAllocated).toBe(missingPoints);
      }
    });
  });
});
