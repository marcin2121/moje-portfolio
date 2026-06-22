'use client';
import React from 'react';
import Configurator from '@/components/ui/Configurator';

export function CTASection({ isDevMode }: { isDevMode: boolean }) {
  return (
    <section id="kontakt" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0B0B0C] border-t border-[#161618] relative z-10">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF6900]/5 to-black pointer-events-none" />
      
      <div className="w-full max-w-4xl mx-auto text-center flex flex-col justify-center items-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#F5F5F7] leading-tight mb-6">
          {isDevMode 
            ? <>Initialize <span className="text-[#FF6900]">Deployment</span></>
            : <>Zbudujmy <span className="text-[#FF6900]">absolutny kosmos.</span></>
          }
        </h2>
        <p className="text-[#A1A1A5] font-light leading-relaxed text-base md:text-xl mx-auto mb-10 max-w-2xl">
          {isDevMode 
            ? 'Skip the sales calls. Define your tech stack, outline your architectural requirements, and I will return with a precise implementation roadmap and system design.' 
            : 'Masz dość technologii, która Cię ogranicza? Opisz mi w kilku krokach swój projekt, a wrócę do Ciebie z gotowym, bezkompromisowym planem działania.'}
        </p>
        <a href="mailto:kontakt@molendadevelopment.pl" className="text-sm font-mono text-[#A1A1A5] hover:text-[#FF6900] transition-colors underline underline-offset-4">
          kontakt@molendadevelopment.pl
        </a>
      </div>

      <div className="w-full max-w-7xl mx-auto bg-[#161618] border border-[#222225] rounded-[2rem] lg:rounded-[3rem] p-4 sm:p-10 lg:p-16 relative z-10 shadow-2xl">
        <Configurator />
      </div>
    </section>
  );
}
