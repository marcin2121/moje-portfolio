/**
 * Microsoft Clarity w trybie Cookieless (Zero Cookies / Zero Consent Banner).
 * 
 * Zgodnie z art. 173 Prawa Telekomunikacyjnego / Dyrektywą ePrivacy:
 * Wywołanie window.clarity('consent', false) oraz wyłączenie cookies w panelu Clarity
 * sprawia, że Clarity działa w pamięci sesji bez zapisywania ani odczytywania plików cookie
 * czy localStorage na urządzeniu użytkownika.
 * 
 * Renderowane po stronie serwera (SSR) jako inline script, co gwarantuje
 * natychmiastową detekcję przez silnik audytu i boty.
 */
export default function ClarityAnalytics() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || 'yotc5ca90h';

  return (
    <script
      id="microsoft-clarity-cookieless"
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
