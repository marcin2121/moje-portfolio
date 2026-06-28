import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio'; // Bezpieczny, błyskawiczny parser HTML

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL jest wymagany' }, { status: 400 });
    }

    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const apiKey = process.env.PAGESPEED_API_KEY;

    let performanceScore = 45;
    let seoScore = 55;
    let securityScore = 30;
    let scalabilityScore = 30;
    let automationScore = 30;
    let html = '';
    let pageTitle = '';
    let pageDesc = '';
    let detectedPlatform = 'Własny kod / Nierozpoznano';
    let codeSmells = { jquery: false, badScripts: 0, h1Count: 0, inlineStyles: 0 };
    let wafDetected = false;

    // Helper: PageSpeed
    const fetchPageSpeed = async (retries = 2): Promise<any> => {
      const psUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=desktop&category=performance&category=seo${apiKey ? `&key=${apiKey}` : ''}`;
      for (let i = 0; i < retries; i++) {
        try {
          const psRes = await fetch(psUrl, {
            cache: 'no-store',
            signal: AbortSignal.timeout(120000),
            headers: { 'Referer': 'https://molendadevelopment.pl/' }
          });
          if (!psRes.ok) throw new Error(`HTTP Error: ${psRes.status}`);
          return await psRes.json();
        } catch (err: any) {
          if (i === retries - 1) throw err;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    };

    // Helper: HTML
    const fetchSiteHTML = async () => {
      const siteRes = await fetch(targetUrl, {
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' }
      });
      const htmlText = await siteRes.text();
      return { siteRes, htmlText };
    };

    const [psDataResult, siteHtmlResult] = await Promise.allSettled([
      fetchPageSpeed(2),
      fetchSiteHTML()
    ]);

    if (psDataResult.status === 'fulfilled' && psDataResult.value) {
      performanceScore = (psDataResult.value?.lighthouseResult?.categories?.performance?.score || 0.4) * 100;
      seoScore = (psDataResult.value?.lighthouseResult?.categories?.seo?.score || 0.5) * 100;
    }

    if (siteHtmlResult.status === 'fulfilled' && siteHtmlResult.value) {
      const { siteRes, htmlText } = siteHtmlResult.value;
      html = htmlText;

      const isCloudflare = html.includes('Just a moment...') || html.includes('Attention Required!') || siteRes.status === 403;
      
      if (isCloudflare) {
        wafDetected = true;
        detectedPlatform = 'Zabezpieczenie WAF / Cloudflare';
        securityScore = 95;
        scalabilityScore = 80;
        automationScore = 50;
      } else {
        let secScore = 20;
        if (siteRes.headers.get('strict-transport-security')) secScore += 30;
        if (siteRes.headers.get('content-security-policy')) secScore += 30;
        if (siteRes.headers.get('x-frame-options')) secScore += 20;
        securityScore = secScore;

        // BŁYSKAWICZNA ANALIZA CHEERIO (Zamiast niebezpiecznych Regexów)
        const $ = cheerio.load(html);
        pageTitle = $('title').first().text().trim();
        pageDesc = $('meta[name="description"]').attr('content')?.trim() || '';

        codeSmells.jquery = html.toLowerCase().includes('jquery');
        codeSmells.h1Count = $('h1').length;
        codeSmells.inlineStyles = $('[style]').length;

        // Liczymy skrypty bez async/defer
        $('script[src]').each((_, el) => {
          const isAsync = $(el).attr('async') !== undefined;
          const isDefer = $(el).attr('defer') !== undefined;
          if (!isAsync && !isDefer) codeSmells.badScripts++;
        });

        // Detekcja platform
        if (html.includes('__NEXT_DATA__') || html.includes('/_next/static/')) {
          scalabilityScore = 95; automationScore = 95; detectedPlatform = 'Next.js / React (Serverless)';
        } else if (html.includes('cdn.shopify.com')) {
          scalabilityScore = 80; automationScore = 70; detectedPlatform = 'Shopify';
        } else if (html.includes('wp-content')) {
          scalabilityScore = 40; automationScore = 30; detectedPlatform = 'WordPress / WooCommerce';
        }
      }
    }

    const avgScore = Math.round((performanceScore + seoScore + securityScore + scalabilityScore + automationScore) / 5);
    const lossPercentage = Math.max(5, Math.round((100 - avgScore) / 1.5));

    // --- GEMINI AI (Poprawione wyjście Markdown) ---
    let aiReport = '';
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      const codeSmellsText = wafDetected
        ? "UWAGA: Serwis chroniony przez WAF/Cloudflare. Skan struktury kodu zablokowany."
        : `Dług Technologiczny (Code Smells):\n- Przestarzałe jQuery: ${codeSmells.jquery ? 'TAK (Krytyczne!)' : 'NIE'}\n- Skrypty blokujące renderowanie: ${codeSmells.badScripts} szt.\n- Nagłówki H1: ${codeSmells.h1Count}\n- Style inline: ${codeSmells.inlineStyles} szt.`;

   let prompt = '';

if (avgScore >= 85) {
  // 1. STREFA ZŁOTA (Elita Top 1% - Wynik 85+)
  prompt = `Jesteś Marcinem Molendą, Senior Frontend Architectem. Sklep ${targetUrl} uzyskał elitarny wynik ${avgScore}/100 (Szybkość: ${Math.round(performanceScore)}, SEO: ${Math.round(seoScore)}). Stack: ${detectedPlatform}.
Zadanie: Napisz zwięzły werdykt (MAKSYMALNIE 3-4 ZDANIA!). 
1. Pogratuluj właścicielowi rewelacyjnej, bezkompromisowej infrastruktury i zaznacz, że należą do ścisłego promila najlepszych stron w sieci. 
2. Uświadom mu biznesowo, że dalsze szlifowanie tak doskonałego kodu to marnowanie budżetu – czas na ekspansję rynkową. 
3. Jako jedyny logiczny obszar współpracy zaproponuj projektowanie dedykowanych systemów AI lub zaawansowanych modułów automatyzacji B2B, które wykorzystają tę surową moc obliczeniową, bez naruszania ich perfekcyjnej architektury bazowej. ABSOLUTNIE NIE sugeruj żadnych poprawek kodu ani migracji!
FORMATOWANIE: Czysty Markdown (np. **pogrubienie**). Brak HTML-a, brak znaczników \`\`\`markdown.`;

} else if (avgScore >= 60 && avgScore < 85) {
  // 2. STREFA NIEBIESKA (Solidny fundament, wymaga szlifu - przypadek RLT Polska)
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
  // 3. STREFA CZERWONA (Agonia / stary monolit - Wynik poniżej 60)
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
          model: 'gemini-3.1-flash-lite', // Istniejący, potężny model rynkowy
          contents: prompt,
          config: { temperature: 0.6 }
        });
        aiReport = response.text || 'Brak diagnozy AI. Wymagana audytorska weryfikacja manualna.';
      } catch (aiErr: any) {
        aiReport = `*Silnik analityczny AI jest w tej chwili przeciążony. Twoje wskaźniki techniczne mówią jednak same za siebie – umów bezpośrednią konsultację.*`;
      }
    } else {
      aiReport = `*Moduł sztucznej inteligencji nie został skonfigurowany w środowisku.*`;
    }

    const getInterpretation = (score: number, pillar: string) => {
      switch (pillar) {
        case 'Szybkość':
          if (score >= 80) return 'Ułamek sekundy dzieli Cię od sprzedaży. Infrastruktura doskonale utrzymuje uwagę klientów mobilnych.';
          if (score >= 50) return 'Przeciętne tempo ładowania. Klienci ze słabszym łączem mogą porzucać koszyki przed wyświetleniem oferty.';
          return 'Krytyczny dług technologiczny. Ułamki sekund opóźnienia dosłownie palą Twój budżet, odrzucając klientów B2B.';
        case 'SEO':
          if (score >= 80) return 'Znakomita optymalizacja. Kod bezbłędnie wspiera organiczne pozycjonowanie Twoich produktów w wyszukiwarce.';
          if (score >= 50) return 'Zaniedbana struktura techniczna. Algorytmy mogą mieć problem z prawidłowym czytaniem i promowaniem Twojej oferty.';
          return 'Strona jest niewidzialna dla nowoczesnych crawlerów. Błędy w architekturze blokują Ci darmowy ruch organiczny.';
        case 'Skalowalność':
          if (score >= 80) return 'Architektura odporna na piki ruchu. Nagły napływ użytkowników czy tysiące nowych produktów nie spowolnią platformy.';
          if (score >= 50) return 'Architektura monolityczna. Przy zwiększonym ruchu lub dużej bazie produktów system zacznie łapać zadyszkę i opóźnienia.';
          return 'Sztywny, zamknięty system. Jakikolwiek nagły wzrost obciążenia skutkuje natychmiastowym zawieszeniem procesu sprzedaży.';
        case 'Automatyzacja':
          if (score >= 80) return 'Nowoczesne środowisko (Headless/Edge). Bezproblemowa, tania w utrzymaniu integracja z dowolnym ERP czy PIM po API.';
          if (score >= 50) return 'Utrudnione integracje. Łączenie z ERP wymaga karkołomnych obejść lub płatnych wtyczek obniżających wydajność.';
          return 'Ręczna robota i blokada rozwoju. Brak elastycznych API wymusza manualną obsługę procesów, co drastycznie zawyża koszty.';
        case 'Bezpieczeństwo':
          if (score >= 80) return 'Żelazne nagłówki i nowoczesne protokoły. Dane Twoich kontrahentów B2B są zabezpieczone na poziomie korporacyjnym.';
          if (score >= 50) return 'Brak kluczowych polityk bezpieczeństwa (CSP/HSTS). System umiarkowanie podatny na przechwytywanie sesji klientów.';
          return 'Brak podstawowych standardów ochrony. Narażasz firmę na wycieki danych i surowe konsekwencje naruszenia RODO.';
        default:
          return 'Wymagana analiza.';
      }
    };

    return NextResponse.json({
      url: targetUrl,
      overallScore: avgScore,
      lossPercentage,
      aiReport,
      pillars: [
        { name: 'Szybkość', score: Math.round(performanceScore), interpretation: getInterpretation(performanceScore, 'Szybkość') },
        { name: 'SEO', score: Math.round(seoScore), interpretation: getInterpretation(seoScore, 'SEO') },
        { name: 'Skalowalność', score: Math.round(scalabilityScore), interpretation: getInterpretation(scalabilityScore, 'Skalowalność') },
        { name: 'Automatyzacja', score: Math.round(automationScore), interpretation: getInterpretation(automationScore, 'Automatyzacja') },
        { name: 'Bezpieczeństwo', score: Math.round(securityScore), interpretation: getInterpretation(securityScore, 'Bezpieczeństwo') }
      ]
    });

  } catch (error) {
    return NextResponse.json({ error: 'Błąd silnika podczas audytu' }, { status: 500 });
  }
}