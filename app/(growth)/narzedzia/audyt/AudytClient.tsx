'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Building2, ShoppingCart, Swords } from 'lucide-react';
import AuditResultView, { AuditResult } from '@/components/audyt/AuditResultView';
import { SiteType } from '@/app/api/audit-master/types';

export function AudytClient() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token');
  const urlParam = searchParams.get('url');
  const competitorParam = searchParams.get('competitor') || searchParams.get('competitorUrl');

  const [url, setUrl] = useState(urlParam || '');
  const [competitorUrl, setCompetitorUrl] = useState(competitorParam || '');
  const [showCompetitor, setShowCompetitor] = useState(!!competitorParam);
  const [siteType, setSiteType] = useState<SiteType>('services');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const scanSteps = [
    "Inicjalizacja i wykrywanie mapy witryny (sitemap.xml)...",
    "Pobieranie i analiza do 35 kluczowych podstron...",
    "Audyt architektury DOM, skryptów i nagłówków bezpieczeństwa...",
    "Równoległa analiza telemetrii i benchmark konkurenta...",
    "Badanie Core Web Vitals w Google Lighthouse...",
    "Kompilacja twardych dowodów i diagnoza Architekta AI..."
  ];

  const handleScan = React.useCallback(async (targetUrl: string, currentSiteType: SiteType, targetCompetitorUrl?: string) => {
    if (!targetUrl) return;

    setIsScanning(true);
    setResult(null);
    setScanStep(0);
    setErrorMessage('');

    // Płynna symulacja kroków dla użytkownika
    const stepInterval = setInterval(() => {
      setScanStep((prev) => {
        if (prev < scanSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 2200);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const res = await fetch('/api/audit-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          siteType: currentSiteType,
          competitorUrl: targetCompetitorUrl && targetCompetitorUrl.trim().length > 0 ? targetCompetitorUrl.trim() : undefined
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      clearInterval(stepInterval);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Wystąpił błąd podczas analizy.');
      }

      const data: AuditResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      const msg = err instanceof Error ? err.message : 'Wystąpił błąd podczas komunikacji z serwerem.';
      setErrorMessage(msg);
    } finally {
      setIsScanning(false);
    }
  }, [scanSteps.length]);

  // Jeśli w URL jest gotowy token (np. z cold maila), załaduj natychmiast z cache
  useEffect(() => {
    if (tokenParam) {
      setIsScanning(true);
      setErrorMessage('');
      fetch(`/api/audit-master?token=${encodeURIComponent(tokenParam)}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Nie znaleziono zapisanego raportu.');
          return res.json();
        })
        .then((data: AuditResult) => {
          setResult(data);
          if (data.url) setUrl(data.url);
          if (data.siteType) setSiteType(data.siteType);
        })
        .catch((err: Error) => {
          setErrorMessage(err.message);
        })
        .finally(() => {
          setIsScanning(false);
        });
    } else if (urlParam) {
      handleScan(urlParam, siteType, competitorParam || undefined);
    }
  }, [tokenParam, urlParam, competitorParam, siteType, handleScan]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(url, siteType, showCompetitor ? competitorUrl : undefined);
  };

  return (
    <div className="w-full">
      {/* Przełącznik Profilu */}
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

      {/* Formularz Skanowania */}
      <div className="bg-white/70 border border-slate-200/70 rounded-3xl p-6 md:p-8 backdrop-blur-3xl mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <form onSubmit={onSubmit} className="relative z-10">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider font-mono">
            {siteType === 'ecommerce' ? 'Adres sklepu internetowego (URL)' : 'Adres strony firmowej / portalu (URL)'}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={siteType === 'ecommerce' ? 'np. dzikistyl.com, rltpolska.pl' : 'np. stowarzyszeniekas.pl, moja-firma.pl'}
              className="flex-grow bg-white/90 border-2 border-slate-200 focus:border-orange-500 rounded-xl py-3.5 px-5 text-slate-900 text-sm outline-none transition-colors shadow-inner font-mono"
              disabled={isScanning}
            />
            <button
              type="submit"
              disabled={isScanning || !url}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:scale-[1.02] shrink-0 active:scale-95"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Skanowanie witryny...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{siteType === 'ecommerce' ? 'Analizuj Sklep' : 'Analizuj Stronę'}</span>
                </>
              )}
            </button>
          </div>

          {/* Opcja Benchmarku z Konkurentem */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowCompetitor(!showCompetitor)}
              className="text-xs font-mono font-semibold text-slate-600 hover:text-orange-600 flex items-center gap-1.5 transition-colors"
            >
              <Swords className="w-3.5 h-3.5 text-orange-500" />
              <span>{showCompetitor ? 'Ukryj porównanie z konkurentem' : '⚔️ Porównaj z konkurentem (Benchmark Head-to-Head)'}</span>
            </button>
          </div>

          <AnimatePresence>
            {showCompetitor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-slate-100 overflow-hidden"
              >
                <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider font-mono">
                  Adres witryny konkurenta (opcjonalnie)
                </label>
                <input
                  type="text"
                  value={competitorUrl}
                  onChange={(e) => setCompetitorUrl(e.target.value)}
                  placeholder="np. rywal-sklep.pl, inna-firma.com"
                  className="w-full bg-white/90 border border-slate-200 focus:border-orange-500 rounded-xl py-2.5 px-4 text-slate-900 text-xs sm:text-sm outline-none transition-colors shadow-inner font-mono"
                  disabled={isScanning}
                />
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  Przetestujemy równolegle czas reakcji (TTFB), silnik, zdarzenie add_to_cart oraz Consent Mode v2 rywala.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {errorMessage && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-mono">
            {errorMessage}
          </div>
        )}

        {/* Stepper skanowania */}
        <AnimatePresence mode="wait">
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-slate-100 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 font-mono text-xs">{scanSteps[scanStep]}</span>
                <span className="text-orange-600 font-mono font-bold text-xs">
                  {Math.round(((scanStep + 1) / scanSteps.length) * 100)}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {result && <AuditResultView result={result} onRetry={() => setResult(null)} />}
    </div>
  );
}
