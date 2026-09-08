import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Cpu, Sparkles, Layers, Activity } from 'lucide-react';
import { AudytClient } from './AudytClient';

function AudytFormFallback() {
  return (
    <div className="w-full">
      {/* Skeleton profilu */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/80 p-1.5 rounded-2xl border border-slate-200 flex gap-2 shadow-sm w-80 h-12 animate-pulse" />
      </div>

      {/* Skeleton formularza */}
      <div className="bg-white/70 border border-slate-200/70 rounded-3xl p-6 md:p-8 backdrop-blur-3xl mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] h-36 animate-pulse" />
    </div>
  );
}

export default function AudytPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-slate-600 selection:bg-orange-500 selection:text-white">
      {/* Powrót */}
      <Link 
        href="/narzedzia" 
        className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-orange-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Powrót do narzędzi</span>
      </Link>

      {/* Nagłówek H1 renderowany statycznie na serwerze */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">
          Audyt Odporności Cyfrowej 2.0
        </h1>
        <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
          Głęboka analiza inżynieryjna architektury stron WWW i sklepów internetowych. Prześwietlamy do 35 podstron w poszukiwaniu auto-kanibalizacji SEO, brakujących nagłówków semantycznych H1, długu w drzewie DOM oraz nieszczelności w telemetryce reklamowej Google i Meta.
        </p>
      </div>

      {/* Interaktywny skaner wewnątrz Suspense */}
      <Suspense fallback={<AudytFormFallback />}>
        <AudytClient />
      </Suspense>

      {/* Rozbudowana, merytoryczna sekcja inżynieryjna (>400 słów) gwarantująca pełną treść statyczną */}
      <section className="mt-20 border-t border-slate-200/60 pt-16">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-orange-600 mb-3">
            <Cpu className="w-4 h-4" />
            <span>Metodyka Inżynieryjna Silnika Audytowego</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Co dokładnie bada silnik Audytu Odporności Cyfrowej?
          </h2>
          <p className="text-base text-slate-600 leading-relaxed font-light">
            Większość internetowych testerów ogranicza się do powierzchownego zbadania strony głównej. Nasz crawler przechodzi do 35 kluczowych podstron witryny pobranych bezpośrednio z mapy strony (sitemap.xml) lub drzewa odnośników, analizując twarde dowody w kodzie źródłowym HTML i nagłówkach HTTP.
          </p>
        </div>

        {/* Asymetryczna siatka Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Karta 1: Duża (span-2) */}
          <div className="md:col-span-2 bg-white/80 border border-slate-200/70 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-5">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                Architektura Semantyczna i Hierarchia H1 w Epoce AI Search
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Współczesne roboty indeksujące Googlebot oraz modele generatywne (takie jak SearchGPT, Perplexity czy Google Gemini) interpretują kontekst biznesowy Twojej witryny w oparciu o czystą hierarchię nagłówków semantycznych HTML. Podstrona pozbawiona pojedynczego, precyzyjnego nagłówka H1 lub używająca nagłówków H1 w stopce i elementach nawigacyjnych wprowadza szum informacyjny.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nasz audyt sprawdza każdą zbadaną podstronę pod kątem obecności dokładnie jednego, unikalnego nagłówka H1, eliminując ryzyko utraty pozycji w organicznych wynikach wyszukiwania oraz w odpowiedziach silników AI.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-700">Standard:</span> Dokładnie 1 nagłówek H1 na podstronę, zawierający główną frazę intencyjną.
            </div>
          </div>

          {/* Karta 2: Mała (span-1) */}
          <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                Kanonizacja i Auto-Kanibalizacja
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Brak tagów <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">rel=&quot;canonical&quot;</code> oraz powielone tagi Title prowadzą do wewnętrznej kanibalizacji fraz kluczowych. Zamiast budować silny autorytet pojedynczego adresu, roboty dzielą wagę domeny pomiędzy warianty podstron.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-700">Weryfikacja:</span> Wykrywanie grup duplikatów i brakujących canonicali.
            </div>
          </div>

          {/* Karta 3: Mała (span-1) */}
          <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                Telemetria i Przepalanie Budżetów
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kampanie Google Ads i Meta Ads wymagają twardych sygnałów z warstwy dataLayer. Błędy w zdarzeniach konwersji (generate_lead, add_to_cart, purchase) uniemożliwiają algorytmom Smart Bidding optymalizację stawek, co prowadzi do drastycznego przepalania budżetu.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-700">Weryfikacja:</span> Google Ads, GA4, Meta Pixel, Consent Mode v2.
            </div>
          </div>

          {/* Karta 4: Duża (span-2) */}
          <div className="md:col-span-2 bg-white/80 border border-slate-200/70 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                Wydajność Core Web Vitals i Likwidacja Długu w DOM
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Przestarzałe szablony, kreatory stron (Elementor, Divi) oraz nieoptymalne wtyczki generują tysiące nadmiarowych węzłów DOM i dziesiątki blokujących skryptów JS. Każde dodatkowe 100 milisekund czasu ładowania (TTFB i LCP) na urządzeniach mobilnych obniża współczynnik konwersji średnio o 7%.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nasz raport wskazuje dokładną liczbę elementów DOM, obecność bibliotek spowalniających renderowanie oraz konkretne pliki blokujące pierwszy render strony.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-700">Cel inżynieryjny:</span> Render sub-sekundowy, drzewo DOM &lt; 800 węzłów, 0 skryptów blokujących.
            </div>
          </div>
        </div>

        {/* Sekcja korzyści i wdrożenia */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4 text-white">
              Naprawa usterek w 24–48 godzin bez przebudowy witryny
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-light">
              Większość zidentyfikowanych w audycie wąskich gardeł (takich jak brakujące nagłówki H1, auto-kanibalizacja tagów title, brak kanonizacji czy uszkodzone zdarzenia konwersji) nie wymaga kosztownego budowania serwisu od zera. Jako Senior Full-Stack Architect wdrażam precyzyjne poprawki bezpośrednio w Twoim kodzie produkcyjnym, przywracając pełną skuteczność SEO i kampanii płatnych.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/#kontakt"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Zamów inżynieryjne wdrożenie poprawek
              </Link>
              <Link 
                href="/narzedzia/kalkulator-migracji"
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all border border-white/20"
              >
                Sprawdź kalkulator strat e-commerce
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
