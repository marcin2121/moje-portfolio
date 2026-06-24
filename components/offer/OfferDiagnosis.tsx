"use client";

import { motion } from 'framer-motion';
import { Target, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ClientOffer } from '@/data/offers';

interface OfferDiagnosisProps {
  painPoints: ClientOffer['painPoints'];
  competitorAnalysis: ClientOffer['competitorAnalysis'];
  solutionSteps: ClientOffer['solutionSteps'];
}

export default function OfferDiagnosis({ painPoints, competitorAnalysis, solutionSteps }: OfferDiagnosisProps) {
  return (
    <section className="py-24 px-4 bg-zinc-950">
      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* Pain Points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 items-start"
        >
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 text-red-500 mb-6 border border-red-500/20">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Główne Wyzwania</h2>
            <p className="text-zinc-400">Podsumowanie tego, co obecnie powstrzymuje Twój biznes przed skalowaniem, na podstawie naszej diagnozy.</p>
          </div>
          <div className="space-y-4">
            {painPoints.map((point, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 flex gap-4">
                <span className="text-red-500 font-mono mt-1">0{idx + 1}</span>
                <p className="text-zinc-300">{point}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Competitor Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 items-start"
        >
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 mb-6 border border-orange-500/20">
              <Target size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Analiza Konkurencji</h2>
            <p className="text-zinc-400">Sprawdziłem, gdzie dokładnie Twoja konkurencja buduje przewagę technologiczną w internecie.</p>
          </div>
          <div className="space-y-6">
            {competitorAnalysis.map((comp, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0a0a0a] border border-orange-500/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  {comp.competitorName}
                </h3>
                <ul className="space-y-3">
                  {comp.whatTheyDoBetter.map((item, i) => (
                    <li key={i} className="text-zinc-400 flex gap-3 items-start">
                      <span className="text-orange-500 mt-1">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* The Cure / Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 items-start"
        >
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 mb-6 border border-emerald-500/20">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Rozwiązanie</h2>
            <p className="text-zinc-400">Oto dokładny plan działania, który wdrożę, aby zdominować rynek i odzyskać Twój czas.</p>
          </div>
          <div className="space-y-4">
            {solutionSteps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex gap-4">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                <p className="text-zinc-200 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
