import { GoogleGenAI } from '@google/genai';
import { 
  EvidenceSummary, 
  DetailedCodeSmells, 
  QuickCriticalIssue, 
  SiteType, 
  SITE_TYPE_LABELS 
} from '../types';
import { pluralizePolish } from './crawler';

export async function generateGeminiReport(
  targetUrl: string,
  avgScore: number,
  performanceScore: number,
  seoScore: number,
  detectedPlatform: string,
  wafDetected: boolean,
  codeSmells: DetailedCodeSmells,
  lossPercentage: number,
  geminiKey: string,
  siteType: SiteType = 'services',
  evidence?: EvidenceSummary,
  quickIssues?: QuickCriticalIssue[]
): Promise<string> {
  const isEcommerce = siteType === 'ecommerce';
  
  let entityName = 'Serwis firmowy / strona usługowa';
  let conversionTerm = 'zapytań ofertowych i nowych kontaktów';
  let goalDescription = 'pozyskiwanie zapytań ofertowych i nowych klientów biznesowych';
  let lossDescription = 'utrata zapytań ofertowych i kontaktów na rzecz bezpośredniej konkurencji';
  let architectRoleDescription = 'rekomendowane wdrożenie obejmuje optymalizację ścieżek kontaktu i naprawę semantyki w 24-48h';

  if (siteType === 'ecommerce') {
    entityName = 'Sklep internetowy e-commerce';
    conversionTerm = 'transakcji i sprzedaży e-commerce';
    goalDescription = 'przychód, konwersja koszyka i wysoki zwrot z kampanii produktowych';
    lossDescription = 'porzucone koszyki i bezpośrednia utrata przychodów ze sprzedaży';
    architectRoleDescription = 'rekomendowane wdrożenie obejmuje konfigurację warstwy dataLayer oraz uporządkowanie nagłówków i canonicali w 24-48 godzin';
  } else if (siteType === 'gov_public') {
    entityName = 'Portal urzędu / administracji publicznej (BIP)';
    conversionTerm = 'sprawnej obsługi mieszkańców i procedur e-urzędu';
    goalDescription = 'sprawna obsługa spraw mieszkańców, dostępność cyfrowa (WCAG 2.1 AA) i odciążenie urzędu';
    lossDescription = 'utrudnienia w załatwianiu spraw przez e-obywateli, kolejki w urzędzie i ryzyko kar finansowych do 10 000 zł z ustawy o dostępności cyfrowej';
    architectRoleDescription = 'rekomendowane wdrożenie obejmuje oficjalną deklarację dostępności WCAG 2.1 AA, uporządkowanie linków do procedur i eliminację duplikatów w 24-48h';
  } else if (siteType === 'education') {
    entityName = 'Portal placówki oświatowej / szkoły';
    conversionTerm = 'skuteczności naboru i zaufania rodziców';
    goalDescription = 'rekrutacja nowych roczników, zaufanie rodziców i przejrzystość planów lekcji/komunikatów';
    lossDescription = 'odpływ kandydatów w naborze do lepiej widocznych szkół i chaos komunikacyjny z rodzicami';
    architectRoleDescription = 'rekomendowane wdrożenie obejmuje uporządkowanie struktury semantycznej, unifikację tytułów i dostępności cyfrowej w 24-48h';
  } else if (siteType === 'ngo_foundation') {
    entityName = 'Portal organizacji pożytku publicznego / NGO';
    conversionTerm = 'zgłoszeń podopiecznych i wsparcia statutowego';
    goalDescription = 'dotarcie do osób w kryzysie/podopiecznych, zaufanie darczyńców 1.5% oraz komisji grantowych';
    lossDescription = 'bariery w dotarciu do bezpłatnej pomocy statutowej oraz spadek wpłat 1.5% podatku i zaufania grantodawców';
    architectRoleDescription = 'rekomendowane wdrożenie obejmuje uporządkowanie architektury informacji, eliminację kanibalizacji fraz i zabezpieczenie formularzy w 24-48h';
  } else if (siteType === 'local_services') {
    entityName = 'Strona usług lokalnych';
    conversionTerm = 'bezpośrednich zapytań i telefonów od klientów z okolicy';
    goalDescription = 'ułatwienie kontaktu, widoczność w Google i bezpośrednie telefony od klientów z okolicy';
    lossDescription = 'utrudnienia w kontakcie dla klientów z okolicy oraz niższa widoczność w lokalnych wynikach wyszukiwania';
    architectRoleDescription = 'rekomendowane wdrożenie obejmuje implementację klikalnych przycisków szybkiego kontaktu, uporządkowanie struktury Title i wdrożenie mikrodanych LocalBusiness w 24-48h';
  }

  const pagesScanned = evidence?.totalPages || 1;
  const duplicateTitlesCount = evidence?.duplicateTitleGroups?.length || 0;
  const missingH1Count = evidence?.missingH1Count || 0;
  const thinContentCount = evidence?.thinContentCount || 0;
  const missingCanonicalCount = evidence?.missingCanonicalCount || 0;
  const avgResponseTime = evidence?.avgResponseTimeMs || 80;

  const adsInfo = evidence?.adsAndTracking;
  const trackingIssuesText = adsInfo?.issues && adsInfo.issues.length > 0
    ? `\nTELEMETRYKA I ANALITYKA:\n${adsInfo.issues.map(i => `- [${i.severity.toUpperCase()}] ${i.title}: ${i.impact}`).join('\n')}`
    : '';

  const quickIssuesText = quickIssues && quickIssues.length > 0
    ? `\nZIDENTYFIKOWANE GŁÓWNE KWESTIE TECHNICZNE:\n${quickIssues.map(q => `- ${q.title} (${q.shortDesc})`).join('\n')}`
    : '';

  const empiricalEvidenceText = evidence ? `
DANE Z PRZEANALIZOWANYCH ${pagesScanned} PODSTRON:
- Zbadane podstrony: ${pagesScanned} szt. (średni czas odpowiedzi: ${avgResponseTime}ms)
- Podstrony ze zduplikowanymi tagami Title: ${duplicateTitlesCount > 0 ? `${duplicateTitlesCount} grup podstron ze zduplikowanymi tytułami` : 'Brak (Wszystkie unikalne)'}
- Podstrony bez nagłówka H1: ${missingH1Count} szt.
- Podstrony z ubogą treścią (Thin Content <200 słów): ${thinContentCount} szt.
- Podstrony bez tagu Canonical: ${missingCanonicalCount} szt.
${trackingIssuesText}
${quickIssuesText}
` : '';

  const buildersText = codeSmells.pageBuilders && codeSmells.pageBuilders.length > 0
    ? `\n- Wykryte Page Buildery: ${codeSmells.pageBuilders.join(', ')}`
    : '';
  const trackersText = codeSmells.trackers && codeSmells.trackers.length > 0
    ? `\n- Skrypty śledzące 3rd-party: ${codeSmells.trackers.join(', ')}`
    : '';
  const vitalsText = codeSmells.fcp || codeSmells.lcp
    ? `\n- Core Web Vitals: FCP = ${codeSmells.fcp || 'n/a'}, LCP = ${codeSmells.lcp || 'n/a'}`
    : '';

  const codeSmellsText = wafDetected
    ? "UWAGA: Serwis chroniony przez WAF/Cloudflare."
    : `Architektura kodu:\n- Biblioteki (jQuery): ${codeSmells.jquery ? 'Wykryto jQuery' : 'Brak'}\n- Skrypty blokujące renderowanie (bez async/defer): ${codeSmells.badScripts} szt.\n- Rozmiar drzewa DOM: ${codeSmells.domElements} elementów\n- Style inline: ${codeSmells.inlineStyles} szt.${buildersText}${trackersText}${vitalsText}`;

  // --- ULEPSZONA DYNAMIKA PROMPTU DLA GEMINI ---
  const isHighScore = avgScore >= 85;
  const systemInstruction = `
Jesteś obiektywnym silnikiem analizy technicznej na platformie audytowej Marcina Molendy.
Generujesz zwięzłą, obiektywną i w 100% zrozumiałą ocenę techniczną witryny dla polskiego przedsiębiorcy (właściciela firmy).

TWARDE GUARDRAILE:
1. PISZ W CZYSTYM, NATURALNYM JĘZYKU POLSKIM DLA PRZEDSIĘBIORCÓW:
   - Targetem są polscy przedsiębiorcy, którzy nie są programistami i często nie znają języka angielskiego.
   - Kategoryczny ZAKAZ sztucznych kalk językowych z angielskiego, np. "exemplaryczna jakość" (użyj: "wzorowa jakość", "bardzo wysoka jakość kodu"), "performantny", "robustny", "scalowalny", "implementować".
   - Kategoryczny ZAKAZ obcojęzycznych skrótowców korporacyjnych, np. "RFP" (Request for Proposal). Pisz po prostu: "zapytania ofertowe", "nowi klienci".
   - Pisz po ludzku, profesjonalnie: "błyskawiczny czas odpowiedzi serwera", "czysty kod bez zbędnych obciążeń", "pełna gotowość do pozyskiwania klientów".
2. PISZ WYŁĄCZNIE W 3. OSOBIE / BEZOSOBOWO:
   - Kategoryczny ZAKAZ zwrotów typu "Jako architekt przeanalizowałem...", "Wdrożę...", "Zoptymalizuję...".
   - Pisz bezosobowo: "Analiza techniczna serwisu wykazała...", "Zidentyfikowano...", "Rekomendowane wdrożenie techniczne w 24-48h obejmuje...".
3. SPOKÓJ, BIZNESOWY REALIZM (ZERO STRASZENIA):
   - Zakaz tanich chwytów marketingowych: żadnych "wycieków zysku", "paraliżu", "przepalania budżetu" ani założeń o "konkurencji z sąsiedniej ulicy". Pisz rzetelnie o kodzie, indeksacji i doświadczeniu użytkowników.
4. BEZWZGLĘDNY ZAKAZ ZAKŁADANIA BRANŻY W CIEMNO:
   - Nigdy nie używaj słów "gabinet" czy "pacjent" dla profili usługowych, chyba że treść audytu wprost dotyczy lekarza/stomatologa. Używaj pojęć ogólnych: klienci, odbiorcy, użytkownicy.
5. PRAWDA DANYCH:
   - Nigdy nie wspominaj o kampaniach płatnych (Google Ads), jeśli serwis ich nie prowadzi.
6. ZASADA INTERPUNKCJI:
   - Kategoryczny ZAKAZ używania myślników pauzowych (—) oraz półpauzowych (–). Używaj wyłącznie przecinków, dwukropków, nawiasów lub zwykłego łącznika (-).
7. FORMA:
   - Maksymalnie 3 zwięzłe, merytoryczne zdania (lub 2 krótkie akapity). Czysty Markdown (pogrubienia kluczowych metryk).
`.trim();

  let userPrompt = '';
  if (isHighScore) {
    userPrompt = `
Serwis ${entityName} (${targetUrl}) uzyskał bardzo wysoki wynik ${avgScore}/100.
Stack technologiczny: ${detectedPlatform}. Średni czas odpowiedzi serwera: ${avgResponseTime}ms.
Przeanalizowano podstron: ${pagesScanned}. Profil: ${SITE_TYPE_LABELS[siteType] || 'Usługi'}.

Zadanie:
Napisz zwięzłą ocenę techniczną w 3. osobie (maksymalnie 3 zdania), naturalnym językiem polskim zrozumiałym dla właściciela firmy:
1. Ocena techniczna: Wskaż wzorową jakość kodu, krótki czas odpowiedzi serwera (${avgResponseTime}ms) oraz brak długu technologicznego na platformie ${detectedPlatform}.
2. Gotowość biznesowa: Zauważ, że fundamenty techniczne są w pełni stabilne i gotowe na realizację celów biznesowych: ${goalDescription}.
3. Rekomendacja strategiczna: Podkreśl, że dalsze modyfikacje kodu nie są potrzebne, a zasoby warto skierować na budowanie autorytetu, widoczności oferty i pozyskiwanie nowych klientów.
`.trim();
  } else {
    userPrompt = `
Serwis ${entityName} (${targetUrl}) uzyskał wynik ${avgScore}/100.
Wykryta platforma: ${detectedPlatform}. Profil organizacji: ${SITE_TYPE_LABELS[siteType] || 'Usługi'}.
${empiricalEvidenceText}
${codeSmellsText}
Zadanie:
Napisz precyzyjną, rzeczową diagnozę techniczną w 3. osobie lub bezosobowo (maksymalnie 3 zdania), naturalnym językiem zrozumiałym dla przedsiębiorcy:
1. Zdiagnozuj 1-2 najważniejsze realne usterki z powyższych dowodów (np. duplikaty Title, brak H1, blokujące skrypty JS). Zakaz wymyślania usterek nieobecnych w dowodach!
2. Pokaż wpływ techniczny: Wyjaśnij szacowany spadek ~${lossPercentage}% w obszarze: ${conversionTerm} (${lossDescription}). Zachowaj spokojny, inżynieryjny ton.
3. Plan działania: Wskaż zwięźle w 3. osobie rekomendowany zakres wdrożenia w 24-48h bez burzenia obecnej strony (${architectRoleDescription}).
`.trim();
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
      contents: userPrompt,
      config: { 
        systemInstruction: systemInstruction,
        temperature: 0.3 // niższa temperatura = większa dyscyplina i brak halucynacji
      }
    });

    if (response.text && response.text.trim().length > 20) {
      let cleaned = response.text.trim();
      cleaned = cleaned
        .replace(/exemplaryczn[a-ząęółśżźćń]+/gi, 'wzorową')
        .replace(/\bexemplary\b/gi, 'wzorowy')
        .replace(/\(?\bRFP\b\)?/gi, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/[\u2013\u2014]/g, '-');
      return cleaned;
    }
  } catch {
    // W razie limitu Gemini (429) lub braku połączenia odpalamy deterministyczny fallback
  }

  return generateDeterministicReport(targetUrl, avgScore, detectedPlatform, lossPercentage, isEcommerce, evidence, codeSmells, siteType);
}

/**
 * Deterministyczny generator raportu w razie braku klucza GEMINI_API_KEY lub rate limitu.
 */
export function generateDeterministicReport(
  targetUrl: string,
  avgScore: number,
  platform: string,
  lossPercentage: number,
  isEcommerce: boolean,
  evidence?: EvidenceSummary,
  codeSmells?: DetailedCodeSmells,
  siteType: SiteType = 'services'
): string {
  let entity = 'witryny';
  let conversionTerm = 'zapytań ofertowych B2B';

  if (siteType === 'ecommerce') {
    entity = 'sklepu';
    conversionTerm = 'sprzedaży e-commerce';
  } else if (siteType === 'gov_public') {
    entity = 'portalu urzędu';
    conversionTerm = 'sprawnej obsługi mieszkańców';
  } else if (siteType === 'education') {
    entity = 'portalu szkoły';
    conversionTerm = 'zgłoszeń rekrutacyjnych i zaufania rodziców';
  } else if (siteType === 'ngo_foundation') {
    entity = 'portalu organizacji';
    conversionTerm = 'zgłoszeń podopiecznych i wpłat statutowych';
  } else if (siteType === 'local_services') {
    entity = 'strony usługowej';
    conversionTerm = 'rezerwacji i telefonów klientów';
  }

  if (avgScore >= 85) {
    let strategicGoalAdvice = 'realizację celów i pozyskiwanie odbiorców';
    if (siteType === 'ngo_foundation') {
      strategicGoalAdvice = 'pozyskiwanie 1.5% podatku, darowizn statutowych oraz budowanie zaufania darczyńców';
    } else if (siteType === 'gov_public') {
      strategicGoalAdvice = 'cyfryzację usług dla mieszkańców oraz rozwój e-urzędu';
    } else if (siteType === 'education') {
      strategicGoalAdvice = 'rekrutację uczniów oraz cyfrową komunikację z rodzicami';
    } else if (siteType === 'local_services') {
      strategicGoalAdvice = 'skalowanie rezerwacji wizyt i dominację w lokalnym Google Maps';
    } else if (siteType === 'b2b_services') {
      strategicGoalAdvice = 'pozyskiwanie kwalifikowanych leadów B2B i budowanie autorytetu branżowego';
    } else if (siteType === 'ecommerce') {
      strategicGoalAdvice = 'skalowanie rentowności sprzedaży (ROAS) i optymalizację retencji klientów (LTV)';
    }

    return `Architektura **${targetUrl}** reprezentuje najwyższy standard inżynieryjny (${avgScore}/100). Kod jest czysty, serwer odpowiada błyskawicznie (średnio ${evidence?.avgResponseTimeMs || 80}ms), a struktura podstron nie wykazuje długu technologicznego. 

Dalsze inwestowanie w mikrosekundowe optymalizacje nie przyniesie zauważalnego zwrotu z inwestycji (ROI) - infrastruktura jest w pełni gotowa na realizację kluczowych celów i pozyskiwanie klientów.

**💡 Rekomendacja strategiczna:** Skieruj zasoby na ${strategicGoalAdvice}, bo technologicznie serwis wyprzedza 95% konkurencji rynkowej.`;
  }

  const issues: string[] = [];

  // 1. Krytyczne błędy telemetryki
  const trackingIssue = evidence?.adsAndTracking?.issues?.find(i => i.severity === 'critical');
  if (trackingIssue) {
    issues.push(`**${trackingIssue.title.toLowerCase()}**, przez co algorytmy reklamowe optymalizują kampanie po omacku`);
  }

  if (evidence && evidence.duplicateTitleGroups.length > 0) {
    const grpCount = evidence.duplicateTitleGroups.length;
    issues.push(`aż **${pluralizePolish(grpCount, 'grupę', 'grupy', 'grup')} ze zduplikowanymi tagami Title**, co wywołuje auto-kanibalizację fraz w Google`);
  }
  if (evidence && evidence.missingH1Count > 0) {
    issues.push(`**${pluralizePolish(evidence.missingH1Count, 'podstronę', 'podstrony', 'podstron')} bez nagłówka H1**, przez co roboty wyszukiwarek i modele AI gubią kontekst semantyczny`);
  }
  if (evidence && evidence.missingCanonicalCount > 0) {
    issues.push(`**${pluralizePolish(evidence.missingCanonicalCount, 'adres', 'adresy', 'adresów')} bez linku kanonicznego (canonical)**`);
  }
  if (codeSmells?.pageBuilders && codeSmells.pageBuilders.length > 0) {
    issues.push(`narzut kodu z builderów (**${codeSmells.pageBuilders.join(', ')}**), rozdmuchujący drzewo DOM do ${codeSmells.domElements} elementów`);
  }

  const hasStructuralIssues =
    (evidence?.missingH1Count || 0) > 0 ||
    (evidence?.duplicateTitleGroups?.length || 0) > 0 ||
    (evidence?.missingCanonicalCount || 0) > 0;

  if (!hasStructuralIssues && issues.length === 0) {
    if (codeSmells?.domElements && codeSmells.domElements > 1200) {
      issues.push(`rozmiar drzewa DOM (${codeSmells.domElements} elementów), który warto odchudzić pod kątem Core Web Vitals na urządzeniach mobilnych`);
    }
    if (evidence?.adsAndTracking && !evidence.adsAndTracking.hasGoogleAds && !evidence.adsAndTracking.hasGoogleTagManager && (siteType === 'ecommerce' || siteType === 'b2b_services')) {
      issues.push(`brak wdrożonych tagów Google Tag Manager i Google Ads przed planowanym skalowaniem kampanii płatnych`);
    }
  }

  const issuesSummary = issues.length > 0
    ? issues.slice(0, 3).join(', ')
    : (hasStructuralIssues
        ? `brak odpowiednich nagłówków semantycznych i błędy kanonizacji`
        : `rezerwy optymalizacyjne w czasie renderowania DOM oraz brak telemetryki`);

  let solutionText: string;
  let quickStepText: string;

  if (hasStructuralIssues) {
    if (siteType === 'ecommerce') {
      solutionText = `rekomendowane wdrożenie obejmuje konfigurację dedykowanej warstwy dataLayer oraz uporządkowanie nagłówków i canonicali w 24-48 godzin.`;
      quickStepText = (trackingIssue || !evidence?.adsAndTracking?.hasAddToCartTracking)
        ? `Wdrożenie precyzyjnego śledzenia zdarzeń koszykowych (add_to_cart) oraz wyeliminowanie zduplikowanych tytułów stron usprawnia działanie algorytmów analitycznych.`
        : `Wyeliminowanie zduplikowanych tytułów stron oraz wdrożenie tagów canonical zabezpiecza pozycje w Google i zapobiega auto-kanibalizacji.`;
    } else if (siteType === 'gov_public') {
      solutionText = `rekomendowane wdrożenie obejmuje publikację oficjalnej deklaracji dostępności WCAG 2.1 AA, uporządkowanie linków kanonicznych i eliminację błędów semantycznych w 24-48 godzin.`;
      quickStepText = `Wdrożenie Deklaracji Dostępności WCAG oraz uporządkowanie tytułów procedur ułatwia mieszkańcom korzystanie z portalu i spełnia wymogi ustawowe.`;
    } else if (siteType === 'education') {
      solutionText = `rekomendowane wdrożenie obejmuje uporządkowanie struktury nagłówków i tytułów, optymalizację czytelności mobilnej oraz wdrożenie tagów canonical w 24-48 godzin.`;
      quickStepText = `Wdrożenie unikalnych tytułów podstron rekrutacyjnych i uzupełnienie brakujących H1 wzmacnia pozycję szkoły w wyszukiwarkach przed okresem naboru.`;
    } else if (siteType === 'ngo_foundation') {
      solutionText = `rekomendowane wdrożenie obejmuje eliminację kanibalizacji słów kluczowych, uzupełnienie tagów alternatywnych i zabezpieczenie formularzy w 24-48 godzin.`;
      quickStepText = `Wdrożenie unikalnych tytułów podstron, tagów canonical oraz zabezpieczenia formularzy ułatwia podopiecznym dotarcie do pomocy statutowej.`;
    } else if (siteType === 'local_services') {
      solutionText = `rekomendowane wdrożenie obejmuje uruchomienie klikalnych przycisków tel: na smartfonach, uzupełnienie mikrodanych LocalBusiness i uporządkowanie struktury podstron w 24-48 godzin.`;
      quickStepText = `Uruchomienie klikalnego numeru telefonu w nagłówku oraz uporządkowanie tagów lokalnych ułatwia bezpośredni kontakt klientom z okolicy.`;
    } else {
      solutionText = `rekomendowane wdrożenie obejmuje uporządkowanie struktury semantycznej witryny, wdrożenie unikalnych tagów canonical oraz optymalizację architektury kodu w 24-48 godzin.`;
      quickStepText = `Uporządkowanie struktury nagłówków H1, wdrożenie unikalnych tagów Title i kanonicznych adresów zabezpiecza ruch organiczny w wyszukiwarkach.`;
    }
  } else {
    if (siteType === 'ecommerce') {
      solutionText = `struktura SEO i nagłówki są wzorowe. Rekomendowana jest optymalizacja renderowania DOM i konfiguracja telemetryki e-commerce w 24-48 godzin.`;
      quickStepText = `Wdrożenie zaawansowanej analityki oraz optymalizacja renderowania przygotowują sklep do skalowania.`;
    } else if (siteType === 'gov_public' || siteType === 'education' || siteType === 'ngo_foundation') {
      solutionText = `struktura semantyczna i indeksacja są czyste. Rekomendowana jest optymalizacja dostępności cyfrowej i szybkości renderowania w 24-48 godzin.`;
      quickStepText = `Optymalizacja DOM i weryfikacja kontrastów WCAG zapewniają dostępność serwisu dla wszystkich użytkowników.`;
    } else {
      solutionText = `struktura semantyczna i indeksacja są czyste. Rekomendowana jest konfiguracja telemetryki zdarzeń oraz optymalizacja czasu renderowania w 24-48 godzin.`;
      quickStepText = `Wdrożenie analityki zdarzeń i przyspieszenie renderowania zabezpieczają ruch w witrynie.`;
    }
  }

  const lossText = hasStructuralIssues
    ? `Przez te niedociągnięcia strukturalne serwis notuje szacunkowy spadek **${lossPercentage}% ${conversionTerm}**.`
    : `Mimo dobrej struktury SEO, rezerwy w czasie renderowania mogą obniżać potencjał w obszarze: **${conversionTerm}** o szacunkowo **${lossPercentage}%**.`;

  return `Szczegółowy audyt **${targetUrl}** (${platform}) wykazał wynik **${avgScore}/100**. W zbadanej próbce zdiagnozowano kluczowe kwestie techniczne: ${issuesSummary}.

${lossText}

Dobra wiadomość: nie ma potrzeby budowy ${entity} od nowa - ${solutionText}

**💡 Rekomendowany krok optymalizacyjny:** ${quickStepText}`;
}

/**
 * Automatyczna klasyfikacja profilu witryny za pomocą Gemini AI
 */
export async function classifySiteTypeWithAI(
  domain: string,
  homepageTitle: string,
  homepageDescription: string,
  homepageH1: string | undefined,
  geminiKey: string
): Promise<SiteType | null> {
  if (!geminiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const prompt = `
Przeanalizuj poniższe dane witryny internetowej i zaklasyfikuj ją do DOKŁADNIE JEDNEJ z kategorii:
- ecommerce (sklep internetowy, koszyk, bezpośrednia sprzedaż produktów online do klienta)
- b2b_services (usługi B2B, dystrybutor hurtowy, produkcja, OZE dla instalatorów, doradztwo biznesowe, hurtownia, agencja, software house)
- local_services (usługi lokalne dla klientów indywidualnych B2C: gabinet medyczny, stomatolog, kosmetyczka, fryzjer, warsztat samochodowy, restauracja)
- gov_public (WYŁĄCZNIE oficjalne instytucje publiczne, urzędy gmin, urzędy miast, starostwa powiatowe, ministerstwa, BIP. Kategoryczny zakaz przypisywania prywatnych firm do tej kategorii!)
- education (szkoły podstawowe, średnie, przedszkola, uczelnie wyższe)
- ngo_foundation (fundacje, stowarzyszenia, organizacje pożytku publicznego OPP, zbiórki charytatywne)

Dane witryny:
Domena: ${domain}
Tytuł strony: ${homepageTitle}
Opis meta: ${homepageDescription}
Nagłówek H1: ${homepageH1 || 'brak'}

Zwróć TYLKO jedno słowo będące identyfikatorem kategorii (bez formatowania, bez cudzysłowów):
ecommerce LUB b2b_services LUB local_services LUB gov_public LUB education LUB ngo_foundation
`.trim();

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
      contents: prompt,
      config: { temperature: 0.1 }
    });

    const raw = response.text ? response.text.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') : '';
    const validTypes: SiteType[] = [
      'ecommerce',
      'b2b_services',
      'local_services',
      'gov_public',
      'education',
      'ngo_foundation'
    ];

    if (validTypes.includes(raw as SiteType)) {
      return raw as SiteType;
    }
  } catch (err) {
    console.warn('[Gemini AI] Classification error, falling back to heuristic:', err);
  }

  return null;
}
