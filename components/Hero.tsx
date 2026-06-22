'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import MagneticWrapper from '@/components/ui/MagneticWrapper';
import Image from 'next/image';
import { pushGTMEvent } from '@/app/page';

interface HeroProps {
  onNavigate: (index: number) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="w-screen h-screen flex-shrink-0 flex flex-col justify-center relative overflow-hidden px-6 sm:px-10 lg:px-20 pt-32 pb-20 lg:py-0 bg-zinc-950">
      
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center relative z-10 flex-1">
        
        {/* Left Col: Text & CTA */}
        <div className="flex flex-col items-start text-left">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs text-zinc-300 uppercase tracking-widest font-medium">
              Molenda Development
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-black tracking-tight leading-[1.05] text-white mb-6">
            Zamień swoją stronę w niezawodną maszynę do sprzedaży 24/7.
          </h1>

          <p className="text-zinc-400 text-lg sm:text-xl font-light leading-relaxed mb-10 max-w-xl">
            Ty rozwijasz swój biznes, ja biorę na siebie całą technologię. Dostajesz ultraszybki system pozbawiony awaryjnego WordPressa. Oszczędzasz czas i zarabiasz, podczas gdy ja czuwam nad kodem.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <MagneticWrapper>
              <button
                onClick={() => {
                  pushGTMEvent('strona_glowna_wycena_klikniecie');
                  onNavigate(14); // Index 14 to Kontakt
                }}
                className="group relative px-8 py-4 bg-orange-500 text-black hover:bg-orange-600 font-bold uppercase tracking-widest text-[11px] sm:text-xs rounded-xl transition-colors shadow-lg flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                Zarezerwuj bezpłatną wycenę
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </MagneticWrapper>

            {/* Trust Badge */}
            <div className="flex items-center gap-3 text-zinc-400">
              <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-xs sm:text-sm font-light leading-tight">
                Gwarancja 100% zwrotu zaliczki.<br/>
                Wycena na mailu w max 24h.
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Clean, Static Human Face */}
        <div className="relative w-full aspect-square max-w-[380px] lg:max-w-[450px] mx-auto lg:ml-auto mt-6 lg:mt-0">
          <div className="w-full h-full rounded-[2rem] overflow-hidden border border-zinc-800 shadow-2xl relative bg-zinc-900">
            <Image
              src="/Marcin.jpg"
              alt="Marcin Molenda - Ekspert od szybkich stron www"
              fill
              priority={true}
              quality={90}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

      </div>

      {/* Simplified, High-Contrast Bottom Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-5xl z-20"
      >
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Średni czas ładowania', value: '< 1.5s' },
            { label: 'Wtyczek z WordPressa', value: '0' },
            { label: 'Praw autorskich', value: '100%' },
            { label: 'Opieka po starcie', value: '6 m-cy' },
          ].map((proof, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                {proof.value}
              </div>
              <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
                {proof.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}