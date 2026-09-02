'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, MessageSquareQuote, ExternalLink } from 'lucide-react';
import { fixOrphans } from '@/utils/typography';

const TESTIMONIALS = [
  {
    name: 'Michał',
    role: 'Właściciel DzikiStyl.com',
    service: 'E-commerce B2B & Drukarnia',
    photo: '/DzikiMichał.jpg',
    logo: '/dzikistyl-logo.png',
    link: 'https://dzikistyldemo.vercel.app/',
    quote: 'Przez lata sam rzeźbiłem stronę DzikiStyl i zawsze był ten sam ból – żadna platforma nie była w stanie udźwignąć moich wymagań. To, co Marcin robi w pojedynkę, po prostu przekracza ludzkie pojęcie i technologicznie wyprzedza nasze czasy o 5 lat do przodu! Wielkie dzięki – zrobiłeś absolutny kosmos!',
    highlight: 'technologicznie wyprzedza nasze czasy o 5 lat do przodu!',
    badgeColor: 'text-orange-600 bg-orange-50 border-orange-200',
  },
  {
    name: 'Krzysztof',
    role: 'Właściciel Sklep-Urwis.pl',
    service: 'Grywalizacja & Aplikacja PWA',
    photo: '/Krzysztof_Urwis.jpg',
    logo: '/sklepurwis-logo.png',
    link: 'https://sklep-urwis.pl',
    quote: 'Polecam z całego serca. Marcin stworzył dla mojego sklepu aplikację, która ma w sobie wszystko – koło fortuny z rabatami, strefę gier i kolorowanki. Zarówno strona sklepu, jak i aplikacja PWA przeszły moje najśmielsze oczekiwania – czysty profesjonalizm i masa bajerów.',
    highlight: 'przeszły moje najśmielsze oczekiwania – czysty profesjonalizm',
    badgeColor: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    name: 'Maciek',
    role: 'Właściciel Kajaki u Maćka',
    service: 'Wizerunek, SEO & Wizytówka Google',
    photo: '/kajaki-u-macka-logo.png',
    logo: '/kajaki-u-macka-logo.png',
    link: 'https://kajaki-u-macka.pl',
    quote: 'O stary, ta strona jest tak kozak, nie spodziewałem się aż takiego efektu! Oprócz zjawiskowej strony, Marcin od zera skonfigurował moją Wizytówkę Google i Fanpage, zachowując ten sam świetny motyw. Dostałem potężne rady jak ściągać klientów – jesteś szef po prostu!',
    highlight: 'nie spodziewałem się aż takiego efektu! Jesteś szef po prostu!',
    badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
];

export function TestimonialsSection() {
  return (
    <section id="opinie" className="w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-white border-t border-slate-200/60 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full shadow-xs mb-4">
            <MessageSquareQuote className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
              Głos Klientów
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mb-6">
            Prawdziwe opinie<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-900">
              od przedsiębiorców
            </span>
          </h2>

          <div className="flex items-center gap-1.5 text-amber-400 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="text-slate-800 font-mono text-xs font-bold ml-2">5.0 / 5.0 zadowolenia</span>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200/80 shadow-premium-soft hover:shadow-premium hover:bg-white transition-all flex flex-col justify-between group"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${t.badgeColor}`}>
                    {t.service}
                  </span>
                  <a
                    href={t.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-orange-500 transition-colors p-1"
                    title="Zobacz wdrożenie"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>

                <p className="text-slate-700 text-sm sm:text-base font-light leading-relaxed italic">
                  &ldquo;{fixOrphans(t.quote)}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 mt-8 border-t border-slate-200/60">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/30 relative shrink-0 bg-white">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{t.name}</h4>
                  <p className="text-xs font-mono text-slate-500 truncate">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default TestimonialsSection;
