'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-[#FAFAFA] text-slate-900 font-sans flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Premium Light Diffuse Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[64px_64px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white/40 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* Elegant typographic status instead of pill badge */}
          <div className="flex items-center gap-6 mb-12">
            <div className="h-[1px] w-12 bg-slate-200" />
            <span className="font-mono text-xs text-slate-400 tracking-[0.3em] uppercase">Status 404</span>
            <div className="h-[1px] w-12 bg-slate-200" />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight mb-8 text-slate-900 leading-[1.05]">
            Ślepy zaułek.
            <br />
            <span className="text-slate-400">Czas wrzucić wyższy bieg.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed mb-12 max-w-lg">
            Ta strona nie istnieje, ale Twój biznes nie musi stać w miejscu. 
            Wróć na stronę główną i zobacz, jak nowoczesna architektura B2B napędza konwersję u liderów rynku.
          </p>

          <Link href="/">
            <button className="group relative px-8 py-4 bg-slate-900 text-white font-medium tracking-wide text-sm rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4 overflow-hidden">
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <MoveLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">Wróć na Stronę Główną</span>
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
