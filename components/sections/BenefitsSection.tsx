'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { fixOrphans } from '@/utils/typography';

export function BenefitsSection() {
  const benefits = [
    {
      value: 'Błysk',
      title: 'Płynność bez przeładowania',
      desc: 'Strona nie ładuje się od nowa przy każdym kliknięciu. Użytkownik przechodzi przez nią płynnie jak w aplikacji mobilnej, co drastycznie zwiększa sprzedaż.',
      colSpan: 'lg:col-span-2'
    },
    {
      value: '100%',
      title: 'Pełna personalizacja',
      desc: 'Zapomnij o ograniczeniach gotowych szablonów. Każdy element jest zaprogramowany pod Twoje specyficzne procesy biznesowe.',
      colSpan: 'lg:col-span-1'
    },
    {
      value: 'Bez',
      title: 'Analityka bez ciasteczek',
      desc: 'Zbierasz dokładne dane o klientach, zachowując 100% zgodności z RODO, bez brzydkich, odstraszających banerów cookies.',
      colSpan: 'lg:col-span-3'
    }
  ];

  return (
    <section id="benefits" className="w-full py-24 sm:py-32 px-6 lg:px-12 bg-transparent relative border-t border-slate-200/50">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <div className="w-full">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight"
          >
            Przewaga technologiczna.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {benefits.map((ben, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`flex flex-col justify-between p-8 md:p-10 bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-[2rem] hover:bg-white/90 shadow-premium-soft transition-colors ${ben.colSpan}`}
            >
              <div className="mb-12">
                <div className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
                  {ben.value}
                  {ben.value === '100%' && <span className="text-orange-500 text-5xl">.</span>}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{ben.title}</h3>
                <p className="text-sm font-light text-slate-600 leading-relaxed max-w-lg">{fixOrphans(ben.desc)}</p>
              </div>
              <div className="w-full h-1 bg-slate-300 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.5 + (idx * 0.2) }}
                  className="h-full bg-orange-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
