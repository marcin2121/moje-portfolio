import { GoogleGenAI } from '@google/genai';
import { DetailedCodeSmells, EvidenceSummary, QuickCriticalIssue } from '../types';
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
  siteType: 'ecommerce' | 'services' = 'services',
  evidence?: EvidenceSummary,
  quickIssues?: QuickCriticalIssue[]
): Promise<string> {
  const isEcommerce = siteType === 'ecommerce';
  const entityName = isEcommerce ? 'Sklep internetowy' : 'Serwis firmowy / strona usługowa';
  const conversionTerm = isEcommerce ? 'transakcji i sprzedaży' : 'zapytań ofertowych i leadów B2B';

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

  let prompt = '';

  if (avgScore >= 85) {
    prompt = `Jesteś Marcinem Molendą, Senior Frontend & Full-Stack Architectem. ${entityName} ${targetUrl} uzyskał elitarny wynik ${avgScore}/100.
Przeanalizowano ${pagesScanned} podstron. Stack: ${detectedPlatform}.
Zadanie: Napisz zwięzły, autorytatywny werdykt (MAKSYMALNIE 3-4 ZDANIA!).
1. Pogratuluj właścicielowi rewelacyjnej, bezkompromisowej infrastruktury (wskazując szybkość ${avgResponseTime}ms i brak długu technologicznego).
2. Uświadom mu biznesowo, że dalsze szlifowanie tak doskonałego kodu to strata budżetu – czas na skalowanie ruchu i konwersji.
3. Zaproponuj projektowanie dedykowanych modułów AI lub automatyzacji procesów biznesowych.
FORMATOWANIE: Czysty Markdown (np. **pogrubienie**). Bez HTML.`;
  } else {
    prompt = `Jesteś Marcinem Molendą, Senior Web & Full-Stack Architectem. ${entityName} ${targetUrl} uzyskał wynik ${avgScore}/100.
Wykryta platforma: ${detectedPlatform}
${empiricalEvidenceText}
${codeSmellsText}

Zadanie: Napisz zwięzłą, bezlitośnie precyzyjną diagnozę inżynieryjną w języku twardych korzyści finansowych (DOKŁADNIE 3-4 ZDANIA!).
1. Jeśli wykryto błędy telemetryki lub brak add_to_cart / Consent Mode v2 przy reklamach – wskaż to bezwzględnie jako wyciek budżetu reklamowego (Smart Bidding działa na ślepo i przepala budżet).
2. Wskaż pozostałe twarde liczby (np. ${duplicateTitlesCount > 0 ? `${duplicateTitlesCount} grup powielonych Title niszczących pozycje w Google` : ''}, ${missingH1Count > 0 ? `${missingH1Count} stron bez H1` : ''}). KATEGORYCZNY ZAKAZ wymyślania błędów H1, canonicali czy duplikatów, jeśli ich liczba w danych wynosi 0. Jeśli struktura SEO jest czysta (0 błędów H1 i canonical), wyraźnie to podkreśl i skup się wyłącznie na telemetrii i wydajności.
3. Podkreśl szacowaną stratę ~${lossPercentage}% ${conversionTerm}.
4. Przedstaw w pierwszej osobie ("Co dla Ciebie wdrożę: Wdrożę...", "Zaimplementuję...", "Uporządkuję..."), co Ty jako Senior Architect (Marcin) możesz konkretnie wdrożyć w kodzie w 24-48h bez burzenia obecnej strony. KATEGORYCZNY ZAKAZ pisania o sobie w 3. osobie ("Marcin wdroży", "Marcin może"). Zawsze pisz w 1. osobie ("Wdrożę").
FORMATOWANIE: Czysty Markdown. Bez HTML.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      contents: prompt,
      config: { temperature: 0.5 }
    });

    if (response.text && response.text.trim().length > 20) {
      return response.text.trim();
    }
  } catch {
    // W razie limitu Gemini (429) lub braku połączenia odpalamy deterministyczny fallback
  }

  return generateDeterministicReport(targetUrl, avgScore, detectedPlatform, lossPercentage, isEcommerce, evidence, codeSmells);
}

/**
 * Deterministyczny silnik werdyktu architekta (zabezpieczenie przed limitami Gemini)
 */
export function generateDeterministicReport(
  targetUrl: string,
  avgScore: number,
  platform: string,
  lossPercentage: number,
  isEcommerce: boolean,
  evidence?: EvidenceSummary,
  codeSmells?: DetailedCodeSmells
): string {
  const entity = isEcommerce ? 'sklepu' : 'witryny';
  const conversionTerm = isEcommerce ? 'sprzedaży e-commerce' : 'zapytań ofertowych B2B';

  if (avgScore >= 85) {
    return `Architektura **${targetUrl}** reprezentuje najwyższy standard inżynieryjny (${avgScore}/100). Kod jest czysty, serwer odpowiada poniżej ${evidence?.avgResponseTimeMs || 80}ms, a struktura podstron nie wykazuje długu technologicznego. 

Dalsze inwestowanie w mikrosekundowe optymalizacje nie przyniesie zauważalnego ROI – infrastruktura jest w pełni gotowa na skalowanie ruchu i wdrożenia automatyzacji AI.

**💡 Rekomendacja strategiczna:** Skieruj zasoby na pozyskiwanie klientów i skalowanie kampanii, bo technologicznie serwis wyprzedza 95% konkurencji rynkowej.`;
  }

  const issues: string[] = [];

  // 1. Krytyczne błędy telemetryki
  const trackingIssue = evidence?.adsAndTracking?.issues?.find(i => i.severity === 'critical');
  if (trackingIssue) {
    issues.push(`**${trackingIssue.title.toLowerCase()}**, przez co algorytmy reklamowe Google i Meta optymalizują kampanie po omacku`);
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
    if (evidence?.adsAndTracking && !evidence.adsAndTracking.hasGoogleAds && !evidence.adsAndTracking.hasGoogleTagManager) {
      issues.push(`brak wdrożonych tagów Google Tag Manager i Google Ads przed planowanym skalowaniem kampanii płatnych`);
    }
  }

  const issuesSummary = issues.length > 0
    ? issues.slice(0, 3).join(', ')
    : (hasStructuralIssues
        ? `brak odpowiednich nagłówków semantycznych i błędy kanonizacji`
        : `rezerwy optymalizacyjne w czasie renderowania DOM oraz brak telemetryki kampanii płatnych`);

  let solutionText: string;
  let quickStepText: string;

  if (hasStructuralIssues) {
    solutionText = isEcommerce
      ? `jako Full-Stack Architect wdrożę w Twoim sklepie dedykowaną warstwę telemetryczną dataLayer oraz uporządkuję strukturę nagłówków i canonicali w 24–48 godzin, odzyskując pełen zwrot z inwestycji.`
      : `jako Full-Stack Architect uporządkuję strukturę semantyczną witryny, wdrożę unikalne tagi canonical i zoptymalizuję architekturę kodu pod kątem konwersji B2B w 24–48 godzin, odzyskując pełen zwrot z inwestycji.`;

    quickStepText = isEcommerce
      ? ((trackingIssue || !evidence?.adsAndTracking?.hasAddToCartTracking)
          ? `Wdrożenie precyzyjnego śledzenia zdarzeń koszykowych (add_to_cart) oraz wyeliminowanie zduplikowanych tytułów stron natychmiast obniży koszt pozyskania klienta (CAC) i odblokuje inteligentne algorytmy Target ROAS.`
          : `Wyeliminowanie zduplikowanych tytułów stron oraz wdrożenie tagów canonical natychmiast odzyska utracone pozycje w Google i obniży koszt pozyskania klienta (CAC).`)
      : `Uporządkowanie struktury nagłówków H1, wdrożenie unikalnych tagów Title i kanonicznych adresów natychmiast odzyska utracony ruch organiczny i podniesie widoczność w zapytaniach ofertowych.`;
  } else {
    solutionText = isEcommerce
      ? `struktura SEO i nagłówki w Twoim sklepie są w 100% wzorowe – jako Full-Stack Architect zoptymalizuję budżet renderowania DOM i skonfiguruję zaawansowaną telemetrię e-commerce w 24–48 godzin, przygotowując sklep na agresywne skalowanie sprzedaży.`
      : `struktura semantyczna i indeksacja są w 100% czyste – jako Full-Stack Architect skonfiguruję dedykowaną telemetrię zdarzeń B2B i przyspieszę renderowanie mobilne w 24–48 godzin, maksymalizując pozyskiwanie wartościowych leadów.`;

    quickStepText = isEcommerce
      ? `Wdrożenie kontenera GTM z obsługą Consent Mode v2 oraz mikro-akceleracja renderowania natychmiast podniesie współczynnik konwersji mobilnej i przygotuje sklep na kampanie Performance Max.`
      : `Wdrożenie kontenera Google Tag Manager ze śledzeniem zdarzeń (generate_lead) oraz mikro-akceleracja DOM w pełni zabezpieczą budżet reklamowy przed startem kampanii Google & Meta Ads.`;
  }

  const lossText = hasStructuralIssues
    ? `Przez te niedociągnięcia strukturalne i telemetryczne serwis traci szacunkowo **${lossPercentage}% ${conversionTerm}**, a budżety reklamowe są częściowo przepalane na nieskuteczny ruch.`
    : `Mimo wzorowej struktury SEO, brak zaawansowanej telemetrii kampanii i rezerwy w czasie renderowania mogą obniżać potencjał pozyskiwania leadów o szacunkowo **${lossPercentage}% ${conversionTerm}**.`;

  return `Szczegółowy audyt **${targetUrl}** (${platform}) wykazał wynik **${avgScore}/100**. W zbadanej próbce zdiagnozowaliśmy kluczowe wąskie gardła: ${issuesSummary}.

${lossText}

Dobra wiadomość jest taka, że nie musisz budować ${entity} od nowa – ${solutionText}

**💡 Szybki krok naprawczy:** ${quickStepText}`;
}
