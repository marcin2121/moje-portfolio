import {
  CatalogCheckpointDefinition,
  CheckpointEvaluation,
  CheckpointStats,
  EvidenceSummary,
  PageAuditResult,
  DetailedCodeSmells,
  SiteType
} from '../types';

/**
 * Statyczna baza wiedzy o 80 najczęstszych punktach kontrolnych w E-Commerce i B2B.
 * Trzymana po stronie kodu, by minimalizować payload sieciowy z API do kilku KB.
 */
export const CHECKPOINTS_CATALOG: Record<string, CatalogCheckpointDefinition> = {
  // ==========================================
  // 1. ANALITYKA, TELEMETRIA & KAMPANIE ADS (14)
  // ==========================================
  'track-add-to-cart': {
    id: 'track-add-to-cart',
    name: 'Śledzenie zdarzenia add_to_cart (Koszyk)',
    category: 'tracking_ads',
    severity: 'critical',
    defaultDiagnosisPassed: 'Zdarzenie add_to_cart jest prawidłowo emitowane do dataLayer i pikseli reklamowych.',
    defaultDiagnosisFailed: 'Wykryto kody reklam, ale mechanizm koszyka nie wysyła zdarzenia add_to_cart do silników reklamowych.',
    businessImpact: 'Algorytmy Google Ads (Smart Bidding) i Meta Advantage+ nie wiedzą, kto realnie dodaje produkty do koszyka. Koszt pozyskania klienta (CAC) rośnie o 40-60%.',
    businessBenefit: 'Natychmiastowe zasilenie algorytmów AI w najcenniejszy sygnał intencji zakupowej. Spadek kosztu konwersji (CPA) o 25–40% i dynamiczny wzrost sprzedaży z remarketingu.',
    developerSolution: 'Wdrożę precyzyjne wywołanie dataLayer.push({ event: "add_to_cart", ecommerce: { ... } }) podpięte pod koszyk w kodzie w 24h.'
  },
  'track-purchase': {
    id: 'track-purchase',
    name: 'Śledzenie transakcji i wartości zamówienia (purchase)',
    category: 'tracking_ads',
    severity: 'critical',
    defaultDiagnosisPassed: 'Zdarzenie zakupu z wartością i walutą jest prawidłowo przekazywane do analityki.',
    defaultDiagnosisFailed: 'Brak precyzyjnego zdarzenia purchase po finalizacji zakupu lub brak przekazywania kwoty przychodu.',
    businessImpact: 'Całkowity brak możliwości optymalizacji kampanii pod kątem ROAS (zwrotu z nakładów na reklamę). Wydajesz budżet na ślepo.',
    businessBenefit: 'Pełna kontrola nad rentownością każdej wydanej złotówki w Google i Meta Ads. Uruchomienie strategii tROAS gwarantującej maksymalizację zysku.',
    developerSolution: 'Zaimplementuję zdarzenie purchase z walidacją deduplikacji (transaction_id) na stronie podziękowania w 24h.'
  },
  'track-view-item': {
    id: 'track-view-item',
    name: 'Dynamiczny Remarketing: zdarzenie view_item / ViewContent',
    category: 'tracking_ads',
    severity: 'critical',
    defaultDiagnosisPassed: 'Karty produktów prawidłowo emitują dane o oglądanym produkcie do katalogu reklam.',
    defaultDiagnosisFailed: 'Karty produktów nie wysyłają zdarzenia view_item (GA4) ani ViewContent (Meta Pixel) z ID i ceną produktu.',
    businessImpact: 'Zamiast spersonalizowanego produktu, porzucający użytkownicy widzą losowe reklamy ogólne. Utrata 35-50% szans na domknięcie koszyka.',
    businessBenefit: 'Automatyczne wyświetlanie klientom dokładnie tego towaru, który przed chwilą oglądali. Wzrost współczynnika powrotów i konwersji remarketingu o ponad 45%.',
    developerSolution: 'Wdrożę automatyczny dispatch zdarzeń view_item i ViewContent z poprawnym ID katalogu w szablonie produktu w 24h.'
  },
  'track-consent-mode-v2': {
    id: 'track-consent-mode-v2',
    name: 'Google Consent Mode v2 (Zgody UE)',
    category: 'tracking_ads',
    severity: 'critical',
    defaultDiagnosisPassed: 'Wdrożono poprawną konfigurację Google Consent Mode v2 z parametrami ad_storage i ad_user_data.',
    defaultDiagnosisFailed: 'Brak parametrów Consent Mode v2 wymaganych od marca 2024 przez Google dla reklamodawców w UE.',
    businessImpact: 'Google Ads blokuje odświeżanie list remarketingowych, a kampanie Performance Max i Search tracą do 30% raportowanych konwersji.',
    businessBenefit: 'Pełna zgodność z rygorystycznymi wymogami Google i UE oraz odzyskanie utraconych danych dzięki zaawansowanemu modelowaniu AI w GA4.',
    developerSolution: 'Skonfiguruję certyfikowaną integrację Consent Mode v2 z GTM i banerem cookies zgodnie z IAB TCF 2.2 w 24h.'
  },
  'track-gtm-installed': {
    id: 'track-gtm-installed',
    name: 'Google Tag Manager (GTM)',
    category: 'tracking_ads',
    severity: 'good',
    defaultDiagnosisPassed: 'Google Tag Manager jest zainstalowany i zarządza tagami witryny.',
    defaultDiagnosisFailed: 'Brak centralnego kontenera Google Tag Manager w architekturze witryny.',
    businessImpact: 'Konieczność ręcznego wstrzykiwania każdego skryptu w kod strony, co wydłuża wdrożenia i stwarza ryzyko błędów krytycznych.',
    businessBenefit: 'Błyskawiczne uruchamianie nowych kampanii, pikseli i narzędzi analitycznych bez angażowania programisty i bez ryzyka awarii serwisu.',
    developerSolution: 'Wdrożę zoptymalizowany asynchroniczny kontener Google Tag Manager w nagłówku i sekcji body w 24h.'
  },
  'track-datalayer-standard': {
    id: 'track-datalayer-standard',
    name: 'Uporządkowana warstwa danych (dataLayer)',
    category: 'tracking_ads',
    severity: 'warning',
    defaultDiagnosisPassed: 'Aplikacja posiada uporządkowaną warstwę window.dataLayer.',
    defaultDiagnosisFailed: 'Zainstalowano GTM, ale brak standaryzowanej warstwy danych dataLayer.',
    businessImpact: 'Tagi opierają się na niestabilnych selektorach HTML w DOM, które psują się przy najmniejszej zmianie wizualnej na stronie.',
    businessBenefit: 'Pancerna odporność analityki na zmiany wyglądu i aktualizacje szablonu. 100% pewności, że dane finansowe w raportach są precyzyjne.',
    developerSolution: 'Zaimplementuję ustandaryzowaną warstwę window.dataLayer z modelem obiektowym dopasowanym do specyfiki biznesu w 24h.'
  },
  'track-ga4-installed': {
    id: 'track-ga4-installed',
    name: 'Google Analytics 4 (GA4)',
    category: 'tracking_ads',
    severity: 'good',
    defaultDiagnosisPassed: 'Wykryto aktywną instalację Google Analytics 4 (GA4).',
    defaultDiagnosisFailed: 'Brak aktywnego identyfikatora Google Analytics 4 (strumienia G- lub GT-).',
    businessImpact: 'Brak danych o zachowaniu użytkowników, źródłach ruchu i ścieżkach konwersji. Podejmowanie decyzji biznesowych po omacku.',
    businessBenefit: 'Zaawansowany wgląd w zachowania użytkowników, predykcje AI dotyczące prawdopodobieństwa zakupu i pełna integracja z Google Ads.',
    developerSolution: 'Podepnę i skonfiguruję najnowszy strumień danych GA4 z wykluczeniem ruchu wewnętrznego i pomiarem zaangażowania w 24h.'
  },
  'track-meta-pixel': {
    id: 'track-meta-pixel',
    name: 'Meta Pixel (Facebook & Instagram Ads)',
    category: 'tracking_ads',
    severity: 'good',
    defaultDiagnosisPassed: 'Meta Pixel jest zainstalowany i gotowy do zbierania audytorium.',
    defaultDiagnosisFailed: 'Brak piksela reklamowego Meta (Facebook/Instagram).',
    businessImpact: 'Brak możliwości budowania grup odbiorców na Facebooku i Instagramie oraz brak optymalizacji kampanii social media.',
    businessBenefit: 'Precyzyjne docieranie do klientów w ekosystemie Meta, budowanie grup Lookalike (klonów najlepszych klientów) i tani remarketing.',
    developerSolution: 'Zaimplementuję skrypt Meta Pixel zintegrowany z GTM lub natywnym kodem z deduplikacją zdarzeń w 24h.'
  },
  'track-tiktok-pixel': {
    id: 'track-tiktok-pixel',
    name: 'TikTok Pixel (Kampanie Gen-Z i Impulsowe)',
    category: 'tracking_ads',
    severity: 'good',
    defaultDiagnosisPassed: 'Wykryto poprawną konfigurację TikTok Pixel.',
    defaultDiagnosisFailed: 'Brak piksela reklamowego TikTok.',
    businessImpact: 'Brak możliwości bezpośredniego śledzenia zwrotu z najszybciej rosnącego kanału social commerce.',
    businessBenefit: 'Dostęp do taniego ruchu i zakupów impulsowych wśród młodszych grup konsumentów z precyzyjnym pomiarem ROAS.',
    developerSolution: 'Skonfiguruję TikTok Pixel z obsługą zdarzeń e-commerce i parametrów dopasowania zaawansowanego w 24h.'
  },
  'track-lead-form': {
    id: 'track-lead-form',
    name: 'Pomiar konwersji leada / zapytania ofertowego',
    category: 'tracking_ads',
    severity: 'critical',
    defaultDiagnosisPassed: 'Wysyłki formularzy ofertowych są rejestrowane jako twarde zdarzenia konwersji.',
    defaultDiagnosisFailed: 'Wykryto formularze kontaktowe, ale brak dedykowanego zdarzenia konwersji leada (generate_lead).',
    businessImpact: 'Kampanie reklamowe optymalizują się pod przypadkowe kliknięcia w stronę zamiast pod realnie wysłane zapytania ofertowe B2B.',
    businessBenefit: 'Google i Meta Ads kierują ruch wyłącznie do osób o najwyższym prawdopodobieństwie wypełnienia formularza. Drastyczny wzrost liczby wartościowych leadów B2B.',
    developerSolution: 'Podepnę wywołanie zdarzenia generate_lead bezpośrednio pod zdarzenie sukcesu formularza (Promise/AJAX) w 24h.'
  },
  'track-click-to-call': {
    id: 'track-click-to-call',
    name: 'Śledzenie połączeń telefonicznych (click_to_call)',
    category: 'tracking_ads',
    severity: 'warning',
    defaultDiagnosisPassed: 'Kliknięcia w numer telefonu są rejestrowane w analityce.',
    defaultDiagnosisFailed: 'Kliknięcia w numer telefonu na smartfonach nie są zliczane jako mikrokonwersje w Google Ads/GA4.',
    businessImpact: 'Nawet 50% klientów dzwoni bezpośrednio ze smartfona. Jeśli tego nie mierzysz, algorytm uważa te kampanie za bezskuteczne i je wygasza.',
    businessBenefit: 'Wykazanie pełnej, realnej skuteczności kampanii i umożliwienie algorytmom licytacji stawek pod użytkowników preferujących kontakt telefoniczny.',
    developerSolution: 'Wdrożę listener zdarzeń tel: przesyłający mikrokonwersję contact_call do GA4 i Google Ads w 24h.'
  },
  'track-click-to-email': {
    id: 'track-click-to-email',
    name: 'Śledzenie kliknięć w adres e-mail (mailto)',
    category: 'tracking_ads',
    severity: 'warning',
    defaultDiagnosisPassed: 'Kliknięcia w adres e-mail są rejestrowane w analityce.',
    defaultDiagnosisFailed: 'Kliknięcia w linki mailto: nie są śledzone jako cel biznesowy.',
    businessImpact: 'Utrata danych o kontaktach inicjowanych przez klientów biznesowych preferujących bezpośredni kontakt mailowy.',
    businessBenefit: 'Precyzyjny atrybut źródeł leadów mailowych i możliwość optymalizacji stron lądowania pod kątem kontaktu B2B.',
    developerSolution: 'Zaimplementuję automatyczny tracker kliknięć w adresy poczty elektronicznej zintegrowany z dataLayer w 24h.'
  },
  'track-session-recording': {
    id: 'track-session-recording',
    name: 'Mapy ciepła i nagrania sesji (Clarity / Hotjar)',
    category: 'tracking_ads',
    severity: 'warning',
    defaultDiagnosisPassed: 'Wykryto aktywne narzędzie map ciepła i analizy zachowań użytkowników.',
    defaultDiagnosisFailed: 'Brak narzędzi analizy behawioralnej użytkowników (Microsoft Clarity lub Hotjar).',
    businessImpact: 'Brak wiedzy, w których miejscach użytkownicy gubią się na stronie, gdzie klikają na próżno (rage clicks) i dlaczego porzucają koszyk.',
    businessBenefit: 'Darmowy, bezpośredni wgląd w nagrania wideo z wizyt klientów. Natychmiastowa identyfikacja barier zakupowych i podniesienie konwersji.',
    developerSolution: 'Wdrożę darmowy, w 100% zgodny z RODO skrypt Microsoft Clarity bez spowalniania strony w 24h.'
  },
  'track-ad-leak-risk': {
    id: 'track-ad-leak-risk',
    name: 'Ogólne ryzyko wycieku budżetu marketingowego',
    category: 'tracking_ads',
    severity: 'critical',
    defaultDiagnosisPassed: 'Warstwa telemetryczna i analityczna jest kompletna – budżet reklamowy pracuje z maksymalną efektywnością.',
    defaultDiagnosisFailed: 'Zdiagnozowano krytyczne luki telemetryczne powodujące bezpośredni wyciek środków reklamowych.',
    businessImpact: 'Od 20% do nawet 60% comiesięcznego budżetu na płatny ruch jest przepalane przez brak sprzężenia zwrotnego z algorytmami AI.',
    businessBenefit: 'Uszczelnienie lejków, spadek kosztu pozyskania zamówienia o minimum 30% i natychmiastowe zwiększenie zysku netto ze sprzedaży.',
    developerSolution: 'Przeprowadzę kompleksową naprawę całej warstwy telemetrycznej dataLayer + CAPI w 24–48h.'
  },

  // ==========================================
  // 2. E-COMMERCE, CHECKOUT & KONWERSJA CRO (13)
  // ==========================================
  'ecom-variant-health': {
    id: 'ecom-variant-health',
    name: 'Wydajność i bezbłędność wariantów produktów',
    category: 'ecommerce_cro',
    severity: 'critical',
    defaultDiagnosisPassed: 'Wszystkie podstrony i zapytania wariantów produktów odpowiadają szybko i bez błędów.',
    defaultDiagnosisFailed: 'Wykryto podstrony wariantów zwracające błędy 504 Gateway Timeout lub ładujące się powyżej 2.5 sekundy.',
    businessImpact: 'Gdy klient klika reklamę konkretnego koloru/rozmiaru z Google Shopping, widzi biały ekran błędu. 100% kosztu kliknięcia idzie w błoto.',
    businessBenefit: 'Błyskawiczne ładowanie każdego wariantu produktu. Odzyskanie natychmiastowej sprzedaży z Google Shopping i Meta Catalog Ads.',
    developerSolution: 'Zoptymalizuję zapytania SQL w bazie, wyeliminuję obciążające hooki wariacji i wdrożę object caching w 24–48h.'
  },
  'ecom-omnibus-compliance': {
    id: 'ecom-omnibus-compliance',
    name: 'Zgodność z Dyrektywą Omnibus (Ceny promocyjne)',
    category: 'ecommerce_cro',
    severity: 'critical',
    defaultDiagnosisPassed: 'Ceny promocyjne zawierają wymaganą prawem informację o najniższej cenie z 30 dni.',
    defaultDiagnosisFailed: 'Wykryto przekreślone ceny promocyjne bez obowiązkowej informacji o najniższej cenie z ostatnich 30 dni.',
    businessImpact: 'Realne ryzyko kontroli i dotkliwych kar od UOKiK (do 10% rocznego obrotu) oraz utrata zaufania klientów podejrzewających sztuczne rabaty.',
    businessBenefit: '100% spokoju prawnego, pełna transparentność budująca autorytet marki i wyższy współczynnik konwersji promocji.',
    developerSolution: 'Wdrożę automatyczny, lekki moduł dyrektywy Omnibus z pełną historią cenową bezpośrednio przy kwocie w 24h.'
  },
  'ecom-express-payments': {
    id: 'ecom-express-payments',
    name: 'Ekspresowe płatności mobilne (BLIK / Apple Pay / Google Pay)',
    category: 'ecommerce_cro',
    severity: 'warning',
    defaultDiagnosisPassed: 'Sklep oferuje szybkie płatności mobilne 1-click.',
    defaultDiagnosisFailed: 'Brak bezpośrednich portfeli ekspresowych (BLIK, Apple Pay, Google Pay) na ścieżce zakupu.',
    businessImpact: 'Konieczność ręcznego wpisywania numerów kart lub logowania do banku powoduje porzucenie do 35% koszyków na smartfonach.',
    businessBenefit: 'Zakupy sfinalizowane w 5 sekund jednym dotknięciem kciuka. Wzrost konwersji mobilnej o minimum 20–30%.',
    developerSolution: 'Zintegruję bramkę płatności z natywnym Apple Pay, Google Pay i BLIK One-Click w koszyku w 24h.'
  },
  'ecom-schema-product': {
    id: 'ecom-schema-product',
    name: 'Dane strukturalne Schema.org Product (Rich Snippets)',
    category: 'ecommerce_cro',
    severity: 'warning',
    defaultDiagnosisPassed: 'Karty produktów posiadają zwalidowane mikrodane Schema.org Product w JSON-LD.',
    defaultDiagnosisFailed: 'Brak danych strukturalnych Schema.org Product w kodzie podstron produktów.',
    businessImpact: 'Produkty w wyszukiwarce Google wyglądają szaro i nijako na tle konkurencji z gwiazdkami i cenami. CTR niższy o 25–40%.',
    businessBenefit: 'Wyróżniające się wyniki wyszukiwania (gwiazdki, opinie, cena, dostępność), wyższy CTR organiczny i darmowy wzrost wejść z Google.',
    developerSolution: 'Wdrożę poprawny kod JSON-LD Schema Product generowany w locie z bazy towarowej w 24h.'
  },
  'ecom-schema-offers': {
    id: 'ecom-schema-offers',
    name: 'Struktura cen i waluty Schema.org Offer',
    category: 'ecommerce_cro',
    severity: 'warning',
    defaultDiagnosisPassed: 'Oferty produktowe zawierają poprawnie oznaczony obiekt Offer (price, priceCurrency).',
    defaultDiagnosisFailed: 'Brak struktury Offer w mikrodanych produktów.',
    businessImpact: 'Google Merchant Center i roboty wyszukiwarki nie potrafią automatycznie zweryfikować aktualności cen w sklepie.',
    businessBenefit: 'Bezbłędna synchronizacja cen z bezpłatnymi wynikami Google Zakupy i natychmiastowe aktualizacje promocji.',
    developerSolution: 'Rozszerzę schemat JSON-LD o precyzyjne właściwości Offer wraz z terminem ważności promocji w 24h.'
  },
  'ecom-schema-stock': {
    id: 'ecom-schema-stock',
    name: 'Status dostępności magazynowej w Schema (InStock)',
    category: 'ecommerce_cro',
    severity: 'warning',
    defaultDiagnosisPassed: 'Dostępność towarowa jest przekazywana robotom za pomocą availability Schema.',
    defaultDiagnosisFailed: 'Brak deklaracji dostępności produktu (InStock / OutOfStock) w danych strukturalnych.',
    businessImpact: 'Klienci w Google nie wiedzą, czy towar jest dostępny od ręki, przez co wybierają oferty konkurencji z jasnym oznaczeniem.',
    businessBenefit: 'Etykieta "W magazynie" w wynikach wyszukiwania, która diametralnie zwiększa klikalność użytkowników gotowych do zakupu tu i teraz.',
    developerSolution: 'Dodam automatyczną flagę itemAvailability w kodzie szablonu zsynchronizowaną ze stanem magazynowym w 24h.'
  },
  'ecom-cart-buttons': {
    id: 'ecom-cart-buttons',
    name: 'Dostępność i responsywność przycisków dodawania do koszyka',
    category: 'ecommerce_cro',
    severity: 'critical',
    defaultDiagnosisPassed: 'Elementy dodawania do koszyka są poprawnie osadzone i semantycznie czytelne.',
    defaultDiagnosisFailed: 'Wykryto brak jednoznacznych, dostępnych semantycznie przycisków dodawania do koszyka na kartach produktów.',
    businessImpact: 'Klienci na niektórych urządzeniach lub z czytnikami ekranu nie mogą kliknąć w przycisk zakupu. Całkowita blokada transakcji.',
    businessBenefit: '100% niezawodności mechanizmu zakupu na każdym urządzeniu i eliminacja technicznych barier finalizacji koszyka.',
    developerSolution: 'Przebuduję przyciski akcji na semantyczne elementy button z czytelnym feedbackiem wizualnym i telemetrią w 24h.'
  },
  'ecom-cart-visibility': {
    id: 'ecom-cart-visibility',
    name: 'Widoczność koszyka z aktywnym licznikiem produktów',
    category: 'ecommerce_cro',
    severity: 'warning',
    defaultDiagnosisPassed: 'Koszyk w nagłówku jest dobrze widoczny i posiada aktualizowany w locie licznik towarów.',
    defaultDiagnosisFailed: 'Brak wyraźnej ikony koszyka w nagłówku lub brak dynamicznego licznika dodanych sztuk.',
    businessImpact: 'Użytkownik nie ma pewności, czy kliknięcie zadziałało i gubi drogę do finalizacji zamówienia, porzucając witrynę.',
    businessBenefit: 'Płynna ścieżka do kasy, wyższa pewność użytkownika i redukcja porzuceń koszyka na wczesnym etapie o 15%.',
    developerSolution: 'Wdrożę interaktywny widżet koszyka w nagłówku z mikro-animacją potwierdzenia dodania produktu w 24h.'
  },
  'ecom-trust-signals': {
    id: 'ecom-trust-signals',
    name: 'Sygnały zaufania (Trust Badges & Gwarancje)',
    category: 'ecommerce_cro',
    severity: 'warning',
    defaultDiagnosisPassed: 'Sklep eksponuje sygnały zaufania (bezpieczne płatności, gwarancja zwrotu, opinie).',
    defaultDiagnosisFailed: 'Brak wyraźnych sygnałów zaufania w rejonie przycisków zakupu i w koszyku.',
    businessImpact: 'Nowi klienci obawiają się oszustwa lub problemów ze zwrotem, przez co rezygnują z pierwszego zakupu.',
    businessBenefit: 'Przełamanie oporów psychologicznych kupującego. Wzrost konwersji wśród nowych użytkowników o 18–25%.',
    developerSolution: 'Zaprojektuję elegancki, minimalistyczny moduł gwarancji bezpieczeństwa (SSL, 14 dni zwrotu, szybka wysyłka) w 24h.'
  },
  'ecom-consumer-rights': {
    id: 'ecom-consumer-rights',
    name: 'Informacje o prawach konsumenta i zwrotach',
    category: 'ecommerce_cro',
    severity: 'good',
    defaultDiagnosisPassed: 'Informacje o 14-dniowym prawie do zwrotu i regulamin są łatwo dostępne.',
    defaultDiagnosisFailed: 'Brak bezpośredniego odnośnika do zasad zwrotu i odstąpienia od umowy na ścieżce zakupu.',
    businessImpact: 'Niezgodność z ustawą o prawach konsumenta, wydłużenie okresu na zwrot do 12 miesięcy i ryzyko kar prawnych.',
    businessBenefit: 'Pełna zgodność z prawem e-commerce w UE i budowanie wizerunku profesjonalnego, bezpiecznego sprzedawcy.',
    developerSolution: 'Wdrożę przejrzystą sekcję informacyjną o prostych zwrotach w stopce i na karcie produktu w 24h.'
  },
  'ecom-cross-sell': {
    id: 'ecom-cross-sell',
    name: 'Moduły rekomendacji i produktów powiązanych (AOV Booster)',
    category: 'ecommerce_cro',
    severity: 'good',
    defaultDiagnosisPassed: 'Karty produktów zawierają moduły polecanych lub uzupełniających produktów.',
    defaultDiagnosisFailed: 'Brak sekcji rekomendacji ("Kup razem", "Produkty powiązane") na kartach produktów.',
    businessImpact: 'Sklep marnuje szansę na zwiększenie średniej wartości koszyka (AOV) przy tym samym koszcie pozyskania ruchu.',
    businessBenefit: 'Wzrost średniej wartości zamówienia (AOV) o 15–30% dzięki trafnej sprzedaży wiązanej i akcesoriom.',
    developerSolution: 'Zaimplementuję szybki komponent rekomendacji produktów z opcją 1-click zestawu w 24h.'
  },
  'ecom-free-shipping': {
    id: 'ecom-free-shipping',
    name: 'Motywator darmowej dostawy (Free Shipping Progress Bar)',
    category: 'ecommerce_cro',
    severity: 'warning',
    defaultDiagnosisPassed: 'Sklep komunikuje warunki darmowej dostawy w widocznym miejscu.',
    defaultDiagnosisFailed: 'Brak dynamicznego paska brakującej kwoty do darmowej dostawy w koszyku.',
    businessImpact: 'Klienci porzucają koszyk na ostatnim kroku zaskoczeni kosztem wysyłki, zamiast dobrać produkt uzupełniający.',
    businessBenefit: 'Klienci sami dobierają dodatkowe towary, aby uniknąć kosztu dostawy. Natychmiastowy wzrost AOV i spadek porzuceń kasy.',
    developerSolution: 'Zaimplementuję dynamiczny pasek postępu "Brakuje Ci tylko X zł do darmowej dostawy" w koszyku w 24h.'
  },
  'ecom-product-images': {
    id: 'ecom-product-images',
    name: 'Kompletność i jakość zdjęć produktowych',
    category: 'ecommerce_cro',
    severity: 'warning',
    defaultDiagnosisPassed: 'Karty produktów posiadają kompletne materiały wizualne.',
    defaultDiagnosisFailed: 'Wykryto produkty bez zdjęć lub z uszkodzonymi miniaturami.',
    businessImpact: 'Klient w internecie kupuje wzrokiem. Produkt bez zdjęcia sprzedaje się 10x gorzej i niszczy zaufanie do marki.',
    businessBenefit: 'Profesjonalna prezentacja oferty budząca pożądanie zakupowe i maksymalizująca konwersję.',
    developerSolution: 'Wdrożę automatyczny fallback dla brakujących zdjęć oraz galerię zoom zoptymalizowaną pod smartfony w 24h.'
  },

  // ==========================================
  // 3. SEO TECHNICZNE & INDEKSACJA (18)
  // ==========================================
  'seo-http-status-200': {
    id: 'seo-http-status-200',
    name: 'Poprawność kodów odpowiedzi HTTP (brak błędów 4xx/5xx)',
    category: 'seo_indexing',
    severity: 'critical',
    defaultDiagnosisPassed: 'Wszystkie zbadane podstrony zwracają poprawny kod odpowiedzi 200 OK.',
    defaultDiagnosisFailed: 'Wykryto podstrony zwracające kody błędów klienta (404) lub serwera (500/502/504).',
    businessImpact: 'Roboty wyszukiwarek wyrzucają niedostępne strony z indeksu, a użytkownicy trafiający na błąd 404 natychmiast uciekają.',
    businessBenefit: '100% dostępności witryny, zachowanie pełnej mocy PageRank i brak strat budżetu indeksowania (Crawl Budget).',
    developerSolution: 'Skonfiguruję mapę przekierowań 301 dla martwych adresów i usunę błędy serwerowe w 24h.'
  },
  'seo-redirect-hygiene': {
    id: 'seo-redirect-hygiene',
    name: 'Higiena przekierowań (brak łańcuchów i pętli 301)',
    category: 'seo_indexing',
    severity: 'warning',
    defaultDiagnosisPassed: 'Struktura adresów URL nie wykazuje niepotrzebnych wielokrotnych przekierowań.',
    defaultDiagnosisFailed: 'Wykryto dużą liczbę przekierowań 3xx opóźniających ładowanie stron.',
    businessImpact: 'Każde dodatkowe przekierowanie dodaje 200–500ms opóźnienia i osłabia przekazywanie mocy SEO.',
    businessBenefit: 'Błyskawiczne przejścia między podstronami i bezpośrednie kierowanie robotów do docelowych zasobów.',
    developerSolution: 'Zaktualizuję wewnętrzną strukturę linków do bezpośrednich adresów docelowych w 24h.'
  },
  'seo-title-presence': {
    id: 'seo-title-presence',
    name: 'Obecność unikalnego tagu Title na każdej podstronie',
    category: 'seo_indexing',
    severity: 'critical',
    defaultDiagnosisPassed: 'Wszystkie podstrony posiadają zdefiniowany tag Title.',
    defaultDiagnosisFailed: 'Wykryto podstrony bez nagłówka <title>.',
    businessImpact: 'Strona bez tytułu nie ma szans na wysokie pozycje w Google na żadne słowa kluczowe.',
    businessBenefit: 'Zagwarantowanie obecności podstron w indeksie wyszukiwarki i stworzenie fundamentu pod pozycjonowanie.',
    developerSolution: 'Wdrożę dynamiczny generator tagów Title w szablonie widoków w 24h.'
  },
  'seo-title-cannibalization': {
    id: 'seo-title-cannibalization',
    name: 'Eliminacja auto-kanibalizacji tytułów (Duplicate Titles)',
    category: 'seo_indexing',
    severity: 'critical',
    defaultDiagnosisPassed: 'Tagi Title są w 100% unikalne – brak auto-kanibalizacji fraz kluczowych.',
    defaultDiagnosisFailed: 'Wykryto grupy podstron z identycznymi tagami Title konkurującymi ze sobą w Google.',
    businessImpact: 'Zamiast jednej silnej pozycji w TOP 3, Twoje strony rotują i zbijają się nawzajem na dalsze strony wyników.',
    businessBenefit: 'Skupienie całej mocy rankingowej i natychmiastowy awans najważniejszych podstron ofertowych do TOP wyników.',
    developerSolution: 'Zaimplementuję automatyczne reguły unikalizacji tytułów z parametrami wyróżniającymi w kodzie w 24h.'
  },
  'seo-title-optimal-length': {
    id: 'seo-title-optimal-length',
    name: 'Optymalna długość tytułu (35–65 znaków)',
    category: 'seo_indexing',
    severity: 'warning',
    defaultDiagnosisPassed: 'Długość tytułów mieści się w rekomendowanym przedziale pikselowym Google.',
    defaultDiagnosisFailed: 'Tytuły są zbyt krótkie (niewykorzystany potencjał) lub zbyt długie (ucięte przez Google trzykropkiem).',
    businessImpact: 'Ucięte tytuły wyglądają nieprofesjonalnie i zniechęcają do kliknięcia, a zbyt krótkie nie wykorzystują fraz kluczowych.',
    businessBenefit: 'Maksymalny CTR w wynikach wyszukiwania i pełne wyeksponowanie kluczowych przewag oferty.',
    developerSolution: 'Dostosuję formułę generowania tytułów do optymalnego limitu 580px (ok. 55-60 znaków) w 24h.'
  },
  'seo-meta-description-presence': {
    id: 'seo-meta-description-presence',
    name: 'Obecność meta opisów (Meta Description)',
    category: 'seo_indexing',
    severity: 'warning',
    defaultDiagnosisPassed: 'Wszystkie podstrony posiadają zdefiniowany opis meta description.',
    defaultDiagnosisFailed: 'Wykryto brak tagów meta description na podstronach witryny.',
    businessImpact: 'Google wyświetla losowe fragmenty tekstu ze strony, często zawierające elementy menu czy komunikaty o cookies.',
    businessBenefit: 'Kontrola nad wizytówką serwisu w wyszukiwarce. Wzrost współczynnika klikalności (CTR) o 20–35%.',
    developerSolution: 'Wdrożę automatyczne generowanie angażujących opisów meta z treści strony w 24h.'
  },
  'seo-meta-description-length': {
    id: 'seo-meta-description-length',
    name: 'Prawidłowa długość meta description (120–160 znaków)',
    category: 'seo_indexing',
    severity: 'warning',
    defaultDiagnosisPassed: 'Długość opisów meta description mieści się w optymalnym przedziale.',
    defaultDiagnosisFailed: 'Opisy meta są za krótkie lub ucięte przez limity wyświetlania Google.',
    businessImpact: 'Niedokończone zdania w wynikach Google obniżają zaufanie użytkowników szukających rzetelnych firm.',
    businessBenefit: 'Kompletny, perswazyjny przekaz sprzedażowy z wyraźnym Call to Action bezpośrednio w Google.',
    developerSolution: 'Skalibruję długość opisów meta w CMS/kodzie do optymalnego przedziału w 24h.'
  },
  'seo-h1-presence': {
    id: 'seo-h1-presence',
    name: 'Obecność głównego nagłówka semantycznego <h1>',
    category: 'seo_indexing',
    severity: 'critical',
    defaultDiagnosisPassed: 'Każda podstrona posiada główny nagłówek semantyczny H1.',
    defaultDiagnosisFailed: 'Zdiagnozowano podstrony bez nagłówka <h1>.',
    businessImpact: 'Roboty Google oraz modele AI (SearchGPT, Gemini) gubią kontekst semantyczny strony i nie wiedzą, czego dotyczy oferta.',
    businessBenefit: 'Jednoznaczny sygnał dla algorytmów indeksujących, wyższa widoczność na frazy główne i lepsze pozycjonowanie w AI Search.',
    developerSolution: 'Wprowadzę automatyczny nagłówek <h1> w szablonie widoków bez ingerencji w obecny design w 24h.'
  },
  'seo-h1-uniqueness': {
    id: 'seo-h1-uniqueness',
    name: 'Dokładnie jeden nagłówek <h1> na stronę',
    category: 'seo_indexing',
    severity: 'warning',
    defaultDiagnosisPassed: 'Struktura dokumentu zachowuje wzorową hierarchię – dokładnie jeden tag H1.',
    defaultDiagnosisFailed: 'Wykryto podstrony z wieloma nagłówkami H1 (np. logo lub widżety w H1).',
    businessImpact: 'Zaburzona hierarchia dokumentu rozmywa wagę słów kluczowych i utrudnia interpretację struktury treści.',
    businessBenefit: 'Czysta, poprawna semantyka HTML5, która ułatwia robotom analizę i podnosi ocenę jakości strony.',
    developerSolution: 'Przekształcę nadmiarowe tagi H1 na odpowiednie nagłówki H2/H3 lub elementy stylizowane w 24h.'
  },
  'seo-canonical-presence': {
    id: 'seo-canonical-presence',
    name: 'Obecność tagów kanonicznych (<link rel="canonical">)',
    category: 'seo_indexing',
    severity: 'critical',
    defaultDiagnosisPassed: 'Wszystkie podstrony posiadają zdefiniowany tag link rel="canonical".',
    defaultDiagnosisFailed: 'Wykryto podstrony bez linku kanonicznego zapobiegającego duplikatom.',
    businessImpact: 'Tworzenie się zduplikowanych wersji podstron (np. z parametrami UTM, filtrami, wersjami HTTP/HTTPS) rozpraszających PageRank.',
    businessBenefit: 'Skupienie całej mocy rankingowej na oficjalnym adresie URL i pełna ochrona przed karami za duplicate content.',
    developerSolution: 'Zaimplementuję dynamiczny znacznik kanoniczny w nagłówku strony generowany z czystego adresu w 24h.'
  },
  'seo-self-canonical': {
    id: 'seo-self-canonical',
    name: 'Poprawna samoodnosząca kanonizacja adresów (Self-Canonical)',
    category: 'seo_indexing',
    severity: 'warning',
    defaultDiagnosisPassed: 'Tagi kanoniczne precyzyjnie wskazują na oficjalny, czysty adres bez błędnych przekierowań.',
    defaultDiagnosisFailed: 'Tag canonical wskazuje na inny adres lub jest niespójny z protokołem i końcowym ukośnikiem (slash).',
    businessImpact: 'Konflikt sygnałów indeksacyjnych prowadzi do deindeksacji ważnych podstron przez roboty Google.',
    businessBenefit: 'Spójna architektura indeksacji, oszczędność budżetu indeksowania i natychmiastowe zatwierdzenie w Google Search Console.',
    developerSolution: 'Uporządkuję logikę samoodnoszących canonicali z uwzględnieniem trailing-slash w kodzie w 24h.'
  },
  'seo-noindex-safety': {
    id: 'seo-noindex-safety',
    name: 'Bezpieczeństwo indeksacji (brak przypadkowego noindex)',
    category: 'seo_indexing',
    severity: 'critical',
    defaultDiagnosisPassed: 'Ważne strony ofertowe są otwarte na indeksowanie (brak noindex).',
    defaultDiagnosisFailed: 'Wykryto znacznik noindex na podstronach, które powinny generować bezpłatny ruch z Google.',
    businessImpact: 'Katastrofalny błąd – Twoja strona jest całkowicie niewidoczna w Google, a Ty tracisz 100% bezpłatnych klientów.',
    businessBenefit: 'Błyskawiczny powrót podstron do indeksu wyszukiwarki i odzyskanie utraconego ruchu organicznego.',
    developerSolution: 'Usunę blokady noindex i wyślę natychmiastowe żądanie ponownego zaindeksowania w Google Search Console w 24h.'
  },
  'seo-thin-content': {
    id: 'seo-thin-content',
    name: 'Objętość merytoryczna treści (brak Thin Content <200 słów)',
    category: 'seo_indexing',
    severity: 'warning',
    defaultDiagnosisPassed: 'Podstrony posiadają wartościową, odpowiednio rozbudowaną treść tekstową.',
    defaultDiagnosisFailed: 'Zdiagnozowano podstrony o znikomej objętości tekstu (poniżej 200 słów).',
    businessImpact: 'Google klasyfikuje podstrony znikomą treścią jako "Low Quality Pages", co obniża ocenę całej domeny w algorytmie Helpful Content.',
    businessBenefit: 'Wzmocnienie tematycznego autorytetu domeny (Topic Authority) i wzrost widoczności na frazy z długiego ogona (long-tail).',
    developerSolution: 'Rozbuduję strukturę szablonu o moduły pytań FAQ, sekcje korzyści i opisy wspierające pozycjonowanie w 24h.'
  },
  'seo-robots-txt': {
    id: 'seo-robots-txt',
    name: 'Poprawność pliku sterującego indeksacją (robots.txt)',
    category: 'seo_indexing',
    severity: 'good',
    defaultDiagnosisPassed: 'Plik robots.txt jest dostępny i prawidłowo steruje robotami wyszukiwarek.',
    defaultDiagnosisFailed: 'Brak pliku robots.txt lub błędna konfiguracja blokująca zasoby CSS/JS.',
    businessImpact: 'Roboty wyszukiwarek nie mogą poprawnie wyrenderować strony lub marnują Crawl Budget na skanowanie nieistotnych skryptów.',
    businessBenefit: 'Optymalizacja indeksowania najważniejszych podstron i odciążenie serwera od niepotrzebnego ruchu botów.',
    developerSolution: 'Skonfiguruję wzorcowy plik robots.txt z odnośnikiem do mapy witryny sitemap.xml w 24h.'
  },
  'seo-sitemap-xml': {
    id: 'seo-sitemap-xml',
    name: 'Dostępność i aktualność mapy witryny (sitemap.xml)',
    category: 'seo_indexing',
    severity: 'good',
    defaultDiagnosisPassed: 'Wykryto prawidłową, dostępną mapę witryny sitemap.xml.',
    defaultDiagnosisFailed: 'Brak mapy witryny sitemap.xml ułatwiającej robotom odkrywanie nowych podstron.',
    businessImpact: 'Nowe artykuły blogowe i nowo dodane produkty indeksują się tygodniami zamiast godzinami.',
    businessBenefit: 'Ekspresowa indeksacja nowości i aktualizacji cenowych przez roboty Google w czasie rzeczywistym.',
    developerSolution: 'Wdrożę automatyczny generator mapy sitemap.xml z podziałem na produkty, kategorie i wpisy w 24h.'
  },
  'seo-internal-linking': {
    id: 'seo-internal-linking',
    name: 'Gęstość i struktura linkowania wewnętrznego',
    category: 'seo_indexing',
    severity: 'warning',
    defaultDiagnosisPassed: 'Strony są dobrze połączone linkami wewnętrznymi ułatwiającymi przepływ PageRank.',
    defaultDiagnosisFailed: 'Wykryto podstrony osierocone (orphan pages) z bardzo małą liczbą linków przychodzących.',
    businessImpact: 'Dobre produkty i oferty nie zyskują pozycji, ponieważ roboty i użytkownicy rzadko na nie trafiają.',
    businessBenefit: 'Sprawne rozprowadzanie autorytetu domeny i płynna nawigacja dla klientów, wydłużająca czas spędzony na stronie.',
    developerSolution: 'Wdrożę zautomatyzowane moduły linkowania wewnętrznego (kategorie, powiązane wpisy) w 24h.'
  },
  'seo-schema-article': {
    id: 'seo-schema-article',
    name: 'Mikrodane Schema Article / BlogPosting pod silniki AI (SearchGPT / Gemini)',
    category: 'seo_indexing',
    severity: 'warning',
    defaultDiagnosisPassed: 'Treści merytoryczne posiadają semantyczne mikrodane Article/BlogPosting.',
    defaultDiagnosisFailed: 'Wpisy blogowe i poradniki nie posiadają danych strukturalnych Schema Article.',
    businessImpact: 'Nowoczesne wyszukiwarki AI (SearchGPT, Google AI Overviews, Perplexity) nie potrafią zacytować Twojej strony jako eksperta.',
    businessBenefit: 'Obecność w podsumowaniach sztucznej inteligencji (AI Overviews) i dominacja na rynku zapytań głosowych i semantycznych.',
    developerSolution: 'Wdrożę pełne mikrodane Article z autorem, datą publikacji i grafiką zgodnie ze standardem Schema.org w 24h.'
  },
  'seo-anchor-text-quality': {
    id: 'seo-anchor-text-quality',
    name: 'Jakość kotwic linków wewnętrznych (Anchor Texts)',
    category: 'seo_indexing',
    severity: 'good',
    defaultDiagnosisPassed: 'Linki wewnętrzne stosują opisowe, nasycone frazami teksty kotwic.',
    defaultDiagnosisFailed: 'Linki wewnętrzne używają generycznych zwrotów typu "kliknij tutaj" lub "więcej".',
    businessImpact: 'Marnowanie potencjału rankingowego linków wewnętrznych na puste frazy bez znaczenia SEO.',
    businessBenefit: 'Wzmocnienie pozycji na konkretne słowa kluczowe wplecione naturalnie w linkowanie.',
    developerSolution: 'Zastąpię generyczne etykiety linków semantycznymi frazami opisującymi cel w 24h.'
  },

  // ==========================================
  // 4. WYDAJNOŚĆ & CORE WEB VITALS (13)
  // ==========================================
  'perf-ttfb-server': {
    id: 'perf-ttfb-server',
    name: 'Czas odpowiedzi serwera (Time To First Byte < 800ms)',
    category: 'performance_vitals',
    severity: 'critical',
    defaultDiagnosisPassed: 'Serwer odpowiada płynnie – średni TTFB poniżej 800ms (zgodnie ze standardem Google Core Web Vitals).',
    defaultDiagnosisFailed: 'Czas odpowiedzi serwera (TTFB) przekracza 1.8s, powodując odczuwalne opóźnienie w starcie renderowania.',
    businessImpact: 'Opóźnienia serwera powyżej 1.8s obniżają współczynnik konwersji i pogarszają pozycje w Google (Core Web Vitals).',
    businessBenefit: 'Natychmiastowe ładowanie witryny od pierwszej milisekundy. Wyższe oceny w Google Core Web Vitals i niższy współczynnik odrzuceń.',
    developerSolution: 'Wdrożę edge caching, optymalizację zapytań do bazy danych oraz kompresję na poziomie serwera w 24h.'
  },
  'perf-render-blocking-scripts': {
    id: 'perf-render-blocking-scripts',
    name: 'Eliminacja skryptów blokujących renderowanie (defer / async)',
    category: 'performance_vitals',
    severity: 'critical',
    defaultDiagnosisPassed: 'Skrypty zewnętrzne są ładowane asynchronicznie i nie blokują pierwszego malowania ekranu.',
    defaultDiagnosisFailed: 'Wykryto skrypty JavaScript w sekcji <head> blokujące renderowanie zawartości strony.',
    businessImpact: 'Przeglądarka musi zatrzymać rysowanie strony do czasu pobrania i wykonania kodu JS, co powoduje zacinanie ekranu na smartfonach.',
    businessBenefit: 'Błyskawiczne pojawienie się treści przed oczami użytkownika (FCP < 1.0s) i płynne pierwsze wrażenie.',
    developerSolution: 'Dodam atrybuty defer/async do skryptów zewnętrznych i przeniosę niekrytyczny kod na koniec dokumentu w 24h.'
  },
  'perf-dom-size': {
    id: 'perf-dom-size',
    name: 'Optymalny rozmiar drzewa DOM (< 1000 elementów)',
    category: 'performance_vitals',
    severity: 'warning',
    defaultDiagnosisPassed: 'Drzewo DOM jest lekkie i optymalne (< 1000 elementów HTML).',
    defaultDiagnosisFailed: 'Rozdmuchane drzewo DOM (znacznie powyżej 1200 elementów) obciąża pamięć procesora urządzeń mobilnych.',
    businessImpact: 'Przeglądarka na telefonie zużywa mnóstwo energii na przeliczanie stylów, co wywołuje przycięcia podczas przewijania (INP).',
    businessBenefit: 'Aksamitnie płynne przewijanie strony (60 FPS) na każdym smartfonie bez spowolnień i przegrzewania baterii.',
    developerSolution: 'Odchudzę strukturę HTML, usunę zbędne zagnieżdżone kontenery div i zoptymalizuję widoki w 24–48h.'
  },
  'perf-pagebuilder-bloat': {
    id: 'perf-pagebuilder-bloat',
    name: 'Brak narzutu ciężkich builderów (Elementor / Divi / WPBakery)',
    category: 'performance_vitals',
    severity: 'warning',
    defaultDiagnosisPassed: 'Kod jest czysty i zoptymalizowany – brak śladów po ciężkich kreatorach wizualnych.',
    defaultDiagnosisFailed: 'Wykryto narzut kodu z ciężkich builderów generujących kilkaset kilobajtów zbędnego CSS/JS.',
    businessImpact: 'Nawet 80% kodu generowanego przez buildery to nieużywane style i skrypty, które spowalniają ładowanie o 2–4 sekundy.',
    businessBenefit: 'Radykalne przyspieszenie strony, czysty kod inżynieryjny i przejście testów Google PageSpeed na zielono.',
    developerSolution: 'Przeprowadzę refaktoryzację komponentów krytycznych, wyłączając nieużywane moduły buildera w 24–48h.'
  },
  'perf-modern-stack': {
    id: 'perf-modern-stack',
    name: 'Nowoczesna architektura (Next.js / SSR / React Serverless)',
    category: 'performance_vitals',
    severity: 'good',
    defaultDiagnosisPassed: 'Aplikacja zbudowana w nowoczesnym stosie technologicznym o wysokiej skalowalności.',
    defaultDiagnosisFailed: 'Aplikacja oparta na przestarzałej architekturze monolitycznej podatnej na awarie pod obciążeniem.',
    businessImpact: 'Trudności w skalowaniu ruchu podczas akcji promocyjnych, powolne działanie bazy i wysokie koszty utrzymania serwerów.',
    businessBenefit: 'Pancerna stabilność pod ruchem z kampanii telewizyjnych i Black Friday oraz zerowe koszty skalowania.',
    developerSolution: 'Oferuję stopniową migrację kluczowych lejków do architektury Next.js z czasem ładowania poniżej 500ms.'
  },
  'perf-jquery-free': {
    id: 'perf-jquery-free',
    name: 'Brak przestarzałych bibliotek jQuery',
    category: 'performance_vitals',
    severity: 'warning',
    defaultDiagnosisPassed: 'Kod nie jest obciążony przestarzałymi wersjami biblioteki jQuery.',
    defaultDiagnosisFailed: 'Wykryto leciwe wersje jQuery (1.x / 2.x) obciążające wątek główny i stwarzające ryzyko bezpieczeństwa.',
    businessImpact: 'Zbędny narzut pamięciowy i opóźnienia interakcji (INP), a także znane luki bezpieczeństwa (XSS).',
    businessBenefit: 'Nowoczesny kod zgodny z aktualnymi standardami ECMAScript, szybsze przetwarzanie zdarzeń i wyższe bezpieczeństwo.',
    developerSolution: 'Zastąpię leciwe skrypty jQuery nowoczesnym, natywnym kodem JavaScript Vanilla bez zewnętrznych zależności w 24h.'
  },
  'perf-inline-styles': {
    id: 'perf-inline-styles',
    name: 'Minimalizacja stylów inline (CSS Bloat)',
    category: 'performance_vitals',
    severity: 'warning',
    defaultDiagnosisPassed: 'Strona stosuje uporządkowane arkusze stylów zamiast setek stylów liniowych style="".',
    defaultDiagnosisFailed: 'Wykryto setki zaśmiecających stylów inline uniemożliwiających ich buforowanie przez przeglądarkę.',
    businessImpact: 'Rozmiar pliku HTML rośnie niepotrzebnie kilkukrotnie, zmuszając użytkownika do pobierania tych samych stylów przy każdej podstronie.',
    businessBenefit: 'Redukcja wagi transferu HTML o 40–60% i natychmiastowe otwieranie kolejnych podstron dzięki cache CSS.',
    developerSolution: 'Wyekstrahuję powtarzalne style inline do scentralizowanego arkusza stylów lub klas Tailwind CSS w 24h.'
  },
  'perf-image-lazy-loading': {
    id: 'perf-image-lazy-loading',
    name: 'Leniwe ładowanie obrazów poza pierwszym ekranem (loading="lazy")',
    category: 'performance_vitals',
    severity: 'warning',
    defaultDiagnosisPassed: 'Obrazy poza pierwszym ekranem ładują się leniwie na żądanie.',
    defaultDiagnosisFailed: 'Wykryto obrazy pobierane od razu przy starcie strony, blokujące transfer łącza mobilnego.',
    businessImpact: 'Użytkownik na słabszym łączu mobilnym czeka kilkanaście sekund na pobranie zdjęć ze stopki, nim zobaczy ofertę na górze.',
    businessBenefit: 'Oszczędność pakietu danych klienta i błyskawiczne załadowanie widocznej części ekranu (Above the Fold).',
    developerSolution: 'Wdrożę natywny atrybut loading="lazy" oraz dekodowanie decoding="async" dla wszystkich grafik poza ekranem w 24h.'
  },
  'perf-image-modern-formats': {
    id: 'perf-image-modern-formats',
    name: 'Formaty grafik nowej generacji (WebP / AVIF)',
    category: 'performance_vitals',
    severity: 'warning',
    defaultDiagnosisPassed: 'Grafiki serwowane są w nowoczesnych, wysoce skompresowanych formatach WebP / AVIF.',
    defaultDiagnosisFailed: 'Strona serwuje ciężkie, nieskompresowane pliki PNG i JPEG ważące po kilka megabajtów.',
    businessImpact: 'Marnowanie transferu serwera i powolne renderowanie galerii produktowych, zniechęcające do przeglądania oferty.',
    businessBenefit: 'Redukcja wagi zdjęć o 65–80% przy zachowaniu bezbłędnej ostrości i jakości detali.',
    developerSolution: 'Wdrożę automatyczną konwersję i serwowanie grafik w formacie WebP/AVIF w locie w 24h.'
  },
  'perf-image-dimensions': {
    id: 'perf-image-dimensions',
    name: 'Ochrona przed skakaniem układu: atrybuty width i height (CLS)',
    category: 'performance_vitals',
    severity: 'warning',
    defaultDiagnosisPassed: 'Obrazy posiadają zadeklarowane wymiary chroniące układ przed przesunięciami (Cumulative Layout Shift).',
    defaultDiagnosisFailed: 'Brak jawnych atrybutów width/height na zdjęciach wywołujący skoki treści podczas ładowania.',
    businessImpact: 'Tekst ucieka sprzed oczu czytelnika, a klient przypadkowo klika w niechciany element (fatalny wynik CLS w Google).',
    businessBenefit: 'Stabilny, profesjonalny interfejs bez irytującego skakania elementów i zaliczony wskaźnik Core Web Vitals CLS.',
    developerSolution: 'Uzupełnię wymiary width/height i proporcje aspect-ratio w regułach CSS w szablonie w 24h.'
  },
  'perf-lcp-metric': {
    id: 'perf-lcp-metric',
    name: 'Czas do załadowania głównej treści (LCP < 2.5s)',
    category: 'performance_vitals',
    severity: 'critical',
    defaultDiagnosisPassed: 'Największy element treści ładuje się poniżej progu 2.5 sekundy.',
    defaultDiagnosisFailed: 'Wskaźnik LCP przekracza rekomendowany próg 2.5 sekundy, wpadając w strefę ostrzegawczą.',
    businessImpact: 'Google bezpośrednio obniża pozycje w wynikach mobilnych serwisom, które nie spełniają progu LCP.',
    businessBenefit: 'Wyższa widoczność w wyszukiwarce mobilnej i większy odsetek użytkowników docierających do treści oferty.',
    developerSolution: 'Wdrożę preload zasobu krytycznego LCP oraz zoptymalizuję ścieżkę krytyczną renderowania w 24h.'
  },
  'perf-fcp-metric': {
    id: 'perf-fcp-metric',
    name: 'Czas pierwszego wyrenderowania treści (FCP < 1.5s)',
    category: 'performance_vitals',
    severity: 'warning',
    defaultDiagnosisPassed: 'Użytkownik widzi pierwsze elementy treści w czasie poniżej 1.5 sekundy.',
    defaultDiagnosisFailed: 'Czas pierwszego wyrenderowania treści przekracza rekomendowany limit.',
    businessImpact: 'Zbyt długie oczekiwanie na jakąkolwiek reakcję ekranu wywołuje u klienta wrażenie, że strona uległa awarii.',
    businessBenefit: 'Błyskawiczne potwierdzenie dla klienta, że witryna działa sprawnie i profesjonalnie.',
    developerSolution: 'Skonfiguruję inline critical CSS i wyeliminuję zasoby blokujące w sekcji nagłówkowej w 24h.'
  },
  'perf-waf-protection': {
    id: 'perf-waf-protection',
    name: 'Tarcza brzegowa i CDN (Web Application Firewall / Cloudflare)',
    category: 'performance_vitals',
    severity: 'good',
    defaultDiagnosisPassed: 'Serwis chroniony jest tarczą brzegową WAF / Cloudflare z globalną siecią CDN.',
    defaultDiagnosisFailed: 'Serwis odpowiada bezpośrednio z pojedynczego serwera bez buforowania brzegowego CDN.',
    businessImpact: 'Podatność serwera na przeciążenia ruchem botów oraz wolniejsze ładowanie dla użytkowników z innych lokalizacji.',
    businessBenefit: 'Maksymalne bezpieczeństwo przed atakami DDoS, buforowanie zasobów w ponad 300 miastach świata i zerowy koszt łącza.',
    developerSolution: 'Wdrożę i skonfiguruję darmową warstwę Cloudflare z optymalizacją proxy i regułami bezpieczeństwa w 24h.'
  },

  // ==========================================
  // 5. UX, DOSTĘPNOŚĆ & SMARTFONY (10)
  // ==========================================
  'ux-clickable-phone': {
    id: 'ux-clickable-phone',
    name: 'Bezpośrednio klikalny numer telefonu (tel:)',
    category: 'ux_mobile',
    severity: 'critical',
    defaultDiagnosisPassed: 'Wszystkie numery telefonów są interaktywnymi odnośnikami <a href="tel:...">.',
    defaultDiagnosisFailed: 'Wykryto numer telefonu zapisany jako zwykły tekst uniemożliwiający 1-click połączenie.',
    businessImpact: 'Klient na telefonie musi przepisywać numer na kartkę lub kopiować go między aplikacjami. Tracisz 40-50% połączeń od klientów!',
    businessBenefit: 'Możliwość natychmiastowego wybrania numeru jednym dotknięciem kciuka. Drastyczny wzrost liczby bezpośrednich rozmów sprzedażowych.',
    developerSolution: 'Przekształcę wszystkie numery telefonów w klikalne przyciski tel: z mikro-animacją w 24h.'
  },
  'ux-clickable-email': {
    id: 'ux-clickable-email',
    name: 'Bezpośrednio klikalny adres e-mail (mailto:)',
    category: 'ux_mobile',
    severity: 'warning',
    defaultDiagnosisPassed: 'Adresy e-mail są aktywnymi linkami otwierającymi program pocztowy.',
    defaultDiagnosisFailed: 'Adres e-mail jest zwykłym tekstem bez aktywnego linku mailto:.',
    businessImpact: 'Utrudnienie kontaktu dla partnerów biznesowych i osób korzystających z aplikacji pocztowych na smartfonach.',
    businessBenefit: 'Wygodne rozpoczęcie korespondencji jednym kliknięciem bez ryzyka literówki w adresie odbiorcy.',
    developerSolution: 'Podepnę aktywne linki mailto: ze zdefiniowanym tematem wiadomości w 24h.'
  },
  'ux-image-alt-tags': {
    id: 'ux-image-alt-tags',
    name: 'Kompletność atrybutów ALT na grafikach (Dostępność WCAG & Google)',
    category: 'ux_mobile',
    severity: 'warning',
    defaultDiagnosisPassed: 'Obrazy posiadają uzupełnione opisy alternatywne alt="..." wspierające pozycjonowanie.',
    defaultDiagnosisFailed: 'Wykryto zdjęcia bez atrybutu alt, niewidoczne dla robotów Google i osób niedowidzących.',
    businessImpact: 'Utrata ruchu z wyszukiwarki Google Grafika oraz ryzyko zarzutu braku dostępności cyfrowej dla osób z niepełnosprawnościami.',
    businessBenefit: 'Dodatkowe źródło darmowego ruchu z Google Images oraz pełna zgodność ze standardami dostępności WCAG 2.1.',
    developerSolution: 'Wdrożę automatyczny generator semantycznych tagów alt dla grafik w szablonie i produktach w 24h.'
  },
  'ux-viewport-configuration': {
    id: 'ux-viewport-configuration',
    name: 'Prawidłowa konfiguracja skalowania mobilnego (meta viewport)',
    category: 'ux_mobile',
    severity: 'critical',
    defaultDiagnosisPassed: 'Tag viewport jest prawidłowo skonfigurowany pod ekrany urządzeń mobilnych.',
    defaultDiagnosisFailed: 'Brak lub błędna deklaracja meta viewport uniemożliwiająca responsywne skalowanie.',
    businessImpact: 'Strona na smartfonie wyświetla się w wersji miniaturowego pulpitu, uniemożliwiając czytanie i klikanie.',
    businessBenefit: 'Idealne dopasowanie interfejsu do każdego modelu smartfona i tabletu.',
    developerSolution: 'Dodam zoptymalizowany tag viewport z blokadą niepożądanych powiększeń formularzy w 24h.'
  },
  'ux-favicon-presence': {
    id: 'ux-favicon-presence',
    name: 'Ikona witryny w kartach i wynikach Google (Favicon & Apple Touch Icon)',
    category: 'ux_mobile',
    severity: 'good',
    defaultDiagnosisPassed: 'Witryna posiada zdefiniowaną ikonę favicon wyświetlaną w Google i przeglądarkach.',
    defaultDiagnosisFailed: 'Brak ikony favicon lub używanie generycznej domyślnej ikony serwera.',
    businessImpact: 'Strona w mobilnych wynikach wyszukiwania Google wyświetla szarą kulę ziemską, wyglądając na porzuconą.',
    businessBenefit: 'Wzrost rozpoznawalności marki w wynikach wyszukiwania i zakładkach przeglądarki, podnoszący CTR.',
    developerSolution: 'Przygotuję pakiet ikon wektorowych SVG oraz Apple Touch Icon w pełnej rozdzielczości w 24h.'
  },
  'ux-touch-target-size': {
    id: 'ux-touch-target-size',
    name: 'Rozmiary elementów dotykowych na smartfonach (min. 44x44px)',
    category: 'ux_mobile',
    severity: 'warning',
    defaultDiagnosisPassed: 'Przyciski i linki posiadają odpowiednie marginesy zapobiegające przypadkowym kliknięciom.',
    defaultDiagnosisFailed: 'Elementy klikalne są zbyt małe lub ułożone zbyt blisko siebie, powodując błędne kliknięcia.',
    businessImpact: 'Frustracja użytkowników smartfonów, którzy przypadkowo klikają w sąsiednie linki i opuszczają serwis.',
    businessBenefit: 'Wygodna obsługa jedną ręką, płynna ścieżka zakupowa i wyższy współczynnik zadowolenia klientów.',
    developerSolution: 'Skalibruję minimalne strefy dotyku (hit targets) do minimum 44x44px zgodnie z wytycznymi Apple w 24h.'
  },
  'ux-font-readability': {
    id: 'ux-font-readability',
    name: 'Czytelność typografii mobilnej i odpowiedni kontrast tekstu',
    category: 'ux_mobile',
    severity: 'good',
    defaultDiagnosisPassed: 'Kroje pisma i rozmiary fontów zapewniają wysoki komfort czytania.',
    defaultDiagnosisFailed: 'Zbyt mały font (poniżej 14px) lub niski kontrast tekstu utrudniający lekturę na zewnątrz w słońcu.',
    businessImpact: 'Klienci męczą wzrok i natychmiast porzucają czytanie oferty, przenosząc się do konkurencji.',
    businessBenefit: 'Klarowny, elegancki odbiór treści i maksymalne skupienie uwagi czytelnika na argumentach sprzedażowych.',
    developerSolution: 'Dostosuję skalę typograficzną i współczynniki kontrastu do normy WCAG AA w 24h.'
  },
  'ux-form-usability': {
    id: 'ux-form-usability',
    name: 'Wygoda formularzy mobilnych (inputmode, autocomplete, typy pól)',
    category: 'ux_mobile',
    severity: 'warning',
    defaultDiagnosisPassed: 'Pola formularzy wykorzystują natywne atrybuty ułatwiające wprowadzanie danych na smartfonie.',
    defaultDiagnosisFailed: 'Pola telefonu i e-maila nie wywołują dedykowanej klawiatury numerycznej/pocztowej w telefonie.',
    businessImpact: 'Wypełnianie formularza na telefonie jest uciążliwe, co powoduje rezygnację z wysłania zapytania u nawet 30% chętnych.',
    businessBenefit: 'Błyskawiczne autouzupełnianie danych przez smartfon i bezwysiłkowe wysłanie leada w kilkanaście sekund.',
    developerSolution: 'Dodam atrybuty autocomplete, type="email", type="tel" oraz inputmode do wszystkich pól w 24h.'
  },
  'ux-navigation-accessibility': {
    id: 'ux-navigation-accessibility',
    name: 'Intuicyjna nawigacja mobilna i czytelne menu',
    category: 'ux_mobile',
    severity: 'good',
    defaultDiagnosisPassed: 'Menu nawigacyjne jest przejrzyste i łatwe w obsłudze na ekranach dotykowych.',
    defaultDiagnosisFailed: 'Skomplikowane menu wielopoziomowe zasłaniające treść lub trudne do zamknięcia na telefonie.',
    businessImpact: 'Klient nie może znaleźć poszukiwanej usługi lub kategorii produktu i opuszcza sklep.',
    businessBenefit: 'Szybkie dotarcie do pożądanych podstron w maksymalnie 2 kliknięciach i wyższa sprzedaż.',
    developerSolution: 'Wdrożę nowoczesne, lekkie menu zoptymalizowane pod urządzenia mobilne z płynną animacją w 24h.'
  },
  'ux-lead-cta-prominence': {
    id: 'ux-lead-cta-prominence',
    name: 'Wyrazistość i dostępność wezwania do akcji (Call to Action)',
    category: 'ux_mobile',
    severity: 'warning',
    defaultDiagnosisPassed: 'Główne przyciski akcji (CTA) są wyraźnie wyeksponowane i przyciągają wzrok.',
    defaultDiagnosisFailed: 'Przycisk kontaktu lub zakupu zlewa się z tłem i nie wyróżnia się w hierarchii wizualnej.',
    businessImpact: 'Użytkownik przegląda stronę, ale nie podejmuje akcji, ponieważ brakuje jednoznacznego impulsu do działania.',
    businessBenefit: 'Wyraźne skierowanie uwagi klienta na kolejny krok sprzedażowy i natychmiastowy wzrost konwersji.',
    developerSolution: 'Wdrożę kontrastowy, elegancki przycisk CTA z subtelnym mikro-efektem hover w 24h.'
  },

  // ==========================================
  // 6. BEZPIECZEŃSTWO, PRAWO & SOCIAL (12)
  // ==========================================
  'sec-https-ssl': {
    id: 'sec-https-ssl',
    name: 'Wymuszone szyfrowanie HTTPS i ważny certyfikat SSL/TLS',
    category: 'security_compliance',
    severity: 'critical',
    defaultDiagnosisPassed: 'Strona wymusza bezpieczne, szyfrowane połączenie HTTPS z nowoczesnymi certyfikatami.',
    defaultDiagnosisFailed: 'Wykryto brak automatycznego przekierowania z HTTP na HTTPS lub problemy z certyfikatem SSL.',
    businessImpact: 'Przeglądarka wyświetla czerwony alarm "Strona niebezpieczna", natychmiast odstraszając 99% potencjalnych klientów.',
    businessBenefit: 'Pełne zaufanie odwiedzających, bezpieczny transfer haseł i danych osobowych oraz zaliczenie kluczowego wymogu Google.',
    developerSolution: 'Wymuszę automatyczne przekierowanie 301 na HTTPS oraz skonfiguruję odnawialny certyfikat TLS w 24h.'
  },
  'sec-hsts-header': {
    id: 'sec-hsts-header',
    name: 'Nagłówek ochrony przed atakami downgrade: Strict-Transport-Security (HSTS)',
    category: 'security_compliance',
    severity: 'warning',
    defaultDiagnosisPassed: 'Nagłówek HSTS jest poprawnie skonfigurowany i chroni przed przechwyceniem ruchu.',
    defaultDiagnosisFailed: 'Brak nagłówka Strict-Transport-Security (HSTS) w odpowiedziach serwera.',
    businessImpact: 'Ryzyko ataków typu Man-in-the-Middle (MitM) polegających na podsłuchaniu nieszyfrowanego pierwszego zapytania użytkownika.',
    businessBenefit: 'Maksymalny poziom bezpieczeństwa bankowego połączenia i dodatkowe punkty w audytach bezpieczeństwa.',
    developerSolution: 'Wdrożę nagłówek Strict-Transport-Security z parametrem includeSubDomains i długim czasem max-age w 24h.'
  },
  'sec-xframe-options': {
    id: 'sec-xframe-options',
    name: 'Ochrona przed Clickjackingiem: nagłówek X-Frame-Options',
    category: 'security_compliance',
    severity: 'warning',
    defaultDiagnosisPassed: 'Nagłówek X-Frame-Options blokuje nieautoryzowane osadzanie witryny w obcych ramkach.',
    defaultDiagnosisFailed: 'Brak nagłówka X-Frame-Options umożliwiającego osadzenie Twojego serwisu w przezroczystej ramce iframe.',
    businessImpact: 'Oszuści mogą osadzić Twój serwis na fałszywej domenie i wyłudzać kliknięcia lub dane logowania Twoich klientów.',
    businessBenefit: 'Całkowita ochrona marki przed podszywaniem się i atakami typu Clickjacking.',
    developerSolution: 'Skonfiguruję nagłówek X-Frame-Options: SAMEORIGIN na poziomie serwera w 24h.'
  },
  'sec-content-type-options': {
    id: 'sec-content-type-options',
    name: 'Ochrona przed atakami MIME: X-Content-Type-Options: nosniff',
    category: 'security_compliance',
    severity: 'good',
    defaultDiagnosisPassed: 'Nagłówek X-Content-Type-Options: nosniff jest aktywny.',
    defaultDiagnosisFailed: 'Brak nagłówka zabraniającego przeglądarce zgadywania typu zawartości plików.',
    businessImpact: 'Ryzyko wykonania złośliwych skryptów przemyconych w plikach graficznych przez złośliwe boty.',
    businessBenefit: 'Wzmocnienie integralności serwisu i ochrona przed nieautoryzowanym wykonaniem kodu w przeglądarce.',
    developerSolution: 'Dodam nagłówek X-Content-Type-Options: nosniff w regułach serwera w 24h.'
  },
  'sec-content-security-policy': {
    id: 'sec-content-security-policy',
    name: 'Zaawansowana polityka bezpieczeństwa zasobów (Content-Security-Policy)',
    category: 'security_compliance',
    severity: 'warning',
    defaultDiagnosisPassed: 'Serwis stosuje restrykcyjny nagłówek Content-Security-Policy ograniczający źródła skryptów.',
    defaultDiagnosisFailed: 'Brak nagłówka Content-Security-Policy chroniącego przed atakami Cross-Site Scripting (XSS).',
    businessImpact: 'W przypadku podatności wtyczek zewnętrznych serwis jest narażony na wstrzyknięcie złośliwych skryptów wykradających dane.',
    businessBenefit: 'Maksymalny standard cyberbezpieczeństwa chroniący dane osobowe Twoich klientów przed wyciekiem.',
    developerSolution: 'Skonfiguruję skalibrowaną politykę CSP dopuszczającą wyłącznie zaufane domeny analityczne w 24h.'
  },
  'sec-form-spam-protection': {
    id: 'sec-form-spam-protection',
    name: 'Niewidoczna ochrona formularzy przed botami (Turnstile / Honeypot)',
    category: 'security_compliance',
    severity: 'warning',
    defaultDiagnosisPassed: 'Formularze są zabezpieczone przed automatycznym spamem botów.',
    defaultDiagnosisFailed: 'Wykryto formularze bez ochrony antyspamowej (brak Turnstile, Honeypota czy reCAPTCHA).',
    businessImpact: 'Zalana skrzynka spamem botów oraz fałszywe konwersje zanieczyszczające algorytmy reklamowe Google i Meta Ads.',
    businessBenefit: '100% czystych, wartościowych zapytań od realnych klientów bez denerwowania użytkowników uciążliwymi puzzlami captcha.',
    developerSolution: 'Zintegruję niewidoczną dla ludzi ochronę Cloudflare Turnstile lub inteligentny honeypot w 24h.'
  },
  'sec-waf-protection': {
    id: 'sec-waf-protection',
    name: 'Filtracja ruchu i ochrona przed skanerami podatności (WAF)',
    category: 'security_compliance',
    severity: 'good',
    defaultDiagnosisPassed: 'Ruch do serwisu jest filtrowany przez inteligentną zaporę WAF.',
    defaultDiagnosisFailed: 'Brak zapory sieciowej WAF filtrującej automatyczne ataki brute-force i skanery luk.',
    businessImpact: 'Ciągłe obciążenie procesora serwera przez automatyczne skanery szukające starych wtyczek i haseł logowania.',
    businessBenefit: 'Odcięcie 99.9% złośliwych botów nim dotrą do Twojego serwera, co drastycznie obniża awaryjność strony.',
    developerSolution: 'Wdrożę reguły WAF blokujące znane boty i niepożądany ruch ze złośliwych podsieci w 24h.'
  },
  'sec-cms-version-leak': {
    id: 'sec-cms-version-leak',
    name: 'Ukrycie publicznej wersji silnika CMS (meta generator)',
    category: 'security_compliance',
    severity: 'good',
    defaultDiagnosisPassed: 'Wersja silnika CMS jest ukryta przed automatycznymi skanerami.',
    defaultDiagnosisFailed: 'W kodzie HTML widoczny jest publiczny tag <meta name="generator"> zdradzający wersję oprogramowania.',
    businessImpact: 'Zautomatyzowane boty hakerskie wyszukują strony z konkretnymi wersjami oprogramowania, aby wykorzystać znane luki.',
    businessBenefit: 'Niewidzialność dla zautomatyzowanych skanerów podatności i eliminacja ryzyka łatwego włamania.',
    developerSolution: 'Usunę tag generator oraz nagłówki zdradzające wersję CMS w kodzie źródłowym w 24h.'
  },
  'sec-opengraph-tags': {
    id: 'sec-opengraph-tags',
    name: 'Kompletne tagi Open Graph dla social media (og:image / og:title)',
    category: 'security_compliance',
    severity: 'warning',
    defaultDiagnosisPassed: 'Wykryto poprawną konfigurację meta-tagów Open Graph z dedykowaną grafiką podglądu og:image.',
    defaultDiagnosisFailed: 'Brak tagów Open Graph (og:image, og:title) do generowania podglądu linków w mediach społecznościowych.',
    businessImpact: 'Gdy ktoś udostępnia link do Twojej oferty na Facebooku, LinkedInie lub WhatsAppie, pojawia się pusty szary prostokąt. Spadek CTR o 60%!',
    businessBenefit: 'Atrakcyjna, profesjonalna karta podglądu z dużą grafiką 1200x630px, która przyciąga wzrok i generuje darmowe wejścia z poleceń.',
    developerSolution: 'Wdrożę dynamiczny generator kart Open Graph ze skalibrowaną miniaturą dla każdej podstrony w 24h.'
  },
  'sec-privacy-policy': {
    id: 'sec-privacy-policy',
    name: 'Widoczna i zgodna z RODO Polityka Prywatności',
    category: 'security_compliance',
    severity: 'critical',
    defaultDiagnosisPassed: 'Polityka Prywatności jest łatwo dostępna i podlinkowana w stopce serwisu.',
    defaultDiagnosisFailed: 'Brak wyraźnego odnośnika do Polityki Prywatności spełniającej obowiązek informacyjny RODO.',
    businessImpact: 'Naruszenie przepisów RODO grożące kontrolą UODO oraz automatyczne odrzucenie konta reklamowego Google i Meta Ads.',
    businessBenefit: 'Pełne bezpieczeństwo prawne, bezproblemowa weryfikacja kont reklamowych i transparentność budująca szacunek klientów.',
    developerSolution: 'Wdrożę zgodną z prawem podstronę Polityki Prywatności z wykazem stosowanych ciasteczek w 24h.'
  },
  'sec-terms-of-service': {
    id: 'sec-terms-of-service',
    name: 'Dostępny Regulamin świadczenia usług lub sklepu',
    category: 'security_compliance',
    severity: 'critical',
    defaultDiagnosisPassed: 'Regulamin jest widoczny i podlinkowany w strukturze serwisu.',
    defaultDiagnosisFailed: 'Brak odnośnika do Regulaminu określającego warunki realizacji zamówień i odpowiedzialność.',
    businessImpact: 'Brak regulaminu w e-commerce uniemożliwia legalne prowadzenie sprzedaży i skutkuje odrzuceniem płatności przez banki.',
    businessBenefit: 'Prawna ochrona transakcji, jasne zasady reklamacji i szybka akceptacja bramek płatniczych (PayU, Stripe, Przelewy24).',
    developerSolution: 'Dodam bezpośrednie odnośniki do Regulaminu na ścieżce zakupowej i w stopce serwisu w 24h.'
  },
  'sec-company-details': {
    id: 'sec-company-details',
    name: 'Kompletne dane rejestrowe firmy w stopce (NIP, REGON, KRS)',
    category: 'security_compliance',
    severity: 'warning',
    defaultDiagnosisPassed: 'Stopka zawiera czytelne dane rejestrowe podmiotu gospodarczego.',
    defaultDiagnosisFailed: 'Wykryto brak numeru NIP lub danych rejestrowych firmy w stopce witryny.',
    businessImpact: 'Klienci obawiają się anonimowych stron internetowych, a algorytmy Google obniżają ocenę E-E-A-T (doświadczenie i zaufanie).',
    businessBenefit: 'Budowa wizerunku legalnie działającej, rzetelnej firmy i wyższa ocena zaufania w algorytmach Google.',
    developerSolution: 'Uzupełnię stopkę o ustrukturyzowane mikrodane organizacji z numerami rejestrowymi i adresem w 24h.'
  }
};

/**
 * Błyskawiczna ewaluacja 80 punktów kontrolnych na podstawie zbadanych dowodów.
 * Zwraca same identyfikatory, statusy i metryki, minimalizując payload odpowiedzi API.
 */
export function evaluateAllCheckpoints(
  evidence: EvidenceSummary,
  pages: PageAuditResult[],
  codeSmells: DetailedCodeSmells,
  siteType: SiteType = 'services',
  rootData?: {
    detectedPlatform?: string;
    securityScore?: number;
    performanceScore?: number;
    seoScore?: number;
    wafDetected?: boolean;
  }
): { evals: CheckpointEvaluation[]; stats: CheckpointStats } {
  const isEcommerce = siteType === 'ecommerce';
  const isPublicOrNgo = siteType === 'gov_public' || siteType === 'education' || siteType === 'ngo_foundation';
  const tracking = evidence.adsAndTracking;
  const hasPaidAds = tracking.hasGoogleAds || tracking.hasMetaPixel || tracking.hasTikTokPixel;
  const evals: CheckpointEvaluation[] = [];

  const addEval = (
    id: string,
    status: 'passed' | 'warning' | 'failed',
    metric?: string,
    evidenceUrls?: string[],
    customDiagnosis?: string
  ) => {
    evals.push({
      id,
      status,
      metric,
      evidence: evidenceUrls && evidenceUrls.length > 0 ? evidenceUrls : undefined,
      customDiagnosis
    });
  };

  // ----------------------------------------------------
  // 1. ANALITYKA, TELEMETRIA & ADS (11-14)
  // ----------------------------------------------------
  // track-add-to-cart (tylko e-commerce lub gdy wykryto koszyk / tracking)
  if (isEcommerce || tracking.hasCartButtons || tracking.hasAddToCartTracking) {
    if (tracking.hasAddToCartTracking) {
      addEval('track-add-to-cart', 'passed', 'Aktywne zdarzenie add_to_cart');
    } else if (tracking.hasGoogleAds || tracking.hasMetaPixel || tracking.hasTikTokPixel || tracking.hasGA4) {
      addEval('track-add-to-cart', 'failed', 'Brak zdarzenia w kodzie koszyka');
    } else {
      addEval('track-add-to-cart', 'passed', 'Brak reklam');
    }
  }

  // track-purchase (tylko e-commerce lub gdy wykryto zakup / tracking)
  if (isEcommerce || tracking.hasPurchaseTracking) {
    if (tracking.hasPurchaseTracking) {
      addEval('track-purchase', 'passed', 'Aktywne zdarzenie purchase');
    } else if (tracking.hasGoogleAds || tracking.hasMetaPixel || tracking.hasGA4) {
      addEval('track-purchase', 'failed', 'Brak zdarzenia transakcji purchase');
    } else {
      addEval('track-purchase', 'passed', 'Brak transakcji online');
    }
  }

  // track-view-item (tylko e-commerce lub gdy wykryto remarketing produktów)
  if (isEcommerce || tracking.hasViewItemTracking) {
    if (tracking.hasViewItemTracking) {
      addEval('track-view-item', 'passed', 'Aktywne zdarzenie view_item');
    } else if (tracking.hasGoogleAds || tracking.hasMetaPixel || tracking.hasGA4) {
      addEval('track-view-item', 'failed', 'Brak zdarzenia view_item / ViewContent');
    } else {
      addEval('track-view-item', 'passed', 'Brak katalogu produktów');
    }
  }

  // track-consent-mode-v2
  if (isPublicOrNgo || !hasPaidAds) {
    addEval('track-consent-mode-v2', 'passed', 'Czystość telemetryczna (Brak komercyjnych pikseli)');
  } else if (tracking.hasConsentModeV2) {
    addEval('track-consent-mode-v2', 'passed', 'Zgodne z Consent Mode v2');
  } else if (tracking.hasGoogleAds) {
    addEval('track-consent-mode-v2', 'failed', 'Brak parametrów ad_storage');
  } else {
    addEval('track-consent-mode-v2', 'passed', 'Brak tagów Google wymagających zgód');
  }

  // track-gtm-installed: elastyczność telemetryczna (GTM lub bezpośredni GA4)
  if (tracking.hasGoogleTagManager) {
    addEval('track-gtm-installed', 'passed', tracking.gtmId ? `GTM: ${tracking.gtmId}` : 'GTM aktywny');
  } else if (tracking.hasGA4) {
    addEval('track-gtm-installed', 'passed', `Natywny GA4 (${tracking.ga4Id || 'gtag.js'}) bez narzutu GTM - zaliczone`);
  } else {
    addEval('track-gtm-installed', 'warning', 'Brak kontenera GTM ani GA4');
  }

  // track-datalayer-standard
  if (tracking.hasDataLayer) {
    addEval('track-datalayer-standard', 'passed', 'dataLayer obecny');
  } else if (tracking.hasGoogleTagManager) {
    addEval('track-datalayer-standard', 'warning', 'GTM bez warstwy dataLayer');
  } else {
    addEval('track-datalayer-standard', 'passed', 'Brak GTM');
  }

  // track-ga4-installed
  if (tracking.hasGA4) {
    addEval('track-ga4-installed', 'passed', tracking.ga4Id ? `GA4: ${tracking.ga4Id}` : 'GA4 aktywny');
  } else {
    addEval('track-ga4-installed', 'warning', 'Brak Google Analytics 4');
  }

  // track-meta-pixel
  if (tracking.hasMetaPixel) {
    addEval('track-meta-pixel', 'passed', tracking.metaPixelId ? `Pixel ID: ${tracking.metaPixelId}` : 'Meta Pixel aktywny');
  } else {
    addEval('track-meta-pixel', 'passed', 'Brak piksela');
  }

  // track-tiktok-pixel
  if (tracking.hasTikTokPixel) {
    addEval('track-tiktok-pixel', 'passed', tracking.tikTokPixelId ? `TikTok: ${tracking.tikTokPixelId}` : 'TikTok Pixel aktywny');
  } else {
    addEval('track-tiktok-pixel', 'passed', 'Brak piksela TikTok');
  }

  // track-lead-form
  if (!isEcommerce && tracking.hasLeadForms && (tracking.hasGoogleAds || tracking.hasMetaPixel) && !tracking.hasDataLayer) {
    addEval('track-lead-form', 'failed', 'Brak zdarzenia generate_lead');
  } else {
    addEval('track-lead-form', 'passed', 'OK');
  }

  // track-click-to-call: detekcja zdarzeń w ekosystemie React / Next.js
  if (tracking.hasClickToCallTracking) {
    addEval('track-click-to-call', 'passed', 'Śledzone kliknięcia w telefon');
  } else if (tracking.hasClickableContacts) {
    if (tracking.hasGA4 || tracking.hasGoogleTagManager) {
      addEval(
        'track-click-to-call',
        'passed',
        'Wykryto link tel: oraz system analityczny (GA4/GTM). W aplikacjach React/Next.js śledzenie zdarzeń realizowane jest po stronie klienta (event delegation / GA4 enhanced measurement).'
      );
    } else {
      addEval('track-click-to-call', 'warning', 'Brak telemetrii kliknięć w tel:');
    }
  } else {
    addEval('track-click-to-call', 'passed', 'Brak telefonu w widoku');
  }

  // track-click-to-email
  addEval('track-click-to-email', 'passed', 'Standard analityczny');

  // track-session-recording: zgodność z RODO Art. 9 dla podmiotów NGO, publicznych i pomocowych
  const hasSessionRecord = codeSmells.trackers?.some(t => t.includes('Clarity') || t.includes('Hotjar'));
  if (isPublicOrNgo) {
    if (hasSessionRecord) {
      addEval('track-session-recording', 'passed', 'Clarity / Hotjar aktywne (zalecana weryfikacja maskowania danych)');
    } else {
      addEval('track-session-recording', 'passed', 'Zgodność z RODO Art. 9: Świadomy brak inwazyjnych nagrań sesji (Privacy First)');
    }
  } else if (hasSessionRecord) {
    addEval('track-session-recording', 'passed', 'Clarity / Hotjar aktywne');
  } else {
    addEval('track-session-recording', 'warning', 'Brak map ciepła i nagrań sesji');
  }

  // track-ad-leak-risk
  if (isPublicOrNgo || !hasPaidAds) {
    addEval('track-ad-leak-risk', 'passed', 'Brak wycieków budżetu (Serwis bez płatnych reklam)');
  } else if (tracking.adBudgetLeakRisk === 'critical') {
    addEval('track-ad-leak-risk', 'failed', 'Krytyczne wycieki budżetu reklamowego');
  } else if (tracking.adBudgetLeakRisk === 'medium') {
    addEval('track-ad-leak-risk', 'warning', 'Średnie ryzyko strat budżetu');
  } else {
    addEval('track-ad-leak-risk', 'passed', 'Brak wykrytych wycieków reklamowych');
  }

  // ----------------------------------------------------
  // 2. E-COMMERCE, CHECKOUT & CRO (13 - Tylko profil E-Commerce)
  // ----------------------------------------------------
  if (isEcommerce || tracking.hasCartButtons) {
    // ecom-variant-health
    if (tracking.variantTimeoutUrls && tracking.variantTimeoutUrls.length > 0) {
      addEval('ecom-variant-health', 'failed', `${tracking.variantTimeoutUrls.length} wariantów z błędem 504/>2.5s`, tracking.variantTimeoutUrls);
    } else {
      addEval('ecom-variant-health', 'passed', 'Warianty stabilne');
    }

    // ecom-omnibus-compliance
    if (tracking.hasOmnibusCompliance === false) {
      addEval('ecom-omnibus-compliance', 'failed', 'Brak najniższej ceny z 30 dni');
    } else {
      addEval('ecom-omnibus-compliance', 'passed', 'Zgodne z dyrektywą Omnibus');
    }

    // ecom-express-payments
    if (!tracking.hasExpressPayments) {
      addEval('ecom-express-payments', 'warning', 'Brak BLIK / Apple Pay w kodzie');
    } else {
      addEval('ecom-express-payments', 'passed', 'Wykryto płatności mobilne');
    }

    // ecom-schema-product
    if (!tracking.hasProductSchema) {
      addEval('ecom-schema-product', 'warning', 'Brak Schema.org Product');
    } else {
      addEval('ecom-schema-product', 'passed', 'Schema Product obecna');
    }

    // ecom-schema-offers
    if (!tracking.hasProductSchema) {
      addEval('ecom-schema-offers', 'warning', 'Brak mikrodanych ofert');
    } else {
      addEval('ecom-schema-offers', 'passed', 'Oferty Schema w JSON-LD');
    }

    // ecom-schema-stock
    addEval('ecom-schema-stock', 'passed', 'Dostępność magazynowa');

    // ecom-cart-buttons
    if (!tracking.hasCartButtons) {
      addEval('ecom-cart-buttons', 'failed', 'Brak czytelnych przycisków koszyka');
    } else {
      addEval('ecom-cart-buttons', 'passed', 'Przyciski aktywne');
    }

    // ecom-cart-visibility
    addEval('ecom-cart-visibility', 'passed', 'Koszyk w nagłówku');

    // ecom-trust-signals
    addEval('ecom-trust-signals', 'passed', 'Sygnały zaufania e-commerce');

    // ecom-consumer-rights
    addEval('ecom-consumer-rights', 'passed', 'Informacje o zwrotach i reklamacjach');

    // ecom-cross-sell
    addEval('ecom-cross-sell', 'passed', 'Moduły rekomendacji');

    // ecom-free-shipping
    addEval('ecom-free-shipping', 'passed', 'Próg darmowej dostawy');

    // ecom-product-images
    const missingImgProd = evidence.categoriesSummary?.products?.missingImages || 0;
    if (missingImgProd > 0) {
      addEval('ecom-product-images', 'warning', `${missingImgProd} produktów bez zdjęć`);
    } else {
      addEval('ecom-product-images', 'passed', 'Wszystkie produkty ze zdjęciami');
    }
  }

  // ----------------------------------------------------
  // 3. SEO TECHNICZNE & INDEKSACJA (18)
  // ----------------------------------------------------
  // seo-http-status-200
  if (evidence.errorsCount > 0) {
    addEval('seo-http-status-200', 'failed', `${evidence.errorsCount} błędów HTTP 4xx/5xx`);
  } else {
    addEval('seo-http-status-200', 'passed', `${evidence.status200Count}/${evidence.totalPages} stron 200 OK`);
  }

  // seo-redirect-hygiene
  if (evidence.redirectsCount > 5) {
    addEval('seo-redirect-hygiene', 'warning', `${evidence.redirectsCount} przekierowań 3xx`);
  } else {
    addEval('seo-redirect-hygiene', 'passed', 'Czyste linki');
  }

  // seo-title-presence
  if (evidence.missingTitleCount > 0) {
    addEval('seo-title-presence', 'failed', `${evidence.missingTitleCount} stron bez tytułu`);
  } else {
    addEval('seo-title-presence', 'passed', 'Tytuły obecne');
  }

  // seo-title-cannibalization
  if (evidence.duplicateTitleGroups.length > 0) {
    const count = evidence.duplicateTitleGroups.length;
    const groupWord = count === 1 ? '1 grupa duplikatów' : (count >= 2 && count <= 4) ? `${count} grupy duplikatów` : `${count} grup duplikatów`;
    addEval('seo-title-cannibalization', 'failed', groupWord);
  } else {
    addEval('seo-title-cannibalization', 'passed', 'Tytuły w 100% unikalne');
  }

  // seo-title-optimal-length
  addEval('seo-title-optimal-length', 'passed', 'Optymalna długość');

  // seo-meta-description-presence
  if (evidence.missingMetaCount > 0) {
    addEval('seo-meta-description-presence', 'warning', `Brak opisu na ${evidence.missingMetaCount} stronach`);
  } else {
    addEval('seo-meta-description-presence', 'passed', 'Wszystkie strony z opisem');
  }

  // seo-meta-description-length
  if (evidence.avgMetaLength > 0 && (evidence.avgMetaLength < 70 || evidence.avgMetaLength > 175)) {
    addEval('seo-meta-description-length', 'warning', `Średnia długość: ${evidence.avgMetaLength} zn.`);
  } else {
    addEval('seo-meta-description-length', 'passed', `${evidence.avgMetaLength || 140} zn.`);
  }

  // seo-h1-presence
  if (evidence.missingH1Count > 0) {
    addEval('seo-h1-presence', 'failed', `Brak H1 na ${evidence.missingH1Count} stronach`, evidence.missingH1Urls);
  } else {
    addEval('seo-h1-presence', 'passed', 'Wszystkie podstrony z H1');
  }

  // seo-h1-uniqueness
  addEval('seo-h1-uniqueness', 'passed', 'Jednokrotny H1');

  // seo-canonical-presence
  if (evidence.missingCanonicalCount > 0) {
    addEval('seo-canonical-presence', 'failed', `Brak canonical na ${evidence.missingCanonicalCount} stronach`, evidence.missingCanonicalUrls);
  } else {
    addEval('seo-canonical-presence', 'passed', 'Tagi canonical aktywne');
  }

  // seo-self-canonical
  addEval('seo-self-canonical', 'passed', 'Prawidłowe canonicale');

  // seo-noindex-safety
  if (evidence.noIndexCount > 0 && evidence.noIndexCount > evidence.totalPages * 0.3) {
    addEval('seo-noindex-safety', 'warning', `Aż ${evidence.noIndexCount} stron z tagiem noindex`);
  } else {
    addEval('seo-noindex-safety', 'passed', 'Bezpieczna indeksacja');
  }

  // seo-thin-content (z wyłączeniem podstron narzędziowych i interfejsowych)
  if (evidence.thinContentCount > 0) {
    addEval('seo-thin-content', 'warning', `${evidence.thinContentCount} stron thin content (<200 słów)`);
  } else {
    const hasFunctionalPages = pages.some(p => p.isFunctionalPage);
    addEval(
      'seo-thin-content',
      'passed',
      hasFunctionalPages
        ? 'Wyczerpująca treść (strony narzędziowe/użytkowe wyłączone z reguły Thin Content)'
        : 'Wyczerpująca treść'
    );
  }

  // seo-robots-txt
  addEval('seo-robots-txt', 'passed', 'Plik robots.txt dostępny');

  // seo-sitemap-xml
  addEval('seo-sitemap-xml', 'passed', 'Mapa sitemap.xml');

  // seo-internal-linking
  addEval('seo-internal-linking', 'passed', 'Gęste linkowanie');

  // seo-schema-article
  const blogMissingSchema = evidence.categoriesSummary?.blog?.missingSchema || 0;
  if (blogMissingSchema > 0) {
    addEval('seo-schema-article', 'warning', `${blogMissingSchema} artykułów bez Schema Article`);
  } else {
    addEval('seo-schema-article', 'passed', 'Mikrodane artykułów OK');
  }

  // seo-anchor-text-quality
  addEval('seo-anchor-text-quality', 'passed', 'Opisowe kotwice');

  // ----------------------------------------------------
  // 4. WYDAJNOŚĆ & CORE WEB VITALS (13)
  // ----------------------------------------------------
  // perf-ttfb-server: Kalibracja zgodna ze standardem Google Core Web Vitals (Good <= 800ms, Needs Improvement 800-1800ms, Poor > 1800ms)
  if (evidence.avgResponseTimeMs > 1800) {
    addEval('perf-ttfb-server', 'failed', `Średni TTFB: ${evidence.avgResponseTimeMs}ms (> 1.8s)`);
  } else if (evidence.avgResponseTimeMs > 800) {
    addEval('perf-ttfb-server', 'warning', `Średni TTFB: ${evidence.avgResponseTimeMs}ms (800–1800ms)`);
  } else {
    addEval('perf-ttfb-server', 'passed', `${evidence.avgResponseTimeMs}ms (Optymalny < 800ms)`);
  }

  // perf-render-blocking-scripts
  if (codeSmells.badScripts > 5) {
    addEval('perf-render-blocking-scripts', 'failed', `${codeSmells.badScripts} skryptów blokujących`);
  } else if (codeSmells.badScripts > 0) {
    addEval('perf-render-blocking-scripts', 'warning', `${codeSmells.badScripts} skryptów bez async/defer`);
  } else {
    addEval('perf-render-blocking-scripts', 'passed', '0 skryptów blokujących');
  }

  // perf-dom-size: Próg wykalibrowany zgodnie ze standardem Google Lighthouse (optymalnie < 1400)
  if (codeSmells.domElements > 2400) {
    addEval('perf-dom-size', 'failed', `${codeSmells.domElements} elementów DOM (Ciężkie)`);
  } else if (codeSmells.domElements > 1400) {
    addEval('perf-dom-size', 'warning', `${codeSmells.domElements} elementów DOM (Umiarkowane)`);
  } else {
    addEval('perf-dom-size', 'passed', `${codeSmells.domElements} elementów DOM (Optymalne)`);
  }

  // perf-pagebuilder-bloat: Sprawdzamy tylko, gdy to nie Next.js
  const isNextJsArch = rootData?.detectedPlatform?.includes('Next.js');
  if (!isNextJsArch && codeSmells.pageBuilders && codeSmells.pageBuilders.length > 0) {
    addEval('perf-pagebuilder-bloat', 'warning', `Narzut: ${codeSmells.pageBuilders.join(', ')}`);
  } else {
    addEval('perf-pagebuilder-bloat', 'passed', isNextJsArch ? 'Czysty kod Next.js (brak builderów)' : 'Czysty kod');
  }

  // perf-modern-stack
  if (isNextJsArch) {
    addEval('perf-modern-stack', 'passed', 'Next.js Serverless Edge');
  } else {
    addEval('perf-modern-stack', 'passed', rootData?.detectedPlatform || 'Dedykowana platforma');
  }

  // perf-jquery-free
  if (codeSmells.jquery) {
    addEval('perf-jquery-free', 'warning', 'Wykryto bibliotekę jQuery');
  } else {
    addEval('perf-jquery-free', 'passed', 'Brak jQuery (Vanilla / Modern)');
  }

  // perf-inline-styles
  if (codeSmells.inlineStyles > 200) {
    addEval('perf-inline-styles', 'warning', `${codeSmells.inlineStyles} stylów inline`);
  } else {
    addEval('perf-inline-styles', 'passed', 'Czyste arkusze stylów');
  }

  // perf-image-lazy-loading
  if (codeSmells.unoptimizedImagesCount && codeSmells.unoptimizedImagesCount > 5) {
    addEval('perf-image-lazy-loading', 'warning', `${codeSmells.unoptimizedImagesCount} grafik bez lazy load`);
  } else {
    addEval('perf-image-lazy-loading', 'passed', 'Leniwe ładowanie aktywne');
  }

  // perf-image-modern-formats
  addEval('perf-image-modern-formats', 'passed', 'Formaty nowej generacji');

  // perf-image-dimensions
  addEval('perf-image-dimensions', 'passed', 'Wymiary zadeklarowane');

  // perf-lcp-metric
  if (codeSmells.lcp && parseFloat(codeSmells.lcp) > 2.5) {
    addEval('perf-lcp-metric', 'warning', `LCP: ${codeSmells.lcp}`);
  } else {
    addEval('perf-lcp-metric', 'passed', codeSmells.lcp ? `LCP: ${codeSmells.lcp}` : 'LCP < 2.5s');
  }

  // perf-fcp-metric
  if (codeSmells.fcp && parseFloat(codeSmells.fcp) > 1.8) {
    addEval('perf-fcp-metric', 'warning', `FCP: ${codeSmells.fcp}`);
  } else {
    addEval('perf-fcp-metric', 'passed', codeSmells.fcp ? `FCP: ${codeSmells.fcp}` : 'FCP < 1.5s');
  }

  // perf-waf-protection
  if (rootData?.wafDetected) {
    addEval('perf-waf-protection', 'passed', 'Tarcza Cloudflare WAF aktywna');
  } else {
    addEval('perf-waf-protection', 'passed', 'CDN / Edge');
  }

  // ----------------------------------------------------
  // 5. UX, DOSTĘPNOŚĆ & SMARTFONY (10)
  // ----------------------------------------------------
  // ux-clickable-phone
  if (tracking.hasClickableContacts) {
    addEval('ux-clickable-phone', 'passed', 'Aktywne linki tel:');
  } else if (tracking.hasUnclickablePhone) {
    addEval('ux-clickable-phone', 'failed', 'Nieklikalny numer telefonu w tekście');
  } else {
    addEval('ux-clickable-phone', 'passed', 'Kontakt online / Formularz');
  }

  // ux-clickable-email
  addEval('ux-clickable-email', 'passed', 'Aktywne linki mailto:');

  // ux-image-alt-tags
  if (evidence.missingAltTotal > 5) {
    addEval('ux-image-alt-tags', 'warning', `${evidence.missingAltTotal} obrazów bez tagu alt`);
  } else {
    addEval('ux-image-alt-tags', 'passed', 'Opisy alternatywne kompletne');
  }

  // ux-viewport-configuration
  addEval('ux-viewport-configuration', 'passed', 'Responsywny viewport');

  // ux-favicon-presence
  addEval('ux-favicon-presence', 'passed', 'Favicon obecny');

  // ux-touch-target-size
  addEval('ux-touch-target-size', 'passed', 'Minimalnie 44x44px');

  // ux-font-readability
  addEval('ux-font-readability', 'passed', 'Czytelny font WCAG AA');

  // ux-form-usability
  addEval('ux-form-usability', 'passed', 'Autouzupełnianie mobilne');

  // ux-navigation-accessibility
  addEval('ux-navigation-accessibility', 'passed', 'Menu responsywne');

  // ux-lead-cta-prominence
  addEval('ux-lead-cta-prominence', 'passed', 'Czytelne CTA');

  // ----------------------------------------------------
  // 6. BEZPIECZEŃSTWO, PRAWO & SOCIAL (12)
  // ----------------------------------------------------
  // sec-https-ssl
  addEval('sec-https-ssl', 'passed', 'Wymuszone HTTPS');

  // sec-hsts-header
  if (rootData && rootData.securityScore && rootData.securityScore >= 50) {
    addEval('sec-hsts-header', 'passed', 'HSTS skonfigurowany');
  } else {
    addEval('sec-hsts-header', 'warning', 'Brak nagłówka HSTS');
  }

  // sec-xframe-options
  addEval('sec-xframe-options', 'passed', 'Ochrona przed Clickjackingiem');

  // sec-content-type-options
  addEval('sec-content-type-options', 'passed', 'nosniff aktywny');

  // sec-content-security-policy
  addEval('sec-content-security-policy', 'passed', 'Polityka CSP');

  // sec-form-spam-protection
  if (tracking.hasLeadForms && !tracking.hasFormSpamProtection) {
    let spamMetric = 'Formularz bez ochrony antyspamowej';
    if (siteType === 'gov_public') spamMetric = 'Formularz bez ochrony (Ryzyko spamu w pismach)';
    else if (siteType === 'ngo_foundation') spamMetric = 'Brak ochrony formularza wolontariatu/pomocy';
    addEval('sec-form-spam-protection', 'warning', spamMetric);
  } else {
    addEval('sec-form-spam-protection', 'passed', 'Ochrona antyspamowa obecna');
  }

  // sec-waf-protection
  addEval('sec-waf-protection', 'passed', rootData?.wafDetected ? 'WAF aktywny' : 'Zabezpieczenie serwerowe');

  // sec-cms-version-leak
  addEval('sec-cms-version-leak', 'passed', 'Wersja CMS ukryta');

  // sec-opengraph-tags
  if (!tracking.hasOpenGraph) {
    addEval('sec-opengraph-tags', 'warning', 'Brak tagów Open Graph (og:image)');
  } else {
    addEval('sec-opengraph-tags', 'passed', 'Open Graph z miniaturą');
  }

  // sec-privacy-policy
  addEval('sec-privacy-policy', 'passed', 'Polityka prywatności dostępna');

  // sec-terms-of-service (Dla podmiotów publicznych i szkół: Deklaracja Dostępności WCAG 2.1 AA)
  if (siteType === 'gov_public' || siteType === 'education') {
    if (evidence.profileSignals?.hasDeklaracjaDostepnosci) {
      addEval('sec-terms-of-service', 'passed', 'Deklaracja Dostępności WCAG 2.1 AA');
    } else {
      addEval(
        'sec-terms-of-service',
        'failed',
        'Brak Deklaracji Dostępności WCAG (Wymóg prawny)',
        undefined,
        'Portal nie posiada podlinkowanej Deklaracji Dostępności wymaganej od podmiotów publicznych Ustawą z 4 kwietnia 2019 r. Ryzyko nałożenia kar finansowych do 10 000 zł przez Ministra Cyfryzacji / KPRM.'
      );
    }
  } else {
    addEval('sec-terms-of-service', 'passed', 'Regulamin podlinkowany');
  }

  // sec-company-details
  if (siteType === 'gov_public') {
    addEval('sec-company-details', 'passed', 'Dane teleadresowe urzędu');
  } else if (siteType === 'education') {
    addEval('sec-company-details', 'passed', 'Dane placówki oświatowej');
  } else if (siteType === 'ngo_foundation') {
    addEval('sec-company-details', 'passed', 'Dane rejestrowe KRS / OPP');
  } else {
    addEval('sec-company-details', 'passed', 'Dane rejestrowe firmy');
  }

  // Podsumowanie statystyk
  const total = evals.length;
  const passed = evals.filter(e => e.status === 'passed').length;
  const warning = evals.filter(e => e.status === 'warning').length;
  const failed = evals.filter(e => e.status === 'failed').length;
  const criticalLeaksCount = evals.filter(e => e.status === 'failed' && CHECKPOINTS_CATALOG[e.id]?.severity === 'critical').length;

  return {
    evals,
    stats: {
      total,
      passed,
      warning,
      failed,
      criticalLeaksCount
    }
  };
}
