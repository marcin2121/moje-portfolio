'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Search, Server, Settings, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export type Pillar = {
  name: string;
  score: number;
  interpretation: string;
};

export interface AuditResult {
  url: string;
  overallScore: number;
  lossPercentage: number;
  aiReport: string;
  pillars: Pillar[];
  siteType?: 'ecommerce' | 'services';
  error?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-rose-600';
};

const getScoreBg = (score: number) => {
  if (score >= 80) return 'bg-emerald-50/50 border-emerald-200/60';
  if (score >= 50) return 'bg-amber-50/50 border-amber-200/60';
  return 'bg-rose-50/50 border-rose-200/60';
};

const Activity = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

const getPillarIcon = (name: string) => {
  switch(name) {
    case 'Szybkość': return <Zap className="w-5 h-5" />;
    case 'SEO': return <Search className="w-5 h-5" />;
    case 'Skalowalność': return <Server className="w-5 h-5" />;
    case 'Automatyzacja': return <Settings className="w-5 h-5" />;
    case 'Bezpieczeństwo': return <Shield className="w-5 h-5" />;
    default: return <Activity className="w-5 h-5" />;
  }
};

interface AuditResultViewProps {
  result: AuditResult | null;
  onRetry: () => void;
}

export default function AuditResultView({ result, onRetry }: AuditResultViewProps) {
  if (!result) return null;

  const isEcommerce = result.siteType === 'ecommerce';
  const targetLabel = isEcommerce ? 'Twój sklep' : 'Twój serwis';
  const conversionLabel = isEcommerce ? 'straty sprzedaży' : 'utraconych zapytań';

  return (
    <AnimatePresence>
      {!result.error ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1 bg-white/70 border border-slate-200/60 shadow-premium-soft rounded-3xl p-8 flex flex-col justify-center items-center text-center">
              <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-4">Wynik Główny</p>
              <div className={`text-7xl font-black mb-2 ${getScoreColor(result.overallScore)} tracking-tight`}>
                {result.overallScore}<span className="text-2xl text-slate-400 font-normal">/100</span>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                Średnia z 5 kluczowych filarów odporności cyfrowej.
              </p>
            </div>

            <div className="lg:col-span-2 bg-white/80 border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Server className="w-48 h-48 text-slate-900" />
              </div>
              <div className="relative z-10">
                <h3 className="text-orange-600 font-bold tracking-widest uppercase text-xs mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Werdykt Architekta (Analiza AI)
                </h3>
                <div className="prose max-w-none text-slate-600 leading-relaxed text-base prose-p:mb-3 prose-strong:text-slate-900 prose-ul:my-3 prose-li:my-1 font-light">
                  <ReactMarkdown>{result.aiReport}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Analiza Filarów (Szczegóły)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {result.pillars.map((pillar, idx) => (
              <motion.div 
                key={pillar.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * idx }}
                className={`p-6 rounded-2xl border ${getScoreBg(pillar.score)} flex flex-col h-full`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`${getScoreColor(pillar.score)}`}>
                      {getPillarIcon(pillar.name)}
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{pillar.name}</span>
                  </div>
                  <span className={`text-xl font-black ${getScoreColor(pillar.score)} font-mono`}>{pillar.score}</span>
                </div>
                <p className="text-slate-600 text-xs mt-auto leading-relaxed">
                  {pillar.interpretation}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Warunkowe Sekcje Rekomendacji */}
          {result.overallScore >= 85 ? (
            /* WERSJA 1: ELITA (Top 1%) */
            <div className="w-full bg-emerald-50/50 border border-emerald-200/70 shadow-premium-soft rounded-3xl p-8 mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-emerald-700">Architektura Klasy Premium</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {targetLabel} wyprzedza rynkowe standardy. Nie potrzebujesz klasycznego software house&apos;u do poprawek.
                  </p>
                </div>
                <div className="text-center md:text-right shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-mono font-bold">Status Systemu</span>
                  <p className="text-3xl font-black text-slate-900">ELITA</p>
                </div>
              </div>
              <div className="mt-6 border-t border-emerald-200/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-slate-600 text-center md:text-left">Szukasz partnera do budowy dedykowanych narzędzi AI lub zaawansowanych automatyzacji?</p>
                <Link 
                  href="/#kontakt"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap shadow-sm hover:scale-105"
                >
                  Porozmawiajmy o dedykowanych modułach AI →
                </Link>
              </div>
            </div>
          ) : result.overallScore >= 60 ? (
            /* WERSJA 2: ZŁOTY ŚRODEK (Wymaga Tuningu) */
            <div className="w-full bg-blue-50/50 border border-blue-200/70 shadow-premium-soft rounded-3xl p-8 mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-blue-700">Solidny Fundament, Brak Szlifu</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Masz bardzo dobrą bazę, ale brakuje inżynieryjnej precyzji w detalach. Przez to nie wykorzystujesz w pełni potencjału technologii.
                  </p>
                </div>
                <div className="text-center md:text-right shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-blue-600 font-mono font-bold">Niewykorzystany Potencjał</span>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    ~{result.lossPercentage}% <span className="text-xs text-blue-600 font-normal">{conversionLabel}</span>
                  </p>
                </div>
              </div>
              <div className="mt-6 border-t border-blue-200/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-slate-600 text-center md:text-left">Zamknijmy luki bezpieczeństwa i zoptymalizujmy infrastrukturę w ramach szybkiego tuningu.</p>
                <Link 
                  href="/#kontakt"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap shadow-sm hover:scale-105"
                >
                  Zamów Performance & Security Tuning →
                </Link>
              </div>
            </div>
          ) : (
            /* WERSJA 3: AGONIA (Czerwony Dług Technologiczny) */
            <>
              <div className="w-full bg-rose-50/50 border border-rose-200/70 shadow-premium-soft rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between mt-8 relative overflow-hidden group">
                <div className="flex-1 text-center md:text-left relative z-10">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Krytyczny Dług Technologiczny</h3>
                  <p className="text-xs text-slate-600">Przez opóźnienia, błędy architektoniczne i brak automatyzacji, Twój biznes traci potencjał z każdym kliknięciem.</p>
                </div>
                
                <div className="text-center md:text-right mt-4 md:mt-0 flex flex-col items-center md:items-end relative z-10 shrink-0">
                  <span className="text-[10px] font-mono font-bold text-rose-600 mb-1 tracking-wider uppercase">Szacowana strata zapytań</span>
                  <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    {result.lossPercentage}% <span className="text-base text-rose-600 font-normal">odbiorców</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50/50 border border-orange-200/70 shadow-premium rounded-3xl p-8 text-center mt-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Czas zlikwidować wąskie gardła.</h2>
                <p className="text-slate-600 text-sm mb-6 max-w-xl mx-auto font-light leading-relaxed">
                  Nie pozwól, aby powolna strona paliła Twój budżet. Skonsultujmy bezpłatnie architekturę Twojego serwisu i wdróżmy nowoczesny Headless Edge.
                </p>
                <Link 
                  href="/#kontakt"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all text-sm shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:scale-105"
                >
                  Skonsultuj plan naprawczy <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}

        </motion.div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
          <p className="text-rose-600 font-bold mb-2 text-sm">Błąd Analizy</p>
          <p className="text-slate-600 text-xs">{result.error}</p>
          <button onClick={onRetry} className="mt-4 text-orange-600 font-semibold text-xs hover:underline">
            Spróbuj ponownie
          </button>
        </div>
      )}
    </AnimatePresence>
  );
}
