import React from 'react';
import Link from 'next/link';
import { ParticlesClient } from '@/components/ui/ParticlesClient';

export default function GrowthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-orange-500/30 overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <ParticlesClient />
      </div>
      <nav className="relative z-50 w-full p-4 md:p-6 flex justify-between items-center bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="text-xl font-bold text-white tracking-tighter hover:text-orange-500 transition-colors">
          Molenda<span className="text-orange-500">.</span>
        </Link>
      </nav>
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        {children}
      </main>
    </div>
  );
}
