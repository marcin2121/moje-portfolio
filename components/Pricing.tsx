'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info, ShieldCheck, Zap, Code, Blocks } from 'lucide-react';

export default function Pricing({ isDevMode = false }: { isDevMode?: boolean }) {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center mb-16 relative z-10 w-full flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
          {isDevMode ? 'Transparent Pricing. Zero hidden fees.' : 'Czyste zasady. Żadnych gwiazdek.'}
        </h2>
        <p className="text-zinc-400 font-light max-w-2xl text-lg mb-10">
          {isDevMode 
            ? 'Whether you are launching a micro-SaaS or scaling an Enterprise B2B platform, you deserve Top 1% engineering without the agency overhead.' 
            : 'Niezależnie od tego, czy budujesz lokalną markę, czy rozwijasz ogólnokrajowe B2B – zasługujesz na technologię Top 1% bez korporacyjnej marży.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mb-16">
        
        {/* Main Base Package (Asymmetrical 8 cols) */}
        <div className="lg:col-span-7 bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] -z-10 group-hover:bg-orange-500/20 transition-all duration-700" />
          
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-8 border border-orange-500/20">
            <Zap className="w-3 h-3" /> {isDevMode ? 'Core Architecture' : 'Fundament Technologiczny'}
          </div>

          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            {isDevMode ? <React.Fragment>Flat rate for a perfect start.<br/>Scale on demand.</React.Fragment> : <React.Fragment>Jedna stawka za perfekcyjny start. <br/>Rośnij, kiedy potrzebujesz.</React.Fragment>}
          </h3>
          <p className="text-zinc-400 font-light mb-10 text-sm md:text-base leading-relaxed">
            {isDevMode
              ? 'You get a powerful Next.js App Router codebase that loads instantly and ranks flawlessly. This level of architecture costs multiples more at traditional agencies.'
              : 'Dostajesz potężne narzędzie, które normalnie kosztuje wielokrotność tej ceny w dużych agencjach. Idealne odpalenie aplikacji, która ładuje się w ułamku sekundy, z zielonymi wynikami w Google.'}
          </p>

          <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-zinc-400" />
                <span className="text-zinc-200 font-medium">Projekt i wdrożenie (Next.js)</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-white">1 000 zł</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Jednorazowo</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-zinc-400" />
                <span className="text-zinc-200 font-medium">Hosting i opieka techniczna</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-white">500 zł</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Rocznie</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 pt-8 border-t border-white/10">
            <div>
              <div className="text-sm text-zinc-400 font-light mb-1">Razem za pierwszy rok:</div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black tracking-tighter text-white leading-none">1 500</span>
                <span className="text-xl font-bold text-white mb-1">zł</span>
                <span className="text-xs text-zinc-500 font-mono mb-1.5 ml-1">netto</span>
              </div>
            </div>
            
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-orange-500 text-black hover:bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all">
              Rozpocznij współpracę
            </button>
          </div>
        </div>

        {/* Add-ons (Asymmetrical 5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Blocks className="w-6 h-6 text-orange-500" />
              <h3 className="text-2xl font-bold tracking-tight text-white">Moduły rozszerzone (Add-ons)</h3>
            </div>
            <p className="text-sm text-zinc-400 font-light mb-8 leading-relaxed">
              Fundament jest tak potężny, że w dowolnym momencie możesz go rozbudować o zaawansowane funkcje bez przepisywania aplikacji od zera.
            </p>

            <ul className="space-y-5">
              <li className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                  <span className="text-sm text-zinc-300">Dodatkowy unikalny landing page</span>
                </div>
                <span className="text-sm font-mono text-white whitespace-nowrap">+ 500 zł</span>
              </li>
              <li className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                  <span className="text-sm text-zinc-300">Wdrożenie autorskiego systemu rezerwacji</span>
                </div>
                <span className="text-sm font-mono text-white whitespace-nowrap">od 1500 zł</span>
              </li>
              <li className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                  <span className="text-sm text-zinc-300">Automatyzacja procesów (n8n / CRM)</span>
                </div>
                <span className="text-sm font-mono text-white whitespace-nowrap">od 2000 zł</span>
              </li>
              <li className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                  <span className="text-sm text-zinc-300">Zaawansowany panel klienta (SaaS)</span>
                </div>
                <span className="text-sm font-mono text-white whitespace-nowrap">od 3000 zł</span>
              </li>
            </ul>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10">
             <div className="flex items-center gap-3 text-zinc-400">
               <Info className="w-4 h-4" />
               <span className="text-xs font-light">
                 Masz specyficzne wymagania? <strong className="text-white">Przygotuję indywidualną wycenę.</strong>
               </span>
             </div>
          </div>
        </div>

      </div>

    </div>
  );
}
