'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fixOrphans } from '@/utils/typography';

export function HowItWorksSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const steps = [
    {
      num: '01',
      title: 'Szybka wycena (Online)',
      desc: 'Wypełniasz 3 proste pola w formularzu na dole strony. Nie tracimy czasu na długie telefony. Analizuję Twój problem i w ciągu 24 godzin wysyłam Ci na maila konkretny plan działania i wstępne ramy cenowe.',
    },
    {
      num: '02',
      title: 'Projekt i "Bezpieczne 7 dni"',
      desc: 'Rysuję wygląd strony. Masz tydzień, żeby na nią popatrzeć. Jeśli powiesz: „Marcin, to zupełnie nie to” – oddaję Ci 100% zaliczki bez zadawania pytań.',
    },
    {
      num: '03',
      title: 'Kodowanie i testy',
      desc: 'Piszę czysty kod. Testuję stronę na starych smartfonach, słabym internecie i najnowszych iPhone\'ach. Ma działać perfekcyjnie wszędzie.',
    },
    {
      num: '04',
      title: 'Przekazanie kluczy',
      desc: 'Dostajesz ode mnie krótką instrukcję wideo nagraną celowo dla Ciebie oraz 6 miesięcy mojej osobistej opieki technicznej w cenie.',
    }
  ];

  return (
    <section id="proces" ref={ref} className="w-full py-24 sm:py-32 px-6 lg:px-12 bg-transparent relative border-t border-white/5">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        
        <div className="text-center">
          <motion.div 
            style={{ y: yOffset }}
            className="text-[15vw] font-black text-white/5 leading-none absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none select-none"
          >
            PROCES
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight relative z-10 mb-4">
            Cały proces w 4 prostych krokach.
          </h2>
          <p className="text-zinc-400 font-light text-lg relative z-10 max-w-2xl mx-auto">
            {fixOrphans(`Mówimy po polsku, nie po programistycznemu.`)}
          </p>
        </div>

        <div className="flex flex-col gap-12 relative z-10 w-full mt-10">
          <div className="absolute top-0 bottom-0 left-[23px] lg:left-1/2 w-px bg-white/10 hidden lg:block" />
          
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`flex flex-col lg:flex-row gap-6 lg:gap-0 items-start lg:items-center relative w-full ${isEven ? 'lg:justify-start' : 'lg:justify-end'}`}
              >
                <div className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border border-orange-500/50 bg-[#0B0B0C] items-center justify-center font-mono text-orange-500 text-sm font-bold shadow-[0_0_20px_rgba(234,88,12,0.2)]`}>
                  {step.num}
                </div>
                
                <div className={`w-full lg:w-5/12 bg-zinc-950 border border-white/5 p-8 rounded-3xl hover:border-orange-500/30 transition-colors shadow-2xl`}>
                  <div className="lg:hidden w-10 h-10 rounded-full border border-orange-500/50 flex items-center justify-center font-mono text-orange-500 text-xs font-bold mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-400 font-light text-sm leading-relaxed">
                    {fixOrphans(step.desc)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
