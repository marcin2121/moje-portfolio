'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendContactEmail } from '@/app/actions/sendContactEmail';
import { CheckCircle2, AlertCircle, Loader2, Target, Clock, FileWarning, Rocket, Mail, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { pushGTMEvent } from '@/app/page';
import { fixOrphans } from '@/utils/typography';

const PROBLEMS = [
  { id: 'brak_klientow', icon: Target, label: 'Brak klientów z sieci', desc: 'Ruch nie przekłada się na zapytania i zyski.' },
  { id: 'wolna_strona', icon: Clock, label: 'Strona wolno działa', desc: 'Klienci uciekają, bo strona ładuje się w nieskończoność.' },
  { id: 'papierkowa_robota', icon: FileWarning, label: 'Za dużo pracy ręcznej', desc: 'Tonę w powtarzalnych mailach i papierkowej robocie.' },
  { id: 'brak_strony', icon: Rocket, label: 'Nie mam jeszcze strony', desc: 'Startuję z nowym projektem i chcę zrobić to od razu dobrze.' }
];

export default function ContactForm() {
  const [step, setStep] = useState(1);
  const [selectedBlocker, setSelectedBlocker] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelect = (id: string, label: string) => {
    setSelectedBlocker(label);
    setTimeout(() => setStep(2), 400);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    
    pushGTMEvent('formularz_kontaktowy_wysylka');

    const formData = new FormData(e.currentTarget);
    formData.append('blocker', selectedBlocker || 'Nie wybrano');

    const result = await sendContactEmail(formData);

    if (result.success) {
      setStatus('success');
      pushGTMEvent('formularz_kontaktowy_sukces');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Wystąpił błąd podczas wysyłania.');
      pushGTMEvent('formularz_kontaktowy_blad');
    }
  }

  return (
    <section id="kontakt" className="w-full py-24 sm:py-32 px-6 sm:px-10 lg:px-20 bg-transparent relative overflow-hidden border-t border-slate-200/50 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
      
      <div className="w-full max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-green-50 border border-green-200 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-4"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Wiadomość wysłana!</h3>
            <p className="text-slate-600 font-light">{fixOrphans(`Spodziewaj się wiadomości z wyceną i planem w ciągu najbliższych 24 godzin roboczych.`)}</p>
          </motion.div>
        ) : (
          <div className="w-full flex flex-col items-center relative">
            
            {step === 2 && (
              <button 
                onClick={() => setStep(1)} 
                className="absolute -top-16 left-0 md:-left-12 p-3 bg-white/80 backdrop-blur rounded-2xl border border-slate-200 hover:border-slate-300 transition-all text-slate-500 hover:text-slate-900 active:scale-95 z-20 flex items-center gap-2 text-xs font-mono uppercase shadow-sm"
              >
                <ArrowLeft size={14} /> <span className="hidden md:inline">Wstecz</span>
              </button>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col w-full">
                  <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-4">
                      Z czym obecnie masz <span className="text-orange-500">największy problem?</span>
                    </h2>
                    <p className="text-slate-500 font-mono text-[10px] md:text-sm uppercase tracking-widest">
                      {fixOrphans(`Wybierz jedną opcję poniżej`)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 max-w-3xl mx-auto w-full">
                    {PROBLEMS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = selectedBlocker === opt.label;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelect(opt.id, opt.label)}
                          className={`w-full text-left p-5 md:p-8 rounded-2xl md:rounded-3xl border transition-all flex items-center gap-4 md:gap-6 group relative overflow-hidden ${isSelected ? 'bg-orange-50 border-orange-200 scale-[0.98] shadow-inner' : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-slate-50 hover:scale-[1.02] shadow-sm'}`}
                        >
                          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0 ${isSelected ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-orange-500 group-hover:bg-orange-50'} transition-colors`}>
                            <Icon size={24} className="md:w-7 md:h-7" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1">
                            <div className={`text-base md:text-xl font-bold mb-1 md:mb-2 ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{opt.label}</div>
                            <div className="text-[11px] md:text-sm text-slate-500 leading-relaxed">{fixOrphans(opt.desc)}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col w-full max-w-2xl mx-auto">
                  <div className="text-center mb-10 md:mb-12">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-4">
                      Świetnie, mam na to <span className="text-orange-500">rozwiązanie.</span>
                    </h2>
                    <p className="text-slate-600 font-light text-base md:text-xl">
                      {fixOrphans(`Gdzie mam wysłać bezpłatną wycenę i plan działania?`)}
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 bg-white/80 backdrop-blur-xl border border-slate-200 p-6 md:p-10 rounded-3xl shadow-premium-soft">
                    {status === 'error' && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {errorMessage}
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-slate-400" />
                      </div>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Twój adres e-mail" 
                        required 
                        disabled={status === 'loading'} 
                        className="w-full pl-12 md:pl-16 pr-4 py-4 md:py-6 bg-white border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:border-orange-500/50 focus:bg-white text-slate-900 text-sm md:text-base font-mono transition-colors shadow-sm" 
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-1 px-1">
                      <button 
                        type="button" 
                        onClick={() => setShowNotes(!showNotes)}
                        className="flex items-start text-left gap-3 text-slate-500 hover:text-slate-700 transition-colors text-[10px] md:text-xs font-mono uppercase tracking-widest leading-relaxed"
                      >
                        <div className={`w-4 h-4 shrink-0 mt-[2px] rounded flex items-center justify-center transition-colors ${showNotes ? 'bg-orange-500 text-white border-orange-500' : 'border border-slate-300 bg-white'}`}>
                          {showNotes && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span>Mam dodatkowe uwagi lub chcę podać nazwę firmy / adres mojej obecnej strony / Facebooka (opcjonalnie)</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {showNotes && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <textarea 
                            name="msg" 
                            placeholder="Uwagi..." 
                            rows={3} 
                            disabled={status === 'loading'} 
                            className="w-full mt-2 p-4 md:p-6 bg-white border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:border-orange-500/50 text-slate-900 text-xs md:text-sm font-mono resize-none transition-colors shadow-sm" 
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="w-full mt-2 bg-orange-500 hover:bg-orange-400 text-white font-black uppercase tracking-widest text-xs py-5 rounded-xl transition-all shadow-[0_0_30px_rgba(234,88,12,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Wysyłanie...
                        </>
                      ) : (
                        <>
                          Odbierz wycenę i plan <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
