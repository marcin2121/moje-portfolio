'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, Settings2, Network, Zap, Search, Eye, Sparkles } from 'lucide-react';

export default function DzikiStylCaseStudy() {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  return (
    <>
    <main className="max-w-4xl mx-auto px-6 py-12 text-zinc-300">
      
      {/* Przycisk Wstecz */}
      <div className="flex justify-start mb-12">
        <Link href="/wdrozenia" className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-orange-500 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Wróć do listy wdrożeń
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-white mb-6">Jak odchudziliśmy DzikiStyl.com o 23MB?</h1>
      
      <div className="prose prose-invert prose-orange max-w-none">
        <p className="text-xl text-zinc-400 mb-12">
          Pojedynek inżynieryjny: Stara platforma kontra architektura Edge-first.
        </p>

        {/* Sekcja Pojedynku */}
        <div className="grid md:grid-cols-2 gap-8 my-12">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex flex-col">
            <h3 className="text-red-500 font-bold mb-2">Stara platforma (Stan wejściowy)</h3>
            <p className="text-sm mb-4">Waga strony: <strong>24.4 MB</strong></p>
            <div 
              onClick={() => setZoomedImage("/images/wdrozenia/dzikistyl-before.png")}
              className="group block w-full h-64 bg-zinc-800 rounded-xl border border-zinc-700 relative overflow-hidden cursor-zoom-in mt-4 mb-6"
            >
              <Image 
                src="/images/wdrozenia/dzikistyl-before.png" 
                alt="Analiza wagi starej strony" 
                fill 
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 p-3 rounded-full backdrop-blur-md border border-white/10 text-white shadow-2xl transition-transform duration-500 group-hover:scale-110">
                  <ZoomIn className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="mt-3 text-right">
              <a href="https://yellowlab.tools/result/hjux0w59d6/rule/totalWeight" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-red-400 transition-colors underline decoration-zinc-700 underline-offset-2">
                Zobacz pełny raport YellowLab ↗
              </a>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl border border-orange-500/30 flex flex-col">
            <h3 className="text-orange-500 font-bold mb-2">Molenda Development (Stan po)</h3>
            <p className="text-sm mb-4">Waga strony: <strong>0.96 MB</strong></p>
            <div 
              onClick={() => setZoomedImage("/images/wdrozenia/dzikistyl-after.png")}
              className="group block w-full h-64 bg-zinc-800 rounded-xl border border-zinc-700 relative overflow-hidden cursor-zoom-in mt-4 mb-6"
            >
              <Image 
                src="/images/wdrozenia/dzikistyl-after.png" 
                alt="Analiza wagi strony Next.js" 
                fill 
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 p-3 rounded-full backdrop-blur-md border border-white/10 text-white shadow-2xl transition-transform duration-500 group-hover:scale-110">
                  <ZoomIn className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="mt-3 text-right">
              <a href="https://yellowlab.tools/result/hjv84w41mk/rule/totalWeight" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 hover:text-orange-400 transition-colors underline decoration-zinc-700 underline-offset-2">
                Zobacz pełny raport YellowLab ↗
              </a>
            </div>
          </div>
        </div>

        <h2 className="text-2xl text-white font-bold mt-12 mb-4">Dlaczego to ma znaczenie?</h2>
        <ul className="space-y-4 mb-16">
          <li><strong className="text-white">Błyskawiczne DOM Content Loaded:</strong> Użytkownik nie czeka na "ładowanie się" sklepu.</li>
          <li><strong className="text-white">Efektywność budżetu reklamowego:</strong> Każde kliknięcie w reklamę FB zamienia się w wizytę, a nie w "loading screen".</li>
          <li><strong className="text-white">Brak "ukrytych kosztów":</strong> Usunęliśmy 15 zbędnych skryptów śledzących, które nie wnosiły żadnej wartości dla biznesu.</li>
        </ul>

        {/* Dodane wstawki */}
        <div className="space-y-12">
          {/* Sekcja Wyzwanie: Co bolało? */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">Wyzwanie: Skala B2B na starym fundamencie</h2>
            <p className="text-zinc-400">
              DzikiStyl.com działał w oparciu o przestarzałe platformy, które nie radziły sobie z obsługą plików graficznych o wadze gigabajtów. 
              Ręczna weryfikacja plików przez grafików i ciągłe przeładowywanie strony przy każdej zmianie ceny paraliżowało sprzedaż hurtową.
            </p>
          </section>

          {/* Sekcja "Inżynierski Insight" - autorskie rozwiązania */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
              <h3 className="text-orange-500 font-bold mb-2">Frictionless Checkout</h3>
              <p className="text-sm">Konfigurator bez przeładowań. Funkcja "magicznego linku" pozwala pracownikowi wysłać gotowy koszyk do szefa, który jednym kliknięciem akceptuje zamówienie.</p>
            </div>
            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
              <h3 className="text-orange-500 font-bold mb-2">Automatyzacja DTP</h3>
              <p className="text-sm">System automatycznie sprawdza jakość plików, dodaje spady i kieruje projekt prosto na produkcję. Wyeliminowaliśmy 90% pomyłek w druku.</p>
            </div>
          </section>

          {/* Sekcja Wyniki: Liczby, które sprzedają */}
          <section className="bg-gradient-to-r from-orange-950/20 to-zinc-900 p-8 rounded-2xl border border-orange-500/10">
            <h2 className="text-2xl font-bold mb-6 text-white">Wynik: Maszyna sprzedażowa 24/7</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <p className="text-3xl font-bold text-white">90%</p>
                <p className="text-xs uppercase tracking-wider text-orange-500 mt-1">Mniej pomyłek w druku</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">25x</p>
                <p className="text-xs uppercase tracking-wider text-orange-500 mt-1">Lżejsza strona</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">∞</p>
                <p className="text-xs uppercase tracking-wider text-orange-500 mt-1">Skalowanie B2B</p>
              </div>
            </div>
          </section>

          {/* Interactive Component Showcases */}
          <InteractiveShowcase />
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 bg-orange-950/10 border border-orange-500/20 rounded-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-orange-500 font-bold mb-2 text-xl">Twój sklep ma podobne objawy?</h3>
            <p className="text-zinc-400 m-0">Jeśli czujesz, że Twój system "puchnie" i nie domyka konwersji, nie musisz migrować wszystkiego od razu. Zróbmy darmowy audyt wagi.</p>
          </div>
          <Link href="/#kontakt" className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-zinc-950 font-bold rounded-xl hover:bg-orange-400 transition-colors whitespace-nowrap">
            Zamów audyt wagi →
          </Link>
        </div>
      </div>
    </main>

    {/* Modal Lightbox */}
    <AnimatePresence>
      {zoomedImage && (
        <motion.div 
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-12 cursor-zoom-out"
        >
          <div className="relative w-full h-full max-w-6xl">
            <Image 
              src={zoomedImage}
              alt="Powiększony zrzut ekranu"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button 
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

function InteractiveShowcase() {
  return (
    <section className="mt-32 space-y-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Silnik Automatyzacji: Jak zamieniliśmy drukarnię w cyfrowy SaaS</h2>
        <p className="text-xl text-zinc-400">Architektura stworzona po to, by sprzedawać, nie tylko działać.</p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-white mb-4">1. Koniec z „klikaniem w ciemno” (Przełącznik Netto/Brutto)</h3>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Twoi klienci B2B operują na cenach netto? Żaden problem. Jednym kliknięciem przełączają cały sklep na swój tryb pracy – bez czekania, bez przeładowywania strony i bez błądzenia w ustawieniach konta. Szybko, konkretnie i bez irytacji.
        </p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-white mb-4">2. Wyszukiwarka, która czyta w myślach (Smart Search)</h3>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Klienci rzadko znają fachowe nazwy produktów. Nasza wyszukiwarka nie tylko znajduje towary, ale rozumie potrzeby. Wpisują „coś na czarne koszulki dla zespołu”, a system w ułamku sekundy podpowiada najlepsze rozwiązania. To koniec z frustrującym „brak wyników”.
        </p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-white mb-4">3. Jeden konfigurator zamiast 26 rozproszonych cenników</h3>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Zamiast budować labirynt z 26 osobnych podstron, zrobiliśmy jeden, inteligentny panel. Klient wybiera produkt, a system sam podpowiada: „tu najlepiej sprawdzi się haft, a tutaj taniej wyjdzie sitodruk”. Do tego dostaje podgląd gotowego produktu w czasie rzeczywistym. Klient widzi, co kupuje – Ty dostajesz bezbłędne zlecenie.
        </p>
      </div>
    </section>
  );
}




