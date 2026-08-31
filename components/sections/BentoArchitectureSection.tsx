'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Bot, ShieldCheck, Clock, Terminal, Cpu } from 'lucide-react';
import { fixOrphans } from '@/utils/typography';

export function BentoArchitectureSection() {
  return (
    <section id="architektura" className="w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-slate-50 border-t border-slate-200/60 relative overflow-hidden">
      
      {/* Background glow & grid */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-xs mb-4">
            <Cpu className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
              Architektura & Bezpieczeństwo
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mb-6">
            Inżynieria zorientowana<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
              na Twój wynik biznesowy
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            {fixOrphans('Koniec z awaryjnymi szablonami i comiesięcznym haraczem za wtyczki. Tworzę bezkompromisowe systemy w Next.js, które odciążają Cię z ręcznej pracy i sprzedają 24/7.')}
          </p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bento Card 1: 4x100 & Headless Speed (Span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 p-8 sm:p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-premium-soft hover:shadow-premium transition-all group relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
                <Zap size={24} />
              </div>
              <span className="font-mono text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                4 × 100 PageSpeed
              </span>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Ultraszybkość & Konwersja bez przestojów
              </h3>
              <p className="text-slate-600 font-light leading-relaxed text-sm sm:text-base">
                {fixOrphans('Twoja strona ładuje się w ułamki sekund (<0.3s) i nie przeładowuje całego ekranu przy kliknięciach. Klient nie czeka, nie ucieka do konkurencji, a algorytmy Google natychmiast nagradzają Cię wyższymi pozycjami w SEO.')}
              </p>
            </div>

            {/* Visual Speed Badge Metrics */}
            <div className="grid grid-cols-4 gap-3 pt-6 border-t border-slate-100">
              {[
                { label: 'Wydajność', val: '100' },
                { label: 'Dostępność', val: '100' },
                { label: 'Best Practices', val: '100' },
                { label: 'SEO', val: '100' },
              ].map((m, i) => (
                <div key={i} className="flex flex-col items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-emerald-600 font-black font-mono text-base sm:text-xl">{m.val}</span>
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider text-center">{m.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bento Card 2: AI & n8n Automations (Span 1) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-1 p-8 sm:p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-premium-soft hover:shadow-premium transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 mb-8">
                <Bot size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
                Automatyzacje & Asystenci AI
              </h3>
              <p className="text-slate-600 font-light leading-relaxed text-sm">
                {fixOrphans('System sam wystawia faktury, synchronizuje stany z hurtowniami, wysyła maile i odpowiada na zapytania klientów przez AI. Oszczędzasz nawet 20 godzin ręcznej pracy tygodniowo.')}
              </p>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
              <Terminal size={18} className="text-blue-600 shrink-0" />
              <span className="text-xs font-mono text-blue-900 font-medium">Zero ręcznej papierkologii</span>
            </div>
          </motion.div>

          {/* Bento Card 3: 100% Code Ownership (Span 1) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1 p-8 sm:p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-premium-soft hover:shadow-premium transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-8">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
                100% Własności & Zero Prowizji
              </h3>
              <p className="text-slate-600 font-light leading-relaxed text-sm">
                {fixOrphans('Płacisz raz i kod jest w 100% Twój. Żadnych comiesięcznych abonamentów za silnik, ukrytych opłat transakcyjnych czy uzależnienia od zewnętrznych platform SaaS.')}
              </p>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-emerald-900 font-medium">Gwarancja zwrotu zaliczki</span>
            </div>
          </motion.div>

          {/* Bento Card 4: Direct Engineer Contact & 24h Turnaround (Span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="lg:col-span-2 p-8 sm:p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-premium-soft hover:shadow-premium transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                <Clock size={24} />
              </div>
              <span className="font-mono text-xs text-amber-600 font-bold bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Bezpośredni kontakt z inżynierem
              </span>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Precyzyjna wycena w 24h & Gwarancja bez ryzyka
              </h3>
              <p className="text-slate-600 font-light leading-relaxed text-sm sm:text-base">
                {fixOrphans('Rozmawiasz bezpośrednio ze mną – inżynierem odpowiedzialnym za każdy wiersz kodu, bez pośredników i głuchych telefonów w agencji. Otrzymujesz przejrzysty harmonogram, stałą cenę i 7-dniową gwarancję satysfakcji.')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Wycena w 24 godziny</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Zero ukrytych kosztów</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Wsparcie powdrożeniowe</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

export default BentoArchitectureSection;
