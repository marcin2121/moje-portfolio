'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import MagneticWrapper from '@/components//ui/MagneticWrapper';

const Particles = dynamic(() => import('@/components/ui/Particles'), { ssr: false });

export default function NotFound() {
  return (
    <main className="min-h-screen w-full bg-zinc-950 text-white font-sans overflow-hidden relative flex flex-col items-center justify-center px-6">
      {/* GLOW BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-size-[40px_40px] opacity-80 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-orange-950/20 blur-[130px] rounded-full pointer-events-none" />
      
      <Particles color="#ea580c" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full opacity-[0.03] pointer-events-none text-[25vw] font-black text-center leading-none select-none tracking-tighter">
        404
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[10px] text-zinc-400 mb-6 flex items-center gap-2 tracking-[0.2em] bg-zinc-900/40 px-4 py-2 border border-white/5 rounded-full backdrop-blur-md"
        >
          <span className="text-orange-500">status_code:</span>
          <span>404_NOT_FOUND</span>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-mono tracking-tighter mb-4 text-white leading-tight">
          <span className="text-orange-500 mr-2">&gt;</span>Zabłądziłeś?
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed mb-12 max-w-sm">
          Podany zasób nie istnieje dla bieżącej sesji lub został trwale przeniesiony. Cofnijmy się do bezpiecznej strefy.
        </p>

        <MagneticWrapper>
          <Link href="/">
            <button className="px-8 py-4 bg-orange-800 text-white font-mono uppercase text-[10px] lg:text-xs tracking-widest rounded-lg shadow-lg hover:bg-orange-700 transition-colors flex items-center gap-3">
              <MoveLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Powrót do bazy</span>
            </button>
          </Link>
        </MagneticWrapper>

        <div className="mt-16 flex items-center gap-4">
          <div className="w-8 h-px bg-zinc-800" />
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-2">
            <Terminal size={12} className="text-orange-500" /> MM.Dev System
          </span>
          <div className="w-8 h-px bg-zinc-800" />
        </div>
      </div>
    </main>
  );
}
