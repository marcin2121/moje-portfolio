'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Smartphone, Zap, Gauge, Terminal } from 'lucide-react';
import MagicBento from '@/components/ui/MagicBento';
import { fixOrphans } from '@/utils/typography';

export function SolutionsSection() {
  return (
    <section id="rozwiazania" className="w-full lg:w-1/4 h-auto lg:h-full shrink-0 flex-shrink-0 flex items-center justify-center px-4 sm:px-8 lg:px-6 xl:px-12 pt-20 lg:pt-24 xl:pt-26 2xl:pt-28 pb-14 lg:pb-18 xl:pb-20 2xl:pb-22 relative overflow-hidden bg-transparent">
      <div className="flex flex-col gap-2 lg:gap-2 xl:gap-3.5 2xl:gap-5 max-w-5xl w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-2 xl:gap-3.5 2xl:gap-5 w-full">
          <MagicBento className="md:col-span-2 bg-white border border-slate-200 hover:border-orange-300 transition-all group shadow-premium-soft" contentClassName="p-3.5 sm:p-5 lg:p-2.5 xl:p-4 2xl:p-6">
            <div className="flex items-center justify-between mb-1 lg:mb-0.5 xl:mb-1.5 2xl:mb-3">
              <Zap className="text-orange-500 w-4 h-4 xl:w-5 xl:h-5 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[9px] xl:text-[10px] text-slate-500">Rozwiązanie 01</span>
            </div>
            <h3 className="text-sm sm:text-lg lg:text-xs xl:text-base 2xl:text-xl font-bold tracking-tight text-slate-900 mb-0.5 lg:mb-0.5 xl:mb-1 flex items-center">
              <span className="text-orange-500 mr-2">&gt;</span>Sprzedaż bez przestojów 24/7
            </h3>
            <p 
              className="text-slate-600 font-normal text-xs lg:text-[10px] xl:text-xs 2xl:text-sm leading-snug lg:leading-normal xl:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: fixOrphans("Łączę wygodny, znany panel WordPressa (lub dedykowany CMS) z najnowszą technologią Next.js - otrzymujesz ultraszybki sklep, w którym klienci kupują bez błędów czy zawieszeń, nawet w nocy.") }}
            />
          </MagicBento>

          <MagicBento className="md:col-span-1 bg-white border border-slate-200 hover:border-orange-300 transition-all group shadow-premium-soft" contentClassName="p-3.5 sm:p-5 lg:p-2.5 xl:p-4 2xl:p-6">
            <div className="flex items-center justify-between mb-1 lg:mb-0.5 xl:mb-1.5 2xl:mb-3">
              <Smartphone className="text-orange-500 w-4 h-4 xl:w-5 xl:h-5 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[9px] xl:text-[10px] text-slate-500">Rozwiązanie 02</span>
            </div>
            <h3 className="text-sm sm:text-lg lg:text-xs xl:text-base 2xl:text-xl font-bold tracking-tight text-slate-900 mb-0.5 lg:mb-0.5 xl:mb-1 flex items-center">
              <span className="text-orange-500 mr-2">&gt;</span>Koniec z papierologią
            </h3>
            <p 
              className="text-slate-600 font-normal text-xs lg:text-[10px] xl:text-xs 2xl:text-sm leading-snug lg:leading-normal xl:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: fixOrphans("Własne systemy rezerwacji i panele klienta, które same robią za Ciebie najgorszą papierkową robotę.") }}
            />
          </MagicBento>

          <MagicBento className="md:col-span-1 bg-white border border-slate-200 hover:border-orange-300 transition-all group shadow-premium-soft" contentClassName="p-3.5 sm:p-5 lg:p-2.5 xl:p-4 2xl:p-6">
            <div className="flex items-center justify-between mb-1 lg:mb-0.5 xl:mb-1.5 2xl:mb-3">
              <Gauge className="text-orange-500 w-4 h-4 xl:w-5 xl:h-5 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[9px] xl:text-[10px] text-slate-500">Rozwiązanie 03</span>
            </div>
            <h3 className="text-sm sm:text-lg lg:text-xs xl:text-base 2xl:text-xl font-bold tracking-tight text-slate-900 mb-0.5 lg:mb-0.5 xl:mb-1 flex items-center">
              <span className="text-orange-500 mr-2">&gt;</span>Zero straconych klientów
            </h3>
            <p 
              className="text-slate-600 font-normal text-xs lg:text-[10px] xl:text-xs 2xl:text-sm leading-snug lg:leading-normal xl:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: fixOrphans('Twoja oferta ładuje się w ułamek sekundy, zanim klient zdąży pójść do konkurencji.') }}
            />
          </MagicBento>

          <MagicBento className="md:col-span-2 bg-white border border-slate-200 hover:border-orange-300 transition-all group shadow-premium-soft" contentClassName="p-3.5 sm:p-5 lg:p-2.5 xl:p-4 2xl:p-6">
            <div className="flex items-center justify-between mb-1 lg:mb-0.5 xl:mb-1.5 2xl:mb-3">
              <Code2 className="text-orange-500 w-4 h-4 xl:w-5 xl:h-5 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[9px] xl:text-[10px] text-slate-500">Rozwiązanie 04</span>
            </div>
            <h3 className="text-sm sm:text-lg lg:text-xs xl:text-base 2xl:text-xl font-bold tracking-tight text-slate-900 mb-0.5 lg:mb-0.5 xl:mb-1 flex items-center">
              <span className="text-orange-500 mr-2">&gt;</span>Inteligentna Automatyzacja
            </h3>
            <p 
              className="text-slate-600 font-normal text-xs lg:text-[10px] xl:text-xs 2xl:text-sm leading-snug lg:leading-normal xl:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: fixOrphans("System sam wystawia faktury, wysyła maile do klientów i powiadomienia do księgowości, odzyskując Twoje wolne wieczory.") }}
            />
          </MagicBento>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full p-2 lg:p-2 xl:p-3 2xl:p-5 bg-slate-50 border border-slate-200 rounded-xl xl:rounded-2xl flex flex-col sm:flex-row items-center gap-2 lg:gap-2.5 xl:gap-4 shadow-sm"
        >
          <div className="flex items-center gap-2 lg:gap-2.5 shrink-0">
            <div className="w-6 h-6 lg:w-6 lg:h-6 xl:w-7 xl:h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
              <Terminal size={12} className="text-orange-500 xl:w-3.5 xl:h-3.5" />
            </div>
            <span className="text-[9px] xl:text-[10px] font-bold uppercase tracking-widest text-slate-500">Gwarancja jakości:</span>
          </div>
          <p className="text-[10px] lg:text-[9.5px] xl:text-xs 2xl:text-sm text-slate-600 font-medium leading-tight lg:leading-normal text-center sm:text-left">
            {fixOrphans(`Moje wsparcie obejmuje pełne spektrum techniczne: od `)}<span className="text-slate-900 font-bold">mikro-optymalizacji</span>{fixOrphans(` (np. szybkość obrazów, poprawa LCP) po `)}<span className="text-slate-900 font-bold">złożone systemy dedykowane</span>{fixOrphans(`. Niezależnie od skali zadania, jakość kodu pozostaje bezkompromisowa.`)}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
