'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, AlertTriangle, FileWarning } from 'lucide-react';
import { fixOrphans } from '@/utils/typography';

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const problems = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Klient ucieka po 3 sekundach czekania',
      desc: 'Ciężkie szablony i przeładowane wtyczki ładują się 4-6 sekund na smartfonach. Badania Google wykazują, że ponad 50% odwiedzających porzuca stronę, zanim w ogóle zobaczy ofertę. Każda sekunda opóźnienia to bezpośrednio przepalony budżet na reklamy Google Ads i Meta Ads.',
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: 'Awarie i błędy po aktualizacji wtyczek',
      desc: 'Wystarczy jedna automatyczna aktualizacja WordPressa lub WooCommerce, by koszyk przestał działać, a witryna wyświetliła błąd krytyczny. Zamiast rozwijać sprzedaż, tracisz czas na nerwowe szukanie pomocy lub płacisz comiesięczny haracz agencji za łatanie kodu.',
    },
    {
      icon: <FileWarning className="w-6 h-6" />,
      title: '10+ godzin tygodniowo marnowane na ręczną papierologię',
      desc: 'Ręczne odpisywanie na powtarzalne zapytania, żmudne przepisywanie danych z formularzy do arkuszy i gubiące się e-maile. Brak automatyzacji kradnie Twój najcenniejszy czas, który powinieneś przeznaczać na strategiczny rozwój firmy.',
    }
  ];

  return (
    <section ref={ref} id="problem" className="w-full lg:w-1/4 h-auto lg:h-full shrink-0 flex-shrink-0 flex items-center justify-center relative overflow-hidden bg-transparent py-16 lg:py-0">
      
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04] overflow-hidden">
        <div className="text-[13vw] sm:text-[11vw] md:text-[9vw] font-black text-slate-900 leading-none whitespace-nowrap tracking-tighter select-none opacity-50">
          PROBLEMY
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 xl:px-12 flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-12 2xl:gap-16 items-center pt-10 lg:pt-12 xl:pt-18 2xl:pt-24 pb-14 lg:pb-16 xl:pb-20 2xl:pb-22">
        
        {/* Left Col: Giant Header */}
        <div className="w-full lg:w-5/12">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-4xl lg:text-xl xl:text-3xl 2xl:text-5xl font-black text-slate-900 tracking-tighter leading-[1.15] mb-2 lg:mb-2 xl:mb-4 2xl:mb-6"
          >
            Dlaczego tradycyjne strony z&nbsp;szablonów niszczą Twój biznes <span className="text-orange-500">(i&nbsp;generują straty)</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: "100%" } : { opacity: 0, width: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-px bg-slate-300 relative w-full mb-2 lg:mb-2 xl:mb-4 2xl:mb-6"
          >
            <div className="absolute top-0 left-0 h-full w-1/3 bg-orange-500" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-base lg:text-[11px] xl:text-sm 2xl:text-lg font-light text-slate-600 leading-relaxed"
          >
            Zbyt wiele firm traci klientów przez ociężałą infrastrukturę i&nbsp;brak automatyzacji procesów. Identyfikuję te wąskie gardła i&nbsp;zastępuję je bezawaryjnym, inżynierskim kodem Next.js.
          </motion.p>
        </div>

        {/* Right Col: Asymmetric List */}
        <div className="w-full lg:w-7/12 flex flex-col gap-2 lg:gap-2 xl:gap-3 2xl:gap-5">
          {problems.map((prob, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6, delay: 0.3 + (idx * 0.15) }}
              className={`group flex items-start gap-2.5 sm:gap-3.5 lg:gap-2.5 xl:gap-4 2xl:gap-5 p-2.5 sm:p-3 lg:p-2 xl:p-3.5 2xl:p-5 rounded-xl xl:rounded-2xl border border-slate-200/50 bg-white/60 backdrop-blur-xl hover:bg-white/90 shadow-premium-soft transition-all duration-500 ${idx === 1 ? 'lg:ml-3 xl:ml-6 2xl:ml-10' : ''} ${idx === 2 ? 'lg:ml-6 xl:ml-12 2xl:ml-20' : ''}`}
            >
              <div className="shrink-0 mt-0.5">
                <div className="text-orange-500 opacity-50 group-hover:opacity-100 transition-opacity p-1.5 lg:p-1.5 xl:p-2 2xl:p-2.5 bg-orange-500/10 rounded-xl">
                  {React.cloneElement(prob.icon, { className: 'w-4 h-4 lg:w-3.5 lg:h-3.5 xl:w-4.5 xl:h-4.5 2xl:w-5 2xl:h-5' })}
                </div>
              </div>
              <div>
                <h3 className="text-sm sm:text-base lg:text-xs xl:text-sm 2xl:text-lg font-bold text-slate-900 mb-0.5 group-hover:text-orange-600 transition-colors">
                  {prob.title}
                </h3>
                <p className="text-[11px] sm:text-xs lg:text-[10px] xl:text-xs 2xl:text-sm font-light text-slate-600 leading-tight lg:leading-snug xl:leading-relaxed group-hover:text-slate-900 transition-colors">
                  {fixOrphans(prob.desc)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
