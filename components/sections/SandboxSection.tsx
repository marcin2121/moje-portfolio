'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Database, ShoppingCart, Mail, CheckCircle2, Server, Terminal, Loader2 } from 'lucide-react';
import { fixOrphans } from '@/utils/typography';

export function SandboxSection() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(0);
  };

  useEffect(() => {
    if (isRunning && activeStep < 3) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else if (activeStep === 3) {
      setTimeout(() => {
        setIsRunning(false);
        setActiveStep(-1);
      }, 2500);
    }
  }, [isRunning, activeStep]);

  const nodes = [
    { id: 0, title: 'Zamówienie (2:00 w nocy)', devTitle: 'Klient opłaca koszyk', icon: <ShoppingCart size={20} strokeWidth={1.5} />, desc: 'Natychmiastowe księgowanie', payload: 'Kwota: 1 500 PLN wpłynęła' },
    { id: 1, title: 'Baza CRM', devTitle: 'Zarządzanie magazynem', icon: <Database size={20} strokeWidth={1.5} />, desc: 'Automatyczna synchronizacja', payload: 'Stan produktu: Zaktualizowany (-1)' },
    { id: 2, title: 'Księgowość', devTitle: 'Wystawienie dokumentu', icon: <Server size={20} strokeWidth={1.5} />, desc: 'Faktura VAT leci na e-mail', payload: 'Oszczędność: 7 min ręcznej pracy' },
    { id: 3, title: 'Logistyka', devTitle: 'Kurier i powiadomienia', icon: <Mail size={20} strokeWidth={1.5} />, desc: 'Etykieta InPost wygenerowana', payload: 'Status: Klient otrzymał SMS' },
  ];

  return (
    <section id="sandbox" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50/50 relative z-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-left md:text-center mb-16 md:mb-24 flex flex-col items-start md:items-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            {fixOrphans('Odzyskaj 20 godzin w miesiącu pełną automatyzacją.')}
          </h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl font-normal leading-relaxed">
            {fixOrphans(`Klient kupuje o 2:00 w nocy. Zanim wstaniesz rano, system zdąży zaksięgować wpłatę, zaktualizować stany magazynowe, wystawić Fakturę VAT i przygotować etykietę kurierską. Zero przepisywania ręcznego. Kliknij i prześledź sekunda po sekundzie pracę swojego nowego "pracownika", który nigdy nie śpi.`)}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl border border-slate-200/50 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col relative">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 sm:p-8 border-b border-slate-200/50 gap-6">
            <div>
              <div className="text-sm font-bold tracking-wide text-slate-800 uppercase mb-1">
                Środowisko Testowe
              </div>
              <div className="text-xs text-slate-400 font-mono">
                /api/v1/workflows/e-commerce
              </div>
            </div>
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="group relative flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            >
              {isRunning ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Przetwarzanie...</span>
                </>
              ) : (
                <>
                  <Play size={16} className="fill-white" />
                  <span>Uruchom i odzyskaj czas</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Visual Graph Area */}
            <div className="flex-1 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 relative">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {nodes.map((node, index) => {
                  const isActive = activeStep === index;
                  const isDone = activeStep > index;

                  return (
                    <motion.div 
                      key={node.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                        index === 0 || index === 3 ? 'md:col-span-2' : 'md:col-span-1'
                      } ${
                        isActive ? 'bg-white border-slate-900 shadow-2xl shadow-slate-900/10 scale-[1.02] z-10' : 
                        isDone ? 'bg-slate-50 border-slate-200' : 
                        'bg-white border-slate-200 shadow-sm'
                      } p-6 flex flex-col gap-4`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                          isActive ? 'bg-slate-900 text-white shadow-md' :
                          isDone ? 'bg-emerald-100 text-emerald-600' :
                          'bg-slate-100 text-slate-400'
                        }`}>
                          {isDone ? <CheckCircle2 size={24} className="text-emerald-600" /> : node.icon}
                        </div>
                        
                        {/* Status Label Typography */}
                        <div className="text-[10px] uppercase tracking-widest font-bold font-mono text-slate-400">
                          Krok 0{index + 1}
                        </div>
                      </div>

                      <div>
                        <div className={`text-lg font-bold mb-1 transition-colors duration-500 ${isActive ? 'text-slate-900' : isDone ? 'text-slate-700' : 'text-slate-500'}`}>
                          {node.title}
                        </div>
                        <div className={`text-sm ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>
                          {node.desc}
                        </div>
                      </div>

                      {/* Code Snippet Payload */}
                      <div className={`mt-2 font-mono text-[10px] px-3 py-2 rounded-lg transition-colors duration-500 ${
                        isActive ? 'bg-slate-900 text-white font-medium shadow-inner' :
                        isDone ? 'bg-slate-200/50 text-slate-600' :
                        'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>
                        {node.devTitle} &rarr; {node.payload}
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Terminal Log Area */}
            <div className="w-full lg:w-80 bg-slate-900 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <Terminal size={14} />
                <span className="text-xs uppercase tracking-widest font-mono font-bold">Terminal log</span>
              </div>
              
              <div className="flex-1 font-mono text-[11px] leading-relaxed flex flex-col justify-end">
                <div className="space-y-3">
                  <div className="text-slate-500">~ % ./run-simulation.sh</div>
                  
                  <AnimatePresence mode="popLayout">
                    {activeStep === -1 && !isRunning && (
                      <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-400">
                        Oczekuję na sygnał startowy...
                      </motion.div>
                    )}
                    
                    {activeStep >= 0 && (
                      <motion.div key="step0" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-slate-300">
                        <span className="text-slate-500">[Stripe Webhook]</span> <span className="text-white font-bold bg-white/10 px-1 rounded">POST</span> /payment/success <br/>
                        <span className="text-emerald-400">Status: 1500 PLN (Verified)</span>
                      </motion.div>
                    )}
                    
                    {activeStep >= 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-slate-300">
                        <span className="text-slate-500">[CRM Sync]</span> <span className="text-white font-bold bg-white/10 px-1 rounded">UPDATE</span> inventory SET stock = stock - 1 <br/>
                        <span className="text-emerald-400">Status: Synced (12ms)</span>
                      </motion.div>
                    )}
                    
                    {activeStep >= 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-slate-300">
                        <span className="text-slate-500">[Fakturownia]</span> <span className="text-white font-bold bg-white/10 px-1 rounded">POST</span> /api/v1/invoices <br/>
                        <span className="text-emerald-400">Invoice: FV_2026_07.pdf (Sent)</span>
                      </motion.div>
                    )}

                    {activeStep >= 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-slate-300">
                        <span className="text-slate-500">[InPost API]</span> <span className="text-white font-bold bg-white/10 px-1 rounded">POST</span> /shipments <br/>
                        <span className="text-emerald-400">Tracking: 6123456789 (SMS dispatched)</span>
                      </motion.div>
                    )}

                    {activeStep === -1 && isRunning === false && (
                      <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 pt-4">
                        ✓ Przepływ zakończony pomyślnie.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
