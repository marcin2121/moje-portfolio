"use client";

import { motion } from 'framer-motion';

interface OfferHeroProps {
  clientName: string;
  companyName: string;
}

export default function OfferHero({ clientName, companyName }: OfferHeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-mono tracking-widest uppercase"
        >
          Poufny Dokument Ofertowy
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8"
        >
          Strategia cyfrowa i wycena wdrożenia dla <span className="text-orange-500">{companyName}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto"
        >
          Cześć {clientName}. Przygotowałem ten dedykowany dokument, aby pokazać Ci, jak dokładnie mogę rozwiązać Twoje obecne wyzwania i zostawić konkurencję daleko w tyle.
        </motion.p>
      </div>
    </section>
  );
}
