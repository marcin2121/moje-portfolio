import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ArrowRight, Activity, Cpu, ShieldCheck, TrendingUp, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bezpłatne Narzędzia Inżynieryjne i Kalkulatory',
  description: 'Zbiór bezpłatnych narzędzi diagnostycznych dla e-commerce i B2B. Oblicz realne straty z powolnego sklepu, przetestuj architekturę i zdiagnozuj wycieki w reklamach.',
  alternates: {
    canonical: '/narzedzia',
  },
  openGraph: {
    title: 'Bezpłatne Narzędzia Inżynieryjne i Kalkulatory | Marcin Molenda',
    description: 'Diagnostyka wydajności, kalkulatory ROI i audyty architektury webowej.',
    url: 'https://molendadevelopment.pl/narzedzia',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bezpłatne Narzędzia Inżynieryjne i Kalkulatory | Marcin Molenda',
    description: 'Zbadaj stan techniczny swojej witryny i wylicz realne straty finansowe.',
  }
};

export default function NarzedziaHub() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-orange-600 bg-orange-50 border border-orange-200/60 px-3 py-1 rounded-md">
          Diagnostyka Architektoniczna & ROI
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
          Bezpłatne Narzędzia <span className="text-orange-500">Inżynieryjne</span>
        </h1>
        <p className="text-slate-600 text-lg sm:text-xl leading-relaxed font-light">
          Zestaw profesjonalnych narzędzi analitycznych ułatwiających twarde, oparte na danych decyzje biznesowe. Sprawdź kondycję techniczną sklepu, wykryj wycieki w budżetach reklamowych i oblicz ROI z modernizacji architektury webowej.
        </p>
      </div>

      {/* Main Tools Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-16">
        {/* Kalkulator Strat E-commerce */}
        <Link 
          href="/narzedzia/kalkulator-migracji"
          className="group relative flex flex-col items-start p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/70 hover:border-orange-200 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <div className="relative z-10 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 group-hover:scale-105 transition-transform duration-300">
            <Calculator className="w-8 h-8 text-orange-500" />
          </div>
          
          <h2 className="relative z-10 text-2xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
            Kalkulator Wycieku Gotówki E-commerce
          </h2>
          <p className="relative z-10 text-slate-600 mb-8 leading-relaxed text-sm sm:text-base">
            Odkryj, ile złotych każdego miesiąca ucieka z Twojego sklepu przez zbyt wolne ładowanie na smartfonach, wysoki wskaźnik porzuceń i przestarzałą architekturę serwerową. Kalkulator symuluje realny wzrost konwersji po przejściu na Next.js.
          </p>
          
          <div className="relative z-10 mt-auto flex items-center gap-2 text-sm font-bold text-orange-500 group-hover:text-orange-600">
            Policz stratę Twojego sklepu <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
        
        {/* Audyt Odporności Biznesowej */}
        <Link 
          href="/narzedzia/audyt"
          className="group relative flex flex-col items-start p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/70 hover:border-orange-200 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <div className="relative z-10 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 group-hover:scale-105 transition-transform duration-300">
            <Activity className="w-8 h-8 text-orange-500" />
          </div>
          
          <h2 className="relative z-10 text-2xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
            Audyt Odporności Cyfrowej 2.0
          </h2>
          <p className="relative z-10 text-slate-600 leading-relaxed mb-8 text-sm sm:text-base">
            Zaawansowany skaner wielopodstronicowy badający do 35 podstron. Wykrywa auto-kanibalizację SEO, brak tagów canonical, skrypty blokujące renderowanie oraz krytyczne błędy analityki reklamowej (Google Ads, Meta Pixel, Consent Mode v2).
          </p>
          
          <div className="relative z-10 mt-auto flex items-center gap-2 text-sm font-bold text-orange-500 group-hover:text-orange-600">
            Uruchom bezpłatny audyt <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Deep-Dive Educational Section (Eliminating Thin Content) */}
      <div className="w-full max-w-5xl bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 sm:p-12 mb-12 shadow-sm space-y-8">
        <div className="max-w-3xl space-y-3">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            Dlaczego diagnostyka inżynieryjna decyduje o rentowności firmy?
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Większość właścicieli sklepów i serwisów B2B koncentruje się na zwiększaniu budżetów w Google Ads lub Meta Ads, ignorując fundamentalny problem: techniczne tarcie na stronie internetowej. Każda dodatkowa sekunda oczekiwania na załadowanie witryny na telefonie obniża współczynnik konwersji średnio o 7-12%.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200/60">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Cpu className="w-5 h-5 text-orange-500" />
              <span>Dług Technologiczny</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ciężkie page-buildery, setki wtyczek i brudne style inline paraliżują procesory smartfonów. Zastąpienie monolitu architekturą Next.js uwalnia zasoby i gwarantuje błyskawiczną reakcję na dotyk użytkownika.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span>Ochrona Budżetów Ads</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Brak zdarzeń koszykowych (add_to_cart) lub brak wdrożonego Consent Mode v2 uniemożliwia algorytmom Smart Bidding optymalizację kosztu konwersji, prowadząc do marnotrawstwa nawet 30-50% wydatków na reklamy.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              <span>Autorytet SEO & Google</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Duplikacja tytułów i brak tagów canonical zmuszają roboty Google do kanibalizowania własnych podstron. Nasz audyt wskazuje dokładne adresy URL wymagające natychmiastowej interwencji programistycznej.
            </p>
          </div>
        </div>
      </div>

      {/* Demand-Gen Card */}
      <div className="w-full max-w-5xl border border-dashed border-slate-300 bg-white/50 backdrop-blur-sm p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-orange-300 transition-colors shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-200">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg sm:text-xl">
              Potrzebujesz dedykowanego kalkulatora lub audytu wewnętrznego?
            </h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            Jeśli w swojej organizacji marnujesz czas na powtarzalne obliczenia w arkuszach lub potrzebujesz dedykowanego modułu analitycznego – zakoduję go dla Ciebie w ramach dedykowanego wdrożenia.
          </p>
        </div>
        
        <Link 
          href="/#kontakt" 
          className="shrink-0 text-sm font-bold text-white bg-slate-900 hover:bg-orange-600 px-6 py-3.5 rounded-xl transition-all shadow-sm inline-flex items-center gap-2"
        >
          Porozmawiajmy o dedykowanym rozwiązaniu
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
