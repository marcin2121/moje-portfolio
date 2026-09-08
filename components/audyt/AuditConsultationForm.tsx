'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Phone, Mail } from 'lucide-react';

interface AuditConsultationFormProps {
  domain: string;
  token?: string;
}

export default function AuditConsultationForm({ domain, token }: AuditConsultationFormProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Podaj poprawny adres e-mail');
      return;
    }

    if (!phone || phone.trim().length < 7) {
      setErrorMessage('Podaj poprawny numer telefonu (min. 7 cyfr)');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/audit-master/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          token,
          email,
          phone,
          notes
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas wysyłania');
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Wystąpił błąd. Spróbuj ponownie.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)] mb-12">
      {/* Subtelny ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl relative z-10">
        <span className="text-orange-400 font-mono text-xs uppercase tracking-widest font-semibold block mb-3">
          Konsultacja Inżynieryjna 1-na-1
        </span>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
          Chcesz omówić wyniki audytu dla {domain}?
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Przejdźmy wspólnie przez wąskie gardła w kodzie. Na bezpłatnej 15-minutowej rozmowie inżynieryjnej pokażę Ci czarno na białym, jak zabezpieczyć budżet reklamowy przed przepalaniem, odblokować telemetrykę zdarzeń i wdrożyć 3 kluczowe poprawki w kodzie bez burzenia obecnej strony.
        </p>

        {isSuccess ? (
          <div className="bg-white/10 border border-emerald-500/40 rounded-2xl p-6 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-base mb-1">
                Zgłoszenie przyjęte pomyślnie!
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Dziękuję! Skontaktuję się z Tobą telefonicznie lub mailowo w ciągu 24 godzin, aby ustalić dogodny termin 15-minutowej konsultacji technicznej.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Adres e-mail <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj-email@firma.pl"
                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 font-mono transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Numer telefonu <span className="text-orange-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="np. +48 501 234 567"
                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 font-mono transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Komentarz / cel biznesowy (opcjonalnie)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="np. chcemy naprawić śledzenie konwersji, poprawić pozycje w Google, usunąć dług techniczny"
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(249,115,22,0.3)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Wysyłanie zgłoszenia...
                </>
              ) : (
                <>
                  <span>Umów 15-minutową konsultację z Marcinem</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-500 font-mono">
              Bez zobowiązań. Rozmawiasz bezpośrednio z Senior Full-Stack Architectem, a nie z agencją marketingową.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
