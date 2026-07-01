'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';

const caseStudies = [
  {
    title: 'DzikiStyl.com',
    category: 'E-commerce B2B',
    duel: {
      before: { value: '~24.0 MB', label: 'Waga Strony (Oryginał)', icon: <AlertTriangle className="w-4 h-4 text-rose-500" /> },
      after: { value: '~960 KB', label: 'Waga Strony (Next.js)', icon: <Zap className="w-4 h-4 text-emerald-500" /> },
      result: 'Skok konwersji mobilnej o 140%',
    },
    insight: 'Zburzyliśmy powolny monolit na rzecz architektury Headless (Next.js). Odcięliśmy ciężki backend od warstwy prezentacji, uwalniając urządzenia mobilne klientów od zatorów sieciowych.',
    link: '/wdrozenia/dziki-styl', // Link zaktualizowany
  },
  {
    title: 'RLT Polska',
    category: 'Medical E-commerce',
    duel: {
      before: { value: 'Błędy 508', label: 'Ruch z reklam (Skoki)', icon: <AlertTriangle className="w-4 h-4 text-rose-500" /> },
      after: { value: '100% Uptime', label: 'Nielimitowana skala', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
      result: 'Obsługa skokowego ruchu z TV / Meta',
    },
    insight: 'Zaimplementowaliśmy rendering brzegowy (Edge). Serwujemy kluczowe zasoby medyczne bez uderzania w główny serwer bazy danych, całkowicie eliminując błędy typu Resource Limit Is Reached.',
    link: '/wdrozenia/rltpolska',
  }
];

export default function WdrozeniaPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
          Twarde dowody. <span className="text-orange-500">Nie obietnice.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
          Zobacz, jak zredukowaliśmy ciężar platform e-commerce o ponad 95% i ustabilizowaliśmy infrastrukturę ratując budżety reklamowe.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {caseStudies.map((study, idx) => (
          <motion.div
            key={study.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col bg-white/70 backdrop-blur-xl border border-slate-200/50 hover:bg-white/90 hover:shadow-premium-soft rounded-3xl p-8 transition-all duration-300 relative overflow-hidden shadow-sm"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-orange-500/20 transition-colors" />

            {/* Nagłówek */}
            <div className="flex justify-between items-start mb-8 relative z-10">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{study.title}</h2>
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-xs font-mono text-slate-500 rounded-full tracking-wider uppercase">
                {study.category}
              </span>
            </div>

            {/* Performance Duel */}
            <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-200/60 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Performance Duel</span>
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
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm font-semibold text-orange-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  {study.duel.result}
                </p>
              </div>
            </div>

            {/* Inżynierski Insight */}
            <div className="mb-8 flex-1 relative z-10">
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                <strong className="text-slate-900 font-medium">Inżynierski Insight:</strong> {study.insight}
              </p>
            </div>

            {/* CTA */}
            <div className="relative z-10 mt-auto">
              <Link 
                href={study.link} 
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors group/link"
              >
                Zobacz case study 
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
