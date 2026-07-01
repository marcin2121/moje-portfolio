import React from 'react';
import Link from 'next/link';
import { ParticlesClient } from '@/components/ui/ParticlesClient';

export default function GrowthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <ParticlesClient />
      </div>
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 pt-28">
        {children}
      </main>
    </div>
  );
}
