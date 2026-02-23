import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marcin Molenda | Strony Internetowe, Aplikacje Webowe i Optymalizacja",
  description: "Twój biznes zasługuje na lepszy kod. Projektuję od zera wydajne strony i aplikacje oraz modernizuję istniejące witryny. Wdrażam technologie i SEO, które deklasują konkurencję.",
  alternates: {
    canonical: 'https://molendadevelopment.pl',
  },
  // Konfiguracja Twoich faviconów
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon32x32.png', sizes: '32x32', type: 'image/png' }, // Zgodnie z Twoją nazwą pliku
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512' },
    ]
  },
  openGraph: {
    title: 'Marcin Molenda | Modern Web Development',
    description: 'Ultraszybkie strony Next.js i aplikacje webowe z efektem WOW.',
    url: 'https://molendadevelopment.pl',
    siteName: 'Marcin Molenda Portfolio',
    // images: [
    //   {
    //     url: 'https://molendadevelopment.pl/og-image.webp', 
    //     width: 1200,
    //     height: 630,
    //     alt: 'Marcin Molenda - Strony i Aplikacje Webowe',
    //   },
    // ],
    locale: 'pl_PL',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Marcin Molenda Development",
              "image": "https://molendadevelopment.pl/og-image.webp",
              "@id": "https://molendadevelopment.pl",
              "url": "https://molendadevelopment.pl",
              "telephone": "+48665430469",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Zduńska Wola",
                "addressCountry": "PL"
              },
              "serviceType": ["Strony Internetowe", "Aplikacje Webowe", "Optymalizacja SEO"]
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}