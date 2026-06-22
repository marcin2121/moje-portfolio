'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
import MagneticWrapper from '@/components/ui/MagneticWrapper';
import Image from 'next/image';
import { pushGTMEvent } from '@/app/page';

const Particles = dynamic(() => import('@/components/ui/Particles'), { ssr: false });

interface HeroProps {
  onNavigate: (index: number) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax effect for the image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - left) / width - 0.5) * 20);
    mouseY.set(((e.clientY - top) / height - 0.5) * 20);
  };

  const imageX = useTransform(mouseX, (v) => -v);
  const imageY = useTransform(mouseY, (v) => -v);

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full lg:w-screen min-h-screen lg:h-full flex items-center justify-center relative overflow-hidden px-6 sm:px-10 lg:px-20 py-20 lg:py-0"
    >
      <Particles color="#ea580c" />
      
      {/* Background Glow */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] lg:w-[800px] lg:h-[800px] bg-linear-to-tr from-orange-600/20 via-zinc-900 to-transparent blur-[120px] rounded-full pointer-events-none will-change-transform"
      />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Col: Text & CTA */}
        <div className="flex flex-col items-start text-left max-w-2xl">
          <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span>Molenda Development</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.1] mb-6 text-white"
          >
            Tworzę szybkie strony i automatyzacje dla małych firm. Bez żargonu, bez WordPressa i bez znikania po zapłacie.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-zinc-400 text-lg lg:text-xl font-light leading-relaxed mb-10 max-w-xl"
          >
            Ty znasz się na swoim biznesie, ja biorę na siebie technologię. Dostajesz stronę, która otwiera się w sekundę, sprzedaje 24/7 i nigdy się nie wiesza. Płacisz raz, bez ukrytych abonamentów.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="flex flex-col items-start w-full gap-5"
          >
            <MagneticWrapper>
              <button
                onClick={() => {
                  pushGTMEvent('strona_glowna_wybierz_pakiet_klikniecie');
                  onNavigate(12); // Scroll to Pricing (index 12 based on NAV_DOTS)
                }}
                className="group relative px-8 py-5 bg-orange-500 text-black hover:bg-orange-600 font-black uppercase tracking-[0.15em] text-[11px] lg:text-xs rounded-xl transition-all shadow-[0_0_40px_rgba(234,88,12,0.3)] flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                Wyświetl pakiety i sprawdź cenę
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </MagneticWrapper>

            {/* Trust Badge */}
            <div className="flex items-center gap-3 mt-2 text-zinc-400">
              <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-xs lg:text-sm font-light">
                Gwarancja zwrotu 100% zaliczki przez pierwsze 7 dni. Odpowiadam w max 3 godziny.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Col: Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative w-full aspect-square md:aspect-[4/5] lg:aspect-square max-w-lg mx-auto lg:ml-auto"
        >
          <motion.div 
            style={{ x: imageX, y: imageY }}
            className="w-full h-full shadow-2xl shadow-black/40 rounded-2xl overflow-hidden border border-zinc-800/80 relative"
          >
            <Image
              src="/Marcin.jpg"
              alt="Marcin Molenda - Tworzenie szybkich stron www i automatyzacji"
              fill
              priority={true}
              quality={100}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </motion.div>

      </div>

      <div className="absolute bottom-0 left-0 w-full">
        <div className="w-full bg-zinc-950/80 backdrop-blur-md border-t border-white/5 py-6 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {[
              { label: 'Średni czas ładowania', value: '1.2s' },
              { label: 'Wtyczek z WordPressa', value: '0' },
              { label: 'Praw autorskich dla Ciebie', value: '100%' },
              { label: 'Bezpośredni nr telefonu', value: '1' },
            ].map((proof, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + (idx * 0.1) }}
                className="flex flex-col items-center justify-center w-full pt-4 md:pt-0 first:pt-0"
              >
                <div className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1">
                  {proof.value}
                </div>
                <div className="text-[10px] lg:text-xs text-zinc-400 font-light text-center uppercase tracking-widest max-w-[150px]">
                  {proof.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}