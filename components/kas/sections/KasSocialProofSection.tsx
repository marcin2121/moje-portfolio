import React from 'react';

export default function KasSocialProofSection() {
  return (
    <section className="bg-slate-50 border-y border-slate-200 py-12 mb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center md:text-left">
        <div>
          <div className="text-3xl font-black text-slate-900 mb-1">100%</div>
          <div className="text-sm font-mono text-slate-500 uppercase tracking-wider">Zgodność WCAG 2.1</div>
        </div>
        <div>
          <div className="text-3xl font-black text-slate-900 mb-1">1.2s</div>
          <div className="text-sm font-mono text-slate-500 uppercase tracking-wider">Optymalizacja z WP</div>
        </div>
        <div>
          <div className="text-3xl font-black text-slate-900 mb-1">10h+</div>
          <div className="text-sm font-mono text-slate-500 uppercase tracking-wider">Odzyskane Tygodniowo<br/><span className="text-[10px]">(Automatyzacja biura)</span></div>
        </div>
        <div>
          <div className="text-3xl font-black text-slate-900 mb-1">100%</div>
          <div className="text-sm font-mono text-slate-500 uppercase tracking-wider">Anonimowość młodzieży</div>
        </div>
      </div>
    </section>
  );
}
