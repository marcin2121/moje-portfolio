'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Building2, ShoppingCart, Swords, X, Globe, Lock, Zap, ShieldCheck, Sparkles, Play } from 'lucide-react';
import AuditResultView, { AuditResult } from '@/components/audyt/AuditResultView';
import { SiteType } from '@/app/api/audit-master/types';
import { parseDomainFromToken } from '@/app/api/audit-master/utils/token';
import { trackAuditEvent } from '@/lib/telemetry';

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

  // Refy zapobiegające wielokrotnemu pobieraniu tego samego tokenu / blokowaniu przełącznika profilu
  const processedInitialTokenRef = React.useRef<string | null>(null);
  const initialUrlScannedRef = React.useRef<boolean>(false);

  const scanSteps = [
    "Łączenie ze stroną i sprawdzanie jej struktury...",
    "Sprawdzanie kluczowych zakładek i oferty...",
    "Badanie czy strona otwiera się szybko i wygodnie na telefonach...",
    "Weryfikacja czy poprawnie mierzysz zapytania od klientów...",
    "Sprawdzanie wytycznych Google pod kątem pozycji w wyszukiwarce...",
    "Przygotowanie czytelnego raportu i wskazówek dla Twojej firmy..."
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

      if (data.token && typeof window !== 'undefined') {
        const domainSlug = data.domain || targetUrl;
        processedInitialTokenRef.current = data.token;
        window.history.replaceState(null, '', `/narzedzia/audyt?token=${encodeURIComponent(data.token)}&url=${encodeURIComponent(domainSlug)}`);
      }

      trackAuditEvent({
        domain: data.domain || targetUrl,
        score: data.overallScore,
        siteType: currentSiteType,
        token: data.token,
      });
    } catch (err: unknown) {
      clearInterval(stepInterval);
      const msg = err instanceof Error ? err.message : 'Wystąpił błąd podczas komunikacji z serwerem.';
      setErrorMessage(msg);
    } finally {
      setIsScanning(false);
    }
  }, [scanSteps.length]);

  // Ref synchronizowany z profilem witryny, by nie dodawać siteType do dependency array efektu URL
  const siteTypeRef = React.useRef(siteType);
  useEffect(() => {
    siteTypeRef.current = siteType;
  }, [siteType]);

  // Jeśli w URL jest gotowy token (np. z powiadomienia Discord lub cold maila), załaduj go jednorazowo
  useEffect(() => {
    if (tokenParam) {
      if (processedInitialTokenRef.current === tokenParam) {
        return;
      }
      processedInitialTokenRef.current = tokenParam;
      setIsScanning(true);
      setErrorMessage('');
      const targetQuery = urlParam
        ? `token=${encodeURIComponent(tokenParam)}&url=${encodeURIComponent(urlParam)}`
        : `token=${encodeURIComponent(tokenParam)}`;

      fetch(`/api/audit-master?${targetQuery}`)
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const candidateDomain = errData?.fallbackDomain || urlParam || parseDomainFromToken(tokenParam);
            if (candidateDomain) {
              setUrl(candidateDomain);
              handleScan(candidateDomain, siteTypeRef.current, competitorParam || undefined);
              return null;
            }
            throw new Error('Raport o podanym identyfikatorze wygasł lub nie został odnaleziony. Wpisz adres strony powyżej, aby wygenerować nową analizę.');
          }
          return res.json();
        })
        .then((data: AuditResult | null) => {
          if (!data) return;
          setResult(data);
          if (data.url) setUrl(data.url);
          if (data.siteType) setSiteType(data.siteType);
        })
        .catch((err: Error) => {
          const candidateDomain = urlParam || parseDomainFromToken(tokenParam);
          if (candidateDomain) {
            setUrl(candidateDomain);
            handleScan(candidateDomain, siteTypeRef.current, competitorParam || undefined);
            return;
          }
          setErrorMessage(err.message);
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', '/narzedzia/audyt');
          }
        })
        .finally(() => {
          setIsScanning(false);
        });
    } else if (urlParam && !initialUrlScannedRef.current) {
      initialUrlScannedRef.current = true;
      handleScan(urlParam, siteTypeRef.current, competitorParam || undefined);
    }
  }, [tokenParam, urlParam, competitorParam, handleScan]);

  const urlInputRef = React.useRef<HTMLInputElement>(null);

  const focusAuditInput = React.useCallback(() => {
    const formEl = document.getElementById('formularz-audytu');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      if (urlInputRef.current) {
        urlInputRef.current.focus();
        urlInputRef.current.select();
      }
    }, 250);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#formularz-audytu' || searchParams.get('focus') === '1') {
        setTimeout(focusAuditInput, 200);
      }
    }

    const headingEl = document.getElementById('darmowy-audyt-naglowek');
    if (headingEl) {
      const handleHeadingClick = (e: MouseEvent) => {
        e.preventDefault();
        focusAuditInput();
      };
      headingEl.addEventListener('click', handleHeadingClick);
      return () => {
        headingEl.removeEventListener('click', handleHeadingClick);
      };
    }
  }, [focusAuditInput, searchParams]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    handleScan(url.trim(), siteType, showCompetitor ? competitorUrl : undefined);
  };

  return (
    <div className="w-full">
      {/* Terminal / Konsola Diagnostyczna */}
      <div 
        id="formularz-audytu"
        className="scroll-mt-28 bg-white/95 border border-slate-200/90 rounded-3xl backdrop-blur-2xl mb-12 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.08)] relative overflow-hidden transition-all duration-300"
      >
        {/* Pasek narzędziowy konsoli (Inspector Bar) */}
        <div className="bg-slate-50/90 border-b border-slate-200/80 px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Lewa strona: Kropki okna i etykieta */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 select-none" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300/80 border border-slate-400/40 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300/80 border border-slate-400/40 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300/80 border border-slate-400/40 inline-block" />
            </div>
            <span className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline-block">
              Sprawdź, czy Twoja strona nie traci klientów
            </span>
          </div>

          {/* Środek / Przełącznik Profilu (zintegrowany, nowoczesny) */}
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setSiteType('services')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                siteType === 'services'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${siteType === 'services' ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>Strona Firmowa</span>
            </button>
            <button
              type="button"
              onClick={() => setSiteType('ecommerce')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                siteType === 'ecommerce'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingCart className={`w-3.5 h-3.5 ${siteType === 'ecommerce' ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>Sklep E-commerce</span>
            </button>
          </div>

          {/* Prawa strona: status certyfikatu */}
          <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Darmowy test bez zobowiązań</span>
          </div>
        </div>

        {/* Ciało konsoli */}
        <div className="p-6 sm:p-8 md:p-10">
          <form onSubmit={onSubmit} className="relative z-10">
            {/* Etykieta główna z zachętą */}
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="audit-url-input" className="block text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
                {siteType === 'ecommerce' ? 'Wpisz adres swojego sklepu' : 'Wpisz adres swojej strony firmowej'}
              </label>
              <span className="text-xs font-mono text-orange-600 font-bold">
                Bez rejestracji i bez opłat · Wynik w 15 sekund
              </span>
            </div>

            {/* Monumentalny Omnibox Bar */}
            <div className="group relative rounded-2xl p-2 sm:p-2.5 bg-slate-50/90 hover:bg-slate-50 focus-within:bg-white border-2 border-slate-200/90 hover:border-slate-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 shadow-inner transition-all duration-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Przedrostek https:// z kłódeczką */}
                <div className="hidden xs:flex items-center gap-1.5 pl-2 sm:pl-3 pr-2 text-slate-400 font-mono text-sm sm:text-base font-bold select-none shrink-0 border-r border-slate-200/70 sm:py-2">
                  <div className="p-1 rounded-md bg-emerald-100/70 text-emerald-700">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span>https://</span>
                </div>

                {/* Pole tekstowe */}
                <div className="relative flex-grow flex items-center">
                  <Globe className="xs:hidden w-4 h-4 text-slate-400 mr-2 shrink-0 ml-2" />
                  <input
                    ref={urlInputRef}
                    id="audit-url-input"
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={siteType === 'ecommerce' ? 'np. twoj-sklep.pl' : 'np. twoja-firma.pl'}
                    className="w-full bg-transparent text-slate-900 text-base sm:text-lg md:text-xl font-mono font-semibold outline-none py-2 px-1 placeholder:text-slate-400 placeholder:font-normal"
                    disabled={isScanning}
                  />
                  {url && !isScanning && (
                    <button
                      type="button"
                      onClick={() => {
                        setUrl('');
                        setResult(null);
                        processedInitialTokenRef.current = null;
                        if (typeof window !== 'undefined') {
                          window.history.replaceState(null, '', '/narzedzia/audyt');
                        }
                      }}
                      className="text-slate-400 hover:text-slate-600 p-2 cursor-pointer transition-colors shrink-0"
                      title="Wyczyść adres"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Duży Przycisk CTA */}
                <button
                  type="submit"
                  disabled={isScanning || !url.trim()}
                  className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base tracking-tight transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(249,115,22,0.3)] hover:shadow-[0_14px_35px_rgba(249,115,22,0.4)] hover:scale-[1.01] shrink-0 cursor-pointer"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Skanowanie...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 text-amber-200 fill-amber-200" />
                      <span>{siteType === 'ecommerce' ? 'Przetestuj mój sklep bezpłatnie' : 'Przetestuj moją stronę bezpłatnie'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Aktywny wskaźnik postępu skanowania */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="mt-4 p-4 sm:p-5 rounded-2xl bg-orange-500/[0.06] border border-orange-500/20 overflow-hidden shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <Loader2 className="w-4 h-4 text-orange-500 animate-spin shrink-0" />
                      <span className="text-slate-800 font-mono text-xs sm:text-sm font-semibold">
                        {scanSteps[scanStep]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-mono">
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Postęp testu:</span>
                      <span className="text-xs sm:text-sm font-bold text-orange-600 bg-orange-100/90 border border-orange-200/80 px-2 py-0.5 rounded-md">
                        {Math.round(((scanStep + 1) / scanSteps.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-xs"
                      initial={{ width: 0 }}
                      animate={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Komunikat o błędzie */}
            {errorMessage && (
              <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-mono">
                {errorMessage}
              </div>
            )}

            {/* Szybkie przykłady demo (One-Click Demo Chips) */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-slate-500 font-medium">Nie chcesz wpisywać swojej? Zobacz przykładowy raport:</span>
                <button
                  type="button"
                  onClick={() => {
                    setUrl('molendadevelopment.pl');
                    setSiteType('services');
                    handleScan('molendadevelopment.pl', 'services');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200 rounded-lg text-slate-700 font-semibold transition-colors cursor-pointer"
                  title="Kliknij, aby przetestować na przykładzie molendadevelopment.pl"
                >
                  <Play className="w-3 h-3 text-orange-500 fill-orange-500" />
                  <span>molendadevelopment.pl</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">(Strona firmowa)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUrl('rltpolska.pl');
                    setSiteType('ecommerce');
                    handleScan('rltpolska.pl', 'ecommerce');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200 rounded-lg text-slate-700 font-semibold transition-colors cursor-pointer"
                  title="Kliknij, aby przetestować na przykładzie sklepu RLT Polska"
                >
                  <Play className="w-3 h-3 text-orange-500 fill-orange-500" />
                  <span>rltpolska.pl</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">(Sklep online)</span>
                </button>
              </div>

              {/* Opcja Benchmarku z Konkurentem */}
              <button
                type="button"
                onClick={() => setShowCompetitor(!showCompetitor)}
                className="text-xs font-mono font-semibold text-slate-600 hover:text-orange-600 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Swords className="w-3.5 h-3.5 text-orange-500" />
                <span>{showCompetitor ? 'Schowaj porównanie z konkurencją' : 'Chcesz sprawdzić też stronę konkurencji?'}</span>
              </button>
            </div>

            {/* Rozwinięcie pola konkurenta */}
            <AnimatePresence>
              {showCompetitor && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-200/80 overflow-hidden"
                >
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider font-mono">
                    Adres strony Twojego konkurenta (opcjonalnie)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={competitorUrl}
                      onChange={(e) => setCompetitorUrl(e.target.value)}
                      placeholder="np. rywal-sklep.pl, inna-firma.com"
                      className="w-full bg-slate-50/70 focus:bg-white border-2 border-slate-200 focus:border-orange-500 rounded-xl py-3 px-4 text-slate-900 text-sm outline-none transition-colors shadow-inner font-mono"
                      disabled={isScanning}
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-mono mt-1.5 block">
                    Porównamy obie witryny: dowiesz się, czyja strona otwiera się szybciej i lepiej zdobywa klientów z Google.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Trzy twarde gwarancje pod spodem */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-slate-600">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Wynik w 15 sekund bez czekania</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>100% bezpiecznie: bez haseł i bez instalacji</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Dowiedz się, dlaczego klienci opuszczają stronę</span>
            </div>
          </div>
        </div>
      </div>

      {result && <AuditResultView result={result} onRetry={() => setResult(null)} />}
    </div>
  );
}
