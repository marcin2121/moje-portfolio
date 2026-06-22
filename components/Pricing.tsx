'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Code, Briefcase, Rocket } from 'lucide-react';
import { pushGTMEvent } from '@/app/page';

const TIERS = [
  {
    name: 'WIZYTÓWKA',
    price: '2 500',
    icon: <Briefcase className="w-5 h-5" />,
    target: 'Mechanik, geodeta, fryzjer, terapeuta. Chcesz po prostu świetnie wyglądać w Google i sprawić, by klient łatwo Cię znalazł.',
    features: [
      'Indywidualny projekt graficzny (0 gotowych szablonów)',
      'Napisanie tekstów zorientowanych na sprzedaż',
      'Czas ładowania poniżej 1.5s (gwarancja wysokich pozycji w Google)',
      'Formularz kontaktowy spięty z Twoim e-mailem/telefonem',
      'Pełna zgodność z RODO i wdrożenie polityki prywatności',
      '6 miesięcy darmowej opieki technicznej'
    ],
    ctaText: 'Zapytaj o ten pakiet',
    highlighted: false
  },
  {
    name: 'MASZYNA SPRZEDAŻOWA',
    price: '5 500',
    icon: <Rocket className="w-5 h-5 text-orange-500" />,
    target: 'Butik, rzemiosło, wynajem aut, usługi na zapisy. Chcesz przyjmować zamówienia i płatności automatycznie, nawet o 2:00 w nocy.',
    features: [
      'Wszystko to, co w pakiecie "Wizytówka" +',
      'Ultraszybki sklep internetowy / System rezerwacji',
      'Podpięte natychmiastowe płatności (BLIK, Apple Pay, Przelewy24)',
      'Automatyczne generowanie etykiet do Paczkomatów i kurierów',
      'Prosty panel do zarządzania magazynem i promocjami',
      'Gwarancja: 0% prowizji od sprzedaży (cały zysk zostaje u Ciebie)',
      'Wideo-szkolenie: "Jak dodać nowy produkt w 60 sekund"'
    ],
    ctaText: 'Wybieram ten pakiet',
    highlighted: true,
    badge: 'NAJCZĘSTSZY WYBÓR'
  },
  {
    name: 'AUTOMATYZACJA PRO',
    price: '9 500',
    icon: <Code className="w-5 h-5" />,
    target: 'Biura rachunkowe, małe hurtownie, niszowa produkcja. Toniesz w papierach, a Twoi ludzie robią w kółko to samo w Excelu.',
    features: [
      'Dedykowana aplikacja napisana ściśle pod Twój proces',
      'Integracja Twojego CRM z fakturowaniem, mailem i kalendarzami',
      'Automatyczne powiadomienia SMS dla Twoich klientów i pracowników',
      'Gwarancja SLA (Czas reakcji na krytyczną usterkę: do 4 godzin)',
      'Przekazanie pełnych, nieograniczonych praw do kodu źródłowego'
    ],
    ctaText: 'Porozmawiajmy o automatyzacji',
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
          Podane ceny to kwoty "od", ustalane na twardo przed linijką kodu. Żadnych niespodzianek na fakturze końcowej.
        </p>
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
    </div>
  );
}
