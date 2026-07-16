import React from 'react';
import { Star, Briefcase, Rocket } from 'lucide-react';

export const TIERS_SERVICES = [
  {
    name: 'WIZYTÓWKA SPRZEDAŻOWA',
    price: '2 500',
    icon: <Briefcase className="w-5 h-5" />,
    target: 'Dla małych firm i rzemiosła. Chcesz przestać przepalać budżet na reklamy i błyskawicznie zamieniać odwiedzających w dzwoniących klientów.',
    features: [
      'Unikalny projekt graficzny (zero gotowych szablonów) budujący prestiż marki',
      'Strona zaprojektowana pod sprzedaż (układ eliminujący ucieczkę klientów)',
      'Ułożenie Twoich tekstów pod kątem lokalnego pozycjonowania w Google',
      'Gwarancja błyskawicznego ładowania (<1.5s), by nie tracić ruchu z reklam',
      'Prosty formularz kontaktowy, który sam przesyła zapytania na Twój telefon',
      'Założenie i zoptymalizowanie Wizytówki Google Maps dla lokalnego zasięgu',
      'Spokój prawny (pełna zgodność z RODO i wdrożenie polityki prywatności)',
      '6 miesięcy żelaznej gwarancji na bezawaryjne działanie kodu'
    ],
    ctaText: 'Wybieram ten pakiet',
    highlighted: false
  },
  {
    name: 'MASZYNA SPRZEDAŻOWA',
    price: '5 400',
    icon: <Rocket className="w-5 h-5 text-orange-500" />,
    target: 'Chcesz, by strona automatycznie pozyskiwała klientów i przyjmowała rezerwacje 24/7, nawet gdy obsługujesz innych.',
    features: [
      'Wszystko to, co w pakiecie "Wizytówka Sprzedażowa" +',
      'Rozbudowana struktura (np. szczegółowe opisy zabiegów, pakiety i cenniki)',
      'Napisanie profesjonalnych, sprzedażowych tekstów przez eksperta (język korzyści)',
      'Błyskawiczny, bezawaryjny system rezerwacji wizyt (zero utraconych klientów)',
      'Podpięte natychmiastowe płatności online (pobieranie zadatków, sprzedaż voucherów)',
      'Prosty panel do samodzielnej edycji cen i usług bez ryzyka zepsucia układu strony',
      'Zatrzymujesz 100% zysku z usług (0% ukrytych prowizji systemowych)',
      <React.Fragment key="care">12 miesięcy opieki technicznej i Twojego pełnego <strong>świętego spokoju</strong></React.Fragment>
    ],
    ctaText: 'Wybieram ten pakiet',
    highlighted: true,
    badge: 'REKOMENDOWANY'
  },
  {
    name: 'LIDER RYNKU / AUTOMATYZACJA PRO',
    price: '8 900',
    icon: <Star className="w-5 h-5" />,
    target: 'Dla firm, które toną w papierologii i kalendarzach. Chcesz w pełni zautomatyzować obsługę, zdeklasować konkurencję i odzyskać swój czas.',
    features: [
      'Wszystko to, co w pakiecie "Maszyna Sprzedażowa" + Dedykowana Aplikacja Usługowa',
      'Automatyczny obieg danych (spinamy platformę z Twoim systemem rezerwacji, kalendarzem lub fakturowaniem)',
      'Twój Asystent AI 24/7 – inteligentny bot, który odciąża Cię z pytań o usługi i cennik',
      'Automat do Google Maps – system sam prosi zadowolonych klientów o 5★ po wizycie',
      'Gotowa specyfikacja techniczna pod dotacje na cyfryzację (np. z KPO)',
      'Priorytetowe Wsparcie VIP: bezpośredni kanał na WhatsApp i gwarancja reakcji w max 2h',
      'Dożywotnia Gwarancja Inżynieryjna na stabilność systemu (zero ukrytych wad)'
    ],
    ctaText: 'Aplikuj o pakiet VIP',
    highlighted: false
  }
];

export const TIERS_ECOMMERCE = [
  {
    name: 'LANDING PAGE / KATALOG',
    price: '3 500',
    icon: <Briefcase className="w-5 h-5" />,
    target: 'Chcesz przetestować nowy produkt na rynku, zbierać zapytania hurtowe (B2B) lub sprzedawać jeden flagowy produkt.',
    features: [
      'Unikalny projekt graficzny (zero gotowych szablonów) budujący prestiż marki',
      'Strona zaprojektowana pod szybką sprzedaż (układ typu Long-Form)',
      'Ułożenie Twoich tekstów pod kątem skutecznego pozycjonowania w Google',
      'Gwarancja błyskawicznego ładowania (<1.5s), by nie tracić ruchu z reklam',
      'Prosty formularz zamówień/zapytań, który powiadamia Cię SMS-em lub mailem',
      'Założenie i zoptymalizowanie Wizytówki Google Maps dla Twojej firmy',
      'Spokój prawny (pełna zgodność z RODO i wdrożenie polityki prywatności)',
      '6 miesięcy żelaznej gwarancji na bezawaryjne działanie kodu'
    ],
    ctaText: 'Wybieram ten pakiet',
    highlighted: false
  },
  {
    name: 'MASZYNA SPRZEDAŻOWA',
    price: '6 400',
    icon: <Rocket className="w-5 h-5 text-orange-500" />,
    target: 'Chcesz profesjonalnego sklepu, który sprzedaje automatycznie 24/7 i nigdy nie dzieli się Twoją marżą z pośrednikami.',
    features: [
      'Wszystko to, co w pakiecie "Landing Page / Katalog" +',
      'Zbudowanie bazy do 30 produktów / wariantów gotowych do natychmiastowej sprzedaży',
      'Napisanie profesjonalnych, sprzedażowych tekstów przez eksperta (język korzyści)',
      'Błyskawiczny, bezawaryjny silnik koszyka (eliminacja porzuconych transakcji)',
      'Podpięte natychmiastowe płatności online (BLIK, Apple Pay) prosto na Twoje konto',
      'Pełna automatyzacja logistyki (Zintegrowany InPost i szybkie generowanie etykiet)',
      'Zatrzymujesz 100% marży z produktów (0% ukrytych prowizji systemowych)',
      'Prosty panel do zarządzania magazynem i cenami bez ryzyka zepsucia strony',
      <React.Fragment key="care2">12 miesięcy opieki technicznej i Twojego pełnego <strong>świętego spokoju</strong></React.Fragment>
    ],
    ctaText: 'Wybieram ten pakiet',
    highlighted: true,
    badge: 'REKOMENDOWANY'
  },
  {
    name: 'LIDER RYNKU / AUTOMATYZACJA PRO',
    price: '10 900',
    icon: <Star className="w-5 h-5" />,
    target: 'Twój sklep szybko rośnie, a Ty toniesz w paczkach. Chcesz zautomatyzować logistykę, zdeklasować konkurencję i odzyskać swój czas.',
    features: [
      'Wszystko to, co w pakiecie "Maszyna Sprzedażowa" + Sklep bez limitu asortymentu (inżynieryjny import bazy danych)',
      'Automatyczny obieg danych (spinamy sklep z systemem ERP, BaseLinkerem lub magazynem)',
      'Twój Asystent AI 24/7 – inteligentny bot doradzający klientom w wyborze produktów',
      'Automat do Google Maps – system sam prosi klientów o opinię 5★ po odebraniu paczki',
      'Gotowa specyfikacja techniczna pod dotacje na cyfryzację (np. z KPO)',
      'Priorytetowe Wsparcie VIP: bezpośredni kanał na WhatsApp i gwarancja reakcji w max 2h',
      'Dożywotnia Gwarancja Inżynieryjna na stabilność systemu (zero ukrytych wad)'
    ],
    ctaText: 'Aplikuj o pakiet VIP',
    highlighted: false
  }
];
