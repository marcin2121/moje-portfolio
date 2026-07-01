'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Code, Briefcase, Rocket, X, Loader2, AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react';
import { pushGTMEvent } from '@/app/page';
import { sendContactEmail } from '@/app/actions/sendContactEmail';
import { fixOrphans } from '@/utils/typography';

const TIERS_SERVICES = [
  {
    name: 'WIZYTÓWKA SPRZEDAŻOWA',
    price: '2 500',
    icon: <Briefcase className="w-5 h-5" />,
    target: 'Dla małych firm i rzemiosła. Chcesz przestać przepalać budżet na reklamy i błyskawicznie zamieniać odwiedzających w dzwoniących klientów.',
    features: [
      'Unikalny projekt graficzny (zero gotowych szablonów) budujący prestiż marki',
      'Strona zaprojektowana pod sprzedaż (układ eliminujący ucieczkę klientów)',
      'Ułożenie Twoich tekstów pod kątem lokalnego pozycjonowania w Google',
      'Gwarancja błyskawicznego ładowania (<1.5s), by nie tracić ruchu z reklam',
      'Prosty formularz kontaktowy, który sam przesyła zapytania na Twój telefon',
      'Założenie i zoptymalizowanie Wizytówki Google Maps dla lokalnego zasięgu',
      'Spokój prawny (pełna zgodność z RODO i wdrożenie polityki prywatności)',
      '6 miesięcy żelaznej gwarancji na bezawaryjne działanie kodu'
    ],
    ctaText: 'Wybieram ten pakiet',
    highlighted: false
  },
  {
    name: 'MASZYNA SPRZEDAŻOWA',
    price: '5 400',
    icon: <Rocket className="w-5 h-5 text-orange-500" />,
    target: 'Chcesz, by strona automatycznie pozyskiwała klientów i przyjmowała rezerwacje 24/7, nawet gdy obsługujesz innych.',
    features: [
      'Wszystko to, co w pakiecie "Wizytówka Sprzedażowa" +',
      'Rozbudowana struktura (np. szczegółowe opisy zabiegów, pakiety i cenniki)',
      'Napisanie profesjonalnych, sprzedażowych tekstów przez eksperta (język korzyści)',
      'Błyskawiczny, bezawaryjny system rezerwacji wizyt (zero utraconych klientów)',
      'Podpięte natychmiastowe płatności online (pobieranie zadatków, sprzedaż voucherów)',
      'Prosty panel do samodzielnej edycji cen i usług bez ryzyka zepsucia układu strony',
      'Zatrzymujesz 100% zysku z usług (0% ukrytych prowizji systemowych)',
      <>12 miesięcy opieki technicznej i Twojego pełnego <strong>świętego spokoju</strong></>
    ],
    ctaText: 'Wybieram ten pakiet',
    highlighted: true,
    badge: 'REKOMENDOWANY'
  },
  {
    name: 'LIDER RYNKU / AUTOMATYZACJA PRO',
    price: '8 900',
    icon: <Star className="w-5 h-5" />,
    target: 'Dla firm, które toną w papierologii i kalendarzach. Chcesz w pełni zautomatyzować obsługę, zdeklasować konkurencję i odzyskać swój czas.',
    features: [
      'Wszystko to, co w pakiecie "Maszyna Sprzedażowa" + Dedykowana Aplikacja Usługowa',
      'Automatyczny obieg danych (spinamy platformę z Twoim systemem rezerwacji, kalendarzem lub fakturowaniem)',
      'Twój Asystent AI 24/7 – inteligentny bot, który odciąża Cię z pytań o usługi i cennik',
      'Automat do Google Maps – system sam prosi zadowolonych klientów o 5★ po wizycie',
      'Gotowa specyfikacja techniczna pod dotacje na cyfryzację (np. z KPO)',
      'Priorytetowe Wsparcie VIP: bezpośredni kanał na WhatsApp i gwarancja reakcji w max 2h',
      'Dożywotnia Gwarancja Inżynieryjna na stabilność systemu (zero ukrytych wad)'
    ],
    ctaText: 'Aplikuj o pakiet VIP',
    highlighted: false
  }
];

const TIERS_ECOMMERCE = [
  {
    name: 'LANDING PAGE / KATALOG',
    price: '3 500',
    icon: <Briefcase className="w-5 h-5" />,
    target: 'Chcesz przetestować nowy produkt na rynku, zbierać zapytania hurtowe (B2B) lub sprzedawać jeden flagowy produkt.',
    features: [
      'Unikalny projekt graficzny (zero gotowych szablonów) budujący prestiż marki',
      'Strona zaprojektowana pod szybką sprzedaż (układ typu Long-Form)',
      'Ułożenie Twoich tekstów pod kątem skutecznego pozycjonowania w Google',
      'Gwarancja błyskawicznego ładowania (<1.5s), by nie tracić ruchu z reklam',
      'Prosty formularz zamówień/zapytań, który powiadamia Cię SMS-em lub mailem',
      'Założenie i zoptymalizowanie Wizytówki Google Maps dla Twojej firmy',
      'Spokój prawny (pełna zgodność z RODO i wdrożenie polityki prywatności)',
      '6 miesięcy żelaznej gwarancji na bezawaryjne działanie kodu'
    ],
    ctaText: 'Wybieram ten pakiet',
    highlighted: false
  },
  {
    name: 'MASZYNA SPRZEDAŻOWA',
    price: '6 400',
    icon: <Rocket className="w-5 h-5 text-orange-500" />,
    target: 'Chcesz profesjonalnego sklepu, który sprzedaje automatycznie 24/7 i nigdy nie dzieli się Twoją marżą z pośrednikami.',
    features: [
      'Wszystko to, co w pakiecie "Landing Page / Katalog" +',
      'Zbudowanie bazy do 30 produktów / wariantów gotowych do natychmiastowej sprzedaży',
      'Napisanie profesjonalnych, sprzedażowych tekstów przez eksperta (język korzyści)',
      'Błyskawiczny, bezawaryjny silnik koszyka (eliminacja porzuconych transakcji)',
      'Podpięte natychmiastowe płatności online (BLIK, Apple Pay) prosto na Twoje konto',
      'Pełna automatyzacja logistyki (Zintegrowany InPost i szybkie generowanie etykiet)',
      'Zatrzymujesz 100% marży z produktów (0% ukrytych prowizji systemowych)',
      'Prosty panel do zarządzania magazynem i cenami bez ryzyka zepsucia strony',
      <>12 miesięcy opieki technicznej i Twojego pełnego <strong>świętego spokoju</strong></>
    ],
    ctaText: 'Wybieram ten pakiet',
    highlighted: true,
    badge: 'REKOMENDOWANY'
  },
  {
    name: 'LIDER RYNKU / AUTOMATYZACJA PRO',
    price: '10 900',
    icon: <Star className="w-5 h-5" />,
    target: 'Twój sklep szybko rośnie, a Ty toniesz w paczkach. Chcesz zautomatyzować logistykę, zdeklasować konkurencję i odzyskać swój czas.',
    features: [
      'Wszystko to, co w pakiecie "Maszyna Sprzedażowa" + Sklep bez limitu asortymentu (inżynieryjny import bazy danych)',
      'Automatyczny obieg danych (spinamy sklep z systemem ERP, BaseLinkerem lub magazynem)',
      'Twój Asystent AI 24/7 – inteligentny bot doradzający klientom w wyborze produktów',
      'Automat do Google Maps – system sam prosi klientów o opinię 5★ po odebraniu paczki',
      'Gotowa specyfikacja techniczna pod dotacje na cyfryzację (np. z KPO)',
      'Priorytetowe Wsparcie VIP: bezpośredni kanał na WhatsApp i gwarancja reakcji w max 2h',
      'Dożywotnia Gwarancja Inżynieryjna na stabilność systemu (zero ukrytych wad)'
    ],
    ctaText: 'Aplikuj o pakiet VIP',
    highlighted: false
  }
];

export default function Pricing() {
  const [tierType, setTierType] = useState<'services' | 'ecommerce'>('services');
  const activeTiers = tierType === 'services' ? TIERS_SERVICES : TIERS_ECOMMERCE;

  const [selectedTier, setSelectedTier] = useState<typeof TIERS_SERVICES[0] | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenModal = (tier: typeof TIERS_SERVICES[0], idx: number) => {
    pushGTMEvent(`cennik_pakiet_${idx}_klikniecie`);
    setSelectedTier(tier);
    setStatus('idle');
    setErrorMessage('');
  };

  const handleCloseModal = () => {
    if (status === 'loading') return;
    setSelectedTier(null);
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
            <h4 className="text-slate-900 font-bold mb-2 md:mb-3 text-base md:text-lg tracking-tight">Ile tracisz każdego miesiąca przez wolną stronę?</h4>
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
            className={`relative flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-premium-soft ${
              tier.highlighted 
                ? 'border-2 border-orange-500 shadow-[0_0_40px_rgba(234,88,12,0.15)] md:scale-105 z-10' 
                : 'border border-slate-200 hover:border-orange-200'
            }`}
          >
            {tier.badge && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-b-lg">
                {tier.badge}
              </div>
            )}

            <div className="p-8 pb-0">
              <div className="flex items-center gap-2.5 mt-2 mb-2">
                <div className={tier.highlighted ? 'text-orange-500' : 'text-slate-400'}>
                  {tier.icon}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">{tier.name}</h3>
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-sm text-slate-500 font-medium">od</span>
                <span className={`text-4xl font-black tracking-tighter ${tier.highlighted ? 'text-slate-900' : 'text-slate-700'}`}>
                  {tier.price}
                </span>
                <span className="text-sm text-slate-500 font-medium">zł netto</span>
              </div>

              <div className="h-px w-full bg-slate-200 mb-6" />

              <p className="text-xs text-slate-600 leading-normal line-clamp-2 min-h-[2.5rem] mb-6">
                {fixOrphans(tier.target)}
              </p>
            </div>

            <div className="px-8 pb-8 flex-1 flex flex-col">
              <ul className="space-y-2.5 my-6 flex-1 text-sm leading-snug text-slate-600">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.highlighted ? 'text-orange-500' : 'text-slate-300'}`} />
                    <span className={tier.highlighted && fIdx === 0 ? 'text-slate-900 font-medium' : ''}>
                      {typeof feat === 'string' ? fixOrphans(feat) : feat}
                    </span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleOpenModal(tier, idx)}
                className={`w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  tier.highlighted 
                    ? 'bg-orange-500 text-white hover:bg-orange-400' 
                    : 'bg-slate-50 border border-slate-200 text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tier.ctaText}
              </button>
            </div>
          </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

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
          <li className="flex items-start gap-3">
            <span className="text-xl shrink-0">🚀</span>
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              <strong className="text-slate-900 font-medium">Ekstremalne Przyspieszenie (Core Web Vitals):</strong> {fixOrphans(`Każda dodatkowa sekunda ładowania to utrata 7% klientów. Zoptymalizuję Twój kod tak, by strona otwierała się w ułamku sekundy, co zagwarantuje Ci wyższe pozycje w Google i ucieczkę przed konkurencją.`)}
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl shrink-0">🤖</span>
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              <strong className="text-slate-900 font-medium">Sama Automatyzacja i AI:</strong> {fixOrphans(`Wdrożenie chatbota AI, automatycznego umawiania spotkań lub kalkulatorów wycen do Twojej obecnej witryny.`)}
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl shrink-0">🔍</span>
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              <strong className="text-slate-900 font-medium">Płatny Audyt UX/SEO i Konwersji:</strong> {fixOrphans(`Twoja strona ma ruch, ale nie sprzedaje? Prześwietlę ją i wskażę dokładne błędy, przez które tracisz pieniądze (tzw. wyciekające zapytania).`)}
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl shrink-0">⚙️</span>
            <p className="text-sm text-slate-600 leading-relaxed font-light">
              <strong className="text-slate-900 font-medium">Zaawansowane integracje:</strong> {fixOrphans(`Połączenie Twojej strony z CRM, systemami fakturowania lub narzędziami kurierskimi.`)}
            </p>
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-200/50">
          <div className="text-center sm:text-left">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-1">Wycena</p>
            <p className="text-slate-900 font-medium">Indywidualna <span className="text-slate-500 font-light text-sm">(na podstawie bezpłatnej, 15-minutowej konsultacji)</span></p>
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
            Porozmawiajmy o Twoim wyzwaniu
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
                      Pakiet <strong className="text-slate-900">"{selectedTier.name}"</strong> idealnie zautomatyzuje Twój biznes. Podaj e-mail, a prześlę Ci darmową wycenę wdrożenia i plan działania.
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

    </div>
  );
}
