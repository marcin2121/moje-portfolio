import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Kalkulator Strat E-commerce i ROI Migracji',
  description: 'Oblicz prognozowane straty finansowe z powodu powolnego ładowania platformy oraz zwrot z inwestycji (ROI) w architekturę Next.js.',
  alternates: {
    canonical: '/narzedzia/kalkulator-migracji',
  },
  openGraph: {
    title: 'Kalkulator Strat E-commerce i ROI Migracji | Marcin Molenda',
    description: 'Sprawdź, ile zysku ucieka przez powolny sklep mobilny i oblicz ROI z nowoczesnej architektury.',
    url: 'https://molendadevelopment.pl/narzedzia/kalkulator-migracji',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulator Strat E-commerce i ROI Migracji | Marcin Molenda',
    description: 'Oblicz straty finansowe ze zbyt wolnej witryny.',
  },
};

export default function KalkulatorMigracjiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
