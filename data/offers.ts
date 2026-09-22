export interface PricingTier {
  name: string;
  price: string;
  originalPrice?: string;
  target: string;
  features: string[];
  ctaText: string;
  highlighted: boolean;
  badge?: string;
  discountBadge?: string;
}

export interface ClientOffer {
  clientName: string;
  companyName: string;
  videoUrl?: string; // Optional YouTube / Loom embed link
  painPoints: string[];
  competitorAnalysis: {
    competitorName: string;
    whatTheyDoBetter: string[];
  }[];
  solutionSteps: string[];
  packages: PricingTier[];
}

// Ten obiekt służy jako lokalna "baza danych". Klucze to tokeny URL.
export const offers: Record<string, ClientOffer> = {
  "demo-klient": {
    clientName: "Panie Tomaszu",
    companyName: "Auto-Serwis Tomasz",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Można zamienić na dowolny embed
    painPoints: [
      "Strona internetowa ładuje się ponad 5 sekund, zniechęcając klientów z mobile.",
      "Odbieranie dziesiątek telefonów dziennie z pytaniem o wolne terminy wybija z pracy.",
      "Brak automatycznych przypomnień SMS skutkuje tym, że klienci zapominają o wizycie."
    ],
    competitorAnalysis: [
      {
        competitorName: "Auto-Naprawa Premium (Konkurencja A)",
        whatTheyDoBetter: [
          "Mają zautomatyzowany kalendarz na stronie - klient widzi, kiedy można przyjechać.",
          "Ich strona ładuje się w 1.2s, przez co są wyżej w Google."
        ]
      },
      {
        competitorName: "Mechanika Pojazdowa Janusz (Konkurencja B)",
        whatTheyDoBetter: [
          "Podpięty system automatycznie wysyłający wyceny za podstawowe usługi."
        ]
      }
    ],
    solutionSteps: [
      "Wdrożenie dedykowanego, ultraszybkiego landing page'a z optymalizacją pod Core Web Vitals.",
      "Integracja z systemem kalendarzykowym (Zautomatyzowana Rezerwacja Online 24/7).",
      "Wdrożenie automatycznych przypomnień SMS, redukujących tzw. no-shows o 90%."
    ],
    packages: [
      {
        name: "SZYBKI START",
        price: "4 500",
        target: "Chcesz po prostu odciążyć telefon i zacząć zbierać zlecenia z internetu.",
        features: [
          "Błyskawiczny Landing Page",
          "Formularz kontaktowy z powiadomieniem na SMS",
          "Poprawne wdrożenie analityki Google",
          "Podstawowa optymalizacja SEO na Twój region"
        ],
        ctaText: "Wybieram ten pakiet",
        highlighted: false
      },
      {
        name: "AUTOMATYZACJA WARSZTATU",
        price: "7 500",
        target: "Chcesz przestać odbierać telefony i pozwolić klientom rezerwować czas samodzielnie.",
        features: [
          "Wszystko to co w Szybkim Starcie +",
          "Zautomatyzowany System Rezerwacji 24/7",
          "Automatyczne SMSy przypominające o wizycie",
          "Panel na smartfon do zarządzania terminami"
        ],
        ctaText: "Wybieram ten pakiet",
        highlighted: true,
        badge: "REKOMENDOWANY"
      },
      {
        name: "LIDER REGIONU",
        price: "12 000",
        target: "Chcesz zdominować lokalny rynek, odzyskać swój czas i zbudować bezkonkurencyjny wizerunek.",
        features: [
          "Wszystko to co w Automatyzacji +",
          "Wirtualny Asystent AI wyceniający naprawy",
          "Automat zbierający opinie na Google",
          "Dedykowane wideo promocyjne warsztatu",
          "Priorytetowa opieka techniczna 24/7 na WhatsApp"
        ],
        ctaText: "Aplikuj o pakiet VIP",
        highlighted: false
      }
    ]
  },
  "maciek-kawecki": {
    clientName: "Maciek",
    companyName: "Spływy kajakowe",
    videoUrl: "",
    painPoints: [
      "Marnowanie czasu i utrata klientów przez konieczność ciągłego odbierania telefonów w trakcie koordynowania spływów i transportu na rzece.",
      "Przegrywanie walki o klienta z agregatorami typu Kajakolandia, mimo posiadania lepszej, stricte lokalnej infrastruktury w Biejkowie.",
      "Brak gwarancji przybycia klientów (porzucone rezerwacje telefoniczne) oraz chaos w zarządzaniu dostępnością floty kajaków podczas weekendowych szczytów."
    ],
    competitorAnalysis: [
      {
        competitorName: "Kajakolandia.pl",
        whatTheyDoBetter: [
          "Szerokie pozycjonowanie w Google na frazy ogólne związane z Pilicą, przez co przechwytują klientów szukających spływów w regionie.",
          "Rozbudowana prezentacja wielu tras, która buduje wizerunek dużego, bezpiecznego podmiotu na rynku turystycznym."
        ]
      },
      {
        competitorName: "Lokalni liderzy na Pilicy (np. wypożyczalnie z Warki/Białobrzegów)",
        whatTheyDoBetter: [
          "Wdrożone interaktywne cenniki i formularze ułatwiające szybki kontakt ze smartfona.",
          "Konsekwentne budowanie bazy opinii w Google Maps, co pozycjonuje ich najwyżej w lokalnych wynikach wyszukiwania."
        ]
      }
    ],
    solutionSteps: [
      "Stworzenie bezkompromisowo szybkiej i minimalistycznej strony w architekturze Next.js, sfokusowanej wyłącznie na destynację Biejków, co pozwoli zdominować lokalne frazy w Google i odciąć szum konkurencji.",
      "Wdrożenie automatycznego systemu rezerwacji online połączonego z natychmiastowymi płatnościami BLIK/Apple Pay, co przerzuci proces rezerwacji na klienta i zagwarantuje 100% przedpłat.",
      "Uruchomienie automatyzacji opinii i marketingu, która bez Twojego udziału przekształci weekendowych kajakarzy w armię ambasadorów zostawiających 5 gwiazdek w Google."
    ],
    packages: [
      {
        name: "WIZYTÓWKA",
        price: "1 000",
        originalPrice: "2 000",
        discountBadge: "-50% DLA CIEBIE",
        target: "Dla zabezpieczenia cyfrowej obecności w Biejkowie. Haczyk: Rezerwacje sprzętu, sprawdzanie dostępności i logistykę tras nadal musisz w 100% obsługiwać ręcznie przez telefon, nawet będąc na wodzie.",
        features: [
          "Indywidualny, nowoczesny projekt graficzny budujący status premium przystani w Biejkowie (zero powtarzalnych szablonów)",
          "Teksty sprzedażowe precyzyjnie trafiające w potrzeby firm szukających integracji oraz ekip organizujących weekendowe wypady",
          "Czas ładowania strony poniżej 1.5s - bezbłędne działanie na smartfonach klientów stojących nad rzeką przy słabym zasięgu LTE",
          "Założenie i optymalizacja Wizytówki Google (Google Moja Firma)",
          "Ultra-prosty formularz kontaktowy z natychmiastowym powiadomieniem na Twój e-mail i telefon",
          "Pełne wdrożenie polityki prywatności i zgodności z RODO dla pełnego bezpieczeństwa prawnego",
          "Pancerne zabezpieczenia chmurowe odporne na ataki konkurencji i automatyczne, codzienne kopie zapasowe bazy danych",
          "6 miesięcy bezpłatnej opieki technicznej i czuwania nad stabilnością strony w trakcie trwania sezonu"
        ],
        ctaText: "Wybieram pakiet Wizytówka",
        highlighted: false
      },
      {
        name: "MASZYNA SPRZEDAŻOWA",
        price: "2 500",
        originalPrice: "5 000",
        discountBadge: "-50% DLA CIEBIE",
        target: "Pełen automat dla wypożyczalni kajaków. Klienci sami wybierają termin, liczbę kajaków i płacą z góry, a Ty widzisz gotowy grafik w swoim smartfonie bez odbierania ani jednego telefonu.",
        features: [
          "Wszystkie przewagi technologiczne i wizerunkowe z pakietu WIZYTÓWKA",
          "Dedykowany, ultraszybki system rezerwacji sprzętu i terminów stworzony z myślą o specyfice spływów z Biejkowa",
          "Integracja z natychmiastowymi płatnościami online (BLIK, Apple Pay, szybkie przelewy) - klient płaci zanim wsiądzie do samochodu",
          "Intuicyjny panel menedżera do zarządzania całą flotą kajaków bezpośrednio z ekranu telefonu komórkowego",
          "Gwarancja 0% prowizji systemowych od sprzedaży - cały wypracowany zysk ze spływów trafia bezpośrednio na Twoje konto",
          "Błyskawiczne wideo-szkolenie w 60 sekund, dzięki któremu od razu opanujesz blokowanie terminów czy zmianę cen w szczycie sezonu"
        ],
        ctaText: "Uruchamiam Maszynę Sprzedażową",
        highlighted: true,
        badge: "REKOMENDOWANY"
      },
      {
        name: "LIDER RYNKU / VIP",
        price: "4 500",
        originalPrice: "9 000",
        discountBadge: "-50% DLA CIEBIE",
        target: "Totalna dominacja na odcinku Pilicy. Cyfrowy monopol, który automatycznie zdobywa klientów premium, zbiera opinie i buduje pozycję lidera w regionie, podczas gdy Ty skalujesz biznes.",
        features: [
          "Wszystkie funkcjonalności automatyzacyjne z pakietu MASZYNA SPRZEDAŻOWA",
          "Wirtualny Asystent AI działający 24/7 - automatycznie odpowiada klientom na pytania o pogodę, trudność trasy i logistykę odbioru",
          "Inteligentny system opinii Google - wysyła automatyczny SMS z prośbą o 5 gwiazdek dokładnie wtedy, gdy kajakarze kończą spływ",
          "Profesjonalne wsparcie i przygotowanie dokumentacji technicznej pod dotacje (np. KPO) na dalszą cyfryzację bazy kajakowej",
          "Dedykowane szkolenie warsztatowe na żywo dla Ciebie i Twoich pracowników z obsługi cyfrowego systemu logistycznego",
          "Priorytetowe Wsparcie VIP - bezpośredni, dedykowany kanał WhatsApp ze mną i reakcją techniczną do 2 godzin w kluczowe weekendy",
          "Wdrożenie elektronicznych oświadczeń i umów najmu sprzętu - klient podpisuje cyfrowo na ekranie telefonu przed wydaniem wiosła"
        ],
        ctaText: "Zostaję Liderem Rynku",
        highlighted: false
      }
    ]
  },
  "stowarzyszenie-aktywacja": {
    clientName: "Zespół Stowarzyszenia",
    companyName: "Stowarzyszenie Aktywacja",
    videoUrl: "",
    painPoints: [
      "Brak własnej strony internetowej ogranicza możliwość pozyskiwania dotacji i grantów publicznych (wymóg formalny w wielu konkursach FIO, NIW, programach unijnych i samorządowych).",
      "Konieczność spełnienia Ustawy o Dostępności Cyfrowej (WCAG 2.1 / 2.2 AA), której brak naraża organizacje pozarządowe na ryzyko odrzucenia wniosków grantowych i kary administracyjne.",
      "Brak bezpiecznego narzędzia do zbierania darowizn online (szybkie wpłaty BLIK, 1.5% podatku) oraz prezentacji sprawozdań i zespołu budującego zaufanie darczyńców."
    ],
    competitorAnalysis: [
      {
        competitorName: "Tradycyjne strony NGO oparte o przestarzałe szablony",
        whatTheyDoBetter: [
          "Często mają niską prędkość ładowania, zawieszające się wtyczki po aktualizacjach oraz brak dostosowania do czytników ekranu osób ze szczególnymi potrzebami.",
          "Wymagają ciągłych, płatnych poprawek programistycznych przy każdej zmianie treści lub dodaniu nowego projektu."
        ]
      },
      {
        competitorName: "Nowoczesne portale NGO (np. wdrożenie dla Stowarzyszenia KAS: stowarzyszeniekas.pl)",
        whatTheyDoBetter: [
          "Błyskawiczny czas ładowania (4x100 Google PageSpeed, FCP 0.3s) i bezbłędne działanie na smartfonach.",
          "100% zgodności prawnej z WCAG 2.2 AA (tryb wysokiego kontrastu, pełna obsługa klawiaturą, czytniki mowy).",
          "Wygodny, intuicyjny panel edycji treści po polsku, pozwalający pracownikom dodawać projekty, zdjęcia i sprawozdania bez wiedzy technicznej."
        ]
      }
    ],
    solutionSteps: [
      "Opracowanie nowoczesnej, budzącej zaufanie identyfikacji i architektury informacji dopasowanej do statutu i celów Stowarzyszenia Aktywacja.",
      "Wdrożenie ultrabieżącej, bezpiecznej platformy w architekturze Next.js z certyfikowaną dostępnością WCAG 2.2 AA (gwarancja bezpieczeństwa wniosków dotacyjnych).",
      "Uruchomienie modułów kluczowych dla NGO: prezentacja projektów i zespołu, repozytorium sprawozdań finansowych i merytorycznych, formularz kontaktu oraz zintegrowane darowizny online (BLIK / szybkie przelewy)."
    ],
    packages: [
      {
        name: "WIZYTÓWKA STATUTOWA & WCAG",
        price: "7 900",
        originalPrice: "9 900",
        discountBadge: "PAKIET STARTOWY",
        target: "Dla stowarzyszenia, które potrzebuje natychmiast profesjonalnej, zgodnej z prawem obecności w sieci pod najbliższe wnioski o dotacje i granty.",
        features: [
          "Dedykowany, bezszablonowy projekt graficzny budujący wiarygodność organizacji",
          "Pełna zgodność z Ustawą o Dostępności Cyfrowej (WCAG 2.2 AA z Deklaracją Dostępności)",
          "Sekcje: O nas, Cele statutowe, Zespół, Kontakt oraz Dokumenty i Sprawozdania",
          "Czas ładowania poniżej 1s (Next.js 16) i pełna responsywność pod smartfony",
          "Zabezpieczony formularz kontaktowy z natychmiastowym powiadomieniem na e-mail",
          "12 miesięcy gwarancji technicznej i opieki powdrożeniowej"
        ],
        ctaText: "Wybieram Pakiet Startowy",
        highlighted: false
      },
      {
        name: "KOMPLETNY PORTAL STOWARZYSZENIA",
        price: "12 500",
        originalPrice: "15 000",
        discountBadge: "NAJCZĘŚCIEJ WYBIERANY",
        target: "Dla aktywnej organizacji, która chce regularnie publikować aktualności, zarządzać projektami i samodzielnie edytować treści bez pomocy programisty.",
        features: [
          "Wszystkie elementy z pakietu WIZYTÓWKA STATUTOWA +",
          "Wygodny, intuicyjny panel CMS po polsku do samodzielnego dodawania artykułów, projektów i galerii",
          "Interaktywny moduł zrealizowanych i trwających projektów z filtrowaniem",
          "Dział sprawozdań finansowych i merytorycznych (kluczowy wymóg transparentności NGO)",
          "Integracja z szybkimi darowiznami online (bramka płatności BLIK / szybkie przelewy)",
          "Dedykowane szkolenie wideo dla zespołu z obsługi panelu administracyjnego",
          "Konfiguracja domeny, certyfikatów SSL i bezpiecznej poczty stowarzyszenia"
        ],
        ctaText: "Wybieram Kompletny Portal",
        highlighted: true,
        badge: "REKOMENDOWANY DLA NGO"
      },
      {
        name: "EKOSYSTEM CYFROWY NGO PRO",
        price: "18 500",
        originalPrice: "22 000",
        discountBadge: "MAKSYMALNY ZASIĘG",
        target: "Dla organizacji prowadzącej szerokie działania społeczne, rekrutację wolontariuszy, konsultacje lub projekty międzynarodowe (np. Erasmus+).",
        features: [
          "Wszystkie funkcjonalności z pakietu KOMPLETNY PORTAL +",
          "Druga wersja językowa (angielska) pod projekty międzynarodowe i unijne",
          "Dedykowany moduł naboru wolontariuszy z ankietą aplikacyjną",
          "System anonimowych zgłoszeń / formularz rezerwacji konsultacji lub warsztatów",
          "Zautomatyzowane zbieranie bazy newslettera dla darczyńców i sympatyków",
          "Wsparcie techniczne VIP z priorytetowym czasem reakcji do 4h"
        ],
        ctaText: "Wybieram Wariant NGO PRO",
        highlighted: false
      }
    ]
  }
};
