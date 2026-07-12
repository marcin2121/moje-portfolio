'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, Zap, X } from 'lucide-react';

export default function PerformanceBadge() {
  const [loadTime, setLoadTime] = useState('0.00');
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Symulacja lub pobranie prawdziwego czasu ładowania
    // Używamy performance.timing, by pokazać prawdziwą szybkość po załadowaniu
    if (typeof window !== 'undefined' && window.performance) {
      setTimeout(() => {
        const timing = window.performance.timing;
        const time = (timing.domContentLoadedEventEnd - timing.navigationStart) / 1000;
        // Jeśli time jest ujemny lub 0 (SSG potrafi być natychmiastowe), ustawmy 0.04s dla pokazania
        const finalTime = time > 0 ? time.toFixed(2) : '0.04';
        setLoadTime(finalTime);
        setIsVisible(true);
      }, 500);
    } else {
      setLoadTime('0.04');
      setIsVisible(true);
    }
  }, []);

  if (!mounted || !isVisible) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 animate-in slide-in-from-bottom-5 fade-in duration-700 wcag-panel-ignore" style={{ zIndex: 99997 }}>
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-4 pr-10 flex items-start gap-4 max-w-sm relative group">
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors"
          aria-label="Zamknij powiadomienie"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 mb-1 pr-2">
            Wygenerowano w <span className="text-emerald-600">{loadTime}s</span>
          </div>
          <div className="text-xs text-slate-600 leading-relaxed flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>Bez ciężkich wtyczek, bez WordPressa i bez ciasteczek (zgodnie z RODO).</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
