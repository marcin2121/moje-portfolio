'use client';

import React from 'react';
import Link from 'next/link';

export default function RLTPolskaCaseStudy() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-zinc-300">
      
      {/* Przycisk Wstecz */}
      <Link 
        href="/wdrozenia"
        className="inline-flex items-center text-sm font-mono text-zinc-500 hover:text-orange-500 transition-colors mb-12"
      >
        ← Powrót do wdrożeń
      </Link>

      <h1 className="text-4xl font-bold text-white mb-6">Jak RLT Polska wyeliminowało błędy 508 podczas pików sprzedażowych w Beauty E-commerce</h1>
      
      <div className="prose prose-invert prose-orange max-w-none">
        <p className="text-xl text-zinc-400 mb-12">
          Pojedynek inżynieryjny: Współdzielony Hosting kontra Elastyczny Serverless Edge.
        </p>

        {/* Sekcja Pojedynku */}
        <div className="grid md:grid-cols-2 gap-8 my-12">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex flex-col justify-between">
            <div>
              <h3 className="text-red-500 font-bold mb-2">Stara platforma (Stan wejściowy)</h3>
              <p className="text-sm mb-4">Infrastruktura: <strong>Monolit na serwerze VPS/Shared</strong></p>
            </div>
            <div className="mt-6 bg-red-950/20 border border-red-900/30 rounded-lg p-4 text-center">
              <span className="text-4xl font-black text-red-500 block mb-2">508</span>
              <span className="text-xs text-red-400 font-mono">Resource Limit Is Reached</span>
              <p className="text-xs mt-2 text-zinc-500">Strona padała za każdym razem, gdy influencerka wrzucała Instastory z produktem.</p>
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-xl border border-orange-500/30 flex flex-col justify-between">
            <div>
              <h3 className="text-orange-500 font-bold mb-2">Molenda Development (Stan po)</h3>
              <p className="text-sm mb-4">Infrastruktura: <strong>Next.js + Serverless Auto-scaling</strong></p>
            </div>
            <div className="mt-6 bg-orange-950/20 border border-orange-900/30 rounded-lg p-4 text-center">
              <span className="text-4xl font-black text-orange-500 block mb-2">100%</span>
              <span className="text-xs text-orange-400 font-mono">Dostępności (Uptime)</span>
              <p className="text-xs mt-2 text-zinc-500">Nieskończone, automatyczne skalowanie serwerów w ułamku sekundy pod dowolny ruch.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl text-white font-bold mt-12 mb-4">Dlaczego to ma znaczenie w branży Beauty?</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">Wyzwanie: Skokowy ruch z Social Media</h2>
            <p className="text-zinc-400">
              W branży beauty sprzedaż często opiera się na viralowych postach i kampaniach influencerskich. Kiedy relacja na Instagramie trafia do sieci, na stronę w sekundę wchodzi kilkaset osób. Stare serwery nie są w stanie obsłużyć nagłego przyrostu połączeń z bazą danych, co skutkuje irytującym błędem 508 i masową utratą zamówień.
            </p>
          </section>

          <section className="bg-gradient-to-r from-orange-950/20 to-zinc-900 p-8 rounded-2xl border border-orange-500/10 flex flex-col justify-center">
            <h2 className="text-xl font-bold mb-6 text-white">Wynik: Stabilność w Black Friday</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-3xl font-bold text-white">0</p>
                <p className="text-xs uppercase tracking-wider text-orange-500 mt-1">Utraconych sesji</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">100%</p>
                <p className="text-xs uppercase tracking-wider text-orange-500 mt-1">Gwarancji Uptime'u</p>
              </div>
            </div>
          </section>
        </div>

        {/* Technologiczny Silnik Biznesowy (Teksty sprzedażowe) */}
        <section className="mt-32 space-y-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Silnik Automatyzacji: Jak zabezpieczyliśmy sprzedaż Beauty</h2>
            <p className="text-xl text-zinc-400">Architektura stworzona do bezstresowej obsługi szczytów sprzedażowych.</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white mb-4">1. Nieskończone Skalowanie (Serverless Edge)</h3>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Kiedy influencerka wrzuca relację z Twoim hitem sprzedażowym, ruch rośnie z 10 do 1000 osób w minutę. Stary serwer w takiej sytuacji odcinał zasilanie. Nasza architektura "Serverless" w ułamku sekundy klonuje się na setki małych serwerów, płynnie przyjmując każdy pik obciążenia. Ty liczysz zyski, a nie straty z błędu 508.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white mb-4">2. Zero utraconych koszyków (Stateless Sessions)</h3>
            <p className="text-zinc-400 text-lg leading-relaxed">
              W trakcie Black Friday baza danych bywa przeciążona, a klientki tracą zawartość swoich koszyków. Wdrożyliśmy bezstanową obsługę sesji w oparciu o Edge Network. Koszyki są utrzymywane bezpośrednio w szyfrowanych sesjach blisko użytkownika. Klientka dodaje produkt i płaci bez zacięć, odciążając Twój główny serwer.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white mb-4">3. Błyskawiczne zdjęcia w High-Res (Next.js Image)</h3>
            <p className="text-zinc-400 text-lg leading-relaxed">
              W branży Beauty detale sprzedają. Duże i piękne zdjęcia produktów często ważą megabajty i spowalniają ładowanie na smartfonach. Dzięki wbudowanej, globalnej optymalizacji (CDN), nasze zdjęcia w locie zmieniają format na ultralekki WebP, dopasowując rozmiar idealnie do ekranu smartfona klientki. Pełna jakość i ładowanie w milisekundach.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-32 p-8 bg-orange-950/10 border border-orange-500/20 rounded-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-orange-500 font-bold mb-2 text-xl">Masz dość padających serwerów?</h3>
            <p className="text-zinc-400 m-0">Skaluj biznes w branży beauty bez limitów. Sprawdźmy, jak wdrożenie Serverless ustabilizuje Twój sklep.</p>
          </div>
          <Link href="/#kontakt" className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-zinc-950 font-bold rounded-xl hover:bg-orange-400 transition-colors whitespace-nowrap">
            Skonsultuj architekturę →
          </Link>
        </div>
      </div>
    </main>
  );
}
