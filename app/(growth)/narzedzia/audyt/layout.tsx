import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Darmowy Audyt Strony Internetowej i Sklepu WWW',
  description: 'Błyskawiczny audyt techniczny witryny: prędkość na telefonach, widoczność w Google, błędy w kodzie oraz poprawne śledzenie konwersji z reklam.',
  alternates: {
    canonical: '/narzedzia/audyt',
  },
  openGraph: {
    title: 'Darmowy Audyt Strony Internetowej i Sklepu WWW | Marcin Molenda',
    description: 'Bezpłatny skaner Twojej witryny WWW i kampanii reklamowych.',
    url: 'https://molendadevelopment.pl/narzedzia/audyt',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Darmowy Audyt Strony Internetowej i Sklepu WWW | Marcin Molenda',
    description: 'Sprawdź kondycję techniczną witryny i wyeliminuj błędy blokujące sprzedaż.',
  },
};

export default function AudytLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
