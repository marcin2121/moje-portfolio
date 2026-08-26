'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Cpu,
  FileCode2,
  Gauge,
  ZoomIn,
  HeartHandshake,
  TrendingUp,
  Lock,
  Smile
} from 'lucide-react';

const stats = [
  { value: '4 × 100', label: 'Google PageSpeed (Desktop)', desc: 'Wydajność 100, Dostępność 100, Praktyki 100, SEO 100', icon: <Gauge className="w-5 h-5 text-emerald-500" /> },
  { value: '98 / 100', label: 'YellowLabTools (Ocena A)', desc: 'DOM 100, Bad JS 100, Network 100 – Top 0.5% internetu', icon: <Zap className="w-5 h-5 text-amber-500" /> },
  { value: '100 / 100', label: 'Certyfikacja WCAG 2.2 AA', desc: '100% bezpieczeństwa prawnego i audytowego dotacji', icon: <ShieldCheck className="w-5 h-5 text-blue-500" /> },
  { value: '16 127', label: 'Linii bezpiecznego kodu', desc: 'Dedykowana architektura bez podatnych szablonów', icon: <FileCode2 className="w-5 h-5 text-orange-500" /> },
  { value: '0.3 s', label: 'Błyskawiczny start (FCP)', desc: 'Użytkownik widzi treść natychmiast, bez czekania', icon: <TrendingUp className="w-5 h-5 text-teal-500" /> },
  { value: '100%', label: 'Wygoda edycji (Headless CMS)', desc: 'Zespół edytuje treści w znanym panelu po polsku', icon: <Smile className="w-5 h-5 text-indigo-500" /> },
];

const businessBenefits = [
  {
    title: 'Bezpieczeństwo dotacji i brak kar prawnych',
    desc: 'Publiczne instytucje i NGO podlegają Ustawie o Dostępności Cyfrowej (kary do 10 000 zł za brak zgodności). Wdrożony standard WCAG 2.2 AA z trybem wysokiego kontrastu i nawigacją dla czytników ekranu gwarantuje 100% spokoju podczas każdej kontroli urzędowej.',
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
  },
  {
    title: 'Wygoda pracowników – zero nauki od nowa',
    desc: 'Zastosowaliśmy architekturę Headless. Personel organizacji dodaje artykuły, projekty i zdjęcia w znanym, intuicyjnym panelu WordPressa po polsku. Zespół nie musi uczyć się skomplikowanych systemów, a strona działa jak nowoczesna aplikacja.',
    icon: <Smile className="w-6 h-6 text-orange-600" />,
  },
  {
    title: 'Większa konwersja darowizn i zaufanie darczyńców',
    desc: 'Strona ładuje się w ułamku sekundy na każdym telefonie. Błyskawiczny proces wsparcia i zintegrowane, bezpieczne płatności online sprawiają, że darczyńcy nie rezygnują w trakcie dokonywania wpłaty przez zacinający się system.',
    icon: <HeartHandshake className="w-6 h-6 text-rose-600" />,
  },
  {
    title: 'Odporność na ataki i brak awaryjnych wtyczek',
    desc: 'W tradycyjnym WordPressie wtyczki po aktualizacji potrafią zawiesić całą stronę. W architekturze Headless kod zewnętrzny jest w 100% odizolowany od bazy danych – strona jest praktycznie niemożliwa do zawieszenia i odporna na ataki hakerskie.',
    icon: <Lock className="w-6 h-6 text-indigo-600" />,
  }
];

export default function StowarzyszenieKasCaseStudy() {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  return (
    <>
    <main className="max-w-5xl mx-auto px-6 py-12 text-slate-600">
      
      {/* Przycisk Wstecz */}
      <div className="flex justify-start mb-12">
        <Link 
          href="/wdrozenia" 
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors bg-white hover:bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 shadow-sm backdrop-blur-md"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Wróć do listy wdrożeń
        </Link>
      </div>

      {/* Hero Section */}
      <div className="space-y-6 mb-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-semibold tracking-wider text-orange-600 uppercase">
            Case Study • Dostępność Cyfrowa & Architektura Headless
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 font-mono">
            Wdrożenie 2026
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Jak połączyliśmy prostotę WordPressa z prędkością 4×100 PageSpeed dla Stowarzyszenia KAS?
        </h1>

        <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed max-w-3xl">
          Kompleksowa modernizacja portalu organizacji pożytku publicznego: wyeliminowaliśmy zawieszające się szablony, zapewniliśmy 
          <strong className="text-slate-900 font-medium"> 100% zgodności z prawem (WCAG 2.2 AA)</strong> i daliśmy pracownikom 
          wygodny panel do edycji treści w architekturze <strong className="text-slate-900 font-medium">Headless Next.js 16</strong>.
        </p>

        {/* Live Link Button */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href="https://stowarzyszeniekas.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            Zobacz działający serwis (stowarzyszeniekas.pl)
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Bento Grid: Metryki Inżynierskie */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase tracking-wider text-xs">
            Twarde Dane: Wyniki Wdrożenia w Liczbach
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-white/80 backdrop-blur-xl border border-slate-200/70 p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:border-orange-500/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors">
                  {stat.value}
                </span>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-orange-50 transition-colors">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">{stat.label}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sekcja: Oficjalne Raporty Google PageSpeed (Zrzuty ekranu z powiększaniem) */}
      <section className="mb-20 space-y-6 border-t border-slate-200 pt-12">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-orange-600">Niezależny audyt Google</span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Oficjalne Wyniki Google PageSpeed Insights
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Kliknij na zrzut ekranu, aby zobaczyć pełny raport z testu wydajności i dostępności cyfrowej.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Raport Desktop: 4x100 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-emerald-600 font-bold text-base flex items-center gap-2">
                <Gauge className="w-5 h-5" /> Wersja Stacjonarna (Desktop)
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                4 × 100 / 100
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Czas wyrenderowania treści: <strong className="text-slate-800">0.4 sekundy</strong> • Zero opóźnień wątku głównego (TBT: 0ms).
            </p>
            
            <div 
              onClick={() => setZoomedImage("/images/wdrozenia/kas-desktop-pagespeed.png")}
              className="group block w-full h-80 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden cursor-zoom-in shadow-inner"
            >
              <Image 
                src="/images/wdrozenia/kas-desktop-pagespeed.png" 
                alt="Raport Google PageSpeed Desktop 4x100" 
                fill 
                className="object-contain object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 p-3 rounded-full backdrop-blur-md border border-slate-200 text-slate-900 shadow-lg transition-transform duration-500 group-hover:scale-110">
                  <ZoomIn className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Raport Mobile: 94 / 100 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-emerald-600 font-bold text-base flex items-center gap-2">
                <Gauge className="w-5 h-5" /> Wersja Mobilna (Smartfony 4G)
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                94 / 100 + 3 × 100
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Dostępność 100 • Sprawdzone metody 100 • SEO 100 • Błyskawiczny start na łączu komórkowym.
            </p>
            
            <div 
              onClick={() => setZoomedImage("/images/wdrozenia/kas-mobile-pagespeed.png")}
              className="group block w-full h-80 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden cursor-zoom-in shadow-inner"
            >
              <Image 
                src="/images/wdrozenia/kas-mobile-pagespeed.png" 
                alt="Raport Google PageSpeed Mobile 94/100" 
                fill 
                className="object-contain object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 p-3 rounded-full backdrop-blur-md border border-slate-200 text-slate-900 shadow-lg transition-transform duration-500 group-hover:scale-110">
                  <ZoomIn className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sekcja: Korzyści Biznesowe dla Klienta */}
      <section className="mb-20 space-y-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-orange-600">Wartość dla Twojej organizacji</span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Co zyskuje klient dzięki takiemu podejściu?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {businessBenefits.map((benefit) => (
            <div 
              key={benefit.title}
              className="p-7 bg-white/90 border border-slate-200/80 rounded-2xl shadow-sm hover:border-orange-300 transition-all space-y-3"
            >
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl inline-block">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{benefit.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-light">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sekcja: Jak to działa (Architektura Headless w 3 krokach) */}
      <section className="mb-20 bg-slate-50 border border-slate-200/80 p-8 md:p-10 rounded-3xl space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Dlaczego Headless to „Najlepsze z obu światów”?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm">1</div>
            <h3 className="text-base font-bold text-slate-900">Wygodny Panel Redaktora</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pracownicy logują się do znanego WordPressa. Dodają posty, aktualności i zdjęcia dokładnie tak, jak byli przyzwyczajeni.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm">2</div>
            <h3 className="text-base font-bold text-slate-900">Błyskawiczne API</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zamiast obciążać serwer powolnymi zapytaniami bazy danych, treści są przesyłane bezpiecznym interfejsem REST API w formacie JSON.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm">3</div>
            <h3 className="text-base font-bold text-slate-900">Pancerny Frontend Next.js</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strona serwowana odbiorcom to skompilowany, zoptymalizowany kod bez zbędnego balastu. Zero zawieszeń, 100/100 wydajności.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="p-8 md:p-10 bg-gradient-to-br from-orange-50 to-white border border-orange-200/60 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">
            Chcesz, aby Twoja strona była tak szybka i bezpieczna?
          </h3>
          <p className="text-sm text-slate-600 max-w-xl">
            Niezależnie od tego, czy potrzebujesz portalu dla instytucji, sklepu czy firmy usługowej – zrobimy bezpłatną analizę Twojego obecnego serwisu i pokażemy, ile możesz zyskać.
          </p>
        </div>
        <Link 
          href="/#kontakt" 
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition-all hover:scale-105"
        >
          Zamów bezpłatny audyt →
        </Link>
      </div>

    </main>

    {/* Modal Lightbox na zrzuty ekranu */}
    <AnimatePresence>
      {zoomedImage && (
        <motion.div 
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-12 cursor-zoom-out"
        >
          <div className="relative w-full h-full max-w-5xl">
            <Image 
              src={zoomedImage}
              alt="Powiększony zrzut raportu Google PageSpeed"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button 
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-md transition-colors"
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
