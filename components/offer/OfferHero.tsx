"use client";

import { motion } from 'framer-motion';

interface OfferHeroProps {
  clientName: string;
  companyName: string;
}


export default function OfferHero({ clientName, companyName }: OfferHeroProps) {
  return (
    <section 
      id="hero" 
      data-section="hero" 
      className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs font-mono tracking-[0.25em] text-orange-400 uppercase mb-6"
        >
          Poufny Dokument Ofertowy · Molenda Development
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
          className="text-lg md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed"
        >
          Cześć {clientName}. Przygotowałem ten dedykowany dokument, aby pokazać Ci, jak dokładnie mogę rozwiązać Twoje obecne wyzwania i zostawić konkurencję daleko w tyle.
        </motion.p>
      </div>
    </section>
  );
}

