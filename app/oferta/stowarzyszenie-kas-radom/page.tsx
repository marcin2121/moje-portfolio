import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShieldAlert, Zap, Clock, Activity, Download, Award, Check } from 'lucide-react';
import WcagPanel from '@/components/kas/WcagPanel';
import PerformanceBadge from '@/components/kas/PerformanceBadge';
import MockBookingCalendar from '@/components/kas/MockBookingCalendar';
import ApiSimulator from '@/components/kas/ApiSimulator';
import DownloadPdfButton from '@/components/kas/DownloadPdfButton';
import CopyLinkButton from '@/components/kas/CopyLinkButton';

export const metadata: Metadata = {
  title: 'Dedykowana Oferta - Stowarzyszenie KAS | Marcin Molenda',
  description: 'Poufna oferta technologiczna dla Stowarzyszenia Kombinat Aktywności Społecznej. Nowa, ultraszybka i dostępna (WCAG 2.1 AA) platforma wsparcia.',
  robots: { index: false, follow: false }
};

export default function KasOfferPage() {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-orange-500 selection:text-white transition-all duration-300 wcag-container">
      <WcagPanel />
      <PerformanceBadge />

      <main className="pt-24 pb-32 overflow-x-hidden">
        {/* 1. SEKCJA HERO */}
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8">
            
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm tracking-wide shadow-sm">
                <CheckCircle2 className="w-4 h-4" /> Natywna zgodność z WCAG 2.1 AA w czystym kodzie
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1]">
                Precyzja i bezpieczeństwo dla <span className="text-orange-500 inline-block">stowarzyszenie&shy;kas.pl</span>
              </h1>
              <div className="space-y-4 max-w-2xl">
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                  <strong className="font-bold text-slate-900">Marcin Molenda - Niezależny Inżynier Oprogramowania</strong><br/>
                  Projektuję ultraszybkie systemy dla sektora komercyjnego: e-commerce B2B, aplikacje PWA i integracje. Przenoszę te pancerne standardy wydajności (1.2s ładowania) i bezpieczeństwa (szyfrowanie danych Supabase) do sektora społecznego. Wasza misja wymaga niezawodnej technologii.
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
            
            <div className="w-full lg:w-2/5 xl:w-1/3 relative">
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

        {/* 2. DOWÓD SPOŁECZNY */}
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

        {/* 3. PROBLEM VS ROZWIĄZANIE */}
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

        {/* 4. SHOW DON'T TELL - INTERAKTYWNE PROTOTYPY */}
        <section id="prototypy" className="py-24 bg-slate-900 text-white rounded-[3rem] mx-4 md:mx-12 lg:mx-24 mb-32 relative overflow-hidden">

          
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-6">Zobacz, jak działa niezawodna technologia.</h2>
              <p className="text-slate-400 text-lg">Przetestuj interaktywne prototypy poniżej. To ułamek tego, co otrzymacie w finalnym produkcie.</p>
            </div>

            <div className="space-y-24">
              {/* Prototyp 1: Kalendarz */}
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><Clock className="text-orange-500" /> Prototyp 1: Niezawodny system zapisów</h3>
                <p className="text-slate-400 mb-8">Zauważyłem ślady po próbie wdrożenia kalendarza (skrypt Kalendarz.php). Rozumiem, jak bardzo potrzebujecie tego narzędzia. Powyższy prototyp Next.js działa bez przeładowania strony, jest w 100% odporny na awarie bazodanowe i chroni anonimowość podopiecznych.</p>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-12 print:hidden">
                  <MockBookingCalendar />
                </div>
              </div>

              {/* Prototyp 2: Symulator API */}
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><Activity className="text-orange-500" /> Prototyp 2: Pełna Automatyzacja (n8n)</h3>
                <p className="text-slate-400 mb-8">Zobacz na żywo, jak dane wędrują w bezpieczny i zaszyfrowany sposób, odciążając Was od papierkowej roboty.</p>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-12 print:hidden">
                  <ApiSimulator />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. OPCJE INWESTYCJI - 3 KOLUMNY */}
        <section className="px-6 md:px-12 lg:px-24 max-w-[90rem] mx-auto mb-40">
          <div className="mb-20 max-w-4xl text-center mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-slate-900">
              Wybierz wariant dopasowany do skali Waszych działań i dotacji
            </h2>
            <div className="inline-flex items-start text-left gap-3 px-6 py-4 bg-emerald-50 text-emerald-800 rounded-2xl font-medium text-sm border border-emerald-100 shadow-sm mt-2 max-w-3xl mx-auto">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> 
              <span>Wszystkie ceny są kwotami netto. Wycenę każdego pakietu ustalamy na twardo przed rozpoczęciem prac - kwota na umowie jest ostateczna i nie ulegnie zmianie w trakcie developmentu.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* PAKIET DEDYKOWANY */}
            <div className="bg-white/40 backdrop-blur-xl border border-slate-200/60 rounded-[2.5rem] p-8 md:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col h-full mt-4 lg:mt-8">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-slate-900 mb-4">Pakiet Dedykowany <span className="block text-sm font-bold text-slate-500 mt-1 font-normal uppercase tracking-widest">(Wdrożenie Statutowe)</span></h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Kompletne, bezszablonowe wdrożenie realizujące w 100% wszystkie wymagania formalne, prawne i techniczne z Państwa ogłoszenia. Zapewnia pełną dostępność, anonimowość i niezawodność od pierwszego dnia.
                </p>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inwestycja</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">14 500</span>
                  <span className="text-base font-bold text-slate-500">zł netto</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm"><strong className="text-slate-900">Nowoczesny projekt UX/UI (Mobile-First):</strong> Indywidualnie zaprojektowany, responsywny interfejs, który buduje zaufanie od pierwszego spojrzenia i działa płynnie na każdym urządzeniu.</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm"><strong className="text-slate-900">Autorski, w 100% anonimowy czat wsparcia:</strong> Szyfrowany w czasie rzeczywistym komunikator dla młodzieży oparty o architekturę Supabase - bez ciasteczek śledzących i bez rejestrowania adresów IP podopiecznych (pełna zgodność z Art. 9 RODO).</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm"><strong className="text-slate-900">System zapisów online z kalendarzem:</strong> Bezawaryjny moduł rezerwacji terminów w Next.js. Stabilna, gotowa do pracy alternatywa dla wyłączonego skryptu Kalendarz.php - działa bez przeładowań i chroni anonimowość podopiecznych.</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm"><strong className="text-slate-900">Moduł darowizn i płatności online:</strong> Integracja z systemami szybkich płatności (BLIK, karty, przelewy online) do bezproblemowej obsługi wpłat.</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm"><strong className="text-slate-900">Pełna zgodność z normami WCAG 2.1 AA:</strong> Czysty kod przyjazny czytnikom ekranu, klawiaturze i narzędziom ułatwiającym dostęp dla osób z niepełnosprawnościami.</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <div className="text-sm font-bold text-slate-900 mb-1">Wdrożenie i opieka:</div>
                <div className="text-sm text-slate-600">90 dni mojego pełnego wsparcia technicznego po starcie systemu oraz indywidualne instruktaże wideo z obsługi panelu dla Waszego zespołu.</div>
              </div>
            </div>

            {/* PAKIET OPTYMALNY - RECOMMENDED */}
            <div className="bg-white/70 backdrop-blur-3xl border border-blue-500/30 rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(59,130,246,0.1)] relative overflow-hidden group flex flex-col h-full lg:-translate-y-4">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150"></div>
              
              <div className="mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xs tracking-wide mb-6">
                  <Award className="w-4 h-4" /> REKOMENDOWANY
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Pakiet Optymalny <span className="block text-sm font-bold text-slate-500 mt-1 font-normal uppercase tracking-widest">(Cyfrowy Rozwój)</span></h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Rozbudowany o CRM dla psychologów (Supabase), automatyczne SMS-y/e-maile dla pacjentów oraz pisemny raport WCAG pod audyty unijne. Automatyzacja uwalnia czas zespołu (odzyskujecie około 10h+ pracy biurowej tygodniowo).
                </p>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inwestycja</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">29 000</span>
                  <span className="text-base font-bold text-slate-500">zł netto</span>
                </div>
              </div>

              <div className="space-y-5 mb-8 flex-grow relative z-10">
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm font-medium">Wszystko to, co w Pakiecie Dedykowanym.</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm"><strong className="text-blue-700">Zaawansowany system CRM (Supabase):</strong> Dedykowana, bezpieczna i w pełni szyfrowana baza danych ułatwiająca koordynację pracy zespołu psychologów i bezpieczne zarządzanie kartami pacjentów.</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm"><strong className="text-blue-700">Automatyczne powiadomienia i przypomnienia (SMS & E-mail):</strong> Dwukierunkowa integracja wysyłająca podopiecznym automatyczne przypomnienia o terminach, co eliminuje puste rezerwacje i chaos w kalendarzu.</span>
                </div>
                <div className="flex gap-3">
                  <Check className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm"><strong className="text-blue-700">Pisemny raport zgodności z WCAG:</strong> Profesjonalne sprawozdanie techniczne z walidacji i zgodności strony z normami dostępności cyfrowej - kluczowe i niezbędne dla audytorów rozliczających dotacje (np. z programów EOG czy FRSE).</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 relative z-10">
                <div className="text-sm font-bold text-slate-900 mb-1">Wydłużona opieka i wsparcie:</div>
                <div className="text-sm text-slate-600">12 miesięcy mojej osobistej opieki technicznej nad stabilnością kodu oraz dedykowana platforma szkoleniowa wideo dla nowych wolontariuszy KAS.</div>
              </div>
            </div>

            {/* PAKIET MAKSYMALNY */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col h-full mt-4 lg:mt-8">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/20 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="mb-8 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs tracking-wide mb-6">
                   CYFROWA TRANSFORMACJA ENTERPRISE
                </div>
                <h3 className="text-2xl font-black text-white mb-4">Pakiet Maksymalny <span className="block text-xs font-bold text-slate-400 mt-1 font-normal uppercase tracking-widest">(Automatyzacja Enterprise & AI)</span></h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Pełna infrastruktura technologiczna i automatyzacja procesów z wykorzystaniem sztucznej inteligencji. Zaprojektowana dla organizacji obsługujących bardzo dużą liczbę zgłoszeń, chcących zredukować koszty operacyjne do minimum.
                </p>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Inwestycja</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-white tracking-tight">48 000</span>
                  <span className="text-base font-bold text-slate-400">zł netto</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-grow relative z-10">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  <span className="text-slate-300 text-sm font-medium">Wszystko to, co w Pakiecie Optymalnym.</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/30">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  <span className="text-slate-300 text-sm"><strong className="text-white">Wirtualny Asystent AI (24/7):</strong> Inteligentny doradca wspierany modelami LLM (np. Google Gemini), który automatycznie nawiguje użytkowników po Bazie Wsparcia i udziela informacji.</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/30">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  <span className="text-slate-300 text-sm"><strong className="text-white">Kwalifikacja zgłoszeń na czacie:</strong> System AI, który wstępnie analizuje treść zapytań pod kątem stopnia krytyczności, ułatwiając psychologom priorytetyzację pilnych spraw.</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/30">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  <span className="text-slate-300 text-sm"><strong className="text-white">Zaawansowane integracje n8n:</strong> Autonomiczne workflow łączące formularze i czat z Kalendarzem Google oraz systemem natychmiastowych powiadomień SMS o kryzysach.</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-orange-500/30">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  <span className="text-slate-300 text-sm"><strong className="text-white">Oficjalna Deklaracja Dostępności:</strong> Certyfikowany audyt zewnętrzny i formalne wystawienie ustawowego dokumentu Deklaracji Dostępności cyfrowej.</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 relative z-10">
                <div className="text-sm font-bold text-white mb-1">Wsparcie SLA Premium:</div>
                <div className="text-sm text-slate-400">24 miesiące gwarantowanego wsparcia technicznego z priorytetowym czasem reakcji na błędy krytyczne do 4 godzin.</div>
              </div>
            </div>

          </div>

          <div className="mt-12 text-center max-w-4xl mx-auto px-4">
            <p className="text-slate-600 text-sm md:text-base bg-white/70 backdrop-blur-2xl border border-slate-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.04)] px-8 py-5 rounded-2xl">
              <strong className="text-slate-900 font-bold">Potrzebują Państwo innej konfiguracji?</strong> Istnieje pełna możliwość personalizowania ostatecznej oferty poprzez swobodne dobieranie pojedynczych funkcji z różnych wariantów pakietowych. W takim przypadku przygotuję w 100% indywidualną wycenę.
            </p>
          </div>

          <div className="mt-20 bg-slate-50 border border-slate-200 rounded-3xl p-8 lg:p-12 text-slate-700 max-w-5xl mx-auto shadow-sm relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">Sfinansuj wdrożenie z grantów zewnętrznych</h3>
            <p className="mb-8 leading-relaxed text-lg text-slate-600 max-w-3xl">
              Doskonale rozumiem, że budżety statutowe stowarzyszeń rzadko pozwalają na jednorazowe, duże wydatki na dedykowane systemy IT. Dlatego cały proces wdrożenia oraz moje faktury są ustrukturyzowane tak, aby mogły zostać w 100% sfinansowane i rozliczone w ramach Waszych zewnętrznych funduszy projektowych oraz dotacji celowych (np. z realizowanego obecnie projektu „Aktywnie w kierunku zatrudnienia”):
            </p>
            <ul className="space-y-6 mb-8 text-slate-700">
              <li className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Budżet promocyjno-informacyjny:</strong> Przeznaczenie części budżetu promocyjnego (zazwyczaj od 1% do 5% całkowitej wartości grantu unijnego lub rządowego) na nowoczesny, bezpieczny portal, który w pełni i bezawaryjnie prezentuje rezultaty Waszych działań.</span>
              </li>
              <li className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Działania na rzecz dostępności cyfrowej:</strong> Koszty związane z audytem zerowym, dostosowaniem semantyki kodu pod czytniki ekranu oraz wystawieniem formalnej Deklaracji Dostępności mogą być rozliczone bezpośrednio jako obowiązkowe dostosowanie infrastruktury cyfrowej w ramach likwidacji barier.</span>
              </li>
              <li className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">Wdrożenie innowacyjnych narzędzi wsparcia:</strong> Szyfrowany czat wsparcia w czasie rzeczywistym oraz system zapisów online to bezpośrednie narzędzia realizacji Waszych zadań statutowych i projektowych (prowadzenie Punktów Wsparcia i Informacji).</span>
              </li>
            </ul>
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 flex gap-4 items-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <p className="leading-relaxed text-sm md:text-base">
                <strong className="text-slate-900">Pełna wygoda rozliczenia:</strong> Wystawiam faktury VAT i dzielę całą inwestycję na 5 niezależnych etapów. Ułatwia to bezproblemowe przypisanie poszczególnych kwot do konkretnych okresów rozliczeniowych i linii budżetowych w Waszych raportach dla grantodawców.
              </p>
            </div>
          </div>
        </section>

        {/* 6. GWARANCJE */}
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

        {/* 7. WALL OF LOVE */}
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-32">
          <h2 className="text-3xl md:text-5xl font-black mb-12 text-center">Sprawdzeni przez lokalny biznes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <p className="text-slate-700 italic mb-6">"Marcin przeprowadził dla nas zaawansowaną przebudowę drukarni z ograniczonego silnika Shoper na nowoczesną architekturę Headless Next.js. Wdrożył płatności bez przeładowania strony oraz globalny przełącznik netto/brutto bez odświeżania, co drastycznie usprawniło obsługę naszych klientów B2B. Ta technologia wyprzedza nasze czasy o 5 lat do przodu!"</p>
              <div className="font-bold">Michał</div>
              <div className="text-sm text-slate-500">DzikiStyl.com</div>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <p className="text-slate-700 italic mb-6">"Polecam z całego serca. Marcin stworzył dla mojego sklepu z zabawkami aplikację, która ma w sobie wszystko - koło fortuny z rabatami, strefę zabawy z grami na telefon i kolorowanki z naszą maskotką. Zarówno strona sklepu, jak i aplikacja PWA przeszły moje najśmielsze oczekiwania - to czysty profesjonalizm i niesamowicie bogata funkcjonalność. O to dokładnie chodziło!"</p>
              <div className="font-bold">Krzysztof</div>
              <div className="text-sm text-slate-500">Sklep Urwis</div>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <p className="text-slate-700 italic mb-6">"Marcin stworzył dla nas system, który wygląda obłędnie i działa bezbłędnie nawet przy słabym zasięgu nad rzeką. Od zera zoptymalizował naszą obecność w Google i social mediach, zachowując pełną spójność techniczną. Współpraca z nim to zupełnie inny poziom inżynierii cyfrowej - pełna klasa, zdecydowanie polecam!"</p>
              <div className="font-bold">Maciek</div>
              <div className="text-sm text-slate-500">Kajaki u Maćka</div>
            </div>
          </div>
        </section>

        {/* 8. FAQ */}
        <section className="px-6 md:px-12 lg:px-24 max-w-3xl mx-auto mb-32">
          <h2 className="text-3xl md:text-5xl font-black mb-12 text-center">FAQ</h2>
          <div className="space-y-6">
            <div className="pb-6 border-b border-slate-200">
              <h3 className="font-bold text-xl mb-2">Czy po oddaniu strony będziemy uwiązani jakimś abonamentem?</h3>
              <p className="text-slate-600">Nie. Strona i cały jej kod źródłowy jest Waszą własnością na zawsze.</p>
            </div>
            <div className="pb-6 border-b border-slate-200">
              <h3 className="font-bold text-xl mb-2">Dlaczego Next.js zamiast samego WordPressa?</h3>
              <p className="text-slate-600">Standardowy WordPress jest podatny na awarie i utrudnia wdrożenie pełnego WCAG 2.1 AA. Architektura Headless (Next.js na froncie) chroni prywatność młodzieży i eliminuje ryzyko załamania strony w krytycznym momencie.</p>
            </div>
            <div className="pb-6 border-b border-slate-200">
              <h3 className="font-bold text-xl mb-2">Co się stanie, jeśli po kilku miesiącach coś przestanie działać?</h3>
              <p className="text-slate-600">W zależności od wybranego wariantu, otrzymujecie Państwo od 90 dni (Pakiet Dedykowany), przez 12 miesięcy (Pakiet Optymalny), aż do 24 miesięcy (Pakiet Maksymalny) mojej osobistej, bezpłatnej opieki technicznej i monitoringu bezpieczeństwa w cenie wdrożenia. Po tym okresie możecie zdecydować się na opcjonalny, stały abonament serwisowy, z którego można zrezygnować w dowolnym momencie.</p>
            </div>
          </div>
        </section>

        {/* 9. KONTAKT / PDF DOWNLOAD */}
        <section id="pdf" className="px-6 md:px-12 lg:px-24 max-w-[90rem] mx-auto text-center">
          <div className="bg-slate-900 text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center">
            
            <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-3xl mx-auto relative z-10 leading-relaxed">
              Jeśli chcą Państwo po prostu skonsultować techniczne aspekty działania czatu lub kalendarza - czekam na wiadomość. Szanuję Państwa czas: jeśli ten projekt nie jest teraz priorytetem, krótka informacja zwrotna (nawet jedno zdanie) będzie dla mnie niezwykle pomocna.
            </p>
            
            <div className="relative z-10 mb-16 w-full px-2">
              <a href="mailto:kontakt@molendadevelopment.pl" className="block text-2xl sm:text-3xl md:text-5xl font-black text-white hover:text-blue-400 transition-colors break-all">
                kontakt@molendadevelopment.pl
              </a>
            </div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
              {/* PDF Button */}
              <div className="flex flex-col items-center">
                <DownloadPdfButton />
                <p className="mt-4 text-sm text-slate-400 max-w-sm text-center">
                  Dedykowany, czysty dokument sformatowany do druku A4 - idealny do rozdania na fizycznym spotkaniu decydentów
                </p>
              </div>

              {/* Copy Link Button */}
              <div className="flex flex-col items-center">
                <CopyLinkButton />
                <p className="mt-4 text-sm text-slate-400 max-w-sm text-center">
                  Skopiuj bezpośredni odnośnik do tej podstrony
                </p>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
