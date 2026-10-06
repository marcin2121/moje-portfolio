'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Phone, Mail, Search, Wrench, Sparkles } from 'lucide-react';
import { SiteType, SITE_TYPE_LABELS } from '@/app/api/audit-master/types';
import { trackLeadConversion } from '@/lib/telemetry';

export type ConsultationIntent = 'audit' | 'fixes' | 'both';

interface AuditConsultationFormProps {
  domain: string;
  token?: string;
  siteType?: SiteType;
  overallScore?: number;
}

interface IntentOption {
  id: ConsultationIntent;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  ctaText: string;
}

export default function AuditConsultationForm({
  domain,
  token,
  siteType = 'services',
  overallScore
}: AuditConsultationFormProps) {
  const isEcommerce = siteType === 'ecommerce';
  const isPerfect = (overallScore ?? 0) >= 100;
  const [intent, setIntent] = useState<ConsultationIntent>('both');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const intentOptions: IntentOption[] = [
    {
      id: 'audit',
      title: 'Chcę pełny audyt',
      subtitle: 'Głęboka analiza wszystkich podstron i konwersji',
      icon: <Search className="w-4 h-4" />,
      ctaText: 'Zamów pełny audyt serwisu'
    },
    {
      id: 'fixes',
      title: 'Chcę wdrożyć poprawki',
      subtitle: 'Bezpośrednia eliminacja usterek z tego raportu',
      icon: <Wrench className="w-4 h-4" />,
      ctaText: 'Zleć wdrożenie poprawek'
    },
    {
      id: 'both',
      title: 'Audyt + wdrożenie',
      subtitle: 'Kompleksowy pakiet: audyt całej witryny i naprawa',
      icon: <Sparkles className="w-4 h-4" />,
      ctaText: 'Skonsultuj audyt i wdrożenie'
    }
  ];

  const currentOption = intentOptions.find((o) => o.id === intent) || intentOptions[2];

  // Reakcja na kliknięcie przycisków "Skonsultuj rozwiązanie" w rejestrze kontrolnym
  useEffect(() => {
    const handleSelectTopic = (event: Event) => {
      const customEvent = event as CustomEvent<{ topic?: string; intent?: ConsultationIntent }>;
      if (customEvent.detail?.intent) {
        setIntent(customEvent.detail.intent);
      } else if (customEvent.detail?.topic) {
        setIntent('fixes');
        setNotes(`Konsultacja punktu: ${customEvent.detail.topic}`);
      }
      setTimeout(() => {
        const emailInput = document.getElementById('consultation-email');
        if (emailInput) {
          emailInput.focus();
        }
      }, 300);
    };

    window.addEventListener('select-consultation-topic', handleSelectTopic);
    return () => {
      window.removeEventListener('select-consultation-topic', handleSelectTopic);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Podaj poprawny adres e-mail');
      return;
    }

    if (phone && phone.trim().length > 0 && phone.trim().length < 6) {
      setErrorMessage('Podaj poprawny numer telefonu (min. 6 cyfr) lub pozostaw to pole puste');
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
          phone: phone ? phone.trim() : undefined,
          notes,
          intent
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas wysyłania');
      }

      setIsSuccess(true);

      // Śledzenie konwersji Google Ads (Makrokonwersja: Lead / Usługa)
      trackLeadConversion({
        domain,
        intent,
        email,
        phone: phone ? phone.trim() : undefined,
        token,
        notes: notes ? notes.trim() : undefined,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Wystąpił błąd. Spróbuj ponownie.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const profileLabel = SITE_TYPE_LABELS[siteType] || (isEcommerce ? 'Sklep E-commerce' : 'Usługi / B2B');

  // Dynamiczne nagłówki zależne od wybranego intentu
  const headingText = isPerfect
    ? `Twój serwis osiągnął 100/100! Szukasz wsparcia przy rozwoju ${domain}?`
    : intent === 'audit'
    ? `Chcesz zamówić pełny audyt dla ${domain}?`
    : intent === 'fixes'
    ? `Chcesz wdrożyć poprawki z audytu dla ${domain}?`
    : `Chcesz pełny audyt i wdrożenie poprawek dla ${domain}?`;

  const descriptionText = isPerfect
    ? 'Napisz do mnie, jeśli planujesz rozbudowę serwisu o nowe moduły, zaawansowane integracje API lub dedykowane aplikacje webowe. Pomogę Ci utrzymać najwyższy standard inżynieryjny i szybkość działania przy skalowaniu platformy.'
    : intent === 'audit'
    ? 'Zbadam wszystkie podstrony serwisu, strukturę koszyka, szybkość ładowania oraz architekturę SEO i przygotuję dla Ciebie wyczerpujący raport inżynieryjny z konkretną listą zaleceń.'
    : intent === 'both'
    ? 'Przeprowadzę głęboki audyt wielopodstronicowy całego serwisu oraz bezpośrednio wdrożę niezbędne poprawki w kodzie, szybkości i SEO, gwarantując najwyższy standard inżynieryjny.'
    : siteType === 'gov_public' || siteType === 'education'
    ? 'Przeanalizuję usterki z raportu i wskażę, jak spełnić wymagania prawne WCAG 2.1 AA (Deklaracja Dostępności), zabezpieczyć formularze przed botami i wdrożyć kluczowe poprawki w architekturze bez kosztownej przebudowy.'
    : siteType === 'ngo_foundation'
    ? 'Przeanalizuję usterki z raportu i wskażę, jak zabezpieczyć formularze przed spamem, ułatwić darczyńcom wpłaty i poprawić widoczność w Google.'
    : isEcommerce
    ? 'Przeanalizuję usterki wykryte w kodzie sklepu, poprawność telemetryki zdarzeń oraz przygotuję mailowo plan optymalizacji wydajności i konwersji bez burzenia obecnej witryny.'
    : 'Przeanalizuję usterki z raportu, potencjał optymalizacji kodu oraz przygotuję dla Ciebie mailowo konkretny plan wdrożenia kluczowych poprawek bez burzenia obecnej witryny.';

  return (
    <div id="consultation-form" className="mt-16 scroll-mt-28 bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
      {/* Subtelny ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl relative z-10">
        <span className="text-orange-400 font-mono text-xs uppercase tracking-widest font-semibold block mb-3">
          {isPerfect
            ? `Konsultacja architektoniczna i rozwój · ${profileLabel}`
            : intent === 'audit'
            ? `Pełny audyt techniczny · ${profileLabel}`
            : intent === 'fixes'
            ? `Konsultacja techniczna i wdrożenie · ${profileLabel}`
            : `Kompleksowy pakiet inżynieryjny · ${profileLabel}`}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
          {headingText}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {descriptionText}
        </p>

        {/* Trzystopniowy selektor wyboru zakresu */}
        {!isSuccess && (
          <div className="mb-6">
            <label className="block text-xs font-mono text-slate-400 mb-2.5">
              Wybierz zakres współpracy:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {intentOptions.map((opt) => {
                const isSelected = intent === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIntent(opt.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-orange-500/15 border-orange-500 text-white shadow-[0_4px_25px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/60'
                        : 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-700/60 text-slate-400'
                        }`}
                      >
                        {opt.icon}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white tracking-tight mb-1">
                        {opt.title}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-snug">
                        {opt.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isSuccess ? (
          <div className="bg-white/10 border border-emerald-500/40 rounded-2xl p-6 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-base mb-1">
                Zapytanie wysłane pomyślnie!
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {isPerfect
                  ? 'Dziękuję za kontakt. Odpowiem na Twój adres e-mail z propozycją współpracy przy rozwoju i skalowaniu Twojej platformy.'
                  : `Dziękuję za kontakt. Przeanalizuję zgłoszenie i odpowiem na Twój adres e-mail z konkretnymi wskazówkami technicznymi oraz propozycją dla opcji: ${currentOption.title.toLowerCase()}.`}
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
                    id="consultation-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj@email.pl"
                    className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500 font-mono transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Numer telefonu (opcjonalnie)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="consultation-phone"
                    type="tel"
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
                id="consultation-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  isPerfect
                    ? 'np. chcemy wdrożyć nowy moduł, zintegrować system CRM/ERP lub zoptymalizować procesy'
                    : intent === 'audit'
                    ? 'np. chcemy pełny audyt wszystkich podstron, koszyka i ścieżek konwersji przed startem kampanii'
                    : intent === 'fixes'
                    ? (isEcommerce
                      ? 'np. chcemy naprawić śledzenie koszyka (add_to_cart), przyspieszyć sklep, obniżyć porzucenia koszyka'
                      : 'np. chcemy naprawić błędy SEO z audytu, dodać Schema.org i przyspieszyć ładowanie')
                    : 'np. chcemy pełny audyt całego serwisu oraz wdrożenie napraw wykrytych usterek w kodzie'
                }
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
                  Wysyłanie zapytania...
                </>
              ) : (
                <>
                  <span>{isPerfect ? 'Napisz w sprawie rozwoju' : currentOption.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-500 font-mono">
              Bez zobowiązań. Odpisuję osobiście z konkretnymi wskazówkami inżynieryjnymi - bez handlowców i spamu.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
