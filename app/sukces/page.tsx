import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowLeft, Linkedin, Clock, ShieldCheck, MailCheck, Layers } from 'lucide-react';
import type { Metadata } from 'next';
import MagneticWrapper from '@/components/ui/MagneticWrapper';

export const metadata: Metadata = {
  title: 'Wycena w Przygotowaniu | Marcin Molenda',
  description: 'Dziękuję za przesłanie zapytania. W ciągu 24h otrzymasz konkretny kosztorys i analizę na e-mail.',
  robots: {
    index: false,
    follow: false,
  }
};

const TIMELINE_STEPS = [
  {
    step: '01',
    title: 'Weryfikacja zgłoszenia',
    desc: 'Twoje zapytanie trafiło bezpośrednio do mojej skrzynki inżynierskiej.',
    icon: MailCheck,
    tag: 'Zrealizowano natychmiast'
  },
  {
    step: '02',
    title: 'Analiza techniczna i kosztorys (do 24h)',
    desc: 'Osobiście analizuję Twoją obecną stronę lub założenia projektu, sprawdzam wąskie gardła i przygotowuję konkretny kosztorys.',
    icon: Clock,
    tag: 'W toku'
  },
  {
    step: '03',
    title: 'Konkretna oferta na e-mail (zero presji)',
    desc: 'Otrzymujesz wycenę i plan architektury prosto na e-mail. Zero natarczywych telefonów i zero spamu. Decyzja należy wyłącznie do Ciebie.',
    icon: ShieldCheck,
    tag: 'Na Twój e-mail'
  }
];

export default function SuccessPage() {
  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans relative flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
      {/* Background subtle technical grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-gradient-to-b from-orange-400/10 via-emerald-400/5 to-transparent rounded-full blur-[100px] pointer-events-none" 
        aria-hidden="true"
      />
      
      <div className="relative z-10 max-w-3xl w-full bg-white/95 backdrop-blur-2xl rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-12 lg:p-16 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/80">
        
        {/* Animated Badge Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 mx-auto ring-8 ring-emerald-50/60 border border-emerald-200/80 shadow-sm">
          <CheckCircle2 size={36} strokeWidth={2.2} className="sm:w-10 sm:h-10" />
        </div>
        
        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-slate-900">
          Zapytanie przyjęte pomyślnie.
        </h1>
        
        <p className="text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed text-sm sm:text-base font-light">
          Dziękuję za kontakt. Poniżej znajduje się transparentny harmonogram tego, co wydarzy się w ciągu najbliższych 24 godzin:
        </p>
        
        {/* 3-Step Transparent Timeline */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
          {TIMELINE_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step} 
                className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/50">
                      Krok {item.step}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-500 block">
                    Status: {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Micro-Reassurance Box */}
        <div className="w-full bg-orange-50/50 border border-orange-200/60 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0" />
            <span className="text-xs text-slate-700 leading-snug">
              <strong>Gwarancja stałej ceny:</strong> Otrzymany kosztorys jest wiążący i nie ulega zmianie w trakcie realizacji projektu.
            </span>
          </div>
          <Link 
            href="/wdrozenia" 
            className="shrink-0 text-xs font-mono font-bold text-orange-600 hover:text-orange-700 underline underline-offset-4"
          >
            Przeglądaj wdrożenia →
          </Link>
        </div>
        
        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <MagneticWrapper>
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm transition-all w-full sm:w-auto shadow-md"
            >
              <ArrowLeft size={16} />
              Wróć na stronę główną
            </Link>
          </MagneticWrapper>

          <MagneticWrapper>
            <Link 
              href="https://www.linkedin.com/in/marcin-molenda-447251289/"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl font-medium text-xs sm:text-sm transition-all w-full sm:w-auto shadow-sm"
            >
              <Linkedin size={16} className="text-[#0A66C2]" />
              Połączmy się na LinkedIn
            </Link>
          </MagneticWrapper>
        </div>
      </div>
    </main>
  );
}
