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
  error?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
};

const getScoreBg = (score: number) => {
  if (score >= 80) return 'bg-green-500/10 border-green-500/30';
  if (score >= 50) return 'bg-yellow-500/10 border-yellow-500/30';
  return 'bg-red-500/10 border-red-500/30';
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

  return (
    <AnimatePresence>
      {!result.error ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1 bg-white/60 border border-slate-200/50 shadow-premium-soft rounded-[1.5rem] p-8 flex flex-col justify-center items-center text-center">
              <p className="text-slate-500 font-mono text-sm uppercase tracking-widest mb-4">Wynik Główny</p>
              <div className={`text-7xl font-black mb-2 ${getScoreColor(result.overallScore)}`}>
                {result.overallScore}<span className="text-3xl text-slate-400">/100</span>
              </div>
              <p className="text-slate-500 text-sm mt-4">
                Średnia z 5 filarów odporności B2B.
              </p>
            </div>

            <div className="lg:col-span-2 bg-white/80 border border-slate-200/50 shadow-premium rounded-[1.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Server className="w-48 h-48 text-slate-900" />
              </div>
              <div className="relative z-10">
                <h3 className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Werdykt Architekta (Analiza AI)
                </h3>
                <div className="prose max-w-none text-slate-600 leading-relaxed text-lg prose-p:mb-4 prose-strong:text-slate-900 prose-ul:my-4 prose-li:my-1">
                  <ReactMarkdown>{result.aiReport}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-6">Analiza Filarów (Szczegóły)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {result.pillars.map((pillar, idx) => (
              <motion.div 
                key={pillar.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className={`p-6 rounded-2xl border ${getScoreBg(pillar.score)} flex flex-col h-full`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`${getScoreColor(pillar.score)}`}>
                      {getPillarIcon(pillar.name)}
                    </div>
                    <span className="font-bold text-slate-900">{pillar.name}</span>
                  </div>
                  <span className={`text-2xl font-black ${getScoreColor(pillar.score)}`}>{pillar.score}</span>
                </div>
                <p className="text-slate-500 text-sm mt-auto leading-relaxed">
                  {pillar.interpretation}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Warunkowy Kalkulator Straty / Banery */}
          {result.overallScore >= 85 ? (
            /* WERSJA 1: ELITA (Top 1%) */
            <div className="w-full bg-emerald-50/50 border border-emerald-200 shadow-premium-soft rounded-[1.5rem] p-8 mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-emerald-600">Architektura Klasy Premium</h2>
                  <p className="mt-1 text-slate-600">
                    Twój sklep wyprzedza rynkowe standardy. Nie potrzebujesz klasycznego software house&apos;u do poprawek.
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <span className="text-xs uppercase tracking-widest text-emerald-600">Status Systemu</span>
                  <p className="text-3xl font-extrabold text-slate-900">ELITA</p>
                </div>
              </div>
              <div className="mt-8 border-t border-emerald-200/50 pt-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-slate-500 mb-4 md:mb-0 text-center md:text-left">Szukasz partnera do budowy dedykowanych narzędzi AI lub ekspansji B2B?</p>
                <Link 
                  href="/#kontakt"
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-bold transition whitespace-nowrap shadow-sm"
                >
                  Porozmawiajmy o skalowaniu R&D →
                </Link>
              </div>
            </div>
          ) : result.overallScore >= 60 ? (
            /* WERSJA 2: ZŁOTY ŚRODEK (Wymaga Tuningu) */
            <div className="w-full bg-blue-50/50 border border-blue-200 shadow-premium-soft rounded-[1.5rem] p-8 mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-blue-600">Solidny Fundament, Brak Szlifu</h2>
                  <p className="mt-1 text-slate-600">
                    Masz bardzo dobrą architekturę, ale brakuje inżynieryjnej precyzji w detalach. Przez to nie wykorzystujesz w pełni potencjału technologii.
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <span className="text-xs uppercase tracking-widest text-blue-600">Niewykorzystany Potencjał</span>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    ~{result.lossPercentage}% <span className="text-lg text-blue-500 font-normal">straty konwersji</span>
                  </p>
                </div>
              </div>
              <div className="mt-8 border-t border-blue-200/50 pt-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-slate-500 mb-4 md:mb-0 text-center md:text-left">Zamknijmy luki bezpieczeństwa i zoptymalizujmy infrastrukturę w ramach szybkiego tuningu.</p>
                <Link 
                  href="/#kontakt"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition whitespace-nowrap shadow-sm"
                >
                  Zamów Performance & Security Tuning →
                </Link>
              </div>
            </div>
          ) : (
            /* WERSJA 3: AGONIA (Czerwony Dług Technologiczny) */
            <>
              <div className="w-full bg-rose-50/50 border border-rose-200 shadow-premium-soft rounded-[1.5rem] p-8 flex flex-col md:flex-row items-center justify-between mt-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/5 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                <div className="flex-1 text-center md:text-left relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Technologiczny Dług</h3>
                  <p className="text-slate-600">Przez opóźnienia, błędy architektoniczne i brak automatyzacji, Twój biznes traci potencjał z każdym kliknięciem.</p>
                </div>
                
                <div className="text-center md:text-right mt-6 md:mt-0 flex flex-col items-center md:items-end relative z-10">
                  <span className="text-sm font-medium text-rose-500 mb-1 tracking-wider uppercase">Szacowana strata konwersji</span>
                  <div className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                    {result.lossPercentage}% <span className="text-xl text-rose-500">klientów</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50/50 border border-orange-200 shadow-premium rounded-[1.5rem] p-10 text-center mt-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Czas wyleczyć ten system.</h2>
                <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
                  Nie pozwól, aby przestarzała technologia paliła Twój budżet marketingowy. Zamów bezpłatną konsultację architektury, a pokażę Ci, jak przejść na nowoczesny Serverless Edge i zlikwidować te straty.
                </p>
                <Link 
                  href="/#kontakt"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-400 transition-colors text-lg shadow-sm"
                >
                  Pobierz pełny raport naprawczy <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}

        </motion.div>
      ) : (
        <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 text-center">
          <p className="text-red-500 font-bold mb-2">Błąd Analizy</p>
          <p className="text-zinc-400 text-sm">{result.error}</p>
          <button onClick={onRetry} className="mt-4 text-orange-500 text-sm hover:underline">
            Spróbuj ponownie
          </button>
        </div>
      )}
    </AnimatePresence>
  );
}
