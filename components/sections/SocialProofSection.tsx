'use client';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PROOFS = [
  { label: 'Średni czas ładowania na mobile', value: '1.2s' },
  { label: 'Wtyczek z WordPressa (zero awarii)', value: '0' },
  { label: 'Praw autorskich i kodu dla Ciebie', value: '100%' },
  { label: 'Bezpośredni numer do programisty', value: '1' },
];

export function SocialProofSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="w-full bg-zinc-950 border-t border-b border-white/5 relative z-20 py-8 lg:py-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
        
        {PROOFS.map((proof, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="flex flex-col items-center justify-center w-full pt-8 md:pt-0 first:pt-0"
          >
            <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
              {proof.value}
            </div>
            <div className="text-xs lg:text-sm text-zinc-400 font-light text-center uppercase tracking-widest max-w-[200px]">
              {proof.label}
            </div>
          </motion.div>
        ))}

      </div>
    </section>
  );
}
