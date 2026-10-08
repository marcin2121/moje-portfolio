'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Globe } from 'lucide-react';
import { pushGTMEvent } from '@/app/page';
import { fixOrphans } from '@/utils/typography';

interface HeroProps {
  onNavigate: (index: number) => void;
  onOpenQuoteModal?: () => void;
}

export default function Hero({ onNavigate, onOpenQuoteModal }: HeroProps) {
  const router = useRouter();
  const [isSpeedTooltipOpen, setIsSpeedTooltipOpen] = useState(false);
  const [auditUrl, setAuditUrl] = useState('');

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = auditUrl.trim();
    pushGTMEvent('hero_omnibox_audyt_click', { url: clean || 'nie_podano' });
    if (clean) {
      const formatted = clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`;
      router.push(`/narzedzia/audyt?url=${encodeURIComponent(formatted)}`);
    } else {
      router.push('/narzedzia/audyt');
    }
  };
  return (
    <section id="hero" className="w-full lg:w-1/4 h-auto lg:h-full flex flex-col justify-between pt-12 pb-1 lg:pt-12 xl:pt-18 2xl:pt-24 lg:pb-1 xl:pb-3 relative shrink-0 font-sans overflow-hidden">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 pt-1 sm:pt-2 lg:pt-0 xl:pt-2 gap-4 lg:gap-4 xl:gap-10 relative z-10 flex-1">
        
        {/* Left Column Text */}
        <div className="w-full lg:w-1/2 text-left relative z-20">
          <div className="absolute -top-10 -left-6 sm:-top-16 sm:-left-10 text-[18vw] sm:text-[14vw] lg:text-[8vw] font-black text-slate-900/[0.03] leading-none pointer-events-none select-none tracking-tighter">
            WZROST
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-lg xl:text-2xl 2xl:text-4xl font-black text-slate-900 tracking-tight leading-[1.15] mb-1.5 sm:mb-2 xl:mb-3">
            Wymień powolny szablon na stronę Next.js ze średnim czasem ładowania{' '}
            <span 
              className="relative inline-block"
              onMouseEnter={() => setIsSpeedTooltipOpen(true)}
              onMouseLeave={() => setIsSpeedTooltipOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsSpeedTooltipOpen((prev) => !prev)}
                className="text-orange-500 underline decoration-dotted decoration-orange-400/80 underline-offset-4 hover:decoration-orange-600 transition-colors cursor-help inline-flex items-center gap-0.5 focus:outline-none"
                aria-label="Wyjaśnienie inżynieryjne średniego czasu ładowania 0.8s"
              >
                <span>~0.8 s*</span>
              </button>

              <AnimatePresence>
                {isSpeedTooltipOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    style={{ letterSpacing: 'normal', wordSpacing: 'normal' }}
                    className="absolute left-0 sm:left-0 top-full mt-2.5 z-50 w-72 sm:w-84 p-4 bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.18)] text-left font-sans font-normal normal-case tracking-normal leading-normal text-slate-700 pointer-events-none sm:pointer-events-auto"
                  >
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-slate-100 font-sans tracking-normal">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-600">
                        Inżynieryjny Benchmark
                      </span>
                      <span className="text-[10px] font-sans font-medium text-slate-400">
                        Google Chromium CDP
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-600 font-sans font-normal leading-relaxed tracking-normal">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-sans">Pierwszy render (FCP):</span>
                        <span className="font-mono font-bold text-slate-900">0.4 s - 0.6 s</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-sans">Czas odpowiedzi (TTFB):</span>
                        <span className="font-mono font-bold text-slate-900">30 ms - 50 ms</span>
                      </div>
                      <div className="pt-2 text-[11px] text-slate-500 leading-snug border-t border-slate-100 font-sans">
                        Pomiary na realnych wdrożeniach produkcyjnych (m.in. molendadevelopment.pl, kajaki-u-macka.pl). Kod zawsze projektowany pod kątem stałej zielonej strefy Google Core Web Vitals.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </span>
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm lg:text-[11px] xl:text-xs 2xl:text-base font-normal max-w-xl leading-relaxed mb-2 sm:mb-2 xl:mb-3">
            {fixOrphans(`Projektuję bezawaryjne serwisy i sklepy internetowe dla firm, które nie chcą tracić klientów z reklam przez wolny kod. Płacisz raz, 0% prowizji, pełna automatyzacja procesów.`)}
          </p>

          <div className="flex flex-col gap-1 lg:gap-0.5 xl:gap-1.5 mb-2.5 sm:mb-3 xl:mb-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-[10.5px] xl:text-xs 2xl:text-sm text-slate-700 font-medium">
              <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <Check size={11} className="text-emerald-600" />
              </div>
              <span>Gwarancja zwrotu 100% zaliczki przez 7 dni.</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-[10.5px] xl:text-xs 2xl:text-sm text-slate-700 font-medium">
              <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <Check size={11} className="text-emerald-600" />
              </div>
              <span>Konkretna wycena na e-mail w 24 godziny.</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2.5 w-full">
            <button
              onClick={() => {
                pushGTMEvent('strona_glowna_wycena_klikniecie');
                if (onOpenQuoteModal) {
                  onOpenQuoteModal();
                } else {
                  onNavigate(15);
                }
              }}
              className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 xl:px-8 xl:py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-[0_10px_30px_rgba(234,88,12,0.35)] hover:shadow-[0_15px_40px_rgba(234,88,12,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer group whitespace-nowrap"
            >
              Wyceń projekt w 60 sekund
              <ArrowRight size={16} className="shrink-0 xl:w-5 xl:h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>

            {/* Interactive Omnibox: Quick 5s Audit */}
            <div className="w-full max-w-lg">
              <form onSubmit={handleAuditSubmit} className="flex items-center gap-2 p-1 sm:p-1.5 bg-white/90 hover:bg-white focus-within:bg-white border border-slate-200/90 focus-within:border-orange-500/60 rounded-2xl shadow-inner transition-all">
                <div className="pl-2 text-slate-400 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <input 
                  type="text"
                  placeholder="Wklej adres strony (np. twojadomena.pl)"
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-mono py-1 min-w-0"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95 shrink-0"
                >
                  Audytuj w 5 s →
                </button>
              </form>
              <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-mono text-slate-500">
                <span>Darmowy test 64 parametrów: Core Web Vitals, SEO i konwersja</span>
                <Link href="/narzedzia/audyt" className="text-orange-600 hover:text-orange-500 font-bold hidden sm:inline">
                  Pełne narzędzie →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Portrait (1:1 Square) */}
        <div className="hidden lg:flex w-full lg:w-1/2 justify-center lg:justify-end relative mt-1 lg:mt-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          {/* Light Premium Card Framing (1:1 Aspect Ratio) */}
          <div className="relative w-full max-w-[170px] lg:max-w-[170px] xl:max-w-[230px] 2xl:max-w-[340px] rounded-[1.3rem] xl:rounded-[2rem] bg-white p-2 xl:p-2.5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-200/60 hover:rotate-1 hover:scale-[1.02] transition-all duration-500 group flex flex-col">
            <div className="w-full aspect-square rounded-[1rem] xl:rounded-[1.5rem] overflow-hidden relative">
              <Image
                src="/Marcin_Molenda_Development.webp"
                alt="Marcin Molenda - Niezależny Inżynier Oprogramowania Next.js"
                fill
                priority
                quality={90}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 1px, 40vw"
              />
            </div>
            
            {/* Elegant Typographic Status */}
            <div className="w-full pt-1.5 pb-0.5 px-1 sm:px-1.5 xl:px-2 flex items-center justify-between gap-1">
              <span className="text-[7px] sm:text-[7.5px] xl:text-[8.5px] 2xl:text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Marcin Molenda</span>
              <span className="text-[7px] sm:text-[7.5px] xl:text-[8.5px] 2xl:text-[10px] font-black text-slate-900 uppercase tracking-wider whitespace-nowrap">Inżynier Oprogramowania</span>
            </div>
          </div>
        </div>

      </div>

      {/* Trust Bar */}
      <div className="hidden lg:block w-full relative z-20 mt-auto mb-14 lg:mb-14 xl:mb-18 2xl:mb-20 px-4 sm:px-10 lg:px-16">
        <div className="max-w-[960px] mx-auto bg-white/80 backdrop-blur-2xl border border-slate-200/60 rounded-2xl xl:rounded-[1.8rem] py-1.5 xl:py-2 px-3 sm:px-5 flex flex-col items-center justify-center gap-1.5 shadow-premium">
          <span className="text-slate-500 text-[9.5px] xl:text-[10.5px] font-medium uppercase tracking-[0.18em] text-center">
            Zaufały mi firmy, które cenią swój czas i twarde wyniki inżynieryjne:
          </span>
          <div className="flex flex-row items-center justify-center gap-2 xl:gap-3.5 w-full flex-wrap">
            {[
              { name: 'Stowarzyszenie KAS', shortName: 'KAS', metric: '4×100 PageSpeed', desc: 'portal pożytku publicznego (WCAG 2.2 AA)', link: 'https://stowarzyszeniekas.pl', img: '/kas.svg', hoverBorder: 'hover:border-emerald-500/40', imgClass: 'object-contain' },
              { name: 'DzikiStyl', shortName: 'DzikiStyl', metric: '23MB lżejszy', desc: 'studio graficzne i drukarnia online', link: 'https://dzikistyl.vercel.app/', img: '/dzikistyl-logo.png', hoverBorder: 'hover:border-orange-500/40', imgClass: 'object-cover' },
              { name: 'Sklep Urwis', shortName: 'Sklep Urwis', metric: '100% Uptime w szczycie', desc: 'sklep z zabawkami w Białobrzegach', link: 'https://sklep-urwis.pl', img: '/sklepurwis-logo.png', hoverBorder: 'hover:border-orange-500/40', imgClass: 'object-cover' },
              { name: 'RLT Polska', shortName: 'RLT Polska', metric: '0 błędów 508', desc: 'sklep internetowy z urządzeniami do terapii światłem', link: 'https://rltpolska.pl', img: '/rltpolska-logo.png', hoverBorder: 'hover:border-orange-500/40', imgClass: 'object-contain' },
              { name: 'Kajaki u Maćka', shortName: 'Kajaki', metric: 'FCP 0.4s na telefonach', desc: 'spływy kajakowe Pilicą', link: 'https://kajaki-u-macka.pl', img: '/kajaki-u-macka-logo.png', hoverBorder: 'hover:border-emerald-500/40', imgClass: 'object-cover scale-100' },
            ].map((client, i) => (
              <a 
                key={i} 
                href={client.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`group relative flex items-center gap-2 px-2.5 py-1 xl:px-3 xl:py-1 rounded-xl bg-white/90 hover:bg-white border border-slate-200/80 shadow-xs hover:shadow-sm hover:scale-[1.02] ${client.hoverBorder} transition-all duration-300`}
              >
                <div className="relative shrink-0 w-6 h-6 xl:w-7 xl:h-7 rounded-full overflow-hidden bg-slate-50">
                  <Image src={client.img} alt={client.name} fill sizes="30px" quality={80} className={client.imgClass} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] xl:text-[11px] font-bold text-slate-800 leading-tight whitespace-nowrap">{client.shortName}</span>
                  <span className="text-[8.5px] xl:text-[9.5px] font-mono font-semibold text-orange-600 leading-tight whitespace-nowrap">{client.metric}</span>
                </div>
                
                {/* Descriptive hover tooltip */}
                <div className="hidden lg:block absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none z-50">
                  <div className="bg-white/95 backdrop-blur-xl text-slate-800 text-[10.5px] font-mono px-2.5 py-1 rounded-lg whitespace-nowrap shadow-premium-soft border border-slate-200/80">
                    {client.name}: {client.desc}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      
    </section>
  );
}