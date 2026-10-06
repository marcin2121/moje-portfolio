import Script from 'next/script';

/**
 * Komponent ładujący Google Ads (gtag.js) z obsługą Google Consent Mode v2,
 * Enhanced Conversions oraz opcjonalnego Google Tag Managera.
 * 
 * Zgodny z najnowszymi wytycznymi Google 2025/2026 i App Router.
 */
export default function GoogleAdsTracker() {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {/* Google Consent Mode v2: Domyślny stan zgód przed załadowaniem tagów */}
      <script
        id="google-consent-mode-v2"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              'ad_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted',
              'analytics_storage': 'granted'
            });
          `,
        }}
      />

      {/* Skrypt Google Ads (gtag.js) */}
      {adsId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-ads-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                gtag('js', new Date());
                gtag('config', '${adsId}', {
                  allow_enhanced_conversions: true
                });
              `,
            }}
          />
        </>
      ) : null}

      {/* Opcjonalny kontener Google Tag Manager */}
      {gtmId ? (
        <Script
          id="gtm-container"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'dataLayer','${gtmId}');
            `,
          }}
        />
      ) : null}
    </>
  );
}
