import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Migracja RLT Polska do Next.js | Case Study Inżynieryjne',
  description: 'Analiza inżynieryjna migracji platformy e-commerce z PHP/WordPress na Next.js (SSG/Edge), drastycznie redukująca TTFB i ładunek JS.',
  openGraph: {
    title: 'Migracja RLT Polska do Next.js | Case Study Inżynieryjne',
    description: 'Analiza inżynieryjna migracji platformy e-commerce z PHP/WordPress na Next.js (SSG/Edge), drastycznie redukująca TTFB i ładunek JS.',
    url: 'https://molendadevelopment.pl/wdrozenia/migracja-rlt-polska',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Migracja RLT Polska do Next.js | Case Study',
    description: 'Redukcja TTFB z 850ms do 90ms. Zobacz, jak porzuciliśmy WordPressa.',
  }
};

export default function MigracjaRltLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
