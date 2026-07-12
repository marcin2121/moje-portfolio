'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Eye, Type, Link as LinkIcon, PowerOff, Palette, MonitorOff, ShieldAlert } from 'lucide-react';

export default function WcagPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [fontSize, setFontSize] = useState(0); // 0, 1, 2, 3
  const [dyslexic, setDyslexic] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [stopAnimations, setStopAnimations] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    
    // Obsługa wysokiego kontrastu
    if (highContrast) html.classList.add('wcag-high-contrast');
    else html.classList.remove('wcag-high-contrast');

    // Obsługa skali szarości nie modyfikuje już html.style.filter
    // Zamiast tego renderujemy overlay z backdrop-filter poniżej

    // Obsługa rozmiaru fontu
    html.style.fontSize = fontSize === 0 ? '' : `${100 + (fontSize * 10)}%`;

    // Czcionka dla dyslektyków
    if (dyslexic) html.classList.add('wcag-dyslexic');
    else html.classList.remove('wcag-dyslexic');

    // Podświetlanie linków
    if (highlightLinks) html.classList.add('wcag-highlight-links');
    else html.classList.remove('wcag-highlight-links');

    // Zatrzymanie animacji
    if (stopAnimations) html.classList.add('wcag-stop-animations');
    else html.classList.remove('wcag-stop-animations');

  }, [highContrast, grayscale, fontSize, dyslexic, highlightLinks, stopAnimations]);

  if (!mounted) return null;

  return createPortal(
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .wcag-high-contrast *:not(.wcag-panel-ignore):not(.wcag-panel-ignore *):not(img):not(svg):not(path):not(circle):not(rect):not(line):not(polyline):not(polygon):not(.wcag-grayscale-overlay) {
          background-color: #000000 !important;
          color: #FFFF00 !important;
          border-color: #FFFF00 !important;
        }
        .wcag-high-contrast img, .wcag-high-contrast svg {
          filter: grayscale(100%) contrast(200%) !important;
        }
        .wcag-high-contrast .wcag-panel-ignore, .wcag-high-contrast .wcag-panel-ignore * {
          background-color: revert !important;
          color: revert !important;
          border-color: revert !important;
        }
        
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('/fonts/OpenDyslexic-Regular.woff') format('woff'),
               url('/fonts/OpenDyslexic-Regular.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
        }
        .wcag-dyslexic *:not(.wcag-panel-ignore):not(.wcag-panel-ignore *) {
          font-family: "OpenDyslexic", "Comic Sans MS", sans-serif !important;
          line-height: 1.6 !important;
          overflow-wrap: break-word !important;
          word-break: normal !important;
        }
        
        /* Skalowanie gigantycznej czcionki nagłówków, by nie wychodziła poza ekran */
        .wcag-dyslexic h1:not(.wcag-panel-ignore *) { font-size: clamp(2rem, 5vw, 3rem) !important; }
        .wcag-dyslexic h2:not(.wcag-panel-ignore *) { font-size: clamp(1.75rem, 4vw, 2.5rem) !important; }
        .wcag-dyslexic h3:not(.wcag-panel-ignore *) { font-size: clamp(1.5rem, 3vw, 2rem) !important; }
        .wcag-dyslexic h4:not(.wcag-panel-ignore *) { font-size: clamp(1.25rem, 2vw, 1.5rem) !important; }

        .wcag-highlight-links a, .wcag-highlight-links button {
          outline: 3px solid #FF0000 !important;
          outline-offset: 2px !important;
          text-decoration: underline !important;
          text-decoration-thickness: 3px !important;
          text-decoration-color: #FF0000 !important;
        }

        .wcag-stop-animations * {
          animation: none !important;
          transition: none !important;
        }

        .wcag-grayscale-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99998;
          backdrop-filter: grayscale(100%);
          -webkit-backdrop-filter: grayscale(100%);
        }
      `}} />

      {grayscale && <div className="wcag-grayscale-overlay" />}

      <div className="fixed top-1/2 left-0 -translate-y-1/2 wcag-panel-ignore flex flex-col items-start" style={{ zIndex: 99999 }}>
        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-[8px] px-[12px] py-[10px] bg-blue-700 text-white font-bold rounded-r-[16px] shadow-[4px_0_24px_rgba(29,78,216,0.3)] hover:bg-blue-800 transition-colors border-[2px] border-l-0 border-white focus:outline-none focus:ring-[4px] focus:ring-blue-400 group"
            aria-label="Otwórz panel dostępności"
            style={{ fontSize: '14px', lineHeight: '20px' }}
          >
            <Eye className="w-[20px] h-[20px]" />
            <span className="hidden sm:inline-block max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-300 ease-in-out whitespace-nowrap">Panel Dostępności</span>
          </button>
        )}

        {isOpen && (
          <div className="bg-white border-[2px] border-l-0 border-blue-700 rounded-r-[16px] shadow-[8px_0_32px_rgba(0,0,0,0.15)] w-[92vw] sm:w-[420px] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white flex justify-between items-center px-[24px] pt-[24px] pb-[16px] border-b border-slate-100 mb-[16px] text-slate-900">
              <h2 className="font-black text-blue-900 flex items-center gap-[8px]" style={{ fontSize: '20px', lineHeight: '28px' }}>
                <Eye className="w-[24px] h-[24px]" /> Opcje WCAG
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-[8px] bg-slate-100 rounded-[9999px] hover:bg-slate-200" aria-label="Zamknij panel">
                <PowerOff className="w-[20px] h-[20px] text-slate-700" />
              </button>
            </div>

            <div className="space-y-[24px] text-slate-800 px-[24px] pb-[24px]">
              {/* Kontrast */}
              <div>
                <h3 className="font-bold mb-[12px] flex items-center gap-[8px]" style={{ fontSize: '16px', lineHeight: '24px' }}><Palette className="w-[16px] h-[16px]"/> Kontrast i kolory</h3>
                <div className="grid grid-cols-2 gap-[8px]">
                  <button 
                    onClick={() => setHighContrast(!highContrast)}
                    className={`p-[12px] font-bold border-[2px] rounded-[12px] transition-colors ${highContrast ? 'bg-black text-yellow-400 border-black' : 'bg-white border-slate-200 hover:border-blue-500'}`}
                    style={{ fontSize: '14px', lineHeight: '20px' }}
                  >
                    Wysoki kontrast
                  </button>
                  <button 
                    onClick={() => setGrayscale(!grayscale)}
                    className={`p-[12px] font-bold border-[2px] rounded-[12px] transition-colors ${grayscale ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 hover:border-blue-500'}`}
                    style={{ fontSize: '14px', lineHeight: '20px' }}
                  >
                    Skala szarości
                  </button>
                </div>
              </div>

              {/* Tekst */}
              <div>
                <h3 className="font-bold mb-[12px] flex items-center gap-[8px]" style={{ fontSize: '16px', lineHeight: '24px' }}><Type className="w-[16px] h-[16px]"/> Czytelność tekstu</h3>
                <div className="bg-slate-50 border-[2px] border-slate-200 rounded-[12px] p-[16px] mb-[12px] select-none">
                  <div className="flex justify-between items-center mb-[12px]">
                    <span className="font-bold text-slate-700" style={{ fontSize: '14px', lineHeight: '20px' }}>Rozmiar ({100 + fontSize * 10}%)</span>
                    {fontSize > 0 && (
                      <button onClick={() => setFontSize(0)} className="font-bold text-blue-600 hover:text-blue-800 focus:outline-none" style={{ fontSize: '12px', lineHeight: '16px' }}>
                        Reset
                      </button>
                    )}
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="5" 
                    step="1" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    draggable={false}
                    className="w-full h-[8px] bg-slate-200 rounded-[8px] cursor-pointer accent-blue-600 focus:outline-none focus:ring-[2px] focus:ring-blue-400"
                    aria-label="Powiększenie tekstu"
                  />
                  <div className="flex justify-between font-bold text-slate-400 mt-[8px] px-[4px] pointer-events-none" style={{ fontSize: '12px', lineHeight: '16px' }}>
                    <span>A</span>
                    <span style={{ fontSize: '14px', lineHeight: '20px' }}>A</span>
                    <span style={{ fontSize: '16px', lineHeight: '24px' }}>A</span>
                  </div>
                </div>
                <button 
                  onClick={() => setDyslexic(!dyslexic)}
                  className={`w-full p-[12px] font-bold border-[2px] rounded-[12px] transition-colors ${dyslexic ? 'bg-blue-100 border-blue-500 text-blue-800' : 'bg-white border-slate-200 hover:border-blue-500'}`}
                  style={{ fontSize: '14px', lineHeight: '20px' }}
                >
                  Czcionka dla dyslektyków
                </button>
              </div>

              {/* Ułatwienia */}
              <div>
                <h3 className="font-bold mb-[12px] flex items-center gap-[8px]" style={{ fontSize: '16px', lineHeight: '24px' }}><MonitorOff className="w-[16px] h-[16px]"/> Nawigacja i ruch</h3>
                <div className="grid grid-cols-1 gap-[8px]">
                  <button 
                    onClick={() => setHighlightLinks(!highlightLinks)}
                    className={`p-[12px] font-bold border-[2px] rounded-[12px] flex items-center justify-center gap-[8px] transition-colors ${highlightLinks ? 'bg-blue-100 border-blue-500 text-blue-800' : 'bg-white border-slate-200 hover:border-blue-500'}`}
                    style={{ fontSize: '14px', lineHeight: '20px' }}
                  >
                    <LinkIcon className="w-[16px] h-[16px]" /> Podświetl linki
                  </button>
                  <button 
                    onClick={() => setStopAnimations(!stopAnimations)}
                    className={`p-[12px] font-bold border-[2px] rounded-[12px] transition-colors ${stopAnimations ? 'bg-blue-100 border-blue-500 text-blue-800' : 'bg-white border-slate-200 hover:border-blue-500'}`}
                    style={{ fontSize: '14px', lineHeight: '20px' }}
                  >
                    Zatrzymaj animacje
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 p-[16px] rounded-[12px] border-[1px] border-blue-100 text-blue-800 leading-relaxed font-medium space-y-[12px]" style={{ fontSize: '12px' }}>
                <div className="font-bold flex items-start gap-[6px] text-blue-900">
                  <ShieldAlert className="w-[16px] h-[16px] shrink-0 mt-[2px] text-rose-500" /> 
                  <span>🛡️ Tanie wtyczki WCAG na WordPressie to ryzyko utraty dotacji.</span>
                </div>
                <p>
                  Zwykłe nakładki jedynie maskują błędy kodu i mogą zostać odrzucone podczas oficjalnego audytu FRSE, Eurodesk lub EOG. Mój natywny kod w Next.js gwarantuje bezbłędne przejście walidacji.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
