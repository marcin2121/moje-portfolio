'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Code2, Smartphone, Zap, Gauge, ArrowRight, Facebook, Linkedin, Github, Monitor, Smartphone as PhoneIcon, X, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import MagicBento from '@/components/ui/MagicBento';
import Hero from '@/components/Hero';
import MagneticWrapper from '@/components/ui/MagneticWrapper';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import AnimatedWebP from '@/components/ui/AnimatedWebP';
import Link from 'next/link';
import TiltCard from '@/components/ui/TiltCard';
import BottomSheet from '@/components/ui/BottomSheet';
import { HeaderToggle } from '@/components/sections/HeaderToggle';
import { ProblemSection } from '@/components/sections/ProblemSection';
import ContactForm from '@/components/ui/ContactForm';
import FAQ from '@/components/ui/FAQ';
import Pricing from '@/components/Pricing';
import { SandboxSection } from '@/components/sections/SandboxSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { fixOrphans } from '@/utils/typography';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);
}

const Particles = dynamic(() => import('@/components/ui/Particles'), { ssr: false });

// Usunięto rIC i cIC

type DemoConfig = {
  url: string;
  title: string;
  colorClass: string;
  bgClass: string;
};

const NAV_DOTS = [
  { id: 0, title: 'Start' },
  { id: 1, title: 'Problemy' },
  { id: 2, title: 'Rozwiązania' },
  { id: 3, title: 'Proces' },
  { id: 4, title: 'Symulacja' },
  { id: 5, title: 'Benefity' },
  { id: 6, title: 'Portfolio' },
  { id: 7, title: 'DzikiStyl.com' },
  { id: 8, title: 'Sklep Urwis' },
  { id: 9, title: 'zamowtu.pl' },
  { id: 10, title: 'Kajaki u Maćka' },
  { id: 11, title: 'Referencje' },
  { id: 12, title: 'Cennik' },
  { id: 13, title: 'FAQ' },
  { id: 14, title: 'Kontakt' },
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
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  
  const [activeDot, setActiveDot]         = useState(0);
  const [openDemo, setOpenDemo]           = useState<DemoConfig | null>(null);
  const [viewMode, setViewMode]           = useState<'desktop' | 'mobile'>('desktop');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const playRef = useRef<(() => void) | null>(null);
  const playNavClick = useCallback(() => {
    if (playRef.current) { playRef.current(); return; }
    import('use-sound').then(({ default: useSoundFactory }) => {
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

      const allST = ScrollTrigger.getAll();
      const h1 = allST.find(t => t.trigger === horizontal1Ref.current);
      const h2 = allST.find(t => t.trigger === horizontal2Ref.current);

      if (!h1 || !h2) {
        snapPointsRef.current = NAV_DOTS.map((_, i) => i / (NAV_DOTS.length - 1));
        return;
      }

      const pts: number[] = [];
      pts[0] = h1.start / maxScr;
      pts[1] = (h1.start + (h1.end - h1.start) * 0.5) / maxScr;
      pts[2] = h1.end / maxScr;
      
      const getDomRatio = (id: string, fallback: number) => {
        const el = document.getElementById(id);
        return el ? (window.scrollY + el.getBoundingClientRect().top) / maxScr : fallback;
      };

      pts[3] = getDomRatio('proces', (h1.end + 10) / maxScr);
      pts[4] = getDomRatio('sandbox', (h1.end + 20) / maxScr);
      pts[5] = getDomRatio('benefits', (h1.end + 30) / maxScr);
      
      const h2Dur = h2.end - h2.start;
      for (let i = 0; i < 6; i++) {
        pts[6 + i] = (h2.start + h2Dur * i / 5) / maxScr;
      }

      pts[12] = getDomRatio('pricing', (h2.end + 10) / maxScr);
      pts[13] = getDomRatio('faq', (h2.end + 20) / maxScr);
      pts[14] = Math.min(getDomRatio('kontakt', (h2.end + 30) / maxScr), 1);

      snapPointsRef.current = pts;
    };

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      gsap.to(horizontal1Ref.current, { xPercent: -66.666, ease: 'none', scrollTrigger: { trigger: horizontal1Ref.current, start: 'top top', end: '+=200%', pin: true, scrub: 0.5 } });
      gsap.to(horizontal2Ref.current, { xPercent: -83.33, ease: 'none', scrollTrigger: { trigger: horizontal2Ref.current, start: 'top top', end: '+=500%', pin: true, scrub: 0.5 } });
    });

    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onRefresh: buildSnapPoints,
      onUpdate: (self) => {
        rawProgress.set(self.progress);
        const pts = snapPointsRef.current;
        let closestIdx = 0;
        let minDist = Infinity;
        pts.forEach((p, i) => {
          const d = Math.abs(self.progress - p);
          if (d < minDist) { minDist = d; closestIdx = i; }
        });
        setActiveDot(prev => prev !== closestIdx ? closestIdx : prev);
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
      <div className="fixed inset-0 z-[-1] bg-zinc-950 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_80%_80%_at_0%_50%,#000_30%,transparent_100%)] opacity-80 pointer-events-none" />
      </div>

      <div ref={containerRef} className="relative text-zinc-50 font-sans selection:bg-orange-500 selection:text-white">
        
        <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-24 bg-zinc-950 border-r border-white/5 z-50 flex-col items-center justify-center">
          <div className="absolute top-10 w-full text-center text-[8px] font-black uppercase tracking-widest text-zinc-400 italic px-2 leading-tight">
            Marcin Molenda<br />Development
          </div>
          <div className="relative h-[60vh] w-4 mt-8">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white/5 rounded-full" />
            <motion.div className="absolute left-1/2 -translate-x-1/2 top-0 w-1 bg-orange-500 rounded-full origin-top z-0" style={{ height: lavaHeight }} />
            
            {NAV_DOTS.map((dot, index) => {
              const isActive = activeDot === index;
              const isPassed = index < activeDot;
              let dotClasses = 'bg-zinc-900 border-white/10';
              let textClasses = 'opacity-0 group-hover:opacity-50 text-white';

              if (isActive) {
                dotClasses = 'bg-orange-500 border-orange-500 shadow-[0_0_12px_#ea580c] scale-125';
                textClasses = 'opacity-100 text-orange-400 scale-110 font-bold';
              } else if (isPassed) {
                dotClasses = 'bg-orange-900/60 border-orange-500/40';
                textClasses = 'opacity-0 group-hover:opacity-100 text-orange-300';
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

        {/* ─── Floating Desktop Nav: Section Name + CTA + Arrows ─── */}
        <div className="hidden lg:flex fixed bottom-10 left-1/2 -translate-x-1/2 z-50 items-center gap-3">
          {/* Arrow Up */}
          <button 
            onClick={() => scrollToSection(Math.max(0, activeDot - 1))}
            disabled={activeDot === 0}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20 disabled:hover:bg-zinc-900/80 transition-all active:scale-90"
            aria-label="Poprzednia sekcja (↑)"
          >
            <ChevronUp size={16} />
          </button>

          {/* Main pill: section name + Socials + CTA */}
          <div className="flex items-center bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8),0_0_20px_rgba(255,255,255,0.02)]">
            <div className="px-4 py-1.5 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#ea580c]" />
              <span className="font-mono text-[10px] text-zinc-300 uppercase tracking-widest min-w-[80px]">
                {NAV_DOTS[activeDot]?.title || '...'}
              </span>
            </div>
            
            <div className="w-px h-5 bg-white/10 mx-2" />
            
            <div className="flex items-center gap-1.5 px-2">
              <a href="https://github.com/marcin2121" target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-500 hover:text-white transition-colors" title="GitHub">
                <Github size={14} />
              </a>
              <a href="https://www.linkedin.com/in/marcin-molenda-447251289/" target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-500 hover:text-white transition-colors" title="LinkedIn">
                <Linkedin size={14} />
              </a>
              <a href="https://www.facebook.com/molendadevelopment/" target="_blank" rel="noopener noreferrer" className="p-1.5 text-zinc-500 hover:text-white transition-colors" title="Facebook">
                <Facebook size={14} />
              </a>
            </div>

            <div className="w-px h-5 bg-white/10 mx-2" />

            <button 
              onClick={() => scrollToSection(14)}
              className="group relative ml-1 px-6 py-2 bg-orange-500 text-white font-black uppercase text-[10px] tracking-[0.15em] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(234,88,12,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">Wyceń Projekt</span>
            </button>
          </div>

          {/* Arrow Down */}
          <button 
            onClick={() => scrollToSection(Math.min(NAV_DOTS.length - 1, activeDot + 1))}
            disabled={activeDot === NAV_DOTS.length - 1}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-20 disabled:hover:bg-zinc-900/80 transition-all active:scale-90"
            aria-label="Następna sekcja (↓)"
          >
            <ChevronDown size={16} />
          </button>
        </div>

        <nav className="flex lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[440px] bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl z-50 items-center justify-between px-3 py-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col gap-1.5 w-[35%] overflow-hidden pl-1">
            <div className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest truncate">
              {NAV_DOTS[activeDot]?.title || 'Przewijaj'}
            </div>
            <div className="relative w-full h-1 flex items-center shrink-0">
              <div className="absolute left-0 right-0 h-full bg-white/10 rounded-full" />
              <motion.div className="absolute left-0 h-full bg-orange-500 rounded-full z-0 shadow-[0_0_8px_#ea580c]" style={{ width: lavaWidth }} />
            </div>
          </div>

          <div className="flex items-center gap-1 scale-[0.85] opacity-80">
            <a href="https://github.com/marcin2121" target="_blank" rel="noopener noreferrer" className="p-1 text-zinc-400 hover:text-white transition-colors" aria-label="GitHub">
              <Github size={16} />
            </a>
            <a href="https://www.linkedin.com/in/marcin-molenda-447251289/" target="_blank" rel="noopener noreferrer" className="p-1 text-zinc-400 hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61564367727437" target="_blank" rel="noopener noreferrer" className="p-1 text-zinc-400 hover:text-white transition-colors" aria-label="Facebook">
              <Facebook size={16} />
            </a>
          </div>

          <button 
            onClick={() => {
              pushGTMEvent('mobile_nav_cta_click');
              setIsBottomSheetOpen(true);
            }} 
            className="px-4 py-2.5 bg-orange-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg transition-all active:scale-95 whitespace-nowrap shadow-[0_4px_12px_rgba(234,88,12,0.3)]"
          >
            Wyceń
          </button>
        </nav>

        <main className="pl-0 lg:pl-24 w-full overflow-clip">
          <div ref={horizontal1Ref} className="flex flex-col lg:flex-row w-full lg:w-[300%] h-auto lg:h-screen bg-transparent">
            <Hero onNavigate={scrollToSection} />
            <ProblemSection />
            <section className="w-full lg:w-1/3 h-auto lg:h-full flex items-center justify-center px-6 sm:px-10 lg:px-12 py-20 lg:py-0 relative overflow-hidden bg-transparent">
              <div className="flex flex-col gap-8 lg:gap-10 max-w-5xl w-full relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 w-full">
                  <MagicBento className="bg-zinc-950 border border-white/5 hover:border-orange-500/40 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <Zap className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-[10px] text-zinc-400">Rozwiązanie 01</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 flex items-center">
                      <span className="text-orange-500 mr-2">&gt;</span>Sprzedaż bez przestojów 24/7
                    </h3>
                    <p 
                      className="text-zinc-400 font-light text-sm md:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: fixOrphans("Zamiast ciężkiego WordPressa otrzymujesz ultraszybki sklep, w którym klienci kupują bez błędów czy zawieszeń, nawet w nocy.") }}
                    />
                  </MagicBento>

                  <MagicBento className="bg-zinc-950 border border-white/5 hover:border-orange-500/40 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <Smartphone className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-[10px] text-zinc-400">Rozwiązanie 02</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 flex items-center">
                      <span className="text-orange-500 mr-2">&gt;</span>Koniec z papierologią
                    </h3>
                    <p 
                      className="text-zinc-400 font-light text-sm md:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: fixOrphans("Własne systemy rezerwacji i panele klienta, które same robią za Ciebie najgorszą papierkową robotę i pilnują terminów.") }}
                    />
                  </MagicBento>

                  <MagicBento className="bg-zinc-950 border border-white/5 hover:border-orange-500/40 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <Gauge className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-[10px] text-zinc-400">Rozwiązanie 03</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 flex items-center">
                      <span className="text-orange-500 mr-2">&gt;</span>Zero straconych klientów
                    </h3>
                    <p 
                      className="text-zinc-400 font-light text-sm md:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: fixOrphans('Twoja oferta ładuje się w ułamek sekundy, zanim zniecierpliwiony klient zdąży kliknąć "Wstecz" i pójść do konkurencji.') }}
                    />
                  </MagicBento>

                  <MagicBento className="bg-zinc-950 border border-white/5 hover:border-orange-500/40 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <Code2 className="text-orange-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-[10px] text-zinc-400">Rozwiązanie 04</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 flex items-center">
                      <span className="text-orange-500 mr-2">&gt;</span>Inteligentna Automatyzacja
                    </h3>
                    <p 
                      className="text-zinc-400 font-light text-sm md:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: fixOrphans("System sam wystawia faktury, wysyła maile do klientów i powiadomienia do księgowości, odzyskując Twoje wolne wieczory.") }}
                    />
                  </MagicBento>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full p-6 bg-zinc-950/40 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-6"
                >
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                      <Terminal size={16} className="text-orange-500" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Gwarancja jakości:</span>
                  </div>
                  <p className="text-[11px] lg:text-xs text-zinc-400 font-light leading-relaxed text-center sm:text-left">
                    {fixOrphans(`Moje wsparcie obejmuje pełne spektrum techniczne: od `)}<span className="text-zinc-200">mikro-optymalizacji</span>{fixOrphans(` (np. szybkość obrazów, poprawa LCP) po `)}<span className="text-zinc-200">złożone systemy dedykowane</span>{fixOrphans(`. Niezależnie od skali zadania, jakość kodu pozostaje bezkompromisowa.`)}
                  </p>
                </motion.div>
              </div>
            </section>
          </div>

          <HowItWorksSection />
          <SandboxSection />
          <BenefitsSection />

          <div ref={horizontal2Ref} className="flex flex-col lg:flex-row w-full lg:w-[600%] h-auto lg:h-screen bg-transparent">
            
            <section className="w-full lg:w-1/6 h-auto lg:h-full flex flex-col items-center justify-center bg-transparent relative overflow-hidden py-20 lg:py-0 border-y lg:border-none border-white/5">
              <div className="absolute -top-40 -left-40 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-orange-900/10 blur-[120px] rounded-full pointer-events-none" />
              <div className="font-mono text-[10px] text-orange-500 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                WDROŻONE PROJEKTY
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl xl:text-[5.5rem] font-black tracking-tighter leading-tight mb-8 text-white">
                Moje<br />realizacje
              </h2>
            </section>

            <section className="w-full lg:w-1/6 h-auto lg:h-full flex items-center justify-center bg-transparent lg:border-l-2 border-white/10 px-6 lg:px-20 py-20 lg:py-0">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
                <div className="space-y-6 text-center lg:text-left order-2 lg:order-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-md mx-auto lg:mx-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="font-mono text-[9px] text-zinc-300 uppercase tracking-widest">E-commerce B2B</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl text-white tracking-tighter">DzikiStyl.com</h2>
                  <div className="space-y-4 text-sm sm:text-base font-light leading-relaxed">
                    <p className="text-zinc-400"><strong className="text-white">Wyzwanie:</strong> {fixOrphans(`Przestarzała platforma (Shoper/Wix) nie radziła sobie z tysiącami wariantów produktów dla klientów B2B i "zapychała się" przy gigabajtowych plikach od agencji reklamowych.`)}</p>
                    
                    <p className="text-zinc-400"><strong className="text-white">Rozwiązanie:</strong> {fixOrphans(`Stworzyłem od zera ultraszybką platformę z innowacyjnym konfiguratorem ("Frictionless Checkout"), podglądem znakowania na żywo i systemem automatycznej weryfikacji plików do druku w chmurze.`)}</p>
                    
                    <div className="p-4 rounded-xl bg-orange-500/10 border-l-4 border-l-orange-500 mt-4">
                      <p className="text-orange-100 font-medium"><strong className="text-orange-500">Wynik Biznesowy:</strong> {fixOrphans(`Drastyczny skok konwersji dzięki poprawie szybkości. Automatyzacja wyeliminowała 90% pomyłek w druku i zaoszczędziła setki godzin pracy zespołu.`)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center lg:justify-start pt-4">
                    <MagneticWrapper>
                      <button onClick={() => {
                        pushGTMEvent('portfolio_uruchomiono_demo', { projekt: 'DzikiStyl' });
                        handleOpenDemo({ url: 'https://dzikistyldemo.vercel.app/', title: 'dzikistyl.com', colorClass: 'text-orange-500', bgClass: 'bg-orange-800' });
                      }} className="px-8 py-4 bg-orange-800 text-white font-mono uppercase text-[10px] lg:text-xs tracking-widest rounded-lg shadow-lg hover:bg-orange-700 transition-colors flex items-center gap-3">
                        <Terminal size={14} />
                        <span>Zobacz system na żywo</span>
                      </button>
                    </MagneticWrapper>
                  </div>
                </div>
                <div onClick={() => {
                  pushGTMEvent('portfolio_obraz_uruchomiono_demo', { projekt: 'DzikiStyl' });
                  handleOpenDemo({ url: 'https://dzikistyldemo.vercel.app/', title: 'dzikistyl.com', colorClass: 'text-orange-500', bgClass: 'bg-orange-800' });
                }} className="aspect-4/3 w-full bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden relative group shadow-2xl cursor-pointer order-1 lg:order-2">
                  <Image src="/dzikistyl.jpg" alt="DzikiStyl" fill priority quality={80} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-mono font-bold text-[10px] uppercase tracking-widest bg-orange-800 px-6 py-3 rounded-lg shadow-2xl border border-orange-500/20">Sprawdź działanie</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full lg:w-1/6 h-auto lg:h-full flex items-center justify-center bg-transparent lg:border-l-2 border-white/10 px-6 lg:px-20 py-20 lg:py-0">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
                <div className="space-y-6 text-center lg:text-left order-2 lg:order-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-md mx-auto lg:mx-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="font-mono text-[9px] text-zinc-300 uppercase tracking-widest">Grywalizacja / PWA</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl text-white tracking-tighter">Sklep Urwis</h2>
                  <div className="space-y-4 text-sm sm:text-base font-light leading-relaxed">
                    <p className="text-zinc-400"><strong className="text-white">Wyzwanie:</strong> {fixOrphans(`Sklep stacjonarny potrzebował nowoczesnego kanału dotarcia do klientów, angażując dzieci i rodziców bez wymuszania instalacji ciężkich aplikacji z Google Play/App Store.`)}</p>
                    <p className="text-zinc-400"><strong className="text-white">Rozwiązanie:</strong> {fixOrphans(`Stworzyłem angażującą aplikację przeglądarkową niewymagającą instalacji, wyposażoną w interaktywne gry, moduł rozszerzonej rzeczywistości i wirtualnego doradcę wspieranego sztuczną inteligencją.`)}</p>
                    <div className="p-4 rounded-xl bg-blue-500/10 border-l-4 border-l-blue-500 mt-4">
                      <p className="text-blue-100 font-medium"><strong className="text-blue-500">Wynik Biznesowy:</strong> {fixOrphans(`Zbudowanie wysoce zaangażowanej bazy lojalnych klientów. Grywalizacja zauważalnie zwiększyła częstotliwość powrotów do sklepu i średnią wartość koszyka zakupowego.`)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center lg:justify-start pt-4">
                    <MagneticWrapper>
                      <button onClick={() => {
                        pushGTMEvent('portfolio_uruchomiono_demo', { projekt: 'Sklep Urwis' });
                        handleOpenDemo({ url: 'https://www.sklep-urwis.pl', title: 'sklep-urwis.pl', colorClass: 'text-orange-500', bgClass: 'bg-orange-800' });
                      }} className="px-8 py-4 bg-orange-800 text-white font-mono uppercase text-[10px] lg:text-xs tracking-widest rounded-lg shadow-lg hover:bg-orange-700 transition-colors flex items-center gap-3">
                        <Terminal size={14} />
                        <span>Zobacz system na żywo</span>
                      </button>
                    </MagneticWrapper>
                  </div>
                </div>
                <div 
                  className="aspect-4/3 w-full bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden relative group shadow-2xl order-1 lg:order-2 cursor-pointer"
                  onClick={() => {
                    pushGTMEvent('portfolio_obraz_uruchomiono_demo', { projekt: 'Sklep Urwis' });
                    handleOpenDemo({ url: 'https://www.sklep-urwis.pl', title: 'sklep-urwis.pl', colorClass: 'text-orange-500', bgClass: 'bg-orange-800' });
                  }}
                >
                  <AnimatedWebP src="/sklepurwis.webp" alt="Sklep Urwis" className="opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 object-cover" />
                  <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-mono font-bold text-[10px] uppercase tracking-widest bg-orange-800 px-6 py-3 rounded-lg shadow-2xl border border-orange-500/20">Sprawdź działanie</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full lg:w-1/6 h-auto lg:h-full flex items-center justify-center bg-transparent lg:border-l-2 border-white/10 px-6 lg:px-20 py-20 lg:py-0 border-t lg:border-none">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
                <div className="space-y-6 text-center lg:text-left order-2 lg:order-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-md mx-auto lg:mx-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="font-mono text-[9px] text-zinc-300 uppercase tracking-widest">SaaS / Fintech</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl text-white tracking-tighter">zamowtu.pl</h2>
                  <div className="space-y-4 text-sm sm:text-base font-light leading-relaxed">
                    <p className="text-zinc-400"><strong className="text-white">Wyzwanie:</strong> {fixOrphans(`Restauratorzy tracili gigantyczne prowizje na rzecz zewnętrznych portali dostaw, potrzebując niezależnego systemu transakcyjnego z możliwością edycji menu w locie.`)}</p>
                    <p className="text-zinc-400"><strong className="text-white">Rozwiązanie:</strong> {fixOrphans(`Zbudowanie od zera kompleksowej platformy sprzedażowej z obsługą natychmiastowych, automatycznych płatności i w pełni bezpiecznym, niezależnym systemem kont dla menedżerów.`)}</p>
                    <div className="p-4 rounded-xl bg-orange-500/10 border-l-4 border-l-orange-500 mt-4">
                      <p className="text-orange-100 font-medium"><strong className="text-orange-500">Wynik Biznesowy:</strong> {fixOrphans(`Restauracje odzyskały do 30% marży z każdego zamówienia, uniezależniając się od monopolu rynkowych gigantów i zyskując bezpośredni kontakt ze swoimi klientami.`)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center lg:justify-start pt-4">
                    <MagneticWrapper>
                      <button onClick={() => {
                        pushGTMEvent('portfolio_uruchomiono_demo', { projekt: 'zamowtu.pl' });
                        handleOpenDemo({ url: 'https://zamówtu.pl/demo', title: 'zamowtu.pl', colorClass: 'text-orange-500', bgClass: 'bg-orange-800' });
                      }} className="px-8 py-4 bg-orange-800 text-white font-mono uppercase text-[10px] lg:text-xs tracking-widest rounded-lg shadow-lg hover:bg-orange-700 transition-colors flex items-center gap-3">
                        <Terminal size={14} />
                        <span>Zobacz system na żywo</span>
                      </button>
                    </MagneticWrapper>
                  </div>
                </div>
                <div onClick={() => {
                  pushGTMEvent('portfolio_obraz_uruchomiono_demo', { projekt: 'zamowtu.pl' });
                  handleOpenDemo({ url: 'https://zamówtu.pl/demo', title: 'zamowtu.pl', colorClass: 'text-orange-500', bgClass: 'bg-orange-800' });
                }} className="aspect-4/3 w-full bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden relative group shadow-2xl cursor-pointer order-1 lg:order-2">
                  <Image src="/zamowtu.webp" alt="zamowtu.pl" fill priority quality={80} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-mono font-bold text-[10px] uppercase tracking-widest bg-orange-800 px-6 py-3 rounded-lg shadow-2xl border border-orange-500/20">Sprawdź działanie</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full lg:w-1/6 h-auto lg:h-full flex items-center justify-center bg-transparent lg:border-l-2 border-white/10 px-6 lg:px-20 py-20 lg:py-0 border-t lg:border-none">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
                <div className="space-y-6 text-center lg:text-left order-2 lg:order-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-md mx-auto lg:mx-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="font-mono text-[9px] text-zinc-300 uppercase tracking-widest">Wizerunek / SEO</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl text-white tracking-tighter">Kajaki u Maćka</h2>
                  <div className="space-y-4 text-sm sm:text-base font-light leading-relaxed">
                    <p className="text-zinc-400"><strong className="text-white">Wyzwanie:</strong> {fixOrphans(`Lokalny biznes turystyczny potrzebował nowoczesnego wizerunku w sieci oraz konfiguracji Social Mediów i map Google, by wyróżnić się na tle ogromnej konkurencji.`)}</p>
                    <p className="text-zinc-400"><strong className="text-white">Rozwiązanie:</strong> {fixOrphans(`Zbudowałem błyskawiczny landing page z automatycznym systemem pozyskiwania opinii. Skonfigurowałem fanpage i Wizytówkę Google z pełną spójnością wizualną i techniczną.`)}</p>
                    <div className="p-4 rounded-xl bg-orange-500/10 border-l-4 border-l-orange-500 mt-4">
                      <p className="text-orange-100 font-medium"><strong className="text-orange-500">Wynik Biznesowy:</strong> {fixOrphans(`Skokowy wzrost zaufania u nowych klientów i błyskawiczne pozyskiwanie pozytywnych opinii (5 gwiazdek), co w pełni napędza rezerwacje na nadchodzące weekendy bez wydawania złotówki na reklamy.`)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center lg:justify-start pt-4">
                    <MagneticWrapper>
                      <button onClick={() => {
                        pushGTMEvent('portfolio_uruchomiono_demo', { projekt: 'Kajaki u Maćka' });
                        handleOpenDemo({ url: 'https://kajaki-u-macka.pl', title: 'kajaki-u-macka.pl', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-800' });
                      }} className="px-8 py-4 bg-orange-800 text-white font-mono uppercase text-[10px] lg:text-xs tracking-widest rounded-lg shadow-lg hover:bg-orange-700 transition-colors flex items-center gap-3">
                        <Terminal size={14} />
                        <span>Zobacz system na żywo</span>
                      </button>
                    </MagneticWrapper>
                  </div>
                </div>
                <div 
                  className="aspect-4/3 w-full bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden relative group shadow-2xl order-1 lg:order-2 cursor-pointer"
                  onClick={() => {
                    pushGTMEvent('portfolio_obraz_uruchomiono_demo', { projekt: 'Kajaki u Maćka' });
                    handleOpenDemo({ url: 'https://kajaki-u-macka.pl', title: 'kajaki-u-macka.pl', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-800' });
                  }}
                >
                  <AnimatedWebP src="/kajaki.png" alt="Kajaki u Maćka" className="opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 object-cover" />
                  <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-mono font-bold text-[10px] uppercase tracking-widest bg-orange-800 px-6 py-3 rounded-lg shadow-2xl border border-orange-500/20">Sprawdź działanie</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full lg:w-1/6 h-auto lg:h-full flex items-center justify-center bg-transparent lg:border-l-2 border-white/10 px-4 lg:px-12 py-20 lg:py-0 border-t lg:border-none">
              <div className="flex flex-col w-full max-w-7xl mx-auto relative z-10 gap-8 px-2 py-10 lg:py-12">
                
                {/* Michał - DzikiStyl */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full gap-6 lg:gap-10">
                  <div className="shrink-0 relative z-20">
                    <a href="https://dzikistyldemo.vercel.app/" target="_blank" rel="noopener noreferrer" className="block w-40 h-40 lg:w-56 lg:h-56 rounded-full border-[3px] border-orange-500 bg-[#0B0B0C] shadow-[0_0_40px_rgba(234,88,12,0.3)] relative group overflow-hidden transition-transform duration-500 hover:scale-105">
                      <Image src="/DzikiMichał.jpg" alt="Michał - DzikiStyl" fill sizes="224px" quality={80} className="object-cover absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Image src="/dzikistyl-logo.png" alt="DzikiStyl Logo" fill sizes="224px" quality={80} className="object-contain scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </a>
                  </div>
                  <div className="relative w-full lg:w-2/3 bg-[#121214] border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl">
                    <div className="hidden lg:block absolute top-12 -left-[16px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[16px] border-r-white/5"></div>
                    <div className="hidden lg:block absolute top-12 -left-[15px] w-0 h-0 border-y-[15px] border-y-transparent border-r-[15px] border-r-[#121214] z-10"></div>
                    <div className="mb-4">
                      <h3 className="text-orange-500 font-bold tracking-widest uppercase text-sm">Komentarz Michała</h3>
                      <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-1">Właściciel, DzikiStyl.com</p>
                    </div>
                    <div className="w-full h-px bg-white/5 mb-4" />
                    <p className="text-sm font-light text-zinc-300 leading-relaxed italic text-left">
                      &quot;{fixOrphans(`Przez lata sam rzeźbiłem stronę DzikiStyl i zawsze był ten sam ból – żadna platforma nie była w stanie udźwignąć moich skomplikowanych wymagań dotyczących personalizacji. `)}<strong className="text-white font-medium">{fixOrphans(`To, co Marcin (Molenda Development) robi w pojedynkę, po prostu przekracza ludzkie pojęcie i technologicznie wyprzedza nasze czasy o 5 lat do przodu!`)}</strong>{fixOrphans(` Z całego serca polecam usługi Molenda Development każdemu. `)}<strong className="text-orange-500 font-medium">{fixOrphans(`Wielkie dzięki – zrobiłeś absolutny kosmos!`)}</strong>&quot;
                    </p>
                  </div>
                </div>

                {/* Krzysztof - Sklep Urwis */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full gap-6 lg:gap-10">
                  <div className="shrink-0 relative z-20">
                    <a href="https://www.sklep-urwis.pl" target="_blank" rel="noopener noreferrer" className="block w-40 h-40 lg:w-56 lg:h-56 rounded-full border-[3px] border-blue-500 bg-[#0B0B0C] shadow-[0_0_40px_rgba(59,130,246,0.3)] relative group overflow-hidden transition-transform duration-500 hover:scale-105">
                      <Image src="/Krzysztof_Urwis.jpg" alt="Krzysztof - Sklep Urwis" fill sizes="224px" quality={80} className="object-cover absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Image src="/sklepurwis-logo.png" alt="Urwis Logo" fill sizes="224px" quality={80} className="object-contain scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </a>
                  </div>
                  <div className="relative w-full lg:w-2/3 bg-[#121214] border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl">
                    <div className="hidden lg:block absolute top-12 -left-[16px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[16px] border-r-white/5"></div>
                    <div className="hidden lg:block absolute top-12 -left-[15px] w-0 h-0 border-y-[15px] border-y-transparent border-r-[15px] border-r-[#121214] z-10"></div>
                    <div className="mb-4">
                      <h3 className="text-blue-500 font-bold tracking-widest uppercase text-sm">Komentarz Krzysztofa</h3>
                      <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-1">Właściciel, Sklep-Urwis.pl</p>
                    </div>
                    <div className="w-full h-px bg-white/5 mb-4" />
                    <p className="text-sm font-light text-zinc-300 leading-relaxed italic text-left">
                      &quot;{fixOrphans(`Polecam z całego serca. Marcin stworzył dla mojego sklepu z zabawkami aplikację, która ma w sobie wszystko (i jeszcze więcej!) - koło fortuny z rabatami, strefę zabawy z grami na telefon i kolorowanki z naszym Urwisem. `)}<strong className="text-white font-medium">{fixOrphans(`Zarówno strona sklepu, jak i aplikacja PWA przeszły moje najśmielsze oczekiwania`)}</strong> - <strong className="text-blue-500 font-medium">{fixOrphans(`czysty profesjonalizm i masa bajerów.`)}</strong>&quot;
                    </p>
                  </div>
                </div>

                {/* Maciek - Kajaki u Maćka */}
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full gap-6 lg:gap-10 pb-12">
                  <div className="shrink-0 relative z-20">
                    <a href="https://kajaki-u-macka.pl" target="_blank" rel="noopener noreferrer" className="block w-40 h-40 lg:w-56 lg:h-56 rounded-full border-[3px] border-emerald-500 bg-[#0B0B0C] shadow-[0_0_40px_rgba(16,185,129,0.3)] relative overflow-hidden transition-transform duration-500 hover:scale-105">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                        <Image src="/kajaki-u-macka-logo.png" alt="Kajaki u Maćka Logo" fill sizes="224px" quality={80} className="object-cover" />
                      </div>
                    </a>
                  </div>
                  <div className="relative w-full lg:w-2/3 bg-[#121214] border border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl">
                    <div className="hidden lg:block absolute top-12 -left-[16px] w-0 h-0 border-y-[16px] border-y-transparent border-r-[16px] border-r-white/5"></div>
                    <div className="hidden lg:block absolute top-12 -left-[15px] w-0 h-0 border-y-[15px] border-y-transparent border-r-[15px] border-r-[#121214] z-10"></div>
                    <div className="mb-4">
                      <h3 className="text-emerald-500 font-bold tracking-widest uppercase text-sm">Komentarz Maćka</h3>
                      <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mt-1">Właściciel, Kajaki u Maćka</p>
                    </div>
                    <div className="w-full h-px bg-white/5 mb-4" />
                    <p className="text-sm font-light text-zinc-300 leading-relaxed italic text-left">
                      &quot;{fixOrphans(`O stary, `)}<strong className="text-white font-medium">{fixOrphans(`ta strona jest tak kozak, niespodziewałem się aż takiego efektu!`)}</strong>{fixOrphans(` Wygląda naprawdę obłędnie. `)}<br></br>{fixOrphans(`Oprócz zjawiskowej strony, Marcin od zera założył i skonfigurował moją Wizytówkę Google i Fanpage na Facebooku, zachowując ten sam świetny motyw wizualny. Dał mi też potężne, praktyczne rady jak z nich korzystać, żeby skutecznie ściągać klientów na rzekę. `)}<strong className="text-emerald-500 font-medium">{fixOrphans(`Jest klasa, jesteś szef po prostu!`)}</strong>&quot;
                    </p>
                  </div>
                </div>

              </div>
            </section>
          </div>

          <div id="pricing" className="min-h-screen flex items-center border-t border-white/5 bg-transparent">
            <div className="w-full">
              <Pricing />
            </div>
          </div>

          <FAQ />
          <ContactForm />

          <footer className="w-full py-8 text-[9px] md:text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em] text-center flex flex-col items-center gap-3 relative z-10 bg-zinc-950 border-t border-white/5">
            <div className="flex items-center gap-4">
              <span>&copy; {new Date().getFullYear()} Marcin Molenda // <span className="text-zinc-500">molendadevelopment.pl</span></span>
              <span className="text-zinc-800">{"//"}</span>
              <Link href="/polityka-prywatnosci" className="hover:text-orange-500 transition-colors underline-offset-4 hover:underline">Polityka Prywatności</Link>
            </div>
          </footer>

        </main>
      </div>

      <BottomSheet isOpen={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)}>
        <ContactForm />
      </BottomSheet>

      <AnimatePresence>
        {openDemo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-999 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 lg:p-12">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full h-full bg-zinc-950 rounded-3xl lg:rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
              <div className="p-3 lg:p-4 border-b border-white/5 flex items-center justify-between bg-zinc-900 shrink-0">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="flex gap-1.5 lg:gap-2 pl-2">
                    <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex bg-black p-1 rounded-xl gap-1">
                    <button onClick={() => setViewMode('desktop')} className={`px-3 lg:px-4 py-2 rounded-lg text-[9px] lg:text-[10px] font-mono uppercase flex items-center gap-1.5 lg:gap-2 transition-all ${viewMode === 'desktop' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
                      <Monitor size={14} className="hidden sm:block" /> Desktop
                    </button>
                    <button onClick={() => setViewMode('mobile')} className={`px-3 lg:px-4 py-2 rounded-lg text-[9px] lg:text-[10px] font-mono uppercase flex items-center gap-1.5 lg:gap-2 transition-all ${viewMode === 'mobile' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>
                      <PhoneIcon size={14} className="hidden sm:block" /> Mobile
                    </button>
                  </div>
                </div>
                <div className="text-[9px] lg:text-[10px] text-zinc-400 font-mono uppercase tracking-widest hidden md:block truncate max-w-[200px]">Preview // {openDemo.title}</div>
                <button onClick={() => setOpenDemo(null)} aria-label="Zamknij" className="p-2 lg:p-3 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white cursor-pointer"><X size={20} /></button>
              </div>
              <div className="flex-1 bg-black flex justify-center items-center overflow-hidden p-2 lg:p-4">
                <motion.div animate={{ width: viewMode === 'desktop' ? '100%' : '375px', height: viewMode === 'desktop' ? '100%' : '812px', borderRadius: viewMode === 'desktop' ? '0px' : '36px' }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} className={`bg-zinc-950 shadow-2xl overflow-hidden relative flex flex-col ${viewMode === 'mobile' ? 'border-[6px] lg:border-8 border-zinc-900' : ''}`}>
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