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

// Typ definiujący strukturę aktywnego dema
type DemoConfig = {
  url: string;
  title: string;
  colorClass: string;
  bgClass: string;
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
      // Horizontal 1: Hero + Usługi
      gsap.to(horizontal1Ref.current, { xPercent: -50, ease: "none", scrollTrigger: { trigger: horizontal1Ref.current, start: "top top", end: "+=100%", pin: true, scrub: true }});
      
      // Horizontal 2: Case Studies + Urwis + Zamówtu (3 panele = -66.66%)
      gsap.to(horizontal2Ref.current, { xPercent: -66.66, ease: "none", scrollTrigger: { trigger: horizontal2Ref.current, start: "top top", end: "+=200%", pin: true, scrub: true }});

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
  }, []);

  const scrollToSection = (index: number) => {
    playNavClick();
    const totalScroll = ScrollTrigger.maxScroll(window);
    const targetY = (totalScroll / (navDots.length - 1)) * index;
    gsap.to(window, { scrollTo: targetY, duration: 1.2, ease: "power3.inOut" });
  };

  return (
    <div ref={containerRef} className="relative bg-zinc-950 text-zinc-50 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* LEWY NAVBAR */}
    {/* LEWY NAVBAR */}
    <nav className="fixed left-0 top-0 bottom-0 w-24 bg-zinc-950/80 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col items-center justify-center">
        <div className="absolute top-10 w-full text-center text-[8px] font-black uppercase tracking-widest text-zinc-600 italic px-2 leading-tight">
          Marcin Molenda<br/>Development
        </div>
        <div className="relative h-[60vh] w-4 mt-8">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white/5 rounded-full" />
          <motion.div className="absolute left-1/2 -translate-x-1/2 top-0 w-1 bg-orange-500 rounded-full origin-top z-0" style={{ height: lavaHeight }} />
          
          {navDots.map((dot, index) => {
            const isActive = activeDot === index;
            const isPassed = index < activeDot;
            
            // Domyślne klasy (nieaktywne)
            let dotClasses = 'bg-zinc-900 border-white/10';
            let textClasses = 'opacity-0 group-hover:opacity-50 text-white';

            // Klasy dla aktywnej sekcji
            if (isActive) {
              dotClasses = 'bg-orange-500 border-orange-500 shadow-[0_0_12px_#ea580c] scale-125';
              textClasses = 'opacity-100 text-orange-500 scale-110 font-black';
            } 
            // Klasy dla miniętej sekcji
            else if (isPassed) {
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

      <main className="pl-24 w-full">
        {/* SECTION 1 & 2: HERO + USŁUGI */}
        <div ref={horizontal1Ref} className="flex w-[200%] h-screen">
          {/* HERO */}
          <section className="w-1/2 h-full flex flex-col items-center justify-center relative overflow-hidden px-10">
            <Particles color="#ea580c" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-600/5 blur-[140px] rounded-full pointer-events-none" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10">
              <h1 className="text-8xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-4">Marcin<br/><span className="text-orange-500">Molenda</span></h1>
              <div className="text-xl font-black uppercase tracking-[0.4em] text-zinc-500 italic mb-10">molendadevelopment.pl</div>
              <p className="text-zinc-400 max-w-xl mx-auto text-lg font-light leading-relaxed">
                <strong className="text-white font-bold">Twórca nowoczesnych stron internetowych i aplikacji webowych.</strong><br />
                Dostarczam technologię dopasowaną do potrzeb Twojej firmy. Projektuję wydajne rozwiązania od zera, bez ociężałych szablonów.
              </p>
            </motion.div>
          </section>

          {/* USŁUGI */}
          <section className="w-1/2 h-full flex items-center justify-center bg-zinc-900/20 px-12">
            <div className="grid grid-cols-2 gap-6 max-w-5xl text-left">
              <MagicBento>
                <Zap className="text-orange-500 mb-4" />
                <h3 className="font-bold text-lg mb-2 text-white uppercase italic">Nowoczesne Strony WWW</h3>
                <p className="text-xs text-zinc-400">Projektuję i koduję od zera strony firmowe oraz Landing Page, które ładują się natychmiast.</p>
              </MagicBento>
              <MagicBento>
                <Smartphone className="text-red-500 mb-4" />
                <h3 className="font-bold text-lg mb-2 text-white uppercase italic">Aplikacje SaaS</h3>
                <p className="text-xs text-zinc-400">Zmieniam skomplikowane procesy w proste narzędzia. Tworzę dedykowane systemy webowe.</p>
              </MagicBento>
              <MagicBento>
                <Gauge className="text-rose-500 mb-4" />
                <h3 className="font-bold text-lg mb-2 text-white uppercase italic">Optymalizacja i SEO</h3>
                <p className="text-xs text-zinc-400">Wykonuję audyty techniczne i naprawiam błędy, przywracając witrynie szybkość.</p>
              </MagicBento>
              <MagicBento>
                <Code2 className="text-orange-400 mb-4" />
                <h3 className="font-bold text-lg mb-2 text-white uppercase italic">Narzędzia Dedykowane</h3>
                <p className="text-xs text-zinc-400">Buduję inteligentne konfiguratory ofert i kalkulatory wycen generujące zapytania.</p>
              </MagicBento>
            </div>
          </section>
        </div>

        {/* SECTION 3: O MNIE */}
        <section ref={vertical1Ref} className="w-full h-screen flex flex-col items-center justify-center px-10 bg-zinc-950">
          <h2 className="text-7xl font-black mb-8 italic tracking-tighter text-white">Mój kod, Twoje zasady.</h2>
          <p className="text-2xl text-zinc-400 max-w-3xl text-center font-light leading-relaxed">
            Zamiast masowych produktów, dostarczam technologię dopasowaną do potrzeb Twojej firmy. Rezygnuję z ociężałych szablonów na rzecz <span className="text-orange-500 font-bold italic underline">wydajnych rozwiązań budowanych od zera.</span>
          </p>
          <div className="mt-12 flex flex-col items-center gap-4 opacity-30 animate-bounce">
            <span className="text-[10px] font-black uppercase tracking-widest">Scrolluj do Portfolio</span>
            <ArrowRight className="w-5 h-5 rotate-90" />
          </div>
        </section>

        {/* SECTION 4, 5, 6: PORTFOLIO HORIZONTAL */}
        <div ref={horizontal2Ref} className="flex w-[300%] h-screen bg-zinc-900/20">
          {/* CASE STUDIES TITLE */}
          <section className="w-1/3 h-full flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />
            <span className="text-orange-500 font-black tracking-widest uppercase text-xs mb-4">Realizacje</span>
            <h2 className="text-8xl font-black italic uppercase tracking-tighter text-white">Case<br/>Studies</h2>
          </section>

          {/* SKLEP URWIS */}
          <section className="w-1/3 h-full flex items-center justify-center bg-zinc-950 border-l border-white/5 px-20">
            <div className="grid grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <span className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase rounded-full inline-block tracking-widest">E-commerce / PWA</span>
                <h3 className="text-6xl font-black italic text-white uppercase tracking-tighter">Sklep Urwis</h3>
                <p className="text-zinc-400 text-lg font-light leading-relaxed">
                  Kompleksowa platforma sprzedażowa z kreatorem rysowania na żywo i systemem lojalnościowym zintegrowanym z Supabase.
                </p>
                <MagneticButton onClick={() => setOpenDemo({ 
                  url: 'https://sklep-urwis.pl', 
                  title: 'sklep-urwis.pl', 
                  colorClass: 'text-blue-500', 
                  bgClass: 'bg-blue-600' 
                })}>
                  <button className="inline-block px-10 py-4 bg-blue-600 text-white font-black rounded-full uppercase text-xs tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/30 cursor-pointer">
                    Uruchom Demo
                  </button>
                </MagneticButton>
              </div>
              <div 
                onClick={() => setOpenDemo({ 
                  url: 'https://sklep-urwis.pl', 
                  title: 'sklep-urwis.pl', 
                  colorClass: 'text-blue-500', 
                  bgClass: 'bg-blue-600' 
                })}
                className="aspect-4/3 bg-zinc-900 rounded-[2rem] border border-white/10 overflow-hidden relative group shadow-2xl cursor-pointer flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-[url('/sklepurwis.png')] bg-cover bg-center opacity-80 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 z-10" />
                <span className="text-white font-black text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500 relative z-20 px-6 py-3 bg-orange-600/90 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl shadow-orange-900/50">
                   Podgląd Demo
                 </span>
              </div>
            </div>
          </section>

          {/* ZAMÓWTU.PL */}
          {/* USUNIĘTO klasę 'group' z sekcji, aby hover działał poprawnie! */}
          <section className="w-1/3 h-full flex items-center justify-center bg-zinc-950 border-l border-white/5 px-20">
            <div className="grid grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <span className="px-4 py-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase rounded-full inline-block tracking-widest">SaaS / Gastronomia</span>
                <h3 className="text-6xl font-black italic text-white uppercase tracking-tighter">zamówtu.pl</h3>
                <p className="text-zinc-400 text-lg font-light leading-relaxed">
                  System zamówień online dla gastronomii. Fintech, dashboardy analityczne i pełna automatyzacja sprzedaży bez prowizji.
                </p>
                <MagneticButton onClick={() => setOpenDemo({ 
                  url: 'https://zamówtu.pl/demo', 
                  title: 'zamówtu.pl', 
                  colorClass: 'text-orange-500', 
                  bgClass: 'bg-orange-600' 
                })}>
                  <button className="px-10 py-4 bg-orange-600 text-white font-black rounded-full uppercase text-xs tracking-widest cursor-pointer shadow-lg shadow-orange-900/30">
                    Uruchom Demo
                  </button>
                </MagneticButton>
              </div>
              <div 
                onClick={() => setOpenDemo({ 
                  url: 'https://zamówtu.pl/demo', 
                  title: 'zamówtu.pl', 
                  colorClass: 'text-orange-500', 
                  bgClass: 'bg-orange-600' 
                })}
                className="aspect-4/3 bg-zinc-900 rounded-[2rem] border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl cursor-pointer group"
              >
                 <div className="absolute inset-0 bg-[url('/zamowtu.png')] bg-cover bg-center opacity-80 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 z-10" />
                 <span className="text-white font-black text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500 relative z-20 px-6 py-3 bg-orange-600/90 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl shadow-orange-900/50">
                   Podgląd Demo
                 </span>
              </div>
            </div>
          </section>
        </div>

        {/* SECTION 7: KONTAKT */}
        <section ref={vertical2Ref} className="w-full min-h-screen flex flex-col items-center justify-center p-20 bg-zinc-950 border-t border-white/5 relative">
          <Particles color="#e11d48" />
          <div className="max-w-5xl w-full bg-zinc-900/50 border border-white/10 rounded-[3rem] p-16 grid grid-cols-2 gap-16 relative z-10 backdrop-blur-xl">
            <div>
              <Rocket className="text-rose-500 w-12 h-12 mb-8 animate-bounce" />
              <h2 className="text-5xl font-black italic mb-6 text-white leading-tight">Zacznijmy projekt, który wygrywa.</h2>
              <p className="text-zinc-400 mb-10 font-light leading-relaxed">Twoja firma zasługuje na technologię, która realnie zwiększa obroty i odciąża Cię z powtarzalnych zadań.</p>
              <a href="mailto:kontakt@molendadevelopment.pl" className="text-xl font-bold text-white border-b-2 border-orange-500 pb-1 hover:text-orange-500 transition-colors">kontakt@molendadevelopment.pl</a>
              <div className="flex gap-4 mt-12">
                <a href="https://www.facebook.com/profile.php?id=61564367727437" target="_blank" className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-[#1877F2] hover:border-[#1877F2] transition-all group">
                  <Facebook className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                </a>
                <a href="https://www.linkedin.com/in/marcin-molenda-447251289/" target="_blank" className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-blue-600 hover:border-blue-600 transition-all group">
                  <Linkedin className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                </a>
              </div>
            </div>
            <form action="https://formspree.io/f/mgolplyg" method="POST" className="space-y-4">
              <input type="text" name="Imię/Firma" placeholder="Imię / Nazwa Firmy" required className="w-full p-5 bg-black/50 border border-white/10 rounded-2xl outline-none focus:border-orange-500 transition-all font-light" />
              <input type="email" name="Email" placeholder="Adres e-mail" required className="w-full p-5 bg-black/50 border border-white/10 rounded-2xl outline-none focus:border-orange-500 transition-all font-light" />
              <textarea name="Wiadomość" placeholder="Opisz krótko, czego potrzebujesz..." rows={4} required className="w-full p-5 bg-black/50 border border-white/10 rounded-2xl outline-none focus:border-orange-500 transition-all resize-none font-light" />
              <MagneticButton className="w-full">
                <button type="submit" className="w-full py-6 bg-linear-to-r from-orange-500 to-red-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl hover:opacity-90 transition-opacity">Wyślij zapytanie</button>
              </MagneticButton>
            </form>
          </div>
          <div className="mt-20 text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] text-center">
            &copy; {new Date().getFullYear()} Marcin Molenda - molendadevelopment.pl<br/>
            Wykonano w technologii Next.js 16 & React 19
          </div>
        </section>
      </main>

      {/* UNIWERSALNY MODAL DEMO Z PRZEŁĄCZNIKIEM WIDOKU */}
      <AnimatePresence>
        {openDemo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full h-full bg-zinc-900 rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
              
              {/* Belka sterująca */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/50 shrink-0">
                <div className="flex items-center gap-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/30"/><div className="w-3 h-3 rounded-full bg-yellow-500/30"/><div className="w-3 h-3 rounded-full bg-green-500/30"/>
                  </div>
                  <div className="hidden md:flex bg-white/5 p-1 rounded-xl gap-1">
                    <button onClick={() => setViewMode('desktop')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 transition-all ${viewMode === 'desktop' ? `${openDemo.bgClass} text-white shadow-lg` : 'text-zinc-500 hover:text-white'}`}>
                      <Monitor size={14}/> Desktop
                    </button>
                    <button onClick={() => setViewMode('mobile')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 transition-all ${viewMode === 'mobile' ? `${openDemo.bgClass} text-white shadow-lg` : 'text-zinc-500 hover:text-white'}`}>
                      <PhoneIcon size={14}/> Mobile
                    </button>
                  </div>
                </div>
                <div className={`text-[10px] ${openDemo.colorClass} font-black uppercase tracking-widest hidden lg:block`}>{openDemo.title} Preview</div>
                <button onClick={() => setOpenDemo(null)} className="p-3 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white cursor-pointer"><X size={24}/></button>
              </div>
              
              {/* Obszar Iframe z Notch'em (który nie zasłania) */}
              <div className="flex-1 bg-zinc-800 flex justify-center items-center overflow-hidden p-4">
                <motion.div 
                  animate={{ 
                    width: viewMode === 'desktop' ? '100%' : '430px', 
                    height: viewMode === 'desktop' ? '100%' : '832px',
                    borderRadius: viewMode === 'desktop' ? '0px' : '32px' 
                  }} 
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }} 
                  className="bg-black shadow-2xl overflow-hidden relative border-[8px] border-zinc-950 flex flex-col"
                >
                  {/* Pasek statusu (iOS style) dla Mobile */}
                  {viewMode === 'mobile' && (
                    <div className="h-6 w-full flex justify-between items-center px-5 text-[10px] font-bold text-white shrink-0 bg-black relative z-50">
                       <span>9:41</span>
                       
                       {/* Notch */}
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-zinc-950 rounded-b-[1rem]" />
                       
                       {/* Ikona Baterii */}
                       <div className="flex gap-1.5 items-center relative z-10">
                          <div className="w-5 h-2.5 border border-white/50 rounded-[3px] p-[1px] relative flex items-center">
                             <div className="w-[80%] h-full bg-white rounded-[1px]" />
                             <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[2px] h-1 bg-white/50 rounded-r-sm" />
                          </div>
                       </div>
                    </div>
                  )}
                  
                  {/* Kontener Iframe - odsuwa się od paska statusu, więc notch niczego nie zasłania! */}
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