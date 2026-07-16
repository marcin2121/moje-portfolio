import React from 'react';

export default function KasGuaranteesSection() {
  return (
    <section className="bg-orange-50 py-24 mb-32">
      <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black mb-12 text-center text-slate-900">Żelazne zabezpieczenia (Odwrócenie Ryzyka)</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-orange-200 shadow-sm">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-black text-xl mb-6">7</div>
            <h3 className="font-bold text-xl mb-4">Żelazna Gwarancja 7 Dni</h3>
            <p className="text-slate-600">Jeśli po zaprezentowaniu makiet w Etapie 1 uznacie, że to nie to - zwracam 100% zaliczki bez zadawania pytań.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-orange-200 shadow-sm">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-black text-xl mb-6">90</div>
            <h3 className="font-bold text-xl mb-4">Dni Bezpłatnej Opieki</h3>
            <p className="text-slate-600">Osobiście czuwam nad stabilnością, bezpieczeństwem i ewentualnymi poprawkami przez 90 dni od startu systemu.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-orange-200 shadow-sm">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-black text-xl mb-6">∞</div>
            <h3 className="font-bold text-xl mb-4">Instruktaże Wideo</h3>
            <p className="text-slate-600">Otrzymujecie pakiet nagranych wideo-instruktaży dla obecnych i przyszłych wolontariuszy KAS z pełnej obsługi systemu.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
