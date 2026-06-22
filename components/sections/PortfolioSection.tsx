'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Terminal } from 'lucide-react';
import AnimatedWebP from '@/components/ui/AnimatedWebP';

export function PortfolioSection({ isDevMode }: { isDevMode: boolean }) {
  const projects = [
    {
      title: 'DzikiStyl.com',
      tags: ['Zaawansowana personalizacja', 'Migracja Next.js'],
      devTags: ['Headless Commerce', 'React Three Fiber', 'Direct-Upload R2'],
      desc: 'Drukarnia Online & Studio Graficzne',
      challenge: 'Klient potrzebował gruntownej przebudowy ociężałego systemu, aby skalować sprzedaż B2B. Problemem była obsługa gigabajtowych plików DTP "zapychających" serwery oraz brak elastyczności w błyskawicznym zarządzaniu marżą netto/brutto w wielokrokowym konfiguratorem poligraficznym.',
      solution: 'Zaprojektowanie dedykowanej architektury "Headless Commerce" (Next.js App Router). Wdrożenie zaawansowanego kreatora zamówień opartego na stanie w URL (nuqs) i globalnym stanie (Zustand), oraz architektury Direct-Upload przesyłającej pliki graficzne bezpośrednio do Cloudflare R2.',
      result: 'Skrócenie czasu ładowania strony o 70% (milisekundy). Całkowite odciążenie serwerów od przetwarzania plików DTP oraz drastyczna poprawa pozycjonowania SEO i doświadczenia klienta agencyjnego (B2B).',
      img: '/dzikistyl.webp',
      link: 'https://dzikistyl.com'
    },
    {
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
      title: 'Opal',
      tags: ['BI', 'Analiza Danych', 'Node.js'],
      devTags: ['K-Means Clustering', 'Data Visualization', 'No-Python ML'],
      desc: 'Business Intelligence Panel',
      challenge: 'Potrzeba potężnego panelu do analizy i segmentacji dużych zbiorów danych bez konieczności stawiania zewnętrznych, drogich serwerów Python do machine learningu.',
      solution: 'Wdrożenie nienadzorowanego uczenia maszynowego (K-Means z diagnostyką Metody Łokcia) bezpośrednio w architekturze Node.js, dostarczając interaktywne wykresy profilowe i symulator What-If.',
      result: 'Błyskawiczne, darmowe w utrzymaniu przetwarzanie danych analitycznych i precyzyjne prognozowanie bezpośrednio w przeglądarce klienta.',
      img: '/opal.webp',
      link: '#'
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#161618] border-t border-[#222225]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-[#F5F5F7] tracking-tight mb-6">
            {isDevMode ? 'Production Deployments' : 'Wybrane wdrożenia produkcyjne'}
          </h2>
          <p className="text-[#A1A1A5] text-lg max-w-2xl mx-auto font-light leading-relaxed">
            {isDevMode 
              ? 'Analyzing real-world bottlenecks solved via custom monolithic-to-headless migrations and heavy API integrations.' 
              : 'Nie obiecuję niemożliwego – dowożę mierzalne rezultaty. Przeczytaj, jak moje realizacje zmieniły operacje w firmach klientów.'}
          </p>
        </div>

        <div className="space-y-24">
          {projects.map((project, idx) => (
            <div key={idx} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-16 items-center`}>
              
              {/* Image side */}
              <div className="w-full lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="aspect-[4/3] rounded-[2rem] bg-[#0B0B0C] border border-[#222225] overflow-hidden relative group shadow-2xl"
                >
                  <AnimatedWebP src={project.img} alt={project.title} className="opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <h3 className="text-3xl font-black text-white tracking-tight">{project.title}</h3>
                    {project.link !== '#' && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#FF6900] text-black flex items-center justify-center hover:scale-110 transition-transform">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Content side */}
              <div className="w-full lg:w-1/2">
                <div className="flex flex-wrap gap-2 mb-6">
                  {(isDevMode ? project.devTags : project.tags).map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-[#222225] border border-[#FF6900]/20 text-[#FF6900] text-[10px] uppercase font-bold tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-mono text-[#A1A1A5] uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {isDevMode ? 'Issue / Challenge' : 'Wyzwanie'}
                    </h4>
                    <p className="text-[#F5F5F7] font-light leading-relaxed">{project.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-mono text-[#A1A1A5] uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {isDevMode ? 'Technical Implementation' : 'Rozwiązanie techniczne'}
                    </h4>
                    <p className="text-[#F5F5F7] font-light leading-relaxed">{project.solution}</p>
                  </div>
                  <div className="p-6 rounded-xl bg-[#0B0B0C] border border-[#222225] border-l-4 border-l-[#FF6900]">
                    <h4 className="text-sm font-mono text-[#FF6900] uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" /> {isDevMode ? 'ROI & Business Impact' : 'Wynik Biznesowy i ROI'}
                    </h4>
                    <p className="text-[#F5F5F7] font-bold leading-relaxed">{project.result}</p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Michał's Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 p-8 md:p-16 rounded-[3rem] bg-[#0B0B0C] border border-[#222225] relative overflow-hidden text-center"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FF6900]/10 blur-[100px] pointer-events-none" />
          <div className="text-6xl text-[#FF6900] font-serif absolute top-8 left-8 opacity-20">"</div>
          
          <p className="text-xl md:text-3xl font-light text-[#F5F5F7] leading-relaxed relative z-10 max-w-4xl mx-auto italic mb-10">
            Przez lata sam rzeźbiłem stronę DzikiStyl i zawsze był ten sam ból – żadna platforma nie była w stanie udźwignąć moich skomplikowanych wymagań dotyczących personalizacji usług. To, co Marcin robi w pojedynkę, po prostu przekracza ludzkie pojęcie i <span className="text-[#FF6900] font-bold">technologicznie wyprzedza nasze czasy o 5 lat do przodu!</span> Z całego serca polecam usługi każdemu, kto marzy o bezkompromisowej aplikacji. Wielkie dzięki – zrobiłeś absolutny kosmos!
          </p>
          
          <div className="flex flex-col items-center justify-center gap-2 relative z-10">
            <div className="w-16 h-16 rounded-full bg-[#161618] border-2 border-[#FF6900] mb-2 overflow-hidden">
              <img src="/dzikistyl.webp" alt="DzikiStyl" className="w-full h-full object-cover opacity-50" />
            </div>
            <div className="text-[#F5F5F7] font-bold tracking-wide">Michał</div>
            <div className="text-[#A1A1A5] text-sm uppercase tracking-widest font-mono">Właściciel DzikiStyl.com</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
