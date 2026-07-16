'use client';

import React, { useState } from 'react';
import { Play, Database, Workflow, Smartphone, CheckCircle2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ApiSimulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(1);
    setLogs(['[SYSTEM] Inicjalizacja bezpiecznego żądania rezerwacji...', '[CLIENT] Formularz wysłany (Imię: Jan, E-mail: ukryty).']);

    setTimeout(() => {
      setActiveStep(2);
      setLogs(prev => [...prev, '[SUPABASE] Autoryzacja zapisów. RLS Policy = TRUE.', '[SUPABASE] Insert 201 Created. Dane zaszyfrowane w PostgreSQL.']);
    }, 1500);

    setTimeout(() => {
      setActiveStep(3);
      setLogs(prev => [...prev, '[n8n] Webhook odebrany. Uruchamiam scenariusz automatyzacji.', '[n8n] Formatowanie danych pod Google Calendar.']);
    }, 3000);

    setTimeout(() => {
      setActiveStep(4);
      setLogs(prev => [...prev, '[GOOGLE CALENDAR] Dodano wydarzenie na kalendarz Konsultanta.', '[SMS GATEWAY] Wysłano przypomnienie SMS. RODO-compliant: numer skasowany z bufora.']);
    }, 4500);

    setTimeout(() => {
      setIsRunning(false);
      setLogs(prev => [...prev, '[SYSTEM] Proces zakończony sukcesem w czasie 0.42s.']);
    }, 6000);
  };

  const steps = [
    { id: 1, label: 'Formularz KAS', icon: Shield, desc: 'Bezpieczny Webhook' },
    { id: 2, label: 'Baza Supabase', icon: Database, desc: 'Szyfrowany Zapis' },
    { id: 3, label: 'Automatyzacja n8n', icon: Workflow, desc: 'Dystrybucja Danych' },
    { id: 4, label: 'GCal & SMS', icon: Smartphone, desc: 'Powiadomienia' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Visualizer */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h4 className="font-bold text-lg text-white">Przepływ Danych (Real-time)</h4>
          <button 
            onClick={runSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-400 text-white font-bold rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" /> Uruchom symulację
          </button>
        </div>

        <div className="relative flex flex-col gap-6">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative flex items-center gap-6">
              {/* Connector line */}
              {idx !== steps.length - 1 && (
                <div className="absolute left-6 top-12 bottom-[-1.5rem] w-0.5 bg-slate-700 z-0">
                  {activeStep > step.id && (
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: '100%' }} 
                      transition={{ duration: 0.5 }} 
                      className="w-full bg-orange-500" 
                    />
                  )}
                </div>
              )}
              
              <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${activeStep >= step.id ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                {activeStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
              </div>
              
              <div className={`transition-opacity duration-500 ${activeStep >= step.id ? 'opacity-100' : 'opacity-40'}`}>
                <div className="font-bold text-white text-lg">{step.label}</div>
                <div className="text-slate-400 text-sm">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal logs */}
      <div className="flex-1 bg-black rounded-2xl border border-slate-800 p-4 font-mono text-xs text-green-400 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4 text-slate-500">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="ml-2 uppercase tracking-widest text-[10px]">Server Logs (Read-only)</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {logs.length === 0 ? (
            <div className="text-slate-600">Oczekiwanie na uruchomienie symulacji...</div>
          ) : (
            logs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className={`${log.includes('[SYSTEM]') ? 'text-blue-400' : log.includes('[SUPABASE]') ? 'text-emerald-400' : log.includes('[n8n]') ? 'text-rose-400' : 'text-amber-400'}`}
              >
                <span className="text-slate-600">{new Date().toISOString().split('T')[1].slice(0, 12)}</span> {log}
              </motion.div>
            ))
          )}
          {isRunning && (
            <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>_</motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
