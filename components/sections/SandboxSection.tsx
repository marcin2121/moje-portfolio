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
    { id: 0, title: 'WooCommerce', devTitle: 'Webhook (POST)', icon: <ShoppingCart size={20} strokeWidth={1.5} />, desc: 'Nowe zamówienie', payload: '{ id: 8932, total: 1500 }' },
    { id: 1, title: 'Baza Danych', devTitle: 'Supabase Insert', icon: <Database size={20} strokeWidth={1.5} />, desc: 'Zapis w systemie', payload: 'INSERT INTO orders...' },
    { id: 2, title: 'Księgowość', devTitle: 'Fakturownia API', icon: <Server size={20} strokeWidth={1.5} />, desc: 'Generowanie faktury', payload: 'Status: 201 Created' },
    { id: 3, title: 'Powiadomienie', devTitle: 'Resend SMTP', icon: <Mail size={20} strokeWidth={1.5} />, desc: 'Wysyłka e-maila', payload: 'sendEmail(client@...)' },
  ];

  return (
    <section id="sandbox" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black relative z-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-left md:text-center mb-16 md:mb-24 flex flex-col items-start md:items-center">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-6">
            {fixOrphans('Przetestuj swoją nową maszynę sprzedażową.')}
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
            {fixOrphans(`Zamiast czytać o technologii, zobacz ją w akcji. Prześledź na żywo drogę od kliknięcia klienta, przez automatyczny zapis w bazie, aż po wystawienie faktury. Tak system odzyskuje Twoje wolne wieczory.`)}
          </p>
        </div>

        <div className="bg-zinc-950/50 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col relative">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 sm:p-8 border-b border-white/5 gap-6">
            <div>
              <div className="text-sm font-medium tracking-wide text-zinc-300 uppercase mb-1">
                Środowisko Testowe
              </div>
              <div className="text-xs text-zinc-500 font-mono">
                /api/v1/workflows/e-commerce
              </div>
            </div>
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="group relative flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {isRunning ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Przetwarzanie...</span>
                </>
              ) : (
                <>
                  <Play size={16} className="fill-black" />
                  <span>Zobacz system w akcji</span>
                </>
              )}
              {/* Subtle hover glow */}
              {!isRunning && (
                <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Visual Graph Area */}
            <div className="flex-1 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5 relative">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {nodes.map((node, index) => {
                  const isActive = activeStep === index;
                  const isDone = activeStep > index;
                  const isPending = activeStep < index;

                  return (
                    <motion.div 
                      key={node.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                        isActive ? 'bg-orange-500/5 border-orange-500/20' : 
                        isDone ? 'bg-zinc-900/30 border-white/5' : 
                        'bg-transparent border-transparent opacity-40'
                      } p-6 flex flex-col gap-4`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                          isActive ? 'bg-orange-500 text-black' :
                          isDone ? 'bg-zinc-800 text-zinc-300' :
                          'bg-zinc-900 text-zinc-600'
                        }`}>
                          {isDone ? <CheckCircle2 size={24} /> : node.icon}
                        </div>
                        
                        {/* Status Label Typography */}
                        <div className="text-[10px] uppercase tracking-widest font-bold font-mono text-zinc-500">
                          Krok 0{index + 1}
                        </div>
                      </div>

                      <div>
                        <div className={`text-lg font-bold mb-1 transition-colors duration-500 ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                          {node.title}
                        </div>
                        <div className="text-sm text-zinc-500">
                          {node.desc}
                        </div>
                      </div>

                      {/* Code Snippet Payload */}
                      <div className={`mt-2 font-mono text-[10px] px-3 py-2 rounded-lg transition-colors duration-500 ${
                        isActive ? 'bg-orange-500/10 text-orange-400' :
                        isDone ? 'bg-zinc-900 text-zinc-500' :
                        'bg-zinc-900/50 text-zinc-700'
                      }`}>
                        {node.devTitle} &rarr; {node.payload}
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Terminal Log Area */}
            <div className="w-full lg:w-80 bg-zinc-950 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-zinc-500">
                <Terminal size={14} />
                <span className="text-xs uppercase tracking-widest font-mono font-bold">Terminal log</span>
              </div>
              
              <div className="flex-1 font-mono text-[11px] leading-relaxed flex flex-col justify-end">
                <div className="space-y-3">
                  <div className="text-zinc-600">~ % ./run-simulation.sh</div>
                  
                  <AnimatePresence mode="popLayout">
                    {activeStep === -1 && !isRunning && (
                      <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-zinc-500">
                        Oczekuję na sygnał startowy...
                      </motion.div>
                    )}
                    
                    {activeStep >= 0 && (
                      <motion.div key="step0" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-zinc-300">
                        <span className="text-orange-500">POST</span> /webhook/order <br/>
                        <span className="text-zinc-600">Status: 200 OK (8ms)</span>
                      </motion.div>
                    )}
                    
                    {activeStep >= 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-zinc-300">
                        <span className="text-orange-500">INSERT</span> into public.orders <br/>
                        <span className="text-zinc-600">Status: Created (12ms)</span>
                      </motion.div>
                    )}
                    
                    {activeStep >= 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-zinc-300">
                        <span className="text-orange-500">FETCH</span> fakturownia/api/v1/invoices <br/>
                        <span className="text-zinc-600">Status: 201 Created (145ms)</span>
                      </motion.div>
                    )}

                    {activeStep >= 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-zinc-300">
                        <span className="text-orange-500">SEND</span> resend/api/email <br/>
                        <span className="text-zinc-600">Status: 200 OK (210ms)</span>
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
