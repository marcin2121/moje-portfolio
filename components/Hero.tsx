'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { pushGTMEvent } from '@/app/page';
import { fixOrphans } from '@/utils/typography';

interface HeroProps {
  onNavigate: (index: number) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section id="hero" className="w-full lg:w-1/4 h-auto lg:h-full flex flex-col justify-between pt-14 pb-2 lg:pt-7 xl:pt-8 2xl:pt-18 lg:pb-2 xl:pb-6 relative shrink-0 font-sans">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-orange-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 pt-4 sm:pt-8 lg:pt-2 xl:pt-6 gap-6 lg:gap-6 xl:gap-12 relative z-10 flex-1">
        
        {/* Left Column Text */}
        <div className="w-full lg:w-1/2 text-left relative z-20">
          <div className="absolute -top-10 -left-6 sm:-top-16 sm:-left-10 text-[18vw] sm:text-[14vw] lg:text-[9vw] font-black text-slate-900/[0.03] leading-none pointer-events-none select-none tracking-tighter">
            WZROST
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-2xl xl:text-4xl 2xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-2 sm:mb-3 xl:mb-5">
            Zbuduję stronę, która przyspieszy Twoją <span className="text-slate-900">sprzedaż</span>.
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm lg:text-xs xl:text-base font-normal max-w-xl leading-relaxed mb-3 sm:mb-4 xl:mb-6">
            {fixOrphans(`Uwalniam małe firmy od powolnych szablonów. Projektuję nowoczesne systemy, które odciążają Cię z ręcznej pracy i zdobywają klientów szybciej niż konkurencja. Płacisz raz, a maszyna działa bezawaryjnie.`)}
          </p>

          <div className="flex flex-col gap-1.5 xl:gap-2.5 mb-4 sm:mb-5 xl:mb-7">
            <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-[11px] xl:text-sm text-slate-700 font-medium">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <Check size={11} className="text-emerald-600" />
              </div>
              <span>Gwarancja zwrotu 100% zaliczki przez 7 dni.</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-[11px] xl:text-sm text-slate-700 font-medium">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <Check size={11} className="text-emerald-600" />
              </div>
              <span>Konkretna wycena na e-mail w 24 godziny.</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <button
              onClick={() => {
                pushGTMEvent('strona_glowna_wycena_klikniecie');
                onNavigate(15);
              }}
              className="w-full sm:w-auto px-5 py-3 sm:px-7 sm:py-3.5 xl:px-8 xl:py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-[0_10px_30px_rgba(234,88,12,0.35)] hover:shadow-[0_15px_40px_rgba(234,88,12,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer group whitespace-nowrap"
            >
              Odbierz bezpłatną wycenę na e-mail
              <ArrowRight size={16} className="shrink-0 xl:w-5 xl:h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>

            <Link
              href="/narzedzia/audyt"
              className="px-1 py-0.5 text-slate-500 hover:text-slate-900 font-medium text-[11px] sm:text-xs flex items-center gap-1.5 transition-colors group"
            >
              <span>lub przetestuj stronę darmowym audytem</span>
              <span className="text-slate-400 group-hover:text-orange-500 transition-colors">→</span>
            </Link>
          </div>
        </div>

        {/* Right Column Portrait (1:1 Square) */}
        <div className="hidden lg:flex w-full lg:w-1/2 justify-center lg:justify-end relative mt-2 lg:mt-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          {/* Light Premium Card Framing (1:1 Aspect Ratio) */}
          <div className="relative w-full max-w-[220px] lg:max-w-[240px] xl:max-w-[280px] 2xl:max-w-[410px] rounded-[1.4rem] xl:rounded-[2.2rem] bg-white p-2 xl:p-3.5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-200/60 hover:rotate-1 hover:scale-[1.02] transition-all duration-500 group flex flex-col">
            <div className="w-full aspect-square rounded-[1.1rem] xl:rounded-[1.6rem] overflow-hidden relative">
              <Image
                src="/Marcin_Molenda_Development.webp"
                alt="Marcin Molenda - Ekspert od szybkiej sprzedaży B2B"
                fill
                priority
                quality={90}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 1px, 40vw"
              />
            </div>
            
            {/* Elegant Typographic Status */}
            <div className="w-full pt-2 pb-0.5 px-1.5 sm:px-2 xl:px-2.5 flex items-center justify-between gap-1.5">
              <span className="text-[7.5px] sm:text-[8px] xl:text-[9px] 2xl:text-[10px] font-bold text-slate-400 uppercase tracking-widest 2xl:tracking-[0.2em] whitespace-nowrap">Marcin Molenda</span>
              <span className="text-[7.5px] sm:text-[8px] xl:text-[9px] 2xl:text-[10px] font-black text-slate-900 uppercase tracking-widest 2xl:tracking-[0.2em] whitespace-nowrap">Partner Biznesowy</span>
            </div>
          </div>
        </div>

      </div>

      {/* Trust Bar */}
      <div className="hidden lg:block w-full relative z-20 mt-auto mb-18 lg:mb-20 xl:mb-20 2xl:mb-24 px-4 sm:px-10 lg:px-20">
        <div className="max-w-[860px] mx-auto bg-white/70 backdrop-blur-2xl border border-slate-200/50 rounded-2xl xl:rounded-[2rem] py-2 lg:py-2.5 xl:py-4 px-5 sm:px-7 flex flex-col items-center justify-center gap-2 xl:gap-3 shadow-premium">
          <span className="text-slate-500 text-[10px] xl:text-xs font-medium uppercase tracking-[0.2em] text-center">
            Zaufały mi firmy, które cenią swój czas:
          </span>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-2.5 sm:gap-4 md:gap-6 lg:gap-7 w-full">
            {[
              { name: 'Stowarzyszenie KAS', desc: 'portal pożytku publicznego (WCAG 2.2 AA)', link: 'https://stowarzyszeniekas.pl', img: '/kas.svg', hoverBorder: 'hover:border-emerald-500/30', imgClass: 'object-contain' },
              { name: 'DzikiStyl', desc: 'studio graficzne i drukarnia online', link: 'https://dzikistyldemo.vercel.app/', img: '/dzikistyl-logo.png', hoverBorder: 'hover:border-orange-500/30', imgClass: 'object-cover' },
              { name: 'Sklep Urwis', desc: 'sklep z zabawkami w Białobrzegach', link: 'https://sklep-urwis.pl', img: '/sklepurwis-logo.png', hoverBorder: 'hover:border-orange-500/30', imgClass: 'object-cover' },
              { name: 'RLT Polska', desc: 'sklep internetowy z urządzeniami do terapii światłem', link: 'https://rltpolska.pl', img: '/rltpolska-logo.png', hoverBorder: 'hover:border-orange-500/30', imgClass: 'object-contain' },
              { name: 'Kajaki u Maćka', desc: 'spływy kajakowe Pilicą', link: 'https://kajaki-u-macka.pl', img: '/kajaki-u-macka-logo.png', hoverBorder: 'hover:border-emerald-500/30', imgClass: 'object-cover scale-100' },
            ].map((client, i) => (
              <a key={i} href={client.link} target="_blank" rel="noopener noreferrer" className={`group relative flex items-center gap-2.5 w-full lg:w-auto p-1.5 lg:p-0 rounded-xl lg:rounded-full bg-white/80 lg:bg-white border border-slate-200 shadow-sm hover:scale-[1.02] lg:hover:scale-105 ${client.hoverBorder} transition-all duration-300`}>
                <div className="relative shrink-0 w-8 h-8 lg:w-8 lg:h-8 xl:w-10 xl:h-10 2xl:w-14 2xl:h-14 rounded-full overflow-hidden bg-slate-50 lg:bg-transparent">
                  <Image src={client.img} alt={client.name} fill sizes="50px" quality={80} className={client.imgClass} />
                </div>
                <div className="lg:hidden flex flex-col items-start text-left flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-800 truncate w-full">{client.name}</span>
                  <span className="text-xs text-slate-500 line-clamp-2">{client.desc}</span>
                </div>
                <div className="hidden lg:block absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-50">
                  <div className="bg-white/95 backdrop-blur-xl text-slate-800 text-xs font-mono px-3 py-1.5 rounded-lg whitespace-nowrap shadow-premium-soft border border-slate-200/80 flex items-center gap-2">
                    {client.name} - {client.desc}
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