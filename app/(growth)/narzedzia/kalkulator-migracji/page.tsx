import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingDown, Zap, Calculator, ShieldCheck } from 'lucide-react';
import { CalculatorClient } from './CalculatorClient';

function CalculatorFallback() {
  return (
    <div className="w-full space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolumna parametrów skeleton */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/60 space-y-8 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-xl w-3/4" />
          <div className="space-y-6">
            <div className="h-16 bg-slate-100 rounded-2xl" />
            <div className="h-16 bg-slate-100 rounded-2xl" />
            <div className="h-16 bg-slate-100 rounded-2xl" />
            <div className="h-16 bg-slate-100 rounded-2xl" />
          </div>
        </div>

        {/* Kolumna wyników skeleton */}
        <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/60 space-y-10 animate-pulse h-96">
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-14 bg-slate-200 rounded-2xl w-3/4" />
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
            <div className="h-12 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MigrationCalculatorPage() {
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
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-slate-900">
          Kalkulator Wycieku Gotówki E-commerce
        </h1>
        <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
          Odkryj, ile przychodów ucieka z Twojego sklepu internetowego każdego miesiąca przez powolne ładowanie na telefonach i dług technologiczny. Oblicz prognozowany zwrot z inwestycji w nowoczesną architekturę Next.js.
        </p>
      </div>

      {/* Interaktywny kalkulator wewnątrz Suspense */}
      <Suspense fallback={<CalculatorFallback />}>
        <CalculatorClient />
      </Suspense>

      {/* Rozbudowana sekcja inżynieryjno-biznesowa (>400 słów) */}
      <section className="mt-20 border-t border-slate-200/60 pt-16">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-orange-600 mb-3">
            <Calculator className="w-4 h-4" />
            <span>Ekonomia Wydajności Webowej</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Matematyka Utraty Konwersji: Dlaczego milisekundy decydują o marży?
          </h2>
          <p className="text-base text-slate-600 leading-relaxed font-light">
            W e-commerce szybkość ładowania to nie kwestia estetyki technicznej, lecz kluczowa dźwignia finansowa decydująca o rentowności całego biznesu i koszcie pozyskania klienta (CAC). Sprawdź, na jakich założeniach opiera się model kalkulatora.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Karta 1: Duża (span-2) */}
          <div className="md:col-span-2 bg-white/80 border border-slate-200/70 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-5">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                Krzywa Utraty Konwersji: Badania Google, Akamai i Deloitte
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Niezależne badania rynku e-commerce jednoznacznie wskazują korelację między czasem odpowiedzi serwera (TTFB) i renderowaniem strony (LCP) a współczynnikiem konwersji. Średnio każde 100 milisekund dodatkowego oczekiwania na urządzeniach mobilnych skutkuje spadkiem konwersji o 7%.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gdy czas ładowania wzrasta z 1 sekundy do 3 sekund, prawdopodobieństwo natychmiastowego porzucenia sesji (bounce rate) rośnie o 32%. Powyżej 4,5 sekundy sklep traci ponad 35% potencjalnych transakcji, a wydatki na kampanie reklamowe Google Ads i Meta Ads są drastycznie przepalane.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-700">Wniosek:</span> Przyspieszenie sklepu z 4.5s do 0.8s natychmiast uwalnia zamrożony potencjał marżowy.
            </div>
          </div>

          {/* Karta 2: Mała (span-1) */}
          <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-5">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                Monolit vs Architektura Edge Next.js
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Platformy monolityczne (WooCommerce, PrestaShop, Magento) generują wysoki TTFB z powodu ciężkich skryptów PHP i dziesiątek zapytań SQL przy każdym wejściu. Next.js z Server-Side Generation i Edge Caching serwuje gotowy HTML z globalnej sieci CDN w czasie poniżej 80 ms.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-700">Architektura:</span> Sub-sekundowy render bez obciążania bazy danych.
            </div>
          </div>

          {/* Karta 3: Mała (span-1) */}
          <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                Transparentna Metodologia Kalkulacji
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Wyliczenia opierają się na matematycznej formule: <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Ruch × AOV × (Docelowy CR - Obecny CR)</code>. To precyzyjny fundament do rozmowy z CFO i Zarządem o realnej stopie zwrotu z wdrożenia.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-700">Cel:</span> Pełny zwrot z inwestycji zazwyczaj w 30–90 dni.
            </div>
          </div>

          {/* Karta 4: Duża (span-2) */}
          <div className="md:col-span-2 bg-white/80 border border-slate-200/70 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                Bezpieczna Migracja Zero-Downtime i Ochrona SEO
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Jedną z największych obaw właścicieli sklepów internetowych jest ryzyko przestojów w sprzedaży oraz utrata wypracowanych pozycji w organicznych wynikach wyszukiwania Google. W naszej metodyce stosujemy podejście headless, które całkowicie eliminuje te zagrożenia.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Twój obecny silnik sklepowy (WooCommerce, Shopify czy PrestaShop) nadal zarządza zamówieniami, płatnościami i stanami magazynowymi. Nowoczesna warstwa frontendowa Next.js jest wdrażana równolegle, zachowując 100% struktury adresów URL, tagów kanonicznych i mapy witryny.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-700">Gwarancja:</span> Zero przestojów koszyka, zachowanie historii i pozycji SEO.
            </div>
          </div>
        </div>

        {/* Baner CTA */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4 text-white">
              Chcesz sprawdzić kondycję techniczną swojego sklepu przed decyzją o migracji?
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-light">
              Uruchom darmowy Audyt Odporności Cyfrowej 2.0. Nasz crawler przeanalizuje do 35 podstron Twojego sklepu, sprawdzając Core Web Vitals, hierarchię nagłówków H1, tagi canonical oraz telemetrię Google Ads i Meta Pixel.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/narzedzia/audyt"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Przejdź do bezpłatnego Audytu WWW
              </Link>
              <Link 
                href="/#kontakt"
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all border border-white/20"
              >
                Umów bezpłatną konsultację techniczną
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
