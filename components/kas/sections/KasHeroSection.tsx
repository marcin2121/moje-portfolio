import React from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Download } from 'lucide-react';

export default function KasHeroSection() {
  return (
    <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-32">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 print:w-full">
        
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm tracking-wide shadow-sm">
            <CheckCircle2 className="w-4 h-4" /> Natywna zgodność z WCAG 2.1 AA w czystym kodzie
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1]">
            Precyzja i bezpieczeństwo dla <span className="text-orange-500 inline-block">stowarzyszenie&shy;kas.pl</span>
          </h1>
          <div className="space-y-4 max-w-2xl">
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
              <strong className="font-bold text-slate-900">Marcin Molenda - Niezależny Inżynier Oprogramowania</strong><br/>
              Projektuję ultraszybkie systemy dla sektora komercyjnego: e-commerce B2B (DzikiStyl), aplikacje PWA (Sklep Urwis) i integracje. Przenoszę te pancerne standardy wydajności (1.2s ładowania) i bezpieczeństwa (szyfrowanie danych Supabase) do sektora społecznego. Wasza misja wymaga niezawodnej technologii.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 print:hidden">
            <a href="#prototypy" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
              Przetestuj technologię <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#pdf" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-xl font-bold hover:border-orange-500 transition-colors">
              Pobierz oficjalną ofertę <Download className="w-5 h-5 text-orange-500" />
            </a>
          </div>
        </div>
        
        <div className="w-full lg:w-2/5 xl:w-1/3 relative print:hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent blur-3xl rounded-full"></div>
          <div className="relative bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl aspect-[4/5] lg:aspect-square">
            <Image 
              src="/Marcin_Molenda_Development.png" 
              alt="Marcin Molenda - Niezależny Inżynier Oprogramowania" 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
