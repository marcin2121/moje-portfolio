'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Search, Server, Settings, Copy, Check, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AuditMasterResponse } from '@/app/api/audit-master/types';
import AuditEvidenceCard from './AuditEvidenceCard';
import PagesTable from './PagesTable';
import AuditConsultationForm from './AuditConsultationForm';
import QuickCriticalIssues from './QuickCriticalIssues';
import AdsAndTrackingCard from './AdsAndTrackingCard';
import SocialSharePreviewCard from './SocialSharePreviewCard';
import AuditChecklistSection from './AuditChecklistSection';
import CompetitorBenchmarkCard from './CompetitorBenchmarkCard';
import LighthouseGauge, { GaugeSegment } from './LighthouseGauge';
import MissingPointsRoadmap from './MissingPointsRoadmap';
import { pluralizePolish } from '@/app/api/audit-master/utils/crawler';

export type { AuditMasterResponse as AuditResult };

interface AuditResultViewProps {
  result: AuditMasterResponse;
  onRetry: () => void;
}

export default function AuditResultView({ result }: AuditResultViewProps) {
  const [copied, setCopied] = useState(false);

  const isEcommerce = result.siteType === 'ecommerce';
  let conversionLabel = 'zapytań i leadów';
  if (isEcommerce) conversionLabel = 'sprzedaży e-commerce';
  else if (result.siteType === 'ngo_foundation') conversionLabel = 'darowizn i wsparcia 1.5%';
  else if (result.siteType === 'gov_public') conversionLabel = 'dostępności i zaufania obywateli';
  else if (result.siteType === 'education') conversionLabel = 'zaufania rodziców i naboru kandydatów';
  else if (result.siteType === 'local_services') conversionLabel = 'rezerwacji i kontaktów telefonicznych';

  const copyShareLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://molendadevelopment.pl';
    const link = `${origin}/narzedzia/audyt?token=${result.token}&url=${encodeURIComponent(result.domain)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const evidence = result.evidence;
  const pages = result.pages || [];
  const hasProducts = evidence?.categoriesSummary?.products && evidence.categoriesSummary.products.count > 0;
  const hasBlog = evidence?.categoriesSummary?.blog && evidence.categoriesSummary.blog.count > 0;

  // Lista podstron z kodami innymi niż 200 OK (błędy 4xx/5xx i przekierowania 3xx)
  const httpIssues = React.useMemo(() => {
    if (!result.pages) return [];
    return result.pages
      .filter(p => p.statusCode !== 200)
      .map(p => {
        let label = `Status HTTP ${p.statusCode}`;
        if (p.statusCode === 404) label = 'Błąd HTTP 404 (Nie znaleziono)';
        else if (p.statusCode >= 500) label = `Błąd serwera HTTP ${p.statusCode}`;
        else if (p.statusCode >= 400) label = `Błąd klienta HTTP ${p.statusCode}`;
        else if (p.statusCode === 301) label = 'Przekierowanie stałe HTTP 301';
        else if (p.statusCode === 302) label = 'Przekierowanie tymczasowe HTTP 302';
        else if (p.statusCode >= 300) label = `Przekierowanie HTTP ${p.statusCode}`;

        return {
          url: p.url,
          label: p.url,
          sublabel: label
        };
      });
  }, [result.pages]);

  // Automatyczna normalizacja raportu (zapobiega udawaniu człowieka w 1. osobie i naprawia błędy w zbuforowanych audytach)
  const cleanAiReport = React.useMemo(() => {
    if (!result.aiReport) return '';
    return result.aiReport
      .replace(/Jako Senior Architect przeanalizowałem serwis (.*?) i zidentyfikowałem/gi, 'Analiza architektoniczna serwisu $1 zidentyfikowała')
      .replace(/Jako Senior Architect przeanalizowałem/gi, 'Analiza inżynieryjna serwisu wykazała')
      .replace(/jako (?:Senior )?(?:Full-Stack )?Architect(?:em)?/gi, 'w ramach rekomendacji inżynieryjnych')
      .replace(/zamiast Waszego gabinetu wybierają konkurencję z sąsiedniej ulicy/gi, 'zamiast oferty serwisu trafiają do alternatywnych wyników wyszukiwania')
      .replace(/zamiast Waszego gabinetu/gi, 'zamiast Waszej oferty')
      .replace(/Waszego gabinetu/gi, 'Waszego serwisu')
      .replace(/Twojego gabinetu/gi, 'Twojego serwisu')
      .replace(/wybierają konkurencję z sąsiedniej ulicy/gi, 'trafiają do alternatywnych ofert w Google')
      .replace(/konkurencji z sąsiedniej ulicy/gi, 'innych ofert w wyszukiwarce')
      .replace(/\buporządkuję\b/gi, 'rekomendowane jest uporządkowanie')
      .replace(/\bzoptymalizuję\b/gi, 'zoptymalizowanie')
      .replace(/\bwdrożę\b/gi, 'wdrożenie')
      .replace(/\bskonfiguruję\b/gi, 'skonfigurowanie')
      .replace(/\bwyeliminuję\b/gi, 'wyeliminowanie')
      .replace(/exemplaryczn[a-ząęółśżźćń]+/gi, 'wzorową')
      .replace(/\bexemplary\b/gi, 'wzorową')
      .replace(/\(?\bRFP\b\)?/gi, '')
      .replace(/–/g, '-')
      .replace(/—/g, '-');
  }, [result.aiReport]);

  const isWordPress = result.detectedPlatform?.toLowerCase().includes('wordpress') || result.detectedPlatform?.toLowerCase().includes('woocommerce');

  // Segmenty w dedykowanej klasie WordPress (Lighthouse style)
  const wpSegments: GaugeSegment[] = React.useMemo(() => {
    const perf = result.pillars?.find(p => p.name === 'Szybkość')?.score || 50;
    const seo = result.pillars?.find(p => p.name === 'SEO')?.score || 60;
    const sec = result.pillars?.find(p => p.name === 'Bezpieczeństwo')?.score || 40;
    
    const domCount = result.codeSmells?.domElements || 1500;
    const domScore = domCount < 1600 ? 90 : domCount < 2600 ? 70 : 45;
    const scriptScore = Math.max(30, 90 - (result.codeSmells?.badScripts || 0) * 8);
    const wpHygiene = Math.round((domScore + scriptScore) / 2);

    const ads = result.evidence?.adsAndTracking;
    const trackingScore = (ads?.hasGoogleAds || ads?.hasGA4) ? (ads?.hasConsentModeV2 ? 90 : 60) : 40;

    return [
      { name: 'Szybkość', score: perf },
      { name: 'SEO', score: seo },
      { name: 'Bezpiecz.', score: sec },
      { name: 'Jakość kodu', score: wpHygiene },
      { name: 'Analityka', score: trackingScore }
    ];
  }, [result.pillars, result.codeSmells, result.evidence]);

  const wpScore = React.useMemo(() => {
    if (result.platformScore !== undefined) return result.platformScore;
    const sum = wpSegments.reduce((acc, s) => acc + s.score, 0);
    return Math.min(95, Math.round(sum / wpSegments.length));
  }, [result.platformScore, wpSegments]);

  // Segmenty ogólne (Wszystkie technologie)
  const allTechSegments: GaugeSegment[] = React.useMemo(() => {
    return [
      { name: 'Szybkość', score: result.pillars?.find(p => p.name === 'Szybkość')?.score || 50 },
      { name: 'SEO', score: result.pillars?.find(p => p.name === 'SEO')?.score || 60 },
      { name: 'Bezpiecz.', score: result.pillars?.find(p => p.name === 'Bezpieczeństwo')?.score || 40 },
      { name: 'Stabilność', score: result.pillars?.find(p => p.name === 'Skalowalność')?.score || 40 },
      { name: 'Analityka', score: result.pillars?.find(p => p.name === 'Automatyzacja')?.score || 40 }
    ];
  }, [result.pillars]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-12"
    >
      {/* Dedykowany nagłówek dokumentu do druku / zapisu PDF */}
      <div className="hidden print:block pb-6 mb-6 border-b-2 border-slate-900">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Oficjalny Raport Audytu Technicznego · Molenda Development
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {result.domain}
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-sans">
              Przeanalizowano {pluralizePolish(evidence?.totalPages || 1, 'podstronę', 'podstrony', 'podstron')} · Wygenerowano: {new Date(result.createdAt).toLocaleDateString('pl-PL')} · Wynik ogólny: <strong className="text-slate-900 font-bold">{result.overallScore}/100</strong>
            </p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <strong className="block text-slate-900 font-bold text-sm">Marcin Molenda</strong>
            <span>Architektura Next.js & Inżynieria Web</span>
            <span className="block font-mono text-[11px] mt-0.5">marcin@molendadevelopment.pl</span>
            <span className="block font-mono text-[11px] font-bold text-slate-900">+48 789 746 950</span>
          </div>
        </div>
      </div>

      {/* Pasek Nagłówka Audytu + Kopiowanie Linku + Pobieranie PDF */}
      <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:border-slate-300">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              Raport audytu domeny
            </span>
            {result.cached && (
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md font-semibold">
                Błyskawiczny cache
              </span>
            )}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {result.domain}
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Przeanalizowano {pluralizePolish(evidence?.totalPages || 1, 'podstronę', 'podstrony', 'podstron')} · Wygenerowano: {new Date(result.createdAt).toLocaleDateString('pl-PL')}
          </p>
          {(evidence?.totalPages || 1) === 1 && (
            <p className="mt-2 text-xs text-slate-500 print:hidden">
              Zbadano fundamenty strony głównej.{' '}
              <a
                href="#konsultacja"
                className="text-orange-600 hover:text-orange-700 font-medium underline underline-offset-2 transition-colors"
              >
                Chcesz pełny audyt wszystkich podstron serwisu?
              </a>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 print:hidden">
          <button
            type="button"
            onClick={copyShareLink}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Link skopiowany!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Kopiuj unikalny link do audytu</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Pobierz Raport PDF</span>
          </button>
        </div>
      </div>

      {/* 1. Karta Wyników Architektury i Kodu (Pełna szerokość) */}
      <div className="w-full bg-white/80 border border-slate-200/70 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-6 md:p-8 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
          <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
            Podsumowanie audytu
          </span>
          <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80 whitespace-nowrap">
            Kompleksowy test 64 parametrów
          </span>
        </div>

        {/* Zegary telemetryczne */}
        {isWordPress ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
            <div className="p-6 bg-slate-50/60 rounded-2xl border border-slate-200/60 flex flex-col items-center justify-center">
              <LighthouseGauge
                score={wpScore}
                title="Na tle stron WordPress"
                subtitle="Optymalizacja w ramach Twojej technologii"
                segments={wpSegments}
                size={180}
                highlight={true}
                badgeText="Twoja platforma"
              />
            </div>
            <div className="p-6 bg-slate-50/60 rounded-2xl border border-slate-200/60 flex flex-col items-center justify-center">
              <LighthouseGauge
                score={result.overallScore}
                title="Na tle liderów rynku"
                subtitle="Względem najszybszych technologii w sieci"
                segments={allTechSegments}
                size={180}
              />
            </div>
          </div>
        ) : (
          <div className="py-6 flex justify-center">
            <LighthouseGauge
              score={result.overallScore}
              title="Ocena techniczna witryny"
              subtitle="Szybkość, SEO, bezpieczeństwo i stabilność"
              segments={allTechSegments}
              size={195}
              highlight={true}
              badgeText="Wynik ogólny"
            />
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {result.lossPercentage === 0 || result.overallScore === 100 ? (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl px-5 text-center sm:text-left flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-700 font-bold whitespace-nowrap">
                Efektywność techniczna:
              </span>
              <span className="text-xl font-black text-emerald-600 font-mono">
                100% (Maksymalna)
              </span>
            </div>
          ) : result.lossPercentage <= 6 ? (
            <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl px-5 text-center sm:text-left flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-800 font-bold whitespace-nowrap">
                    Ryzyko utraty części {conversionLabel}:
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-md">
                    NISKIE
                  </span>
                  <span className="text-sm font-black text-emerald-700 font-mono">
                    ~{result.lossPercentage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Drobne usterki semantyczne bez krytycznego wpływu na bieżącą konwersję.
                </p>
              </div>
            </div>
          ) : result.lossPercentage <= 15 ? (
            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl px-5 text-center sm:text-left flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-800 font-bold whitespace-nowrap">
                    Ryzyko utraty części {conversionLabel}:
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-md">
                    UMIARKOWANE
                  </span>
                  <span className="text-sm font-black text-amber-700 font-mono">
                    ~{result.lossPercentage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Odczuwalne spowolnienie lub braki w śledzeniu zdarzeń osłabiające wyniki.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl px-5 text-center sm:text-left flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-rose-700 font-bold whitespace-nowrap">
                    Szacowany spadek {conversionLabel}:
                  </span>
                  <span className="text-[11px] font-mono font-bold bg-rose-200/70 text-rose-900 px-2 py-0.5 rounded-md">
                    PODWYŻSZONE
                  </span>
                  <span className="text-sm font-black text-rose-600 font-mono">
                    ~{result.lossPercentage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Poważne blokady renderowania lub brak kluczowej analityki.
                </p>
              </div>
            </div>
          )}
          <p className="text-slate-500 text-[11px] font-mono text-center sm:text-right leading-relaxed max-w-md">
            {isWordPress
              ? 'Pierwszy wynik ocenia jakość strony na tle innych witryn WordPress. Drugi wynik porównuje ją z najszybszymi, nowoczesnymi technologiami internetowymi.'
              : 'Trzystopniowa inżynieryjna skala ryzyka biznesowego wyliczana na podstawie szybkości ładowania, poprawności kodu i wskaźników Google.'}
          </p>
        </div>
      </div>

      {/* 2. Karta Wyników Audytu (Pełna szerokość) */}
      <div className="w-full bg-white/80 border border-slate-200/70 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-6 md:p-8 relative overflow-hidden backdrop-blur-2xl">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 uppercase tracking-widest">
              <Shield className="w-4 h-4 text-orange-600" />
              <span>Wyniki audytu</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
              Automatyczna analiza w czasie rzeczywistym
            </span>
          </div>
          <div className="prose max-w-none text-slate-700 leading-relaxed text-sm md:text-base prose-p:mb-3 prose-strong:text-slate-900 prose-ul:my-2 prose-li:my-0.5">
            <ReactMarkdown>{cleanAiReport}</ReactMarkdown>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-4 pt-3 border-t border-slate-100">
            Diagnoza opracowana na podstawie analizy szybkości serwera, poprawności kodu oraz wskaźników Google Core Web Vitals.
          </p>
        </div>
      </div>

      {/* SEKCJA 0.5: Bilans utraconych punktów & Recepta na 100/100 */}
      <MissingPointsRoadmap
        result={result}
        wpScore={wpScore}
        isWordPress={isWordPress}
      />

      {/* SEKCJA 1: Szybka Diagnoza Priorytetowa */}
      {result.quickIssues && result.quickIssues.length > 0 && (
        <QuickCriticalIssues issues={result.quickIssues} />
      )}

      {/* SEKCJA 2: Pojedynek Technologiczny & Benchmark z Konkurentem (Head-to-Head) */}
      {result.competitorBenchmark && (
        <CompetitorBenchmarkCard
          benchmark={result.competitorBenchmark}
          yourDomain={result.domain}
        />
      )}

      {/* SEKCJA 3: Audyt Kampanii Płatnych & Telemetryki */}
      {evidence?.adsAndTracking && (
        <AdsAndTrackingCard tracking={evidence.adsAndTracking} domain={result.domain} siteType={result.siteType} />
      )}

      {/* SEKCJA 3.5: Wizualny Podgląd Udostępniania Social Media & Schema.org */}
      <SocialSharePreviewCard
        openGraph={evidence?.openGraphSummary || evidence?.adsAndTracking?.openGraphData}
        detectedSchemas={evidence?.detectedSchemas}
        domain={result.domain}
      />

      {/* SEKCJA 4: Asymetryczny Bento Grid filarów technicznych */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Przegląd filarów witryny
          </h3>
          <span className="text-xs font-mono text-slate-500">
            {evidence?.totalPages || 0} podstron przeskanowanych
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Indeksowalność */}
          <div className="bg-white/70 border border-slate-200/70 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900">Indeksowalność</h4>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                ✓ OK
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 font-mono">
              <div className="flex justify-between"><span>Sprawdzonych:</span> <strong>{evidence?.totalPages}</strong></div>
              <div className="flex justify-between"><span>Status 200 OK:</span> <strong className="text-emerald-700">{evidence?.status200Count}</strong></div>
              <div className="flex justify-between"><span>Przekierowania 3xx:</span> <strong>{evidence?.redirectsCount}</strong></div>
              <div className="flex justify-between"><span>Błędy 4xx/5xx:</span> <strong>{evidence?.errorsCount}</strong></div>
              <div className="flex justify-between"><span>Tag noindex:</span> <strong>{evidence?.noIndexCount}</strong></div>
            </div>
          </div>

          {/* 2. Tytuły stron (Title) */}
          <div className="bg-white/70 border border-slate-200/70 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-sm text-slate-900">Tytuły stron (Title)</h4>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                (evidence?.duplicateTitleGroups?.length || 0) > 0 ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'
              }`}>
                {(evidence?.duplicateTitleGroups?.length || 0) > 0 ? `⚠ ${pluralizePolish(evidence?.duplicateTitleGroups.length || 0, 'grupa duplikatów', 'grupy duplikatów', 'grup duplikatów')}` : '✓ OK'}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 font-mono">
              <div className="flex justify-between"><span>Bez tytułu:</span> <strong>{evidence?.missingTitleCount}</strong></div>
              <div className="flex justify-between"><span>Zduplikowane grupy:</span> <strong className="text-amber-600">{evidence?.duplicateTitleGroups?.length || 0}</strong></div>
              <div className="flex justify-between"><span>Średnia długość:</span> <strong>{evidence?.avgMetaLength || 0} znaków</strong></div>
            </div>
          </div>

          {/* 3. Meta description */}
          <div className="bg-white/70 border border-slate-200/70 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-600" />
                <h4 className="font-bold text-sm text-slate-900">Meta description</h4>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                (evidence?.missingMetaCount || 0) > 0 ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'
              }`}>
                {(evidence?.missingMetaCount || 0) > 0 ? `⚠ Brak na ${evidence?.missingMetaCount}` : '✓ OK'}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 font-mono">
              <div className="flex justify-between"><span>Bez opisu:</span> <strong>{evidence?.missingMetaCount}</strong></div>
              <div className="flex justify-between"><span>Średnia długość:</span> <strong>{evidence?.avgMetaLength} znaków</strong></div>
              <div className="text-[11px] text-slate-400 mt-1">Optymalnie: 150-160 znaków</div>
            </div>
          </div>

          {/* 4. Nagłówki H1 */}
          <div className="bg-white/70 border border-slate-200/70 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-600" />
                <h4 className="font-bold text-sm text-slate-900">Nagłówki H1</h4>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                (evidence?.missingH1Count || 0) > 0 ? 'text-rose-700 bg-rose-50' : 'text-emerald-700 bg-emerald-50'
              }`}>
                {(evidence?.missingH1Count || 0) > 0 ? `🔴 ${evidence?.missingH1Count} bez H1` : '✓ OK'}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 font-mono">
              <div className="flex justify-between"><span>Podstron bez H1:</span> <strong className="text-rose-600">{evidence?.missingH1Count}</strong></div>
              <div className="flex justify-between"><span>Podstron z H1:</span> <strong>{(evidence?.totalPages || 0) - (evidence?.missingH1Count || 0)}</strong></div>
              <div className="text-[11px] text-slate-400 mt-1">Każda strona powinna mieć dokładnie jeden H1</div>
            </div>
          </div>

          {/* 5. Treść (Content) */}
          <div className="bg-white/70 border border-slate-200/70 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-sm text-slate-900">Treść (Content)</h4>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                (evidence?.thinContentCount || 0) > 0 ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'
              }`}>
                {(evidence?.thinContentCount || 0) > 0 ? `⚠ ${evidence?.thinContentCount} thin content` : '✓ OK'}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 font-mono">
              <div className="flex justify-between"><span>Thin content (&lt;200 słów):</span> <strong className="text-amber-600">{evidence?.thinContentCount}</strong></div>
              <div className="flex justify-between"><span>Wystarczająca treść:</span> <strong>{(evidence?.totalPages || 0) - (evidence?.thinContentCount || 0)}</strong></div>
            </div>
          </div>

          {/* 6. Wydajność serwera & PSI */}
          <div className="bg-white/70 border border-slate-200/70 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900">Wydajność</h4>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                {evidence?.avgResponseTimeMs}ms
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 font-mono">
              <div className="flex justify-between"><span>Średni czas odpowiedzi TTFB:</span> <strong>{evidence?.avgResponseTimeMs}ms</strong></div>
              <div className="flex justify-between"><span>Platforma:</span> <strong className="truncate max-w-[130px]">{result.detectedPlatform}</strong></div>
              {result.codeSmells?.lcp && (
                <div className="flex justify-between"><span>LCP (Largest Paint):</span> <strong>{result.codeSmells.lcp}</strong></div>
              )}
            </div>
          </div>

          {/* 7. Canonical */}
          <div className="bg-white/70 border border-slate-200/70 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-600" />
                <h4 className="font-bold text-sm text-slate-900">Tagi Canonical</h4>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                (evidence?.missingCanonicalCount || 0) > 0 ? 'text-rose-700 bg-rose-50' : 'text-emerald-700 bg-emerald-50'
              }`}>
                {(evidence?.missingCanonicalCount || 0) > 0 ? `🔴 ${evidence?.missingCanonicalCount} bez canonical` : '✓ OK'}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 font-mono">
              <div className="flex justify-between"><span>Poprawny canonical:</span> <strong>{(evidence?.totalPages || 0) - (evidence?.missingCanonicalCount || 0)}</strong></div>
              <div className="flex justify-between"><span>Brak canonical:</span> <strong className="text-rose-600">{evidence?.missingCanonicalCount}</strong></div>
            </div>
          </div>

          {/* 8. Obrazy i Alt */}
          <div className="bg-white/70 border border-slate-200/70 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900">Obrazy i Alt</h4>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                (evidence?.missingAltTotal || 0) > 0 ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'
              }`}>
                {(evidence?.missingAltTotal || 0) > 0 ? `⚠ ${evidence?.missingAltTotal} bez alt` : '✓ OK'}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 font-mono">
              <div className="flex justify-between"><span>Brakujące atrybuty alt:</span> <strong>{evidence?.missingAltTotal}</strong></div>
              <div className="text-[11px] text-slate-400 mt-1">Atrybut alt jest kluczowy dla WCAG i Google Grafika</div>
            </div>
          </div>

          {/* 9. Bezpieczeństwo & Architektura Kodu */}
          <div className="bg-white/70 border border-slate-200/70 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900">Architektura & Bezpieczeństwo</h4>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Wynik: {result.pillars.find(p => p.name === 'Bezpieczeństwo')?.score || 50}/100
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 font-mono">
              <div className="flex justify-between"><span>Elementy DOM:</span> <strong>{result.codeSmells?.domElements || 0}</strong></div>
              <div className="flex justify-between"><span>Skrypty blokujące:</span> <strong>{result.codeSmells?.badScripts || 0}</strong></div>
              {result.codeSmells?.pageBuilders && result.codeSmells.pageBuilders.length > 0 && (
                <div className="flex justify-between"><span>Page Buildery:</span> <strong className="text-amber-600">{result.codeSmells.pageBuilders.join(', ')}</strong></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sekcja 1: Twarde Sprawdzenia Całej Witryny (Kluczowe Dowody) */}
      <div className="bg-white/70 border border-slate-200/70 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Weryfikacja integralności struktury i indeksacji
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Szczegółowa lista weryfikacji semantycznych i kanonicznych z dowodami w kodzie
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <AuditEvidenceCard
            title="Dostępność stron (status HTTP)"
            description={`${evidence?.status200Count}/${evidence?.totalPages} stron zwraca poprawny kod 200 OK. Błędy: ${evidence?.errorsCount}, przekierowania: ${evidence?.redirectsCount}.`}
            status={evidence?.errorsCount === 0 ? (evidence?.redirectsCount && evidence.redirectsCount > 0 ? 'warn' : 'ok') : 'bad'}
            percentage={((evidence?.status200Count || 0) / (evidence?.totalPages || 1)) * 100}
            metaText={`${evidence?.status200Count}/${evidence?.totalPages}`}
            detailsLabel="Strony z błędami lub przekierowaniami HTTP:"
            details={httpIssues}
          />

          <AuditEvidenceCard
            title="Tytuły stron (Title)"
            description={`${(evidence?.totalPages || 0) - (evidence?.missingTitleCount || 0)}/${evidence?.totalPages} stron ma zdefiniowany tag title.`}
            status={evidence?.missingTitleCount === 0 ? 'ok' : 'bad'}
            percentage={(((evidence?.totalPages || 0) - (evidence?.missingTitleCount || 0)) / (evidence?.totalPages || 1)) * 100}
            metaText={`${(evidence?.totalPages || 0) - (evidence?.missingTitleCount || 0)}/${evidence?.totalPages}`}
          />

          {evidence && evidence.duplicateTitleGroups.length > 0 && (
            <AuditEvidenceCard
              title="Zduplikowane tytuły stron"
              description={`Wykryto ${pluralizePolish(evidence.duplicateTitleGroups.length, 'grupę', 'grupy', 'grup')} ze zduplikowanymi tytułami. Google traktuje to jako auto-kanibalizację fraz i sygnał niskiej jakości.`}
              status="warn"
              percentage={Math.max(20, 100 - evidence.duplicateTitleGroups.length * 20)}
              metaText={pluralizePolish(evidence.duplicateTitleGroups.length, 'grupa', 'grupy', 'grup')}
              detailsLabel="Grupy ze zduplikowanymi tytułami:"
              details={evidence.duplicateTitleGroups.map(g => ({
                label: `« ${g.title} » (${g.count} stron)`,
                sublabel: g.urls.join(', ')
              }))}
            />
          )}

          <AuditEvidenceCard
            title="Nagłówki H1"
            description={`${(evidence?.totalPages || 0) - (evidence?.missingH1Count || 0)}/${evidence?.totalPages} stron posiada nagłówek H1. ${pluralizePolish(evidence?.missingH1Count || 0, 'podstrona nie posiada', 'podstrony nie posiadają', 'podstron nie posiada')} głównego nagłówka semantycznego.`}
            status={(evidence?.missingH1Count || 0) === 0 ? 'ok' : 'bad'}
            percentage={(((evidence?.totalPages || 0) - (evidence?.missingH1Count || 0)) / (evidence?.totalPages || 1)) * 100}
            metaText={`${(evidence?.totalPages || 0) - (evidence?.missingH1Count || 0)}/${evidence?.totalPages}`}
            detailsLabel="Strony bez nagłówka H1:"
            details={evidence?.missingH1Urls.map(u => ({ url: u })) || []}
          />

          <AuditEvidenceCard
            title="Tag canonical (linki kanoniczne)"
            description={`${(evidence?.totalPages || 0) - (evidence?.missingCanonicalCount || 0)}/${evidence?.totalPages} stron posiada poprawny tag canonical zapobiegający duplikatom w indeksie.`}
            status={(evidence?.missingCanonicalCount || 0) === 0 ? 'ok' : 'bad'}
            percentage={(((evidence?.totalPages || 0) - (evidence?.missingCanonicalCount || 0)) / (evidence?.totalPages || 1)) * 100}
            metaText={`${(evidence?.totalPages || 0) - (evidence?.missingCanonicalCount || 0)}/${evidence?.totalPages}`}
            detailsLabel="Strony bez tagu canonical:"
            details={evidence?.missingCanonicalUrls.map(u => ({ url: u })) || []}
          />

          <AuditEvidenceCard
            title="Objętość treści (Thin Content <200 słów)"
            description={`${(evidence?.totalPages || 0) - (evidence?.thinContentCount || 0)}/${evidence?.totalPages} stron posiada wystarczającą ilość treści. ${pluralizePolish(evidence?.thinContentCount || 0, 'podstrona ma', 'podstrony mają', 'podstron ma')} bardzo krótki tekst.`}
            status={(evidence?.thinContentCount || 0) === 0 ? 'ok' : 'warn'}
            percentage={(((evidence?.totalPages || 0) - (evidence?.thinContentCount || 0)) / (evidence?.totalPages || 1)) * 100}
            metaText={`${(evidence?.totalPages || 0) - (evidence?.thinContentCount || 0)}/${evidence?.totalPages}`}
            detailsLabel="Strony z thin content (<200 słów):"
            details={evidence?.thinContentUrls.map(t => ({ url: t.url, sublabel: `${t.wordCount} słów` })) || []}
          />
        </div>
      </div>

      {/* Sekcja 2: Produkty (jeśli wykryto w sklepie) */}
      {hasProducts && evidence?.categoriesSummary?.products && (
        <div className="bg-white/70 border border-slate-200/70 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Karty produktowe & E-commerce SEO
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Przeanalizowano {evidence.categoriesSummary.products.count} kart produktowych pod kątem H1 i Schema Product
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <AuditEvidenceCard
              title="Nagłówki H1 na kartach produktów"
              description={evidence.categoriesSummary.products.missingH1 === 0
                ? 'Wszystkie zbadane produkty posiadają główny nagłówek H1 z nazwą produktu.'
                : `${evidence.categoriesSummary.products.missingH1} produktów nie ma nagłówka H1.`}
              status={evidence.categoriesSummary.products.missingH1 === 0 ? 'ok' : 'bad'}
              percentage={((evidence.categoriesSummary.products.count - evidence.categoriesSummary.products.missingH1) / evidence.categoriesSummary.products.count) * 100}
              metaText={`${evidence.categoriesSummary.products.count - evidence.categoriesSummary.products.missingH1}/${evidence.categoriesSummary.products.count}`}
            />

            <AuditEvidenceCard
              title="Dane strukturalne Schema Product"
              description={evidence.categoriesSummary.products.missingSchema === 0
                ? 'Wszystkie produkty posiadają mikrodane JSON-LD Product (ceny, dostępność, oceny w Google).'
                : `${evidence.categoriesSummary.products.missingSchema} produktów nie ma znaczników Schema Product.`}
              status={evidence.categoriesSummary.products.missingSchema === 0 ? 'ok' : 'info'}
              percentage={((evidence.categoriesSummary.products.count - evidence.categoriesSummary.products.missingSchema) / evidence.categoriesSummary.products.count) * 100}
              metaText={`${evidence.categoriesSummary.products.count - evidence.categoriesSummary.products.missingSchema}/${evidence.categoriesSummary.products.count}`}
            />
          </div>
        </div>
      )}

      {/* Sekcja 3: Blog (jeśli wykryto artykuły) */}
      {hasBlog && evidence?.categoriesSummary?.blog && (
        <div className="bg-white/70 border border-slate-200/70 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Sekcja merytoryczna & Treści pod AI (SearchGPT / Gemini)
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Przeanalizowano {evidence.categoriesSummary.blog.count} wpisów blogowych (średnio {evidence.categoriesSummary.blog.avgWordCount || 0} słów/wpis)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <AuditEvidenceCard
              title="Nagłówki H1 we wpisach blogowych"
              description={evidence.categoriesSummary.blog.missingH1 === 0
                ? 'Wszystkie artykuły posiadają poprawny nagłówek H1 z tytułem artykułu.'
                : `${evidence.categoriesSummary.blog.missingH1} wpisów blogowych nie ma tagu H1.`}
              status={evidence.categoriesSummary.blog.missingH1 === 0 ? 'ok' : 'bad'}
              percentage={((evidence.categoriesSummary.blog.count - evidence.categoriesSummary.blog.missingH1) / evidence.categoriesSummary.blog.count) * 100}
              metaText={`${evidence.categoriesSummary.blog.count - evidence.categoriesSummary.blog.missingH1}/${evidence.categoriesSummary.blog.count}`}
            />

            <AuditEvidenceCard
              title="Dane strukturalne Schema Article"
              description={evidence.categoriesSummary.blog.missingSchema === 0
                ? 'Wszystkie wpisy blogowe posiadają mikrodane Article (zrozumiałe dla wyszukiwarek AI i Google).'
                : `${evidence.categoriesSummary.blog.missingSchema} wpisów nie ma mikrodanych Schema Article.`}
              status={evidence.categoriesSummary.blog.missingSchema === 0 ? 'ok' : 'info'}
              percentage={((evidence.categoriesSummary.blog.count - evidence.categoriesSummary.blog.missingSchema) / evidence.categoriesSummary.blog.count) * 100}
              metaText={`${evidence.categoriesSummary.blog.count - evidence.categoriesSummary.blog.missingSchema}/${evidence.categoriesSummary.blog.count}`}
            />
          </div>
        </div>
      )}

      {/* Sekcja: Kompleksowy Rejestr Punktów Kontrolnych & Rekomendacje Inżynieryjne */}
      <AuditChecklistSection
        evaluations={result.checkpointEvals}
        stats={result.checkpointStats}
        domain={result.domain}
        siteType={result.siteType}
      />

      {/* Sekcja: Interaktywna Tabela Wszystkich Podstron */}
      {pages.length > 0 && <PagesTable pages={pages} />}

      {/* Sekcja 5: Formularz Konsultacji & Lead Capture */}
      <div id="konsultacja" className="print:hidden scroll-mt-28">
        <AuditConsultationForm
          domain={result.domain}
          token={result.token}
          siteType={result.siteType}
          overallScore={result.overallScore}
        />
      </div>

      {/* Stopka raportu PDF do druku */}
      <div className="hidden print:block pt-6 mt-8 border-t-2 border-slate-900 text-xs text-slate-600">
        <div className="flex justify-between items-center">
          <div>
            <strong className="text-slate-900 font-bold">Molenda Development</strong> · Niezależny Audyt Inżynieryjny Witryny
          </div>
          <div className="font-mono text-[11px] text-slate-800">
            molendadevelopment.pl · tel. +48 789 746 950 · marcin@molendadevelopment.pl
          </div>
        </div>
      </div>
    </motion.div>
  );
}
