'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MoveLeft, Terminal, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import MagneticWrapper from '@/components/ui/MagneticWrapper';

const Particles = dynamic(() => import('@/components/ui/Particles'), { ssr: false });

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Administrator Danych Osobowych",
      content: "Administratorem Twoich danych osobowych jest Marcin Molenda, prowadzący działalność gospodarczą pod firmą Molenda Development, NIP: 7981489581, REGON: 545325616, z siedzibą przy ul. Jodłowej 28, 98-220 Zduńska Wola. Wszelkie zapytania oraz wnioski dotyczące ochrony danych i realizacji przysługujących praw prosimy kierować na dedykowany adres e-mail: kontakt@molendadevelopment.pl."
    },
    {
      title: "2. Podstawa Prawna i Cele Przetwarzania",
      content: "Dane osobowe przetwarzane są na podstawie Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO): w celu realizacji kontaktu, przygotowania wyceny lub audytu technologicznego na Twoje życzenie (art. 6 ust. 1 lit. b RODO), w celu wykonania zawartej umowy o świadczenie usług programistycznych, a także w oparciu o prawnie uzasadniony interes Administratora (art. 6 ust. 1 lit. f RODO) polegający na ochronie infrastruktury serwerowej przed nadużyciami, spamem i atakami sieciowymi."
    },
    {
      title: "3. Zakres Danych i Odbiorcy",
      content: "Gromadzimy wyłącznie minimum danych niezbędnych do celów biznesowych: imię, nazwisko lub nazwę firmy, adres e-mail, numer telefonu oraz adres URL analizowanej witryny. Twoje dane osobowe nigdy nie są sprzedawane, wypożyczane ani udostępniane podmiotom trzecim w celach reklamowych. Mogą być przekazywane wyłącznie zaufanym podmiotom zapewniającym infrastrukturę techniczną (np. certyfikowanym dostawcom usług e-mail, takim jak Resend, oraz certyfikowanym centrom danych) na podstawie umów powierzenia przetwarzania danych."
    },
    {
      title: "4. Analityka Cookieless i Poszanowanie Prywatności",
      content: "Serwis wykorzystuje nowoczesne, etyczne narzędzie analityczne Umami Analytics, które działa w technologii Cookieless. Oznacza to, że nie zapisujemy na Twoim urządzeniu żadnych śledzących plików cookies, nie gromadzimy unikalnych identyfikatorów ani nie tworzymy profili behawioralnych. Adresy IP są natychmiast anonimizowane przed zapisaniem. Dzięki temu korzystanie z serwisu jest w 100% zgodne z dyrektywą e-Privacy i RODO bez konieczności wyświetlania inwazyjnych banerów cookies."
    },
    {
      title: "5. Okres Przechowywania Danych (Retencja)",
      content: "Dane przekazane w formularzu kontaktowym lub zapytaniu o audyt przechowywane są przez okres niezbędny do przeprowadzenia rozmów biznesowych i obsługi zlecenia, a w przypadku nawiązania współpracy – przez czas trwania umowy oraz okres przedawnienia ewentualnych roszczeń wynikający z przepisów prawa (w tym prawa podatkowego i rachunkowości)."
    },
    {
      title: "6. Bezpieczeństwo i Szyfrowanie Połączeń",
      content: "Stosujemy rygorystyczne standardy inżynieryjne w celu ochrony przesyłanych informacji. Całość transmisji danych zabezpieczona jest nowoczesnym protokołem kryptograficznym TLS 1.3 z wymuszeniem szyfrowania nagłówkiem HSTS (Strict-Transport-Security). Formularze zabezpieczone są przed atakami CSRF oraz botami bez uciążliwych mechanizmów CAPTCHA."
    },
    {
      title: "7. Prawa Osoby, Której Dane Dotyczą",
      content: "Przysługuje Ci prawo żądania dostępu do treści swoich danych, ich sprostowania, usunięcia ('prawo do bycia zapomnianym'), ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu wobec przetwarzania. Masz również prawo wniesienia skargi do organu nadzorczego – Prezesa Urzędu Ochrony Danych Osobowych (PUODO, ul. Stawki 2, 00-193 Warszawa)."
    },
    {
      title: "8. Dobrowolność i Brak Zautomatyzowanego Profilowania",
      content: "Podanie danych jest całkowicie dobrowolne, lecz niezbędne do przesłania zapytania ofertowego lub wygenerowania audytu. Twoje dane nie podlegają zautomatyzowanemu podejmowaniu decyzji wywołującemu skutki prawne, w tym profilowaniu marketingowemu."
    }
  ];

  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-x-hidden relative flex flex-col items-center">
      
      {/* GLOBALNA SIATKA */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_80%_80%_at_0%_50%,#000_30%,transparent_100%)] opacity-80 pointer-events-none" />
      <Particles color="#ea580c" />

      {/* TOP NAV / BACK */}
      <header className="w-full max-w-7xl px-6 py-8 flex items-center justify-between relative z-10">
        <MagneticWrapper>
          <Link href="/">
            <button className="p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500 shadow-sm">
              <MoveLeft size={14} /> Powrót
            </button>
          </Link>
        </MagneticWrapper>
        <div className="font-mono text-[9px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Terminal size={14} className="text-orange-500" /> mm.dev // privacy_policy
        </div>
      </header>

      {/* BODY CONTENT */}
      <article className="w-full max-w-3xl px-6 py-12 flex flex-col items-start gap-10 relative z-10 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-2">
            <ShieldAlert size={20} className="text-orange-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-mono tracking-tighter text-slate-900">
            Polityka<br />Prywatności
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Wersja r.02 / Ostatnia zmiana: wrzesień 2026</p>
        </motion.div>

        <motion.div 
          className="w-full space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {sections.map((section, index) => (
            <div 
              key={index} 
              className="p-6 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl flex flex-col gap-3 group hover:border-orange-200 shadow-sm transition-all"
            >
              <h2 className="font-mono text-sm uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-sm group-hover:scale-125 transition-transform" />
                {section.title}
              </h2>
              <p className="text-sm font-light text-slate-600 leading-relaxed pl-3.5">
                {section.content}
              </p>
            </div>
          ))}
        </motion.div>
      </article>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-200/50 py-6 mt-auto text-center font-mono text-[9px] text-slate-400 uppercase tracking-[0.2em] relative z-10">
        &copy; {new Date().getFullYear()} Marcin Molenda // Molenda Development
      </footer>
    </main>
  );
}
