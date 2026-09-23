"use client";

import { motion } from 'framer-motion';
import { Target, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ClientOffer } from '@/data/offers';
import { fixOrphans } from '@/utils/typography';

interface OfferDiagnosisProps {
  painPoints: ClientOffer['painPoints'];
  competitorAnalysis: ClientOffer['competitorAnalysis'];
  solutionSteps: ClientOffer['solutionSteps'];
}

export default function OfferDiagnosis({ painPoints, competitorAnalysis, solutionSteps }: OfferDiagnosisProps) {
  return (
    <section 
      id="diagnosis" 
      data-section="diagnosis" 
      className="py-20 md:py-28 px-4 border-t border-slate-200/60"
    >
      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* Pain Points */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-[1fr_2fr] gap-12 items-start"
        >
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 text-red-600 mb-6 border border-red-200 shadow-sm">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Główne Wyzwania</h2>
            <p className="text-slate-600 font-light leading-relaxed">{fixOrphans(`Podsumowanie kluczowych obszarów technologicznych i formalnych wymagających rozwiązania.`)}</p>
          </div>
          <div className="space-y-4">
            {painPoints.map((point, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all flex gap-4">
                <span className="text-red-600 font-mono font-bold mt-1 shrink-0">0{idx + 1}</span>
                <p className="text-slate-700 leading-relaxed font-light">{fixOrphans(point)}</p>
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
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 mb-6 border border-orange-200 shadow-sm">
              <Target size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Standardy Rynkowe</h2>
            <p className="text-slate-600 font-light leading-relaxed">{fixOrphans(`Porównanie tradycyjnych, powolnych rozwiązań z nowoczesnym standardem architektury webowej.`)}</p>
          </div>
          <div className="space-y-6">
            {competitorAnalysis.map((comp, idx) => (
              <div key={idx} className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3 tracking-tight">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                  {comp.competitorName}
                </h3>
                <ul className="space-y-3">
                  {comp.whatTheyDoBetter.map((item, i) => (
                    <li key={i} className="text-slate-600 flex gap-3 items-start text-sm leading-relaxed font-light">
                      <span className="text-orange-600 font-bold mt-0.5 shrink-0">→</span>
                      {fixOrphans(item)}
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
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mb-6 border border-emerald-200 shadow-sm">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Rozwiązanie</h2>
            <p className="text-slate-600 font-light leading-relaxed">{fixOrphans(`Oto sprawdzony, inżynieryjny plan działania gwarantujący terminowe i bezbłędne wdrożenie serwisu.`)}</p>
          </div>
          <div className="space-y-4">
            {solutionSteps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 shadow-sm hover:border-emerald-300 transition-all flex gap-4">
                <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                <p className="text-slate-800 font-medium leading-relaxed">{fixOrphans(step)}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
