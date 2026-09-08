import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Audyt Odporności Cyfrowej i Wydajności WWW',
  description: 'Kompleksowy audyt techniczny witryny: detekcja wycieków budżetu reklamowego, Core Web Vitals, błędy tagów canonical, meta i architektury DOM.',
  alternates: {
    canonical: '/narzedzia/audyt',
  },
  openGraph: {
    title: 'Audyt Odporności Cyfrowej i Wydajności WWW | Marcin Molenda',
    description: 'Bezpłatny inżynieryjny skaner architektury WWW i kampanii reklamowych.',
    url: 'https://molendadevelopment.pl/narzedzia/audyt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audyt Odporności Cyfrowej i Wydajności WWW | Marcin Molenda',
    description: 'Sprawdź kondycję techniczną witryny i wyeliminuj wycieki budżetów reklamowych.',
  },
};

export default function AudytLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
