'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Code, Briefcase, Rocket } from 'lucide-react';
import { pushGTMEvent } from '@/app/page';

const TIERS = [
  {
    name: 'WIZYTÓWKA',
    price: '2 000',
    icon: <Briefcase className="w-5 h-5" />,
    target: 'Mechanik, geodeta, fryzjer, terapeuta. Chcesz po prostu świetnie wyglądać w Google i sprawić, by klient łatwo Cię znalazł.',
    features: [
      'Indywidualny projekt graficzny (0 gotowych szablonów)',
      'Napisanie tekstów zorientowanych na sprzedaż',
      'Czas ładowania poniżej 1.5s (gwarancja wysokich pozycji w Google)',
      'Formularz kontaktowy spięty z Twoim e-mailem/telefonem',
      'Pełna zgodność z RODO i wdrożenie polityki prywatności',
      'Zaawansowane cyberbezpieczeństwo chmurowe: Twoja strona i dane klientów są w 100% odporne na ataki, a system posiada automatyczne, codzienne kopie zapasowe.',
      '6 miesięcy darmowej opieki technicznej'
    ],
    ctaText: 'Zapytaj o ten pakiet',
    highlighted: false
  },
  {
    name: 'MASZYNA SPRZEDAŻOWA',
    price: '5 000',
    icon: <Rocket className="w-5 h-5 text-orange-500" />,
    target: 'Butik, rzemiosło, wynajem aut, usługi na zapisy. Chcesz przyjmować zamówienia i płatności automatycznie, nawet gdy jesteś zajęty pracą.',
    features: [
      'Wszystko to, co w pakiecie "Wizytówka" +',
      'Ultraszybki sklep internetowy / Zautomatyzowany System Rezerwacji',
      'Podpięte natychmiastowe płatności online (BLIK, Apple Pay)',
      'Integracja z kurierami i Paczkomatami',
      'Prosty panel do zarządzania ofertą ze smartfona',
      'Gwarancja: 0% prowizji systemowych od sprzedaży (ponosisz jedynie standardowe koszty operatora płatności, np. Przelewy24/Stripe).',
      'Wideo-szkolenie: "Jak samodzielnie dodać produkt/usługę w 60 sekund"'
    ],
    ctaText: 'Wybieram ten pakiet',
    highlighted: true,
    badge: 'REKOMENDOWANY'
  },
  {
    name: 'LIDER RYNKU',
    price: '9 000',
    icon: <Star className="w-5 h-5" />,
    target: 'Kliniki, kancelarie, niszowa produkcja, firmy budowlane. Chcesz całkowicie zautomatyzować obsługę klienta, wyprzedzić konkurencję i odzyskać swój czas.',
    features: [
      'Wszystko to, co w pakiecie "Maszyna Sprzedażowa" +',
      'Wirtualny Asystent AI i Kalkulator Ofert: Inteligentne boty, które obsługują Twoich klientów 24/7 i filtrują tylko rentowne zlecenia.',
      'Automat do opinii w Google: System sam prosi zadowolonych klientów o 5 gwiazdek, budując Twój autorytet w sieci.',
      'Wsparcie w pozyskaniu dotacji: Pomagam przygotować pełną specyfikację technologiczną, jeśli ubiegasz się o dofinansowanie (np. z KPO) na cyfryzację firmy.',
      'Dedykowane szkolenie dla pracowników: Zamiast suchej instrukcji, przeprowadzę warsztaty online dla Twojego zespołu, aby płynnie i bez stresu zaczął korzystać z nowych narzędzi.',
      'Priorytetowa Opieka VIP: Otrzymujesz mój bezpośredni numer na WhatsApp i masz gwarancję reakcji na każde zgłoszenie w maksymalnie kilka godzin.'
    ],
    ctaText: 'Aplikuj o pakiet VIP',
    highlighted: false
  }
];

export default function Pricing() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center border-t border-white/5">
      
      {/* Header */}
      <div className="text-center mb-16 relative z-10 w-full flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
          Jasne zasady. Transparentne ceny.<br />Wybierz rozwiązanie dla swojej skali.
        </h2>
        <p className="text-zinc-400 font-light max-w-2xl text-lg mb-10">
          Podane ceny to kwoty &quot;od&quot;, ustalane na twardo przed linijką kodu. Żadnych niespodzianek na fakturze końcowej.
        </p>

        {/* Cost of Inaction */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl w-full bg-red-950/20 border border-red-500/20 rounded-2xl p-5 md:p-6 text-left flex items-start gap-4 md:gap-5 mb-4"
        >
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20 mt-1">
            <span className="text-red-500 font-black text-xl">!</span>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2 text-lg">Ile tracisz każdego miesiąca przez wolną stronę?</h4>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              Jeśli z powodu braku formularza rezerwacji lub błędów technicznych rezygnuje z Ciebie zaledwie <strong className="text-zinc-200">5 klientów w miesiącu</strong> (przy usłudze 500 zł), tracisz rocznie <strong className="text-red-400">30 000 zł</strong>. Moja strona eliminuje ten koszt od pierwszego dnia.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
        {TIERS.map((tier, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className={`relative flex flex-col bg-zinc-950 rounded-3xl overflow-hidden transition-all duration-300 ${
              tier.highlighted 
                ? 'border-2 border-orange-500 shadow-[0_0_40px_rgba(234,88,12,0.15)] md:scale-105 z-10' 
                : 'border border-white/10 hover:border-white/20'
            }`}
          >
            {tier.badge && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-orange-500 text-black text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-b-lg">
                {tier.badge}
              </div>
            )}

            <div className="p-8 pb-0">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${tier.highlighted ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-900 text-zinc-400'}`}>
                {tier.icon}
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white mb-2">{tier.name}</h3>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-sm text-zinc-500 font-medium">od</span>
                <span className={`text-4xl font-black tracking-tighter ${tier.highlighted ? 'text-white' : 'text-zinc-200'}`}>
                  {tier.price}
                </span>
                <span className="text-sm text-zinc-500 font-medium">zł netto</span>
              </div>

              <div className="h-px w-full bg-white/5 mb-6" />

              <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6 min-h-[80px]">
                {tier.target}
              </p>
            </div>

            <div className="px-8 pb-8 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.highlighted ? 'text-orange-500' : 'text-zinc-500'}`} />
                    <span className={`text-sm leading-relaxed ${tier.highlighted && fIdx === 0 ? 'text-white font-medium' : 'text-zinc-300'}`}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => {
                  pushGTMEvent(`cennik_pakiet_${idx}_klikniecie`);
                  const el = document.getElementById('kontakt');
                  if(el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  tier.highlighted 
                    ? 'bg-orange-500 text-black hover:bg-orange-400' 
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {tier.ctaText}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Opcjonalna Opieka Techniczna (Retainer) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-4xl mx-auto bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mt-8"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
              <span className="text-orange-500 text-sm">↻</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Opcjonalnie: Miesięczna Opieka Techniczna</h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl font-light">
              Po darmowym okresie gwarancyjnym zapewniam stały monitoring, automatyczne kopie zapasowe, aktualizacje zabezpieczeń i drobne zmiany tekstów na życzenie. Zrezygnujesz w dowolnej chwili bez zobowiązań.
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl font-light">
              Potrzebujesz nowej funkcji? W każdej chwili możesz jednorazowo dokupić pakiet moich godzin pracy na większą rozbudowę, bez zmiany stałego abonamentu.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end shrink-0 w-full md:w-auto pt-6 md:pt-0 border-t border-zinc-800 md:border-t-0">
          <div className="text-2xl font-black text-white mb-1">od 150 <span className="text-sm font-light text-zinc-500 tracking-normal">zł netto / mc</span></div>
          <div className="text-xs text-orange-500/80 mb-4 font-medium">(lub 2 miesiące gratis przy płatności za rok z góry)</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono text-left md:text-right max-w-[240px] leading-relaxed">
            To równowartość jednej dobrej kolacji w restauracji, a w zamian masz święty spokój 24/7 i ochronę przed awarią.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
