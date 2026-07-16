import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jak odchudziliśmy sklep DzikiStyl.com o 23MB? | Case Study',
  description: 'Zobacz w jaki sposób zmiana architektury na Edge-first pozwoliła drastycznie zmniejszyć wagę sklepu Dziki Styl, poprawiając czas ładowania i konwersję.',
  openGraph: {
    title: 'Jak odchudziliśmy sklep DzikiStyl.com o 23MB? | Case Study',
    description: 'Zobacz w jaki sposób zmiana architektury na Edge-first pozwoliła drastycznie zmniejszyć wagę sklepu Dziki Styl, poprawiając czas ładowania i konwersję.',
    url: 'https://molendadevelopment.pl/wdrozenia/dziki-styl',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jak odchudziliśmy sklep DzikiStyl.com o 23MB? | Case Study',
    description: 'Zmiana architektury na Edge-first w praktyce. Analiza przed i po wdrożeniu.',
  }
};

export default function DzikiStylLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Jak odchudziliśmy sklep DzikiStyl.com o 23MB?',
    description: 'Case study pokazujące korzyści z migracji klasycznego e-commerce na nowoczesną architekturę Edge-first z wykorzystaniem Next.js.',
    author: {
      '@type': 'Person',
      name: 'Marcin Molenda'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Marcin Molenda Development',
      logo: {
        '@type': 'ImageObject',
        url: 'https://molendadevelopment.pl/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://molendadevelopment.pl/wdrozenia/dziki-styl'
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
