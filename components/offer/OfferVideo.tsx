"use client";

import { motion } from 'framer-motion';

interface OfferVideoProps {
  videoUrl: string;
}

export default function OfferVideo({ videoUrl }: OfferVideoProps) {
  return (
    <section 
      id="video" 
      data-section="video" 
      className="px-4 pb-24 md:pb-32 relative z-20"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="aspect-video w-full rounded-2xl md:rounded-[32px] overflow-hidden bg-slate-100 border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative"
        >
          <iframe
            src={videoUrl}
            title="Wideo Ofertowe"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </motion.div>
      </div>
    </section>
  );
}
