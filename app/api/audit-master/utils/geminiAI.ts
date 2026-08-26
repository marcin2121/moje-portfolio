import { GoogleGenAI } from '@google/genai';

export interface DetailedCodeSmells {
  jquery: boolean;
  badScripts: number;
  domElements: number;
  inlineStyles: number;
  pageBuilders?: string[];
  trackers?: string[];
  missingAltCount?: number;
  unoptimizedImagesCount?: number;
  fcp?: string;
  lcp?: string;
}

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
  siteType: 'ecommerce' | 'services' = 'services'
): Promise<string> {
  const isEcommerce = siteType === 'ecommerce';
  const entityName = isEcommerce ? 'Sklep internetowy' : 'Serwis firmowy / strona usługowa';
  const targetTerm = isEcommerce ? 'sklepu' : 'serwisu';
  const conversionTerm = isEcommerce ? 'transakcji i sprzedaży' : 'zapytań ofertowych i leadów';

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
    ? "UWAGA: Serwis chroniony przez WAF/Cloudflare. Skan struktury kodu zablokowany."
    : `Dług Technologiczny (Szczegółowa Diagnostyka Inżynierska):\n- Przestarzałe biblioteki (jQuery): ${codeSmells.jquery ? 'TAK (Krytyczne!)' : 'NIE'}\n- Skrypty blokujące renderowanie (bez async/defer): ${codeSmells.badScripts} szt.\n- Rozmiar drzewa DOM: ${codeSmells.domElements} elementów\n- Brudne style inline (CSS bloat): ${codeSmells.inlineStyles} szt.${buildersText}${trackersText}${vitalsText}`;

  let prompt = '';

  if (avgScore >= 85) {
    prompt = `Jesteś Marcinem Molendą, Senior Frontend Architectem. ${entityName} ${targetUrl} uzyskał elitarny wynik ${avgScore}/100 (Szybkość: ${Math.round(performanceScore)}, SEO: ${Math.round(seoScore)}). Stack: ${detectedPlatform}.
Zadanie: Napisz zwięzły werdykt (MAKSYMALNIE 3-4 ZDANIA!). 
1. Pogratuluj właścicielowi rewelacyjnej, bezkompromisowej infrastruktury i zaznacz, że należy do ścisłego promila najlepszych stron w sieci. 
2. Uświadom mu biznesowo, że dalsze szlifowanie tak doskonałego kodu to marnowanie budżetu – czas na ekspansję rynkową i pozyskiwanie klientów. 
3. Jako jedyny logiczny obszar współpracy zaproponuj projektowanie dedykowanych systemów AI, automatyzacji procesów lub integracji, które wykorzystają tę moc obliczeniową, bez naruszania ich perfekcyjnej architektury bazowej. ABSOLUTNIE NIE sugeruj żadnych poprawek kodu ani migracji!
FORMATOWANIE: Czysty Markdown (np. **pogrubienie**). Brak HTML-a, brak znaczników \`\`\`markdown.`;

  } else if (avgScore >= 60 && avgScore < 85) {
    const isModernStack = detectedPlatform.includes('Next.js') || detectedPlatform.includes('React') || detectedPlatform.includes('Vue') || detectedPlatform.includes('Nuxt');
    
    const stackContext = isModernStack
      ? `Doceniaj, że wybrali nowoczesny architektonicznie stos (${detectedPlatform}), ale wykaż, że przez brak końcowego, profesjonalnego szlifu marnują jego surowy potencjał.`
      : `Zauważ, że wycisnęli z platformy ${detectedPlatform} bardzo dużo, ale ta klasyczna architektura osiąga już swój technologiczny sufit wydajnościowy.`;

    prompt = `Jesteś Marcinem Molendą, Senior Frontend Architectem. ${entityName} ${targetUrl} uzyskał przyzwoity wynik ${avgScore}/100.
Wykryta platforma: ${detectedPlatform}
Zdiagnozowane problemy / dług techniczny: ${codeSmellsText}

Zadanie: Napisz zwięzły, niezwykle precyzyjny werdykt (MAKSYMALNIE 3 ZDANIA!), kierowany do właściciela biznesu.
1. ${stackContext}
2. Przeanalizuj przekazane wyżej zdiagnozowane problemy. Zamiast ogólnych frazesów, uderz punktowo w ten JEDEN najważniejszy problem, który faktycznie występuje w przekazanych danych. Bądź chirurgicznie dokładny – mów tylko o wadach z wykazu.
3. Wyjaśnij, że przez te konkretne niedociągnięcia tracą szacunkowo ${lossPercentage}% ${conversionTerm}. Zaproponuj wyłącznie usługę "Performance & Security Tuning" (inżynieryjny szlif optymalizacyjny witryny), a NIE budowanie systemu od nowa.
FORMATOWANIE: Czysty Markdown (np. **pogrubienie**). Brak HTML-a, brak znaczników \`\`\`markdown.`;

  } else {
    const migrationSuggestion = detectedPlatform.includes('Next.js')
      ? `Zaproponuj gruntowny audyt kodu i ratunkową refaktoryzację ich obecnej aplikacji Next.js, aby wyeliminować dramatyczny dług technologiczny (Serverless Tuning).`
      : `Zaproponuj pełną migrację na nowoczesny, bezpieczny Headless Edge (Next.js) jako jedyną drogę ucieczki przed utratą klientów.`;

    prompt = `Jesteś Marcinem Molendą. ${entityName} ${targetUrl} uzyskał słaby wynik ${avgScore}/100.
Stack: ${detectedPlatform}. 
Zdiagnozowany dług techniczny: ${codeSmellsText}

Zadanie: Napisz brutalną, bezkompromisową diagnozę inżynieryjną (MAKSYMALNIE 3-4 ZDANIA!). 
1. Wytknij powolne działanie i przestarzałe wzorce w kodzie na bazie przekazanego długu technicznego. 
2. Uświadom właścicielowi czarno na białym, że przez te wąskie gardła traci szacunkowo ${lossPercentage}% potencjalnych ${conversionTerm} przy każdym wejściu użytkownika. 
3. ${migrationSuggestion}
FORMATOWANIE: Czysty Markdown (np. **pogrubienie**). Brak jakiegokolwiek HTML-a, brak znaczników \`\`\`markdown.`;
  }

  if (avgScore >= 85) {
    prompt += `\n\nNa samym końcu dodaj wyraźnie oddzieloną pustą linią sekcję o nazwie "**💡 Rekomendacja strategiczna:**". Napisz w niej jedno konkretne zdanie, że przy tak bezbłędnej infrastrukturze i zerowym długu technologicznym kluczem do dominacji rynkowej jest agresywne skalowanie ruchu, zbieranie opinii i content marketing, ponieważ od strony inżynieryjnej serwis wygrywa z 99.9% konkurencji.`;
  } else {
    const adviceExample = isEcommerce 
      ? "np. kompresja zdjęć przed publikacją, usunięcie nieużywanych wtyczek marketingowych"
      : "np. kompresja grafik w galerii, wyłączenie ciężkich wideo w tle, usunięcie zbędnych widgetów czatu";

    prompt += `\n\nNa samym końcu dodaj wyraźnie oddzieloną pustą linią sekcję o nazwie "**💡 Szybka porada (bez IT):**". Napisz w niej jedno konkretne, w 100% nietechniczne zalecenie biznesowe, które właściciel może wykonać od razu sam z poziomu panelu CMS (${adviceExample}). Porada musi być krótka (1 zdanie) i nie wymagać programisty.`;
  }

  const ai = new GoogleGenAI({ apiKey: geminiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: { temperature: 0.6 }
    });
    return response.text || 'Brak diagnozy AI. Wymagana audytorska weryfikacja manualna.';
  } catch {
    return `*Silnik analityczny AI jest w tej chwili przeciążony. Twoje wskaźniki techniczne mówią jednak same za siebie – umów bezpośrednią konsultację.*`;
  }
}
