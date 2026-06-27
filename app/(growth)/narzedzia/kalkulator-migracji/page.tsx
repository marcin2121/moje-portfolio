'use client';

import React, { useState } from 'react';
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
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Kalkulator ROI Migracji
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Odkryj, ile przychodów tracisz przez techniczne tarcie i wolne ładowanie sklepu.
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
            />
            <InputField 
              label="Średnia Wartość Zamówienia (PLN)" 
              value={inputs.averageOrderValue} 
              onChange={(v) => { trackSliderInteraction(); setInputs({...inputs, averageOrderValue: v}); }} 
            />
            <InputField 
              label="Współczynnik Konwersji (%)" 
              value={inputs.conversionRate || 1.2} 
              onChange={(v) => { trackSliderInteraction(); setInputs({...inputs, conversionRate: v}); }} 
              step={0.1}
            />
            <InputField 
              label="Obecny Czas Ładowania (Sekundy)" 
              value={inputs.currentLoadTimeSeconds} 
              onChange={(v) => { trackSliderInteraction(); setInputs({...inputs, currentLoadTimeSeconds: v}); }} 
              step={0.1}
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
            <p className="text-3xl font-bold text-white">
              {formatPLN(outputs.estimatedROI)}
            </p>
          </div>
        </div>
      </div>

      {outputs.projectedRevenueLostPerMonth > 2000 && (
        <LeadCaptureBanner projectedRevenueLost={outputs.projectedRevenueLostPerMonth} />
      )}
    </div>
  );
}

function InputField({ label, value, onChange, step = 1 }: { label: string, value: number, onChange: (v: number) => void, step?: number }) {
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
        className="w-full px-4 py-3 bg-zinc-950/50 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
      />
    </div>
  );
}

function LeadCaptureBanner({ projectedRevenueLost }: { projectedRevenueLost: number }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    try {
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, projectedRevenueLost })
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
      className="mt-12 bg-orange-500/5 backdrop-blur-xl border border-orange-500/20 shadow-2xl rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-white mb-2">Chcesz przedstawić te wyliczenia swojemu CTO / Zarządowi?</h3>
        <p className="text-zinc-400">Wygenerujemy dla Ciebie profesjonalny raport PDF z technicznym uzasadnieniem zmiany architektury.</p>
      </div>
      
      {status === 'success' ? (
        <div className="bg-emerald-500/10 text-emerald-500 px-6 py-4 rounded-xl font-medium border border-emerald-500/20 flex-shrink-0">
          ✓ Raport został wysłany
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full md:w-auto flex gap-3 flex-shrink-0">
          <input 
            type="email"
            placeholder="Twój e-mail firmowy"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 md:w-64 px-4 py-3 bg-zinc-950/50 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
            required
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="bg-orange-500 text-zinc-950 px-6 py-3 rounded-xl font-bold hover:bg-orange-400 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === 'loading' ? 'Wysyłanie...' : 'Wyślij Raport PDF'}
          </button>
        </form>
      )}
    </motion.div>
  );
}
