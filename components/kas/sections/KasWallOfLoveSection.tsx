import React from 'react';

export default function KasWallOfLoveSection() {
  return (
    <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-32">
      <h2 className="text-3xl md:text-5xl font-black mb-12 text-center">Sprawdzeni przez lokalny biznes</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
          <p className="text-slate-700 italic mb-6">&quot;Marcin przeprowadził dla nas zaawansowaną przebudowę drukarni z ograniczonego silnika Shoper na nowoczesną architekturę Headless Next.js. Wdrożył płatności bez przeładowania strony oraz globalny przełącznik netto/brutto bez odświeżania, co drastycznie usprawniło obsługę naszych klientów B2B. Ta technologia wyprzedza nasze czasy o 5 lat do przodu.&quot;</p>
          <div className="font-bold">Michał</div>
          <div className="text-sm text-slate-500">DzikiStyl.com</div>
        </div>
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
          <p className="text-slate-700 italic mb-6">&quot;Polecam z całego serca. Marcin stworzył dla mojego sklepu z zabawkami aplikację, która ma w sobie wszystko - koło fortuny z rabatami, strefę zabawy z grami na telefon i kolorowanki z naszą maskotką. Zarówno strona sklepu, jak i aplikacja PWA przeszły moje najśmielsze oczekiwania - to czysty profesjonalizm i niesamowicie bogata funkcjonalność. O to dokładnie chodziło!&quot;</p>
          <div className="font-bold">Krzysztof</div>
          <div className="text-sm text-slate-500">Sklep Urwis</div>
        </div>
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
          <p className="text-slate-700 italic mb-6">&quot;Marcin stworzył dla nas system, który wygląda obłędnie i działa bezbłędnie nawet przy słabym zasięgu nad rzeką. Od zera zoptymalizował naszą obecność w Google i social mediach, zachowując pełną spójność techniczną. Współpraca z nim to zupełnie inny poziom inżynierii cyfrowej - pełna klasa, zdecydowanie polecam!&quot;</p>
          <div className="font-bold">Maciek</div>
          <div className="text-sm text-slate-500">Kajaki u Maćka</div>
        </div>
      </div>
    </section>
  );
}
