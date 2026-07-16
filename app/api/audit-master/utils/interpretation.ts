export function getInterpretation(score: number, pillar: string): string {
  switch (pillar) {
    case 'Szybkość':
      if (score >= 80) return 'Ułamek sekundy dzieli Cię od sprzedaży. Infrastruktura doskonale utrzymuje uwagę klientów mobilnych.';
      if (score >= 50) return 'Przeciętne tempo ładowania. Klienci ze słabszym łączem mogą porzucać koszyki przed wyświetleniem oferty.';
      return 'Krytyczny dług technologiczny. Ułamki sekund opóźnienia dosłownie palą Twój budżet, odrzucając klientów B2B.';
    case 'SEO':
      if (score >= 80) return 'Znakomita optymalizacja. Kod bezbłędnie wspiera organiczne pozycjonowanie Twoich produktów w wyszukiwarce.';
      if (score >= 50) return 'Zaniedbana struktura techniczna. Algorytmy mogą mieć problem z prawidłowym czytaniem i promowaniem Twojej oferty.';
      return 'Strona jest niewidzialna dla nowoczesnych crawlerów. Błędy w architekturze blokują Ci darmowy ruch organiczny.';
    case 'Skalowalność':
      if (score >= 80) return 'Architektura odporna na piki ruchu. Nagły napływ użytkowników czy tysiące nowych produktów nie spowolnią platformy.';
      if (score >= 50) return 'Architektura monolityczna. Przy zwiększonym ruchu lub dużej bazie produktów system zacznie łapać zadyszkę i opóźnienia.';
      return 'Sztywny, zamknięty system. Jakikolwiek nagły wzrost obciążenia skutkuje natychmiastowym zawieszeniem procesu sprzedaży.';
    case 'Automatyzacja':
      if (score >= 80) return 'Nowoczesne środowisko (Headless/Edge). Bezproblemowa, tania w utrzymaniu integracja z dowolnym ERP czy PIM po API.';
      if (score >= 50) return 'Utrudnione integracje. Łączenie z ERP wymaga karkołomnych obejść lub płatnych wtyczek obniżających wydajność.';
      return 'Ręczna robota i blokada rozwoju. Brak elastycznych API wymusza manualną obsługę procesów, co drastycznie zawyża koszty.';
    case 'Bezpieczeństwo':
      if (score >= 80) return 'Żelazne nagłówki i nowoczesne protokoły. Dane Twoich kontrahentów B2B są zabezpieczone na poziomie korporacyjnym.';
      if (score >= 50) return 'Brak kluczowych polityk bezpieczeństwa (CSP/HSTS). System umiarkowanie podatny na przechwytywanie sesji klientów.';
      return 'Brak podstawowych standardów ochrony. Narażasz firmę na wycieki danych i surowe konsekwencje naruszenia RODO.';
    default:
      return 'Wymagana analiza.';
  }
}
