'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Code2, Briefcase, Zap, CheckCircle2 } from 'lucide-react';
import { fixOrphans } from '@/utils/typography';
import Image from 'next/image';

export function AboutMeSection() {
  return (
    <section className="w-full lg:w-1/4 h-auto lg:h-screen lg:min-h-[100dvh] flex-shrink-0 flex items-center justify-center relative bg-transparent py-24 lg:py-0">
      {/* Background glow na łączeniu sekcji */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col items-start max-w-2xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Kim jestem i dlaczego koduję <span className="text-orange-600">inaczej</span> niż reszta rynku?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Oś czasu / Cechy (Lewa kolumna) */}
          <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-white/60 border border-slate-200/50 rounded-3xl p-5 lg:p-6 flex flex-col gap-2 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 transition-colors shadow-premium-soft"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
              <Code2 className="w-6 h-6 text-orange-500 mb-1 relative z-10" />
              <h3 className="text-lg font-bold text-slate-900 relative z-10">Next.js & Performance</h3>
              <p className="text-xs text-slate-600 font-light leading-relaxed relative z-10">
                Odrzuciłem WordPressa na rzecz technologii, której używa Apple i Netflix. Cel? Maksymalna szybkość.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 }}
              className="bg-white/60 border border-slate-200/50 rounded-3xl p-5 lg:p-6 flex flex-col gap-2 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 transition-colors shadow-premium-soft"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
              <Briefcase className="w-6 h-6 text-orange-500 mb-1 relative z-10" />
              <h3 className="text-lg font-bold text-slate-900 relative z-10">Twardy Biznes</h3>
              <p className="text-xs text-slate-600 font-light leading-relaxed relative z-10">
                Doświadczenie z logistyki, budowlanki i IoT pozwala mi zrozumieć Twoje realne problemy operacyjne.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 }}
              className="bg-white/60 border border-slate-200/50 rounded-3xl p-5 lg:p-6 flex flex-col gap-2 backdrop-blur-sm relative overflow-hidden group hover:border-orange-300 transition-colors shadow-premium-soft"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
              <Zap className="w-6 h-6 text-orange-500 mb-1 relative z-10" />
              <h3 className="text-lg font-bold text-slate-900 relative z-10">Maszyny Sprzedażowe</h3>
              <p className="text-xs text-slate-600 font-light leading-relaxed relative z-10">
                Nie tworzę wirtualnych wizytówek. Buduję systemy, które automatyzują pracę i zarabiają 24/7.
              </p>
            </motion.div>
          </div>

          {/* Główny tekst (Prawa kolumna) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-8 order-1 lg:order-2 bg-white/80 border border-slate-200 rounded-[2rem] p-6 lg:p-10 relative overflow-hidden shadow-premium-soft"
          >
            {/* Subtelny wzór tła */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shrink-0 shadow-2xl overflow-hidden relative">
                <Image src="/Marcin.jpg" alt="Marcin Molenda" fill className="object-cover" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 tracking-tight">Marcin Molenda</div>
                <div className="text-[11px] text-orange-600 font-medium uppercase tracking-widest">Niezależny Inżynier Oprogramowania</div>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 font-light leading-relaxed relative z-10">
              <p>
                {fixOrphans(`Moja droga do tworzenia stron zaczęła się już 10 lat temu. Podobnie jak większość rynku, swoje pierwsze projekty opierałem na popularnym WordPressie. Jednak moja obsesja na punkcie progresu i bezkompromisowej wydajności szybko zweryfikowała to narzędzie.`)}
              </p>
              
              <p>
                {fixOrphans(`Aby deklasować powolne strony konkurencji i dostarczać moim klientom absolutnie najlepszą wartość biznesową, całkowicie zmieniłem podejście. Zacząłem projektować w Next.js – najnowocześniejszej technologii webowej na świecie (używanej m.in. przez TikToka i Apple), która sprawia, że strony ładują się w ułamku sekundy.`)}
              </p>
              
              <div className="h-px w-full bg-slate-200 my-6" />
              
              <p>
                {fixOrphans(`To, co mnie wyróżnia, to połączenie inżynierii programistycznej z praktycznym zrozumieniem twardego biznesu. Zanim w 100% zająłem się architekturą IT, pracowałem fizycznie – od logistyki magazynowej, przez montaż urządzeń elektronicznych (IoT), aż po branżę budowlaną. Dzięki temu nie jestem oderwanym od rzeczywistości teoretykiem mówiącym trudnym żargonem.`)}
              </p>
              
              <p className="text-slate-800 font-medium">
                {fixOrphans(`Pełnię rolę technologicznego pomostu. Doskonale rozumiem Twoje codzienne problemy operacyjne (papierologia, brak czasu, wyciekające zapytania) i potrafię przełożyć je na precyzyjne rozwiązania informatyczne. Odrzucam zacinające się szablony. Buduję dedykowane, ultraszybkie "maszyny sprzedażowe", które odciążają Cię z ręcznej pracy i uciekają Twojej konkurencji.`)}
              </p>
            </div>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
}
