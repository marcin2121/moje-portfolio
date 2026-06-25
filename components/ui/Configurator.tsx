'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Clock, FileWarning, Rocket, ArrowRight, CheckCircle2, ArrowLeft, Mail, Check } from 'lucide-react';
import MagneticWrapper from '@/components/ui/MagneticWrapper';
import { pushGTMEvent } from '@/app/page';
import { fixOrphans } from '@/utils/typography';

const PROBLEMS = [
  { id: 'brak_klientow', icon: Target, label: 'Brak klientów z sieci', desc: 'Ruch nie przekłada się na zapytania i zyski.' },
  { id: 'wolna_strona', icon: Clock, label: 'Strona wolno działa', desc: 'Klienci uciekają, bo strona ładuje się w nieskończoność.' },
  { id: 'papierkowa_robota', icon: FileWarning, label: 'Za dużo ręcznej pracy', desc: 'Tonę w powtarzalnych mailach i papierkowej robocie.' },
  { id: 'brak_strony', icon: Rocket, label: 'Nie mam jeszcze strony', desc: 'Startuję z nowym projektem i chcę zrobić to od razu dobrze.' }
];

export default function Configurator() {
  const [step, setStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  React.useEffect(() => {
    window.dispatchEvent(new Event('refreshScroll'));
  }, [step, isDone, showNotes]);

  const handleSelect = (id: string) => {
    setSelectedProblem(id);
    setTimeout(() => setStep(2), 400);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const problemLabel = PROBLEMS.find(p => p.id === selectedProblem)?.label || 'Nie wybrano';
    formData.append('Wyzwanie', problemLabel);

    try {
      const response = await fetch('https://formspree.io/f/mgolplyg', { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
      if (response.ok) {
        pushGTMEvent('formularz_premium_wyslany', { etap: selectedProblem });
        setIsDone(true);
      }
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (isDone) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-20 h-20 md:w-24 md:h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 md:mb-8">
          <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-green-500" />
        </motion.div>
        <h3 className="text-2xl md:text-3xl text-white font-bold mb-4">Wiadomość wysłana!</h3>
        <p className="text-base md:text-lg text-zinc-400 max-w-lg">{fixOrphans(`Wkrótce otrzymasz wstępną wycenę i plan działania na podany adres e-mail.`)}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full py-4 md:py-8 min-h-[300px] md:min-h-[400px] justify-center relative">
      {step === 2 && (
        <button 
          onClick={() => setStep(1)} 
          className="absolute -top-6 md:-top-12 left-0 md:-left-12 p-3 bg-zinc-900/80 backdrop-blur rounded-2xl border border-white/5 hover:border-white/20 transition-all text-zinc-400 hover:text-white active:scale-95 z-10 flex items-center gap-2 text-xs font-mono uppercase"
        >
          <ArrowLeft size={14} /> <span className="hidden md:inline">Wstecz</span>
        </button>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col w-full px-2 md:px-0">
            <div className="text-center mb-8 md:mb-12 relative">
              <h3 className="text-2xl md:text-5xl text-white font-bold mb-3 md:mb-4">Z czym obecnie masz największy problem?</h3>
              <p className="text-zinc-500 md:text-zinc-400 font-mono text-[10px] md:text-sm uppercase tracking-widest">{fixOrphans(`Wybierz jedną opcję poniżej`)}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 max-w-4xl mx-auto w-full">
              {PROBLEMS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedProblem === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className={`w-full text-left p-5 md:p-8 rounded-2xl md:rounded-3xl border transition-all flex items-center gap-4 md:gap-6 group relative overflow-hidden ${isSelected ? 'bg-white/10 border-white/30 scale-[0.98]' : 'bg-zinc-900/40 border-white/5 hover:border-white/20 hover:bg-zinc-800/40 hover:scale-[1.02]'}`}
                  >
                    <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0 ${isSelected ? 'bg-white text-black' : 'bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10'} transition-colors`}>
                      <Icon size={24} className="md:w-7 md:h-7" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-base md:text-xl font-bold mb-1 md:mb-2 ${isSelected ? 'text-white' : 'text-zinc-200'}`}>{opt.label}</div>
                      <div className="text-[11px] md:text-sm text-zinc-500 leading-relaxed">{fixOrphans(opt.desc)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col w-full max-w-2xl mx-auto px-4 md:px-0">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-3xl md:text-5xl text-white font-bold mb-3 md:mb-4">Świetnie, mam na to rozwiązanie.</h3>
              <p className="text-zinc-400 text-sm md:text-xl">{fixOrphans(`Gdzie mam wysłać wycenę i plan działania?`)}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-zinc-500" />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Twój najlepszy adres e-mail" 
                  required 
                  disabled={isSubmitting} 
                  className="w-full pl-12 md:pl-16 pr-4 py-4 md:py-6 bg-zinc-950/50 border border-white/10 rounded-xl md:rounded-2xl outline-none focus:border-white/30 focus:bg-white/5 text-zinc-200 text-sm md:text-base font-mono transition-colors shadow-inner" 
                />
              </div>

              <div className="flex items-center gap-3 pt-2 px-2">
                <button 
                  type="button" 
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-xs md:text-sm font-mono uppercase tracking-widest"
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${showNotes ? 'bg-orange-500 text-white' : 'border border-zinc-600'}`}>
                    {showNotes && <Check size={12} strokeWidth={3} />}
                  </div>
                  Mam uwagi
                </button>
              </div>

              <AnimatePresence>
                {showNotes && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <textarea 
                      name="msg" 
                      placeholder="Uwagi..." 
                      rows={3} 
                      disabled={isSubmitting} 
                      className="w-full mt-4 p-4 md:p-6 bg-zinc-950/50 border border-white/10 rounded-xl md:rounded-2xl outline-none focus:border-white/30 text-zinc-200 text-xs md:text-sm font-mono resize-none transition-colors shadow-inner" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <MagneticWrapper className="w-full pt-4 md:pt-6">
                <button type="submit" disabled={isSubmitting} className="w-full py-4 md:py-6 bg-orange-500 text-white hover:bg-orange-600 font-black uppercase tracking-[0.15em] rounded-xl md:rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 md:gap-3 active:scale-[0.98] text-[11px] md:text-sm shadow-[0_4px_20px_rgba(234,88,12,0.2)]">
                  {isSubmitting ? 'Wysyłanie...' : 'Odbierz wycenę i plan działania'}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </MagneticWrapper>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}