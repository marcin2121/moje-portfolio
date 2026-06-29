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
    <section ref={ref} id="problem" className="w-full lg:w-1/4 h-auto lg:h-screen lg:min-h-[100dvh] flex-shrink-0 flex items-center justify-center relative overflow-x-hidden bg-transparent py-24 lg:py-0">
      
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.02]">
        <div className="text-[13vw] sm:text-[11vw] md:text-[9vw] font-black text-white leading-none whitespace-nowrap tracking-tighter select-none opacity-50">
          ROZWIĄZANIA
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        {/* Left Col: Giant Header */}
        <div className="w-full lg:w-5/12">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-8"
          >
            Dlaczego tradycyjne strony z&nbsp;szablonów niszczą Twój biznes <span className="text-orange-500">(i&nbsp;jak to naprawiam)</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: "100%" } : { opacity: 0, width: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-px bg-zinc-800 relative w-full mb-8"
          >
            <div className="absolute top-0 left-0 h-full w-1/3 bg-orange-500" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl font-light text-zinc-400 leading-relaxed"
          >
            Zbyt wiele biznesów zatrzymuje się przez niewłaściwie dobraną, powolną infrastrukturę, frustrując zarówno Ciebie jak i&nbsp;Twoich klientów. Znamy te problemy na wylot i&nbsp;niszczymy je u&nbsp;podstaw.
          </motion.p>
        </div>

        {/* Right Col: Asymmetric List */}
        <div className="w-full lg:w-7/12 flex flex-col gap-6">
          {problems.map((prob, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6, delay: 0.3 + (idx * 0.15) }}
              className={`group flex items-start gap-6 p-6 rounded-3xl border border-white/5 bg-zinc-950/50 backdrop-blur-md hover:bg-zinc-900/80 transition-all duration-500 ${idx === 1 ? 'lg:ml-12' : ''} ${idx === 2 ? 'lg:ml-24' : ''}`}
            >
              <div className="shrink-0 mt-1">
                <div className="text-orange-500 opacity-50 group-hover:opacity-100 transition-opacity p-3 bg-orange-500/10 rounded-xl">
                  {prob.icon}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {prob.title}
                </h3>
                <p className="text-sm font-light text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
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
