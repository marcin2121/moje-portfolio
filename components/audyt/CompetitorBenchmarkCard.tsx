'use client';

import React from 'react';
import {
  Swords,
  Trophy,
  AlertTriangle,
  Check,
  X,
  Minus,
  ExternalLink,
  Zap,
  Shield,
  CreditCard,
  Code2,
  FileCode2,
  Activity
} from 'lucide-react';
import { CompetitorBenchmark } from '@/app/api/audit-master/types';

interface CompetitorBenchmarkCardProps {
  benchmark: CompetitorBenchmark;
  yourDomain: string;
}

export default function CompetitorBenchmarkCard({ benchmark, yourDomain }: CompetitorBenchmarkCardProps) {
  const isWinner = benchmark.winner === 'you';
  const isLoser = benchmark.winner === 'competitor';

  return (
    <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
      {/* Nagłówek Sekcji */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
              <Swords className="w-4 h-4" />
              Head-to-Head Benchmark
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Pojedynek Technologiczny: {yourDomain} vs {benchmark.competitorDomain}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Porównanie szybkości ładowania, dojrzałości platformy, konfiguracji śledzenia konwersji i bezpieczeństwa z bezpośrednim rywalem rynkowym.
          </p>
        </div>

        {/* Podsumowanie wyniku pojedynku */}
        <div className="shrink-0">
          {benchmark.isUnavailable ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-mono text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>RYWAL NIEDOSTĘPNY</span>
            </div>
          ) : isWinner ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold">
              <Trophy className="w-4 h-4 text-emerald-600" />
              <span>PROWADZISZ +{benchmark.scoreDiff} PKT</span>
            </div>
          ) : isLoser ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-mono text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>STRATA {benchmark.scoreDiff} PKT</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs font-bold">
              <Minus className="w-4 h-4 text-slate-500" />
              <span>REMIS TECHNICZNY</span>
            </div>
          )}
        </div>
      </div>

      {/* Tryb Awaryjny (Gdy rywal ma WAF / Cloudflare / 403 / Timeout) */}
      {benchmark.isUnavailable ? (
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-300/60">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-bold text-slate-900">
                Serwer konkurenta ({benchmark.competitorDomain}) jest niedostępny lub blokuje automatyczne zapytania
              </h4>
              <p className="text-xs text-slate-600 font-mono leading-relaxed">
                {benchmark.unavailableReason || 'Przekroczono limit czasu odpowiedzi (>4.5s) lub aktywowano blokadę WAF/Cloudflare.'}
              </p>
              <div className="pt-2 border-t border-amber-200/60 mt-3">
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900 font-semibold">Wniosek rynkowy: </strong>
                  {benchmark.strategicAdvice}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Główny Asymetryczny Bento Grid */
        <div className="space-y-8">
          {/* Asymetryczna karta werdyktu + Porównanie punktowe */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Karta Porównania Punktowego (span-4) */}
            <div className="lg:col-span-4 bg-slate-50/70 border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-4 font-bold">
                  Wynik Całościowy (Score)
                </span>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Twoja domena</span>
                    <span className="text-3xl font-black text-slate-900 font-sans">{benchmark.yourScore}</span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1 truncate" title={benchmark.competitorDomain}>
                      {benchmark.competitorDomain}
                    </span>
                    <span className="text-3xl font-black text-slate-900 font-sans">{benchmark.competitorScore}</span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Różnica:</span>
                  <span className={`font-bold ${isWinner ? 'text-emerald-700' : isLoser ? 'text-rose-700' : 'text-slate-700'}`}>
                    {benchmark.scoreDiff > 0 ? `+${benchmark.scoreDiff}` : benchmark.scoreDiff} pkt
                  </span>
                </div>
              </div>
            </div>

            {/* Karta Diagnozy Rynkowej & Przewagi (span-8) */}
            <div className="lg:col-span-8 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-400" />
                  <span className="text-[11px] font-mono text-orange-300 font-bold uppercase tracking-wider">
                    Werdykt Inżynieryjny & Strategiczny
                  </span>
                </div>
                <h4 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  {benchmark.verdict}
                </h4>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                  {benchmark.strategicAdvice}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
                <span>Konkurent: {benchmark.competitorDomain}</span>
                <a
                  href={benchmark.competitorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Otwórz stronę rywala</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Szczegółowa Tabela Wskaźników Head-to-Head */}
          {benchmark.metrics && (
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200/80 grid grid-cols-12 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-4 md:col-span-5">Obszar Technologiczny</div>
                <div className="col-span-3 md:col-span-3 text-center">Twoja Strona</div>
                <div className="col-span-3 md:col-span-3 text-center">Konkurent</div>
                <div className="col-span-2 md:col-span-1 text-right">Wynik</div>
              </div>

              <div className="divide-y divide-slate-100 text-xs font-mono">
                {/* 1. Czas Odpowiedzi TTFB */}
                <div className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50/50 transition-colors">
                  <div className="col-span-4 md:col-span-5 flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block font-sans">Czas Odpowiedzi (TTFB)</span>
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:block">Czas do pierwszego bajta serwera</span>
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-3 text-center font-bold text-slate-800">
                    {benchmark.metrics.ttfb.yourValue} ms
                  </div>
                  <div className="col-span-3 md:col-span-3 text-center text-slate-600">
                    {benchmark.metrics.ttfb.competitorValue} ms
                  </div>
                  <div className="col-span-2 md:col-span-1 text-right">
                    <WinnerBadge winner={benchmark.metrics.ttfb.winner} />
                  </div>
                </div>

                {/* 2. Platforma / Architektura */}
                <div className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50/50 transition-colors">
                  <div className="col-span-4 md:col-span-5 flex items-center gap-2.5">
                    <Code2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block font-sans">Platforma & Silnik</span>
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:block">CMS, framework, SaaS</span>
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-3 text-center font-bold text-slate-800 text-[11px] truncate px-1" title={benchmark.metrics.platform.yourPlatform}>
                    {benchmark.metrics.platform.yourPlatform}
                  </div>
                  <div className="col-span-3 md:col-span-3 text-center text-slate-600 text-[11px] truncate px-1" title={benchmark.metrics.platform.competitorPlatform}>
                    {benchmark.metrics.platform.competitorPlatform}
                  </div>
                  <div className="col-span-2 md:col-span-1 text-right">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">—</span>
                  </div>
                </div>

                {/* 3. Zdarzenie add_to_cart (Smart Bidding) */}
                <div className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50/50 transition-colors">
                  <div className="col-span-4 md:col-span-5 flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block font-sans">Śledzenie add_to_cart</span>
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:block">Kluczowe dla algorytmów Google/Meta Ads</span>
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-3 text-center">
                    <StatusIndicator active={benchmark.metrics.addToCartTracking.yourStatus} />
                  </div>
                  <div className="col-span-3 md:col-span-3 text-center">
                    <StatusIndicator active={benchmark.metrics.addToCartTracking.competitorStatus} />
                  </div>
                  <div className="col-span-2 md:col-span-1 text-right">
                    <WinnerBadge winner={benchmark.metrics.addToCartTracking.winner} />
                  </div>
                </div>

                {/* 4. Google Consent Mode v2 */}
                <div className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50/50 transition-colors">
                  <div className="col-span-4 md:col-span-5 flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block font-sans">Consent Mode v2</span>
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:block">Legalne zbieranie danych i modelowanie AI</span>
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-3 text-center">
                    <StatusIndicator active={benchmark.metrics.consentModeV2.yourStatus} />
                  </div>
                  <div className="col-span-3 md:col-span-3 text-center">
                    <StatusIndicator active={benchmark.metrics.consentModeV2.competitorStatus} />
                  </div>
                  <div className="col-span-2 md:col-span-1 text-right">
                    <WinnerBadge winner={benchmark.metrics.consentModeV2.winner} />
                  </div>
                </div>

                {/* 5. Szybkie Płatności (BLIK / Apple Pay) */}
                <div className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50/50 transition-colors">
                  <div className="col-span-4 md:col-span-5 flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block font-sans">Szybki Checkout (BLIK / Pay)</span>
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:block">Wygoda zakupowa na urządzeniach mobilnych</span>
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-3 text-center">
                    <StatusIndicator active={benchmark.metrics.expressPayments.yourStatus} />
                  </div>
                  <div className="col-span-3 md:col-span-3 text-center">
                    <StatusIndicator active={benchmark.metrics.expressPayments.competitorStatus} />
                  </div>
                  <div className="col-span-2 md:col-span-1 text-right">
                    <WinnerBadge winner={benchmark.metrics.expressPayments.winner} />
                  </div>
                </div>

                {/* 6. Dane Strukturalne (Schema.org) */}
                <div className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50/50 transition-colors">
                  <div className="col-span-4 md:col-span-5 flex items-center gap-2.5">
                    <FileCode2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block font-sans">Schema.org (Rich Snippets)</span>
                      <span className="text-[10px] text-slate-500 font-mono hidden sm:block">Ceny, dostępność i gwiazdki w Google</span>
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-3 text-center">
                    <StatusIndicator active={benchmark.metrics.productSchema.yourStatus} />
                  </div>
                  <div className="col-span-3 md:col-span-3 text-center">
                    <StatusIndicator active={benchmark.metrics.productSchema.competitorStatus} />
                  </div>
                  <div className="col-span-2 md:col-span-1 text-right">
                    <WinnerBadge winner={benchmark.metrics.productSchema.winner} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusIndicator({ active }: { active: boolean }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
        <Check className="w-3 h-3" />
        Aktywne
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
      <X className="w-3 h-3" />
      Brak
    </span>
  );
}

function WinnerBadge({ winner }: { winner: 'you' | 'competitor' | 'tie' }) {
  if (winner === 'you') {
    return (
      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300">
        Ty +1
      </span>
    );
  }
  if (winner === 'competitor') {
    return (
      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-rose-800 bg-rose-100/70 border border-rose-300">
        Rywal +1
      </span>
    );
  }
  return (
    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200">
      Remis
    </span>
  );
}
