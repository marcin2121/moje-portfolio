'use client';
import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

export function FooterSection({ isDevMode }: { isDevMode: boolean }) {
  return (
    <footer className="py-12 border-t border-[#222225] bg-[#0B0B0C] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left max-w-xl">
          <h3 className="text-[#F5F5F7] font-bold mb-2">
            {isDevMode ? 'Code Quality Verification' : 'Chcesz sprawdzić jakość mojego kodu?'}
          </h3>
          <p className="text-[#A1A1A5] text-sm font-light leading-relaxed">
            {isDevMode 
              ? 'Review my open-source contributions and production architectures on GitHub before scheduling a call.' 
              : 'Zanim się skontaktujesz, zweryfikuj moją kulturę techniczną. Przejrzyj moje publiczne repozytoria na GitHubie (@marcin2121) lub przetestuj aplikacje z portfolio na żywo.'}
          </p>
        </div>

        <div className="flex gap-4">
          <a
            href="https://github.com/marcin2121"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#161618] border border-[#222225] rounded-xl text-[#F5F5F7] text-sm font-bold uppercase tracking-widest hover:border-[#FF6900] hover:text-[#FF6900] transition-colors"
          >
            <Github size={18} /> GitHub
          </a>
          <a
            href="#sandbox"
            className="flex items-center gap-2 px-6 py-3 bg-[#161618] border border-[#222225] rounded-xl text-[#F5F5F7] text-sm font-bold uppercase tracking-widest hover:border-[#FF6900] hover:text-[#FF6900] transition-colors"
          >
            <ExternalLink size={18} /> {isDevMode ? 'Demo' : 'Symulator'}
          </a>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-[#161618] text-center text-[#A1A1A5] text-xs font-mono uppercase tracking-widest flex flex-col sm:flex-row items-center justify-center gap-4">
        <span>© {new Date().getFullYear()} Molenda Development</span>
        <span className="hidden sm:inline">|</span>
        <span>Administrator Danych: Marcin Molenda</span>
        <span className="hidden sm:inline">|</span>
        <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> All systems operational</span>
      </div>
    </footer>
  );
}
