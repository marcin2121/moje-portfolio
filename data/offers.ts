export interface PricingTier {
  name: string;
  price: string;
  originalPrice?: string;
  priceSuffix?: string;
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
    clientName: "Panie Jarosławie",
    companyName: "Stowarzyszenie Aktywacja",
    videoUrl: "",
    painPoints: [
      "Konieczność spełnienia Ustawy o Dostępności Cyfrowej (standard WCAG 2.1 AA) w celu zabezpieczenia stowarzyszenia przed karami administracyjnymi oraz odrzuceniem wniosków grantowych (FIO, NIW, programy UE).",
      "Potrzeba intuicyjnego, bezpiecznego systemu CMS po polsku, który pozwoli członkom zespołu samodzielnie publikować aktualności, projekty, bazę wiedzy i galerie bez wiedzy programistycznej.",
      "Konieczność uruchomienia nowoczesnego, w pełni responsywnego portalu w Radomiu z dedykowanymi modułami dla NGO (baza wiedzy, dokumenty do pobrania, wolontariat) w terminie do 15 listopada 2026 r."
    ],
    competitorAnalysis: [
      {
        competitorName: "Tradycyjne strony NGO oparte o przestarzałe, powolne szablony WordPress",
        whatTheyDoBetter: [
          "Często cierpią na niski czas ładowania (5-8 sekund), podatności bezpieczeństwa wtyczek oraz brak realnego dostosowania do czytników ekranu osób ze szczególnymi potrzebami.",
          "Wymagają ciągłego wsparcia zewnętrznych informatyków nawet przy prostych zmianach tekstów czy dodawaniu nowych projektów."
        ]
      },
      {
        competitorName: "Nowoczesne portale NGO (np. wdrożenie dla Stowarzyszenia KAS Radom: stowarzyszeniekas.pl)",
        whatTheyDoBetter: [
          "Błyskawiczny czas ładowania (4x100 Google PageSpeed, FCP poniżej 0.5s) i bezbłędne działanie na smartfonach, tabletach i komputerach.",
          "100% certyfikowanej zgodności prawnej ze standardem WCAG 2.1 AA (pełna obsługa klawiaturą, czytniki mowy, poprawna semantyka HTML5, Deklaracja Dostępności).",
          "Wygodny, przejrzysty panel CMS po polsku z dedykowanym szkoleniem wideo i instrukcją obsługi dla pracowników stowarzyszenia."
        ]
      }
    ],
    solutionSteps: [
      "Projekt i wdrożenie nowoczesnego, przejrzystego portalu opartego o architekturę Next.js z pełną strukturą z zapytania (O nas, Aktualności, Projekty, Działania, Wolontariat, Baza wiedzy dla NGO, Wydarzenia, Dokumenty, Galeria, Kontakt).",
      "Pełna certyfikacja dostępności cyfrowej WCAG 2.1 AA: audyt kodowy, wdrożenie nawigacji klawiaturą, etykiet ARIA, trybów kontrastu oraz sporządzenie urzędowej Deklaracji Dostępności.",
      "Wdrożenie intuicyjnego panelu CMS, przeprowadzenie instruktażu dla zespołu Stowarzyszenia Aktywacja, przekazanie pełnych dostępów i uruchomienie na domenie stowarzyszenieaktywacja.pl do 15.11.2026 r."
    ],
    packages: [
      {
        name: "PORTAL STATUTOWY WCAG",
        price: "6 900",
        originalPrice: "8 500",
        discountBadge: "PAKIET PODSTAWOWY",
        target: "Dla stowarzyszenia potrzebującego szybkiej, estetycznej witryny spełniającej w 100% wymogi formalne WCAG 2.1 AA pod dotacje i granty.",
        features: [
          "Dedykowany, bezszablonowy projekt graficzny dostosowany do identyfikacji Stowarzyszenia Aktywacja",
          "Pełna zgodność z Ustawą o Dostępności Cyfrowej (WCAG 2.1 AA ze sporządzoną Deklaracją Dostępności)",
          "Podstawowy zestaw sekcji: O nas, Cele statutowe, Aktualności, Projekty, Dokumenty do pobrania, Kontakt",
          "Czas ładowania poniżej 1 sekundy i pełna responsywność (Mobile / Tablet / Desktop)",
          "Zabezpieczony certyfikat SSL i bezpieczny formularz kontaktowy",
          "12 miesięcy gwarancji technicznej"
        ],
        ctaText: "Wybieram Pakiet Podstawowy",
        highlighted: false
      },
      {
        name: "KOMPLETNY PORTAL Z CMS (ZAKRES ZAPYTANIA)",
        price: "9 900",
        originalPrice: "12 500",
        discountBadge: "100% ZAPYTANIA OFERTOWEGO",
        target: "Dokładne pokrycie wszystkich 10 punktów zapytania ofertowego: pełna struktura 11 sekcji, intuicyjny CMS, szkolenie zespołu i uruchomienie do 15.11.2026 r.",
        features: [
          "Wszystkie elementy z pakietu podstawowego +",
          "Pełna struktura z zapytania: Strona główna, O Stowarzyszeniu, Aktualności, Projekty, Działania/Oferta, Wolontariat, Baza wiedzy dla NGO, Wydarzenia, Dokumenty do pobrania, Galeria zdjęć, Kontakt",
          "Intuicyjny system CMS po polsku: samodzielne dodawanie artykułów, projektów, galerii zdjęć, plików PDF i tworzenie nowych podstron bez programisty",
          "Dostępność cyfrowa WCAG 2.1 AA (kontrasty, klawiatura, opisy ALT, semantyka, formularze)",
          "Integracja z mediami społecznościowymi (Facebook, Instagram, LinkedIn)",
          "Indywidualne szkolenie / instruktaż dla zespołu Stowarzyszenia Aktywacja z obsługi panelu",
          "Kompletna instrukcja obsługi w formacie PDF oraz przekazanie 100% praw i dostępów",
          "Podpięcie pod obecną domenę www.stowarzyszenieaktywacja.pl",
          "Termin realizacji: gwarancja uruchomienia do 15.11.2026 r.",
          "Cena brutto: 9 900 zł (zwolnienie z VAT na podstawie art. 113 ust. 1 ustawy o VAT - kwota brutto = netto)"
        ],
        ctaText: "Akceptuję ofertę z zapytania",
        highlighted: true,
        badge: "DEDYKOWANY POD ZAPYTANIE"
      },
      {
        name: "EKOSYSTEM CYFROWY NGO PRO",
        price: "14 900",
        originalPrice: "18 000",
        discountBadge: "MAKSYMALNY ZASIĘG",
        target: "Dla stowarzyszenia, które oprócz standardowego portalu chce zbierać darowizny online (BLIK), prowadzić rekrutację wolontariuszy z ankietami i newsletter.",
        features: [
          "Wszystkie funkcjonalności z pakietu KOMPLETNY PORTAL Z CMS +",
          "Integracja z bramką szybkich darowizn online (wpłaty BLIK, 1.5% podatku)",
          "Zaawansowany moduł naboru wolontariuszy z automatyczną ankietą aplikacyjną",
          "System newslettera dla darczyńców i sympatyków stowarzyszenia",
          "Możliwość wdrożenia drugiej wersji językowej (np. angielskiej pod projekty unijne)",
          "Priorytetowa opieka techniczna i powdrożeniowa przez 12 miesięcy"
        ],
        ctaText: "Wybieram Wariant PRO",
        highlighted: false
      }
    ]
  },
};
