import React from 'react';
import { CheckCircle2, Check, Award } from 'lucide-react';

export default function KasInvestmentOptionsSection() {
  return (
    <section className="px-6 md:px-12 lg:px-24 max-w-[90rem] mx-auto mb-40">
      <div className="mb-20 max-w-4xl text-center mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-slate-900">
          Wybierz wariant dopasowany do skali Państwa działań i dotacji
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
          Doskonale rozumiem, że budżety statutowe stowarzyszeń rzadko pozwalają na jednorazowe, duże wydatki na dedykowane systemy IT. Dlatego cały proces wdrożenia oraz moje faktury są ustrukturyzowane tak, aby mogły zostać w 100% sfinansowane i rozliczone w ramach Państwa zewnętrznych funduszy projektowych oraz dotacji celowych (np. z realizowanego obecnie projektu „Aktywnie w kierunku zatrudnienia”):
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
            <span><strong className="text-slate-900">Wdrożenie innowacyjnych narzędzi wsparcia:</strong> Szyfrowany czat wsparcia w czasie rzeczywistym oraz system zapisów online to bezpośrednie narzędzia realizacji Państwa zadań statutowych i projektowych (prowadzenie Punktów Wsparcia i Informacji).</span>
          </li>
        </ul>
        <div className="bg-white p-6 rounded-2xl border border-emerald-100 flex gap-4 items-center">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Check className="w-6 h-6" />
          </div>
          <p className="leading-relaxed text-sm md:text-base">
            <strong className="text-slate-900">Pełna wygoda rozliczenia:</strong> Wystawiam faktury VAT i dzielę całą inwestycję na 5 niezależnych etapów. Ułatwia to bezproblemowe przypisanie poszczególnych kwot do konkretnych okresów rozliczeniowych i linii budżetowych w Państwa raportach dla grantodawców.
          </p>
        </div>
      </div>
    </section>
  );
}
