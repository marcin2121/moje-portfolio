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
  developerSolution: string; // Co Marcin może zrobić w kodzie
}

export interface AdsAndTrackingAudit {
  hasGoogleAds: boolean;
  googleAdsId?: string;
  hasGoogleTagManager: boolean;
  gtmId?: string;
  hasGA4: boolean;
  ga4Id?: string;
  hasMetaPixel: boolean;
  hasTikTokPixel: boolean;
  hasConsentModeV2: boolean;
  hasDataLayer: boolean;
  hasAddToCartTracking: boolean;
  hasPurchaseTracking: boolean;
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

export interface QuickCriticalIssue {
  id: string;
  title: string;
  type: 'tracking' | 'seo' | 'performance' | 'architecture';
  severity: 'critical' | 'warning';
  shortDesc: string;
  affectedCount?: number;
  businessImpact: string; // ile pieniędzy / pozycji ucieka
  developerAction: string; // jak Marcin to naprawia
  details?: { url?: string; label?: string; sublabel?: string }[];
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
  pages: PageAuditResult[];
  createdAt: string;
  cached?: boolean;
  error?: string;
}
