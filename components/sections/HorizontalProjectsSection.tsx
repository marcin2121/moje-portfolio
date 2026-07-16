'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';
import { Terminal } from 'lucide-react';
import { pushGTMEvent } from '@/app/page';
import { fixOrphans } from '@/utils/typography';
import MagneticWrapper from '@/components/ui/MagneticWrapper';
import AnimatedWebP from '@/components/ui/AnimatedWebP';

type DemoConfig = {
  url: string;
  title: string;
  colorClass: string;
  bgClass: string;
};

interface HorizontalProjectsSectionProps {
  handleOpenDemo: (config: DemoConfig) => void;
}

const HorizontalProjectsSection = forwardRef<HTMLDivElement, HorizontalProjectsSectionProps>(
  ({ handleOpenDemo }, ref) => {
    return (
      <div ref={ref} className="flex flex-col lg:flex-row w-full lg:w-[600%] h-auto lg:h-screen bg-transparent">
        
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
    );
  }
);

HorizontalProjectsSection.displayName = 'HorizontalProjectsSection';

export default HorizontalProjectsSection;
