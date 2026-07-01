'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code2 } from 'lucide-react';

interface HeaderToggleProps {
  isDevMode: boolean;
  setIsDevMode: (val: boolean) => void;
}

export function HeaderToggle({ isDevMode, setIsDevMode }: HeaderToggleProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 flex justify-between items-center bg-gradient-to-b from-white/90 to-transparent pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="w-8 h-8 rounded-lg bg-[#FF6900] flex items-center justify-center text-white font-black text-xs">
          MD
        </div>
      </div>
      
      <div className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-full p-1.5 flex items-center shadow-premium-soft relative overflow-hidden">
        {/* Animated Background Pill */}
        <motion.div
          className="absolute left-1.5 top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-slate-100 rounded-full shadow-sm z-0 border border-slate-200/50"
          animate={{ x: isDevMode ? '100%' : '0%' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
        
        <button
          onClick={() => setIsDevMode(false)}
          className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${!isDevMode ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <Briefcase size={14} /> Biznes
        </button>
        
        <button
          onClick={() => setIsDevMode(true)}
          className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isDevMode ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <Code2 size={14} /> Dev
        </button>
      </div>
    </header>
  );
}
