'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Database, ShoppingCart, Mail, CheckCircle2, Server, ArrowRight } from 'lucide-react';

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
      }, 1000);
      return () => clearTimeout(timer);
    } else if (activeStep === 3) {
      setTimeout(() => {
        setIsRunning(false);
        setActiveStep(-1);
      }, 2000);
    }
  }, [isRunning, activeStep]);

  const nodes = [
    { id: 0, title: 'WooCommerce', devTitle: 'Webhook (POST)', icon: <ShoppingCart size={20} />, desc: 'Nowe zamówienie', devDesc: 'Payload: { id: 8932, total: 1500 }' },
    { id: 1, title: 'Baza Danych', devTitle: 'Supabase Insert', icon: <Database size={20} />, desc: 'Zapis w systemie', devDesc: 'INSERT INTO orders ...' },
    { id: 2, title: 'Księgowość', devTitle: 'Fakturownia API', icon: <Server size={20} />, desc: 'Generowanie faktury', devDesc: 'Status: 201 Created' },
    { id: 3, title: 'Powiadomienie', devTitle: 'Resend SMTP', icon: <Mail size={20} />, desc: 'Wysyłka e-maila do klienta', devDesc: 'sendEmail(customer@...)' },
  ];

  return (
    <section id="sandbox" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0B0B0C] border-t border-[#161618] relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[#F5F5F7] tracking-tight mb-6">
            Przetestuj interaktywny symulator procesu
          </h2>
          <p className="text-[#A1A1A5] text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Zobacz na żywo, jak automatyzacja zastępuje pracę ręczną. Kliknij przycisk poniżej, aby zasymulować przepływ zamówienia.
          </p>
        </div>

        <div className="bg-[#161618] border border-[#222225] rounded-[2rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-12 border-b border-[#222225] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="flex items-center gap-2 bg-[#FF6900] text-black px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Przetwarzanie...' : 'Uruchom automatyzację'}
              {!isRunning && <Play size={16} />}
            </button>
          </div>

          {/* Workflow Graph */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
            {/* Connecting Line background */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-[#222225] -z-0 -translate-y-1/2" />
            
            {nodes.map((node, index) => {
              const isActive = activeStep === index;
              const isDone = activeStep > index;

              return (
                <div key={node.id} className="relative z-10 flex flex-col items-center w-full md:w-1/4">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      borderColor: isActive || isDone ? '#FF6900' : '#222225',
                      backgroundColor: isActive ? '#FF6900' : '#0B0B0C',
                      color: isActive ? '#000000' : (isDone ? '#FF6900' : '#A1A1A5')
                    }}
                    className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center mb-4 transition-colors duration-300 relative bg-[#0B0B0C]"
                  >
                    {isDone ? <CheckCircle2 size={24} /> : node.icon}
                    
                    {/* Pulsing ring when active */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-[#FF6900]"
                        animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  
                  <div className="text-center">
                    <div className="text-sm font-bold text-[#F5F5F7] mb-1">
                      {node.title}
                    </div>
                    <div className="text-xs text-[#A1A1A5] font-mono">
                      {node.desc}
                    </div>
                  </div>
                  
                  {/* Mobile connecting arrow */}
                  {index < nodes.length - 1 && (
                    <div className="md:hidden my-4 text-[#222225]">
                      <ArrowRight size={20} className="rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Console Output Log */}
          <div className="mt-12 bg-[#0B0B0C] border border-[#222225] rounded-xl p-4 font-mono text-[10px] sm:text-xs text-[#A1A1A5] h-32 overflow-hidden flex flex-col justify-end relative">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0B0B0C] to-transparent z-10" />
            <div className="space-y-1">
              <div className="text-zinc-600">Waiting for trigger...</div>
              {activeStep >= 0 && <div className="text-green-500">[{new Date().toLocaleTimeString()}] Trigger fired. Initializing workflow.</div>}
              {activeStep >= 0 && <div>[{new Date().toLocaleTimeString()}] Fetching WooCommerce Webhook... OK</div>}
              {activeStep >= 1 && <div>[{new Date().toLocaleTimeString()}] Connecting to Supabase cluster... OK</div>}
              {activeStep >= 1 && <div className="text-[#FF6900]">[{new Date().toLocaleTimeString()}] Executing INSERT query... Success</div>}
              {activeStep >= 2 && <div>[{new Date().toLocaleTimeString()}] Sending request to Fakturownia API... OK</div>}
              {activeStep >= 3 && <div>[{new Date().toLocaleTimeString()}] Generating PDF... Triggering Resend SMTP... OK</div>}
              {activeStep > 3 && <div className="text-green-500">[{new Date().toLocaleTimeString()}] Workflow completed successfully in {(Math.random() * 0.5 + 1.2).toFixed(2)}s.</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
