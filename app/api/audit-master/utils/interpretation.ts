export function getInterpretation(score: number, pillar: string, siteType: 'ecommerce' | 'services' = 'services'): string {
  const isEcommerce = siteType === 'ecommerce';

  switch (pillar) {
    case 'Szybkość':
      if (score >= 80) {
        return isEcommerce
          ? 'Ułamek sekundy dzieli Cię od sprzedaży. Infrastruktura doskonale utrzymuje uwagę klientów mobilnych.'
          : 'Ułamek sekundy dzieli Cię od zapytania ofertowego. Infrastruktura błyskawicznie angażuje potencjalnych klientów.';
      }
      if (score >= 50) {
        return isEcommerce
          ? 'Przeciętne tempo ładowania. Klienci ze słabszym łączem mogą porzucać koszyki przed wyświetleniem oferty.'
          : 'Przeciętne tempo ładowania. Użytkownicy ze słabszym łączem mogą opuszczać serwis przed wysłaniem formularza kontaktowego.';
      }
      return 'Krytyczny dług technologiczny. Ułamki sekund opóźnienia dosłownie palą Twój budżet marketingowy, odrzucając potencjalnych klientów.';

    case 'SEO':
      if (score >= 80) {
        return isEcommerce
          ? 'Znakomita optymalizacja. Kod bezbłędnie wspiera organiczne pozycjonowanie Twoich produktów w wyszukiwarce.'
          : 'Znakomita optymalizacja. Kod bezbłędnie wspiera organiczne pozycjonowanie Twoich usług i marki w Google.';
      }
      if (score >= 50) {
        return 'Zaniedbana struktura techniczna. Algorytmy wyszukiwarek mogą mieć problem z prawidłowym indeksowaniem i promowaniem oferty.';
      }
      return 'Strona jest niewidzialna dla nowoczesnych crawlerów. Błędy w semantyce i architekturze blokują darmowy ruch organiczny.';

    case 'Skalowalność':
      if (score >= 80) {
        return isEcommerce
          ? 'Architektura odporna na piki ruchu. Nagły napływ użytkowników czy tysiące nowych produktów nie spowolnią platformy.'
          : 'Architektura odporna na skoki ruchu. Kampanie reklamowe Meta/Google Ads i nagły napływ zapytań nie spowolnią serwisu.';
      }
      if (score >= 50) {
        return isEcommerce
          ? 'Architektura monolityczna. Przy zwiększonym ruchu lub dużej bazie produktów system zacznie łapać opóźnienia.'
          : 'Tradycyjny monolit CMS. Przy wzroście ruchu z kampanii strona może generować błędy i wolniej odpowiadać.';
      }
      return 'Sztywny, przestarzały system. Każdy nagły skok odwiedzin skutkuje ryzykiem zawieszenia i utraty zapytań.';

    case 'Automatyzacja':
      if (score >= 80) {
        return isEcommerce
          ? 'Nowoczesne środowisko (Headless/Edge). Bezproblemowa, tania w utrzymaniu integracja z dowolnym ERP, PIM czy BaseLinkerem.'
          : 'Nowoczesne środowisko (Headless/Edge). Błyskawiczna integracja z CRM, systemami rezerwacji, płatnościami i API.';
      }
      if (score >= 50) {
        return 'Utrudnione integracje. Łączenie z zewnętrznymi narzędziami wymaga kosztownych obejść lub wtyczek obniżających stabilność.';
      }
      return 'Brak elastycznych API wymusza manualną obsługę procesów, co drastycznie zawyża koszty operacyjne.';

    case 'Bezpieczeństwo':
      if (score >= 80) {
        return 'Żelazne nagłówki i nowoczesne protokoły. Dane Twoich klientów i korespondencja są chronione na poziomie korporacyjnym.';
      }
      if (score >= 50) {
        return 'Brak kluczowych polityk bezpieczeństwa (CSP/HSTS). Serwis jest umiarkowanie podatny na przechwytywanie sesji.';
      }
      return 'Brak podstawowych standardów ochrony. Narażasz firmę na incydenty bezpieczeństwa i kary za naruszenie RODO.';

    default:
      return 'Wymagana analiza.';
  }
}
