'use client';

import React, { useState } from 'react';
import {
  Share2,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Sparkles,
  Code2
} from 'lucide-react';
import { OpenGraphData } from '@/app/api/audit-master/types';

interface SocialSharePreviewCardProps {
  openGraph?: OpenGraphData;
  detectedSchemas?: string[];
  domain: string;
}

export default function SocialSharePreviewCard({
  openGraph,
  detectedSchemas = [],
  domain
}: SocialSharePreviewCardProps) {
  const [platform, setPlatform] = useState<'facebook' | 'linkedin'>('facebook');
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(openGraph?.ogImage && openGraph.ogImage.trim().length > 0 && !imageError);
  const title = openGraph?.ogTitle || `${domain} - Oferta i Usługi`;
  const description = openGraph?.ogDescription || 'Brak meta opisu og:description. Po wklejeniu linku platforma wyświetli przypadkowy tekst z nagłówka strony.';
  const displayUrl = domain.toUpperCase();

  const uniqueSchemas = Array.from(new Set(detectedSchemas)).filter(Boolean);
  const hasSchemas = uniqueSchemas.length > 0;

  return (
    <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-6 md:p-10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
      {/* Nagłówek sekcji */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
              Social Media & Google Rich Snippets
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Wizualny Podgląd Udostępniania & Schema.org
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Sprawdź, jak Twoja strona prezentuje się po wklejeniu linku w social media (Facebook, LinkedIn, Messenger) oraz czy posiada mikrodane kwalifikujące ją do rozszerzonych wyników w Google.
          </p>
        </div>

        {/* Globalny status OG */}
        <div className="shrink-0">
          {hasImage ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>MINIATURA SOCIAL MEDIA AKTYWNA</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-mono text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>BRAK GRAFIKI OG:IMAGE</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolumna lewa: Makieta Social Share (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Przełącznik platformy */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Podgląd w kanale społecznościowym:</span>
            </div>
            <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setPlatform('facebook')}
                className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  platform === 'facebook'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Facebook / Messenger
              </button>
              <button
                type="button"
                onClick={() => setPlatform('linkedin')}
                className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  platform === 'linkedin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                LinkedIn
              </button>
            </div>
          </div>

          {/* Makieta Posta */}
          <div className="rounded-2xl border border-slate-300/80 bg-slate-50/70 p-4 shadow-sm">
            {/* Nagłówek posta */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-600 text-xs font-mono">
                {domain.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{domain}</span>
                  <span className="text-[10px] font-normal text-slate-400">· Udostępniono link</span>
                </div>
                <div className="text-[11px] text-slate-500">Przed chwilą · 🌐 Publiczne</div>
              </div>
            </div>

            {/* Karta linku */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300">
              {/* Sekcja Obrazka OG */}
              {hasImage ? (
                <div className="relative aspect-[1200/630] w-full bg-slate-100 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={openGraph?.ogImage}
                    alt={title}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono font-semibold px-2 py-0.5 rounded backdrop-blur-md">
                    og:image
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[1200/500] w-full bg-gradient-to-br from-slate-100 to-slate-200/70 flex flex-col items-center justify-center p-6 text-center border-b border-slate-200">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-2.5 text-slate-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Brak dedykowanej grafiki og:image</span>
                  <p className="text-[11px] text-slate-500 max-w-sm mt-1 leading-snug">
                    Social media wyświetlą pusty szary prostokąt lub przypadkowe małe logo z treści strony, co drastycznie obniża profesjonalizm marki.
                  </p>
                </div>
              )}

              {/* Treść tekstowa karty */}
              <div className="p-3.5 bg-slate-50/50">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  {displayUrl}
                </div>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug hover:text-indigo-600 transition-colors">
                  {title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* Notatka inżynieryjna o konwersji */}
          <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/80 text-slate-700 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-slate-900 font-semibold">Dlaczego to kluczowe dla sprzedaży:</strong> Linki z dedykowaną, estetyczną grafiką podglądu (1200x630 px) notują o <strong>150-200% wyższy współczynnik klikalności (CTR)</strong> w komunikatorach (Messenger, WhatsApp) oraz na portalach biznesowych (LinkedIn, Facebook).
            </div>
          </div>
        </div>

        {/* Kolumna prawa: Dane strukturalne Schema.org (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-900">Dane strukturalne Schema.org (JSON-LD)</span>
          </div>

          {hasSchemas ? (
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Wykryto aktywne schematy ({uniqueSchemas.length}):</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {uniqueSchemas.map((schema, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-mono text-[11px] font-semibold shadow-xs"
                  >
                    <Code2 className="w-3 h-3 text-emerald-600" />
                    <span>{schema}</span>
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-emerald-800 mt-3 leading-relaxed">
                Strona posiada zwalidowane mikrodane ułatwiające robotom Google i modelom AI (SearchGPT, Gemini) zrozumienie oferty firmy.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center gap-2 text-amber-900 text-xs font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Brak danych strukturalnych Schema.org</span>
              </div>
              <p className="text-xs text-amber-900 mt-2 leading-relaxed">
                W kodzie witryny nie wykryto znaczników JSON-LD (takich jak Organization, LocalBusiness, FAQPage czy Product).
              </p>
              <div className="mt-3 p-3 bg-white/80 rounded-xl border border-amber-200 text-[11px] text-slate-700 leading-snug">
                <strong className="text-slate-900 font-semibold block mb-1">Wpływ na pozycje i konwersję:</strong>
                Brak znaczników odbiera Twojej stronie gwiazdki ocen, rozszerzone wyniki (Rich Snippets) i sekcje pytań w Google, co <strong>obniża współczynnik klikalności (CTR) o 20-30%</strong>.
              </div>
            </div>
          )}

          {/* Parametry techniczne tagów Open Graph */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
            <span className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Audyt techniczny meta-tagów
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="font-mono text-slate-600 text-[11px]">og:image</span>
                <span className={`font-semibold font-mono text-[11px] ${hasImage ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {hasImage ? 'Zdefiniowany' : 'Brak w kodzie'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="font-mono text-slate-600 text-[11px]">og:title</span>
                <span className={`font-semibold font-mono text-[11px] ${openGraph?.ogTitle ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {openGraph?.ogTitle ? 'Wykryto' : 'Domyślny <title>'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="font-mono text-slate-600 text-[11px]">og:description</span>
                <span className={`font-semibold font-mono text-[11px] ${openGraph?.ogDescription ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {openGraph?.ogDescription ? 'Wykryto' : 'Domyślny opis'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-mono text-slate-600 text-[11px]">Zalecany format grafiki</span>
                <span className="font-semibold font-mono text-[11px] text-slate-800">
                  1200 × 630 px (1.91:1)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
