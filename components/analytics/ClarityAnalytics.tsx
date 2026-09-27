'use client';

import Script from 'next/script';

/**
 * Microsoft Clarity w trybie Cookieless (Zero Cookies / Zero Consent Banner).
 * 
 * Zgodnie z art. 173 Prawa Telekomunikacyjnego / Dyrektywą ePrivacy:
 * Wywołanie window.clarity('consent', false) oraz wyłączenie cookies w panelu Clarity
 * sprawia, że Clarity działa w pamięci sesji bez zapisywania ani odczytywania plików cookie
 * czy localStorage na urządzeniu użytkownika.
 * 
 * Nie wymaga to wyświetlania banera cookies.
 * 
 * Aby aktywować, wystarczy dodać NEXT_PUBLIC_CLARITY_ID w pliku .env.local
 */
export default function ClarityAnalytics() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || 'yotc5ca90h';

  return (
    <Script
      id="microsoft-clarity-cookieless"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
          window.clarity && window.clarity('consent', false);
        `
      }}
    />
  );
}
