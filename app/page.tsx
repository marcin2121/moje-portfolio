'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Code2, Smartphone, Zap, Gauge, Facebook, Linkedin, Monitor, Smartphone as PhoneIcon, X, Terminal, ChevronUp } from 'lucide-react';
import MagicBento from '@/components/ui/MagicBento';
import Hero from '@/components/Hero';
import MagneticWrapper from '@/components/ui/MagneticWrapper';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import AnimatedWebP from '@/components/ui/AnimatedWebP';
import Link from 'next/link';
import BottomSheet from '@/components/ui/BottomSheet';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { AboutMeSection } from '@/components/sections/AboutMeSection';
import ContactForm from '@/components/ui/ContactForm';
import FAQ from '@/components/ui/FAQ';
import Pricing from '@/components/Pricing';
import { SandboxSection } from '@/components/sections/SandboxSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { fixOrphans } from '@/utils/typography';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);
}

// Usunięto Particles (dynamic import)

// Usunięto rIC i cIC

type DemoConfig = {
  url: string;
  title: string;
  colorClass: string;
  bgClass: string;
};

const NAV_DOTS = [
  { id: 0, title: 'Start' },
  { id: 1, title: 'O Mnie' },
  { id: 2, title: 'Problemy' },
  { id: 3, title: 'Rozwiązania' },
  { id: 4, title: 'Proces' },
  { id: 5, title: 'Symulacja' },
  { id: 6, title: 'Benefity' },
  { id: 7, title: 'Portfolio' },
  { id: 8, title: 'DzikiStyl.com' },
  { id: 9, title: 'Sklep Urwis' },
  { id: 10, title: 'zamowtu.pl' },
  { id: 11, title: 'Kajaki u Maćka' },
  { id: 12, title: 'Referencje' },
  { id: 13, title: 'Cennik' },
  { id: 14, title: 'FAQ' },
  { id: 15, title: 'Kontakt' },
] as const;

export const pushGTMEvent = (eventName: string, params: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined') {
    const w = window as unknown as { dataLayer: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: eventName, ...params });
  }
};

export default function PortfolioHome() {
  const containerRef    = useRef<HTMLDivElement>(null);
  const horizontal1Ref  = useRef<HTMLDivElement>(null);
  const horizontal2Ref  = useRef<HTMLDivElement>(null);

  const gsapRef = useRef<typeof import('gsap')['default'] | null>(null);
  const stRef = useRef<typeof import('gsap/ScrollTrigger').ScrollTrigger | null>(null);
  
  const [activeDot, setActiveDot]         = useState(0);
  const [openDemo, setOpenDemo]           = useState<DemoConfig | null>(null);
  const [viewMode, setViewMode]           = useState<'desktop' | 'mobile'>('desktop');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  const playRef = useRef<(() => void) | null>(null);
  const playNavClick = useCallback(() => {
    if (playRef.current) { playRef.current(); return; }
    import('use-sound').then(() => {
      const audio = new Audio('/sfx/click.mp3');
      audio.volume = 0.1;
      audio.play().catch(() => {});
      playRef.current = () => { const a = new Audio('/sfx/click.mp3'); a.volume = 0.1; a.play().catch(() => {}); };
    }).catch(() => {});
  }, []);

  const snapPointsRef = useRef<number[]>(NAV_DOTS.map((_, i) => i / (NAV_DOTS.length - 1)));
  const rawProgress   = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, { stiffness: 80, damping: 18, mass: 0.8 });
  const lavaHeight    = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const lavaWidth     = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  useGSAP(() => {

    window.scrollTo(0, 0);
    gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);
    
    gsapRef.current = gsap;
    stRef.current = ScrollTrigger;

    const buildSnapPoints = () => {
      const maxScr = ScrollTrigger.maxScroll(window);
      if (maxScr === 0) return;

      const getDomRatio = (id: string, fallback: number) => {
        const el = document.getElementById(id);
        return el ? (window.scrollY + el.getBoundingClientRect().top) / maxScr : fallback;
      };

      const allST = ScrollTrigger.getAll();
      const h1 = allST.find(t => t.trigger === horizontal1Ref.current);
      const h2 = allST.find(t => t.trigger === horizontal2Ref.current);

      if (!h1 || !h2) {
        // Fallback for mobile where horizontal scroll doesn't exist
        const pts: number[] = [];
        pts[0] = getDomRatio('hero', 0);
        pts[1] = getDomRatio('o-mnie', 1/15);
        pts[2] = getDomRatio('problem', 2/15);
        pts[3] = getDomRatio('rozwiazania', 3/15);
        pts[4] = getDomRatio('proces', 4/15);
        pts[5] = getDomRatio('sandbox', 5/15);
        pts[6] = getDomRatio('benefits', 6/15);
        pts[7] = getDomRatio('portfolio', 7/15);
        pts[8] = getDomRatio('dzikistyl', 8/15);
        pts[9] = getDomRatio('sklepurwis', 9/15);
        pts[10] = getDomRatio('zamowtu', 10/15);
        pts[11] = getDomRatio('kajaki', 11/15);
        pts[12] = getDomRatio('referencje', 12/15);
        pts[13] = getDomRatio('cennik', 13/15);
        pts[14] = getDomRatio('faq', 14/15);
        pts[15] = Math.min(getDomRatio('kontakt', 1), 1);
        snapPointsRef.current = pts;
        return;
      }

      const pts: number[] = [];
      pts[0] = h1.start / maxScr;
      pts[1] = (h1.start + (h1.end - h1.start) * (1/3)) / maxScr;
      pts[2] = (h1.start + (h1.end - h1.start) * (2/3)) / maxScr;
      pts[3] = h1.end / maxScr;
      
      pts[4] = getDomRatio('proces', (h1.end + 10) / maxScr);
      pts[5] = getDomRatio('sandbox', (h1.end + 20) / maxScr);
      pts[6] = getDomRatio('benefits', (h1.end + 30) / maxScr);
      
      const h2Dur = h2.end - h2.start;
      for (let i = 0; i < 6; i++) {
        pts[7 + i] = (h2.start + h2Dur * i / 5) / maxScr;
      }

      pts[13] = getDomRatio('cennik', (h2.end + 10) / maxScr);
      pts[14] = getDomRatio('faq', (h2.end + 20) / maxScr);
      pts[15] = Math.min(getDomRatio('kontakt', (h2.end + 30) / maxScr), 1);

      snapPointsRef.current = pts;
    };

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      gsap.to(horizontal1Ref.current, { xPercent: -75, ease: 'none', scrollTrigger: { trigger: horizontal1Ref.current, start: 'top top', end: '+=300%', pin: true, scrub: 0.5 } });
      gsap.to(horizontal2Ref.current, { xPercent: -83.33, ease: 'none', scrollTrigger: { trigger: horizontal2Ref.current, start: 'top top', end: '+=500%', pin: true, scrub: 0.5 } });
    });

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onRefresh: buildSnapPoints,
      onUpdate: (self) => {
        rawProgress.set(self.progress);
        const pts = snapPointsRef.current;
        let activeIdx = 0;

        if (window.innerWidth < 1024) {
          // Na mobile sekcje mają różne wysokości (np. Cennik jest długi).
          // Znajdujemy najniższą sekcję, której punkt startowy przeszedł przez środek/górę ekranu.
          const maxScr = ScrollTrigger.maxScroll(window);
          const offsetRatio = maxScr > 0 ? (window.innerHeight * 0.4) / maxScr : 0;
          for (let i = pts.length - 1; i >= 0; i--) {
            if (self.progress + offsetRatio >= pts[i]) {
              activeIdx = i;
              break;
            }
          }
        } else {
          // Na desktopie (poziomy scroll) szukamy najbliższego punktu snapowania
          let minDist = Infinity;
          pts.forEach((p, i) => {
            const d = Math.abs(self.progress - p);
            if (d < minDist) { minDist = d; activeIdx = i; }
          });
        }

        setActiveDot(prev => prev !== activeIdx ? activeIdx : prev);
      },
    });

    // Small delay to ensure DOM paints before calculating layout
    setTimeout(() => {
      ScrollTrigger.refresh();
      buildSnapPoints();
    }, 100);

    const handleLoad = () => {
      ScrollTrigger.refresh();
      buildSnapPoints();
    };
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);

  }, { scope: containerRef, dependencies: [] });

  const scrollToSection = useCallback((index: number) => {
    const gsap = gsapRef.current;
    const ScrollTrigger = stRef.current;
    if (!gsap || !ScrollTrigger) return; 
    playNavClick();
    pushGTMEvent('nawigacja_klikniecie', { sekcja_docelowa: NAV_DOTS.find((d) => d.id === index)?.title ?? 'Nieznana' });
    const targetY = snapPointsRef.current[index] * ScrollTrigger.maxScroll(window);
    gsap.to(window, { scrollTo: targetY, duration: 1.2, ease: 'power3.inOut', overwrite: 'auto' });
  }, [playNavClick]);

  // Obsługa URL z hashem (np. /#cennik) dla poprawnego scrollowania GSAP z innych podstron
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#cennik') scrollToSection(13);
      if (hash === '#faq') scrollToSection(14);
    };

    // Lekkie opóźnienie na start, aby ScrollTrigger policzył wysokości
    const timeout = setTimeout(handleHash, 600);
    window.addEventListener('hashchange', handleHash);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('hashchange', handleHash);
    };
  }, [scrollToSection]);

  // Keyboard: arrows navigate sections, Escape closes demo
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openDemo) { setOpenDemo(null); return; }
      if (openDemo) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToSection(Math.min(NAV_DOTS.length - 1, activeDot + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToSection(Math.max(0, activeDot - 1));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [openDemo, activeDot, scrollToSection]);

  const handleOpenDemo = useCallback((config: DemoConfig) => {
    if (typeof window !== 'undefined') setViewMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
    pushGTMEvent('otwarcie_dema', { nazwa_projektu: config.title });
    setOpenDemo(config);
  }, []);

  return (
    <div className="relative">
      <div className="fixed inset-0 z-[-1] bg-slate-50 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_80%_80%_at_0%_50%,#000_30%,transparent_100%)] opacity-80 pointer-events-none" />
      </div>

      <div ref={containerRef} className="relative text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
        
        <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-24 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 z-50 flex-col items-center justify-center shadow-sm">

          <div className="relative h-[60vh] w-4 mt-8">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-slate-200 rounded-full" />
            <motion.div className="absolute left-1/2 -translate-x-1/2 top-0 w-1 bg-orange-500 rounded-full origin-top z-0" style={{ height: lavaHeight }} />
            
            {NAV_DOTS.map((dot, index) => {
              const isActive = activeDot === index;
              const isPassed = index < activeDot;
              let dotClasses = 'bg-white border-slate-200';
              let textClasses = 'opacity-0 group-hover:opacity-50 text-slate-900';

              if (isActive) {
                dotClasses = 'bg-orange-500 border-orange-500 shadow-[0_0_12px_#ea580c] scale-125';
                textClasses = 'opacity-100 text-orange-600 scale-110 font-bold';
              } else if (isPassed) {
                dotClasses = 'bg-orange-500 border-orange-500';
                textClasses = 'opacity-0 group-hover:opacity-100 text-orange-500';
              }

              return (
                <button
                  key={dot.id}
                  onClick={() => scrollToSection(dot.id)}
                  className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border cursor-pointer group hover:scale-150 transition-all duration-300 z-10 ${dotClasses}`}
                  style={{ top: `${snapPointsRef.current[index] * 100}%` }}
                >
                  <span className={`absolute left-8 text-[10px] uppercase font-mono tracking-widest transition-all duration-300 whitespace-nowrap ${textClasses}`}>{dot.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ─── Floating Desktop Nav: Section Name + Socials + CTA ─── */}
        <div className="hidden lg:flex fixed bottom-10 left-1/2 -translate-x-1/2 z-50 items-center">

          {/* Main pill: section name + Socials + CTA */}
          <div className="flex items-center bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-full px-2 py-1.5 shadow-premium">
            <div className="px-4 py-1.5 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-sm" />
              <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest min-w-[80px]">
                {NAV_DOTS[activeDot]?.title || '...'}
              </span>
            </div>
            
            <div className="w-px h-5 bg-slate-200 mx-2" />
            
            <div className="flex items-center px-1">
              <a href="https://www.linkedin.com/in/marcin-molenda-447251289/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors" title="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href="https://www.facebook.com/molendadevelopment/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors" title="Facebook">
                <Facebook size={16} />
              </a>
            </div>

            <div className="w-px h-5 bg-slate-200 mx-2" />

            <button 
              onClick={() => scrollToSection(15)}
              className="group relative ml-1 px-6 py-2 bg-orange-500 text-white font-black uppercase text-[10px] tracking-[0.15em] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(234,88,12,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">DARMOWA WYCENA</span>
            </button>
          </div>
        </div>

        {/* Mobile TOC Popover */}
        <AnimatePresence>
          {isMobileTocOpen && (
            <>
              <div 
                className="fixed inset-0 z-30 lg:hidden" 
                onClick={() => setIsMobileTocOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex lg:hidden fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-[320px] bg-white/95 backdrop-blur-3xl border border-slate-200 rounded-2xl z-40 overflow-hidden shadow-premium flex-col"
              >
              <div className="max-h-[50vh] overflow-y-auto py-2 px-2 custom-scrollbar" data-lenis-prevent="true">
                {NAV_DOTS.map((dot, idx) => (
                  <button
                    key={dot.id}
                    onClick={() => {
                      scrollToSection(dot.id);
                      setIsMobileTocOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase transition-colors flex items-center justify-between ${
                      activeDot === idx ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate pr-2">{dot.title}</span>
                    {activeDot === idx && <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-orange-500 shadow-[0_0_8px_#ea580c]" />}
                  </button>
                ))}
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>

        <nav className="flex lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[440px] bg-white/90 backdrop-blur-2xl border border-slate-200/50 rounded-2xl z-50 items-center justify-between px-3 py-3 shadow-premium">
          <button 
            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
            className="flex flex-col gap-1.5 w-[35%] overflow-hidden pl-2 text-left group"
          >
            <div className="text-[9px] font-mono font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-widest truncate flex items-center gap-1.5 w-full">
              <span className="w-1 h-1 shrink-0 rounded-full bg-orange-500 shadow-[0_0_4px_#ea580c]" />
              <span className="truncate">{NAV_DOTS[activeDot]?.title || 'Przewijaj'}</span>
              <ChevronUp size={10} className={`shrink-0 text-slate-500 transition-transform duration-300 ${isMobileTocOpen ? 'rotate-180' : ''}`} />
            </div>
            <div className="relative w-full h-1 flex items-center shrink-0">
              <div className="absolute left-0 right-0 h-full bg-slate-200 rounded-full" />
              <motion.div className="absolute left-0 h-full bg-orange-500 rounded-full z-0 shadow-[0_0_8px_#ea580c]" style={{ width: lavaWidth }} />
            </div>
          </button>

          <div className="flex items-center opacity-80">
            <a href="https://www.linkedin.com/in/marcin-molenda-447251289/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="https://www.facebook.com/molendadevelopment/" target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          </div>

          <button 
            onClick={() => {
              pushGTMEvent('mobile_nav_cta_click');
              setIsBottomSheetOpen(true);
            }} 
            className="px-4 py-2.5 bg-orange-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg transition-all active:scale-95 whitespace-nowrap shadow-[0_4px_12px_rgba(234,88,12,0.3)]"
          >
            DARMOWA WYCENA
          </button>
        </nav>

        <main className="pl-0 lg:pl-24 w-full overflow-clip">
          <div ref={horizontal1Ref} className="flex flex-col lg:flex-row w-full lg:w-[400%] h-auto lg:h-screen bg-transparent">
            <Hero onNavigate={scrollToSection} />
            <AboutMeSection />
            <ProblemSection />
            <section id="rozwiazania" className="w-full lg:w-1/4 h-auto lg:h-full flex items-center justify-center px-6 sm:px-10 lg:px-12 py-20 lg:py-0 relative overflow-hidden bg-transparent shrink-0">
              <div className="flex flex-col gap-8 lg:gap-10 max-w-5xl w-full relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
                  <MagicBento className="md:col-span-2 bg-white border border-slate-200 hover:border-orange-300 transition-all group shadow-premium-soft">
                    <div className="flex items-center justify-between mb-6">
                      <Zap className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-[10px] text-slate-500">Rozwiązanie 01</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2 flex items-center">
                      <span className="text-orange-500 mr-2">&gt;</span>Sprzedaż bez przestojów 24/7
                    </h3>
                    <p 
                      className="text-slate-600 font-normal text-sm md:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: fixOrphans("Zamiast ciężkiego WordPressa otrzymujesz ultraszybki sklep, w którym klienci kupują bez błędów czy zawieszeń, nawet w nocy.") }}
                    />
                  </MagicBento>

                  <MagicBento className="md:col-span-1 bg-white border border-slate-200 hover:border-orange-300 transition-all group shadow-premium-soft">
                    <div className="flex items-center justify-between mb-6">
                      <Smartphone className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-[10px] text-slate-500">Rozwiązanie 02</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2 flex items-center">
                      <span className="text-orange-500 mr-2">&gt;</span>Koniec z papierologią
                    </h3>
                    <p 
                      className="text-slate-600 font-normal text-sm md:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: fixOrphans("Własne systemy rezerwacji i panele klienta, które same robią za Ciebie najgorszą papierkową robotę.") }}
                    />
                  </MagicBento>

                  <MagicBento className="md:col-span-1 bg-white border border-slate-200 hover:border-orange-300 transition-all group shadow-premium-soft">
                    <div className="flex items-center justify-between mb-6">
                      <Gauge className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-[10px] text-slate-500">Rozwiązanie 03</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2 flex items-center">
                      <span className="text-orange-500 mr-2">&gt;</span>Zero straconych klientów
                    </h3>
                    <p 
                      className="text-slate-600 font-normal text-sm md:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: fixOrphans('Twoja oferta ładuje się w ułamek sekundy, zanim klient zdąży pójść do konkurencji.') }}
                    />
                  </MagicBento>

                  <MagicBento className="md:col-span-2 bg-white border border-slate-200 hover:border-orange-300 transition-all group shadow-premium-soft">
                    <div className="flex items-center justify-between mb-6">
                      <Code2 className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-[10px] text-slate-500">Rozwiązanie 04</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-2 flex items-center">
                      <span className="text-orange-500 mr-2">&gt;</span>Inteligentna Automatyzacja
                    </h3>
                    <p 
                      className="text-slate-600 font-normal text-sm md:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: fixOrphans("System sam wystawia faktury, wysyła maile do klientów i powiadomienia do księgowości, odzyskując Twoje wolne wieczory.") }}
                    />
                  </MagicBento>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
                      <Terminal size={16} className="text-orange-500" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Gwarancja jakości:</span>
                  </div>
                  <p className="text-[11px] lg:text-xs text-slate-600 font-medium leading-relaxed text-center sm:text-left">
                    {fixOrphans(`Moje wsparcie obejmuje pełne spektrum techniczne: od `)}<span className="text-slate-900 font-bold">mikro-optymalizacji</span>{fixOrphans(` (np. szybkość obrazów, poprawa LCP) po `)}<span className="text-slate-900 font-bold">złożone systemy dedykowane</span>{fixOrphans(`. Niezależnie od skali zadania, jakość kodu pozostaje bezkompromisowa.`)}
                  </p>
                </motion.div>
              </div>
            </section>
          </div>

          <HowItWorksSection />
          <SandboxSection />
          <BenefitsSection />

          <div ref={horizontal2Ref} className="flex flex-col lg:flex-row w-full lg:w-[600%] h-auto lg:h-screen bg-transparent">
            
            <section id="portfolio" className="w-full lg:w-1/6 h-auto lg:h-full flex flex-col items-center justify-center bg-transparent relative py-20 lg:py-0 border-y lg:border-none border-slate-100">
              <div className="absolute -top-40 -left-40 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="font-mono text-[10px] text-orange-500 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                WDROŻONE PROJEKTY
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl xl:text-[5.5rem] font-black tracking-tighter leading-tight mb-8 text-slate-900">
                Moje<br />realizacje
              </h2>
            </section>

            <section id="dzikistyl" className="w-full lg:w-1/6 h-auto lg:h-full flex items-center justify-center bg-transparent lg:border-l border-slate-200 px-6 lg:px-20 py-20 lg:py-0">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
                <div className="space-y-6 text-center lg:text-left order-2 lg:order-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-md mx-auto lg:mx-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">E-commerce B2B</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl text-slate-900 tracking-tighter">DzikiStyl.com</h2>
                  <div className="space-y-4 text-sm sm:text-base font-normal leading-relaxed">
                    <p className="text-slate-600"><strong className="text-slate-900">Wyzwanie:</strong> {fixOrphans(`Przestarzała platforma (Shoper/Wix) nie radziła sobie z tysiącami wariantów produktów dla klientów B2B i "zapychała się" przy gigabajtowych plikach od agencji reklamowych.`)}</p>
                    
                    <p className="text-slate-600"><strong className="text-slate-900">Rozwiązanie:</strong> {fixOrphans(`Stworzyłem od zera ultraszybką platformę z innowacyjnym konfiguratorem ("Frictionless Checkout"), podglądem znakowania na żywo i systemem automatycznej weryfikacji plików do druku w chmurze.`)}</p>
                    
                    <div className="p-4 rounded-xl bg-orange-50 border-l-4 border-l-orange-500 mt-4">
                      <p className="text-slate-900 font-medium"><strong className="text-orange-500">Wynik Biznesowy:</strong> {fixOrphans(`Drastyczny skok konwersji dzięki poprawie szybkości. Automatyzacja wyeliminowała 90% pomyłek w druku i zaoszczędziła setki godzin pracy zespołu.`)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center lg:justify-start pt-4">
                    <MagneticWrapper>
                      <button onClick={() => {
                        pushGTMEvent('portfolio_uruchomiono_demo', { projekt: 'DzikiStyl' });
                        handleOpenDemo({ url: 'https://dzikistyldemo.vercel.app/', title: 'dzikistyl.com', colorClass: 'text-orange-500', bgClass: 'bg-orange-500' });
                      }} className="px-8 py-4 bg-orange-500 text-white font-mono uppercase text-[10px] lg:text-xs tracking-widest rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors flex items-center gap-3">
                        <Terminal size={14} />
                        <span>Zobacz system na żywo</span>
                      </button>
                    </MagneticWrapper>
                  </div>
                </div>
                <div onClick={() => {
                  pushGTMEvent('portfolio_obraz_uruchomiono_demo', { projekt: 'DzikiStyl' });
                  handleOpenDemo({ url: 'https://dzikistyldemo.vercel.app/', title: 'dzikistyl.com', colorClass: 'text-orange-500', bgClass: 'bg-orange-500' });
                }} className="aspect-4/3 w-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative group shadow-premium cursor-pointer order-1 lg:order-2">
                  <Image src="/dzikistyl.jpg" alt="DzikiStyl" fill priority quality={80} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-mono font-bold text-[10px] uppercase tracking-widest bg-orange-500 px-6 py-3 rounded-lg shadow-xl border border-orange-400/20">Sprawdź działanie</span>
                  </div>
                </div>
              </div>
            </section>

            <section id="sklepurwis" className="w-full lg:w-1/6 h-auto lg:h-full flex items-center justify-center bg-transparent lg:border-l border-slate-200 px-6 lg:px-20 py-20 lg:py-0">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
                <div className="space-y-6 text-center lg:text-left order-2 lg:order-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-md mx-auto lg:mx-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Grywalizacja / PWA</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl text-slate-900 tracking-tighter">Sklep Urwis</h2>
                  <div className="space-y-4 text-sm sm:text-base font-normal leading-relaxed">
                    <p className="text-slate-600"><strong className="text-slate-900">Wyzwanie:</strong> {fixOrphans(`Sklep stacjonarny potrzebował nowoczesnego kanału dotarcia do klientów, angażując dzieci i rodziców bez wymuszania instalacji ciężkich aplikacji z Google Play/App Store.`)}</p>
                    <p className="text-slate-600"><strong className="text-slate-900">Rozwiązanie:</strong> {fixOrphans(`Stworzyłem angażującą aplikację przeglądarkową niewymagającą instalacji, wyposażoną w interaktywne gry, moduł rozszerzonej rzeczywistości i wirtualnego doradcę wspieranego sztuczną inteligencją.`)}</p>
                    <div className="p-4 rounded-xl bg-blue-50 border-l-4 border-l-blue-500 mt-4">
                      <p className="text-slate-900 font-medium"><strong className="text-blue-600">Wynik Biznesowy:</strong> {fixOrphans(`Zbudowanie wysoce zaangażowanej bazy lojalnych klientów. Grywalizacja zauważalnie zwiększyła częstotliwość powrotów do sklepu i średnią wartość koszyka zakupowego.`)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center lg:justify-start pt-4">
                    <MagneticWrapper>
                      <button onClick={() => {
                        pushGTMEvent('portfolio_uruchomiono_demo', { projekt: 'Sklep Urwis' });
                        handleOpenDemo({ url: 'https://www.sklep-urwis.pl', title: 'sklep-urwis.pl', colorClass: 'text-orange-500', bgClass: 'bg-orange-500' });
                      }} className="px-8 py-4 bg-orange-500 text-white font-mono uppercase text-[10px] lg:text-xs tracking-widest rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors flex items-center gap-3">
                        <Terminal size={14} />
                        <span>Zobacz system na żywo</span>
                      </button>
                    </MagneticWrapper>
                  </div>
                </div>
                <div 
                  className="aspect-4/3 w-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative group shadow-premium order-1 lg:order-2 cursor-pointer"
                  onClick={() => {
                    pushGTMEvent('portfolio_obraz_uruchomiono_demo', { projekt: 'Sklep Urwis' });
                    handleOpenDemo({ url: 'https://www.sklep-urwis.pl', title: 'sklep-urwis.pl', colorClass: 'text-orange-500', bgClass: 'bg-orange-500' });
                  }}
                >
                  <AnimatedWebP src="/sklepurwis.webp" alt="Sklep Urwis" className="opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 object-cover" />
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-mono font-bold text-[10px] uppercase tracking-widest bg-orange-500 px-6 py-3 rounded-lg shadow-xl border border-orange-400/20">Sprawdź działanie</span>
                  </div>
                </div>
              </div>
            </section>

            <section id="zamowtu" className="w-full lg:w-1/6 h-auto lg:h-full flex items-center justify-center bg-transparent lg:border-l border-slate-200 px-6 lg:px-20 py-20 lg:py-0 border-t lg:border-none">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
                <div className="space-y-6 text-center lg:text-left order-2 lg:order-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-md mx-auto lg:mx-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">SaaS / Fintech</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl text-slate-900 tracking-tighter">zamowtu.pl</h2>
                  <div className="space-y-4 text-sm sm:text-base font-normal leading-relaxed">
                    <p className="text-slate-600"><strong className="text-slate-900">Wyzwanie:</strong> {fixOrphans(`Restauratorzy tracili gigantyczne prowizje na rzecz zewnętrznych portali dostaw, potrzebując niezależnego systemu transakcyjnego z możliwością edycji menu w locie.`)}</p>
                    <p className="text-slate-600"><strong className="text-slate-900">Rozwiązanie:</strong> {fixOrphans(`Zbudowanie od zera kompleksowej platformy sprzedażowej z obsługą natychmiastowych, automatycznych płatności i w pełni bezpiecznym, niezależnym systemem kont dla menedżerów.`)}</p>
                    <div className="p-4 rounded-xl bg-orange-50 border-l-4 border-l-orange-500 mt-4">
                      <p className="text-slate-900 font-medium"><strong className="text-orange-500">Wynik Biznesowy:</strong> {fixOrphans(`Restauracje odzyskały do 30% marży z każdego zamówienia, uniezależniając się od monopolu rynkowych gigantów i zyskując bezpośredni kontakt ze swoimi klientami.`)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center lg:justify-start pt-4">
                    <MagneticWrapper>
                      <button onClick={() => {
                        pushGTMEvent('portfolio_uruchomiono_demo', { projekt: 'zamowtu.pl' });
                        handleOpenDemo({ url: 'https://zamówtu.pl/demo', title: 'zamowtu.pl', colorClass: 'text-orange-500', bgClass: 'bg-orange-500' });
                      }} className="px-8 py-4 bg-orange-500 text-white font-mono uppercase text-[10px] lg:text-xs tracking-widest rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors flex items-center gap-3">
                        <Terminal size={14} />
                        <span>Zobacz system na żywo</span>
                      </button>
                    </MagneticWrapper>
                  </div>
                </div>
                <div onClick={() => {
                  pushGTMEvent('portfolio_obraz_uruchomiono_demo', { projekt: 'zamowtu.pl' });
                  handleOpenDemo({ url: 'https://zamówtu.pl/demo', title: 'zamowtu.pl', colorClass: 'text-orange-500', bgClass: 'bg-orange-500' });
                }} className="aspect-4/3 w-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative group shadow-premium cursor-pointer order-1 lg:order-2">
                  <Image src="/zamowtu.webp" alt="zamowtu.pl" fill priority quality={80} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-mono font-bold text-[10px] uppercase tracking-widest bg-orange-500 px-6 py-3 rounded-lg shadow-xl border border-orange-400/20">Sprawdź działanie</span>
                  </div>
                </div>
              </div>
            </section>

            <section id="kajaki" className="w-full lg:w-1/6 h-auto lg:h-full flex items-center justify-center bg-transparent lg:border-l border-slate-200 px-6 lg:px-20 py-20 lg:py-0 border-t lg:border-none">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
                <div className="space-y-6 text-center lg:text-left order-2 lg:order-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-md mx-auto lg:mx-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Wizerunek / SEO</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl text-slate-900 tracking-tighter">Kajaki u Maćka</h2>
                  <div className="space-y-4 text-sm sm:text-base font-normal leading-relaxed">
                    <p className="text-slate-600"><strong className="text-slate-900">Wyzwanie:</strong> {fixOrphans(`Lokalny biznes turystyczny potrzebował nowoczesnego wizerunku w sieci oraz konfiguracji Social Mediów i map Google, by wyróżnić się na tle ogromnej konkurencji.`)}</p>
                    <p className="text-slate-600"><strong className="text-slate-900">Rozwiązanie:</strong> {fixOrphans(`Zbudowałem błyskawiczny landing page z automatycznym systemem pozyskiwania opinii. Skonfigurowałem fanpage i Wizytówkę Google z pełną spójnością wizualną i techniczną.`)}</p>
                    <div className="p-4 rounded-xl bg-orange-50 border-l-4 border-l-orange-500 mt-4">
                      <p className="text-slate-900 font-medium"><strong className="text-orange-500">Wynik Biznesowy:</strong> {fixOrphans(`Skokowy wzrost zaufania u nowych klientów i błyskawiczne pozyskiwanie pozytywnych opinii (5 gwiazdek), co w pełni napędza rezerwacje na nadchodzące weekendy bez wydawania złotówki na reklamy.`)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center lg:justify-start pt-4">
                    <MagneticWrapper>
                      <button onClick={() => {
                        pushGTMEvent('portfolio_uruchomiono_demo', { projekt: 'Kajaki u Maćka' });
                        handleOpenDemo({ url: 'https://kajaki-u-macka.pl', title: 'kajaki-u-macka.pl', colorClass: 'text-emerald-500', bgClass: 'bg-orange-500' });
                      }} className="px-8 py-4 bg-orange-500 text-white font-mono uppercase text-[10px] lg:text-xs tracking-widest rounded-lg shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors flex items-center gap-3">
                        <Terminal size={14} />
                        <span>Zobacz system na żywo</span>
                      </button>
                    </MagneticWrapper>
                  </div>
                </div>
                <div 
                  className="aspect-4/3 w-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative group shadow-premium order-1 lg:order-2 cursor-pointer"
                  onClick={() => {
                    pushGTMEvent('portfolio_obraz_uruchomiono_demo', { projekt: 'Kajaki u Maćka' });
                    handleOpenDemo({ url: 'https://kajaki-u-macka.pl', title: 'kajaki-u-macka.pl', colorClass: 'text-emerald-500', bgClass: 'bg-orange-500' });
                  }}
                >
                  <AnimatedWebP src="/kajaki.png" alt="Kajaki u Maćka" className="opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 object-cover" />
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-mono font-bold text-[10px] uppercase tracking-widest bg-orange-500 px-6 py-3 rounded-lg shadow-xl border border-orange-400/20">Sprawdź działanie</span>
                  </div>
                </div>
              </div>
            </section>

            <section id="referencje" className="w-full lg:w-1/6 h-auto lg:h-full flex items-center justify-center bg-transparent lg:border-l border-slate-200 px-4 lg:px-12 py-20 lg:py-0 border-t lg:border-none">
              <div className="flex flex-col w-full max-w-7xl mx-auto relative z-10 gap-8 px-2 py-10 lg:py-12">
                
                {/* Michał - DzikiStyl */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full gap-6 lg:gap-10">
                  <div className="shrink-0 relative z-20">
                    <a href="https://dzikistyldemo.vercel.app/" target="_blank" rel="noopener noreferrer" className="block w-40 h-40 lg:w-56 lg:h-56 rounded-full border-[3px] border-orange-500 bg-white shadow-premium relative group overflow-hidden transition-transform duration-500 hover:scale-105">
                      <Image src="/DzikiMichał.jpg" alt="Michał - DzikiStyl" fill sizes="224px" quality={80} className="object-cover absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Image src="/dzikistyl-logo.png" alt="DzikiStyl Logo" fill sizes="224px" quality={80} className="object-contain scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply" />
                      </div>
                    </a>
                  </div>
                  <div className="relative w-full lg:w-2/3 bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-premium-soft">
                    <div className="hidden lg:block absolute top-12 -left-[16px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[16px] border-r-slate-200"></div>
                    <div className="hidden lg:block absolute top-12 -left-[15px] w-0 h-0 border-y-[15px] border-y-transparent border-r-[15px] border-r-white z-10"></div>
                    <div className="mb-4">
                      <h3 className="text-orange-500 font-bold tracking-widest uppercase text-sm">Komentarz Michała</h3>
                      <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest mt-1">Właściciel, DzikiStyl.com</p>
                    </div>
                    <div className="w-full h-px bg-slate-100 mb-4" />
                    <p className="text-sm font-normal text-slate-600 leading-relaxed italic text-left">
                      &quot;{fixOrphans(`Przez lata sam rzeźbiłem stronę DzikiStyl i zawsze był ten sam ból – żadna platforma nie była w stanie udźwignąć moich skomplikowanych wymagań dotyczących personalizacji. `)}<strong className="text-slate-900 font-medium">{fixOrphans(`To, co Marcin (Molenda Development) robi w pojedynkę, po prostu przekracza ludzkie pojęcie i technologicznie wyprzedza nasze czasy o 5 lat do przodu!`)}</strong>{fixOrphans(` Z całego serca polecam usługi Molenda Development każdemu. `)}<strong className="text-orange-500 font-medium">{fixOrphans(`Wielkie dzięki – zrobiłeś absolutny kosmos!`)}</strong>&quot;
                    </p>
                  </div>
                </div>

                {/* Krzysztof - Sklep Urwis */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full gap-6 lg:gap-10">
                  <div className="shrink-0 relative z-20">
                    <a href="https://www.sklep-urwis.pl" target="_blank" rel="noopener noreferrer" className="block w-40 h-40 lg:w-56 lg:h-56 rounded-full border-[3px] border-blue-500 bg-white shadow-premium relative group overflow-hidden transition-transform duration-500 hover:scale-105">
                      <Image src="/Krzysztof_Urwis.jpg" alt="Krzysztof - Sklep Urwis" fill sizes="224px" quality={80} className="object-cover absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Image src="/sklepurwis-logo.png" alt="Urwis Logo" fill sizes="224px" quality={80} className="object-contain scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply" />
                      </div>
                    </a>
                  </div>
                  <div className="relative w-full lg:w-2/3 bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-premium-soft">
                    <div className="hidden lg:block absolute top-12 -left-[16px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[16px] border-r-slate-200"></div>
                    <div className="hidden lg:block absolute top-12 -left-[15px] w-0 h-0 border-y-[15px] border-y-transparent border-r-[15px] border-r-white z-10"></div>
                    <div className="mb-4">
                      <h3 className="text-blue-500 font-bold tracking-widest uppercase text-sm">Komentarz Krzysztofa</h3>
                      <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest mt-1">Właściciel, Sklep-Urwis.pl</p>
                    </div>
                    <div className="w-full h-px bg-slate-100 mb-4" />
                    <p className="text-sm font-normal text-slate-600 leading-relaxed italic text-left">
                      &quot;{fixOrphans(`Polecam z całego serca. Marcin stworzył dla mojego sklepu z zabawkami aplikację, która ma w sobie wszystko (i jeszcze więcej!) - koło fortuny z rabatami, strefę zabawy z grami na telefon i kolorowanki z naszym Urwisem. `)}<strong className="text-slate-900 font-medium">{fixOrphans(`Zarówno strona sklepu, jak i aplikacja PWA przeszły moje najśmielsze oczekiwania`)}</strong> - <strong className="text-blue-600 font-medium">{fixOrphans(`czysty profesjonalizm i masa bajerów.`)}</strong>&quot;
                    </p>
                  </div>
                </div>

                {/* Maciek - Kajaki u Maćka */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full gap-6 lg:gap-10 pb-12">
                  <div className="shrink-0 relative z-20">
                    <a href="https://kajaki-u-macka.pl" target="_blank" rel="noopener noreferrer" className="block w-40 h-40 lg:w-56 lg:h-56 rounded-full border-[3px] border-emerald-500 bg-white shadow-premium relative overflow-hidden transition-transform duration-500 hover:scale-105">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                        <Image src="/kajaki-u-macka-logo.png" alt="Kajaki u Maćka Logo" fill sizes="224px" quality={80} className="object-cover mix-blend-multiply" />
                      </div>
                    </a>
                  </div>
                  <div className="relative w-full lg:w-2/3 bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-premium-soft">
                    <div className="hidden lg:block absolute top-12 -left-[16px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[16px] border-r-slate-200"></div>
                    <div className="hidden lg:block absolute top-12 -left-[15px] w-0 h-0 border-y-[15px] border-y-transparent border-r-[15px] border-r-white z-10"></div>
                    <div className="mb-4">
                      <h3 className="text-emerald-500 font-bold tracking-widest uppercase text-sm">Komentarz Maćka</h3>
                      <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest mt-1">Właściciel, Kajaki u Maćka</p>
                    </div>
                    <div className="w-full h-px bg-slate-100 mb-4" />
                    <p className="text-sm font-normal text-slate-600 leading-relaxed italic text-left">
                      &quot;{fixOrphans(`O stary, `)}<strong className="text-slate-900 font-medium">{fixOrphans(`ta strona jest tak kozak, nie spodziewałem się aż takiego efektu!`)}</strong>{fixOrphans(` Wygląda naprawdę obłędnie. `)}<br></br>{fixOrphans(`Oprócz zjawiskowej strony, Marcin od zera założył i skonfigurował moją Wizytówkę Google i Fanpage na Facebooku, zachowując ten sam świetny motyw wizualny. Dał mi też potężne, praktyczne rady jak z nich korzystać, żeby skutecznie ściągać klientów na rzekę. `)}<strong className="text-emerald-600 font-medium">{fixOrphans(`Jest klasa, jesteś szef po prostu!`)}</strong>&quot;
                    </p>
                  </div>
                </div>

              </div>
            </section>
          </div>

          <div id="cennik" className="min-h-screen flex items-center border-t border-white/5 bg-transparent">
            <div className="w-full">
              <Pricing />
            </div>
          </div>

          <FAQ />
          <ContactForm />

          <footer className="w-full pt-16 pb-[240px] text-sm text-slate-500 text-center flex flex-col items-center gap-4 relative z-10 bg-slate-50 border-t border-slate-200">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <span>&copy; {new Date().getFullYear()} Marcin Molenda <span className="hidden md:inline text-slate-300">|</span> <span className="text-slate-900 font-semibold">molendadevelopment.pl</span></span>
              <span className="hidden md:inline text-slate-300">|</span>
              <Link href="/polityka-prywatnosci" className="text-slate-500 hover:text-orange-600 transition-colors underline-offset-4 hover:underline">Polityka Prywatności</Link>
            </div>
          </footer>

        </main>
      </div>

      <BottomSheet isOpen={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)}>
        <ContactForm />
      </BottomSheet>

      <AnimatePresence>
        {openDemo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 lg:p-12">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full h-full bg-white rounded-3xl lg:rounded-[2.5rem] border border-slate-200 overflow-hidden flex flex-col shadow-premium-soft">
              <div className="p-3 lg:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="flex gap-1.5 lg:gap-2 pl-2">
                    <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex bg-slate-200/50 p-1 rounded-xl gap-1">
                    <button onClick={() => setViewMode('desktop')} className={`px-3 lg:px-4 py-2 rounded-lg text-[9px] lg:text-[10px] font-mono uppercase flex items-center gap-1.5 lg:gap-2 transition-all ${viewMode === 'desktop' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                      <Monitor size={14} className="hidden sm:block" /> Desktop
                    </button>
                    <button onClick={() => setViewMode('mobile')} className={`px-3 lg:px-4 py-2 rounded-lg text-[9px] lg:text-[10px] font-mono uppercase flex items-center gap-1.5 lg:gap-2 transition-all ${viewMode === 'mobile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                      <PhoneIcon size={14} className="hidden sm:block" /> Mobile
                    </button>
                  </div>
                </div>
                <div className="text-[9px] lg:text-[10px] text-slate-400 font-mono uppercase tracking-widest hidden md:block truncate max-w-[200px]">Preview // {openDemo.title}</div>
                <button onClick={() => setOpenDemo(null)} aria-label="Zamknij" className="p-2 lg:p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900 cursor-pointer"><X size={20} /></button>
              </div>
              <div className="flex-1 bg-slate-100 flex justify-center items-center overflow-hidden p-2 lg:p-4">
                <motion.div animate={{ width: viewMode === 'desktop' ? '100%' : '375px', height: viewMode === 'desktop' ? '100%' : '812px', borderRadius: viewMode === 'desktop' ? '0px' : '36px' }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className={`bg-white shadow-2xl overflow-hidden relative flex flex-col ${viewMode === 'mobile' ? 'border-[6px] lg:border-8 border-slate-800' : ''}`}>
                  <div className="flex-1 w-full relative"><iframe src={openDemo.url} title={`Podgląd projektu: ${openDemo.title}`} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" className="absolute inset-0 w-full h-full border-none pointer-events-auto bg-white" /></div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}