'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, AlertTriangle, ShieldCheck, TrendingUp, Layers, Activity, CheckCircle2 } from 'lucide-react';

const caseStudies = [
  {
    title: 'Stowarzyszenie KAS',
    category: 'NGO & Dostępność Cyfrowa',
    duel: {
      before: { value: 'WordPress Monolit', label: 'Brak WCAG & wolny hosting', icon: <AlertTriangle className="w-4 h-4 text-rose-500" /> },
      after: { value: '4 × 100 / 98 YLT', label: 'Headless Next.js + WCAG 2.2 AA', icon: <Zap className="w-4 h-4 text-emerald-500" /> },
      result: '16 127 linii kodu • 4x100 PageSpeed • 98/100 YellowLabTools',
    },
    insight: 'Przebudowaliśmy serwis organizacji pożytku publicznego na architekturę Headless Next.js 16 + React 19 zintegrowaną z WordPress REST API. Pełna certyfikacja dostępności cyfrowej WCAG 2.2 AA z audytem czytników ekranowych.',
    link: '/wdrozenia/stowarzyszeniekas',
    featured: true,
  },
  {
    title: 'DzikiStyl.com',
    category: 'E-commerce B2B',
    duel: {
      before: { value: '~24.0 MB', label: 'Waga Strony (Oryginał)', icon: <AlertTriangle className="w-4 h-4 text-rose-500" /> },
      after: { value: '~960 KB', label: 'Waga Strony (Next.js)', icon: <Zap className="w-4 h-4 text-emerald-500" /> },
      result: 'Skok konwersji mobilnej o 140%',
    },
    insight: 'Zburzyliśmy powolny monolit na rzecz architektury Headless (Next.js). Odcięliśmy ciężki backend od warstwy prezentacji, uwalniając urządzenia mobilne klientów od gigantycznych pakietów JS i blokad renderowania.',
    link: '/wdrozenia/dziki-styl',
    featured: false,
  },
  {
    title: 'RLT Polska',
    category: 'Medical E-commerce',
    duel: {
      before: { value: 'Błędy 508', label: 'Ruch z reklam (Skoki)', icon: <AlertTriangle className="w-4 h-4 text-rose-500" /> },
      after: { value: '100% Uptime', label: 'Nielimitowana skala', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
      result: 'Obsługa skokowego ruchu z reklam Meta i Google Ads',
    },
    insight: 'Zaimplementowaliśmy rendering brzegowy (Edge Runtime). Serwujemy kluczowe zasoby medyczne bez uderzania w główny serwer bazy danych, całkowicie eliminując błędy przeciążenia serwera typu Resource Limit Is Reached.',
    link: '/wdrozenia/rltpolska',
    featured: false,
  }
];

export default function WdrozeniaPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-20 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-600 bg-orange-50 border border-orange-200/60 px-3 py-1 rounded-md">
          Sprawdzone Rezultaty Architektoniczne
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
          Twarde dowody. <span className="text-orange-500">Nie obietnice.</span>
        </h1>
        <p className="text-lg text-slate-600 font-light leading-relaxed">
          Zobacz, jak przekształciliśmy powolne monolity w błyskawiczne systemy webowe. Zredukowaliśmy wagę platform e-commerce o ponad 95%, wyeliminowaliśmy błędy serwerowe podczas pików reklamowych i wdrożyliśmy pełną dostępność WCAG.
        </p>
      </div>

      {/* Grid Case Studies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {caseStudies.map((study, idx) => (
          <motion.div
            key={study.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`group flex flex-col bg-white/80 backdrop-blur-xl border border-slate-200/60 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-3xl p-8 transition-all duration-300 relative overflow-hidden shadow-sm ${
              study.featured ? 'lg:col-span-2 bg-gradient-to-br from-white/95 via-white/85 to-orange-50/20 border-orange-200/50' : ''
            }`}
          >
            {/* Ambient Background Glow */}
            <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[80px] pointer-events-none group-hover:opacity-100 transition-opacity ${
              study.featured ? 'bg-orange-500/15' : 'bg-orange-500/10'
            }`} />

            {/* Nagłówek bez pastylek rounded-full */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-8 relative z-10">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{study.title}</h2>
              <span className="px-2.5 py-1 bg-slate-100/90 border border-slate-200 text-[11px] font-mono text-slate-600 rounded-md tracking-wider uppercase shrink-0">
                {study.category}
              </span>
            </div>

            {/* Performance Duel */}
            <div className="bg-slate-50/80 rounded-2xl p-5 mb-6 border border-slate-200/60 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">Performance Duel</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Przed */}
                <div className="space-y-1 pr-4 border-r border-slate-200">
                  <span className="text-[10px] uppercase text-slate-500 font-mono flex items-center gap-1.5 mb-2">
                    {study.duel.before.icon} Przed
                  </span>
                  <div className="text-xl font-medium text-rose-600 line-through decoration-rose-600/30">
                    {study.duel.before.value}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1">{study.duel.before.label}</div>
                </div>
                
                {/* Po */}
                <div className="space-y-1 pl-2">
                  <span className="text-[10px] uppercase text-slate-500 font-mono flex items-center gap-1.5 mb-2">
                    {study.duel.after.icon} Po (Next.js)
                  </span>
                  <div className="text-xl font-bold text-emerald-600">
                    {study.duel.after.value}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1">{study.duel.after.label}</div>
                </div>
              </div>

              {/* Wynik */}
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <p className="text-sm font-semibold text-orange-600">
                  {study.duel.result}
                </p>
              </div>
            </div>

            {/* Inżynierski Insight */}
            <div className="mb-8 flex-1 relative z-10">
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-900 font-medium">Inżynierski Insight:</strong> {study.insight}
              </p>
            </div>

            {/* CTA */}
            <div className="relative z-10 mt-auto">
              <Link 
                href={study.link} 
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors group/link"
              >
                Zobacz pełne case study 
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Engineering Methodology Section (Eliminating Thin Content) */}
      <div className="bg-white/70 backdrop-blur-xl border border-slate-200/70 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-orange-600 bg-orange-50 border border-orange-200/60 px-2.5 py-0.5 rounded-md">
            Metodologia & Architektura
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Dlaczego migrujemy monolit do architektury Headless Next.js?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Klasyczne systemy CMS (np. przestarzałe motywy WordPress, ciężkie wtyczki WooCommerce czy monolityczne sklepy PHP) łączą logikę biznesową bazy danych z generowaniem kodu HTML. Skutkuje to dramatycznym spadkiem wydajności przy rosnącym ruchu, wyciekami pamięci serwera i powolnym czasem reakcji na telefonach (Core Web Vitals INP/LCP).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200/60">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-orange-500">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">Separacja Frontend / Backend</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Warstwa prezentacji (Next.js 16) jest całkowicie odseparowana od bazy danych. Klienci przeglądają błyskawicznie wygenerowane widoki brzegowe, a serwer backendowy nie jest obciążany milionami zapytań o banery czy menu.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-orange-500">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">Odporność na Piki Reklamowe</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dzięki serwowaniu zasobów z globalnej sieci Edge CDN platforma bez trudu wytrzymuje gwałtowne skoki ruchu generowane przez kampanie Google Ads, Meta Ads oraz influencerów, eliminując błędy HTTP 508 i utracone zamówienia.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-orange-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">Dostępność Cyfrowa WCAG 2.2</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Każdy budowany interfejs spełnia rygorystyczne wytyczne dostępności cyfrowej dla osób z niepełnosprawnościami oraz europejski akt o dostępności (EAA), zapewniając pełne wsparcie klawiatury i czytników ekranu.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            Chcesz sprawdzić, o ile przyspieszy Twoja platforma po refaktoryzacji?
          </div>
          <Link 
            href="/narzedzia/kalkulator-migracji" 
            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-slate-900 hover:bg-orange-600 px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            Oblicz prognozowany ROI
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
