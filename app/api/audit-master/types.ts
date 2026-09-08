export interface PageAuditResult {
  url: string;
  category: 'home' | 'product' | 'blog' | 'shop' | 'info';
  statusCode: number;
  responseTimeMs: number;
  title: string;
  titleLength: number;
  metaDescription: string;
  metaLength: number;
  h1Count: number;
  h1Text?: string;
  canonical: string | null;
  hasSelfCanonical: boolean;
  wordCount: number;
  isThinContent: boolean;
  imagesCount: number;
  missingAltCount: number;
  schemas: string[];
  hasNoIndex: boolean;
  internalLinksCount: number;
  externalLinksCount: number;
}

export interface DuplicateTitleGroup {
  title: string;
  count: number;
  urls: string[];
}

export interface CategoryStats {
  count: number;
  missingH1: number;
  missingCanonical: number;
  missingSchema: number;
  missingImages?: number;
  avgWordCount?: number;
  titlePattern?: string;
  goodCount: number;
  warnCount: number;
  badCount: number;
}

export interface TrackingIssue {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  description: string;
  impact: string; // Język korzyści: co klient traci (np. przepalany budżet)
  developerSolution: string; // Co dla Ciebie wdrożę w kodzie
}

export interface AdsAndTrackingAudit {
  hasGoogleAds: boolean;
  googleAdsId?: string;
  hasGoogleTagManager: boolean;
  gtmId?: string;
  hasGA4: boolean;
  ga4Id?: string;
  hasMetaPixel: boolean;
  metaPixelId?: string;
  hasTikTokPixel: boolean;
  tikTokPixelId?: string;
  hasConsentModeV2: boolean;
  hasDataLayer: boolean;
  hasAddToCartTracking: boolean;
  hasPurchaseTracking: boolean;
  hasCartButtons?: boolean;
  hasLeadForms?: boolean;
  // Rozszerzony Silnik Wycieków Finansowych (Financial Leak Engine)
  hasViewItemTracking?: boolean;
  hasProductSchema?: boolean;
  hasOmnibusCompliance?: boolean;
  hasExpressPayments?: boolean;
  hasClickableContacts?: boolean;
  hasUnclickablePhone?: boolean;
  hasClickToCallTracking?: boolean;
  hasFormSpamProtection?: boolean;
  hasOpenGraph?: boolean;
  variantTimeoutUrls?: string[];
  adBudgetLeakRisk: 'none' | 'low' | 'medium' | 'critical';
  issues: TrackingIssue[];
}

export interface EvidenceSummary {
  totalPages: number;
  avgResponseTimeMs: number;
  status200Count: number;
  redirectsCount: number;
  errorsCount: number;
  noIndexCount: number;
  missingTitleCount: number;
  duplicateTitleGroups: DuplicateTitleGroup[];
  missingMetaCount: number;
  avgMetaLength: number;
  missingH1Count: number;
  missingH1Urls: string[];
  thinContentCount: number;
  thinContentUrls: { url: string; wordCount: number }[];
  missingCanonicalCount: number;
  missingCanonicalUrls: string[];
  missingAltTotal: number;
  adsAndTracking: AdsAndTrackingAudit;
  categoriesSummary: {
    products?: CategoryStats;
    blog?: CategoryStats;
    overall: {
      goodCount: number;
      warnCount: number;
      badCount: number;
    };
  };
}

export interface Pillar {
  name: string;
  score: number;
  interpretation: string;
}

export interface DetailedCodeSmells {
  jquery: boolean;
  badScripts: number;
  domElements: number;
  inlineStyles: number;
  pageBuilders?: string[];
  trackers?: string[];
  missingAltCount?: number;
  unoptimizedImagesCount?: number;
  fcp?: string;
  lcp?: string;
}

export type CheckpointCategory =
  | 'tracking_ads'
  | 'ecommerce_cro'
  | 'seo_indexing'
  | 'performance_vitals'
  | 'ux_mobile'
  | 'security_compliance';

export type CheckpointStatus = 'passed' | 'warning' | 'failed';

export interface CheckpointEvaluation {
  id: string;
  status: CheckpointStatus;
  metric?: string;
  evidence?: string[];
  customDiagnosis?: string;
}

export interface CheckpointStats {
  total: number;
  passed: number;
  warning: number;
  failed: number;
  criticalLeaksCount: number;
}

export interface CatalogCheckpointDefinition {
  id: string;
  name: string;
  category: CheckpointCategory;
  severity: 'critical' | 'warning' | 'good';
  defaultDiagnosisPassed: string;
  defaultDiagnosisFailed: string;
  businessImpact: string; // Co klient traci, gdy ten błąd występuje
  businessBenefit: string; // Bezpośrednia korzyść z naprawy (ROI / zysk / oszczędność)
  developerSolution: string; // Co dla Ciebie wdrożę w kodzie w 24-48h
}

export interface MergedCheckpoint extends CatalogCheckpointDefinition {
  status: CheckpointStatus;
  metric?: string;
  evidence?: string[];
  diagnosis: string;
}

export interface QuickCriticalIssue {
  id: string;
  title: string;
  type: 'tracking' | 'seo' | 'performance' | 'architecture';
  severity: 'critical' | 'warning';
  shortDesc: string;
  affectedCount?: number;
  businessImpact: string; // ile pieniędzy / pozycji ucieka
  developerAction: string; // Co dla Ciebie wdrożę w kodzie
  details?: { url?: string; label?: string; sublabel?: string }[];
}

export interface CompetitorMetrics {
  ttfb: {
    yourValue: number;
    competitorValue: number;
    winner: 'you' | 'competitor' | 'tie';
  };
  platform: {
    yourPlatform: string;
    competitorPlatform: string;
  };
  addToCartTracking: {
    yourStatus: boolean;
    competitorStatus: boolean;
    winner: 'you' | 'competitor' | 'tie';
  };
  consentModeV2: {
    yourStatus: boolean;
    competitorStatus: boolean;
    winner: 'you' | 'competitor' | 'tie';
  };
  expressPayments: {
    yourStatus: boolean;
    competitorStatus: boolean;
    winner: 'you' | 'competitor' | 'tie';
  };
  productSchema: {
    yourStatus: boolean;
    competitorStatus: boolean;
    winner: 'you' | 'competitor' | 'tie';
  };
  securityWaf: {
    yourStatus: boolean;
    competitorStatus: boolean;
    winner: 'you' | 'competitor' | 'tie';
  };
  seoOptimized?: {
    yourStatus: boolean;
    competitorStatus: boolean;
    winner: 'you' | 'competitor' | 'tie';
  };
  siteType?: 'ecommerce' | 'services';
}

export interface CompetitorBenchmark {
  competitorDomain: string;
  competitorUrl: string;
  isUnavailable?: boolean;
  unavailableReason?: string;
  yourScore: number;
  competitorScore: number;
  scoreDiff: number;
  winner: 'you' | 'competitor' | 'tie';
  metrics?: CompetitorMetrics;
  verdict: string;
  strategicAdvice: string;
}

export interface AuditMasterResponse {
  token: string;
  url: string;
  domain: string;
  siteType: 'ecommerce' | 'services';
  overallScore: number;
  lossPercentage: number;
  aiReport: string;
  pillars: Pillar[];
  detectedPlatform: string;
  wafDetected: boolean;
  codeSmells: DetailedCodeSmells;
  evidence: EvidenceSummary;
  quickIssues: QuickCriticalIssue[];
  checkpointEvals?: CheckpointEvaluation[];
  checkpointStats?: CheckpointStats;
  competitorBenchmark?: CompetitorBenchmark;
  pages: PageAuditResult[];
  createdAt: string;
  cached?: boolean;
  error?: string;
}

