# OFERTA HANDLOWA: Dedykowany System Portalu Internetowego i Komunikacji dla Stowarzyszenia KAS

**Dla:** Zarząd Stowarzyszenia Kombinat Aktywności Społecznej w Radomiu  
**Adres rejestrowy:** ul. Ignacego Daszyńskiego 9A / 19, 26-600 Radom (KRS: 0000609451, NIP: 7962971555)  
**Data:** 12 lipca 2026 r.  
**Przygotował:** Marcin Molenda, Molenda Development  
**Dane kontaktowe:** kontakt@molendadevelopment.pl | tel: +48 665 430 469  

---

### Szanowni Państwo, Członkowie Zarządu,

W odpowiedzi na zapotrzebowanie Stowarzyszenia Kombinat Aktywności Społecznej w Radomiu, mam przyjemność przedstawić Państwu kompleksową ofertę modernizacji portalu **stowarzyszeniekas.pl**. Jako niezależny inżynier oprogramowania, na co dzień projektuję i wdrażam zaawansowane systemy klasy komercyjnej (m.in. platformy e-commerce B2B, aplikacje PWA oraz bezpieczne bazy danych). Przenoszę te rygorystyczne standardy technologiczne do sektora publicznego i społecznego.

Wasza misja – niesienie bezpłatnego wsparcia psychologicznego młodzieży, prowadzenie punktu Eurodesk Polska oraz koordynacja lokalnego wolontariatu – wymaga niezawodnych i bezpiecznych narzędzi cyfrowych. Obecne rozwiązania oparte na klasycznych szablonach CMS wykazują ograniczenia wydajnościowe i podatność na usterki (czego przykładem była konieczność wyłączenia niestabilnego modułu rezerwacji `Kalendarz.php`).

Niniejsza propozycja zakłada całkowite uniezależnienie warstwy wizualnej od zaplecza administracyjnego (**architektura Headless Next.js + WordPress API**), co gwarantuje:
1. **Bezwarunkowe bezpieczeństwo i poufność (zgodnie z Art. 9 RODO)** – autorski czat wsparcia w czasie rzeczywistym nie rejestruje adresów IP ani nie instaluje plików cookie śledzących młodzież.
2. **Pancerną stabilność i szybkość (Lighthouse 100/100)** – eliminacja zawieszeń systemu rezerwacji terminów i błyskawiczne ładowanie na telefonach (w ok. 1.2 sekundy) nawet przy słabym zasięgu komórkowym.
3. **100% zgodności z WCAG 2.1 AA** – czysty, semantyczny kod pisany od podstaw, gwarantujący przejście rygorystycznych audytów ze strony Narodowej Agencji Programów unijnych (FRSE, EOG) i chroniący Państwa przed ryzykiem odrzucenia wydatków kwalifikowalnych.

---

## I. ARCHITEKTURA SYSTEMU I ZAKRES WDROŻENIA

Proponowany system zostanie oparty o architekturę **Next.js (React) na froncie** oraz **WordPress jako ultra-prosty panel redakcyjny (Headless CMS)** na zapleczu. Oznacza to, że Państwa zespół zachowuje wygodę edycji aktualności w znanym środowisku WordPress, ale sama strona dla użytkowników końcowych jest generowana statycznie i serwowana bezpośrednio z globalnej, bezpiecznej sieci CDN. Fizycznie uniemożliwia to "rozjechanie" układu graficznego przez redaktora oraz blokuje wszelkie próby ataków hakerskich na bazę danych.

### Główne moduły funkcjonalne:
*   **Szyfrowany, Anonimowy Czat Wsparcia:** Komunikator w czasie rzeczywistym zintegrowany z bezpieczną chmurą Supabase. Pełna separacja danych i anonimizacja połączeń chroni wrażliwe dane psychologiczne podopiecznych.
*   **Bezawaryjny Kalendarz Zapisów Online:** Zautomatyzowany system rezerwacji konsultacji, w którym terminy odświeżają się natychmiastowo, uniemożliwiając nakładanie się rezerwacji i eliminując potrzebę ręcznej weryfikacji.
*   **Moduł Szybkich Darowizn:** Bezpieczna integracja z operatorem płatności (BLIK, szybkie przelewy, karty) zwiększająca stabilność finansowania społecznościowego KAS.
*   **Interaktywny Panel Dostępności WCAG 2.1 AA:** Natywne wdrożenie narzędzi ułatwiających dostęp (kontrasty, powiększanie tekstu, obsługa czytników ekranu i nawigacji klawiaturą) bezpośrednio w kodzie, bez stosowania wadliwych nakładek zewnętrznych.

---

## II. ELASTYCZNE WARIANTY INWESTYCJI

Wycenę każdego pakietu ustalamy na twardo przed rozpoczęciem prac – kwota wpisana do umowy jest ostateczna i nie ulegnie podwyższeniu w trakcie developmentu.

| Zakres i parametry techniczne | 🥉 PAKIET DEDYKOWANY (Wdrożenie Statutowe) | 🥈 PAKIET OPTYMALNY (Cyfrowy Rozwój) | 🥇 PAKIET MAKSYMALNY (Automatyzacja Enterprise & AI) |
| :--- | :---: | :---: | :---: |
| **Koszt wdrożenia (netto)** | **14 500 PLN** | **29 000 PLN** | **48 000 PLN** |
| **Szybki portal Next.js + WP CMS** | Tak (100% autorski layout UX) | Tak (projekt dedykowany) | Tak (pełne wdrożenie premium) |
| **Zgodność z normami WCAG 2.1 AA** | Tak (natywna zgodność kodu) | Tak (natywna zgodność kodu) | Tak (natywna zgodność kodu) |
| **Anonimowy czat wsparcia (Supabase)** | Tak (szyfrowany, w czasie rzeczywistym) | Tak (czat + system CRM pacjentów) | Tak (czat, CRM + asysta AI) |
| **System zapisów online z kalendarzem** | Tak (bezawaryjny moduł) | Tak (bezawaryjny moduł) | Tak (bezawaryjny moduł) |
| **Moduł darowizn z płatnościami online** | Tak (BLIK, przelewy) | Tak (BLIK, karty, przelewy) | Tak (BLIK, karty, przelewy) |
| **Automatyczne powiadomienia i CRM** | Nie | Tak (Baza pacjentów, powiadomienia SMS/e-mail) | Tak (Integracje n8n, Kalendarz Google, powiadomienia SMS kryzysowe) |
| **Raport zgodności WCAG dla audytorów** | Nie | **Tak (Pisemny raport walidacyjny)** | **Tak (Certyfikowany Audyt Zewnętrzny + formalna Deklaracja Dostępności)** |
| **Szkolenia wideo dla kadry i wolontariuszy** | Tak (podstawowy instruktaż) | Tak (pełna platforma szkoleniowa wideo) | Tak (pełna platforma szkoleniowa wideo) |
| **Okres bezpłatnego wsparcia SLA** | **90 dni (gwarancja rozruchowa)** | **12 miesięcy (SLA Standard)** | **24 miesiące (SLA Premium do 4h)** |

---

## III. DORADZTWO FINANSOWE: JAK SFINANSOWAĆ WDROŻENIE Z GRANTÓW?

Jako partner rozumiejący specyfikę organizacji pozarządowych, dostosowuję model rozliczeń do realiów księgowości dotacyjnej (m.in. unijnych EFS+, funduszy norweskich/EOG czy programów FRSE i Eurodesk). Całą fakturę za system mogą Państwo w 100% bezpiecznie pokryć i rozliczyć z bieżących grantów zewnętrznych, np. w ramach realizowanego obecnie przez Stowarzyszenie projektu **„Aktywnie w kierunku zatrudnienia” (Numer projektu: FEMA.08.01-IP.01-03M7/24)**:

1.  **Z linii budżetowej na promocję i informację:** Standardowe granty unijne przeznaczają od 1% do 5% całkowitej wartości projektu na działania upowszechniające i komunikacyjne. Przy budżetach projektowych rzędu kilkuset tysięcy złotych, koszty te idealnie absorbują wdrożenie nowego portalu Next.js jako głównego kanału informacyjnego.
2.  **Z linii budżetowej na dostępność i likwidację barier (WCAG 2.1 AA):** Koszty audytu zerowego, programistycznego dostosowania kodu pod czytniki ekranu oraz sporządzenia oficjalnej dokumentacji (raport walidacyjny / Deklaracja Dostępności) mogą zostać w całości sfinansowane jako obowiązkowe działania dostępnościowe dla beneficjentów wykluczonych cyfrowo.
3.  **Z linii budżetowej na merytoryczne narzędzia wsparcia:** Szyfrowany czat Supabase i zautomatyzowane formularze rezerwacji to bezpośrednie narzędzia realizacji zadań statutowych (np. prowadzenia Punktów Wsparcia i Informacji dla młodzieży), a nie tylko "koszt techniczny".

**Wygodne fakturowanie:**  
Dla ułatwienia rozliczeń z wieloma grantodawcami, całą inwestycję **dzielę na 5 niezależnych etapów i wystawiam osobne faktury VAT**, co umożliwia bezproblemowe przypisanie poszczególnych kwot do różnych okresów sprawozdawczych i linii budżetowych.

---

## IV. ŻELAZNE ZABEZPIECZENIA I GWARANCJA BEZPIECZEŃSTWA

Podpisując umowę ze mną, nie ponoszą Państwo żadnego ryzyka finansowego:

*   **Gwarancja Bezpieczeństwa Środków (Etap 1):** Jeśli po zaprezentowaniu wstępnych makiet graficznych i projektowych w Etapie 1 uznają Państwo, że moja wizja nie spełnia w 100% celów wizerunkowych KAS – rozwiązujemy umowę, a ja natychmiast zwracam pełną kwotę zaliczki. Wasz budżet jest w pełni bezpieczny.
*   **Asynchroniczny Onboarding (Baza Wiedzy):** Po wdrożeniu otrzymują Państwo kompletny pakiet nagranych instruktaży wideo. Pozwala to na błyskawiczne, bezkosztowe i bezterminowe przeszkolenie każdego nowego wolontariusza, psychologa czy pracownika administracyjnego z obsługi panelu.
*   **Opieka Techniczna (SLA):** Osobiście monitoruję stabilność kodu, bezpieczeństwo RODO, poprawność WCAG oraz działanie szyfrowanego czatu przez cały okres gwarancyjny (od 90 dni do 24 miesięcy).

---

## V. CO MÓWIĄ LOKALNI PRZEDSIĘBIORCY O WSPÓŁPRACY ZE MNĄ?

> **Michał (Właściciel DzikiStyl.com):**  
> *"Marcin przeprowadził dla nas zaawansowaną przebudowę drukarni z ograniczonego silnika Shoper na nowoczesną architekturę Headless Next.js. Wdrożył płatności bez przeładowania strony oraz globalny przełącznik netto/brutto bez odświeżania, co drastycznie usprawniło obsługę naszych klientów B2B. Pełen profesjonalizm i najwyższy standard inżynieryjny."*
> 
> **Krzysztof (Właściciel Sklep-Urwis.pl):**  
> *"Polecam z całego serca. Marcin stworzył dla mojego sklepu aplikację, która ma w sobie wszystko – koło fortuny z rabatami, strefę zabawy z grami na telefon i kolorowanki z naszym Urwisem. Zarówno strona sklepu, jak i aplikacja PWA przeszły moje najśmielsze oczekiwania – to rzadko spotykany profesjonalizm i dbałość o każdy techniczny detal."*
> 
> **Maciek (Właściciel Kajaki u Maćka):**  
> *"Marcin stworzył dla nas system, który wygląda obłędnie i działa bezbłędnie nawet przy słabym zasięgu nad rzeką. Od zera zoptymalizował naszą obecność w Google i social mediach, zachowując pełną spójność techniczną. Współpraca z nim to zupełnie inny poziom inżynierii cyfrowej – pełna klasa, zdecydowanie polecam!"*

---

## VI. POROZMAWIAJMY O POTRZEBACH KAS (BEZ ZOBOWIĄZAŃ)

Zachęcam Państwa do pobrania niniejszej oferty w formacie PDF, wydrukowania jej i przedstawienia na najbliższym spotkaniu Zarządu. 

Jeśli chcą Państwo skonsultować aspekty techniczne bezpiecznego czatu, zapytać o integrację z Waszymi procesami lub po prostu sprawdzić, jak moje rozwiązania mogą usprawnić codzienne działanie Stowarzyszenia – zapraszam do kontaktu. 

**Szanuję Państwa czas: jeśli Wasze plany uległy zmianie lub ten projekt nie jest teraz dla Państwa priorytetem – krótka, jednozdaniowa informacja zwrotna (np. *„nie jesteśmy zainteresowani”* lub *„odezwiemy się w innym terminie”*) będzie dla mnie niezwykle pomocna przy planowaniu kalendarza prac deweloperskich na ten kwartał.**

*   📧 **E-mail:** kontakt@molendadevelopment.pl  
*   📞 **Telefon:** +48 665 430 469  
*   🌐 **Serwis:** [molendadevelopment.pl](https://molendadevelopment.pl)  
