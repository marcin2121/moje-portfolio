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
  let conversionTerm = 'zapytań ofertowych i leadów B2B';
  let goalDescription = 'pozyskiwanie zapytań ofertowych (RFP) i nowych klientów biznesowych';
  let lossDescription = 'utrata zapytań ofertowych i kontraktów B2B na rzecz bezpośredniej konkurencji';
  let architectRoleDescription = 'jako Senior Architect wdrożę w 24-48h uszczelnienie lejków i naprawę semantyki';

  if (siteType === 'ecommerce') {
    entityName = 'Sklep internetowy e-commerce';
    conversionTerm = 'transakcji i sprzedaży e-commerce';
    goalDescription = 'przychód, konwersja koszyka i wysoki ROAS z kampanii produktowych';
    lossDescription = 'porzucone koszyki i bezpośrednia utrata przychodów ze sprzedaży';
    architectRoleDescription = 'jako Senior Full-Stack Architect wdrożę dedykowaną warstwę telemetryczną dataLayer oraz uporządkuję strukturę nagłówków i canonicali w 24–48 godzin';
  } else if (siteType === 'gov_public') {
    entityName = 'Portal urzędu / administracji publicznej (BIP)';
    conversionTerm = 'sprawnej obsługi mieszkańców i procedur e-urzędu';
    goalDescription = 'sprawna obsługa spraw mieszkańców, dostępność cyfrowa (WCAG 2.1 AA) i odciążenie urzędu';
    lossDescription = 'utrudnienia w załatwianiu spraw przez e-obywateli, kolejki w urzędzie i ryzyko kar finansowych do 10 000 zł z ustawy o dostępności cyfrowej';
    architectRoleDescription = 'jako Senior Architect wdrożę oficjalną deklarację dostępności WCAG 2.1 AA, uporządkuję linki do procedur i wyeliminuję duplikaty w 24-48h bez burzenia obecnej struktury portalu';
  } else if (siteType === 'education') {
    entityName = 'Portal placówki oświatowej / szkoły';
    conversionTerm = 'skuteczności naboru i zaufania rodziców';
    goalDescription = 'rekrutacja nowych roczników, zaufanie rodziców i przejrzystość planów lekcji/komunikatów';
    lossDescription = 'odpływ kandydatów w naborze do lepiej widocznych szkół i chaos komunikacyjny z rodzicami';
    architectRoleDescription = 'jako Senior Architect uporządkuję strukturę semantyczną szkoły, wdrożę jednoznaczne tytuły i dostępność cyfrową w 24-48h';
  } else if (siteType === 'ngo_foundation') {
    entityName = 'Portal organizacji pożytku publicznego / NGO';
    conversionTerm = 'zgłoszeń podopiecznych i wsparcia statutowego';
    goalDescription = 'dotarcie do osób w kryzysie/podopiecznych, zaufanie darczyńców 1.5% oraz komisji grantowych';
    lossDescription = 'bariery w dotarciu do bezpłatnej pomocy statutowej oraz spadek wpłat 1.5% podatku i zaufania grantodawców';
    architectRoleDescription = 'jako Senior Architect uporządkuję architekturę informacji, wyeliminuję kanibalizację fraz i zabezpieczę formularze w 24-48h';
  } else if (siteType === 'local_services') {
    entityName = 'Strona usług lokalnych / gabinetu';
    conversionTerm = 'bezpośrednich telefonów i wizyt klientów z okolicy';
    goalDescription = 'rezerwacje wizyt, dojazd z Google Maps i bezpośrednie telefony od klientów z okolicy';
    lossDescription = 'odpływ lokalnych klientów do konkurencji z sąsiedniej ulicy przez nieklikalny telefon lub słabą widoczność w Google Maps';
    architectRoleDescription = 'jako Senior Architect przekształcę kontakt w klikalne przyciski tel:, wdrożę mikrodane LocalBusiness i uporządkuję strukturę podstron w 24-48h';
  }

  const pagesScanned = evidence?.totalPages || 1;
  const duplicateTitlesCount = evidence?.duplicateTitleGroups?.length || 0;
  const missingH1Count = evidence?.missingH1Count || 0;
  const thinContentCount = evidence?.thinContentCount || 0;
  const missingCanonicalCount = evidence?.missingCanonicalCount || 0;
  const avgResponseTime = evidence?.avgResponseTimeMs || 80;

  const adsInfo = evidence?.adsAndTracking;
  const trackingIssuesText = adsInfo?.issues && adsInfo.issues.length > 0
    ? `\nKRYTYCZNA TELEMETRYKA I REKLAMY (WYCIEKI BUDŻETU):\n${adsInfo.issues.map(i => `- [${i.severity.toUpperCase()}] ${i.title}: ${i.impact}`).join('\n')}`
    : '';

  const quickIssuesText = quickIssues && quickIssues.length > 0
    ? `\nZIDENTYFIKOWANE GŁÓWNE BŁĘDY KRYTYCZNE:\n${quickIssues.map(q => `- ${q.title} (${q.shortDesc})`).join('\n')}`
    : '';

  const empiricalEvidenceText = evidence ? `
DANE Z PRZEANALIZOWANYCH ${pagesScanned} PODSTRON:
- Zbadane podstrony: ${pagesScanned} szt. (średni czas odpowiedzi: ${avgResponseTime}ms)
- Podstrony ze zduplikowanymi tagami Title: ${duplicateTitlesCount > 0 ? `${duplicateTitlesCount} grup podstron kanibalizujących frazy!` : 'Brak (Wszystkie unikalne)'}
- Podstrony bez nagłówka H1: ${missingH1Count} szt.
- Podstrony z ubogą treścią (Thin Content <200 słów): ${thinContentCount} szt.
- Podstrony bez tagu Canonical: ${missingCanonicalCount} szt.
${trackingIssuesText}
${quickIssuesText}
` : '';

  const buildersText = codeSmells.pageBuilders && codeSmells.pageBuilders.length > 0
    ? `\n- Wykryte ciężkie Page Buildery: ${codeSmells.pageBuilders.join(', ')}`
    : '';
  const trackersText = codeSmells.trackers && codeSmells.trackers.length > 0
    ? `\n- Skrypty śledzące 3rd-party: ${codeSmells.trackers.join(', ')}`
    : '';
  const vitalsText = codeSmells.fcp || codeSmells.lcp
    ? `\n- Core Web Vitals: FCP = ${codeSmells.fcp || 'n/a'}, LCP = ${codeSmells.lcp || 'n/a'}`
    : '';

  const codeSmellsText = wafDetected
    ? "UWAGA: Serwis chroniony przez WAF/Cloudflare."
    : `Dług Technologiczny w kodzie:\n- Przestarzałe biblioteki (jQuery): ${codeSmells.jquery ? 'TAK (Krytyczne!)' : 'NIE'}\n- Skrypty blokujące renderowanie (bez async/defer): ${codeSmells.badScripts} szt.\n- Rozmiar drzewa DOM: ${codeSmells.domElements} elementów\n- Brudne style inline (CSS bloat): ${codeSmells.inlineStyles} szt.${buildersText}${trackersText}${vitalsText}`;

  // --- ULEPSZONA DYNAMIKA PROMPTU DLA GEMINI ---
  const isHighScore = avgScore >= 85;
  const systemInstruction = `
Jesteś Marcinem Molendą – Senior Frontend & Full-Stack Architectem. 
Piszesz autorską, wysoce profesjonalną i zwięzłą "Diagnozę Architekta (Synteza Inżynieryjna)" dla właściciela serwisu.
TWARDE GUARDRAILE STYLISTYCZNE:
1. BRAK ALARMISTYCZNEGO ŻARGONU DLA WYNIKÓW >= 85:
   Kategorycznie ZAKAZUJE SIĘ słów: "przepalanie budżetu", "wycieki", "fałszywe konwersje ze spamu", "paraliż". Witryna ma wzorowy kod.
2. ZAKAZ WCISKANIA SZTUCZNEGO AI NA SIŁĘ:
   Nie proponuj na siłę "projektowania modułów AI", chyba że audytowana witryna to zaawansowana platforma SaaS/Data. Dla fundacji, urzędów, szkół czy firm skup się na celach statutowych, zaufaniu darczyńców, rekrutacji lub konwersji lejków.
3. BEZWZGLĘDNA PRAWDA DANYCH:
   Nigdy nie wspominaj o kampaniach płatnych (Google Ads / Performance Max), jeśli audytowana witryna nie prowadzi płatnych reklam (np. NGO, instytucje publiczne, szkoły).
4. FORMA:
   Maksymalnie 3 zwięzłe, mięsiste zdania (lub 2 krótkie akapity). Pisz w 1. osobie ("Jako Senior Architect przeanalizowałem...", "Rekomenduję..."). Czysty Markdown (pogrubienia).
`.trim();

  let userPrompt = '';
  if (isHighScore) {
    userPrompt = `
Serwis ${entityName} (${targetUrl}) uzyskał elitarny wynik ${avgScore}/100.
Stack technologiczny: ${detectedPlatform}. Średni czas odpowiedzi serwera: ${avgResponseTime}ms.
Przeanalizowano podstron: ${pagesScanned}. Profil: ${SITE_TYPE_LABELS[siteType] || 'Usługi'}.
Zadanie:
Napisz prestiżowy, strategiczny werdykt architektoniczny (maksymalnie 3-4 zdania):
1. Docenienie klasy kodu: Zauważ błyskawiczny czas reakcji (${avgResponseTime}ms) oraz brak długu technologicznego na platformie ${detectedPlatform}.
2. Przesunięcie priorytetów: Wskaż, że walka o kolejne ułamki milisekund nie ma już uzasadnienia biznesowego/statutowego – fundamenty są gotowe na pełną realizację celów: ${goalDescription}.
3. Rekomendacja strategiczna: Zaproponuj skupienie uwagi na skalowaniu zasięgu, budowaniu autorytetu i zaufania odbiorców w obszarze właściwym dla profilu (${entityName}).
`.trim();
  } else {
    userPrompt = `
Serwis ${entityName} (${targetUrl}) uzyskał wynik ${avgScore}/100.
Wykryta platforma: ${detectedPlatform}. Profil organizacji: ${SITE_TYPE_LABELS[siteType] || 'Usługi'}.
${empiricalEvidenceText}
${codeSmellsText}
Zadanie:
Napisz precyzyjną diagnozę inżynieryjną (maksymalnie 3-4 zdania):
1. Zdiagnozuj 1-2 najważniejsze realne usterki z powyższych dowodów (np. duplikaty Title, brak H1, brak analityki). Zakaz wymyślania usterek nieobecnych w dowodach!
2. Pokaż wpływ na cel: Uświadom stratę ~${lossPercentage}% w obszarze: ${conversionTerm} (${lossDescription}). Jeśli to NGO/urząd/szkoła – nie pisz o "przepalaniu budżetu reklamowego", lecz o barierach dla odbiorców i ryzyku utraty zaufania.
3. Plan działania w 1. osobie: Wskaż zwięźle, co jako Senior Architect możesz wdrożyć w 24-48h bez burzenia obecnej strony (${architectRoleDescription}).
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
      return response.text.trim();
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

Dalsze inwestowanie w mikrosekundowe optymalizacje nie przyniesie zauważalnego ROI – infrastruktura jest w pełni gotowa na realizację kluczowych celów i skalowanie zasięgu.

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
      solutionText = `jako Full-Stack Architect wdrożę w Twoim sklepie dedykowaną warstwę telemetryczną dataLayer oraz uporządkuję strukturę nagłówków i canonicali w 24–48 godzin, odzyskując pełen zwrot z inwestycji.`;
      quickStepText = (trackingIssue || !evidence?.adsAndTracking?.hasAddToCartTracking)
        ? `Wdrożenie precyzyjnego śledzenia zdarzeń koszykowych (add_to_cart) oraz wyeliminowanie zduplikowanych tytułów stron natychmiast obniży koszt pozyskania klienta (CAC) i odblokuje inteligentne algorytmy Target ROAS.`
        : `Wyeliminowanie zduplikowanych tytułów stron oraz wdrożenie tagów canonical natychmiast odzyska utracone pozycje w Google i obniży koszt pozyskania klienta (CAC).`;
    } else if (siteType === 'gov_public') {
      solutionText = `jako Full-Stack Architect wdrożę oficjalną deklarację dostępności WCAG 2.1 AA, uporządkuję linki kanoniczne do procedur i wyeliminuję błędy semantyczne w 24–48 godzin, w pełni zabezpieczając portal przed karami z KPRM.`;
      quickStepText = `Wdrożenie Deklaracji Dostępności WCAG oraz uporządkowanie tytułów procedur natychmiast usunie ryzyko sankcji prawnych i ułatwi mieszkańcom załatwianie spraw online.`;
    } else if (siteType === 'education') {
      solutionText = `jako Full-Stack Architect uporządkuję strukturę nagłówków i tytułów szkoły, zapewnię pełną czytelność mobilną dla rodziców i wdrożę tagi canonical w 24–48 godzin.`;
      quickStepText = `Wdrożenie unikalnych tytułów podstron rekrutacyjnych i uzupełnienie brakujących H1 natychmiast wzmocni pozycję szkoły w wyszukiwarkach przed okresem naboru.`;
    } else if (siteType === 'ngo_foundation') {
      solutionText = `jako Full-Stack Architect wyeliminuję kanibalizację słów kluczowych, uzupełnię tagi alternatywne dla dostępności i zabezpieczę formularze w 24–48 godzin, ułatwiając podopiecznym dotarcie do pomocy.`;
      quickStepText = `Wdrożenie unikalnych tytułów podstron, tagów canonical oraz zabezpieczenia antyspamowego formularzy natychmiast uszczelni lejek pomocowy i ułatwi przekazywanie 1.5% podatku.`;
    } else if (siteType === 'local_services') {
      solutionText = `jako Full-Stack Architect wdrożę klikalne przyciski tel: na smartfonach, uzupełnię mikrodane LocalBusiness i uporządkuję strukturę podstron w 24–48 godzin, zatrzymując lokalnych klientów.`;
      quickStepText = `Uruchomienie klikalnego numeru telefonu w nagłówku oraz uporządkowanie tagów lokalnych natychmiast zwiększy liczbę zapytań i telefonów od klientów z okolicy.`;
    } else {
      solutionText = `jako Full-Stack Architect uporządkuję strukturę semantyczną witryny, wdrożę unikalne tagi canonical i zoptymalizuję architekturę kodu pod kątem konwersji B2B w 24–48 godzin, odzyskując pełen zwrot z inwestycji.`;
      quickStepText = `Uporządkowanie struktury nagłówków H1, wdrożenie unikalnych tagów Title i kanonicznych adresów natychmiast odzyska utracony ruch organiczny i podniesie widoczność w zapytaniach ofertowych.`;
    }
  } else {
    if (siteType === 'ecommerce') {
      solutionText = `struktura SEO i nagłówki w Twoim sklepie są w 100% wzorowe – jako Full-Stack Architect zoptymalizuję budżet renderowania DOM i skonfiguruję zaawansowaną telemetrię e-commerce w 24–48 godzin, przygotowując sklep na agresywne skalowanie sprzedaży.`;
      quickStepText = `Wdrożenie kontenera GTM z obsługą Consent Mode v2 oraz mikro-akceleracja renderowania natychmiast podniesie współczynnik konwersji mobilnej i przygotuje sklep na kampanie Performance Max.`;
    } else if (siteType === 'gov_public' || siteType === 'education' || siteType === 'ngo_foundation') {
      solutionText = `struktura semantyczna i indeksacja są w 100% czyste – jako Full-Stack Architect zoptymalizuję dostępność cyfrową i szybkość renderowania mobilnego w 24–48 godzin.`;
      quickStepText = `Mikro-akceleracja DOM i weryfikacja kontrastów WCAG zapewnią wzorową dostępność serwisu dla wszystkich użytkowników.`;
    } else {
      solutionText = `struktura semantyczna i indeksacja są w 100% czyste – jako Full-Stack Architect skonfiguruję dedykowaną telemetrię zdarzeń B2B i przyspieszę renderowanie mobilne w 24–48 godzin, maksymalizując pozyskiwanie wartościowych leadów.`;
      quickStepText = `Wdrożenie kontenera Google Tag Manager ze śledzeniem zdarzeń (generate_lead) oraz mikro-akceleracja DOM w pełni zabezpieczą budżet reklamowy przed startem kampanii Google & Meta Ads.`;
    }
  }

  const lossText = hasStructuralIssues
    ? `Przez te niedociągnięcia strukturalne serwis traci szacunkowo **${lossPercentage}% ${conversionTerm}**.`
    : `Mimo wzorowej struktury SEO, rezerwy w czasie renderowania mogą obniżać potencjał w obszarze: **${conversionTerm}** o szacunkowo **${lossPercentage}%**.`;

  return `Szczegółowy audyt **${targetUrl}** (${platform}) wykazał wynik **${avgScore}/100**. W zbadanej próbce zdiagnozowaliśmy kluczowe wąskie gardła: ${issuesSummary}.

${lossText}

Dobra wiadomość jest taka, że nie musisz budować ${entity} od nowa – ${solutionText}

**💡 Szybki krok naprawczy:** ${quickStepText}`;
}
