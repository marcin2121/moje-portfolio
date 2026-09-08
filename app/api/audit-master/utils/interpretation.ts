import { SiteType } from '../types';

export function getInterpretation(score: number, pillar: string, siteType: SiteType = 'services'): string {
  const isEcommerce = siteType === 'ecommerce';
  const isGov = siteType === 'gov_public';
  const isEdu = siteType === 'education';
  const isNgo = siteType === 'ngo_foundation';

  switch (pillar) {
    case 'Szybkość':
      if (score >= 80) {
        if (isGov) return 'Błyskawiczny dostęp do informacji publicznej. Obywatele i petenci natychmiast uzyskują dostęp do spraw i komunikatów.';
        if (isEdu) return 'Błyskawiczne ładowanie. Uczniowie, rodzice i kandydaci szybko sprawdzają plan lekcji, e-dziennik i rekrutację.';
        if (isNgo) return 'Ułamek sekundy dzieli Cię od wpłaty darowizny lub zaangażowania darczyńcy. Infrastruktura natychmiast buduje zaufanie.';
        if (isEcommerce) return 'Ułamek sekundy dzieli Cię od sprzedaży. Infrastruktura doskonale utrzymuje uwagę klientów mobilnych.';
        return 'Ułamek sekundy dzieli Cię od zapytania ofertowego. Infrastruktura błyskawicznie angażuje potencjalnych klientów.';
      }
      if (score >= 50) {
        if (isGov) return 'Przeciętne tempo ładowania. Petenci ze słabszym łączem mogą mieć trudności z pobieraniem dokumentów i uchwał.';
        if (isEdu) return 'Przeciętne tempo ładowania. Użytkownicy mobilni mogą odczuwać opóźnienia przy przeglądaniu aktualności i rekrutacji.';
        if (isNgo) return 'Przeciętne tempo ładowania. Darczyńcy mogą rezygnować z wypełnienia formularza wsparcia lub zbiórki.';
        if (isEcommerce) return 'Przeciętne tempo ładowania. Klienci ze słabszym łączem mogą porzucać koszyki przed wyświetleniem oferty.';
        return 'Przeciętne tempo ładowania. Użytkownicy ze słabszym łączem mogą opuszczać serwis przed wysłaniem formularza kontaktowego.';
      }
      if (isGov || isEdu) return 'Krytyczny dług technologiczny. Ułamki sekund opóźnienia utrudniają dostęp do informacji publicznej i naruszają standardy cyfrowe.';
      if (isNgo) return 'Krytyczny dług technologiczny. Opóźnienia serwera zniechęcają darczyńców i obniżają liczbę przekazywanych wpłat.';
      return 'Krytyczny dług technologiczny. Ułamki sekund opóźnienia dosłownie palą Twój budżet marketingowy, odrzucając potencjalnych klientów.';

    case 'SEO':
      if (score >= 80) {
        if (isGov) return 'Znakomita widoczność komunikatów i procedur. Mieszkańcy bez trudu odnajdują ważne uchwały i komunikaty w Google.';
        if (isEdu) return 'Znakomita widoczność. Kandydaci i rodzice łatwo odnajdują ofertę edukacyjną i terminarz rekrutacji w wyszukiwarce.';
        if (isNgo) return 'Znakomita optymalizacja. Darczyńcy, wolontariusze i potrzebujący trafiają bezpośrednio na apele i programy wsparcia.';
        if (isEcommerce) return 'Znakomita optymalizacja. Kod bezbłędnie wspiera organiczne pozycjonowanie Twoich produktów w wyszukiwarce.';
        return 'Znakomita optymalizacja. Kod bezbłędnie wspiera organiczne pozycjonowanie Twoich usług i marki w Google.';
      }
      if (score >= 50) {
        return 'Zaniedbana struktura techniczna. Algorytmy wyszukiwarek mogą mieć problem z prawidłowym indeksowaniem kluczowych podstron.';
      }
      return 'Strona jest niewidzialna dla nowoczesnych crawlerów. Błędy w semantyce i architekturze blokują darmowy ruch organiczny.';

    case 'Skalowalność':
      if (score >= 80) {
        if (isGov) return 'Architektura odporna na piki odwiedzin (ogłoszenia kryzysowe, alerty pogodowe, rekrutacja do szkół).';
        if (isEdu) return 'Architektura odporna na skoki ruchu (wyniki rekrutacji, rozpoczęcie roku szkolnego, dni otwarte).';
        if (isNgo) return 'Architektura odporna na piki ruchu (nagłośnienie zbiórki w mediach, kampania 1.5% podatku).';
        if (isEcommerce) return 'Architektura odporna na piki ruchu. Nagły napływ użytkowników czy tysiące nowych produktów nie spowolnią platformy.';
        return 'Architektura odporna na skoki ruchu. Kampanie reklamowe Meta/Google Ads i nagły napływ zapytań nie spowolnią serwisu.';
      }
      if (score >= 50) {
        if (isGov || isEdu) return 'Tradycyjny monolit. W dniach wzmożonego zainteresowania (np. nabór, sytuacje awaryjne) strona może drastycznie zwolnić.';
        if (isEcommerce) return 'Architektura monolityczna. Przy zwiększonym ruchu lub dużej bazie produktów system zacznie łapać opóźnienia.';
        return 'Tradycyjny monolit CMS. Przy wzroście ruchu z kampanii strona może generować błędy i wolniej odpowiadać.';
      }
      return 'Sztywny, przestarzały system. Każdy nagły skok odwiedzin skutkuje ryzykiem zawieszenia i utraty zapytań.';

    case 'Automatyzacja':
      if (score >= 80) {
        if (isGov) return 'Nowoczesne środowisko ułatwiające integrację z ePUAP, EZD, BIP i kanałami powiadomień dla mieszkańców.';
        if (isEdu) return 'Nowoczesne środowisko wspierające integrację z e-dziennikami (Librus, Vulcan), rekrutacją i e-learningiem.';
        if (isNgo) return 'Nowoczesne środowisko ułatwiające integrację z bramkami szybkich wpłat (TPay, PayU, Stripe) i CRM darczyńców.';
        if (isEcommerce) return 'Nowoczesne środowisko (Headless/Edge). Bezproblemowa, tania w utrzymaniu integracja z dowolnym ERP, PIM czy BaseLinkerem.';
        return 'Nowoczesne środowisko (Headless/Edge). Błyskawiczna integracja z CRM, systemami rezerwacji, płatnościami i API.';
      }
      if (score >= 50) {
        return 'Utrudnione integracje. Łączenie z zewnętrznymi narzędziami wymaga kosztownych obejść lub wtyczek obniżających stabilność.';
      }
      return 'Brak elastycznych API wymusza manualną obsługę procesów, co drastycznie zawyża koszty operacyjne.';

    case 'Bezpieczeństwo':
      if (score >= 80) {
        if (isGov) return 'Żelazne nagłówki i ochrona danych obywateli zgodnie ze standardami KRI (Krajowe Ramy Interoperacyjności) i RODO.';
        if (isEdu) return 'Wzorowa ochrona danych osobowych uczniów, rodziców i kadry pedagogicznej przed wyciekiem.';
        if (isNgo) return 'Wzorowe zabezpieczenie danych darczyńców, wolontariuszy i podopiecznych organizacji.';
        return 'Żelazne nagłówki i nowoczesne protokoły. Dane Twoich klientów i korespondencja są chronione na poziomie korporacyjnym.';
      }
      if (score >= 50) {
        return 'Brak kluczowych polityk bezpieczeństwa (CSP/HSTS). Serwis jest umiarkowanie podatny na przechwytywanie sesji.';
      }
      return 'Brak podstawowych standardów ochrony. Narażasz organizację na incydenty bezpieczeństwa i kary za naruszenie RODO.';

    default:
      return 'Wymagana analiza.';
  }
}
