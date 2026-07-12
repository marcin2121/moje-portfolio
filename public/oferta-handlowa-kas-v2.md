# OFICJALNA OFERTA HANDLOWA
**Modernizacja serwisu internetowego stowarzyszeniekas.pl wraz z systemem zapisów online, modułem darowizn i bezpiecznym czatem wsparcia w czasie rzeczywistym.**

---

## 1. Profil Wykonawcy: Standardy Komercyjne dla Misji Społecznej

Nazywam się **Marcin Molenda** i jestem niezależnym inżynierem oprogramowania. Na co dzień projektuję i wdrażam zaawansowane systemy transakcyjne, platformy e-commerce B2B oraz ultraszybkie aplikacje webowe dla biznesu komercyjnego. W świecie komercyjnym każda sekunda opóźnienia strony przekłada się na bezpośrednie straty finansowe, a błędy w bezpieczeństwie oznaczają utratę reputacji i kary prawne.

Przenoszę te bezkompromisowe, komercyjne standardy wydajności, stabilności oraz pancernego bezpieczeństwa (klasy Enterprise) do sektora społecznego. 

Misja pomocowa Stowarzyszenia KAS (Radom) – w szczególności prowadzenie Punktu Informacyjno-Edukacyjnego, Eurodesku oraz bezpośrednie, kryzysowe wsparcie psychologiczne dla dzieci i młodzieży – wymaga technologii najwyższej próby. Państwa podopieczni zasługują na platformę, która:
1. **Działa natychmiastowo** (<1.5 sekundy), nawet przy słabym zasięgu mobilnym nad rzeką czy w trasie.
2. **Nigdy nie zawodzi w krytycznym momencie** (eliminacja awarii serwera, takich jak błąd skryptu `Kalendarz.php`).
3. **Gwarantuje 100% anonimowości i bezpieczeństwa prawnego** (pełna zgodność z RODO Art. 9 dla danych wrażliwych).
4. **Jest w pełni dostępna dla każdego** (natywne wdrożenie norm WCAG 2.1 AA).

---

## 2. Architektura Systemu: Next.js + Headless CMS + Supabase

Tradycyjne podejście polegające na budowie całej strony na WordPressie i instalacji dziesiątek gotowych wtyczek niesie za sobą ogromne ryzyko:
* **Wycieki danych:** Wtyczki do WordPressa często logują adresy IP użytkowników, stosują ciasteczka śledzące (cookies) i wysyłają dane do zewnętrznych serwerów reklamowych, co przy obsłudze czatu psychologicznego dla młodzieży jest rażącym naruszeniem RODO.
* **Awaryjność i ociężałość:** Strona ładuje się powoli, a aktualizacje wtyczek potrafią w losowych momentach "wysypać" kluczowe funkcje (np. system zapisów).

**Moje rozwiązanie to nowoczesna architektura hybrydowa (Headless):**
* **Zaplecze (WordPress / Prosty CMS):** Służy wyłącznie jako znany, bezpieczny i wygodny panel dla Waszego zespołu do samodzielnego dodawania aktualności, dokumentów czy zarządzania zespołem.
* **Warstwa Wizualna (Frontend Next.js):** Szybki, bezszablonowy i stabilny interfejs użytkownika serwowany z globalnej chmury CDN. Strona ładuje się natychmiast, jest całkowicie odporna na przeciążenia (ruch z kampanii w szkołach) i fizycznie nie da się w niej "rozjechać" układu graficznego.
* **Silnik Komunikacji i Danych (Supabase Realtime):** Odpowiada za pancernie bezpieczny, szyfrowany i w 100% anonimowy czat wsparcia w czasie rzeczywistym oraz stabilną obsługę bazy danych.

---

## 3. Dopasowane Warianty Wdrożenia (Cennik)

Prezentowane pakiety zostały zaprojektowane tak, aby realizować Państwa cele statutowe, gwarantować pełne bezpieczeństwo prawne oraz ułatwić rozliczenie zewnętrznych funduszy i dotacji projektowych.

### 🥉 I. PAKIET DEDYKOWANY (Wdrożenie Statutowe)
**Inwestycja: 14 500 zł netto**  
*To kompletny, w 100% funkcjonalny, produkcyjny system realizujący pełen zakres Państwa zapytania ofertowego. Nie jest to wersja "okrojona" – to niezależne, szybkie i bezpieczne rozwiązanie Next.js dla KAS.*

*   **Projekt UX/UI (Mobile-First):** Indywidualny, ciepły i budzący zaufanie projekt graficzny dopasowany do percepcji młodzieży i rodziców.
*   **Czat Wsparcia w Czasie Rzeczywistym (Real-time):** Szyfrowany komunikator dla młodzieży działający na żywo bez przeładowywania strony. Gwarantuje 100% anonimowości (zero cookies, zero logowania IP). Zawiera intuicyjny, bezpieczny panel operatora dla dyżurnych psychologów Stowarzyszenia.
*   **Bezawaryjny Kalendarz Zapisów Online:** Stabilny system rezerwacji konsultacji eliminujący błąd `Kalendarz.php`. Rejestracja odbywa się płynnie i błyskawicznie, a dane trafiają prosto do panelu zarządzania.
*   **Moduł Darowizn i Płatności Online:** Integracja z systemami szybkich płatności (BLIK, karty płatnicze, przelewy online) bez prowizji systemowych dla pośredników (płacą Państwo tylko minimalną prowizję operatora płatności, np. Tpay/Stripe).
*   **Pełna Dostępność Cyfrowa (WCAG 2.1 AA):** Natywne dostosowanie kodu pod czytniki ekranu dla osób niewidomych, nawigację klawiaturą oraz widget ułatwień dostępu (kontrasty, rozmiary czcionek).
*   **Wdrożenie i Onboarding:** Przekazanie kompletu kodów źródłowych, instalacja systemu na bezpiecznym serwerze, dedykowane instruktaże wideo dla kadry oraz **90 dni mojej osobistej, bezpłatnej opieki powdrożeniowej i gwarancji technicznej (SLA)**.

---

### 🥈 II. PAKIET OPTYMALNY (Cyfrowy Rozwój) — *REKOMENDOWANY*
**Inwestycja: 29 000 zł netto**  
*Rozszerza Pakiet Dedykowany o zaawansowane narzędzia operacyjne dla zespołu oraz formalne raporty niezbędne dla audytorów unijnych i rządowych. Pozwala odzyskać około 10-15 godzin pracy biurowej tygodniowo.*

*   **Wszystko to, co w Pakiecie Dedykowanym (w tym pełny czat real-time, WCAG i system zapisów).**
*   **Zaszyfrowany System CRM (Supabase):** Dedykowana, chroniona podwójnym szyfrowaniem wewnętrzna baza danych ułatwiająca psychologom prowadzenie poufnych kart pacjentów, historii spraw, notatek terapeutycznych oraz zarządzanie grafikiem dyżurów.
*   **Automatyzacja Powiadomień (SMS & E-mail):** Integracja z bramkami SMS i pocztą – system automatycznie wysyła podopiecznym przypomnienia o terminach konsultacji, co redukuje liczbę "pustych rezerwacji" i eliminuje potrzebę ręcznego obdzwaniania pacjentów.
*   **Formalny Raport Zgodności WCAG 2.1 AA:** Profesjonalna, pisemna dokumentacja techniczna z audytu dostępności cyfrowej i weryfikacji kodu. Jest to kluczowy i bezwzględnie wymagany załącznik przy rozliczaniu dużych dotacji unijnych (np. z programów EOG, norweskich czy FRSE) – gwarantuje Państwu bezproblemowe przejście kontroli finansowej.
*   **Rozszerzone Wsparcie:** 12 miesięcy priorytetowej opieki technicznej i asysty deweloperskiej oraz dedykowana platforma e-learningowa z wideo-szkoleniami dla nowych wolontariuszy KAS.

---

### 🥇 III. PAKIET MAKSYMALNY (Automatyzacja Enterprise & AI)
**Inwestycja: 48 000 zł netto**  
*Pełna transformacja cyfrowa i automatyzacja procesów z wykorzystaniem modeli sztucznej inteligencji. Zaprojektowana dla organizacji obsługujących bardzo dużą liczbę zgłoszeń, chcących odciążyć kadrę i zredukować koszty operacyjne do minimum.*

*   **Wszystko to, co w Pakiecie Optymalnym (w tym CRM, czat real-time, WCAG, system zapisów i automatyzację SMS).**
*   **Wirtualny Asystent AI (24/7):** Inteligentny, całodobowy doradca oparty na bezpiecznych, komercyjnych modelach LLM (np. Google Gemini), przeszkolony na bazie Waszych dokumentów i Bazy Wsparcia. Automatycznie nawiguje użytkowników po placówkach pomocowych w Radomiu i udziela podstawowych informacji.
*   **Inteligentna Kwalifikacja Zgłoszeń:** System AI, który w czasie rzeczywistym analizuje stopień krytyczności i emocjonalności wypowiedzi na czacie, pomagając psychologom natychmiastowo wyłapać i priorytetowo obsłużyć najtrudniejsze sytuacje kryzysowe.
*   **Zaawansowane Integracje n8n:** Autonomiczne przepływy pracy (workflows) łączące system rezerwacji, czat i CRM bezpośrednio z Kalendarzem Google oraz wysyłające natychmiastowe, alarmowe powiadomienia SMS dla koordynatora o krytycznych zgłoszeniach.
*   **Certyfikowany Audyt Zewnętrzny & Ustawowa Deklaracja Dostępności:** Formalne wystawienie ustawowego dokumentu Deklaracji Dostępności cyfrowej poparte zewnętrznym audytem.
*   **Wsparcie SLA Premium:** 24 miesiące gwarantowanego wsparcia technicznego z priorytetowym czasem reakcji na błędy krytyczne do 4 godzin (dedykowany kanał WhatsApp).

---

## 4. Tabela Porównawcza Funkcjonalności

| Funkcjonalność / Korzyść | PAKIET DEDYKOWANY <br>(14 500 zł) | PAKIET OPTYMALNY <br>(29 000 zł) | PAKIET MAKSYMALNY <br>(48 000 zł) |
| :--- | :---: | :---: | :---: |
| **Szybka strona Next.js + CMS** (SSG/CDN) | **TAK** | **TAK** | **TAK** |
| **Błyskawiczne ładowanie na mobile** (<1.5s) | **TAK** | **TAK** | **TAK** |
| **Bezawaryjny system zapisów** (bez PHP) | **TAK** | **TAK** | **TAK** |
| **Czat wsparcia w czasie rzeczywistym** (Real-time) | **TAK** | **TAK** | **TAK** |
| **100% Anonimowość i RODO Art. 9** | **TAK** | **TAK** | **TAK** |
| **Moduł darowizn i płatności BLIK/online** | **TAK** | **TAK** | **TAK** |
| **Natywna dostępność WCAG 2.1 AA** (w kodzie) | **TAK** | **TAK** | **TAK** |
| **Baza Wiedzy / Instruktaże Wideo** | **TAK** | **TAK** | **TAK** |
| **Bezpłatna opieka techniczna i gwarancja** | **90 dni (3 miesiące)** | **12 miesięcy (1 rok)** | **24 miesiące (2 lata)** |
| **Szyfrowany CRM dla psychologów** (notatki, karty) | *NIE* | **TAK** | **TAK** |
| **Automatyczne powiadomienia i przypomnienia SMS** | *NIE* | **TAK** | **TAK** |
| **Pisemny raport WCAG pod audyty EOG/FRSE** | *NIE* | **TAK** | **TAK** |
| **Szkolenia wideo dla wolontariuszy KAS** | *NIE* | **TAK** | **TAK** |
| **Asystent AI 24/7 dla młodzieży** (Baza Pomocy) | *NIE* | *NIE* | **TAK** |
| **Automatyczna ocena krytyczności spraw (AI)** | *NIE* | *NIE* | **TAK** |
| **Zaawansowane integracje n8n & webhooki** | *NIE* | *NIE* | **TAK** |
| **Certyfikowana Deklaracja Dostępności** | *NIE* | *NIE* | **TAK** |
| **Priorytetowe Wsparcie SLA Premium** (reakcja <4h) | *NIE* | *NIE* | **TAK** |

---

## 5. Finansowanie i Rozliczanie Grantów Zewnętrznych

Jako partner rozumiejący specyfikę trzeciego sektora, dostosowuję model finansowy tak, aby nie obciążać bieżących funduszy administracyjnych Stowarzyszenia KAS. Całość inwestycji może zostać w 100% sfinansowana i bezpiecznie rozliczona bezpośrednio z **Waszych zewnętrznych funduszy projektowych oraz dotacji celowych** (np. unijnych EFS+, norweskich/EOG czy programów FRSE, takich jak realizowany przez Was projekt „Aktywnie w kierunku zatrudnienia”):

*   **Budżet promocyjno-informacyjny:** Przeznaczenie części budżetu promocyjnego (zazwyczaj od 1% do 5% całkowitej wartości grantu) na nowoczesny, bezpieczny portal upowszechniający rezultaty projektu. Zarówno Pakiet Dedykowany, jak i Optymalny, idealnie mieszczą się w tych widełkach przy Waszych obecnych projektach.
*   **Działania na rzecz dostępności cyfrowej:** Koszty wdrożenia WCAG 2.1 AA, audytu zerowego i wystawienia formalnego raportu mogą być rozliczone bezpośrednio jako obowiązkowe działania na rzecz likwidacji barier dla beneficjentów z niepełnosprawnościami.
*   **Wdrożenie innowacyjnych narzędzi wsparcia:** Czat w czasie rzeczywistym, system zapisów oraz CRM to bezpośrednie narzędzia realizacji zadań statutowych i projektowych (prowadzenie Punktów Wsparcia i Informacji), kwalifikujące się do kosztów merytorycznych.

**Ułatwienie rozliczenia (Płatność etapowa):**  
Wystawiam faktury VAT i dzielę całą inwestycję na **5 niezależnych etapów rozliczeniowych**. Umożliwia to Państwa księgowości bezproblemowe przypisanie poszczególnych kwot do konkretnych transz dotacji i okresów sprawozdawczych w raportach dla grantodawców.

---

## 6. Gwarancja Bezpieczeństwa (Odwrócenie Ryzyka)

Moja współpraca opiera się na pełnym zaufaniu i partnerskich zasadach, dlatego biorę całe ryzyko projektowe na siebie:
1.  **Żelazna Gwarancja 7 Dni (Etap 1):** Jeśli po zaprezentowaniu makiety graficznej i koncepcji UX/UI w Etapie 1 uznają Państwo, że moja wizja nie pokrywa się z celami KAS – bezproblemowo rozwiązujemy umowę, a ja zwracam Państwu 100% wpłaconej zaliczki deweloperskiej. Bez pytań, bez ukrytych kosztów. Wasze środki projektowe są w pełni bezpieczne.
2.  **Opieka powdrożeniowa SLA:** Przez cały okres darmowego wsparcia (od 90 dni do 24 miesięcy) osobiście czuwam nad stabilnością kodu, poprawnością działania czatu real-time oraz bezpieczeństwem serwera.

---

## 7. Jak Rozpocząć? (Low-Friction CTA)

Pobierz tę ofertę w formacie PDF, aby móc ją wygodnie wydrukować, przeanalizować i przedstawić na najbliższym spotkaniu Zarządu Stowarzyszenia KAS.

Jeśli chcą Państwo po prostu skonsultować techniczne aspekty czatu, kalendarza czy integracji CMS – zapraszam do kontaktu. 

**Szanuję Państwa czas: jeśli plany Stowarzyszenia uległy zmianie lub ten projekt nie jest teraz dla Państwa priorytetem, krótka, jednozdaniowa informacja zwrotna (nawet o treści: *"nie jesteśmy obecnie zainteresowani"*) będzie dla mnie ogromną pomocą.**

*   📧 **kontakt@molendadevelopment.pl**
*   [📄 **Pobierz Ofertę PDF (Dla Zarządu)**]
