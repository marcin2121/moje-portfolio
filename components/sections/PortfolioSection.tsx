'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Terminal, ArrowRight } from 'lucide-react';
import AnimatedWebP from '@/components/ui/AnimatedWebP';
import { fixOrphans } from '@/utils/typography';
import { useQueryState } from 'nuqs';

export interface DemoConfig {
  url: string;
  title: string;
  colorClass: string;
  bgClass: string;
}

interface PortfolioSectionProps {
  handleOpenDemo?: (config: DemoConfig) => void;
}

const PROJECTS = [
  {
    category: 'wizerunek',
    title: 'Stowarzyszenie KAS',
    tags: ['NGO', 'Dostępność Cyfrowa & E-usługi', 'WCAG 2.2 AA'],
    devTags: ['Next.js 16', 'React 19', 'Supabase Realtime', 'PayU'],
    desc: 'Portal Dostępności Cyfrowej & E-usługi',
    challenge: 'Organizacja pilnie potrzebowała bezpiecznego czatu wsparcia i kalendarza wizyt. Próba wdrożenia tak zaawansowanych modułów na tradycyjnym WordPressie kosztowałaby fortunę, a osiągnięcie na nim prawdziwej dostępności cyfrowej graniczyło z cudem.',
    solution: 'Zbudowałem dedykowaną, błyskawiczną platformę z anonimowym czatem na żywo, automatycznym systemem rezerwacji i certyfikowaną dostępnością dla osób z niepełnosprawnościami – zachowując przy tym bajecznie prosty panel do edycji treści.',
    result: 'Ogromna oszczędność budżetu i zero comiesięcznych opłat za wtyczki. Organizacja zyskała pancerne narzędzie do niesienia pomocy bez ryzyka kar prawnych, a strona działa bezawaryjnie na każdym telefonie.',
    img: '/kas-hero.png',
    link: 'https://stowarzyszeniekas.pl'
  },
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

function PortfolioFilters({ handleOpenDemo }: { handleOpenDemo?: (config: DemoConfig) => void }) {
  const [category, setCategory] = useQueryState('kategoria', { defaultValue: 'wszystkie', shallow: true });

  const filteredProjects = category === 'wszystkie' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === category);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-16">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id === 'wszystkie' ? null : cat.id)}
            className={`px-5 py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              category === cat.id 
                ? 'bg-slate-900 text-white shadow-md scale-105' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-24 sm:space-y-32">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => (
            <motion.div 
              key={project.title}
              layout
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 lg:gap-16 items-center`}
            >
              
              {/* Image side */}
              <div className="w-full lg:w-1/2">
                <div
                  className="aspect-4/3 rounded-[2.5rem] bg-slate-100 border border-slate-200 overflow-hidden relative group shadow-premium cursor-pointer"
                  onClick={() => {
                    if (handleOpenDemo && project.link && project.link !== '#') {
                      handleOpenDemo({
                        url: project.link,
                        title: project.title,
                        colorClass: 'text-orange-500',
                        bgClass: 'bg-orange-500'
                      });
                    }
                  }}
                >
                  <AnimatedWebP 
                    src={project.img} 
                    alt={project.title} 
                    className="opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 block mb-1">
                        {project.desc}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{project.title}</h3>
                    </div>
                    {project.link !== '#' && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-orange-500/30"
                        title="Otwórz stronę na żywo"
                      >
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
                    <span key={tag} className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-orange-600 text-[10px] uppercase font-bold tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Wyzwanie
                    </h4>
                    <p className="text-slate-600 font-light leading-relaxed text-sm sm:text-base">{fixOrphans(project.challenge)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Rozwiązanie techniczne
                    </h4>
                    <p className="text-slate-600 font-light leading-relaxed text-sm sm:text-base">{fixOrphans(project.solution)}</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 border-l-4 border-l-orange-500 shadow-premium-soft">
                    <h4 className="text-xs font-mono text-orange-600 uppercase tracking-widest mb-2 flex items-center gap-2 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Wynik Biznesowy & ROI
                    </h4>
                    <p className="text-slate-900 font-medium text-sm sm:text-base leading-relaxed">{fixOrphans(project.result)}</p>
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

export function PortfolioSection({ handleOpenDemo }: PortfolioSectionProps) {
  return (
    <section id="realizacje" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-white border-t border-slate-200/60">
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full shadow-xs mb-4">
            <Terminal size={14} className="text-orange-500" />
            <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
              Moje Wdrożenia B2B
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mb-6">
            Projekty, które generują<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-950">
              mierzalny zysk i przewagę
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            {fixOrphans('Nie obiecuję niemożliwego – dowożę bezbłędny kod i realne rezultaty. Zobacz, jak moje autorskie systemy przyspieszyły operacje w firmach klientów.')}
          </p>
        </div>

        <Suspense fallback={<div className="h-64 flex items-center justify-center text-slate-400 font-mono text-sm">Ładowanie projektów...</div>}>
          <PortfolioFilters handleOpenDemo={handleOpenDemo} />
        </Suspense>

        {/* Link to all case studies */}
        <div className="mt-20 flex justify-center">
          <Link
            href="/wdrozenia"
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-105 group"
          >
            <span>Zobacz szczegółowe Case Studies</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-orange-400" />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default PortfolioSection;
