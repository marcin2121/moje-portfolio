import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Case Studies i Wdrożenia Headless Next.js',
  description: 'Twarde dowody inżynieryjne. Zobacz, jak zredukowaliśmy wagę platform e-commerce o ponad 95% i ustabilizowaliśmy infrastrukturę ratując budżety reklamowe.',
  alternates: {
    canonical: '/wdrozenia',
  },
  openGraph: {
    title: 'Case Studies i Wdrożenia Headless Next.js | Marcin Molenda',
    description: 'Twarde dowody inżynieryjne. Zobacz, jak zredukowaliśmy wagę platform e-commerce o ponad 95% i ustabilizowaliśmy infrastrukturę.',
    url: 'https://molendadevelopment.pl/wdrozenia',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Case Studies i Wdrożenia Headless Next.js | Marcin Molenda',
    description: 'Twarde dowody inżynieryjne. Redukcja wagi platform e-commerce o ponad 95%.',
  },
};

export default function WdrozeniaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
