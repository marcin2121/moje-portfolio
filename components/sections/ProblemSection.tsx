'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Smartphone, Edit3, MessageSquare } from 'lucide-react';
import { fixOrphans } from '@/utils/typography';

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const problems = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Błyskawiczne otwieranie na telefonie',
      desc: 'Wyobraź sobie klienta, który stoi na światłach i klika w Twój link. Moje strony (pisane w technologii Next.js) otwierają się w 1.2 sekundy. Zanim strona Twojej konkurencji w ogóle załaduje logo, Twój klient już klika „Zadzwoń”.',
    },
    {
      icon: <Edit3 className="w-6 h-6" />,
      title: 'Samodzielna edycja bez ryzyka zepsucia',
      desc: 'Dostajesz ultra-prosty panel do edycji. Wpisujesz nową cenę, dodajesz zdjęcie z realizacji i klikasz "Zapisz". Całość zajmuje 30 sekund. System jest zaprojektowany tak, że fizycznie nie da się w nim "rozjechać" grafiki.',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Automatyczna obsługa zapytań',
      desc: 'Spinam formularz na Twojej stronie z Twoim telefonem i kalendarzem. Klient rezerwuje termin -> Ty dostajesz gotowego SMS-a, a dane same wskakują do arkusza. Oszczędzasz około 10 godzin powtarzalnej klikaniny w miesiącu.',
    }
  ];

  return (
    <section ref={ref} id="problem" className="w-full lg:w-1/4 h-auto lg:h-full shrink-0 flex-shrink-0 flex items-center justify-center relative overflow-hidden bg-transparent py-24 lg:py-0">
      
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04] overflow-hidden">
        <div className="text-[13vw] sm:text-[11vw] md:text-[9vw] font-black text-slate-900 leading-none whitespace-nowrap tracking-tighter select-none opacity-50">
          ROZWIĄZANIA
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-16 2xl:gap-20 items-center pt-20 lg:pt-24 xl:pt-28 2xl:pt-32 pb-14 lg:pb-18 xl:pb-20 2xl:pb-24">
        
        {/* Left Col: Giant Header */}
        <div className="w-full lg:w-5/12">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-4xl lg:text-2xl xl:text-4xl 2xl:text-6xl font-black text-slate-900 tracking-tighter leading-[1.15] mb-3 lg:mb-3 xl:mb-6 2xl:mb-8"
          >
            Dlaczego tradycyjne strony z&nbsp;szablonów niszczą Twój biznes <span className="text-orange-500">(i&nbsp;jak to naprawiam)</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: "100%" } : { opacity: 0, width: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-px bg-slate-300 relative w-full mb-3 lg:mb-3 xl:mb-6 2xl:mb-8"
          >
            <div className="absolute top-0 left-0 h-full w-1/3 bg-orange-500" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs sm:text-base lg:text-xs xl:text-base 2xl:text-xl font-light text-slate-600 leading-relaxed"
          >
            Zbyt wiele biznesów zatrzymuje się przez niewłaściwie dobraną, powolną infrastrukturę, frustrując zarówno Ciebie jak i&nbsp;Twoich klientów. Znamy te problemy na wylot i&nbsp;niszczymy je u&nbsp;podstaw.
          </motion.p>
        </div>

        {/* Right Col: Asymmetric List */}
        <div className="w-full lg:w-7/12 flex flex-col gap-2.5 lg:gap-2.5 xl:gap-4 2xl:gap-6">
          {problems.map((prob, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6, delay: 0.3 + (idx * 0.15) }}
              className={`group flex items-start gap-3 sm:gap-4 lg:gap-3 xl:gap-5 2xl:gap-6 p-3 sm:p-4 lg:p-2.5 xl:p-4.5 2xl:p-6 rounded-2xl xl:rounded-3xl border border-slate-200/50 bg-white/60 backdrop-blur-xl hover:bg-white/90 shadow-premium-soft transition-all duration-500 ${idx === 1 ? 'lg:ml-4 xl:ml-8 2xl:ml-12' : ''} ${idx === 2 ? 'lg:ml-8 xl:ml-16 2xl:ml-24' : ''}`}
            >
              <div className="shrink-0 mt-0.5">
                <div className="text-orange-500 opacity-50 group-hover:opacity-100 transition-opacity p-2 lg:p-1.5 xl:p-2.5 2xl:p-3 bg-orange-500/10 rounded-xl">
                  {React.cloneElement(prob.icon, { className: 'w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6' })}
                </div>
              </div>
              <div>
                <h3 className="text-sm sm:text-base lg:text-xs xl:text-base 2xl:text-xl font-bold text-slate-900 mb-0.5 lg:mb-0.5 xl:mb-1.5 group-hover:text-orange-600 transition-colors">
                  {prob.title}
                </h3>
                <p className="text-[11px] sm:text-xs lg:text-[10.5px] xl:text-xs 2xl:text-sm font-light text-slate-600 leading-snug lg:leading-relaxed group-hover:text-slate-900 transition-colors">
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
