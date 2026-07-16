'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, TrendingDown, Zap, Bot, Search, PlugZap } from 'lucide-react';
import { pushGTMEvent } from '@/app/page';
import { fixOrphans } from '@/utils/typography';
import { TIERS_SERVICES, TIERS_ECOMMERCE } from './pricing/constants';
import PricingModal from './pricing/PricingModal';

export default function Pricing() {
  const [tierType, setTierType] = useState<'services' | 'ecommerce'>('services');
  const activeTiers = tierType === 'services' ? TIERS_SERVICES : TIERS_ECOMMERCE;

  const [selectedTier, setSelectedTier] = useState<typeof TIERS_SERVICES[0] | null>(null);

  const handleOpenModal = (tier: typeof TIERS_SERVICES[0], idx: number) => {
    pushGTMEvent(`cennik_pakiet_${idx}_klikniecie`);
    setSelectedTier(tier);
  };

  const handleCloseModal = () => {
    setSelectedTier(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center border-t border-slate-200/50">
      
      {/* Header */}
      <div className="text-center mb-16 relative z-10 w-full flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6">
          Jasne zasady. Transparentne ceny.<br />Wybierz rozwiązanie dla swojej skali.
        </h2>
        <p className="text-slate-600 font-light max-w-2xl text-lg mb-10">
          {fixOrphans(`Podane ceny to kwoty "od", ustalane na twardo przed linijką kodu. Żadnych niespodzianek na fakturze końcowej.`)}
        </p>

        {/* Cost of Inaction */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-3xl w-full bg-orange-50/30 backdrop-blur-2xl border border-orange-200/60 rounded-2xl p-6 md:p-8 text-left flex flex-col md:flex-row items-start gap-4 md:gap-6 mb-4 shadow-[0_8px_30px_rgba(234,88,12,0.06)] overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full" />
          
          <div className="relative w-10 h-10 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0 shadow-sm">
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div className="relative">
            <h3 className="text-slate-900 font-bold mb-2 md:mb-3 text-base md:text-lg tracking-tight">Ile tracisz każdego miesiąca przez wolną stronę?</h3>
            <p className="text-sm md:text-[15px] text-slate-600 leading-relaxed font-normal">
              {fixOrphans(`Jeśli z powodu braku formularza rezerwacji lub błędów technicznych rezygnuje z Ciebie zaledwie `)}<strong className="text-slate-900 font-semibold">{fixOrphans(`5 klientów w miesiącu`)}</strong>{fixOrphans(` (przy usłudze 500 zł), tracisz rocznie `)}<strong className="text-orange-600 font-bold">{fixOrphans(`30 000 zł`)}</strong>{fixOrphans(`. Moja strona eliminuje ten koszt od pierwszego dnia.`)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Tier Type Switch */}
      <div className="flex justify-center mb-12 relative z-20">
        <div className="relative flex items-center p-1 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setTierType('services')}
            className={`relative z-10 px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
              tierType === 'services' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="relative z-20">Biznes Lokalny i Usługi</span>
            {tierType === 'services' && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-slate-100 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setTierType('ecommerce')}
            className={`relative z-10 px-4 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${
              tierType === 'ecommerce' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="relative z-20">Sklep Internetowy (E-commerce)</span>
            {tierType === 'ecommerce' && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-slate-100 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="w-full max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={tierType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {activeTiers.map((tier, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            className={`relative flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300`}
          >
            <div className="p-8 pb-0">
              <div className="flex items-center gap-2.5 mt-2 mb-2">
                <div className="text-slate-400">
                  {tier.icon}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">{tier.name}</h3>
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-sm text-slate-500 font-medium">od</span>
                <span className={`text-4xl font-black tracking-tighter text-slate-900`}>
                  {tier.price}
                </span>
                <span className="text-sm text-slate-500 font-medium">zł netto</span>
              </div>

              <div className="h-px w-full bg-slate-100 mb-6" />

              <p className="text-sm text-slate-600 leading-relaxed min-h-[3.5rem] mb-6 font-light">
                {fixOrphans(tier.target)}
              </p>
            </div>

            <div className="px-8 pb-8 flex-1 flex flex-col bg-slate-50/50 mt-auto pt-6 border-t border-slate-100">
              <ul className="space-y-4 my-2 flex-1 text-sm leading-relaxed text-slate-600 font-light">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 shrink-0 mt-1 text-slate-400`} />
                    <span className="text-slate-700">
                      {typeof feat === 'string' ? fixOrphans(feat) : feat}
                    </span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleOpenModal(tier, idx)}
                className={`w-full py-4 mt-6 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-sm`}
              >
                {tier.ctaText}
              </button>
            </div>
          </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Trust & Payments Banner (CRO Optimization) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mt-8 py-6 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
            <Check className="w-6 h-6 text-emerald-500 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-slate-900 mb-0.5">Żelazna Gwarancja 7 Dni</h4>
            <p className="text-xs text-slate-500 max-w-[200px]">100% zwrotu zaliczki, jeśli wstępny projekt Ci się nie spodoba.</p>
          </div>
        </div>
        
        <div className="hidden sm:block w-px h-12 bg-slate-100" />
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
            <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-slate-900 mb-0.5">Faktura VAT 23%</h4>
            <p className="text-xs text-slate-500 max-w-[200px]">Bezpieczne przelewy bankowe. Przejrzyste rozliczenia B2B.</p>
          </div>
        </div>
      </motion.div>

      {/* Rozwiązania szyte na miarę */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-4xl mx-auto w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col gap-6 mt-16 shadow-premium-soft"
      >
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">Rozwiązania szyte na miarę</h3>
          <p className="text-lg text-orange-500 font-medium">Masz już stronę, ale potrzebujesz chirurgicznej precyzji?</p>
        </div>
        
        <p className="text-sm text-slate-600 leading-relaxed font-light">
          {fixOrphans(`Nie każdy biznes potrzebuje budowy systemu od zera. Jeśli Twoja obecna strona nie dowozi wyników, ładuje się w nieskończoność lub toniesz w ręcznej papierologii, możemy wdrożyć punktowe rozwiązania:`)}
        </p>
        
        <ul className="space-y-4">
          <li className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100 mt-0.5">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-light pt-1">
              <strong className="text-slate-900 font-medium">Ekstremalne Przyspieszenie (Core Web Vitals):</strong> {fixOrphans(`Każda dodatkowa sekunda ładowania to utrata 7% klientów. Zoptymalizuję Twój kod tak, by strona otwierała się w ułamku sekundy, co zagwarantuje Ci wyższe pozycje w Google i ucieczkę przed konkurencją.`)}
            </p>
          </li>
          <li className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 border border-violet-100 mt-0.5">
              <Bot className="w-5 h-5 text-violet-500" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-light pt-1">
              <strong className="text-slate-900 font-medium">Sama Automatyzacja i AI:</strong> {fixOrphans(`Wdrożenie chatbota AI, automatycznego umawiania spotkań lub kalkulatorów wycen do Twojej obecnej witryny.`)}
            </p>
          </li>
          <li className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
              <Search className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-light pt-1">
              <strong className="text-slate-900 font-medium">Płatny Audyt UX/SEO i Konwersji:</strong> {fixOrphans(`Twoja strona ma ruch, ale nie sprzedaje? Prześwietlę ją i wskażę dokładne błędy, przez które tracisz pieniądze (tzw. wyciekające zapytania).`)}
            </p>
          </li>
          <li className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">
              <PlugZap className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-light pt-1">
              <strong className="text-slate-900 font-medium">Zaawansowane integracje:</strong> {fixOrphans(`Połączenie Twojej strony z CRM, systemami fakturowania lub narzędziami kurierskimi.`)}
            </p>
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-200/50">
          <div className="text-center sm:text-left">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1">Wycena</p>
            <p className="text-slate-900 font-medium">Indywidualna <span className="text-slate-500 font-light text-sm">(na podstawie bezpłatnej analizy Twoich wymagań)</span></p>
          </div>
          <button 
            onClick={() => {
              pushGTMEvent('rozwiazania_szyte_na_miare_klikniecie');
              const el = document.getElementById('kontakt');
              if(el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-400 text-zinc-100 font-black uppercase tracking-widest text-[11px] rounded-xl transition-all shadow-[0_0_20px_rgba(234,88,12,0.2)]"
          >
            Prześlij wyzwanie do wyceny
          </button>
        </div>
      </motion.div>

      {/* Opcjonalna Opieka Techniczna (Retainer) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mt-8 shadow-premium-soft"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
              <span className="text-orange-500 text-sm">↻</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Opcjonalnie: Miesięczna Opieka Techniczna</h3>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl font-light">
              Po darmowym okresie gwarancyjnym zapewniam stały monitoring, automatyczne kopie zapasowe, aktualizacje zabezpieczeń i drobne zmiany tekstów na życzenie. Zrezygnujesz w dowolnej chwili bez zobowiązań.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl font-light">
              Potrzebujesz nowej funkcji? W każdej chwili możesz jednorazowo dokupić pakiet moich godzin pracy na większą rozbudowę, bez zmiany stałego abonamentu.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end shrink-0 w-full md:w-auto pt-6 md:pt-0 border-t border-slate-200 md:border-t-0">
          <div className="text-2xl font-black text-slate-900 mb-1">od 150 <span className="text-sm font-light text-slate-500 tracking-normal">zł netto / mc</span></div>
          <div className="text-xs text-orange-500/80 mb-4 font-medium">(lub 2 miesiące gratis przy płatności za rok z góry)</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono text-left md:text-right max-w-[240px] leading-relaxed">
            To równowartość jednej dobrej kolacji w restauracji, a w zamian masz święty spokój 24/7 i ochronę przed awarią.
          </div>
        </div>
      </motion.div>
      {/* Modal / Popup */}
      <PricingModal selectedTier={selectedTier} onClose={handleCloseModal} />

    </div>
  );
}
