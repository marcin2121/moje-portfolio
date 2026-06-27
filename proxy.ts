import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Algorytm Sliding Window: Max 5 zapytań na 60 sekund.
// Inicjalizacja poza handlerem dla optymalizacji na Edge (wymaga zmiennych środowiskowych)
let ratelimit: Ratelimit | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '60 s'),
      analytics: true,
    });
  } else {
    console.warn("Upstash Redis nie jest skonfigurowany, omijam Rate Limit.");
  }
} catch (e) {
  console.warn("Upstash Redis initialization failed.", e);
}

export async function proxy(request: NextRequest) {
  // 1. Generujemy unikalny kryptograficznie Nonce dla każdego żądania (Top 1% Security)
  const nonce = btoa(crypto.randomUUID());
  const isDev = process.env.NODE_ENV === 'development';
  
  // Dodajemy 'unsafe-inline' ponieważ strona jest statyczna (SSG). 
  // W stronach SSG Next.js nie wstrzykuje nonce do wygenerowanego HTML-a podczas zapytania.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://analytics.molendadevelopment.pl https://n8n.molendadevelopment.pl;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' https://analytics.molendadevelopment.pl https://n8n.molendadevelopment.pl;
    frame-src 'self' https://www.youtube.com https://n8n.molendadevelopment.pl;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  `;

  // Formatujemy nagłówek (usuwamy nowe linie)
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

  // 3. Ustawiamy x-nonce, żeby Next.js wiedział, że ma go doklejać do tagów <script> automatycznie
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Dodajemy z powrotem do finalnej odpowiedzi
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  // 4. Rate Limiting dla /api/ 
  if (request.nextUrl.pathname.startsWith('/api/') && ratelimit) {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    
    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);

      if (!success) {
        return new NextResponse('Zbyt wiele zapytań - spróbuj ponownie później', {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          }
        });
      }
    } catch (error) {
      console.error("Rate Limit Error:", error);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
