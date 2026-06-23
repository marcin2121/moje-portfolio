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
    <section className="w-full lg:w-screen min-h-[100dvh] lg:h-screen flex-shrink-0 flex flex-col justify-center relative overflow-hidden px-6 sm:px-10 lg:px-20 pt-32 pb-32 lg:pb-20 lg:py-0 bg-[#0A0F1E] z-0">
      
      {/* Aurora Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF6900]/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0A2540]/30 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none -z-10" />

      <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-10 lg:gap-24 items-center relative z-10 flex-1 py-12 lg:py-0">
        
        {/* Left Col: Text & CTA */}
        <div className="flex flex-col items-start text-left">
          
          <div className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 lg:mb-10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6900] mr-2" />
            <span className="font-mono text-[10px] sm:text-xs text-[#A1A1A5] uppercase tracking-widest font-medium">
              Molenda Development
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[5rem] font-black tracking-tight leading-[1.15] text-[#E0E0E0] mb-6 lg:mb-8">
            Zamień swoją stronę w niezawodną maszynę do sprzedaży 24/7.
          </h1>

          <p className="text-[#A1A1A5] text-base sm:text-xl font-light leading-relaxed lg:leading-loose mb-10 lg:mb-12 max-w-2xl">
            Ty rozwijasz swój biznes, ja biorę na siebie całą technologię. Dostajesz ultraszybki system pozbawiony awaryjnego WordPressa. Oszczędzasz czas i zarabiasz, podczas gdy ja czuwam nad kodem.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-8 w-full sm:w-auto">
            <MagneticWrapper>
              <button
                onClick={() => {
                  pushGTMEvent('strona_glowna_wycena_klikniecie');
                  onNavigate(14); // Index 14 to Kontakt
                }}
                className="group relative px-6 py-4 lg:px-8 bg-gradient-to-b from-[#FF7A00] to-[#CC5500] text-white font-bold uppercase tracking-widest text-[11px] sm:text-xs rounded-xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_0_0_rgba(255,105,0,0)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_0_25px_rgba(255,105,0,0.5)] flex items-center justify-center gap-3 w-full sm:w-auto overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10">Zarezerwuj bezpłatną wycenę</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </MagneticWrapper>

            {/* Trust Badge */}
            <div className="flex items-center gap-3 lg:gap-4 text-[#A1A1A5]">
              <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-[#FF6900] shrink-0" />
              <span className="text-[11px] sm:text-sm font-light leading-[1.6]">
                Gwarancja 100% zwrotu zaliczki.<br/>
                Wycena na mailu w max 24h.
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Portrait with Organic Glow */}
        <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[400px] lg:max-w-[480px] mx-auto lg:ml-auto mt-4 lg:mt-0 lg:-translate-y-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[#FF6900]/20 blur-[60px] lg:blur-[80px] -z-10 rounded-full" />
          <div className="w-full h-full rounded-[3rem] lg:rounded-[4rem] overflow-hidden border border-[#2A2A2A] shadow-2xl relative bg-[#0B0B0C]">
            <Image
              src="/Marcin.jpg"
              alt="Marcin Molenda - Ekspert od szybkich stron www"
              fill
              priority={true}
              quality={95}
              className="object-cover scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-transparent to-transparent opacity-80 lg:opacity-60" />
          </div>
        </div>

      </div>

      {/* Glassmorphism Bottom Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full mt-10 lg:mt-0 lg:absolute lg:bottom-12 xl:bottom-16 lg:left-1/2 lg:-translate-x-1/2 lg:w-[calc(100%-3rem)] max-w-5xl z-20"
      >
        <div className="bg-[#0A0F1E]/80 lg:bg-[#0A0F1E]/60 backdrop-blur-xl border border-white/10 rounded-3xl lg:rounded-[2rem] p-4 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          {[
            { label: 'Średni czas ładowania', value: '< 1.5s' },
            { label: 'Wtyczek z WordPressa', value: '0' },
            { label: 'Praw autorskich', value: '100%' },
            { label: 'Opieka po starcie', value: '6 m-cy' },
          ].map((proof, idx) => (
            <div key={idx} className={`flex flex-col items-center justify-center text-center w-full ${idx !== 3 ? 'md:border-r md:border-white/5' : ''}`}>
              <div className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-1 lg:mb-2 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                {proof.value}
              </div>
              <div className="text-[8px] sm:text-[10px] text-[#A1A1A5] font-mono uppercase tracking-[0.1em] lg:tracking-[0.2em] px-2 lg:px-0">
                {proof.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}