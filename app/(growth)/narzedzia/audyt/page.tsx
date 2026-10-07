import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Cpu, Sparkles, Layers, Activity } from 'lucide-react';
import { AudytClient } from './AudytClient';

function AudytFormFallback() {
  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-3xl backdrop-blur-2xl mb-12 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.08)] overflow-hidden animate-pulse">
      <div className="bg-slate-50/90 border-b border-slate-200/80 px-8 py-4 h-14 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="h-7 w-52 bg-slate-200 rounded-lg" />
      </div>
      <div className="p-8 md:p-10 space-y-4">
        <div className="h-16 bg-slate-100 rounded-2xl" />
        <div className="h-6 bg-slate-100 rounded-md w-1/3" />
      </div>
    </div>
  );
}

export default function AudytPage() {
  return (
    <main className="min-h-screen pt-28 sm:pt-32 md:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-slate-600 selection:bg-orange-500 selection:text-white relative">
      {/* Delikatne tło ambientowe budujące głębię i kontrast */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-orange-500/5 via-slate-100/40 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Powrót */}
      <Link 
        href="/narzedzia" 
        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500 hover:text-orange-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <span>Powrót do narzędzi</span>
      </Link>

      {/* Nagłówek H1 renderowany statycznie na serwerze z obsługą interaktywnego przejścia */}
      <div className="text-center mb-10">
        <a 
          href="#formularz-audytu"
          id="darmowy-audyt-naglowek"
          className="inline-block group focus:outline-none cursor-pointer"
          title="Kliknij, aby przejść do formularza i wpisać adres strony"
        >
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-orange-600 mb-3 group-hover:text-orange-500 transition-colors">
            <Activity className="w-4 h-4" />
            <span>BEZPŁATNY TEST DLA WŁAŚCICIELI FIRM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 group-hover:text-orange-600 transition-colors">
            Darmowy Audyt Strony Internetowej
          </h1>
        </a>
        <p className="text-base md:text-lg text-slate-700 max-w-2xl mx-auto font-normal leading-relaxed">
          Dowiedz się w prosty sposób, czy Twoja strona nie traci klientów przez powolne ładowanie na telefonach i niewidoczność w Google. Rzetelne wskazówki bez skomplikowanego żargonu.
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
            <span>JAK TO DZIAŁA W PRAKTYCE</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Co dokładnie sprawdzamy na Twojej stronie?
          </h2>
          <p className="text-base text-slate-600 leading-relaxed font-light">
            Większość automatycznych testerów w sieci bada tylko stronę główną i zarzuca trudnymi pojęciami technicznymi. Nasz test sprawdza podstrony Twojej oferty i przekłada wyniki na prosty język biznesu: dlaczego klienci mogą opuszczać witrynę oraz co poprawić, aby zyskać więcej zapytań.
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
                Czytelna Struktura Nagłówków H1 pod Google i AI
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Współczesne roboty indeksujące Google oraz modele sztucznej inteligencji (SearchGPT, Perplexity, Google Gemini) interpretują ofertę Twojej firmy na podstawie przejrzystej hierarchii nagłówków HTML. Podstrona pozbawiona głównego nagłówka H1 lub używająca nagłówków H1 w stopce i menu traci widoczność w wynikach wyszukiwania.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nasz audyt sprawdza każdą zbadaną podstronę pod kątem obecności dokładnie jednego, unikalnego nagłówka H1, eliminując ryzyko utraty pozycji w wynikach Google oraz w wyszukiwarkach AI (takich jak ChatGPT czy Gemini).
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
                Unikalne Tytuły Stron i Tagi Canonical
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Brak tagów <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">rel=&quot;canonical&quot;</code> oraz powielone tagi Title prowadzą do konkurowania własnych podstron w Google. Zamiast budować wysoką pozycję jednej oferty, roboty rozpraszają ruch pomiędzy duplikaty.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-700">Weryfikacja:</span> Wykrywanie grup duplikatów i brakujących linków kanonicznych.
            </div>
          </div>

          {/* Karta 3: Mała (span-1) */}
          <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                Śledzenie Konwersji i Analityka Reklam
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kampanie Google Ads i Meta Ads wymagają poprawnych danych o konwersjach. Błędy w zdarzeniach zapytań lub koszyka uniemożliwiają algorytmom optymalizację stawek, co prowadzi do marnowania budżetu na przypadkowy ruch.
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
                Prędkość Ładowania na Telefonach (Core Web Vitals)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Przestarzałe szablony, kreatory stron oraz nadmiar wtyczek spowalniają telefony użytkowników. Każde dodatkowe 100 milisekund czasu ładowania na smartfonach obniża współczynnik konwersji średnio o 7%.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nasz raport wskazuje dokładny czas odpowiedzi serwera (TTFB), obecność bibliotek spowalniających renderowanie oraz konkretne pliki blokujące szybkie wyświetlanie strony.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-700">Cel:</span> Błyskawiczny render, lekki kod, 0 skryptów blokujących.
            </div>
          </div>
        </div>

        {/* Sekcja korzyści i wdrożenia */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4 text-white">
              Naprawa usterek w 24-48 godzin bez przebudowy witryny
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-light">
              Większość zidentyfikowanych w audycie wąskich gardeł (takich jak brakujące nagłówki H1, powielone tagi title, brak linków kanonicznych czy uszkodzone zdarzenia konwersji) nie wymaga budowania serwisu od zera. Wdrażam precyzyjne poprawki bezpośrednio w kodzie, przywracając pełną skuteczność SEO i kampanii reklamowych.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/#kontakt"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Zamów wdrożenie poprawek
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
