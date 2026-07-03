import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import UxLogger from "@/components/UxLogger";
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  display: 'swap',
  variable: '--font-plus-jakarta',
});



export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Marcin Molenda | Precyzyjne Systemy, Web & Mobile",
  description: "Dedykowane systemy i aplikacje webowe oparte o Next.js 16 i Supabase. Architektura bez kompromisów, od JDG po duże firmy. Szybkość ładowania < 1s.",
  keywords: ['tworzenie stron internetowych', 'programista Next.js', 'aplikacje webowe', 'aplikacje mobilne', 'developer Polska', 'optymalizacja SEO'],

  authors: [{ name: 'Marcin Molenda', url: 'https://molendadevelopment.pl' }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  metadataBase: new URL('https://molendadevelopment.pl'),
  openGraph: {
    title: 'Marcin Molenda | Strony i Aplikacje Web & Mobile',
    description: 'Dedykowane strony i aplikacje webowe w Next.js 16. Szybkość ładowania < 1s. Obsługa firm z całej Polski.',
    url: 'https://molendadevelopment.pl',
    siteName: 'Marcin Molenda Portfolio',
    locale: 'pl_PL',
    type: 'website',
    images: [{
      url: 'https://molendadevelopment.pl/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Marcin Molenda – Precyzyjne systemy webowe',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marcin Molenda | Precyzyjne Systemy Web & Mobile',
    description: 'Dedykowane systemy i aplikacje webowe oparte o Next.js 16.',
    images: ['https://molendadevelopment.pl/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512' },
    ]
  },
};

import SmoothScroll from "@/components/LenisProvider";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      {/* Plus Jakarta Sans applied globally */}
      <body suppressHydrationWarning className={`${plusJakarta.variable} relative font-sans bg-slate-50 text-slate-900 antialiased overflow-x-clip selection:bg-orange-500 selection:text-white`}>
         
         {/* Umami Analytics (cookie-free, GDPR-compliant) */}
         <Script 
            src="https://analytics.molendadevelopment.pl/script.js"
            data-website-id="0e03a10c-fb02-4e95-b03b-008e9e5f6a2f"
            strategy="afterInteractive"
          />
        
        {/* Advanced JSON-LD structured data for E-E-A-T and GEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
               "@context": "https://schema.org",
               "@graph": [
                 {
                   "@type": "Person",
                   "@id": "https://molendadevelopment.pl/#person",
                   "name": "Marcin Molenda",
                   "url": "https://molendadevelopment.pl",
                   "image": "https://molendadevelopment.pl/Marcin.jpg",
                   "jobTitle": "Full-Stack Software Engineer",
                   "description": "Niezależny Inżynier Oprogramowania specjalizujący się w systemach webowych opartych na Next.js.",
                   "knowsAbout": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Web Development", "Optymalizacja SEO", "E-commerce"],
                   "sameAs": [
                     "https://www.linkedin.com/in/marcin-molenda-447251289/",
                     "https://www.facebook.com/molendadevelopment/",
                     "https://github.com/marcin2121"
                   ]
                 },
                 {
                   "@type": "ProfessionalService",
                   "@id": "https://molendadevelopment.pl/#organization",
                   "name": "Marcin Molenda Development",
                   "url": "https://molendadevelopment.pl",
                   "logo": "https://molendadevelopment.pl/og-image.jpg",
                   "image": "https://molendadevelopment.pl/og-image.jpg",
                   "founder": { "@id": "https://molendadevelopment.pl/#person" },
                   "telephone": "+48665430469",
                   "email": "kontakt@molendadevelopment.pl",
                   "address": {
                     "@type": "PostalAddress",
                     "addressLocality": "Zduńska Wola",
                     "addressCountry": "PL"
                   },
                   "hasMap": "https://share.google/RAsOVApwKNf2HkGKQ",
                   "sameAs": [
                     "https://share.google/RAsOVApwKNf2HkGKQ"
                   ],
                   "serviceType": ["Strony Internetowe", "Aplikacje Webowe", "Aplikacje Mobilne", "Optymalizacja SEO"]
                 }
               ]
             })
          }}
        />

        <NuqsAdapter>
          <UxLogger />
          <Navbar />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </NuqsAdapter>

      </body>
    </html>
  );
}