import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jak RLT Polska wyeliminowało błędy 508 w E-commerce | Case Study',
  description: 'Zobacz w jaki sposób nowa architektura Serverless Edge rozwiązała problem awarii sklepu podczas pików sprzedażowych w branży Beauty.',
  openGraph: {
    title: 'Jak RLT Polska wyeliminowało błędy 508 w E-commerce | Case Study',
    description: 'Zobacz w jaki sposób nowa architektura Serverless Edge rozwiązała problem awarii sklepu podczas pików sprzedażowych w branży Beauty.',
    url: 'https://molendadevelopment.pl/wdrozenia/rltpolska',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jak RLT Polska wyeliminowało błędy 508 w E-commerce | Case Study',
    description: 'Błędy 508 podczas kampanii z influencerkami to przeszłość. Case study Serverless.',
  }
};

export default function RLTPolskaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Jak RLT Polska wyeliminowało błędy 508 podczas pików sprzedażowych w Beauty E-commerce',
    description: 'Case study migracji sklepu internetowego z branży Beauty na elastyczną infrastrukturę Serverless Edge, która bez problemu obsługuje potężny ruch z social mediów.',
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
      '@id': 'https://molendadevelopment.pl/wdrozenia/rltpolska'
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
