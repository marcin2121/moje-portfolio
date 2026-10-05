'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Zap, 
  Search, 
  Code2, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Terminal,
  Layers
} from 'lucide-react';
import { AuditMasterResponse } from '@/app/api/audit-master/types';

interface MissingPointItem {
  id: string;
  pillar: string;
  category: string;
  pointsLost: number;
  title: string;
  shortDiagnosis: string;
  technicalReason: string;
  stepsToMax: { step: number; title: string; desc: string }[];
  codeSnippet?: string;
  businessGain: string;
  icon: React.ReactNode;
}

interface MissingPointsRoadmapProps {
  result: AuditMasterResponse;
  wpScore?: number;
  isWordPress?: boolean;
}

export default function MissingPointsRoadmap({
  result,
  wpScore,
  isWordPress = false
}: MissingPointsRoadmapProps) {
  const [activeTab, setActiveTab] = React.useState<'all' | 'wordpress'>(
    isWordPress ? 'wordpress' : 'all'
  );
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  // Obliczenie puli brakujących punktów dla trybu ogólnego
  const allMissingTotal = Math.max(0, 100 - result.overallScore);
  const wpMissingTotal = wpScore !== undefined ? Math.max(0, 100 - wpScore) : allMissingTotal;

  // Silnik dynamicznego generowania potrąceń dla profilu ogólnego
  const allDeductions = React.useMemo<MissingPointItem[]>(() => {
    const items: MissingPointItem[] = [];

    // 1. BEZPIECZEŃSTWO
    const secPillar = result.pillars?.find(p => p.name === 'Bezpieczeństwo');
    const secScore = secPillar ? secPillar.score : 40;
    const secLost = Math.round((100 - secScore) * 0.20);

    if (secLost > 0) {
      items.push({
        id: 'deduction-security',
        pillar: 'Bezpieczeństwo',
        category: 'Bezpieczeństwo serwera & Nagłówki HTTP',
        pointsLost: secLost,
        title: 'Brak restrykcyjnych nagłówków ochronnych (HSTS, CSP, X-Frame)',
        shortDiagnosis: 'Serwer produkcyjny nie wysyła nagłówków ochronnych, co obniża rating zaufania przeglądarek i naraża witrynę na ataki.',
        technicalReason: 'Odpowiedź HTTP nie zawiera dyrektyw Strict-Transport-Security (HSTS), Content-Security-Policy (CSP) ani X-Frame-Options. Przeglądarka traktuje połączenie jako podatne na ataki typu Clickjacking i MIME-sniffing.',
        stepsToMax: [
          {
            step: 1,
            title: 'Wdrożenie nagłówka HSTS',
            desc: 'Wymuszenie szyfrowania HTTPS z czasem buforowania minimum 1 rok (max-age=63072000) oraz flagą includeSubDomains.'
          },
          {
            step: 2,
            title: 'Konfiguracja Content-Security-Policy (CSP)',
            desc: 'Zdefiniowanie dozwolonych źródeł skryptów, stylów i ramek, co blokuje nieautoryzowane wstrzyknięcia złośliwego kodu.'
          },
          {
            step: 3,
            title: 'Ochrona przed podszywaniem i Clickjackingiem',
            desc: 'Dodanie dyrektyw X-Frame-Options: SAMEORIGIN oraz X-Content-Type-Options: nosniff.'
          }
        ],
        codeSnippet: `# Nginx / Caddy / Cloudflare Headers
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;`,
        businessGain: 'Maksymalny wynik weryfikacji bezpieczeństwa (A+ w Mozilla Observatory), brak ryzyka kar RODO i pełne zaufanie algorytmów Google.',
        icon: <ShieldCheck className="w-5 h-5 text-rose-600" />
      });
    }

    // 2. SZYBKOŚĆ & WYDAJNOŚĆ
    const perfPillar = result.pillars?.find(p => p.name === 'Szybkość');
    const perfScore = perfPillar ? perfPillar.score : 50;
    const perfLost = Math.round((100 - perfScore) * 0.20);

    if (perfLost > 0) {
      const avgTtfb = result.evidence?.avgResponseTimeMs || 150;
      const badScripts = result.codeSmells?.badScripts || 0;
      const unoptimized = result.codeSmells?.unoptimizedImagesCount || 0;

      items.push({
        id: 'deduction-performance',
        pillar: 'Szybkość',
        category: 'Wydajność & Czas odpowiedzi serwera (TTFB)',
        pointsLost: perfLost,
        title: 'Czas odpowiedzi serwera oraz zasoby blokujące pierwszy render',
        shortDiagnosis: `Średni czas odpowiedzi serwera wynosi ${avgTtfb}ms (standard: <150ms). Wykryto ${badScripts} skryptów bez atrybutów asynchronicznych.`,
        technicalReason: 'Brak aktywnego page-cachingu na brzegu sieci (Edge CDN) oraz obecność skryptów ładujących się synchronicznie w sekcji head blokuje parsowanie drzewa DOM i opóźnia metrykę LCP.',
        stepsToMax: [
          {
            step: 1,
            title: 'Aktywacja Server-Side Page Caching (Redis / FastCGI)',
            desc: 'Skrócenie TTFB poniżej 120ms poprzez serwowanie prekompilowanych stron z pamięci RAM serwera bez ciągłych zapytań do bazy.'
          },
          {
            step: 2,
            title: 'Asynchroniczność zewnętrznych bibliotek JS',
            desc: 'Dodanie atrybutu defer lub async do wszystkich zewnętrznych skryptów analitycznych i pomocniczych.'
          },
          {
            step: 3,
            title: 'Formaty nowej generacji i natywne lazy-loading',
            desc: `Konwersja grafik do formatu WebP/AVIF z atrybutem loading="lazy" (znaleziono ${unoptimized} obrazów wymagających optymalizacji).`
          }
        ],
        codeSnippet: `<!-- Asynchroniczne ładowanie bibliotek bez blokowania widoku -->
<script src="bundle.js" defer></script>

<!-- Nowoczesny tag obrazu nowej generacji (Next-Gen Format) -->
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" loading="lazy" decoding="async" alt="Opis" width="800" height="500" />
</picture>`,
        businessGain: 'Natychmiastowe przejście wskaźników Core Web Vitals (zielony zakres w PageSpeed Insights) i redukcja współczynnika odrzuceń na mobile o 25-40%.',
        icon: <Zap className="w-5 h-5 text-amber-600" />
      });
    }

    // 3. SEO & INDEKSACJA
    const seoPillar = result.pillars?.find(p => p.name === 'SEO');
    const seoScore = seoPillar ? seoPillar.score : 60;
    const seoLost = Math.round((100 - seoScore) * 0.20);

    if (seoLost > 0) {
      const missingCanonical = result.evidence?.missingCanonicalCount || 0;
      const dupTitles = result.evidence?.duplicateTitleGroups?.length || 0;
      const missingH1 = result.evidence?.missingH1Count || 0;

      items.push({
        id: 'deduction-seo',
        pillar: 'SEO',
        category: 'SEO & Architektura indeksowalności',
        pointsLost: seoLost,
        title: 'Błędy tagów kanonicznych i powielanie metadanych podstron',
        shortDiagnosis: `Wykryto ${missingCanonical} podstron bez tagu canonical, ${dupTitles} grup duplikatów <title> oraz ${missingH1} podstron bez nagłówka H1.`,
        technicalReason: 'Brak jawnego wskazania adresu kanonicznego prowadzi do kanibalizacji słów kluczowych i rozmywania autorytetu domeny między wariantami URL z parametrami lub ukośnikiem.',
        stepsToMax: [
          {
            step: 1,
            title: 'Wdrożenie bezwzględnych tagów rel="canonical"',
            desc: 'Wygenerowanie precyzyjnego linku kanonicznego na 100% podstron z zachowaniem preferowanego protokołu HTTPS.'
          },
          {
            step: 2,
            title: 'Unifikacja i wydłużenie meta tagów title',
            desc: 'Stworzenie unikalnych szablonów o długości 50-60 znaków zawierających kluczową frazę ofertową i geolokalizację.'
          },
          {
            step: 3,
            title: 'Uporządkowanie hierarchii nagłówków',
            desc: 'Zapewnienie dokładnie jednego nagłówka <h1> na każdej podstronie oddającego intencję wyszukiwania użytkownika.'
          }
        ],
        codeSnippet: `<!-- Wzorcowa sekcja metadanych SEO dla każdej podstrony -->
<head>
  <link rel="canonical" href="https://${result.domain}/uslugi/projektowanie" />
  <title>Precyzyjne Aplikacje Webowe | Marcin Molenda Portfolio</title>
  <meta name="description" content="Projektowanie systemów internetowych o czasie ładowania <1s..." />
</head>
<body>
  <h1>Projektowanie dedykowanych aplikacji webowych</h1>
</body>`,
        businessGain: 'Wyeliminowanie problemu zduplikowanej treści (Duplicate Content), wyższy wskaźnik klikalności CTR w wyszukiwarce i stabilny wzrost pozycji w Google.',
        icon: <Search className="w-5 h-5 text-emerald-600" />
      });
    }

    // 4. KOD & ARCHITEKTURA
    const scalePillar = result.pillars?.find(p => p.name === 'Skalowalność');
    const scaleScore = scalePillar ? scalePillar.score : 40;
    const scaleLost = Math.round((100 - scaleScore) * 0.20);

    if (scaleLost > 0) {
      const domCount = result.codeSmells?.domElements || 1500;
      const builders = result.codeSmells?.pageBuilders || [];

      items.push({
        id: 'deduction-architecture',
        pillar: 'Skalowalność',
        category: 'Architektura frontendu & Czystość DOM',
        pointsLost: scaleLost,
        title: 'Nadmierna złożoność drzewa DOM i narzut bibliotek',
        shortDiagnosis: `Drzewo DOM zawiera ${domCount} elementów (zalecany limit: <1400). ${builders.length > 0 ? `Wykryto builder: ${builders.join(', ')}.` : ''}`,
        technicalReason: 'Zbyt głębokie zagnieżdżenia kontenerów i narzut kodu z builderów obciążają pamięć RAM na urządzeniach mobilnych, spowalniając kalkulacje stylów CSS i responsywność.',
        stepsToMax: [
          {
            step: 1,
            title: 'Spłaszczenie struktury drzewa DOM',
            desc: 'Eliminacja zbędnych wrapperów kontenerowych i zastąpienie ich nowoczesnym CSS Grid / Flexbox.'
          },
          {
            step: 2,
            title: 'Usunięcie legacy bibliotek',
            desc: 'Przepisanie przestarzałych funkcji jQuery na czysty, natywny Vanilla JavaScript (ES6+) o zerowej wadze.'
          },
          {
            step: 3,
            title: 'Optymalizacja stylów CSS',
            desc: 'Wydzielenie krytycznego CSS (Critical CSS) i asynchroniczne doładowywanie pozostałych arkuszy.'
          }
        ],
        codeSnippet: `// Nowoczesna alternatywa Vanilla JS bez bibliotek pomocniczych:
// Zamiast 90KB jQuery:
document.querySelectorAll('[data-accordion]').forEach(item => {
  item.addEventListener('click', () => item.classList.toggle('is-open'));
});`,
        businessGain: 'Płynne 60 klatek na sekundę na każdym smartfonie, zerowe opóźnienia interakcji (INP < 100ms) i mniejsze zużycie baterii użytkownika.',
        icon: <Code2 className="w-5 h-5 text-indigo-600" />
      });
    }

    // 5. TELEMETRIA & ANALITYKA
    const autoPillar = result.pillars?.find(p => p.name === 'Automatyzacja');
    const autoScore = autoPillar ? autoPillar.score : 40;
    const autoLost = Math.round((100 - autoScore) * 0.20);

    if (autoLost > 0) {
      const ads = result.evidence?.adsAndTracking;
      const hasConsent = ads?.hasConsentModeV2;
      const hasRecording = ads?.hasSessionRecording || ads?.hasClarity || ads?.hasHotjar;

      items.push({
        id: 'deduction-telemetry',
        pillar: 'Automatyzacja',
        category: 'Telemetria & Zgody RODO (Consent Mode v2)',
        pointsLost: autoLost,
        title: 'Brak standardu Consent Mode v2 lub map behawioralnych',
        shortDiagnosis: `${!hasConsent ? 'Brak aktywnego Google Consent Mode v2. ' : ''}${!hasRecording ? 'Brak narzędzi analityki sesji (Microsoft Clarity / Hotjar). ' : ''}Brak telemetrii konwersji.`,
        technicalReason: 'Kampanie reklamowe bez Consent Mode v2 nie mogą modelować konwersji w UE, a brak analizy behawioralnej uniemożliwia identyfikację miejsc, w których klienci porzucają formularze lub ofertę.',
        stepsToMax: [
          {
            step: 1,
            title: 'Wdrożenie Google Consent Mode v2',
            desc: 'Ustawienie domyślnych flag ad_storage: denied i analytics_storage: denied z aktualizacją po akceptacji banera.'
          },
          {
            step: 2,
            title: 'Integracja cookieless Microsoft Clarity',
            desc: 'Wdrożenie bezpłatnego, zgodnego z RODO narzędzia do nagrań sesji działającego w pamięci podręcznej (zero ciasteczek).'
          },
          {
            step: 3,
            title: 'Telemetria mikro-konwersji w dataLayer',
            desc: 'Przesyłanie zdarzeń click_to_call, wysłania formularza i kliknięć w ofertę bezpośrednio do GA4.'
          }
        ],
        codeSnippet: `<!-- Cookieless Microsoft Clarity (Zero Cookies / Zgodność z RODO) -->
<script>
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "ID_PROJEKTU");
  window.clarity && window.clarity('consent', false);
</script>`,
        businessGain: 'Odzyskanie do 70% modelowanych konwersji w Google Ads, pełna wiedza o zachowaniach klientów na stronie i 100% zgodność prawna z UODO.',
        icon: <BarChart3 className="w-5 h-5 text-blue-600" />
      });
    }

    // Sortowanie od największej straty punktów
    return items.sort((a, b) => b.pointsLost - a.pointsLost);
  }, [result]);

  // Silnik potrąceń w dedykowanej klasie WordPress
  const wpDeductions = React.useMemo<MissingPointItem[]>(() => {
    const items: MissingPointItem[] = [];

    // 1. KOD WP & BUILDERY
    const domCount = result.codeSmells?.domElements || 1500;
    const badScripts = result.codeSmells?.badScripts || 0;
    const domScore = domCount < 1600 ? 90 : domCount < 2600 ? 70 : 45;
    const scriptScore = Math.max(30, 90 - badScripts * 8);
    const wpHygiene = Math.round((domScore + scriptScore) / 2);
    const wpHygieneLost = Math.round((100 - wpHygiene) * 0.25);

    if (wpHygieneLost > 0) {
      items.push({
        id: 'wp-deduction-code',
        pillar: 'Kod WP',
        category: 'Higiena kodu WordPress & Optymalizacja wtyczek',
        pointsLost: wpHygieneLost,
        title: 'Narzut kodu page builderów i synchroniczne skrypty PHP',
        shortDiagnosis: `Drzewo DOM generowane przez WordPress zawiera ${domCount} elementów. Wykryto ${badScripts} wtyczek ładujących skrypty blokujące w nagłówku.`,
        technicalReason: 'Wtyczki i kreatory stron generują wielokrotnie zagnieżdżone kontenery oraz ładują biblioteki JS nawet na podstronach, gdzie nie są one wykorzystywane.',
        stepsToMax: [
          {
            step: 1,
            title: 'Wyczyszczenie nieużywanych skryptów wp_enqueue_scripts',
            desc: 'Zablokowanie ładowania skryptów wtyczek (np. Contact Form 7, WooCommerce cart fragments) na stronach, na których nie występują.'
          },
          {
            step: 2,
            title: 'Aktywacja opóźnionego ładowania skryptów w WordPressie',
            desc: 'Wdrożenie filtrów PHP dodających defer do skryptów w functions.php lub użycie wtyczki optymalizacyjnej (np. Perfmatters / WP Rocket).'
          },
          {
            step: 3,
            title: 'Uproszczenie układu w Elementorze / edytorze blokowym',
            desc: 'Zastąpienie zagnieżdżonych sekcji kontenerami Flexbox (CSS Grid/Flex) dostępnymi w nowoczesnym WordPressie.'
          }
        ],
        codeSnippet: `// functions.php w motywie potomnym: Asynchroniczne ładowanie skryptów
add_filter('script_loader_tag', function($tag, $handle, $src) {
  if (is_admin()) return $tag;
  if (strpos($tag, 'defer') !== false || strpos($tag, 'async') !== false) return $tag;
  return str_replace('<script ', '<script defer ', $tag);
}, 10, 3);`,
        businessGain: 'Przyspieszenie działania WordPressa o 40-60%, zmniejszenie zużycia pamięci PHP na serwerze i wzrost komfortu użytkowników na smartfonach.',
        icon: <Layers className="w-5 h-5 text-indigo-600" />
      });
    }

    // 2. BEZPIECZEŃSTWO WP
    const secPillar = result.pillars?.find(p => p.name === 'Bezpieczeństwo');
    const secScore = secPillar ? secPillar.score : 40;
    const secLost = Math.round((100 - secScore) * 0.20);

    if (secLost > 0) {
      items.push({
        id: 'wp-deduction-security',
        pillar: 'Bezpiecz.',
        category: 'Bezpieczeństwo WordPress & Nagłówki HTTP',
        pointsLost: secLost,
        title: 'Brak nagłówków ochronnych i zabezpieczeń instalacji WordPress',
        shortDiagnosis: 'Instalacja nie posiada skonfigurowanych nagłówków HSTS i CSP oraz podstawowych reguł hardeningowych na serwerze.',
        technicalReason: 'WordPress jako najpopularniejszy CMS na świecie jest celem 90% zautomatyzowanych botów skanujących. Brak nagłówków bezpieczeństwa obniża ocenę zaufania domeny.',
        stepsToMax: [
          {
            step: 1,
            title: 'Wdrożenie nagłówków bezpieczeństwa w .htaccess lub Nginx',
            desc: 'Dodanie dyrektyw HSTS, X-Frame-Options i CSP bezpośrednio w konfiguracji serwera webowego.'
          },
          {
            step: 2,
            title: 'Zablokowanie dostępu do wrażliwych plików WP',
            desc: 'Wyłączenie edycji plików z poziomu kokpitu (DISALLOW_FILE_EDIT) oraz zablokowanie bezpośredniego wywoływania xmlrpc.php.'
          },
          {
            step: 3,
            title: 'Ochrona przed atakami Brute Force',
            desc: 'Ograniczenie liczby nieudanych prób logowania (Limit Login Attempts) oraz dwuskładnikowe uwierzytelnianie 2FA dla administratorów.'
          }
        ],
        codeSnippet: `# .htaccess (Apache) dla WordPressa:
<IfModule mod_headers.c>
  Header set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
</IfModule>`,
        businessGain: 'Wyeliminowanie ryzyka włamań i infekcji malware, które potrafią wywołać blokadę domeny przez Google Safe Browsing.',
        icon: <ShieldCheck className="w-5 h-5 text-rose-600" />
      });
    }

    // 3. SZYBKOŚĆ & SERWER WP
    const perfPillar = result.pillars?.find(p => p.name === 'Szybkość');
    const perfScore = perfPillar ? perfPillar.score : 50;
    const perfLost = Math.round((100 - perfScore) * 0.20);

    if (perfLost > 0) {
      const avgTtfb = result.evidence?.avgResponseTimeMs || 150;
      items.push({
        id: 'wp-deduction-perf',
        pillar: 'Szybkość',
        category: 'Optymalizacja hostingu PHP & Page Caching',
        pointsLost: perfLost,
        title: 'Czas generowania strony przez interpreter PHP (TTFB)',
        shortDiagnosis: `Odpowiedź serwera TTFB wynosi ${avgTtfb}ms. Brak aktywnego buforowania pełnych stron (Full Page Cache).`,
        technicalReason: 'Każde wejście użytkownika zmusza WordPress do wykonywania dziesiątek zapytań SQL do bazy MySQL, co powoduje opóźnienia przy braku pamięci podręcznej.',
        stepsToMax: [
          {
            step: 1,
            title: 'Aktywacja Full Page Cache (np. Redis / LiteSpeed Cache / WP Rocket)',
            desc: 'Serwowanie statycznego kodu HTML natychmiast bez angażowania interpretera PHP.'
          },
          {
            step: 2,
            title: 'Optymalizacja bazy danych MySQL',
            desc: 'Usunięcie tysięcy starych rewizji wpisów, osieroconych metadanych i automatycznych zapisów z tabeli wp_posts.'
          },
          {
            step: 3,
            title: 'Konwersja biblioteki mediów do WebP',
            desc: 'Automatyczna kompresja wrzucanych zdjęć za pomocą wtyczki konwertującej do formatu WebP (np. Converter for Media).'
          }
        ],
        codeSnippet: `// wp-config.php: Ograniczenie liczby rewizji wpisów do 3 (oszczędność bazy SQL):
define('WP_POST_REVISIONS', 3);
define('EMPTY_TRASH_DAYS', 7);`,
        businessGain: 'Skrócenie czasu ładowania witryny do ułamka sekundy, stabilność przy nagłym wzroście ruchu i lepszy wynik w Google.',
        icon: <Zap className="w-5 h-5 text-amber-600" />
      });
    }

    // 4. ANALITYKA & CONSENT MODE
    const ads = result.evidence?.adsAndTracking;
    const hasConsent = ads?.hasConsentModeV2;
    if (!hasConsent) {
      items.push({
        id: 'wp-deduction-analytics',
        pillar: 'Analityka',
        category: 'Telemetria & Zgody cookies na WordPressie',
        pointsLost: 12,
        title: 'Brak certyfikowanego Google Consent Mode v2 w motywie WP',
        shortDiagnosis: 'Wtyczka ciasteczkowa na WordPressie nie przekazuje stanów ad_storage i ad_user_data do Google Tag Managera.',
        technicalReason: 'Od marca 2024 brak Consent Mode v2 blokuje zbieranie danych dla inteligentnych kampanii reklamowych Google Ads w UE.',
        stepsToMax: [
          {
            step: 1,
            title: 'Instalacja certyfikowanego CMP z listy Google',
            desc: 'Wdrożenie wtyczki zgodnej z IAB TCF 2.2 (np. Complianz lub CookieYes) lub bezpośredni lekki kod w motywie.'
          },
          {
            step: 2,
            title: 'Integracja z Google Tag Managerem',
            desc: 'Powiązanie zgód z tagami marketingowymi bez blokowania podstawowych statystyk serwisu.'
          },
          {
            step: 3,
            title: 'Podpięcie Microsoft Clarity w trybie bezciasteczkowym',
            desc: 'Dodanie darmowych nagrań sesji, które nie wymagają zgód cookies (pamięć sesyjna).'
          }
        ],
        codeSnippet: `// Wdrożenie Consent Mode v2 przed załadowaniem skryptów analitycznych:
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied'
});`,
        businessGain: 'Odblokowanie pełnej atrybucji w Google Ads i legalne działanie zgodnie z wymogami UODO i RODO.',
        icon: <BarChart3 className="w-5 h-5 text-blue-600" />
      });
    }

    return items.sort((a, b) => b.pointsLost - a.pointsLost);
  }, [result]);

  const activeItems = activeTab === 'wordpress' && isWordPress ? wpDeductions : allDeductions;
  const currentMissing = activeTab === 'wordpress' && isWordPress ? wpMissingTotal : allMissingTotal;
  const currentScore = activeTab === 'wordpress' && isWordPress ? (wpScore ?? result.overallScore) : result.overallScore;

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-white/80 border border-slate-200/70 shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-6 md:p-8 backdrop-blur-2xl space-y-6">
      {/* Nagłówek sekcji + Przełącznik profilu */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              Diagnostyka Inżynieryjna
            </span>
            <span className="text-[11px] font-mono text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md font-bold whitespace-nowrap">
              -{currentMissing} pkt do perfekcji
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Za co brakuje punktów i jak zdobyć 100/100?</span>
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Twój aktualny wynik to <strong>{currentScore}/100</strong>. Kliknij dowolną pozycję poniżej, aby odkryć instrukcję odzyskania pełnej puli punktów.
          </p>
        </div>

        {/* Przełącznik zakładek (jeśli strona to WordPress) */}
        {isWordPress && (
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => { setActiveTab('wordpress'); setExpandedId(null); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'wordpress'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Klasa WordPress ({wpScore ?? 0}/100)
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('all'); setExpandedId(null); }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Wszystkie technologie ({result.overallScore}/100)
            </button>
          </div>
        )}
      </div>

      {/* Stan perfekcyjny (100/100) */}
      {currentMissing === 0 ? (
        <div className="p-8 text-center bg-emerald-50/60 border border-emerald-200 rounded-2xl">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-slate-900">Maksymalny wynik 100/100</h4>
          <p className="text-sm text-slate-600 max-w-md mx-auto mt-1 font-mono">
            Twój serwis spełnia 100% rygorystycznych kryteriów architektonicznych, bezpieczeństwa i optymalizacji. Gratulacje!
          </p>
        </div>
      ) : (
        /* Lista interaktywnych kart potrąceń */
        <div className="space-y-3">
          {activeItems.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-slate-300 bg-slate-50/50 shadow-sm'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/30'
                }`}
              >
                {/* Wiersz nagłówkowy karty (zawsze widoczny) */}
                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  className="w-full text-left p-4 md:p-5 flex items-start md:items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-start md:items-center gap-3.5 flex-1 min-w-0">
                    {/* Badge utraty punktów */}
                    <div className="shrink-0 flex items-center justify-center min-w-[70px] px-2.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 font-mono font-black text-sm">
                      -{item.pointsLost} pkt
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                          Filar: {item.pillar}
                        </span>
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-slate-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono line-clamp-1 mt-0.5 hidden sm:block">
                        {item.shortDiagnosis}
                      </p>
                    </div>
                  </div>

                  {/* Przycisk akcji rozwijania */}
                  <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl transition-colors">
                    <span className="hidden sm:inline">
                      {isExpanded ? 'Zwiń rekomendacje' : `Jak zyskać +${item.pointsLost} pkt?`}
                    </span>
                    <span className="sm:hidden font-mono">
                      +{item.pointsLost}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </button>

                {/* Rozwijana szuflada z instrukcją inżynieryjną (Expanded Content) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="border-t border-slate-200/80 px-4 md:px-6 py-5 bg-white space-y-5"
                    >
                      {/* 1. Dlaczego odjęto punkty */}
                      <div className="p-3.5 bg-rose-50/40 border border-rose-200/50 rounded-xl">
                        <span className="text-xs font-mono font-bold text-rose-800 uppercase tracking-wider block mb-1">
                          Przyczyna odjęcia punktów
                        </span>
                        <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-sans">
                          {item.technicalReason}
                        </p>
                      </div>

                      {/* 2. Krok po kroku do 100/100 */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <h5 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                            Plan dojścia do maksymalnego wyniku (+{item.pointsLost} pkt)
                          </h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {item.stepsToMax.map((s) => (
                            <div
                              key={s.step}
                              className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl flex flex-col justify-between"
                            >
                              <div>
                                <span className="w-5 h-5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center mb-2">
                                  {s.step}
                                </span>
                                <h6 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                                  {s.title}
                                </h6>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-mono">
                                  {s.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Przykładowy kod / konfiguracja (jeśli dostępny) */}
                      {item.codeSnippet && (
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <Terminal className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                              Konfiguracja inżynieryjna
                            </span>
                          </div>
                          <pre className="bg-slate-950 text-slate-200 p-3.5 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                            <code>{item.codeSnippet}</code>
                          </pre>
                        </div>
                      )}

                      {/* 4. Korzyść po wdrożeniu + Przycisk zlecenia */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-xs font-mono text-slate-600">
                          <strong className="text-emerald-700">Wpływ po wdrożeniu:</strong> {item.businessGain}
                        </div>

                        <a
                          href="#kontakt"
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shrink-0 shadow-sm"
                        >
                          <span>Zleć wdrożenie poprawki Marcinowi</span>
                          <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
