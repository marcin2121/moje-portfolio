'use client';
import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Terminal } from 'lucide-react';
import AnimatedWebP from '@/components/ui/AnimatedWebP';
import Image from 'next/image';
import { fixOrphans } from '@/utils/typography';
import { useQueryState } from 'nuqs';

const PROJECTS = [
  {
    category: 'e-commerce',
    title: 'DzikiStyl.com',
    tags: ['Zaawansowana personalizacja', 'Migracja Next.js'],
    devTags: ['Headless Commerce', 'React Three Fiber', 'Direct-Upload R2'],
    desc: 'Drukarnia Online & Studio Graficzne',
    challenge: 'Klient potrzebował szybkiej platformy B2B. Problemem była obsługa wielkich plików graficznych zapychających serwery oraz brak elastyczności konfiguratora.',
    solution: 'Zaprojektowaliśmy system "Headless Commerce" w Next.js. Wdrożyliśmy płynny kreator zamówień B2B i architekturę zrzucającą ciężar plików graficznych bezpośrednio do chmury (Cloudflare R2).',
    result: 'Skrócenie czasu ładowania do ułamków sekund, odciążenie serwerów oraz drastyczna poprawa wyników pozycjonowania SEO.',
    img: '/dzikistyl.jpg',
    link: 'https://dzikistyldemo.vercel.app/'
  },
  {
    category: 'pwa',
    title: 'Sklep Urwis / Akademia',
    tags: ['Grywalizacja', 'PWA', 'Smart-Automations'],
    devTags: ['PWA Offline Mode', 'WebGL Minigames', 'Gemini AI Assistant'],
    desc: 'Interaktywne PWA z Grywalizacją',
    challenge: 'Stacjonarny sklep potrzebował nowoczesnego kanału dotarcia do klientów w promieniu 40 km, konkurując z gigantami e-commerce, angażując dzieci i rodziców bez wymuszania instalacji ciężkich aplikacji z Google Play/App Store.',
    solution: 'Zakodowanie od zera dedykowanej aplikacji Progressive Web App (PWA) działającej offline. Wdrożenie modułu 9 autorskich gier przeglądarkowych HTML5, systemu rozszerzonej rzeczywistości (WebAR) i integracja płatności z automatyzowanym programem lojalnościowym.',
    result: 'Wyeliminowanie narzutu manualnego na obsługę klienta (zero manual overhead w wydawaniu nagród). Natychmiastowy wzrost wizyt stacjonarnych dzięki grywalizacji i skrócenie dystansu do klienta poprzez zapisanie aplikacji bezpośrednio na ekranie smartfona.',
    img: '/sklep-urwis.webp',
    link: 'https://sklepurwis.pl'
  },
  {
    category: 'saas',
    title: 'zamowtu.pl',
    tags: ['SaaS', 'Platforma Transakcyjna', 'Fintech'],
    devTags: ['Next.js', 'Stripe Connect', 'Supabase'],
    desc: 'Gastronomiczny SaaS',
    challenge: 'Restauratorzy tracili gigantyczne prowizje na rzecz zewnętrznych portali dostaw, potrzebując niezależnego systemu transakcyjnego z możliwością edycji menu w locie.',
    solution: 'Zbudowanie kompleksowej platformy SaaS z obsługą płatności online i zaawansowanym panelem administracyjnym pozwalającym na pełną edycję asortymentu w czasie rzeczywistym.',
    result: 'Uwolnienie restauratorów od zewnętrznych opłat abonamentowych i drastyczny wzrost rentowności lokalnych biznesów gastronomicznych.',
    img: '/zamowtu.webp',
    link: 'https://zamowtu.pl'
  },
  {
    category: 'wizerunek',
    title: 'Kajaki u Maćka',
    tags: ['Strona Wizerunkowa', 'Wizytówka Google'],
    devTags: ['Next.js', 'SEO', 'Social Media'],
    desc: 'Spływy Kajakowe Pilicą w Biejkowie',
    challenge: 'Lokalny biznes turystyczny potrzebował nowoczesnego wizerunku w sieci oraz pełnej konfiguracji Social Mediów i map Google, by wyróżnić się na tle ogromnej, lokalnej konkurencji na Pilicy.',
    solution: 'Zbudowanie superszybkiego landing page\'a z systemem automatycznego pozyskiwania opinii. Pełna konfiguracja fanpage\'a i Wizytówki Google ze zintegrowanym, spójnym motywem wizualnym.',
    result: 'Niewiarygodny skok zaufania u nowych klientów i błyskawiczne pozyskiwanie pozytywnych opinii (5 gwiazdek) z wyszukiwarki Google, co napędza rezerwacje na nadchodzący weekend bez żadnego budżetu reklamowego.',
    img: '/kajaki.png',
    link: 'https://kajaki-u-macka.pl'
  }
];

const CATEGORIES = [
  { id: 'wszystkie', label: 'Wszystkie' },
  { id: 'e-commerce', label: 'E-commerce' },
  { id: 'saas', label: 'SaaS' },
  { id: 'pwa', label: 'PWA / Mobile' },
  { id: 'wizerunek', label: 'Wizerunek' }
];

function PortfolioFilters() {
  const [category, setCategory] = useQueryState('kategoria', { defaultValue: 'wszystkie', shallow: true });

  const filteredProjects = category === 'wszystkie' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === category);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id === 'wszystkie' ? null : cat.id)}
            className={`px-6 py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              category === cat.id 
                ? 'bg-slate-900 text-white shadow-md scale-105' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-24">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div 
              key={project.title}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-16 items-center`}
            >
              
              {/* Image side */}
              <div className="w-full lg:w-1/2">
                <div
                  className="aspect-[4/3] rounded-[2rem] bg-slate-100 border border-slate-200 overflow-hidden relative group shadow-premium-soft"
                >
                  <AnimatedWebP src={project.img} alt={project.title} className="opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <h3 className="text-3xl font-black text-white tracking-tight">{project.title}</h3>
                    {project.link !== '#' && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#FF6900] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className="w-full lg:w-1/2">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-[10px] uppercase font-bold tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Wyzwanie
                    </h4>
                    <p className="text-slate-700 font-light leading-relaxed">{fixOrphans(project.challenge)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Rozwiązanie techniczne
                    </h4>
                    <p className="text-slate-700 font-light leading-relaxed">{fixOrphans(project.solution)}</p>
                  </div>

                  <div className="p-6 rounded-xl bg-white border border-slate-200 border-l-4 border-l-[#FF6900] shadow-sm">
                    <h4 className="text-sm font-mono text-[#FF6900] uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" /> Wynik Biznesowy i ROI
                    </h4>
                    <p className="text-slate-900 font-bold leading-relaxed">{fixOrphans(project.result)}</p>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

export function PortfolioSection() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex items-center gap-2 text-orange-500 font-mono tracking-widest uppercase text-sm mb-4">
          <Terminal size={16} />
          <span>Moje realizacje</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 mb-16">
          Wybrane<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-700">
            projekty B2B
          </span>
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-20">
          {fixOrphans('Nie obiecuję niemożliwego – dowożę mierzalne rezultaty. Przeczytaj, jak moje realizacje zmieniły operacje w firmach klientów.')}
        </p>

        <Suspense fallback={<div className="h-64 flex items-center justify-center text-slate-400">Ładowanie projektów...</div>}>
          <PortfolioFilters />
        </Suspense>

        {/* Michał's Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 p-8 md:p-16 rounded-[3rem] bg-white/80 backdrop-blur-xl border border-slate-200 shadow-premium-soft relative overflow-hidden text-center"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FF6900]/10 blur-[100px] pointer-events-none" />
          <div className="text-6xl text-[#FF6900] font-serif absolute top-8 left-8 opacity-20">&quot;</div>
          
          <p className="text-xl md:text-3xl font-light text-slate-700 leading-relaxed relative z-10 max-w-4xl mx-auto italic mb-10">
            {fixOrphans(`Przez lata sam rzeźbiłem stronę DzikiStyl i zawsze był ten sam ból – żadna platforma nie była w stanie udźwignąć moich skomplikowanych wymagań dotyczących personalizacji usług. To, co Marcin robi w pojedynkę, po prostu przekracza ludzkie pojęcie i `)}<span className="text-[#FF6900] font-bold">{fixOrphans(`technologicznie wyprzedza nasze czasy o 5 lat do przodu!`)}</span>{fixOrphans(` Z całego serca polecam usługi każdemu, kto marzy o bezkompromisowej aplikacji. Wielkie dzięki – zrobiłeś absolutny kosmos!`)}
          </p>
          
          <div className="flex flex-col items-center justify-center gap-2 relative z-10">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-[#FF6900] mb-2 overflow-hidden shadow-sm">
              <Image src="/dzikistyl.jpg" alt="DzikiStyl" width={64} height={64} className="w-full h-full object-cover opacity-90" />
            </div>
            <div className="text-slate-900 font-bold tracking-wide">Michał</div>
            <div className="text-slate-500 text-sm uppercase tracking-widest font-mono">Właściciel DzikiStyl.com</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
