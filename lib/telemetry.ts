/**
 * Centralny moduł telemetryki i analityki konwersji (Google Ads, GTM, Umami).
 * Obsługuje Google Consent Mode v2, Enhanced Conversions (rozszerzone konwersje)
 * oraz dwuetapowy lejek:
 *  1. Mikrokonwersja: Wygenerowanie audytu (zaangażowanie użytkownika)
 *  2. Główna Makrokonwersja: Wysłanie zapytania ofertowego (wdrożenie poprawek / pełny audyt)
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    umami?: { track: (event: string, data?: Record<string, unknown>) => void };
  }
}

const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const GOOGLE_ADS_AUDIT_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_AUDIT_LABEL;
const GOOGLE_ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;

/**
 * Bezpieczne wywołanie window.gtag z kolejkowaniem w dataLayer.
 */
export function callGtag(...args: unknown[]): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    try {
      window.gtag(...args);
    } catch (err: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Telemetry] Błąd wywołania gtag:', err);
      }
    }
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(args as unknown as Record<string, unknown>);
  }
}

/**
 * Standardowy dispatcher do GTM / dataLayer oraz Umami Analytics.
 */
export function pushGTMEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });

    if (window.umami && typeof window.umami.track === 'function') {
      try {
        window.umami.track(eventName, params);
      } catch {
        // Ignoruj błędy telemetryki w środowisku lokalnym
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Telemetry] Zdarzenie: "${eventName}"`, params);
    }
  } catch (err: unknown) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Telemetry] Błąd wysyłania zdarzenia:', err);
    }
  }
}

export interface AuditTelemetryPayload {
  domain: string;
  score: number;
  siteType?: string;
  token?: string;
}

/**
 * KROK 1 (MIKROKONWERSJA): Wygenerowanie audytu w serwisie.
 * Informuje Google Ads i analitykę o zaangażowaniu użytkownika w darmowe narzędzie.
 */
export function trackAuditEvent(payload: AuditTelemetryPayload): void {
  const { domain, score, siteType, token } = payload;

  // 1. dataLayer & Umami
  pushGTMEvent('audyt_wygenerowany', {
    domena: domain,
    wynik: score,
    typ_witryny: siteType || 'nieznany',
    token: token || undefined,
  });

  // 2. Google Analytics / Google Ads event
  callGtag('event', 'audit_generated', {
    domain,
    score,
    site_type: siteType || 'generic',
    value: 50,
    currency: 'PLN',
  });

  // 3. Bezpośrednia konwersja Google Ads (jeśli zdefiniowano etykietę mikrokonwersji)
  if (GOOGLE_ADS_ID && GOOGLE_ADS_AUDIT_LABEL) {
    callGtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_AUDIT_LABEL}`,
      value: 50,
      currency: 'PLN',
      transaction_id: token || undefined,
    });
  }
}

export type ConsultationIntent = 'audit' | 'fixes' | 'both';

export interface LeadConversionPayload {
  domain: string;
  intent: ConsultationIntent;
  email: string;
  phone?: string;
  token?: string;
  notes?: string;
}

const INTENT_VALUES: Record<ConsultationIntent, number> = {
  fixes: 1500, // Wdrożenie poprawek z audytu
  audit: 800,  // Pełny audyt wielopodstronicowy
  both: 2500,  // Pakiet: Pełny audyt + wdrożenie poprawek
};

const INTENT_NAMES: Record<ConsultationIntent, string> = {
  fixes: 'Wdrożenie poprawek z audytu',
  audit: 'Pełny audyt serwisu',
  both: 'Audyt + wdrożenie poprawek',
};

/**
 * KROK 2 (GŁÓWNA MAKROKONWERSJA): Wysłanie formularza zapytania ofertowego po audycie.
 * Przekazuje Enhanced Conversions (zaszyfrowane dane kontaktowe) do Smart Bidding Google Ads,
 * dynamiczną wartość usługi w PLN oraz rejestruje lead we wszystkich systemach analitycznych.
 */
export function trackLeadConversion(payload: LeadConversionPayload): void {
  const { domain, intent, email, phone, token } = payload;
  const leadValue = INTENT_VALUES[intent] || 1500;
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phone?.trim() || undefined;

  // 1. Enhanced Conversions (Google Ads dopasowanie do konta Google)
  const userData: Record<string, string> = {
    email: cleanEmail,
  };
  if (cleanPhone) {
    userData.phone_number = cleanPhone;
  }
  callGtag('set', 'user_data', userData);

  // 2. dataLayer & Umami
  pushGTMEvent('lead_konsultacja_audyt', {
    domena: domain,
    intencja: intent,
    nazwa_uslugi: INTENT_NAMES[intent],
    wartosc_pln: leadValue,
    token: token || undefined,
  });

  // 3. Standardowy event GA4 / Google Ads (generate_lead)
  callGtag('event', 'generate_lead', {
    value: leadValue,
    currency: 'PLN',
    lead_type: intent,
    lead_service_name: INTENT_NAMES[intent],
    domain: domain,
    transaction_id: token || undefined,
    user_data: userData,
  });

  // 4. Bezpośrednia makrokonwersja Google Ads
  if (GOOGLE_ADS_ID && GOOGLE_ADS_LEAD_LABEL) {
    callGtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
      value: leadValue,
      currency: 'PLN',
      transaction_id: token || undefined,
      user_data: userData,
    });
  }
}

/**
 * Śledzenie głównego formularza kontaktowego na stronie głównej (ogólny lead).
 */
export function trackGeneralLeadConversion(email?: string, phone?: string): void {
  const cleanEmail = email?.trim().toLowerCase();
  const cleanPhone = phone?.trim();

  const userData: Record<string, string> = {};
  if (cleanEmail) userData.email = cleanEmail;
  if (cleanPhone) userData.phone_number = cleanPhone;

  if (Object.keys(userData).length > 0) {
    callGtag('set', 'user_data', userData);
  }

  pushGTMEvent('formularz_kontaktowy_sukces', {
    email: cleanEmail ? 'podano' : 'brak',
  });

  callGtag('event', 'generate_lead', {
    value: 2000,
    currency: 'PLN',
    lead_type: 'kontakt_ogolny',
    user_data: Object.keys(userData).length > 0 ? userData : undefined,
  });

  if (GOOGLE_ADS_ID && GOOGLE_ADS_LEAD_LABEL) {
    callGtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
      value: 2000,
      currency: 'PLN',
      user_data: Object.keys(userData).length > 0 ? userData : undefined,
    });
  }
}
