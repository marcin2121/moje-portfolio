'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Mail, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface NextStepCTAProps {
  title?: string;
  subtitle?: string;
  theme?: 'light' | 'dark';
}

export function NextStepCTA({
  title = 'Chcesz podobne wyniki w swoim sklepie lub serwisie?',
  subtitle = 'Przeanalizuję Twój obecny kod i wskażę wąskie gardła. Wycena i plan wdrożenia w 24h na e-mail.',
  theme = 'light'
}: NextStepCTAProps) {
  const isDark = theme === 'dark';

  return (
    <motion.section 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden border ${
        isDark 
          ? 'bg-zinc-900/80 border-white/10 text-white shadow-2xl' 
          : 'bg-white/90 backdrop-blur-2xl border-slate-200/80 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.04)]'
      }`}
    >
      {/* Diffuse radial backdrop light */}
      <div 
        className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-400/15 to-rose-400/10 rounded-full blur-[80px] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-amber-400/10 to-orange-400/5 rounded-full blur-[70px] pointer-events-none" 
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
        {/* Typographic status label */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-orange-600">
          <Zap className="w-3.5 h-3.5" />
          <span>Następny Krok</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
          {title}
        </h2>

        {/* Subtitle */}
        <p className={`text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-2xl ${
          isDark ? 'text-zinc-300' : 'text-slate-600'
        }`}>
          {subtitle}
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
          <Link
            href="/#kontakt"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm sm:text-base rounded-2xl shadow-[0_8px_25px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95 transition-all group"
          >
            <span>Wyceń projekt w 24h (bez zobowiązań)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/narzedzia/audyt"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-sm'
            }`}
          >
            <span>Sprawdź błędy strony darmowym audytem</span>
            <span className="text-orange-500 font-mono text-xs">→</span>
          </Link>
        </div>

        {/* Reassurance Micro-Copy */}
        <div className={`pt-6 border-t w-full flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono ${
          isDark ? 'border-white/10 text-zinc-400' : 'border-slate-100 text-slate-500'
        }`}>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-orange-500" />
            <span>Kosztorys w 24h bezpośrednio na e-mail</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero spamu i zero natarczywych telefonów</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>Stała cena i kod na własność</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
