import { GoogleGenAI } from '@google/genai';
import { DetailedCodeSmells, EvidenceSummary } from '../types';

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
  evidence?: EvidenceSummary
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

  const empiricalEvidenceText = evidence ? `
DANE Z PRZEANALIZOWANYCH ${pagesScanned} PODSTRON:
- Zbadane podstrony: ${pagesScanned} szt. (średni czas odpowiedzi: ${avgResponseTime}ms)
- Podstrony ze zduplikowanymi tagami Title: ${duplicateTitlesCount > 0 ? `${duplicateTitlesCount} grup podstron kanibalizujących frazy!` : 'Brak (Wszystkie unikalne)'}
- Podstrony bez nagłówka H1: ${missingH1Count} szt.
- Podstrony z ubogą treścią (Thin Content <200 słów): ${thinContentCount} szt.
- Podstrony bez tagu Canonical: ${missingCanonicalCount} szt.
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
3. Zaproponuj projektowanie dedykowanych modułów AI lub automatyzacji procesów.
FORMATOWANIE: Czysty Markdown (np. **pogrubienie**). Bez HTML.`;
  } else {
    prompt = `Jesteś Marcinem Molendą, Senior Web Architectem. ${entityName} ${targetUrl} uzyskał wynik ${avgScore}/100.
Wykryta platforma: ${detectedPlatform}
${empiricalEvidenceText}
${codeSmellsText}

Zadanie: Napisz zwięzłą, bezlitośnie precyzyjną diagnozę inżynieryjną (DOKŁADNIE 3-4 ZDANIA!).
1. Wskaż najważniejsze twarde błędy z audytu (np. ${duplicateTitlesCount > 0 ? `${duplicateTitlesCount} grup powielonych Title niszczących SEO` : ''}, ${missingH1Count > 0 ? `${missingH1Count} stron bez H1` : ''}, ${codeSmells.pageBuilders && codeSmells.pageBuilders.length > 0 ? `bloat z ${codeSmells.pageBuilders.join(', ')}` : ''}). Mów o faktach z liczbami!
2. Uświadom właścicielowi, że przez te wąskie gardła traci szacunkowo ${lossPercentage}% ${conversionTerm}.
3. Wskaż jasne rozwiązanie inżynieryjne (Tuning techniczny i uporządkowanie struktury bez burzenia całego biznesu).
FORMATOWANIE: Czysty Markdown. Bez HTML.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
    return `Architektura **${targetUrl}** reprezentuje najwyższy standard inżynieryjny (${avgScore}/100). Kod jest czysty, serwer odpowiada poniżej ${evidence?.avgResponseTimeMs || 80}ms, a struktura podstron nie wykazuje krytycznego długu technologicznego. 

Dalsze inwestowanie w mikrosekundowe optymalizacje nie przyniesie zauważalnego ROI – infrastruktura jest w pełni gotowa na skalowanie ruchu i zaawansowane wdrożenia AI.

**💡 Rekomendacja strategiczna:** Skieruj zasoby na pozyskiwanie klientów i automatyzację procesów biznesowych, bo technologicznie serwis wyprzedza 95% konkurencji.`;
  }

  const issues: string[] = [];
  if (evidence && evidence.duplicateTitleGroups.length > 0) {
    issues.push(`aż **${evidence.duplicateTitleGroups.length} grup ze zduplikowanymi tagami Title**, co wywołuje auto-kanibalizację fraz w Google`);
  }
  if (evidence && evidence.missingH1Count > 0) {
    issues.push(`**${evidence.missingH1Count} podstron bez nagłówka H1**, przez co roboty wyszukiwarek i modele AI gubią kontekst semantyczny`);
  }
  if (evidence && evidence.missingCanonicalCount > 0) {
    issues.push(`**${evidence.missingCanonicalCount} adresów bez linku kanonicznego (canonical)**`);
  }
  if (codeSmells?.pageBuilders && codeSmells.pageBuilders.length > 0) {
    issues.push(`narzut kodu z builderów (**${codeSmells.pageBuilders.join(', ')}**), drastycznie rozdmuchujący drzewo DOM do ${codeSmells.domElements} elementów`);
  }

  const issuesSummary = issues.length > 0
    ? issues.slice(0, 3).join(', ')
    : `brak odpowiednich nagłówków semantycznych i opóźnienia w czasie renderowania`;

  return `Szczegółowy audyt **${targetUrl}** (${platform}) wykazał wynik **${avgScore}/100**. W zbadanej próbce zdiagnozowaliśmy kluczowe wąskie gardła: ${issuesSummary}.

Przez te niedociągnięcia strukturalne serwis traci szacunkowo **${lossPercentage}% ${conversionTerm}**, a algorytmy Google oraz wyszukiwarki AI traktują część podstron jako treści niskiej wartości.

Dobra wiadomość jest taka, że nie musisz budować ${entity} od nowa – uporządkowanie struktury nagłówków, canonicali i optymalizacja skryptów pozwoli odzyskać pełen potencjał ruchu w ciągu 14 dni.

**💡 Szybka porada:** Nadaj unikalne tytuły kluczowym podstronom i upewnij się, że każdy produkt oraz wpis blogowy posiada dokładnie jeden tag \`<h1>\` z główną frazą.`;
}
