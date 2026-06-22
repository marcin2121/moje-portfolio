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
            Zostaw swój numer. Zadzwonię do Ciebie w ciągu 3 godzin roboczych, zadam 4 proste pytania o Twój biznes i od razu podam wstępną ramę cenową.
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
            <p className="text-zinc-400 font-light">Spodziewaj się mojego telefonu w ciągu najbliższych 3 godzin roboczych.</p>
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
              <label htmlFor="phone" className="text-xs font-mono tracking-widest text-zinc-400 uppercase">Numer telefonu</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                required 
                placeholder="+48 000 000 000"
                className="w-full bg-zinc-950 border border-white/5 focus:border-orange-500/50 outline-none rounded-xl px-5 py-4 text-white font-light transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="industry" className="text-xs font-mono tracking-widest text-zinc-400 uppercase">Czym zajmuje się firma? (np. Warsztat / Piekarnia)</label>
              <input 
                type="text" 
                id="industry" 
                name="industry" 
                required 
                placeholder="Mechanika pojazdowa..."
                className="w-full bg-zinc-950 border border-white/5 focus:border-orange-500/50 outline-none rounded-xl px-5 py-4 text-white font-light transition-all placeholder:text-zinc-700"
              />
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
              ) : 'Zamawiam bezpłatną wycenę'}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}
