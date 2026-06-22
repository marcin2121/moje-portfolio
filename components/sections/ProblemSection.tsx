'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function ProblemSection({ isDevMode }: { isDevMode: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    {
      title: isDevMode ? 'Monolithic Bottlenecks' : 'Ograniczenia darmowych CMS-ów',
      desc: isDevMode 
        ? 'Legacy WordPress/PHP architectures fail to scale under heavy database queries for complex product variants.'
        : 'Standardowe platformy nie są w stanie udźwignąć skomplikowanych wymagań wielowariantowej konfiguracji.',
    },
    {
      title: isDevMode ? 'Manual Data Processing' : 'Straty czasu na ręczną pracę',
      desc: isDevMode
        ? 'Lack of ETL/Webhooks forces human operators to manually sync CRM, ERP, and payment data, causing fatal error rates.'
        : 'Twój zespół traci dziesiątki godzin na ręczne przepisywanie danych i obsługę procesów, które można zautomatyzować.',
    },
    {
      title: isDevMode ? 'High Latency & State Loss' : 'Wolne strony i gubienie sesji',
      desc: isDevMode
        ? 'Poor client state management leads to session drops on mobile WebKit, dramatically increasing cart abandonment.'
        : 'Strona ładuje się zbyt długo, a klienci rezygnują z zakupu przez frustrujący, zacinający się koszyk na telefonach.',
    }
  ];

  return (
    <section ref={ref} id="problem" className="w-screen h-screen flex-shrink-0 flex items-center justify-center relative overflow-hidden bg-transparent">
      
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.02]">
        <div className="text-[25vw] font-black text-white leading-none whitespace-nowrap tracking-tighter select-none">
          {isDevMode ? 'DEBT' : 'LIMITS'}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        
        {/* Left Col: Giant Header */}
        <div className="w-full lg:w-5/12">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-8"
          >
            {isDevMode ? 'Identifying Legacy Anti-Patterns.' : 'Technologia nie powinna Cię spowalniać.'}
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
            {isDevMode 
              ? 'Recognizing architectural flaws in monolithic deployments is step one. Step two is destroying them.'
              : 'Zbyt wiele biznesów zatrzymuje się przez niewłaściwie dobraną, starą infrastrukturę. Znamy te problemy na wylot.'}
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
                <div className="text-xs font-mono text-orange-500 opacity-50 group-hover:opacity-100 transition-opacity">
                  0{idx + 1}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {prob.title}
                </h3>
                <p className="text-sm font-light text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                  {prob.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
