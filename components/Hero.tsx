'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { pushGTMEvent } from '@/app/page';
import { fixOrphans } from '@/utils/typography';

interface HeroProps {
  onNavigate: (index: number) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section id="hero" className="w-full lg:w-1/4 flex-shrink-0 min-h-[100dvh] bg-transparent flex flex-col relative overflow-hidden z-0 font-sans">
      
      {/* Background Watermark */}
      <div className="absolute top-20 sm:top-32 lg:top-1/2 lg:-translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center opacity-[0.04] z-0 overflow-hidden w-full">
        <div className="text-[24vw] sm:text-[20vw] lg:text-[14vw] font-black text-slate-900 leading-none whitespace-nowrap tracking-tighter select-none">
          WZROST
        </div>
      </div>


      {/* Main Hero Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20 pt-24 pb-12 lg:py-16 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
        
        {/* Left Column Text & CTA */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] mb-6 tracking-tight">
            Zbuduję stronę, która przyspieszy Twoją sprzedaż.
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-900 font-medium leading-relaxed mb-10 max-w-2xl opacity-90">
            {fixOrphans(`Uwalniam małe firmy od powolnych szablonów. Projektuję nowoczesne systemy, które odciążają Cię z ręcznej pracy i zdobywają klientów szybciej niż konkurencja. Płacisz raz, a maszyna działa bezawaryjnie.`)}
          </p>

          <ul className="flex flex-col gap-4 mb-10 text-left w-full sm:w-auto">
            <li className="flex items-start gap-3 text-slate-800 text-sm sm:text-base font-semibold">
              <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              </div>
              <span dangerouslySetInnerHTML={{ __html: fixOrphans("Gwarancja zwrotu 100% zaliczki przez 7 dni.") }} />
            </li>
            <li className="flex items-start gap-3 text-slate-800 text-sm sm:text-base font-semibold">
              <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              </div>
              <span dangerouslySetInnerHTML={{ __html: fixOrphans("Konkretna wycena na e-mail w 24 godziny.") }} />
            </li>
          </ul>

          <button 
             onClick={() => {
                pushGTMEvent('strona_glowna_wycena_klikniecie');
                onNavigate(14); // Index 14 to Kontakt
             }}
             className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black tracking-wide text-lg rounded-xl transition-all duration-300 shadow-[0_15px_40px_rgba(234,88,12,0.4)] hover:shadow-[0_20px_60px_rgba(234,88,12,0.6)] flex items-center justify-center gap-3 hover:-translate-y-1"
          >
            Odbierz bezpłatną wycenę na e-mail
            <ArrowRight size={20} className="shrink-0" />
          </button>
        </div>

        {/* Right Column Portrait */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mt-8 lg:mt-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          {/* Light Premium Card Framing for the photo (Polaroid style) */}
          <div className="relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] rounded-[2.5rem] bg-white p-3 sm:p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-200/60 hover:rotate-1 hover:scale-[1.02] transition-all duration-500 group flex flex-col">
            <div className="w-full aspect-[4/5] rounded-[1.8rem] overflow-hidden relative">
              <Image
                src="/Marcin_Molenda_Development.png"
                alt="Marcin Molenda - Ekspert od szybkiej sprzedaży B2B"
                fill
                priority
                quality={90}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            
            {/* Elegant Typographic Status (Strictly No Pills / No Dots) */}
            <div className="w-full pt-5 pb-2 px-2 sm:px-4 flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Marcin Molenda</span>
              <span className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Partner Biznesowy</span>
            </div>
          </div>
        </div>

      </div>

      {/* Trust Bar */}
      <div className="w-full relative z-20 mt-auto mb-28 lg:mb-32 px-4 sm:px-10 lg:px-20">
        <div className="max-w-[1000px] mx-auto bg-white/70 backdrop-blur-2xl border border-slate-200/50 rounded-[2rem] py-8 px-6 sm:px-10 flex flex-col items-center justify-center gap-8 shadow-premium">
          <span className="text-slate-500 text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-center">
            Zaufali mi przedsiębiorcy, którzy cenią swój czas:
          </span>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-8 lg:gap-10 w-full">
            {[
              { name: 'DzikiStyl', desc: 'studio graficzne i drukarnia online', link: 'https://dzikistyldemo.vercel.app/', img: '/dzikistyl-logo.png', hoverBorder: 'hover:border-orange-500/30', imgClass: 'object-cover' },
              { name: 'Sklep Urwis', desc: 'sklep z zabawkami w Białobrzegach', link: 'https://sklep-urwis.pl', img: '/sklepurwis-logo.png', hoverBorder: 'hover:border-orange-500/30', imgClass: 'object-cover' },
              { name: 'Zamów Tu', desc: 'System zamówień online', link: 'https://zamowtu.pl', img: '/zamowtu-logo.png', hoverBorder: 'hover:border-orange-500/30', imgClass: 'object-contain' },
              { name: 'RLT Polska', desc: 'sklep internetowy z urządzeniami do terapii światłem', link: 'https://rltpolska.pl', img: '/rltpolska-logo.png', hoverBorder: 'hover:border-orange-500/30', imgClass: 'object-contain' },
              { name: 'Kajaki u Maćka', desc: 'spływy kajakowe Pilicą', link: 'https://kajaki-u-macka.pl', img: '/kajaki-u-macka-logo.png', hoverBorder: 'hover:border-emerald-500/30', imgClass: 'object-cover scale-100' },
            ].map((client, i) => (
              <a key={i} href={client.link} target="_blank" rel="noopener noreferrer" className={`group relative flex items-center gap-4 w-full lg:w-auto p-3 lg:p-0 rounded-2xl lg:rounded-full bg-white/80 lg:bg-white border border-slate-200 shadow-sm hover:scale-[1.02] lg:hover:scale-105 ${client.hoverBorder} transition-all duration-300`}>
                <div className="relative shrink-0 w-12 h-12 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-slate-50 lg:bg-transparent">
                  <Image src={client.img} alt={client.name} fill sizes="80px" quality={80} className={client.imgClass} />
                </div>
                <div className="lg:hidden flex flex-col items-start text-left flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-800 truncate w-full">{client.name}</span>
                  <span className="text-xs text-slate-500 line-clamp-2">{client.desc}</span>
                </div>
                <div className="hidden lg:block absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-50">
                  <div className="bg-white/95 backdrop-blur-xl text-slate-800 text-xs font-mono px-3 py-2 rounded-lg whitespace-nowrap shadow-premium-soft border border-slate-200/80 flex items-center gap-2">
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