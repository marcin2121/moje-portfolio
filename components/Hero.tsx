'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { fixOrphans } from '@/utils/typography';

interface HeroProps {
  onNavigate?: (id: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const handleCtaClick = () => {
    if (onNavigate) {
      onNavigate('kontakt');
    } else {
      const el = document.getElementById('kontakt');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="w-full min-h-[90vh] bg-transparent flex flex-col justify-center relative overflow-hidden z-0 font-sans pt-28 sm:pt-36 pb-16 lg:pb-24">
      
      {/* Background Watermark */}
      <div className="absolute top-24 sm:top-32 lg:top-1/2 lg:-translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center opacity-[0.03] z-0 overflow-hidden w-full select-none">
        <div className="text-[26vw] sm:text-[22vw] lg:text-[16vw] font-black text-slate-900 leading-none whitespace-nowrap tracking-tighter">
          WZROST
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10 my-auto">
        
        {/* Left Column Text & CTA */}
        <div className="w-full lg:w-3/5 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Pure Typographic Status (No Pill / No Dots) */}
          <div className="flex items-center gap-3 mb-6 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em]">
            <span className="text-orange-600 font-bold">// DEDYKOWANY SOFTWARE HOUSE B2B</span>
            <span className="h-px w-6 bg-orange-500/30" />
            <span className="text-slate-400 font-medium hidden sm:inline">NEXT.JS 16 &bull; HEADLESS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.12] mb-6 tracking-tighter">
            Zbuduję system, który przyspieszy Twoją sprzedaż.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed mb-8 max-w-xl">
            {fixOrphans(`Uwalniam małe i średnie firmy od powolnych szablonów. Projektuję nowoczesne aplikacje i sklepy w Next.js, które odciążają Cię z ręcznej pracy i zdobywają klientów szybciej niż konkurencja.`)}
          </p>

          <ul className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-10 text-left w-full sm:w-auto">
            <li className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-medium">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
              <span>Gwarancja 100% zaliczki przez 7 dni</span>
            </li>
            <li className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm font-medium">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
              <span>Konkretna wycena w 24 godziny</span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={handleCtaClick}
              className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black tracking-wide text-sm sm:text-base rounded-xl transition-all duration-300 shadow-[0_12px_30px_rgba(234,88,12,0.35)] hover:shadow-[0_16px_40px_rgba(234,88,12,0.5)] flex items-center justify-center gap-3 hover:-translate-y-0.5 active:scale-95"
            >
              <span>Odbierz bezpłatną wycenę</span>
              <ArrowRight size={18} className="shrink-0" />
            </button>

            <a
              href="#realizacje"
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs uppercase tracking-wider rounded-xl border border-slate-200 transition-all flex items-center justify-center"
            >
              Zobacz realizacje ↓
            </a>
          </div>
        </div>

        {/* Right Column Portrait */}
        <div className="w-full lg:w-2/5 flex justify-center lg:justify-end relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative w-full max-w-[300px] sm:max-w-[360px] rounded-[2.5rem] bg-white p-3 sm:p-4 shadow-premium-soft border border-slate-200/80 hover:rotate-1 hover:scale-[1.02] transition-all duration-500 group flex flex-col">
            <div className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden relative">
              <Image
                src="/Marcin_Molenda_Development.png"
                alt="Marcin Molenda - Ekspert od szybkiej sprzedaży B2B"
                fill
                quality={90}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
            
            <div className="w-full pt-4 pb-1 px-2 sm:px-3 flex items-center justify-between font-mono">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Marcin Molenda</span>
              <span className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">Lead Engineer</span>
            </div>
          </div>
        </div>

      </div>

      {/* Trust Bar */}
      <div className="w-full relative z-20 mt-16 sm:mt-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] py-6 sm:py-8 px-6 sm:px-10 flex flex-col items-center justify-center gap-6 shadow-premium-soft">
          <span className="text-slate-400 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-center font-bold">
            Zaufały mi marki, które cenią bezkompromisową jakość:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-12 w-full">
            {[
              { name: 'Stowarzyszenie KAS', desc: 'portal pożytku publicznego (WCAG 2.2 AA)', link: 'https://stowarzyszeniekas.pl', img: '/kas.svg', hoverBorder: 'hover:border-emerald-500/30', imgClass: 'object-contain' },
              { name: 'DzikiStyl', desc: 'studio graficzne i drukarnia online', link: 'https://dzikistyldemo.vercel.app/', img: '/dzikistyl-logo.png', hoverBorder: 'hover:border-orange-500/30', imgClass: 'object-cover' },
              { name: 'Sklep Urwis', desc: 'sklep z zabawkami w Białobrzegach', link: 'https://sklep-urwis.pl', img: '/sklepurwis-logo.png', hoverBorder: 'hover:border-orange-500/30', imgClass: 'object-cover' },
              { name: 'RLT Polska', desc: 'sklep internetowy z urządzeniami do terapii światłem', link: 'https://rltpolska.pl', img: '/rltpolska-logo.png', hoverBorder: 'hover:border-orange-500/30', imgClass: 'object-contain' },
              { name: 'Kajaki u Maćka', desc: 'spływy kajakowe Pilicą', link: 'https://kajaki-u-macka.pl', img: '/kajaki-u-macka-logo.png', hoverBorder: 'hover:border-emerald-500/30', imgClass: 'object-cover scale-100' },
            ].map((client, i) => (
              <a 
                key={i} 
                href={client.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`group relative flex items-center gap-3 p-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:scale-105 ${client.hoverBorder} transition-all duration-300`}
                title={`${client.name} - ${client.desc}`}
              >
                <div className="relative shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-slate-50">
                  <Image src={client.img} alt={client.name} fill sizes="48px" quality={80} className={client.imgClass} />
                </div>
                <span className="text-xs font-semibold text-slate-800 pr-3 hidden sm:inline">{client.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      
    </section>
  );
}
