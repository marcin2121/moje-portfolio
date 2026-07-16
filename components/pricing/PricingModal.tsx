'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { pushGTMEvent } from '@/app/page';
import { sendContactEmail } from '@/app/actions/sendContactEmail';
import { TIERS_SERVICES } from './constants';

type TierType = typeof TIERS_SERVICES[0];

interface PricingModalProps {
  selectedTier: TierType | null;
  onClose: () => void;
}

export default function PricingModal({ selectedTier, onClose }: PricingModalProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseModal = () => {
    if (status === 'loading') return;
    onClose();
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedTier) return;
    
    setStatus('loading');
    setErrorMessage('');
    
    pushGTMEvent(`cennik_pakiet_wysylka`, { pakiet: selectedTier.name });

    const formData = new FormData(e.currentTarget);
    formData.append('blocker', `Wybór pakietu: ${selectedTier.name}`);

    const result = await sendContactEmail(formData);

    if (result.success) {
      setStatus('success');
      pushGTMEvent(`cennik_pakiet_sukces`, { pakiet: selectedTier.name });
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Wystąpił błąd podczas wysyłania.');
      pushGTMEvent(`cennik_pakiet_blad`, { pakiet: selectedTier.name });
    }
  }

  return (
    <AnimatePresence>
      {selectedTier && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            <button 
              onClick={handleCloseModal}
              disabled={status === 'loading'}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-colors z-20 disabled:opacity-50"
            >
              <X size={20} />
            </button>

            <div className="p-6 md:p-8 text-left">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-center gap-4 py-8"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Dzięki!</h3>
                  <p className="text-slate-600 font-light">W ciągu 24h wyślę Ci na maila propozycję wdrożenia pakietu <span className="text-slate-900 font-medium">{selectedTier.name}</span>.</p>
                  <button 
                    onClick={handleCloseModal}
                    className="mt-4 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-sm font-medium transition-colors"
                  >
                    Zamknij
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 pr-8 leading-tight">
                    Świetny wybór!
                  </h3>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    Pakiet <strong className="text-slate-900">&quot;{selectedTier.name}&quot;</strong> idealnie zautomatyzuje Twój biznes. Podaj e-mail, a prześlę Ci darmową wycenę wdrożenia i plan działania.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {status === 'error' && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-xs leading-relaxed">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        {errorMessage}
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="modal-email" className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Twój adres e-mail <span className="text-orange-500">*</span></label>
                      <input 
                        type="email" 
                        id="modal-email"
                        name="email" 
                        required 
                        disabled={status === 'loading'}
                        placeholder="jan@firma.pl"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500/50 outline-none rounded-xl px-4 py-3 text-slate-900 text-sm transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="modal-msg" className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Krótki opis projektu (Opcjonalne)</label>
                      <textarea 
                        id="modal-msg"
                        name="msg" 
                        rows={3}
                        disabled={status === 'loading'}
                        placeholder="Link do Twojej obecnej strony, pytania..."
                        className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500/50 outline-none rounded-xl px-4 py-3 text-slate-900 text-sm transition-all resize-none"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="w-full mt-2 bg-orange-500 hover:bg-orange-400 text-white font-black uppercase tracking-widest text-[11px] py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Wysyłanie...
                        </>
                      ) : 'Odbierz plan wdrożenia'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
