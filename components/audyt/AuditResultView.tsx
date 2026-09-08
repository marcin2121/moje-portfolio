'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Search, Server, Settings, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AuditMasterResponse } from '@/app/api/audit-master/types';
import AuditEvidenceCard from './AuditEvidenceCard';
import PagesTable from './PagesTable';
import AuditConsultationForm from './AuditConsultationForm';
import QuickCriticalIssues from './QuickCriticalIssues';
import AdsAndTrackingCard from './AdsAndTrackingCard';
import AuditChecklistSection from './AuditChecklistSection';
import { pluralizePolish } from '@/app/api/audit-master/utils/crawler';

export type { AuditMasterResponse as AuditResult };

interface AuditResultViewProps {
  result: AuditMasterResponse;
  onRetry: () => void;
}

export default function AuditResultView({ result }: AuditResultViewProps) {
  const [copied, setCopied] = useState(false);

  const isEcommerce = result.siteType === 'ecommerce';
  const conversionLabel = isEcommerce ? 'straty sprzedaży' : 'utraconych zapytań';

  const copyShareLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://molendadevelopment.pl';
    const link = `${origin}/narzedzia/audyt?token=${result.token}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700';
    if (score >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const evidence = result.evidence;
  const pages = result.pages || [];
  const hasProducts = evidence?.categoriesSummary?.products && evidence.categoriesSummary.products.count > 0;
  const hasBlog = evidence?.categoriesSummary?.blog && evidence.categoriesSummary.blog.count > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-12"
    >
      {/* Pasek Nagłówka Audytu + Kopiowanie Linku */}
      <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
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
            Przeanalizowano {evidence?.totalPages || 1} podstron · Wygenerowano: {new Date(result.createdAt).toLocaleDateString('pl-PL')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copyShareLink}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm active:scale-95"
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
        </div>
      </div>

      {/* Hero Bento: Wynik Główny + Werdykt Architekta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Karta Wyniku */}
        <div className="lg:col-span-1 bg-white/70 border border-slate-200/70 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-8 flex flex-col justify-center items-center text-center">
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-3">Wynik Główny</p>
          <div className={`text-7xl font-black mb-2 ${getScoreColor(result.overallScore)} tracking-tight font-sans`}>
            {result.overallScore}<span className="text-2xl text-slate-400 font-normal">/100</span>
          </div>

          <div className="mt-4 p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl w-full text-center">
            <span className="text-xs font-mono text-rose-700 font-bold block">
              Szacowana utrata {conversionLabel}:
            </span>
            <span className="text-xl font-black text-rose-600 font-mono">
              ~{result.lossPercentage}%
            </span>
          </div>

          <p className="text-slate-500 text-[11px] font-mono mt-4">
            Średnia ważona z analizy kodu, Core Web Vitals, indeksacji i bezpieczeństwa.
          </p>
        </div>

        {/* Karta Werdyktu AI */}
        <div className="lg:col-span-2 bg-white/80 border border-slate-200/70 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 uppercase tracking-widest mb-3">
              <Shield className="w-4 h-4" />
              <span>Diagnoza Architekta (Synteza Inżynieryjna)</span>
            </div>
            <div className="prose max-w-none text-slate-700 leading-relaxed text-sm md:text-base prose-p:mb-3 prose-strong:text-slate-900 prose-ul:my-2 prose-li:my-0.5">
              <ReactMarkdown>{result.aiReport}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* SEKCJA 1: Szybka Diagnoza Krytyczna (Top 3-4 wycieki zysku i budżetu z możliwością rozwinięcia) */}
      {result.quickIssues && result.quickIssues.length > 0 && (
        <QuickCriticalIssues issues={result.quickIssues} />
      )}

      {/* SEKCJA 2: Audyt Kampanii Płatnych & Telemetryki (Google & Meta Ads, Consent Mode v2, add_to_cart) */}
      {evidence?.adsAndTracking && (
        <AdsAndTrackingCard tracking={evidence.adsAndTracking} domain={result.domain} siteType={result.siteType} />
      )}

      {/* SEKCJA 3: Kompleksowy Rejestr 80 Punktów Kontrolnych & Korzyści Biznesowe (ROI) */}
      <AuditChecklistSection
        evaluations={result.checkpointEvals}
        stats={result.checkpointStats}
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
            status={evidence?.errorsCount === 0 ? 'ok' : 'bad'}
            percentage={((evidence?.status200Count || 0) / (evidence?.totalPages || 1)) * 100}
            metaText={`${evidence?.status200Count}/${evidence?.totalPages}`}
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

      {/* Sekcja 4: Interaktywna Tabela Wszystkich Podstron */}
      {pages.length > 0 && <PagesTable pages={pages} />}

      {/* Sekcja 5: Formularz Konsultacji & Lead Capture */}
      <AuditConsultationForm domain={result.domain} token={result.token} siteType={result.siteType} />
    </motion.div>
  );
}
