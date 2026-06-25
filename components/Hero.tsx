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
    <section className="w-full lg:w-screen flex-shrink-0 min-h-[100dvh] bg-transparent flex flex-col relative overflow-hidden z-0 font-sans">

      {/* Main Hero Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20 pt-24 pb-12 lg:py-16 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
        
        {/* Left Column Text & CTA */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-100 leading-[1.15] mb-6 tracking-tight">
            Zbuduję stronę, która przyspieszy Twoją sprzedaż.
          </h1>
          
          <p className="text-lg sm:text-xl text-zinc-400 font-light leading-relaxed mb-10 max-w-2xl">
            {fixOrphans(`Uwalniam małe firmy od powolnych szablonów. Projektuję nowoczesne systemy, które odciążają Cię z ręcznej pracy i zdobywają klientów szybciej niż konkurencja. Płacisz raz, a maszyna działa bezawaryjnie.`)}
          </p>

          <ul className="flex flex-col gap-4 mb-10 text-left w-full sm:w-auto">
            <li className="flex items-start gap-3 text-zinc-100 text-sm sm:text-base font-medium">
              <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-green-500/20">
                <Check className="w-4 h-4 text-green-500 stroke-[3]" />
              </div>
              <span dangerouslySetInnerHTML={{ __html: fixOrphans("Gwarancja zwrotu 100% zaliczki przez 7 dni.") }} />
            </li>
            <li className="flex items-start gap-3 text-zinc-100 text-sm sm:text-base font-medium">
              <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-green-500/20">
                <Check className="w-4 h-4 text-green-500 stroke-[3]" />
              </div>
              <span dangerouslySetInnerHTML={{ __html: fixOrphans("Konkretna wycena na e-mail w 24 godziny.") }} />
            </li>
          </ul>

          <button 
             onClick={() => {
                pushGTMEvent('strona_glowna_wycena_klikniecie');
                onNavigate(14); // Index 14 to Kontakt
             }}
             className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] flex items-center justify-center gap-3 hover:-translate-y-0.5"
          >
            Odbierz bezpłatną wycenę na e-mail
            <ArrowRight size={20} className="shrink-0" />
          </button>
        </div>

        {/* Right Column Portrait */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-zinc-500/10 blur-[100px] rounded-full -z-10" />
          <div className="relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
            <Image
              src="/Marcin_Molenda_Development.png"
              alt="Marcin Molenda - Ekspert od szybkiej sprzedaży B2B"
              fill
              priority
              quality={95}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

      </div>

      {/* Trust Bar */}
      <div className="w-full relative z-20 mt-auto mb-28 lg:mb-32 px-4 sm:px-10 lg:px-20">
        <div className="max-w-[1400px] mx-auto bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl py-6 px-6 sm:px-10 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <span className="text-zinc-500 text-xs sm:text-sm font-medium uppercase tracking-widest text-center">
            Zaufali mi przedsiębiorcy, którzy cenią swój czas:
          </span>
          <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
            {/* DzikiStyl */}
            <a href="https://dzikistyldemo.vercel.app/" target="_blank" rel="noopener noreferrer" className="group relative w-14 h-14 md:w-20 md:h-20 rounded-full bg-zinc-900 border border-white/10 shadow-lg hover:scale-105 hover:border-orange-500/30 transition-all duration-300">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <Image src="/dzikistyl-logo.png" alt="DzikiStyl" fill sizes="80px" quality={90} className="object-cover" />
              </div>
              <div className="absolute -top-12 md:-top-14 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-50">
                <div className="bg-zinc-800 text-zinc-200 text-[9px] md:text-xs font-mono px-3 py-1.5 md:py-2 rounded-lg whitespace-nowrap shadow-xl border border-white/10 flex items-center gap-2">
                  DzikiStyl - studio graficzne i drukarnia online
                </div>
              </div>
            </a>
            
            {/* Sklep Urwis */}
            <a href="https://sklep-urwis.pl" target="_blank" rel="noopener noreferrer" className="group relative w-14 h-14 md:w-20 md:h-20 rounded-full bg-zinc-900 border border-white/10 shadow-lg hover:scale-105 hover:border-orange-500/30 transition-all duration-300">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <Image src="/sklepurwis-logo.png" alt="Sklep Urwis" fill sizes="80px" quality={90} className="object-cover" />
              </div>
              <div className="absolute -top-12 md:-top-14 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-50">
                <div className="bg-zinc-800 text-zinc-200 text-[9px] md:text-xs font-mono px-3 py-1.5 md:py-2 rounded-lg whitespace-nowrap shadow-xl border border-white/10 flex items-center gap-2">
                  Sklep Urwis - sklep z zabawkami w Białobrzegach
                </div>
              </div>
            </a>
            
            {/* Zamów Tu */}
            <a href="https://zamowtu.pl" target="_blank" rel="noopener noreferrer" className="group relative w-14 h-14 md:w-20 md:h-20 rounded-full bg-black border border-white/10 shadow-lg hover:scale-105 hover:border-orange-500/30 transition-all duration-300">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <Image src="/zamowtu-logo.png" alt="Zamów Tu" fill sizes="80px" quality={90} className="object-contain" />
              </div>
              <div className="absolute -top-12 md:-top-14 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-50">
                <div className="bg-zinc-800 text-zinc-200 text-[9px] md:text-xs font-mono px-3 py-1.5 md:py-2 rounded-lg whitespace-nowrap shadow-xl border border-white/10 flex items-center gap-2">
                  Zamówtu.pl - System zamówień online
                </div>
              </div>
            </a>
            
            {/* RLT Polska */}
            <a href="https://rltpolska.pl" target="_blank" rel="noopener noreferrer" className="group relative w-14 h-14 md:w-20 md:h-20 rounded-full bg-black border border-white/10 shadow-lg hover:scale-105 hover:border-orange-500/30 transition-all duration-300">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <Image src="/rltpolska-logo.png" alt="RLT Polska" fill sizes="80px" quality={90} className="object-contain" />
              </div>
              <div className="absolute -top-12 md:-top-14 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-50">
                <div className="bg-zinc-800 text-zinc-200 text-[9px] md:text-xs font-mono px-3 py-1.5 md:py-2 rounded-lg whitespace-nowrap shadow-xl border border-white/10 flex items-center gap-2">
                  RLTPolska - sklep internetowy z urządzeniami do terapii światłem
                </div>
              </div>
            </a>

            {/* Kajaki u Maćka */}
            <a href="https://kajaki-u-macka.pl" target="_blank" rel="noopener noreferrer" className="group relative w-14 h-14 md:w-20 md:h-20 rounded-full bg-black border border-white/10 shadow-lg hover:scale-105 hover:border-emerald-500/30 transition-all duration-300">
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <Image src="/kajaki-u-macka-logo.png" alt="Kajaki u Maćka" fill sizes="80px" quality={90} className="object-cover scale-100" />
              </div>
              <div className="absolute -top-12 md:-top-14 left-1/2 -translate-x-1/2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-50">
                <div className="bg-zinc-800 text-zinc-200 text-[9px] md:text-xs font-mono px-3 py-1.5 md:py-2 rounded-lg whitespace-nowrap shadow-xl border border-white/10 flex items-center gap-2">
                  Kajaki u Maćka - spływy kajakowe Pilicą
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      
    </section>
  );
}