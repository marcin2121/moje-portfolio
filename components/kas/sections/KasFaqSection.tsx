import React from 'react';

export default function KasFaqSection() {
  return (
    <section className="px-6 md:px-12 lg:px-24 max-w-3xl mx-auto mb-32">
      <h2 className="text-3xl md:text-5xl font-black mb-12 text-center">FAQ</h2>
      <div className="space-y-6">
        <div className="pb-6 border-b border-slate-200">
          <h3 className="font-bold text-xl mb-2">Czy po oddaniu strony będziemy uwiązani jakimś abonamentem?</h3>
          <p className="text-slate-600">Nie. Strona i cały jej kod źródłowy jest Waszą własnością na zawsze. Jedyne stałe opłaty eksploatacyjne to standardowy koszt utrzymania serwera (hosting) oraz roczne odnowienie domeny internetowej.</p>
        </div>
        <div className="pb-6 border-b border-slate-200">
          <h3 className="font-bold text-xl mb-2">Dlaczego Next.js zamiast samego WordPressa?</h3>
          <p className="text-slate-600">Standardowy WordPress jest podatny na awarie i utrudnia wdrożenie pełnego WCAG 2.1 AA. Architektura Headless (Next.js na froncie) chroni prywatność młodzieży i eliminuje ryzyko załamania strony w krytycznym momencie.</p>
        </div>
        <div className="pb-6 border-b border-slate-200">
          <h3 className="font-bold text-xl mb-2">Co się stanie, jeśli po kilku miesiącach coś przestanie działać?</h3>
          <p className="text-slate-600">Systemy oparte na architekturze Headless i Next.js cechują się pancerną stabilnością i nie „psują się” z biegiem czasu, tak jak starsze rozwiązania. Moja rola po oddaniu projektu to proaktywny monitoring bezpieczeństwa, instalowanie najnowszych aktualizacji oraz pomoc technologiczna dla Państwa wolontariuszy. W zależności od wariantu, otrzymujecie Państwo od 90 dni (Pakiet Dedykowany), przez 12 miesięcy (Pakiet Optymalny), aż do 24 miesięcy (Pakiet Maksymalny) mojej osobistej, bezpłatnej opieki technicznej w cenie wdrożenia. Po tym okresie możecie zdecydować się na opcjonalny abonament opiekuńczy, z którego można zrezygnować w dowolnym momencie.</p>
        </div>
      </div>
    </section>
  );
}
