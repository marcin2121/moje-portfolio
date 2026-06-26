import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Generujemy unikalny kryptograficznie Nonce dla każdego żądania (Top 1% Security)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // 2. Definiujemy rygorystyczne CSP z Nonce oraz zablokowanym object-src
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://analytics.molendadevelopment.pl https://n8n.molendadevelopment.pl;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' https://analytics.molendadevelopment.pl https://n8n.molendadevelopment.pl;
    frame-src 'self' https://www.youtube.com https://n8n.molendadevelopment.pl;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
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

  return response;
}

export const config = {
  matcher: [
    // Aplikuj CSP dla wszystkich ścieżek oprócz plików statycznych
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
