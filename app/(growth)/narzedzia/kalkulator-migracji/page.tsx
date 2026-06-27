'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { calculateNextJsMigrationROI, MigrationCalculatorState, CalculatorSchemaGEO } from '@/types';
import { GEOSchemaInjector } from '@/components/ui/GEOSchemaInjector';
import { motion } from 'framer-motion';
import { useFrictionTelemetry } from '@/hooks/useFrictionTelemetry';

const formatPLN = (val: number) => 
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' })
    .format(val)
    .replace(/\u00A0/g, ' ');

export default function MigrationCalculatorPage() {
  const [inputs, setInputs] = useState<MigrationCalculatorState>({
    monthlyTraffic: 50000,
    averageOrderValue: 250,
    conversionRate: 1.2,
    currentLoadTimeSeconds: 4.5
  });

  const { trackSliderInteraction } = useFrictionTelemetry('calc_session_' + Date.now(), 'desktop');

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
    <div className="max-w-4xl mx-auto space-y-12">
      <GEOSchemaInjector schema={schema} />
      
      <div className="flex justify-center md:justify-start">
        <Link href="/narzedzia" className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-orange-500 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Wróć do narzędzi
        </Link>
      </div>
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Kalkulator Wycieku Gotówki
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Odkryj, ile przychodów ucieka z Twojego sklepu każdego miesiąca przez wolne ładowanie na telefonach.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 space-y-6">
          <h2 className="text-xl font-semibold text-white">Parametry Wejściowe</h2>
          
          <div className="space-y-4">
            <InputField 
              label="Miesięczny Ruch (Liczba sesji)" 
              value={inputs.monthlyTraffic} 
              onChange={(v) => { trackSliderInteraction(); setInputs({...inputs, monthlyTraffic: v}); }} 
              min={1000} max={500000} step={1000}
            />
            <InputField 
              label="Średnia Wartość Zamówienia (PLN)" 
              value={inputs.averageOrderValue} 
              onChange={(v) => { trackSliderInteraction(); setInputs({...inputs, averageOrderValue: v}); }} 
              min={10} max={2000} step={10}
            />
            <InputField 
              label="Współczynnik Konwersji (%)" 
              value={inputs.conversionRate || 1.2} 
              onChange={(v) => { trackSliderInteraction(); setInputs({...inputs, conversionRate: v}); }} 
              step={0.1} min={0.1} max={10}
            />
            <InputField 
              label="Obecny Czas Ładowania (Sekundy)" 
              value={inputs.currentLoadTimeSeconds} 
              onChange={(v) => { trackSliderInteraction(); setInputs({...inputs, currentLoadTimeSeconds: v}); }} 
              step={0.1} min={1} max={10}
            />
          </div>
        </div>

        <div className="bg-zinc-950 text-white p-8 rounded-3xl shadow-2xl space-y-8 flex flex-col justify-center border border-orange-500/20">
          <div>
            <p className="text-zinc-500 text-sm uppercase tracking-widest font-semibold mb-2">Prognozowana Utrata Przychodów (Msc)</p>
            <p className="text-5xl font-bold text-rose-500">
              {formatPLN(outputs.projectedRevenueLostPerMonth)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
            <div>
              <p className="text-zinc-500 text-sm mb-1">Docelowy Czas Ładowania</p>
              <p className="text-2xl font-semibold text-emerald-500">{outputs.estimatedNextJsLoadTime}s</p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm mb-1">Wzrost Konwersji</p>
              <p className="text-2xl font-semibold text-orange-500">+{outputs.estimatedConversionUplift.toFixed(1)}%</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <p className="text-zinc-500 text-sm mb-2">Szacowany 12-miesięczny ROI</p>
            <p className="text-3xl font-bold text-white mb-2">
              {formatPLN(outputs.estimatedROI)}
            </p>
            {outputs.estimatedROI >= 15000 ? (
              <p className="text-xs text-zinc-500 font-mono leading-relaxed">
                Koszt wdrożenia naszej architektury to zaledwie <span className="text-zinc-300 font-bold">~{((5000 / outputs.estimatedROI) * 100).toFixed(0)}%</span> tej kwoty (od 5 000 zł jednorazowo). Inwestycja spłaca się średnio w <span className="text-orange-400 font-bold">{Math.ceil(5000 / (outputs.estimatedROI / 365))} dni</span>.
              </p>
            ) : (
              <p className="text-xs text-zinc-500 font-mono leading-relaxed">
                Rekomendujemy punktową optymalizację Twojego obecnego stosu IT lub darmowy audyt infrastruktury. <Link href="/#kontakt" className="text-orange-500 hover:text-orange-400 underline ml-1 inline-block">Zapytaj o mikro-akcelerację →</Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {outputs.estimatedROI >= 15000 ? (
        <LeadCaptureBanner projectedRevenueLost={outputs.projectedRevenueLostPerMonth} inputs={inputs} outputs={outputs} />
      ) : (
        <div className="text-center pt-6 pb-2 mt-12">
          <p className="text-sm text-zinc-500 font-mono">
            Szukasz punktowych oszczędności serwerowych przy mniejszym wolumenie? 
            <Link href="/#kontakt" className="text-orange-500 hover:text-orange-400 underline ml-1.5 inline-block">
              Skonsultuj swój stos IT za darmo →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, step = 1, min = 0, max = 100000 }: { label: string, value: number, onChange: (v: number) => void, step?: number, min?: number, max?: number }) {
  const [localVal, setLocalVal] = useState(value.toString());

  // Zabezpieczenie przed desynchronizacją gdyby prop z góry się zmienił
  React.useEffect(() => {
    setLocalVal(value.toString());
  }, [value]);

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-400 mb-1">{label}</label>
      <input 
        type="number"
        step={step}
        value={localVal}
        onChange={(e) => {
          setLocalVal(e.target.value);
          const parsed = parseFloat(e.target.value);
          if (!isNaN(parsed)) onChange(parsed);
        }}
        onBlur={() => setLocalVal(value.toString())}
        className="w-full px-4 py-3 bg-zinc-950/50 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none mb-4"
      />
      <input 
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-orange-500 cursor-pointer"
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
      className="mt-12 bg-orange-500/5 backdrop-blur-xl border border-orange-500/20 shadow-2xl rounded-3xl p-8 flex flex-col gap-6"
    >
      <div className="w-full">
        <h3 className="text-xl font-semibold text-white mb-2">Chcesz przedstawić te wyliczenia swojemu CTO / Zarządowi?</h3>
        <p className="text-zinc-400">Wygenerujemy dla Ciebie profesjonalny raport, który prześlemy prosto na Twoją skrzynkę e-mail.</p>
      </div>
      
      {status === 'success' ? (
        <div className="bg-emerald-500/10 text-emerald-500 px-6 py-4 rounded-xl font-medium border border-emerald-500/20 w-full text-center">
          ✓ Raport został wysłany
        </div>
      ) : (
        <div className="w-full flex flex-col gap-2">
          <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row flex-wrap gap-3">
            <input 
              type="text"
              placeholder="Adres sklepu (opcj.)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 min-w-[220px] px-4 py-3 bg-zinc-950/50 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
            />
            <input 
              type="email"
              placeholder="Twój e-mail firmowy"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-[2_1_250px] min-w-[250px] px-4 py-3 bg-zinc-950/50 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
              required
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="flex-1 min-w-[200px] bg-orange-500 text-zinc-950 px-6 py-3 rounded-xl font-bold hover:bg-orange-400 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {status === 'loading' ? 'Wysyłanie...' : 'Odbierz Raport'}
            </button>
          </form>
          <p className="text-xs text-zinc-500 font-mono">🔒 Wysyłamy wyłącznie raport. Zero spamu i nękania.</p>
        </div>
      )}
    </motion.div>
  );
}
