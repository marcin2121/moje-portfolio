import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stowarzyszenie KAS | Case Study: Headless Next.js, WCAG 2.2 AA & 98/100 YellowLabTools',
  description: 'Zobacz jak stworzyliśmy nowoczesny, w 100% dostępny cyfrowo portal dla Stowarzyszenia KAS: 16 127 linii czystego kodu TypeScript, 4x100 Google PageSpeed i 98/100 YellowLabTools.',
  openGraph: {
    title: 'Stowarzyszenie KAS | Case Study: Headless Next.js, WCAG 2.2 AA & 98/100 YellowLabTools',
    description: 'Architektura Headless Next.js, pełna zgodność z WCAG 2.2 AA, 16 127 linii kodu i certyfikowana dostępność cyfrowa.',
    url: 'https://molendadevelopment.pl/wdrozenia/stowarzyszeniekas',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stowarzyszenie KAS | Case Study: Headless Next.js & WCAG 2.2 AA',
    description: '16 127 linii kodu, 4x100 PageSpeed i 98/100 w YellowLabTools.',
  }
};

export default function StowarzyszenieKasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Stowarzyszenie KAS - Nowoczesny Portal Headless Next.js z Certyfikacją WCAG 2.2 AA',
    description: 'Kompleksowe studium przypadku wdrożenia portalu dla organizacji pożytku publicznego z architekturą Headless, integracjami API i pełną dostępnością cyfrową.',
    author: {
      '@type': 'Person',
      name: 'Marcin Molenda'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Molenda Development',
      logo: {
        '@type': 'ImageObject',
        url: 'https://molendadevelopment.pl/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://molendadevelopment.pl/wdrozenia/stowarzyszeniekas'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
