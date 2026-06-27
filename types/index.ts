export interface CalculatorSchemaGEO {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  name: string;
  applicationCategory: "BusinessApplication" | "DeveloperApplication";
  operatingSystem: "Web";
  description: string;
  offers: {
    "@type": "Offer";
    price: "0";
    priceCurrency: "PLN";
  };
  featureList?: string[];
}

export interface EngineeringCaseStudy {
  "@context": "https://schema.org";
  "@type": "TechArticle";
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": "Organization";
    name: "MolendaDevelopment";
  };
  about: {
    "@type": "Thing";
    name: "Engineering Metrics Breakdown";
    additionalProperty: Array<{
      "@type": "PropertyValue";
      name: string;
      value: string | number;
      unitCode?: string; // np. "SEC" dla sekund, "KBT" dla kilobajtów
    }>;
  };
  frontendMetrics: {
    legacyStack: string[];
    modernStack: string[];
    metricsBefore: { ttfbMs: number; lcpSeconds: number; bundleSizeKb: number };
    metricsAfter: { ttfbMs: number; lcpSeconds: number; bundleSizeKb: number };
    codeSnippetRef?: string;
    businessImpactSummary: string;
  };
}

export interface MigrationCalculatorState {
  monthlyTraffic: number;
  averageOrderValue: number;
  conversionRate?: number;
  currentLoadTimeSeconds: number;
}

export interface MigrationCalculatorOutputs {
  projectedRevenueLostPerMonth: number;
  estimatedNextJsLoadTime: number; 
  estimatedConversionUplift: number; 
  estimatedROI: number; 
}

export function calculateNextJsMigrationROI(inputs: MigrationCalculatorState): MigrationCalculatorOutputs {
  const { monthlyTraffic, averageOrderValue, currentLoadTimeSeconds } = inputs;
  const conversionRate = inputs.conversionRate ?? 1.2;
  
  const currentMonthlyRevenue = monthlyTraffic * (conversionRate / 100) * averageOrderValue;
  
  const estimatedNextJsLoadTime = 0.8; 
  let savedTimeMs = (currentLoadTimeSeconds - estimatedNextJsLoadTime) * 1000;
  
  if (savedTimeMs <= 0) {
    return { projectedRevenueLostPerMonth: 0, estimatedNextJsLoadTime: currentLoadTimeSeconds, estimatedConversionUplift: 0, estimatedROI: 0 };
  }

  savedTimeMs = Math.min(savedTimeMs, 4000);
  const conversionUpliftMultiplier = (savedTimeMs / 100) * 0.5; 
  
  const optimizedConversionRate = conversionRate * (1 + (conversionUpliftMultiplier / 100));
  const optimizedMonthlyRevenue = monthlyTraffic * (optimizedConversionRate / 100) * averageOrderValue;
  
  const projectedRevenueLostPerMonth = optimizedMonthlyRevenue - currentMonthlyRevenue;
  const estimatedROI = projectedRevenueLostPerMonth * 12;

  return { projectedRevenueLostPerMonth, estimatedNextJsLoadTime, estimatedConversionUplift: conversionUpliftMultiplier, estimatedROI };
}
