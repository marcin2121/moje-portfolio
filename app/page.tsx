'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Code2, Smartphone, Zap, Gauge, Rocket, ArrowRight, Facebook, Linkedin, Monitor, Smartphone as PhoneIcon, X } from 'lucide-react';
import useSound from 'use-sound';
import MagicBento from '@/components/ui/MagicBento';
import MagneticButton from '@/components/ui/MagneticButton';
import Particles from '@/components/ui/Particles';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  if (window.history && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
}

type DemoConfig = {
  url: string;
  title: string;
  colorClass: string;
  bgClass: string;
};

// Funkcja pomocnicza do GTM
const pushGTMEvent = (eventName: string, params: object = {}) => {
  if (typeof window !== 'undefined') {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: eventName,
      ...params
    });
  }
};

export default function PortfolioHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontal1Ref = useRef<HTMLDivElement>(null);
  const horizontal2Ref = useRef<HTMLDivElement>(null);
  const vertical1Ref = useRef<HTMLDivElement>(null);
  const vertical2Ref = useRef<HTMLDivElement>(null);

  const [activeDot, setActiveDot] = useState(0);
  const [openDemo, setOpenDemo] = useState<DemoConfig | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [playNavClick] = useSound('/sfx/click.mp3', { volume: 0.1 });

  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, { stiffness: 80, damping: 18, mass: 0.8 });
  const lavaHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const lavaWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  const navDots = [
    { id: 0, title: "Start" },
    { id: 1, title: "Usługi" },
    { id: 2, title: "O mnie" },
    { id: 3, title: "Portfolio" },
    { id: 4, title: "Sklep Urwis" },
    { id: 5, title: "zamówtu.pl" },
    { id: 6, title: "Kontakt" }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        gsap.to(horizontal1Ref.current, { xPercent: -50, ease: "none", scrollTrigger: { trigger: horizontal1Ref.current, start: "top top", end: "+=100%", pin: true, scrub: true }});
        gsap.to(horizontal2Ref.current, { xPercent: -66.66, ease: "none", scrollTrigger: { trigger: horizontal2Ref.current, start: "top top", end: "+=200%", pin: true, scrub: true }});
      });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          rawProgress.set(self.progress);
          const currentDot = Math.round(self.progress * (navDots.length - 1));
          setActiveDot(currentDot);
        }
      });
      
    }, containerRef);
    return () => ctx.revert();
  }, [navDots.length, rawProgress]);

  const scrollToSection = (index: number) => {
    playNavClick();
    
    // ZDARZENIE GTM: Kliknięcie w nawigację
    const sectionName = navDots.find(d => d.id === index)?.title || 'Nieznana';
    pushGTMEvent('nawigacja_klikniecie', { sekcja_docelowa: sectionName });

    const totalScroll = ScrollTrigger.maxScroll(window);
    const targetY = (totalScroll / (navDots.length - 1)) * index;
    gsap.to(window, { scrollTo: targetY, duration: 1.2, ease: "power3.inOut" });
  };

  const handleOpenDemo = (config: DemoConfig) => {
    if (typeof window !== "undefined") {
      setViewMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
    }
    
    // ZDARZENIE GTM: Otwarcie podglądu demo
    pushGTMEvent('otwarcie_dema', { nazwa_projektu: config.title });
    
    setOpenDemo(config);
  };

  return (
    <div ref={containerRef} className="relative bg-zinc-950 text-zinc-50 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* --- DESKTOP NAVBAR --- */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-24 bg-zinc-950/80 backdrop-blur-xl border-r border-white/5 z-50 flex-col items-center justify-center">
        <div className="absolute top-10 w-full text-center text-[8px] font-black uppercase tracking-widest text-zinc-600 italic px-2 leading-tight">
          Marcin Molenda<br/>Development
        </div>
        <div className="relative h-[60vh] w-4 mt-8">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white/5 rounded-full" />
          <motion.div className="absolute left-1/2 -translate-x-1/2 top-0 w-1 bg-orange-500 rounded-full origin-top z-0" style={{ height: lavaHeight }} />
          
          {navDots.map((dot, index) => {
            const isActive = activeDot === index;
            const isPassed = index < activeDot;
            let dotClasses = 'bg-zinc-900 border-white/10';
            let textClasses = 'opacity-0 group-hover:opacity-50 text-white';

            if (isActive) {
              dotClasses = 'bg-orange-500 border-orange-500 shadow-[0_0_12px_#ea580c] scale-125';
              textClasses = 'opacity-100 text-orange-500 scale-110 font-black';
            } else if (isPassed) {
              dotClasses = 'bg-orange-900/80 border-orange-500/50 shadow-[0_0_5px_rgba(234,88,12,0.3)]';
              textClasses = 'opacity-0 group-hover:opacity-80 text-orange-300';
            }

            return (
              <div 
                key={dot.id} 
                onClick={() => scrollToSection(dot.id)} 
                className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border cursor-pointer group hover:scale-150 transition-all duration-300 z-10 ${dotClasses}`} 
                style={{ top: `${index * (100 / (navDots.length - 1))}%` }}
              >
                <span className={`absolute left-8 text-[10px] uppercase font-bold tracking-widest transition-all duration-300 whitespace-nowrap ${textClasses}`}>
                  {dot.title}
                </span>
              </div>
            );
          })}
        </div>
      </nav>

      {/* --- MOBILE NAVBAR --- */}
      <nav className="flex lg:hidden fixed bottom-0 left-0 right-0 h-[70px] bg-zinc-950/90 backdrop-blur-xl border-t border-white/5 z-50 items-center justify-center px-8 pb-2">
        <div className="relative w-full h-1.5 flex items-center">
          <div className="absolute left-0 right-0 h-full bg-white/5 rounded-full" />
          <motion.div className="absolute left-0 h-full bg-orange-500 rounded-full z-0" style={{ width: lavaWidth }} />
          
          <div className="absolute left-0 right-0 flex justify-between items-center w-full">
            {navDots.map((dot, index) => {
              const isActive = activeDot === index;
              const isPassed = index < activeDot;
              return (
                <div 
                  key={dot.id}
                  onClick={() => scrollToSection(dot.id)}
                  className={`relative z-10 w-3 h-3 sm:w-4 sm:h-4 rounded-full border transition-all duration-300 ${isActive ? 'bg-orange-500 border-orange-500 scale-150 shadow-[0_0_10px_#ea580c]' : isPassed ? 'bg-orange-900/80 border-orange-500/50' : 'bg-zinc-900 border-white/10'}`}
                />
              )
            })}
          </div>
        </div>
      </nav>

      <main className="pl-0 lg:pl-24 w-full pb-20 lg:pb-0 overflow-x-hidden">
        
        {/* ETAP 1 & 2: HERO + USŁUGI */}
        <div ref={horizontal1Ref} className="flex flex-col lg:flex-row w-full lg:w-[200%] h-auto lg:h-screen">
          <section className="w-full lg:w-1/2 min-h-screen lg:h-full flex flex-col items-center justify-center relative overflow-hidden px-6 lg:px-10 py-20 lg:py-0">
            <Particles color="#ea580c" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[700px] lg:h-[700px] bg-orange-600/10 blur-[100px] lg:blur-[140px] rounded-full pointer-events-none" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10">
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] lg:leading-[0.8] mb-4">
                Marcin<br/><span className="text-orange-500">Molenda</span>
              </h1>
              <div className="text-sm sm:text-xl lg:text-2xl font-black uppercase tracking-[0.4em] text-zinc-500 italic mb-8 lg:mb-10">
                molendadevelopment.pl
              </div>
              <p className="text-zinc-400 max-w-xl mx-auto text-base sm:text-lg lg:text-xl font-light leading-relaxed">
                <strong className="text-white font-bold">Twórca nowoczesnych stron internetowych i aplikacji webowych.</strong><br />
                Dostarczam technologię dopasowaną do potrzeb Twojej firmy. Projektuję wydajne rozwiązania od zera, bez ociężałych szablonów.
              </p>
            </motion.div>
          </section>

          <section className="w-full lg:w-1/2 min-h-screen lg:h-full flex items-center justify-center bg-zinc-900/20 px-6 sm:px-10 lg:px-12 py-20 lg:py-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl text-left w-full">
              <MagicBento>
                <Zap className="text-orange-500 mb-4 w-8 h-8 lg:w-10 lg:h-10" />
                <h3 className="font-bold text-base lg:text-lg mb-2 text-white uppercase italic">Nowoczesne Strony WWW</h3>
                <p className="text-xs text-zinc-400">Projektuję i koduję od zera strony firmowe oraz Landing Page, które ładują się natychmiast.</p>
              </MagicBento>
              <MagicBento>
                <Smartphone className="text-red-500 mb-4 w-8 h-8 lg:w-10 lg:h-10" />
                <h3 className="font-bold text-base lg:text-lg mb-2 text-white uppercase italic">Aplikacje SaaS</h3>
                <p className="text-xs text-zinc-400">Zmieniam skomplikowane procesy w proste narzędzia. Tworzę dedykowane systemy webowe.</p>
              </MagicBento>
              <MagicBento>
                <Gauge className="text-rose-500 mb-4 w-8 h-8 lg:w-10 lg:h-10" />
                <h3 className="font-bold text-base lg:text-lg mb-2 text-white uppercase italic">Optymalizacja i SEO</h3>
                <p className="text-xs text-zinc-400">Wykonuję audyty techniczne i naprawiam błędy, przywracając witrynie szybkość.</p>
              </MagicBento>
              <MagicBento>
                <Code2 className="text-orange-400 mb-4 w-8 h-8 lg:w-10 lg:h-10" />
                <h3 className="font-bold text-base lg:text-lg mb-2 text-white uppercase italic">Narzędzia Dedykowane</h3>
                <p className="text-xs text-zinc-400">Buduję inteligentne konfiguratory ofert i kalkulatory wycen generujące zapytania.</p>
              </MagicBento>
            </div>
          </section>
        </div>

        {/* ETAP 3: O MNIE */}
        <section ref={vertical1Ref} className="w-full min-h-[80vh] lg:h-screen flex flex-col items-center justify-center px-6 lg:px-10 py-20 bg-zinc-950">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 lg:mb-8 italic tracking-tighter text-white text-center">Mój kod, Twoje zasady.</h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-zinc-400 max-w-3xl text-center font-light leading-relaxed">
            Zamiast masowych produktów, dostarczam technologię dopasowaną do potrzeb Twojej firmy. Rezygnuję z ociężałych szablonów na rzecz <span className="text-orange-500 font-bold italic underline">wydajnych rozwiązań budowanych od zera.</span>
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 opacity-30 animate-bounce hidden lg:flex">
            <span className="text-[10px] font-black uppercase tracking-widest">Scrolluj do Portfolio</span>
            <ArrowRight className="w-5 h-5 rotate-90" />
          </div>
        </section>

        {/* ETAP 4, 5, 6: PORTFOLIO HORIZONTAL */}
        <div ref={horizontal2Ref} className="flex flex-col lg:flex-row w-full lg:w-[300%] h-auto lg:h-screen bg-zinc-900/20">
          
          <section className="w-full lg:w-1/3 min-h-[50vh] lg:h-full flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden py-20 lg:py-0 border-y lg:border-none border-white/5">
            <div className="absolute -top-40 -left-40 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />
            <span className="text-orange-500 font-black tracking-widest uppercase text-[10px] lg:text-xs mb-4">Realizacje</span>
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-white text-center">Case<br/>Studies</h2>
          </section>

          {/* SKLEP URWIS */}
          <section className="w-full lg:w-1/3 min-h-screen lg:h-full flex items-center justify-center bg-zinc-950 lg:border-l border-white/5 px-6 lg:px-20 py-20 lg:py-0">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
              <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
                <span className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[9px] lg:text-[10px] font-black uppercase rounded-full inline-block tracking-widest">E-commerce / PWA</span>
                <h3 className="text-5xl sm:text-6xl font-black italic text-white uppercase tracking-tighter">Sklep Urwis</h3>
                <p className="text-zinc-400 text-base lg:text-lg font-light leading-relaxed">
                  Kompleksowa platforma sprzedażowa z kreatorem rysowania na żywo i systemem lojalnościowym zintegrowanym z Supabase.
                </p>
                <div className="flex justify-center lg:justify-start">
                  <MagneticButton onClick={() => handleOpenDemo({ 
                    url: 'https://sklep-urwis.pl', 
                    title: 'sklep-urwis.pl', 
                    colorClass: 'text-blue-500', 
                    bgClass: 'bg-blue-600' 
                  })}>
                    <button className="inline-block px-8 py-4 bg-blue-600 text-white font-black rounded-full uppercase text-[10px] lg:text-xs tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/30 cursor-pointer">
                      Uruchom Demo
                    </button>
                  </MagneticButton>
                </div>
              </div>
              <div 
                onClick={() => handleOpenDemo({ 
                  url: 'https://sklep-urwis.pl', 
                  title: 'sklep-urwis.pl', 
                  colorClass: 'text-blue-500', 
                  bgClass: 'bg-blue-600' 
                })}
                className="aspect-4/3 w-full bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden relative group shadow-2xl cursor-pointer flex items-center justify-center order-1 lg:order-2"
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/40 to-black/80 z-0" />
                <div className="absolute inset-0 bg-[url('/sklepurwis.png')] bg-cover bg-center opacity-80 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 z-10" />
                <span className="text-white font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500 relative z-20 px-6 py-3 bg-blue-600/90 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl shadow-blue-900/50">
                  Podgląd Demo
                </span>
              </div>
            </div>
          </section>

          {/* ZAMÓWTU.PL */}
          <section className="w-full lg:w-1/3 min-h-screen lg:h-full flex items-center justify-center bg-zinc-950 lg:border-l border-white/5 px-6 lg:px-20 py-20 lg:py-0 border-t lg:border-none">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
              <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
                <span className="px-4 py-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[9px] lg:text-[10px] font-black uppercase rounded-full inline-block tracking-widest">SaaS / Gastronomia</span>
                <h3 className="text-5xl sm:text-6xl font-black italic text-white uppercase tracking-tighter">zamówtu.pl</h3>
                <p className="text-zinc-400 text-base lg:text-lg font-light leading-relaxed">
                  System zamówień online dla gastronomii. Fintech, dashboardy analityczne i pełna automatyzacja sprzedaży bez prowizji.
                </p>
                <div className="flex justify-center lg:justify-start">
                  <MagneticButton onClick={() => handleOpenDemo({ 
                    url: 'https://zamówtu.pl/demo', 
                    title: 'zamówtu.pl', 
                    colorClass: 'text-orange-500', 
                    bgClass: 'bg-orange-600' 
                  })}>
                    <button className="px-8 py-4 bg-orange-600 text-white font-black rounded-full uppercase text-[10px] lg:text-xs tracking-widest cursor-pointer shadow-lg shadow-orange-900/30 hover:bg-orange-700 transition-colors">
                      Uruchom Demo
                    </button>
                  </MagneticButton>
                </div>
              </div>
              <div 
                onClick={() => handleOpenDemo({ 
                  url: 'https://zamówtu.pl/demo', 
                  title: 'zamówtu.pl', 
                  colorClass: 'text-orange-500', 
                  bgClass: 'bg-orange-600' 
                })}
                className="aspect-4/3 w-full bg-zinc-900 rounded-[2rem] border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl cursor-pointer group order-1 lg:order-2"
              >
                 <div className="absolute inset-0 bg-linear-to-br from-orange-600/40 to-black/80 z-0" />
                 <div className="absolute inset-0 bg-[url('/zamowtu.png')] bg-cover bg-center opacity-80 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 z-10" />
                 <span className="text-white font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500 relative z-20 px-6 py-3 bg-orange-600/90 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl shadow-orange-900/50">
                   Podgląd Demo
                 </span>
              </div>
            </div>
          </section>
        </div>

        {/* SECTION 7: KONTAKT */}
        <section ref={vertical2Ref} className="w-full min-h-screen flex flex-col items-center justify-center p-6 sm:p-10 lg:p-20 bg-zinc-950 border-t border-white/5 relative">
          <Particles color="#e11d48" />
          <div className="max-w-5xl w-full bg-zinc-900/50 border border-white/10 rounded-3xl lg:rounded-[3rem] p-8 lg:p-16 flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 relative z-10 backdrop-blur-xl">
            <div className="text-center lg:text-left">
              <Rocket className="text-rose-500 w-10 h-10 lg:w-12 lg:h-12 mb-6 lg:mb-8 animate-bounce mx-auto lg:mx-0" />
              <h2 className="text-4xl sm:text-5xl font-black italic mb-4 lg:mb-6 text-white leading-tight">Zacznijmy projekt, który wygrywa.</h2>
              <p className="text-zinc-400 mb-8 lg:mb-10 font-light leading-relaxed text-sm sm:text-base">Twoja firma zasługuje na technologię, która realnie zwiększa obroty i odciąża Cię z powtarzalnych zadań.</p>
              <a href="mailto:kontakt@molendadevelopment.pl" className="text-lg sm:text-xl font-bold text-white border-b-2 border-orange-500 pb-1 hover:text-orange-500 transition-colors">kontakt@molendadevelopment.pl</a>
              <div className="flex justify-center lg:justify-start gap-4 mt-10 lg:mt-12">
                <a 
                  href="https://www.facebook.com/profile.php?id=61564367727437" 
                  target="_blank" 
                  onClick={() => pushGTMEvent('klikniecie_social', { platforma: 'Facebook' })}
                  className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-[#1877F2] hover:border-[#1877F2] transition-all group"
                >
                  <Facebook className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/marcin-molenda-447251289/" 
                  target="_blank" 
                  onClick={() => pushGTMEvent('klikniecie_social', { platforma: 'LinkedIn' })}
                  className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-blue-600 hover:border-blue-600 transition-all group"
                >
                  <Linkedin className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                </a>
              </div>
            </div>
            <form 
              action="https://formspree.io/f/mgolplyg" 
              method="POST" 
              className="space-y-4"
              onSubmit={() => pushGTMEvent('wyslanie_formularza_kontakt')}
            >
              <input type="text" name="Imię/Firma" placeholder="Imię / Nazwa Firmy" required className="w-full p-4 lg:p-5 bg-black/50 border border-white/10 rounded-2xl outline-none focus:border-orange-500 transition-all font-light text-sm lg:text-base" />
              <input type="email" name="Email" placeholder="Adres e-mail" required className="w-full p-4 lg:p-5 bg-black/50 border border-white/10 rounded-2xl outline-none focus:border-orange-500 transition-all font-light text-sm lg:text-base" />
              <textarea name="Wiadomość" placeholder="Opisz krótko, czego potrzebujesz..." rows={4} required className="w-full p-4 lg:p-5 bg-black/50 border border-white/10 rounded-2xl outline-none focus:border-orange-500 transition-all resize-none font-light text-sm lg:text-base" />
              <MagneticButton className="w-full">
                <button type="submit" className="w-full py-5 lg:py-6 bg-linear-to-r from-orange-500 to-red-600 text-white font-black uppercase text-[10px] lg:text-xs tracking-widest rounded-2xl shadow-xl hover:opacity-90 transition-opacity">Wyślij zapytanie</button>
              </MagneticButton>
            </form>
          </div>
          <div className="mt-12 lg:mt-20 text-[9px] lg:text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] text-center mb-10 lg:mb-0">
            &copy; {new Date().getFullYear()} Marcin Molenda - molendadevelopment.pl<br/>
            Wykonano w technologii Next.js 15 & React 19
          </div>
        </section>
      </main>

      {/* UNIWERSALNY MODAL DEMO Z PRZEŁĄCZNIKIEM WIDOKU */}
      <AnimatePresence>
        {openDemo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 lg:p-12">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full h-full bg-zinc-900 rounded-3xl lg:rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
              
              {/* Belka sterująca Modala */}
              <div className="p-3 lg:p-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/50 shrink-0">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="flex gap-1.5 lg:gap-2 pl-2">
                    <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-red-500/30"/><div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-yellow-500/30"/><div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-green-500/30"/>
                  </div>
                  <div className="flex bg-white/5 p-1 rounded-xl gap-1">
                    <button onClick={() => setViewMode('desktop')} className={`px-3 lg:px-4 py-2 rounded-lg text-[9px] lg:text-[10px] font-black uppercase flex items-center gap-1.5 lg:gap-2 transition-all ${viewMode === 'desktop' ? `${openDemo.bgClass} text-white shadow-lg` : 'text-zinc-500 hover:text-white'}`}>
                      <Monitor size={14} className="hidden sm:block"/> Desktop
                    </button>
                    <button onClick={() => setViewMode('mobile')} className={`px-3 lg:px-4 py-2 rounded-lg text-[9px] lg:text-[10px] font-black uppercase flex items-center gap-1.5 lg:gap-2 transition-all ${viewMode === 'mobile' ? `${openDemo.bgClass} text-white shadow-lg` : 'text-zinc-500 hover:text-white'}`}>
                      <PhoneIcon size={14} className="hidden sm:block"/> Mobile
                    </button>
                  </div>
                </div>
                <div className={`text-[9px] lg:text-[10px] ${openDemo.colorClass} font-black uppercase tracking-widest hidden md:block truncate max-w-[200px]`}>{openDemo.title} Preview</div>
                <button onClick={() => setOpenDemo(null)} className="p-2 lg:p-3 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white cursor-pointer"><X size={20}/></button>
              </div>
              
              {/* Obszar Iframe z Notch'em */}
              <div className="flex-1 bg-zinc-800 flex justify-center items-center overflow-hidden p-2 lg:p-4">
                <motion.div 
                  animate={{ 
                    width: viewMode === 'desktop' ? '100%' : '375px', 
                    height: viewMode === 'desktop' ? '100%' : '812px',
                    borderRadius: viewMode === 'desktop' ? '0px' : '36px' 
                  }} 
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }} 
                  className={`bg-black shadow-2xl overflow-hidden relative flex flex-col ${viewMode === 'mobile' ? 'border-[6px] lg:border-[8px] border-zinc-950/90' : ''}`}
                >
                  {/* Pasek statusu (iOS style) dla Mobile */}
                  {viewMode === 'mobile' && (
                    <div className="h-6 w-full flex justify-between items-center px-6 text-[10px] font-bold text-white shrink-0 bg-black relative z-50">
                       <span className="w-10">9:41</span>
                       {/* Notch */}
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-zinc-950/90 rounded-b-[1rem]" />
                       {/* Ikona Baterii */}
                       <div className="flex gap-1.5 items-center relative z-10 w-10 justify-end">
                          <div className="w-5 h-2.5 border border-white/50 rounded-[3px] p-[1px] relative flex items-center">
                             <div className="w-[80%] h-full bg-white rounded-[1px]" />
                             <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[2px] h-1 bg-white/50 rounded-r-sm" />
                          </div>
                       </div>
                    </div>
                  )}
                  
                  {/* Kontener Iframe */}
                  <div className="flex-1 w-full bg-white relative">
                    <iframe src={openDemo.url} className="absolute inset-0 w-full h-full border-none" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}