'use client';

import React from 'react';
import { GEOSchemaInjector } from '@/components/ui/GEOSchemaInjector';
import { CaseStudyMetricsBoard } from '@/components/ui/CaseStudyMetricsBoard';
import { EngineeringCaseStudy } from '@/types';
import { NextStepCTA } from '@/components/ui/NextStepCTA';

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
        <p className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.25em] text-orange-500">
          Engineering Case Study
        </p>
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

      {/* Kontekst inzynieryjny i wyzwania wyjsciowe */}
      <div className="space-y-6 text-zinc-300 leading-relaxed text-base">
        <h2 className="text-2xl font-bold text-white tracking-tight">Wyzwania wydajnosciowe monolitu PHP</h2>
        <p>
          Dotychczasowa architektura serwisu oparta na silniku WordPress, kreatorze Elementor oraz kilkudziesieciu wtyczkach WooCommerce generowala znaczace obciazenie bazy danych MySQL przy kazdym wejsciu uzytkownika. Kazde zapytanie HTTP zmuszalo interpreter PHP do dynamicznego generowania drzewa DOM od podstaw, co przy wzmozonym ruchu z kampanii marketingowych prowadzilo do wyczerpania limitow pamieci serwera oraz powstawania krytycznych bledow HTTP 508 (Resource Limit Reached).
        </p>
        <p>
          Dodatkowym problemem byl narzut skryptow JavaScript. Ponad 1.4 MB synchronicznie ladowanych bibliotek blokowalo renderowanie pierwszego ekranu na smartfonach, wydluzajac czas LCP (Largest Contentful Paint) do prawie 5 sekund. Skutkowalo to wysokim wspolczynnikiem porzucen uzytkownikow mobilnych i utrata potencjalnych zamowien.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Metryki Inżynieryjne</h2>
        <CaseStudyMetricsBoard 
          metricsBefore={caseStudyData.frontendMetrics.metricsBefore}
          metricsAfter={caseStudyData.frontendMetrics.metricsAfter}
        />
      </div>

      {/* Architektura rozwiazania i dekompozycja */}
      <div className="space-y-6 text-zinc-300 leading-relaxed text-base border-t border-white/10 pt-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">Dekompozycja do Next.js i Edge Network</h2>
        <p>
          Proces migracji polegal na calkowitym rozdzieleniu warstwy prezentacji od logiki biznesowej. Zbudowano nowoczesny frontend w technologii Next.js App Router z wykorzystaniem React 19 oraz Tailwind CSS. Wykorzystano model hybrydowy: statyczna prekompilacje stron (SSG) z inkrementalna rewalidacja (ISR) dla kart ofertowych oraz serwowanie zasobow bezposrednio z wezlow brzegowych Vercel Edge Network.
        </p>
        <p>
          Dzieki temu czas odpowiedzi serwera (TTFB) spadl z 850ms do zaledwie 90ms, poniewaz uzytkownicy otrzymuja natychmiast prekompilowany kod HTML bez koniecznosci angazowania bazy danych. Waga pakietu JavaScript zostala zredukowana z 1450 KB do 110 KB dzieki usunieciu legacy zaleznosci jQuery i zastapieniu ich natywnymi rozwiazaniami przegladarkowymi.
        </p>
      </div>

      <div className="bg-zinc-900/50 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-4">Wpływ Biznesowy i Rezultaty</h2>
        <p className="text-lg text-zinc-400 leading-relaxed mb-4">
          {caseStudyData.frontendMetrics.businessImpactSummary}
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Wdrozenie nowej architektury zaowocowalo 100% dostepnoscia serwisu podczas szczytow sezonowych, zredukowaniem kosztow serwerowych oraz wzrostem konwersji mobilnej o 35% dzieki blyskawicznemu ladowaniu oferty na kazdym urzadzeniu.
        </p>
      </div>

      <div className="pt-8">
        <NextStepCTA 
          theme="dark"
          title="Twój monolit PHP lub WooCommerce traci klientów?"
          subtitle="Przeprowadzę audyt wąskich gardeł i przygotuję plan migracji do Next.js. Wycena i kosztorys w 24h na e-mail."
        />
      </div>
    </div>
  );
}
