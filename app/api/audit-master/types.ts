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
  pages: PageAuditResult[];
  createdAt: string;
  cached?: boolean;
  error?: string;
}
