'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Smartphone, Zap, Gauge, Terminal } from 'lucide-react';
import MagicBento from '@/components/ui/MagicBento';
import { fixOrphans } from '@/utils/typography';

export function SolutionsSection() {
  return (
    <section id="rozwiazania" className="w-full lg:w-1/4 h-auto lg:h-full flex items-center justify-center px-6 sm:px-10 lg:px-12 py-20 lg:py-0 relative overflow-hidden bg-transparent shrink-0">
      <div className="flex flex-col gap-8 lg:gap-10 max-w-5xl w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
          <MagicBento className="md:col-span-2 bg-white border border-slate-200 hover:border-orange-300 transition-all group shadow-premium-soft">
            <div className="flex items-center justify-between mb-6">
              <Zap className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[10px] text-slate-500">Rozwiązanie 01</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2 flex items-center">
              <span className="text-orange-500 mr-2">&gt;</span>Sprzedaż bez przestojów 24/7
            </h3>
            <p 
              className="text-slate-600 font-normal text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: fixOrphans("Zamiast ciężkiego WordPressa otrzymujesz ultraszybki sklep, w którym klienci kupują bez błędów czy zawieszeń, nawet w nocy.") }}
            />
          </MagicBento>

          <MagicBento className="md:col-span-1 bg-white border border-slate-200 hover:border-orange-300 transition-all group shadow-premium-soft">
            <div className="flex items-center justify-between mb-6">
              <Smartphone className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[10px] text-slate-500">Rozwiązanie 02</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2 flex items-center">
              <span className="text-orange-500 mr-2">&gt;</span>Koniec z papierologią
            </h3>
            <p 
              className="text-slate-600 font-normal text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: fixOrphans("Własne systemy rezerwacji i panele klienta, które same robią za Ciebie najgorszą papierkową robotę.") }}
            />
          </MagicBento>

          <MagicBento className="md:col-span-1 bg-white border border-slate-200 hover:border-orange-300 transition-all group shadow-premium-soft">
            <div className="flex items-center justify-between mb-6">
              <Gauge className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[10px] text-slate-500">Rozwiązanie 03</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2 flex items-center">
              <span className="text-orange-500 mr-2">&gt;</span>Zero straconych klientów
            </h3>
            <p 
              className="text-slate-600 font-normal text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: fixOrphans('Twoja oferta ładuje się w ułamek sekundy, zanim klient zdąży pójść do konkurencji.') }}
            />
          </MagicBento>

          <MagicBento className="md:col-span-2 bg-white border border-slate-200 hover:border-orange-300 transition-all group shadow-premium-soft">
            <div className="flex items-center justify-between mb-6">
              <Code2 className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[10px] text-slate-500">Rozwiązanie 04</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2 flex items-center">
              <span className="text-orange-500 mr-2">&gt;</span>Inteligentna Automatyzacja
            </h3>
            <p 
              className="text-slate-600 font-normal text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: fixOrphans("System sam wystawia faktury, wysyła maile do klientów i powiadomienia do księgowości, odzyskując Twoje wolne wieczory.") }}
            />
          </MagicBento>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-sm"
        >
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
              <Terminal size={16} className="text-orange-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Gwarancja jakości:</span>
          </div>
          <p className="text-[11px] lg:text-xs text-slate-600 font-medium leading-relaxed text-center sm:text-left">
            {fixOrphans(`Moje wsparcie obejmuje pełne spektrum techniczne: od `)}<span className="text-slate-900 font-bold">mikro-optymalizacji</span>{fixOrphans(` (np. szybkość obrazów, poprawa LCP) po `)}<span className="text-slate-900 font-bold">złożone systemy dedykowane</span>{fixOrphans(`. Niezależnie od skali zadania, jakość kodu pozostaje bezkompromisowa.`)}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
