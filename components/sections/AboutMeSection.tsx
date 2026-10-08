'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Briefcase, Zap } from 'lucide-react';
import { fixOrphans } from '@/utils/typography';
import Image from 'next/image';

export function AboutMeSection() {
  return (
    <section id="o-mnie" className="w-full lg:w-1/4 h-auto lg:h-full shrink-0 flex-shrink-0 flex items-center justify-center relative overflow-hidden bg-transparent pt-10 lg:pt-12 xl:pt-18 2xl:pt-24 pb-14 lg:pb-16 xl:pb-20 2xl:pb-22">
      {/* Background glow na łączeniu sekcji */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center">
        
        {/* Header */}
        <div className="mb-2 lg:mb-2 xl:mb-4 2xl:mb-6 flex flex-col items-start max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-xl xl:text-3xl 2xl:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Kim jestem i dlaczego koduję <span className="text-orange-600">inaczej</span> niż reszta rynku?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4 xl:gap-6 2xl:gap-8 items-start">
          
          {/* Oś czasu / Cechy (Lewa kolumna) */}
          <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col gap-2 lg:gap-2 xl:gap-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white/60 border border-slate-200/50 rounded-2xl xl:rounded-3xl p-3 sm:p-4 lg:p-2.5 xl:p-4 2xl:p-5 flex flex-col gap-1 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 transition-colors shadow-premium-soft"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
              <Code2 className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-orange-500 mb-0.5 relative z-10" />
              <h3 className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base font-bold text-slate-900 relative z-10">Next.js & Performance</h3>
              <p className="text-[10.5px] lg:text-[10px] xl:text-xs text-slate-600 font-light leading-relaxed relative z-10">
                Łączę wygodę panelu CMS z technologią Next.js, której używa Apple i Netflix. Cel? Maksymalna szybkość.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 }}
              className="bg-white/60 border border-slate-200/50 rounded-2xl xl:rounded-3xl p-3 sm:p-4 lg:p-2.5 xl:p-4 2xl:p-5 flex flex-col gap-1 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 transition-colors shadow-premium-soft"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
              <Briefcase className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-orange-500 mb-0.5 relative z-10" />
              <h3 className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base font-bold text-slate-900 relative z-10">Twardy Biznes</h3>
              <p className="text-[10.5px] lg:text-[10px] xl:text-xs text-slate-600 font-light leading-relaxed relative z-10">
                Doświadczenie z logistyki, budowlanki i IoT pozwala mi zrozumieć Twoje realne problemy operacyjne.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 }}
              className="bg-white/60 border border-slate-200/50 rounded-2xl xl:rounded-3xl p-3 sm:p-4 lg:p-2.5 xl:p-4 2xl:p-5 flex flex-col gap-1 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 transition-colors shadow-premium-soft"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
              <Zap className="w-4 h-4 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-orange-500 mb-0.5 relative z-10" />
              <h3 className="text-xs sm:text-sm lg:text-xs xl:text-sm 2xl:text-base font-bold text-slate-900 relative z-10">Maszyny Sprzedażowe</h3>
              <p className="text-[10.5px] lg:text-[10px] xl:text-xs text-slate-600 font-light leading-relaxed relative z-10">
                Nie tworzę wirtualnych wizytówek. Buduję systemy, które automatyzują pracę i zarabiają 24/7.
              </p>
            </motion.div>
          </div>

          {/* Główny tekst (Prawa kolumna) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-8 order-1 lg:order-2 bg-white/80 border border-slate-200 rounded-[1.4rem] xl:rounded-[2rem] p-3 sm:p-4.5 lg:p-3 xl:p-5 2xl:p-7 relative overflow-hidden shadow-premium-soft"
          >
            {/* Subtelny wzór tła */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
            
            <div className="flex items-center gap-3 sm:gap-4 mb-2 lg:mb-1.5 xl:mb-3 2xl:mb-4 relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-10 lg:h-10 xl:w-14 xl:h-14 2xl:w-20 2xl:h-20 rounded-xl xl:rounded-2xl bg-white border border-slate-200 shrink-0 shadow-md overflow-hidden relative">
                <Image src="/Marcin.jpg" alt="Marcin Molenda" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div>
                <div className="text-base sm:text-lg lg:text-sm xl:text-lg 2xl:text-2xl font-bold text-slate-900 tracking-tight">Marcin Molenda</div>
                <div className="text-[9px] sm:text-[10px] lg:text-[8.5px] xl:text-[10px] 2xl:text-[11px] text-orange-600 font-medium uppercase tracking-widest">Niezależny Inżynier Oprogramowania</div>
              </div>
            </div>

            <div className="space-y-1.5 lg:space-y-1.5 xl:space-y-2.5 2xl:space-y-3.5 text-xs lg:text-[10.5px] xl:text-xs 2xl:text-sm text-slate-600 font-light leading-snug lg:leading-relaxed xl:leading-relaxed relative z-10">
              <p>
                {fixOrphans(`Moja droga do tworzenia stron zaczęła się już 10 lat temu. Podobnie jak większość rynku, swoje pierwsze projekty opierałem na WordPressie. Jednak moja obsesja na punkcie bezkompromisowej wydajności szybko zweryfikowała tradycyjne szablony.`)}
              </p>
              
              <p>
                {fixOrphans(`Aby dostarczać klientom absolutnie najlepszą wartość, wdrożyłem architekturę Headless. Używam WordPressa wyłącznie jako wygodnego CMS-a do edycji treści przez klienta, natomiast całą warstwę prezentacji buduję w Next.js - najnowocześniejszej technologii na świecie (używanej m.in. przez Apple). Efekt? Twój zespół edytuje stronę tak prosto jak dotychczas, a serwis ładuje się w ułamku sekundy.`)}
              </p>
              
              <div className="h-px w-full bg-slate-200 my-1.5 lg:my-1.5 xl:my-2.5 2xl:my-4" />
              
              <p>
                {fixOrphans(`To, co mnie wyróżnia, to połączenie inżynierii programistycznej z praktycznym zrozumieniem twardego biznesu. Zanim w 100% zająłem się architekturą IT, pracowałem fizycznie: od logistyki magazynowej, przez montaż urządzeń elektronicznych (IoT), aż po branżę budowlaną. Dzięki temu nie jestem oderwanym od rzeczywistości teoretykiem mówiącym trudnym żargonem.`)}
              </p>
              
              <p className="text-slate-800 font-medium">
                {fixOrphans(`Pełnię rolę technologicznego pomostu. Doskonale rozumiem Twoje codzienne problemy operacyjne (papierologia, brak czasu, wyciekające zapytania) i potrafię przełożyć je na precyzyjne rozwiązania informatyczne. Buduję dedykowane, ultraszybkie "maszyny sprzedażowe", które odciążają Cię z pracy i uciekają konkurencji.`)}
              </p>
            </div>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
}
