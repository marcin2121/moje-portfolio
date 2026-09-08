import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Polityka Prywatności i Ochrona Danych (RODO)',
  description: 'Zasady przetwarzania danych osobowych, cookieless analytics i ochrona prywatności w Marcin Molenda Development.',
  alternates: {
    canonical: '/polityka-prywatnosci',
  },
  openGraph: {
    title: 'Polityka Prywatności i Ochrona Danych (RODO) | Marcin Molenda',
    description: 'Zasady przetwarzania danych osobowych, cookieless analytics i ochrona prywatności w Marcin Molenda Development.',
    url: 'https://molendadevelopment.pl/polityka-prywatnosci',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Polityka Prywatności i Ochrona Danych (RODO) | Marcin Molenda',
    description: 'Zasady przetwarzania danych osobowych i ochrona prywatności w serwisie.',
  },
};

export default function PolitykaPrywatnosciLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
