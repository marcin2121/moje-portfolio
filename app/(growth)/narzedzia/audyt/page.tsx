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
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-zinc-300 selection:bg-orange-500 selection:text-white">
      <Link href="/narzedzia" className="inline-flex items-center text-sm font-mono text-zinc-500 hover:text-orange-500 transition-colors mb-12">
        ← Powrót do narzędzi
      </Link>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
          Audyt Odporności Biznesowej
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Zdiagnozuj wąskie gardła swojego sklepu. Zobaczysz czarno na białym, jak błędy technologiczne pożerają Twoją konwersję i pieniądze.
        </p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl mb-12 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

        <form onSubmit={handleScan} className="relative z-10">
          <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
            Adres sklepu / aplikacji (URL)
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="np. dzikistyl.com"
              className="flex-grow bg-zinc-950 border-2 border-zinc-800 focus:border-orange-500/50 rounded-xl py-4 px-6 text-white text-lg outline-none transition-colors"
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
                <span className="text-zinc-400 font-mono text-sm">{scanSteps[scanStep]}</span>
                <span className="text-orange-500 font-mono font-bold">{Math.round((scanStep / scanSteps.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
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
              <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mb-4">Wynik Główny</p>
                <div className={`text-7xl font-black mb-2 ${getScoreColor(result.overallScore)}`}>
                  {result.overallScore}<span className="text-3xl text-zinc-600">/100</span>
                </div>
                <p className="text-zinc-400 text-sm mt-4">
                  Średnia z 5 filarów odporności B2B.
                </p>
              </div>

              <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Server className="w-48 h-48 text-zinc-500" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Werdykt Architekta (Analiza AI)
                  </h3>
                  <div className="prose prose-invert prose-orange max-w-none text-zinc-300 leading-relaxed text-lg prose-p:mb-4 prose-strong:text-white prose-ul:my-4 prose-li:my-1">
                    <ReactMarkdown>{result.aiReport}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6">Analiza Filarów (Szczegóły)</h3>
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
                      <span className="font-bold text-white">{pillar.name}</span>
                    </div>
                    <span className={`text-2xl font-black ${getScoreColor(pillar.score)}`}>{pillar.score}</span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-auto leading-relaxed">
                    {pillar.interpretation}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Warunkowy Kalkulator Straty / Banery */}
            {result.overallScore >= 85 ? (
              /* WERSJA 1: ELITA (Top 1%) */
              <div className="w-full bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-8 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-6 md:mb-0 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-emerald-400">Architektura Klasy Premium</h2>
                    <p className="mt-1 text-zinc-300">
                      Twój sklep wyprzedza rynkowe standardy. Nie potrzebujesz klasycznego software house'u do poprawek.
                    </p>
                  </div>
                  <div className="text-center md:text-right">
                    <span className="text-xs uppercase tracking-widest text-emerald-500">Status Systemu</span>
                    <p className="text-3xl font-extrabold text-white">ELITA</p>
                  </div>
                </div>
                <div className="mt-8 border-t border-emerald-500/20 pt-6 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-zinc-400 mb-4 md:mb-0 text-center md:text-left">Szukasz partnera do budowy dedykowanych narzędzi AI lub ekspansji B2B?</p>
                  <Link 
                    href="/#kontakt"
                    className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-bold transition whitespace-nowrap"
                  >
                    Porozmawiajmy o skalowaniu R&D →
                  </Link>
                </div>
              </div>
            ) : result.overallScore >= 60 ? (
              /* WERSJA 2: ZŁOTY ŚRODEK (Wymaga Tuningu) */
              <div className="w-full bg-blue-950/20 border border-blue-500/30 rounded-2xl p-8 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-6 md:mb-0 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-blue-400">Solidny Fundament, Brak Szlifu</h2>
                    <p className="mt-1 text-zinc-300">
                      Masz bardzo dobrą architekturę, ale brakuje inżynieryjnej precyzji w detalach. Przez to nie wykorzystujesz w pełni potencjału technologii.
                    </p>
                  </div>
                  <div className="text-center md:text-right">
                    <span className="text-xs uppercase tracking-widest text-blue-500">Niewykorzystany Potencjał</span>
                    <p className="text-3xl font-extrabold text-white tracking-tight">
                      ~{result.lossPercentage}% <span className="text-lg text-blue-400 font-normal">straty konwersji</span>
                    </p>
                  </div>
                </div>
                <div className="mt-8 border-t border-blue-500/20 pt-6 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-zinc-400 mb-4 md:mb-0 text-center md:text-left">Zamknijmy luki bezpieczeństwa i zoptymalizujmy infrastrukturę w ramach szybkiego tuningu.</p>
                  <Link 
                    href="/#kontakt"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition whitespace-nowrap"
                  >
                    Zamów Performance & Security Tuning →
                  </Link>
                </div>
              </div>
            ) : (
              /* WERSJA 3: AGONIA (Czerwony Dług Technologiczny) */
              <>
                <div className="w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between mt-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Technologiczny Dług</h3>
                    <p className="text-zinc-400">Przez opóźnienia, błędy architektoniczne i brak automatyzacji, Twój biznes traci potencjał z każdym kliknięciem.</p>
                  </div>
                  
                  <div className="text-center md:text-right mt-6 md:mt-0 flex flex-col items-center md:items-end">
                    <span className="text-sm font-medium text-red-500 mb-1 tracking-wider uppercase">Szacowana strata konwersji</span>
                    <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                      {result.lossPercentage}% <span className="text-xl text-red-500">klientów</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-950/40 to-zinc-900 border border-orange-500/20 rounded-3xl p-10 text-center mt-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Czas wyleczyć ten system.</h2>
                  <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
                    Nie pozwól, aby przestarzała technologia paliła Twój budżet marketingowy. Zamów bezpłatną konsultację architektury, a pokażę Ci, jak przejść na nowoczesny Serverless Edge i zlikwidować te straty.
                  </p>
                  <Link 
                    href="/#kontakt"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-zinc-950 font-bold rounded-xl hover:bg-orange-400 transition-colors text-lg"
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
