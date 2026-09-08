'use client';

import React, { useState } from 'react';
import { useQueryStates, parseAsInteger, parseAsFloat } from 'nuqs';
import Link from 'next/link';
import { calculateNextJsMigrationROI, MigrationCalculatorState, CalculatorSchemaGEO } from '@/types';
import { GEOSchemaInjector } from '@/components/ui/GEOSchemaInjector';
import { motion } from 'framer-motion';
import { useFrictionTelemetry } from '@/hooks/useFrictionTelemetry';

const formatPLN = (val: number) => 
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })
    .format(val);

export function CalculatorClient() {
  const [inputs, setInputs] = useQueryStates({
    monthlyTraffic: parseAsInteger.withDefault(50000),
    averageOrderValue: parseAsInteger.withDefault(250),
    conversionRate: parseAsFloat.withDefault(1.2),
    currentLoadTimeSeconds: parseAsFloat.withDefault(4.5)
  }, { history: 'replace', shallow: true });

  const [sessionId] = useState(() => 'calc_session_' + Date.now());
  const { trackSliderInteraction } = useFrictionTelemetry(sessionId, 'desktop');

  const outputs = React.useMemo(() => calculateNextJsMigrationROI(inputs), [inputs]);

  const schema: CalculatorSchemaGEO = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kalkulator ROI Migracji do Next.js",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "Oblicz prognozowane utracone przychody z powodu technicznego tarcia i oszacuj ROI z migracji do statycznej architektury Next.js.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PLN"
    },
    featureList: ["TTFB friction analysis", "Next.js ROI estimation", "Conversion uplift prediction"]
  };

  return (
    <div className="w-full space-y-12">
      <GEOSchemaInjector schema={schema} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolumna parametrów */}
        <motion.div 
          whileHover={{ y: -4 }} 
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/60 space-y-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Parametry Twojego Sklepu</h2>
          
          <div className="space-y-6">
            <InputField 
              label="Miesięczny Ruch (Liczba sesji)" 
              value={inputs.monthlyTraffic} 
              onChange={(v) => { trackSliderInteraction(); setInputs({...inputs, monthlyTraffic: v}); }} 
              min={100} max={1000000000} sliderMax={1000000} step={100}
            />
            <InputField 
              label="Średnia Wartość Zamówienia (AOV w PLN)" 
              value={inputs.averageOrderValue} 
              onChange={(v) => { trackSliderInteraction(); setInputs({...inputs, averageOrderValue: v}); }} 
              min={10} max={2000} step={10}
            />
            <InputField 
              label="Współczynnik Konwersji (%)" 
              value={inputs.conversionRate || 1.2} 
              onChange={(v) => { trackSliderInteraction(); setInputs({...inputs, conversionRate: v}); }} 
              step={0.1} min={0.1} max={100}
            />
            <InputField 
              label="Obecny Czas Ładowania na Telefonach (Sekundy)" 
              value={inputs.currentLoadTimeSeconds} 
              onChange={(v) => { trackSliderInteraction(); setInputs({...inputs, currentLoadTimeSeconds: v}); }} 
              step={0.1} min={1} max={10}
            />
          </div>
        </motion.div>

        {/* Kolumna wyników */}
        <motion.div 
          whileHover={{ y: -4 }} 
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="lg:col-span-7 bg-white text-slate-900 p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] space-y-10 flex flex-col justify-center border border-slate-200/60 relative overflow-hidden h-full"
        >
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[30rem] h-[30rem] bg-gradient-to-br from-orange-400/10 to-rose-400/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 w-full">
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest font-bold mb-3">Prognozowana Utrata Przychodów (Miesięcznie)</p>
            <p className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-orange-500 to-rose-600 pb-2 w-full break-normal">
              {formatPLN(outputs.projectedRevenueLostPerMonth)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100 relative z-10">
            <div>
              <p className="text-slate-500 text-xs font-mono font-medium mb-1">Docelowy Czas z Next.js</p>
              <p className="text-3xl font-bold text-emerald-600 tracking-tight">{outputs.estimatedNextJsLoadTime}s</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-mono font-medium mb-1">Prognozowany Wzrost Konwersji</p>
              <p className="text-3xl font-bold text-orange-600 tracking-tight">+{outputs.estimatedConversionUplift.toFixed(1)}%</p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 relative z-10 w-full">
            <p className="text-slate-500 text-xs font-mono font-medium mb-2">Szacowany 12-miesięczny ROI z migracji</p>
            <p className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4 w-full break-normal">
              {formatPLN(outputs.estimatedROI)}
            </p>
            {outputs.estimatedROI >= 15000 ? (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  Koszt wdrożenia architektury Edge-first to zaledwie <span className="text-slate-900 font-black px-1">~{((5000 / outputs.estimatedROI) * 100).toFixed(0)}%</span> tej kwoty (od 5 000 zł). <br/>
                  Inwestycja zwróci się w postaci wyższej konwersji średnio w <span className="text-orange-600 font-black px-1">{Math.ceil(5000 / (outputs.estimatedROI / 365))} dni</span>.
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-600 font-medium leading-relaxed mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                Przy tym wolumenie pełna migracja może nie być opłacalna. Rekomendujemy punktową mikro-optymalizację obecnego sklepu. 
                <Link href="/#kontakt" className="text-orange-600 font-bold hover:text-orange-500 ml-1 inline-block">Zapytaj o mikro-akcelerację →</Link>
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {outputs.estimatedROI >= 15000 ? (
        <LeadCaptureBanner projectedRevenueLost={outputs.projectedRevenueLostPerMonth} inputs={inputs} outputs={outputs} />
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full blur-[80px] pointer-events-none" />
          
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight relative z-10">Twój obecny wolumen nie wymaga pełnej architektury Edge</h3>
          <p className="text-slate-600 text-lg max-w-2xl relative z-10 font-light leading-relaxed">
            Szukasz punktowych oszczędności serwerowych lub przyspieszenia ładowania przy mniejszym ruchu? 
            Pomożemy Ci zoptymalizować obecny stos IT bez kosztownych migracji.
          </p>
          
          <Link 
            href="/#kontakt" 
            className="mt-4 inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-sm relative z-10 group text-sm"
          >
            Skonsultuj swój stos IT za darmo
            <svg className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, step = 1, min = 0, max = 100000, sliderMax }: { label: string, value: number, onChange: (v: number) => void, step?: number, min?: number, max?: number, sliderMax?: number }) {
  const [localVal, setLocalVal] = useState(value.toString());

  React.useEffect(() => {
    setLocalVal(value.toString());
  }, [value]);

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-sm font-bold text-slate-900">{label}</label>
      <input 
        type="number"
        step={step}
        min={min}
        max={max}
        value={localVal}
        onChange={(e) => {
          setLocalVal(e.target.value);
          const parsed = parseFloat(e.target.value);
          if (!isNaN(parsed)) {
            onChange(parsed);
          }
        }}
        onBlur={() => {
          const parsed = parseFloat(localVal);
          if (!isNaN(parsed)) {
            const clamped = Math.max(min, Math.min(max, parsed));
            setLocalVal(clamped.toString());
            onChange(clamped);
          } else {
            setLocalVal(value.toString());
          }
        }}
        className="w-full px-4 py-3 bg-slate-50 text-slate-900 border border-slate-200/80 rounded-2xl shadow-inner focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all outline-none font-medium"
      />
      <input 
        type="range"
        min={min}
        max={sliderMax ?? max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
      />
    </div>
  );
}

function LeadCaptureBanner({ projectedRevenueLost, inputs, outputs }: { projectedRevenueLost: number, inputs: MigrationCalculatorState, outputs: ReturnType<typeof calculateNextJsMigrationROI> }) {
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    try {
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, url, projectedRevenueLost, inputs, outputs })
      });
      if (res.ok) setStatus('success');
      else setStatus('idle');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 bg-white border border-slate-200/70 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-8 md:p-12 flex flex-col gap-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/5 to-rose-400/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="w-full relative z-10">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Chcesz przedstawić te wyliczenia swojemu Zarządowi lub Inwestorom?</h3>
        <p className="text-slate-600 text-base md:text-lg font-light leading-relaxed">Wygenerujemy dla Ciebie profesjonalny raport inżynieryjny w PDF, który prześlemy prosto na Twoją skrzynkę e-mail.</p>
      </div>
      
      {status === 'success' ? (
        <div className="bg-emerald-50 text-emerald-800 px-6 py-4 rounded-2xl font-medium border border-emerald-200 w-full text-center relative z-10 shadow-sm font-mono text-sm">
          ✓ Raport został wysłany. Sprawdź swoją skrzynkę odbiorczą.
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3 relative z-10">
          <form onSubmit={handleSubmit} className="w-full flex flex-col md:flex-row gap-4">
            <input 
              type="text"
              placeholder="Adres sklepu (opcjonalnie)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-5 py-3.5 bg-slate-50 text-slate-900 border border-slate-200 shadow-inner rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all outline-none font-mono text-sm"
            />
            <input 
              type="email"
              placeholder="Twój firmowy adres e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-[1.5] px-5 py-3.5 bg-slate-50 text-slate-900 border border-slate-200 shadow-inner rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all outline-none font-mono text-sm"
              required
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50 whitespace-nowrap shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:scale-105 active:scale-95 text-xs sm:text-sm"
            >
              {status === 'loading' ? 'Wysyłanie raportu...' : 'Odbierz Raport PDF'}
            </button>
          </form>
          <p className="text-xs text-slate-500 font-mono mt-1">Gwarancja prywatności: Wysyłamy wyłącznie estymację ROI. Zero spamu.</p>
        </div>
      )}
    </motion.div>
  );
}
