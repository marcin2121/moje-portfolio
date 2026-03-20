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
      title: "1. Administrator Danych",
      content: "Administratorem Twoich danych osobowych jest Marcin Molenda, Polska. Kontakt w sprawach ochrony danych możliwy jest pod adresem e-mail: kontakt@molendadevelopment.pl."
    },
    {
      title: "2. Cel i podstawa prawna",
      content: "Dane osobowe przetwarzane są wyłącznie w celu obsługi zapytań wysyłanych przez formularz kontaktowy (prawnie uzasadniony interes Administratora) oraz realizacji ewentualnych usług (umowa). Przetwarzanie odbywa się zgodnie z RODO."
    },
    {
      title: "3. Zakres zbierania i odbiorcy",
      content: "Zbieramy wyłącznie dane niezbędne do kontaktu: Imię/Nazwa Firmy oraz Adres e-mail. Twoje dane nie są sprzedawane ani przekazywane podmiotom trzecim w celach marketingowych. Mogą być powierzone wyłącznie zaufanym dostawcom technologii (np. Formspree do obsługi formularza)."
    },
    {
      title: "4. Pliki Cookies i Analityka",
      content: "Strona wykorzystuje narzędzie analityczne Umami, które nie wykorzystuje plików cookies (jest w 100% zgodne z RODO i nie zbiera danych identyfikacyjnych użytkownika). Cookies mogą być zapisywane wyłącznie przez przeglądarkę na potrzeby techniczne (np. lokalna pamięć podręczna)."
    },
    {
      title: "5. Prawa Użytkownika",
      content: "Masz prawo żądania dostępu do swoich danych, ich sprostowania, usunięcia ('prawo do bycia zapomnianym'), ograniczenia przetwarzania oraz wniesienia skargi do organu nadzorczego (PUODO)."
    }
  ];

  return (
    <main className="min-h-screen w-full bg-zinc-950 text-white font-sans overflow-x-hidden relative flex flex-col items-center">
      
      {/* GLOBALNA SIATKA */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_80%_80%_at_0%_50%,#000_30%,transparent_100%)] opacity-80 pointer-events-none" />
      <Particles color="#ea580c" />

      {/* TOP NAV / BACK */}
      <header className="w-full max-w-7xl px-6 py-8 flex items-center justify-between relative z-10">
        <MagneticWrapper>
          <Link href="/">
            <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl hover:border-zinc-700 transition-all flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-300">
              <MoveLeft size={14} /> Powrót
            </button>
          </Link>
        </MagneticWrapper>
        <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest flex items-center gap-2">
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
          <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center mb-2">
            <ShieldAlert size={20} className="text-orange-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-mono tracking-tighter text-white">
            Polityka<br />Prywatności
          </h1>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Wersja r.01 / Ostatnia zmiana: marzec 2026</p>
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
              className="p-6 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl flex flex-col gap-3 group hover:border-orange-500/20 transition-all"
            >
              <h2 className="font-mono text-sm uppercase tracking-widest text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full group-hover:scale-125 transition-transform" />
                {section.title}
              </h2>
              <p className="text-sm font-light text-zinc-400 leading-relaxed pl-3.5">
                {section.content}
              </p>
            </div>
          ))}
        </motion.div>
      </article>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/5 py-6 mt-auto text-center font-mono text-[9px] text-zinc-500 uppercase tracking-[0.2em] relative z-10">
        &copy; {new Date().getFullYear()} Marcin Molenda // Molenda Development
      </footer>
    </main>
  );
}
