'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sendContactEmail } from '@/app/actions/sendContactEmail';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { pushGTMEvent } from '@/app/page';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

            <div className="flex flex-col gap-2">
              <label htmlFor="blocker" className="text-xs font-mono tracking-widest text-zinc-400 uppercase">Co obecnie najbardziej blokuje Twój biznes?</label>
              <div className="relative">
                <select 
                  id="blocker" 
                  name="blocker" 
                  required 
                  defaultValue=""
                  className="w-full appearance-none bg-zinc-950 border border-white/5 focus:border-orange-500/50 outline-none rounded-xl px-5 py-4 text-white font-light transition-all placeholder:text-zinc-700"
                >
                  <option value="" disabled className="text-zinc-700">Wybierz główny problem...</option>
                  <option value="Wolna strona" className="bg-zinc-900 text-white">Wolna strona internetowa</option>
                  <option value="Za dużo pracy ręcznej" className="bg-zinc-900 text-white">Za dużo pracy ręcznej (potrzebuję automatyzacji)</option>
                  <option value="Potrzebuję sklepu" className="bg-zinc-900 text-white">Potrzebuję nowoczesnego sklepu B2B/B2C</option>
                  <option value="Inne" className="bg-zinc-900 text-white">Inny problem technologiczny</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-zinc-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
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
