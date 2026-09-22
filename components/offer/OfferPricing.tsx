"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MessageSquare, Send, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import Pricing from '@/components/Pricing';
import { ClientOffer } from '@/data/offers';
import { fixOrphans } from '@/utils/typography';

interface OfferPricingProps {
  packages: ClientOffer['packages'];
  companyName: string;
  slug?: string;
}

export default function OfferPricing({ packages, companyName, slug = 'oferta' }: OfferPricingProps) {
  const [showGeneralOffer, setShowGeneralOffer] = useState(false);
  
  // Stan modala akceptacji
  const [selectedPkgForAccept, setSelectedPkgForAccept] = useState<{ name: string; price: string } | null>(null);
  const [acceptFormData, setAcceptFormData] = useState({ clientName: '', email: '', phone: '', comment: '' });
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptedTier, setAcceptedTier] = useState<string | null>(null);

  // Stan formularza pytania
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({ clientName: '', email: '', phone: '', question: '' });
  const [isSendingQuestion, setIsSendingQuestion] = useState(false);
  const [questionSent, setQuestionSent] = useState(false);

  const handleOpenAcceptModal = (pkgName: string, price: string) => {
    // Śledzenie kliknięcia w Umami
    if (typeof window !== 'undefined' && 'umami' in window) {
      const pkgSlug = pkgName.toLowerCase().replace(/\s+/g, '_');
      (window as unknown as { umami: { track: (name: string) => void } }).umami.track(`oferta_click_tier_${pkgSlug}`);
    }
    setSelectedPkgForAccept({ name: pkgName, price });
  };

  const handleConfirmAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkgForAccept) return;

    setIsAccepting(true);
    try {
      const res = await fetch('/api/accept-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          packageName: selectedPkgForAccept.name,
          price: selectedPkgForAccept.price,
          slug,
          clientName: acceptFormData.clientName,
          email: acceptFormData.email,
          phone: acceptFormData.phone,
          comment: acceptFormData.comment
        })
      });

      if (res.ok) {
        setAcceptedTier(selectedPkgForAccept.name);
        setSelectedPkgForAccept(null);
      }
    } catch (err) {
      console.error('Błąd akceptacji oferty:', err);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionFormData.email || !questionFormData.question) return;

    setIsSendingQuestion(true);
    try {
      const res = await fetch('/api/oferta/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'question',
          slug,
          companyName,
          clientName: questionFormData.clientName || 'Klient',
          email: questionFormData.email,
          phone: questionFormData.phone,
          section: 'pricing',
          question: questionFormData.question
        })
      });

      if (res.ok) {
        setQuestionSent(true);
      }
    } catch (err) {
      console.error('Błąd wysyłki pytania:', err);
    } finally {
      setIsSendingQuestion(false);
    }
  };

  return (
    <>
      <section 
        id="pricing" 
        data-section="pricing" 
        className="py-24 px-4 relative overflow-hidden bg-black"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="text-xs font-mono tracking-[0.25em] text-orange-400 uppercase mb-3">
              Inwestycja i Warianty Współpracy
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Dedykowana Wycena
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              {fixOrphans('Wybierz wariant współpracy, który najlepiej odpowiada Twojemu obecnemu budżetowi i apetytowi na rozwój.')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {packages.map((pkg, idx) => {
              const isAccepted = acceptedTier === pkg.name;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative p-8 rounded-[32px] border flex flex-col h-full ${
                    pkg.highlighted 
                      ? 'bg-zinc-900/80 border-orange-500/40 shadow-[0_20px_50px_rgba(249,115,22,0.06)]' 
                      : 'bg-zinc-900/50 border-white/10'
                  }`}
                >
                  {pkg.badge && (
                    <div className="mb-4">
                      <span className="text-xs font-mono tracking-wider uppercase text-orange-400 bg-orange-400/10 px-3 py-1 rounded-md border border-orange-400/20">
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{fixOrphans(pkg.target)}</p>
                  </div>

                  <div className="mb-8">
                    {pkg.originalPrice && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg text-zinc-500 line-through">{pkg.originalPrice} zł</span>
                        {pkg.discountBadge && (
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-md border border-emerald-400/20">
                            {pkg.discountBadge}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white tracking-tight">{pkg.price}</span>
                      <span className="text-zinc-500">zł netto</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10 flex-grow">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-zinc-300 text-sm">
                        <Check className="shrink-0 mt-0.5 text-zinc-500" size={18} />
                        <span className="leading-relaxed">{fixOrphans(feature)}</span>
                      </li>
                    ))}
                  </ul>

                  {isAccepted ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm leading-relaxed">
                      <div className="flex items-center gap-2 font-bold mb-1 text-emerald-300">
                        <CheckCircle2 size={18} />
                        Pakiet zaakceptowany
                      </div>
                      <p className="text-zinc-300 text-xs">
                        Dziękuję! Zgłoszenie zostało zarejestrowane. Przygotowuję umowę i odezwę się do Ciebie w ciągu kilku godzin.
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenAcceptModal(pkg.name, pkg.price)}
                      className={`w-full py-4 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                        pkg.highlighted
                          ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_10px_25px_rgba(249,115,22,0.25)]'
                          : 'bg-white text-black hover:bg-zinc-200'
                      }`}
                    >
                      {pkg.ctaText}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Sekcja pomocnicza: Pytania do oferty */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/10 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Masz pytania lub chcesz dopasować zakres prac?</p>
                  <p className="text-zinc-400 text-xs">Skontaktuj się ze mną bezpośrednio przed podjęciem decyzji.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowQuestionModal(true);
                  setQuestionSent(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold tracking-wide transition-all duration-200 border border-white/10"
              >
                Zadaj pytanie do oferty
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 relative z-20">
            <button 
              onClick={() => setShowGeneralOffer(!showGeneralOffer)}
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-zinc-900 border border-orange-500/30 text-zinc-200 font-medium hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.1)] hover:shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:-translate-y-0.5"
            >
              {showGeneralOffer ? 'Ukryj ogólną ofertę' : 'Zobacz ogólną ofertę'}
            </button>
            <Link 
              href="/"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-transparent border border-white/10 text-zinc-400 font-medium hover:bg-zinc-900 hover:text-white transition-all duration-300"
            >
              Strona główna
            </Link>
          </div>
        </div>
      </section>

      {/* Modal Akceptacji Pakietu */}
      <AnimatePresence>
        {selectedPkgForAccept && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg p-8 rounded-3xl bg-zinc-900 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
            >
              <button
                onClick={() => setSelectedPkgForAccept(null)}
                className="absolute top-6 right-6 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-2">
                Potwierdzenie wyboru pakietu
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {selectedPkgForAccept.name}
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                Wartość wdrożenia: <span className="text-white font-bold">{selectedPkgForAccept.price} zł netto</span> dla {companyName}
              </p>

              <form onSubmit={handleConfirmAccept} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Imię i nazwisko osoby zlecającej *
                  </label>
                  <input
                    type="text"
                    required
                    value={acceptFormData.clientName}
                    onChange={(e) => setAcceptFormData({ ...acceptFormData, clientName: e.target.value })}
                    placeholder="np. Jan Kowalski"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Firmowy adres e-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={acceptFormData.email}
                    onChange={(e) => setAcceptFormData({ ...acceptFormData, email: e.target.value })}
                    placeholder="kontakt@twojafirma.pl"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Numer telefonu (opcjonalnie)
                  </label>
                  <input
                    type="tel"
                    value={acceptFormData.phone}
                    onChange={(e) => setAcceptFormData({ ...acceptFormData, phone: e.target.value })}
                    placeholder="+48 500 000 000"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Preferowany termin startu / uwagi (opcjonalnie)
                  </label>
                  <textarea
                    rows={2}
                    value={acceptFormData.comment}
                    onChange={(e) => setAcceptFormData({ ...acceptFormData, comment: e.target.value })}
                    placeholder="np. Start w przyszłym tygodniu, zależy nam na terminie..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAccepting}
                    className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(16,185,129,0.25)]"
                  >
                    {isAccepting ? 'Rejestrowanie zgłoszenia...' : 'Potwierdzam akceptację pakietu'}
                  </button>
                  <p className="text-[11px] text-zinc-500 text-center mt-3">
                    Bezpieczne zgłoszenie. Po potwierdzeniu Marcin Molenda skontaktuje się w celu formalizacji umowy.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Zadawania Pytania */}
      <AnimatePresence>
        {showQuestionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg p-8 rounded-3xl bg-zinc-900 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
            >
              <button
                onClick={() => setShowQuestionModal(false)}
                className="absolute top-6 right-6 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-xs font-mono tracking-widest text-orange-400 uppercase mb-2">
                Kontakt z inżynierem
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Zadaj pytanie do oferty
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                Chcesz zmodyfikować zakres, podzielić płatność na etapy lub dopytać o technologię? Odpowiem bezpośrednio.
              </p>

              {questionSent ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">Pytanie zostało wysłane!</h4>
                  <p className="text-zinc-300 text-sm">
                    Dziękuję za wiadomość. Odpowiedź otrzymasz na podany adres e-mail najszybciej jak to możliwe.
                  </p>
                  <button
                    onClick={() => setShowQuestionModal(false)}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors"
                  >
                    Zamknij okno
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendQuestion} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase tracking-wider">
                        Twoje imię
                      </label>
                      <input
                        type="text"
                        value={questionFormData.clientName}
                        onChange={(e) => setQuestionFormData({ ...questionFormData, clientName: e.target.value })}
                        placeholder="Jan"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase tracking-wider">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={questionFormData.phone}
                        onChange={(e) => setQuestionFormData({ ...questionFormData, phone: e.target.value })}
                        placeholder="+48..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase tracking-wider">
                      Adres e-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={questionFormData.email}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, email: e.target.value })}
                      placeholder="kontakt@twojafirma.pl"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1 uppercase tracking-wider">
                      Treść pytania / uwagi *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={questionFormData.question}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, question: e.target.value })}
                      placeholder="Co chciałbyś doprecyzować w ofercie?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSendingQuestion}
                      className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(249,115,22,0.25)]"
                    >
                      <Send size={16} />
                      {isSendingQuestion ? 'Wysyłanie...' : 'Wyślij zapytanie'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showGeneralOffer && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-white/10 bg-black"
        >
          <Pricing />
        </motion.div>
      )}
    </>
  );
}
