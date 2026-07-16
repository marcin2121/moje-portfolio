'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AuditResultView, { AuditResult } from '@/components/audyt/AuditResultView';

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

    } catch {
      clearInterval(stepInterval);
      setIsScanning(false);
      setResult({ url, overallScore: 0, lossPercentage: 0, pillars: [], aiReport: '', error: "Wystąpił błąd podczas komunikacji z API." });
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

      {result && <AuditResultView result={result} onRetry={() => setResult(null)} />}
    </main>
  );
}
