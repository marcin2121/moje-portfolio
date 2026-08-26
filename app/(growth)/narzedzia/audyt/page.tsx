'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Building2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import AuditResultView, { AuditResult } from '@/components/audyt/AuditResultView';

export default function AudytPage() {
  const [url, setUrl] = useState('');
  const [siteType, setSiteType] = useState<'services' | 'ecommerce'>('services');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);

  const scanSteps = [
    "Inicjalizacja bezpiecznego połączenia...",
    "Odpytywanie Google PageSpeed Insights API...",
    "Analiza polityki bezpieczeństwa (CSP, HSTS)...",
    "Detekcja stosu i bibliotek (Next.js, WP, Page Builders)...",
    "Kalkulacja strat konwersji i zapytań...",
    "Generowanie diagnozy architekta AI..."
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
        body: JSON.stringify({ url, siteType }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await res.json();
      const elapsedTime = Date.now() - startTime;
      
      // LABOR ILLUSION: Wymuszamy minimum 10 sekund skanowania dla prestiżu analizy
      const MIN_WAIT_TIME = 10000;
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
      setResult({ 
        url, 
        overallScore: 0, 
        lossPercentage: 0, 
        pillars: [], 
        aiReport: '', 
        siteType,
        error: "Wystąpił błąd podczas komunikacji z API." 
      });
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-slate-600 selection:bg-orange-500 selection:text-white">
      <Link href="/narzedzia" className="inline-flex items-center text-sm font-mono text-slate-500 hover:text-orange-600 transition-colors mb-12">
        ← Powrót do narzędzi
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">
          Audyt Odporności Cyfrowej
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
          {siteType === 'ecommerce' 
            ? 'Zdiagnozuj wąskie gardła swojego sklepu. Zobacz czarno na białym, jak błędy technologiczne obniżają Twoją sprzedaż i palą budżet reklamowy.'
            : 'Zdiagnozuj wąskie gardła strony firmowej. Sprawdź, czy błędy w kodzie i powolne ładowanie nie odstraszają potencjalnych klientów B2B.'}
        </p>
      </div>

      {/* Przełącznik Profilu: Usługi vs E-commerce */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/80 p-1.5 rounded-2xl border border-slate-200 flex gap-2 shadow-sm backdrop-blur-md">
          <button
            type="button"
            onClick={() => setSiteType('services')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              siteType === 'services'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Strona Firmowa / Usługi
          </button>
          <button
            type="button"
            onClick={() => setSiteType('ecommerce')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              siteType === 'ecommerce'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Sklep E-commerce
          </button>
        </div>
      </div>

      <div className="bg-white/70 border border-slate-200/70 rounded-3xl p-8 backdrop-blur-3xl mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-400/10 blur-[100px] rounded-full pointer-events-none" />

        <form onSubmit={handleScan} className="relative z-10">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider font-mono">
            {siteType === 'ecommerce' ? 'Adres sklepu internetowego (URL)' : 'Adres strony firmowej / portalu (URL)'}
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={siteType === 'ecommerce' ? 'np. dzikistyl.com, sklep-urwis.pl' : 'np. stowarzyszeniekas.pl, moja-firma.pl'}
              className="flex-grow bg-white/90 border-2 border-slate-200 focus:border-orange-500 rounded-xl py-4 px-6 text-slate-900 text-base outline-none transition-colors shadow-inner"
              disabled={isScanning}
            />
            <button
              type="submit"
              disabled={isScanning || !url}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:scale-105 shrink-0"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Skanowanie...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  {siteType === 'ecommerce' ? 'Analizuj Sklep' : 'Analizuj Stronę'}
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
              className="mt-8 pt-8 border-t border-slate-100 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 font-mono text-xs">{scanSteps[scanStep]}</span>
                <span className="text-orange-600 font-mono font-bold text-xs">{Math.round((scanStep / scanSteps.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
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
