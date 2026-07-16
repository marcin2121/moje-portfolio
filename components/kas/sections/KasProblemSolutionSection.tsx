import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function KasProblemSolutionSection() {
  return (
    <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-32">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-black mb-6">Dlaczego przy czacie psychologicznym dla młodzieży potrzebujemy <span className="text-rose-500">wyższego standardu bezpieczeństwa?</span></h2>
        <p className="text-slate-600 text-lg">Poniższe zestawienie pokazuje, dlaczego w organizacjach pomocowych standardowy CMS zawodzi przy danych wrażliwych, a hybrydowe podejście gwarantuje pełną poufność.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 lg:p-12">
          <div className="flex items-center gap-4 mb-8 text-rose-600">
            <ShieldAlert className="w-8 h-8" />
            <h3 className="text-2xl font-bold">Standardowy CMS (np. klasyczny WordPress)</h3>
          </div>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center shrink-0 text-rose-700 text-sm font-bold">✕</div>
              <p className="text-slate-700">Wymaga dziesiątek wtyczek, z których wiele domyślnie instaluje ciasteczka śledzące (cookies) i loguje adresy IP użytkowników, drastycznie naruszając poczucie anonimowości.</p>
            </li>
            <li className="flex gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center shrink-0 text-rose-700 text-sm font-bold">✕</div>
              <p className="text-slate-700">Świetnie sprawdza się do publikacji artykułów, ale nie został stworzony do bezpośredniej, bezpiecznej obsługi w 100% zanonimizowanego czatu wsparcia na żywo.</p>
            </li>
            <li className="flex gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center shrink-0 text-rose-700 text-sm font-bold">✕</div>
              <p className="text-slate-700">Osiągnięcie w 100% natywnej zgodności z normami WCAG 2.1 AA na standardowych, przeładowanych gotowych motywach jest niemal niemożliwe do zweryfikowania przez EOG.</p>
            </li>
          </ul>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-2xl shadow-emerald-500/10">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 blur-3xl rounded-full"></div>
          <div className="flex items-center gap-4 mb-8 text-emerald-600 relative z-10">
            <CheckCircle2 className="w-8 h-8" />
            <h3 className="text-2xl font-bold">Dedykowana Aplikacja (Next.js + Headless CMS)</h3>
          </div>
          <ul className="space-y-6 relative z-10">
            <li className="flex gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center shrink-0 text-emerald-700 text-sm font-bold">✓</div>
              <p className="text-slate-800">Możemy wykorzystać WordPressa wyłącznie jako znany panel do dodawania artykułów (Headless CMS), a cały czat i system zapisów oprzeć na pancernej architekturze Next.js i Supabase.</p>
            </li>
            <li className="flex gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center shrink-0 text-emerald-700 text-sm font-bold">✓</div>
              <p className="text-slate-800">Absolutny <strong>brak logowania IP</strong> oraz ciasteczek śledzących firm trzecich. Gwarancja 100% anonimowości dla młodzieży w kryzysie i zgodność z rygorystycznym Art. 9 RODO.</p>
            </li>
            <li className="flex gap-4">
              <div className="mt-1 w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center shrink-0 text-emerald-700 text-sm font-bold">✓</div>
              <p className="text-slate-800">Czysty, dedykowany kod tworzony od zera zapewnia <strong>natywną zgodność z normą WCAG 2.1 AA</strong> i bezbłędną współpracę z czytnikami ekranu (pewność podczas rozliczania dotacji).</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
