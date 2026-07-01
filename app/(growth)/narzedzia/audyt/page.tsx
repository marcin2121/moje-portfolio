'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Search, Server, Settings, ArrowRight, Loader2, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

type Pillar = {
  name: string;
  score: number;
  interpretation: string;
};

interface AuditResult {
  url: string;
  overallScore: number;
  lossPercentage: number;
  aiReport: string;
  pillars: Pillar[];
  error?: string;
};

export default function AudytPage() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);

  const scanSteps = [
    "Inicjalizacja połączenia...",
    "Odpytywanie Google PageSpeed Insights...",
    "Analiza polityki bezpieczeństwa (CSP, HSTS)...",
    "Detekcja stosu technologicznego...",
    "Kalkulacja strat konwersji...",
    "Generowanie raportu..."
  ];

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setResult(null);
    setScanStep(0);

    // Symulacja zaawansowanego skanowania dla lepszego UX
    const stepInterval = setInterval(() => {
      setScanStep(prev => {
        if (prev < scanSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 150000); // 2.5 minuty max na frontendzie

      const startTime = Date.now();
      const res = await fetch('/api/audit-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await res.json();
      const elapsedTime = Date.now() - startTime;
      
      // LABOR ILLUSION: Wymuszamy minimum 14 sekund skanowania, żeby wyglądało to profesjonalnie.
      const MIN_WAIT_TIME = 14000;
      const remainingWait = Math.max(0, MIN_WAIT_TIME - elapsedTime);

      setTimeout(() => {
        clearInterval(stepInterval);
        setScanStep(scanSteps.length - 1);
        
        setTimeout(() => {
          setResult(data);
          setIsScanning(false);
        }, 1000);
      }, remainingWait);

    } catch (err) {
      clearInterval(stepInterval);
      setIsScanning(false);
      setResult({ url, overallScore: 0, lossPercentage: 0, pillars: [], aiReport: '', error: "Wystąpił błąd podczas komunikacji z API." });
    }
  };

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

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-slate-600 selection:bg-orange-500 selection:text-white">
      <Link href="/narzedzia" className="inline-flex items-center text-sm font-mono text-slate-500 hover:text-orange-600 transition-colors mb-12">
        ← Powrót do narzędzi
      </Link>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">
          Audyt Odporności Biznesowej
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Zdiagnozuj wąskie gardła swojego sklepu. Zobaczysz czarno na białym, jak błędy technologiczne pożerają Twoją konwersję i pieniądze.
        </p>
      </div>

      <div className="bg-white/70 border border-slate-200/50 rounded-[1.5rem] p-8 backdrop-blur-3xl mb-12 shadow-premium relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-400/10 blur-[100px] rounded-full pointer-events-none" />

        <form onSubmit={handleScan} className="relative z-10">
          <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
            Adres sklepu / aplikacji (URL)
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="np. dzikistyl.com"
              className="flex-grow bg-white/80 border-2 border-slate-200 focus:border-orange-400/50 rounded-xl py-4 px-6 text-slate-900 text-lg outline-none transition-colors shadow-inner"
              disabled={isScanning}
            />
            <button
              type="submit"
              disabled={isScanning || !url}
              className="bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold py-4 px-8 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Skanowanie
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Analizuj Sklep
                </>
              )}
            </button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 pt-8 border-t border-zinc-800/50 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-mono text-sm">{scanSteps[scanStep]}</span>
                <span className="text-orange-600 font-mono font-bold">{Math.round((scanStep / scanSteps.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(scanStep / (scanSteps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {result && !result.error && (
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
                      Twój sklep wyprzedza rynkowe standardy. Nie potrzebujesz klasycznego software house'u do poprawek.
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
        )}

        {result && result.error && (
          <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 text-center">
            <p className="text-red-500 font-bold mb-2">Błąd Analizy</p>
            <p className="text-zinc-400 text-sm">{result.error}</p>
            <button onClick={() => setResult(null)} className="mt-4 text-orange-500 text-sm hover:underline">
              Spróbuj ponownie
            </button>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

// Helper to avoid build error with undefined icon
const Activity = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);
