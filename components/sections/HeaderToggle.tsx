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
    <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 flex justify-between items-center bg-gradient-to-b from-[#0B0B0C] to-transparent pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="w-8 h-8 rounded-lg bg-[#FF6900] flex items-center justify-center text-black font-black text-xs">
          MD
        </div>
      </div>
      
      <div className="pointer-events-auto bg-[#161618] border border-[#222225] rounded-full p-1.5 flex items-center shadow-lg relative overflow-hidden">
        {/* Animated Background Pill */}
        <motion.div
          className="absolute left-1.5 top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#222225] rounded-full shadow-sm z-0 border border-white/5"
          animate={{ x: isDevMode ? '100%' : '0%' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
        
        <button
          onClick={() => setIsDevMode(false)}
          className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${!isDevMode ? 'text-[#F5F5F7]' : 'text-[#A1A1A5] hover:text-white'}`}
        >
          <Briefcase size={14} /> Biznes
        </button>
        
        <button
          onClick={() => setIsDevMode(true)}
          className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${isDevMode ? 'text-[#FF6900]' : 'text-[#A1A1A5] hover:text-white'}`}
        >
          <Code2 size={14} /> Dev
        </button>
      </div>
    </header>
  );
}
