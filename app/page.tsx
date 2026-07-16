'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Facebook, Linkedin, Monitor, Smartphone as PhoneIcon, X, ChevronUp } from 'lucide-react';
import Hero from '@/components/Hero';
import Link from 'next/link';
import BottomSheet from '@/components/ui/BottomSheet';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { SolutionsSection } from '@/components/sections/SolutionsSection';
import { AboutMeSection } from '@/components/sections/AboutMeSection';
import dynamic from 'next/dynamic';
const ContactForm = dynamic(() => import('@/components/ui/ContactForm'), { ssr: true });
const FAQ = dynamic(() => import('@/components/ui/FAQ'), { ssr: true });
const Pricing = dynamic(() => import('@/components/Pricing'), { ssr: true });
const SandboxSection = dynamic(() => import('@/components/sections/SandboxSection').then(mod => mod.SandboxSection), { ssr: true });
const HowItWorksSection = dynamic(() => import('@/components/sections/HowItWorksSection').then(mod => mod.HowItWorksSection), { ssr: true });
const BenefitsSection = dynamic(() => import('@/components/sections/BenefitsSection').then(mod => mod.BenefitsSection), { ssr: true });
const HorizontalProjectsSection = dynamic(() => import('@/components/sections/HorizontalProjectsSection'), { ssr: true });
const RealPerformanceMetrics = dynamic(() => import('@/components/ui/RealPerformanceMetrics').then(mod => mod.RealPerformanceMetrics), { ssr: true });
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

    const handleCustomNavScroll = (e: Event) => {
      const hash = (e as CustomEvent).detail;
      if (hash === '#cennik') scrollToSection(13);
      if (hash === '#faq') scrollToSection(14);
    };

    // Lekkie opóźnienie na start, aby ScrollTrigger policzył wysokości
    const timeout = setTimeout(handleHash, 600);
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('nav-scroll', handleCustomNavScroll);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('nav-scroll', handleCustomNavScroll);
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
            <SolutionsSection />
          </div>

          <HowItWorksSection />
          <SandboxSection />
          <BenefitsSection />

          <HorizontalProjectsSection ref={horizontal2Ref} handleOpenDemo={handleOpenDemo} />

          <RealPerformanceMetrics />

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