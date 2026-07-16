import React from 'react';
import { Metadata } from 'next';
import WcagPanel from '@/components/kas/WcagPanel';
import PerformanceBadge from '@/components/kas/PerformanceBadge';
import KasHeroSection from '@/components/kas/sections/KasHeroSection';
import KasSocialProofSection from '@/components/kas/sections/KasSocialProofSection';
import KasProblemSolutionSection from '@/components/kas/sections/KasProblemSolutionSection';
import KasPrototypesSection from '@/components/kas/sections/KasPrototypesSection';
import KasInvestmentOptionsSection from '@/components/kas/sections/KasInvestmentOptionsSection';
import KasGuaranteesSection from '@/components/kas/sections/KasGuaranteesSection';
import KasWallOfLoveSection from '@/components/kas/sections/KasWallOfLoveSection';
import KasFaqSection from '@/components/kas/sections/KasFaqSection';
import KasContactSection from '@/components/kas/sections/KasContactSection';

export const metadata: Metadata = {
  title: 'Dedykowana Oferta - Stowarzyszenie KAS | Marcin Molenda',
  description: 'Poufna oferta technologiczna dla Stowarzyszenia Kombinat Aktywności Społecznej. Nowa, ultraszybka i dostępna (WCAG 2.1 AA) platforma wsparcia.',
  robots: { index: false, follow: false }
};

export default function KasOfferPage() {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-orange-500 selection:text-white transition-all duration-300 wcag-container">
      <WcagPanel />
      <PerformanceBadge />

      <main className="pt-24 pb-32 overflow-x-hidden">
        {/* 1. SEKCJA HERO */}
        <KasHeroSection />

        {/* 2. DOWÓD SPOŁECZNY */}
        <KasSocialProofSection />

        {/* 3. PROBLEM VS ROZWIĄZANIE */}
        <KasProblemSolutionSection />

        {/* 4. SHOW DON'T TELL - INTERAKTYWNE PROTOTYPY */}
        <KasPrototypesSection />

        {/* 5. OPCJE INWESTYCJI - 3 KOLUMNY */}
        <KasInvestmentOptionsSection />

        {/* 6. GWARANCJE */}
        <KasGuaranteesSection />

        {/* 7. WALL OF LOVE */}
        <KasWallOfLoveSection />

        {/* 8. FAQ */}
        <KasFaqSection />

        {/* 9. KONTAKT / PDF DOWNLOAD */}
        <KasContactSection />
      </main>
    </div>
  );
}
