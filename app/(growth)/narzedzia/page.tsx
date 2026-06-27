import Link from 'next/link';
import { Calculator, ArrowRight, Activity } from 'lucide-react';

export const metadata = {
  title: 'Bezpłatne Narzędzia i Kalkulatory | Marcin Molenda',
  description: 'Zbiór darmowych narzędzi dla e-commerce i B2B. Oblicz koszty migracji, sprawdź audyty i inne kalkulatory.',
};

export default function NarzedziaHub() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
          Bezpłatne Narzędzia
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
          Zbiór darmowych narzędzi i kalkulatorów ułatwiających decyzje biznesowe i techniczne w e-commerce oraz B2B.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Kalkulator Migracji Card */}
        <Link 
          href="/narzedzia/kalkulator-migracji"
          className="group relative flex flex-col items-start p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-orange-500/50 hover:bg-zinc-900/80 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 bg-black/50 p-4 rounded-2xl border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300">
            <Calculator className="w-8 h-8 text-orange-500" />
          </div>
          
          <h2 className="relative z-10 text-2xl font-bold text-zinc-100 mb-3 group-hover:text-white transition-colors">
            Kalkulator Strat E-commerce
          </h2>
          <p className="relative z-10 text-zinc-400 mb-8 leading-relaxed">
            Sprawdź, ile złotych każdego miesiąca ucieka z Twojego sklepu przez zbyt wolne ładowanie na telefonach i przestarzałą infrastrukturę serwerową.
          </p>
          
          <div className="relative z-10 mt-auto flex items-center gap-2 text-sm font-semibold text-orange-500">
            Policz moją stratę <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
        
        {/* Demand-Gen Card */}
        <div className="border border-dashed border-zinc-800 bg-zinc-950/40 p-8 rounded-3xl flex flex-col justify-between hover:border-orange-500/30 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-orange-500 mb-6 font-mono text-xl border border-white/5 shadow-inner">
              ?
            </div>
            <h3 className="text-zinc-200 font-bold text-xl mb-3">
              Brakuje Ci konkretnego kalkulatora?
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Napisz mi w 2 zdaniach, jaką powtarzalną kalkulację lub analizę wykonujesz ręcznie w swojej firmie. Jeśli uznam to za wyzwanie inżynieryjne – zakoduję to narzędzie i udostępnię Ci je za darmo.
            </p>
          </div>
          
          <Link href="/#kontakt" className="text-sm font-semibold text-orange-500 hover:text-orange-400 inline-flex items-center gap-2 mt-8 group">
            Zgłoś pomysł na narzędzie <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {/* Audyt Odporności Biznesowej Card */}
        <Link 
          href="/narzedzia/audyt"
          className="group relative flex flex-col items-start p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-orange-500/50 hover:bg-zinc-900/80 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 bg-black/50 p-4 rounded-2xl border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-300">
            <Activity className="w-8 h-8 text-orange-500" />
          </div>
          
          <h2 className="relative z-10 text-2xl font-bold text-white mb-3">Audyt Odporności Biznesowej</h2>
          <p className="relative z-10 text-zinc-400 leading-relaxed mb-8 flex-grow">
            Bezpłatny skaner sklepu z wyliczeniem strat finansowych wynikających z luk technologicznych i wydajnościowych.
          </p>
          
          <div className="relative z-10 mt-auto flex items-center gap-2 text-sm font-medium text-orange-500 group-hover:text-orange-400 transition-colors">
            Uruchom audyt <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </main>
  );
}
