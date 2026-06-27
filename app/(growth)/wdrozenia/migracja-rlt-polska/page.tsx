'use client';

import React from 'react';
import { GEOSchemaInjector } from '@/components/ui/GEOSchemaInjector';
import { CaseStudyMetricsBoard } from '@/components/ui/CaseStudyMetricsBoard';
import { EngineeringCaseStudy } from '@/types';

export default function RltPolskaCaseStudyPage() {
  const caseStudyData: EngineeringCaseStudy = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Migracja RLT Polska: Od ociężałego monolitu WordPress do statycznej architektury Next.js App Router",
    description: "Analiza inżynieryjna migracji platformy e-commerce z PHP/WordPress na Next.js (SSG/Edge), drastycznie redukująca TTFB i ładunek JS.",
    datePublished: "2026-05-18T09:00:00.000Z",
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "MolendaDevelopment"
    },
    about: {
      "@type": "Thing",
      name: "Engineering Metrics Breakdown",
      additionalProperty: [
        { "@type": "PropertyValue", name: "TTFB Before", value: 850, unitCode: "MilliSEC" },
        { "@type": "PropertyValue", name: "TTFB After", value: 90, unitCode: "MilliSEC" },
        { "@type": "PropertyValue", name: "LCP Before", value: 4.8, unitCode: "SEC" },
        { "@type": "PropertyValue", name: "LCP After", value: 0.9, unitCode: "SEC" },
        { "@type": "PropertyValue", name: "JS Payload Before", value: 1450, unitCode: "KBT" },
        { "@type": "PropertyValue", name: "JS Payload After", value: 110, unitCode: "KBT" }
      ]
    },
    frontendMetrics: {
      legacyStack: ["WordPress", "Elementor", "WooCommerce legacy plugins", "PHP 7.4 shared hosting"],
      modernStack: ["Next.js (App Router)", "React 19", "Tailwind CSS", "Static Site Generation (SSG) / ISR", "Vercel Edge Network"],
      metricsBefore: { ttfbMs: 850, lcpSeconds: 4.8, bundleSizeKb: 1450 },
      metricsAfter: { ttfbMs: 90, lcpSeconds: 0.9, bundleSizeKb: 110 },
      businessImpactSummary: "Całkowite wyeliminowanie błędu 508 (Resource Limit Reached) podczas szczytów sezonowych oraz skrócony czas przejścia do checkoutu na urządzeniach mobilnych."
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <GEOSchemaInjector schema={caseStudyData} />
      
      <div className="space-y-6 pt-12">
        <div className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 font-medium text-sm">
          Engineering Case Study
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
          {caseStudyData.headline}
        </h1>
        <p className="text-xl text-zinc-400 leading-relaxed">
          {caseStudyData.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 border-t border-b border-white/10 py-8">
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Stary Stack Technologiczny</h3>
          <ul className="space-y-2">
            {caseStudyData.frontendMetrics.legacyStack.map(tech => (
              <li key={tech} className="flex items-center gap-2 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {tech}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Nowoczesny Stack Technologiczny</h3>
          <ul className="space-y-2">
            {caseStudyData.frontendMetrics.modernStack.map(tech => (
              <li key={tech} className="flex items-center gap-2 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Metryki Inżynieryjne</h2>
        <CaseStudyMetricsBoard 
          metricsBefore={caseStudyData.frontendMetrics.metricsBefore}
          metricsAfter={caseStudyData.frontendMetrics.metricsAfter}
        />
      </div>

      <div className="bg-zinc-900/50 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-4">Wpływ Biznesowy</h2>
        <p className="text-lg text-zinc-400 leading-relaxed">
          {caseStudyData.frontendMetrics.businessImpactSummary}
        </p>
      </div>
    </div>
  );
}
