'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Phone as PhoneIcon, X } from 'lucide-react';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PortfolioSection, { DemoConfig } from '@/components/sections/PortfolioSection';
import BentoArchitectureSection from '@/components/sections/BentoArchitectureSection';
import { RealPerformanceMetrics } from '@/components/ui/RealPerformanceMetrics';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/ui/FAQ';
import ContactForm from '@/components/ui/ContactForm';

// Globalna funkcja do zdarzeń GTM / Analytics
export const pushGTMEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
    (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
      event: eventName,
      ...params,
    });
  }
};

export default function Home() {
  const [openDemo, setOpenDemo] = useState<DemoConfig | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleOpenDemo = useCallback((config: DemoConfig) => {
    if (typeof window !== 'undefined') {
      setViewMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
    }
    pushGTMEvent('otwarcie_dema', { nazwa_projektu: config.title });
    setOpenDemo(config);
  }, []);

  // Keyboard: Escape closes modal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openDemo) {
        setOpenDemo(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [openDemo]);

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Background Subtle Grid */}
      <div className="fixed inset-0 z-[-1] bg-slate-50 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_80%_80%_at_50%_0%,#000_40%,transparent_100%)] opacity-70" />
      </div>

      {/* Floating Header */}
      <Navbar />

      {/* Main Natural Vertical Flow */}
      <main className="w-full">
        {/* 1. Hero Section */}
        <Hero onNavigate={scrollToAnchor} />

        {/* 2. Flagship Portfolio Showcase (Directly after Hero) */}
        <PortfolioSection handleOpenDemo={handleOpenDemo} />

        {/* 3. Technology & Architecture Bento Grid */}
        <BentoArchitectureSection />

        {/* 4. Real Performance Metrics (Vercel RUM data) */}
        <section className="py-12 bg-slate-50 border-t border-slate-200/40">
          <RealPerformanceMetrics />
        </section>

        {/* 5. Client Testimonials & Social Proof */}
        <TestimonialsSection />

        {/* 6. Transparent Pricing */}
        <section id="cennik" className="w-full bg-slate-50">
          <Pricing />
        </section>

        {/* 7. FAQ */}
        <FAQ />

        {/* 8. Contact & Free 24h Quote Form */}
        <ContactForm />
      </main>

      {/* Minimalist Footer */}
      <footer className="w-full py-12 text-sm text-slate-500 text-center flex flex-col items-center gap-3 bg-white border-t border-slate-200">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 font-mono text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} Marcin Molenda &bull; Molenda Development</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <Link 
            href="/polityka-prywatnosci" 
            className="hover:text-orange-600 transition-colors underline-offset-4 hover:underline"
          >
            Polityka Prywatności
          </Link>
        </div>
      </footer>

      {/* Interactive Live Demo Modal */}
      <AnimatePresence>
        {openDemo && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[999] bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-12"
          >
            <motion.div 
              initial={{ scale: 0.94, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.94, y: 20 }} 
              className="w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-3xl lg:rounded-[2.5rem] border border-slate-200 overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Modal Top Bar */}
              <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex gap-2 pl-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex bg-slate-200/60 p-1 rounded-xl gap-1">
                    <button 
                      onClick={() => setViewMode('desktop')} 
                      className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono uppercase flex items-center gap-2 transition-all ${
                        viewMode === 'desktop' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Monitor size={14} className="hidden sm:block" /> Desktop
                    </button>
                    <button 
                      onClick={() => setViewMode('mobile')} 
                      className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono uppercase flex items-center gap-2 transition-all ${
                        viewMode === 'mobile' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <PhoneIcon size={14} className="hidden sm:block" /> Mobile
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-slate-400 font-mono uppercase tracking-widest hidden md:block truncate max-w-[250px]">
                  Podgląd Live // {openDemo.title}
                </div>

                <button 
                  onClick={() => setOpenDemo(null)} 
                  aria-label="Zamknij podgląd" 
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Iframe Viewport */}
              <div className="flex-1 bg-slate-100 flex justify-center items-center overflow-hidden p-2 sm:p-6">
                <motion.div 
                  animate={{ 
                    width: viewMode === 'desktop' ? '100%' : '375px', 
                    height: viewMode === 'desktop' ? '100%' : '812px', 
                    borderRadius: viewMode === 'desktop' ? '0px' : '36px' 
                  }} 
                  transition={{ type: 'spring', stiffness: 120, damping: 22 }} 
                  className={`bg-white shadow-2xl overflow-hidden relative flex flex-col ${
                    viewMode === 'mobile' ? 'border-[8px] border-slate-900' : ''
                  }`}
                >
                  <iframe 
                    src={openDemo.url} 
                    title={`Podgląd projektu: ${openDemo.title}`} 
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups" 
                    className="w-full h-full border-none pointer-events-auto bg-white" 
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
