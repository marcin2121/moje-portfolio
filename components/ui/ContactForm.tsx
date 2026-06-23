'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sendContactEmail } from '@/app/actions/sendContactEmail';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { pushGTMEvent } from '@/app/page';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedBlocker, setSelectedBlocker] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    
    pushGTMEvent('formularz_kontaktowy_wysylka');

    const formData = new FormData(e.currentTarget);
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
    <section id="kontakt" className="w-full py-24 sm:py-32 px-6 sm:px-10 lg:px-20 bg-zinc-950 relative overflow-hidden border-t border-white/5 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
      
      <div className="w-full max-w-2xl mx-auto relative z-10 flex flex-col items-center">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4">
            Porozmawiajmy o Twojej firmie. <br/><span className="text-zinc-500">Bez informatycznego żargonu.</span>
          </h2>
          <p className="text-zinc-400 font-light text-base md:text-lg max-w-xl mx-auto">
            Sprawdźmy, jak mogę ulepszyć Twój biznes. Bez informatycznego żargonu i bez wiszenia na telefonie. Zostaw swój adres e-mail i powiedz mi, z czym masz problem. Prześlę Ci wstępną wycenę i propozycję rozwiązania w ciągu maksymalnie 24 godzin roboczych. Bez presji i zobowiązań – w spokoju przeanalizujesz ofertę u siebie na skrzynce.
          </p>
        </div>

        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-green-500/10 border border-green-500/20 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-4"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h3 className="text-2xl font-bold text-white tracking-tight">Sukces! Twój formularz został wysłany.</h3>
            <p className="text-zinc-400 font-light">Spodziewaj się wiadomości z wyceną w ciągu najbliższych 24 godzin roboczych.</p>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit} 
            className="w-full flex flex-col gap-5 bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl"
          >
            {status === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-mono tracking-widest text-zinc-400 uppercase">Twoje Imię</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                placeholder="Jan Kowalski"
                className="w-full bg-zinc-950 border border-white/5 focus:border-orange-500/50 outline-none rounded-xl px-5 py-4 text-white font-light transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-mono tracking-widest text-zinc-400 uppercase">Twój adres e-mail</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                placeholder="jan.kowalski@firma.pl"
                className="w-full bg-zinc-950 border border-white/5 focus:border-orange-500/50 outline-none rounded-xl px-5 py-4 text-white font-light transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono tracking-widest text-zinc-400 uppercase">Co obecnie najbardziej blokuje Twój biznes?</label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { id: 'brak_strony', label: 'Nie mam jeszcze strony internetowej' },
                  { id: 'wolna_strona', label: 'Wolna strona internetowa' },
                  { id: 'praca_reczna', label: 'Za dużo pracy ręcznej (potrzebuję automatyzacji)' },
                  { id: 'sklep', label: 'Potrzebuję nowoczesnego sklepu B2B/B2C' },
                  { id: 'inne', label: 'Inny problem technologiczny' }
                ].map((b) => (
                  <label 
                    key={b.id}
                    className={`cursor-pointer px-4 py-3 rounded-xl border text-sm font-light transition-all ${
                      selectedBlocker === b.label 
                        ? 'bg-orange-500/10 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(255,105,0,0.1)]' 
                        : 'bg-zinc-950 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="blocker" 
                      value={b.label} 
                      className="sr-only" 
                      required 
                      onChange={(e) => setSelectedBlocker(e.target.value)}
                      checked={selectedBlocker === b.label}
                    />
                    {b.label}
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-widest text-xs py-5 rounded-xl transition-all shadow-[0_0_30px_rgba(234,88,12,0.2)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Wysyłanie...
                </>
              ) : 'Odbierz bezpłatną wycenę na e-mail'}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}
