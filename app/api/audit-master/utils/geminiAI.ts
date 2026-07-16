import { GoogleGenAI } from '@google/genai';

export async function generateGeminiReport(
  targetUrl: string,
  avgScore: number,
  performanceScore: number,
  seoScore: number,
  detectedPlatform: string,
  wafDetected: boolean,
  codeSmells: { jquery: boolean; badScripts: number; h1Count: number; inlineStyles: number },
  lossPercentage: number,
  geminiKey: string
): Promise<string> {
  const codeSmellsText = wafDetected
    ? "UWAGA: Serwis chroniony przez WAF/Cloudflare. Skan struktury kodu zablokowany."
    : `Dług Technologiczny (Code Smells):\n- Przestarzałe jQuery: ${codeSmells.jquery ? 'TAK (Krytyczne!)' : 'NIE'}\n- Skrypty blokujące renderowanie: ${codeSmells.badScripts} szt.\n- Nagłówki H1: ${codeSmells.h1Count}\n- Style inline: ${codeSmells.inlineStyles} szt.`;

  let prompt = '';

  if (avgScore >= 85) {
    prompt = `Jesteś Marcinem Molendą, Senior Frontend Architectem. Sklep ${targetUrl} uzyskał elitarny wynik ${avgScore}/100 (Szybkość: ${Math.round(performanceScore)}, SEO: ${Math.round(seoScore)}). Stack: ${detectedPlatform}.
Zadanie: Napisz zwięzły werdykt (MAKSYMALNIE 3-4 ZDANIA!). 
1. Pogratuluj właścicielowi rewelacyjnej, bezkompromisowej infrastruktury i zaznacz, że należą do ścisłego promila najlepszych stron w sieci. 
2. Uświadom mu biznesowo, że dalsze szlifowanie tak doskonałego kodu to marnowanie budżetu – czas na ekspansję rynkową. 
3. Jako jedyny logiczny obszar współpracy zaproponuj projektowanie dedykowanych systemów AI lub zaawansowanych modułów automatyzacji B2B, które wykorzystają tę surową moc obliczeniową, bez naruszania ich perfekcyjnej architektury bazowej. ABSOLUTNIE NIE sugeruj żadnych poprawek kodu ani migracji!
FORMATOWANIE: Czysty Markdown (np. **pogrubienie**). Brak HTML-a, brak znaczników \`\`\`markdown.`;

  } else if (avgScore >= 60 && avgScore < 85) {
    const isModernStack = detectedPlatform.includes('Next.js') || detectedPlatform.includes('React') || detectedPlatform.includes('Vue') || detectedPlatform.includes('Nuxt');
    
    const stackContext = isModernStack
      ? `Doceniaj, że wybrali nowoczesny architektonicznie stos (${detectedPlatform}), ale wykaż, że przez brak końcowego, profesjonalnego szlifu marnują jego surowy potencjał.`
      : `Zauważ, że wycisnęli z platformy ${detectedPlatform} bardzo dużo, ale ta klasyczna architektura osiąga już swój technologiczny sufit wydajnościowy.`;

    prompt = `Jesteś Marcinem Molendą, Senior Frontend Architectem. Sklep ${targetUrl} uzyskał przyzwoity wynik ${avgScore}/100.
Wykryta platforma: ${detectedPlatform}
Zdiagnozowane problemy / dług techniczny: ${codeSmellsText}

Zadanie: Napisz zwięzły, niezwykle precyzyjny werdykt (MAKSYMALNIE 3 ZDANIA!), kierowany do właściciela biznesu.
1. ${stackContext}
2. Przeanalizuj przekazane wyżej zdiagnozowane problemy. Zamiast ogólnych frazesów, uderz punktowo w ten JEDEN najważniejszy problem, który faktycznie występuje w przekazanych danych. Bądź chirurgicznie dokładny – mów tylko o wadach z wykazu. NIE zmyślaj problemów z LCP czy CLS, jeśli nie ma ich na liście!
3. Wyjaśnij, że przez te konkretne niedociągnięcia tracą szacunkowo ${lossPercentage}% konwersji. Zaproponuj wyłącznie usługę "Performance & Security Tuning" (inżynieryjny szlif optymalizacyjny witryny), a NIE budowanie systemu od nowa.
FORMATOWANIE: Czysty Markdown (np. **pogrubienie**). Brak HTML-a, brak znaczników \`\`\`markdown.`;

  } else {
    const migrationSuggestion = detectedPlatform.includes('Next.js')
      ? `Zaproponuj gruntowny audyt kodu i ratunkową refaktoryzację ich obecnej aplikacji Next.js, aby wyeliminować dramatyczny dług technologiczny (Serverless Tuning).`
      : `Zaproponuj pełną migrację na autorski Serverless Edge (Next.js) jako jedyną drogę ucieczki przed spadkiem sprzedaży.`;

    prompt = `Jesteś Marcinem Molendą. Sklep ${targetUrl} uzyskał słaby wynik ${avgScore}/100.
Stack: ${detectedPlatform}. 
Zdiagnozowany dług techniczny: ${codeSmellsText}

Zadanie: Napisz brutalną, bezkompromisową diagnozę inżynieryjną (MAKSYMALNIE 3-4 ZDANIA!). 
1. Wytknij powolne działanie i przestarzałe wzorce w kodzie na bazie przekazanego długu technicznego. 
2. Uświadom właścicielowi czarno na białym, że przez te wąskie gardła traci szacunkowo ${lossPercentage}% potencjalnych klientów przy każdym kliknięciu. 
3. ${migrationSuggestion}
FORMATOWANIE: Czysty Markdown (np. **pogrubienie**). Brak jakiegokolwiek HTML-a, brak znaczników \`\`\`markdown.`;
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
