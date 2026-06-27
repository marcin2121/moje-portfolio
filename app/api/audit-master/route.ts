import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL jest wymagany' }, { status: 400 });
    }

    // Upewnij się, że adres ma protokół
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const apiKey = process.env.PAGESPEED_API_KEY;

    // 1. Zbadaj Szybkość i SEO (Lighthouse / PageSpeed API)
    let performanceScore = 0;
    let seoScore = 0;
    
    const fetchPageSpeed = async (retries = 2): Promise<any> => {
      const psUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=desktop&category=performance&category=seo${apiKey ? `&key=${apiKey}` : ''}`;
      
      for (let i = 0; i < retries; i++) {
        try {
          const psRes = await fetch(psUrl, { cache: 'no-store', signal: AbortSignal.timeout(120000) });
          if (!psRes.ok) throw new Error(`HTTP Error: ${psRes.status}`);
          return await psRes.json();
        } catch (err: any) {
          if (i === retries - 1) throw err;
          console.warn(`PageSpeed API fetch attempt ${i + 1} failed. Retrying...`, err.message);
          await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2s before retry
        }
      }
    };

    try {
      const psData = await fetchPageSpeed(2);
      
      performanceScore = (psData?.lighthouseResult?.categories?.performance?.score || 0.4) * 100;
      seoScore = (psData?.lighthouseResult?.categories?.seo?.score || 0.5) * 100;
    } catch (err) {
      console.error('PageSpeed API Error:', err);
      // Fallback w przypadku awarii API
      performanceScore = 45; 
      seoScore = 55;
    }

    // 2. Fetch HTML i Nagłówków dla pozostałych filarów
    let securityScore = 30;
    let scalabilityScore = 30;
    let automationScore = 30;
    let html = '';
    
    try {
      // Pobieramy kod strony z nagłówkiem podszywającym się pod standardową przeglądarkę, max 15 sekund
      const siteRes = await fetch(targetUrl, { 
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      html = await siteRes.text();
      
      // Bezpieczeństwo - sprawdzamy nagłówki HTTP
      let secScore = 20;
      if (siteRes.headers.get('strict-transport-security')) secScore += 30;
      if (siteRes.headers.get('content-security-policy')) secScore += 30;
      if (siteRes.headers.get('x-frame-options')) secScore += 20;
      securityScore = secScore;

      // Tech Stack Detection (Skalowalność i Automatyzacja)
      const isWordPress = html.includes('wp-content') || html.includes('wp-includes');
      const isNextJs = html.includes('__NEXT_DATA__') || html.includes('next/router');
      const isShopify = html.includes('Shopify.shop') || html.includes('cdn.shopify.com');
      
      if (isNextJs) {
        scalabilityScore = 95;
        automationScore = 90;
      } else if (isShopify) {
        scalabilityScore = 80;
        automationScore = 70;
      } else if (isWordPress) {
        scalabilityScore = 40;
        automationScore = 30;
      } else {
        // Nieznany system - zakładamy bezpieczną, ale niską wartość
        scalabilityScore = 50;
        automationScore = 50;
      }

    } catch (err) {
      console.error('Site Fetch Error:', err);
      // Jeśli domena nie odpowiada / blokuje CORS, zaniżamy wynik
      securityScore = 25;
      scalabilityScore = 45;
      automationScore = 45;
    }

    const avgScore = Math.round((performanceScore + seoScore + securityScore + scalabilityScore + automationScore) / 5);
    const estimatedLoss = Math.round((100 - avgScore) * 185); 

    // --- INTEGRACJA GEMINI AI ---
    let aiReport = '';
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const prompt = `
Jesteś Marcinem Molendą, wybitnym Senior Frontend Architectem. 
Oto wyniki audytu technologicznego sklepu pod adresem: ${targetUrl}.
Średni wynik: ${avgScore}/100.
Filary:
- Szybkość: ${Math.round(performanceScore)}/100
- SEO: ${Math.round(seoScore)}/100
- Skalowalność: ${Math.round(scalabilityScore)}/100
- Automatyzacja: ${Math.round(automationScore)}/100
- Bezpieczeństwo: ${Math.round(securityScore)}/100

Twoje zadanie: Napisz zwięzły, brutalnie szczery i profesjonalny werdykt z perspektywy inżyniera, kierowany do właściciela biznesu.
Jeśli wynik przekracza 80, pogratuluj im świetnej architektury i zaproponuj jedynie wsparcie przy specyficznych integracjach B2B, nie wymyślaj problemów na siłę.
Jeśli wynik jest słaby (np. poniżej 60), uświadom ich bez litości, jak wolne ładowanie i przestarzały stack niszczą ich wskaźnik konwersji (CR) i powodują realne straty (szacunkowa utrata: ${estimatedLoss} PLN/mc).
Zasugeruj, że jedynym solidnym rozwiązaniem jest przejście na autorskie środowisko Serverless Edge (Next.js). Bądź ekspertem, który dostrzega uciekające pieniądze, a nie nachalnym akwizytorem. Użyj formatowania HTML (np. <strong>, <p>, <ul>, <br>), aby odpowiedź była od razu gotowa do wklejenia w interfejsie reacta. Nie używaj znaczników markdown (\`\`\`).
Bądź zwięzły, max 4-5 zdań.`;

      const ai = new GoogleGenAI({ apiKey: geminiKey });
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            temperature: 0.7,
          }
        });

        aiReport = response.text || `<p>Otrzymano puste dane z analizatora AI. Wymagana ręczna konsultacja architektoniczna.</p>`;
      } catch (aiErr: any) {
        console.error("Gemini SDK Error:", aiErr);
        aiReport = `<p>Niestety, silnik analityczny AI jest w tej chwili przeciążony (Błąd: ${aiErr?.message || 'Nieznany'}). Jednak Twoje wyniki mówią same za siebie. Umów bezpłatną konsultację.</p>`;
      }
    } else {
      aiReport = `<p>Moduł sztucznej inteligencji nie jest skonfigurowany. Skontaktuj się z administratorem.</p>`;
    }

    const getInterpretation = (score: number, pillar: string) => {
      if (score >= 80) return `Znakomity wynik. Infrastruktura wspiera sprzedaż w obszarze ${pillar}.`;
      if (score >= 50) return `Przeciętnie. Potencjalne wąskie gardło obniżające wskaźnik konwersji.`;
      return `Krytyczne zagrożenie dla sprzedaży. Natychmiastowa interwencja zalecana.`;
    };

    return NextResponse.json({
      url: targetUrl,
      overallScore: avgScore,
      estimatedLoss,
      aiReport,
      pillars: [
        { name: 'Szybkość', score: Math.round(performanceScore), interpretation: getInterpretation(performanceScore, 'szybkości') },
        { name: 'SEO', score: Math.round(seoScore), interpretation: getInterpretation(seoScore, 'SEO') },
        { name: 'Skalowalność', score: Math.round(scalabilityScore), interpretation: getInterpretation(scalabilityScore, 'skalowalności') },
        { name: 'Automatyzacja', score: Math.round(automationScore), interpretation: getInterpretation(automationScore, 'automatyzacji') },
        { name: 'Bezpieczeństwo', score: Math.round(securityScore), interpretation: getInterpretation(securityScore, 'bezpieczeństwa') }
      ]
    });

  } catch (error) {
    console.error('Audit Engine Error:', error);
    return NextResponse.json({ error: 'Błąd serwera podczas audytu' }, { status: 500 });
  }
}
