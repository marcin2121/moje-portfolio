'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import Link from 'next/link';

export function HeroSection({ isDevMode }: { isDevMode: boolean }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-32 overflow-hidden bg-[#0B0B0C]">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,#FF6900_0%,transparent_100%)] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161618] border border-[#222225] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF6900] animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-[#A1A1A5] uppercase">
            {isDevMode ? 'System Architecture & Engineering' : 'Top 1% Engineering'}
          </span>
        </motion.div>

        {/* H1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[#F5F5F7] leading-[1.05]">
            {isDevMode ? (
              <>Building <span className="text-[#FF6900]">high-performance</span><br/>web architectures.</>
            ) : (
              <>Buduję systemy webowe, które <span className="text-[#FF6900]">wyprzedzają konkurencję</span> o lata.</>
            )}
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-[#A1A1A5] font-light max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          {isDevMode ? (
            'I design and implement scalable PWA applications (Next.js/App Router) and robust backend automations (n8n/Python). I deliver enterprise-grade architecture single-handedly, eliminating the communication overhead of traditional agencies.'
          ) : (
            'Projektuję i wdrażam interaktywne aplikacje PWA, zaawansowane platformy e-commerce (Next.js) oraz bezbłędne automatyzacje procesów biznesowych (n8n/Python). Dostarczam architekturę klasy enterprise w pojedynkę – szybciej, precyzyjniej i bez narzutu komunikacyjnego agencji.'
          )}
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Link href="#sandbox" className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#FF6900] text-[#000000] rounded-xl overflow-hidden font-black uppercase text-[11px] tracking-[0.15em] transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,105,0,0.2)] hover:shadow-[0_0_40px_rgba(255,105,0,0.4)] w-full sm:w-auto">
            <span className="relative z-10 flex items-center gap-3">
              {isDevMode ? 'npm run dev (Init Demo)' : 'Przetestuj interaktywne demo'}
              {isDevMode ? <Terminal size={14} /> : <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </Link>
          
          <Link href="#kontakt" className="group inline-flex items-center justify-center px-8 py-4 bg-[#161618] text-[#F5F5F7] border border-[#222225] rounded-xl font-bold uppercase text-[11px] tracking-[0.15em] hover:bg-[#222225] hover:text-[#FF6900] transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
            {isDevMode ? 'View Public Repositories' : 'Omów swój projekt (Kwalifikacja)'}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
