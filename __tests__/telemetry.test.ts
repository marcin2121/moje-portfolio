import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  pushGTMEvent,
  trackAuditEvent,
  trackLeadConversion,
  trackGeneralLeadConversion,
} from '@/lib/telemetry';

describe('telemetry and conversion tracking', () => {
  beforeEach(() => {
    // Reset window state before each test
    window.dataLayer = [];
    window.gtag = vi.fn();
    window.umami = {
      track: vi.fn(),
    };
  });

  it('pushes custom events to dataLayer and Umami', () => {
    pushGTMEvent('test_event', { foo: 'bar' });

    expect(window.dataLayer).toContainEqual({
      event: 'test_event',
      foo: 'bar',
    });
    expect(window.umami?.track).toHaveBeenCalledWith('test_event', { foo: 'bar' });
  });

  it('tracks audit generation as a micro-conversion in gtag and dataLayer', () => {
    trackAuditEvent({
      domain: 'stowarzyszeniekas.pl',
      score: 89,
      siteType: 'ngo_foundation',
      token: 'tok_123',
    });

    expect(window.dataLayer).toContainEqual({
      event: 'audyt_wygenerowany',
      domena: 'stowarzyszeniekas.pl',
      wynik: 89,
      typ_witryny: 'ngo_foundation',
      token: 'tok_123',
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'audit_generated', {
      domain: 'stowarzyszeniekas.pl',
      score: 89,
      site_type: 'ngo_foundation',
      value: 50,
      currency: 'PLN',
    });
  });

  it('tracks macro-conversion for fixes intent with enhanced conversions and value', () => {
    trackLeadConversion({
      domain: 'dzikistyldemo.vercel.app',
      intent: 'fixes',
      email: 'klient@example.com ',
      phone: ' +48 500 600 700 ',
      token: 'tok_fixes_456',
    });

    // Enhanced conversions user_data check
    expect(window.gtag).toHaveBeenCalledWith('set', 'user_data', {
      email: 'klient@example.com',
      phone_number: '+48 500 600 700',
    });

    // GA4 / Google Ads standard lead event with value 1500 PLN
    expect(window.gtag).toHaveBeenCalledWith('event', 'generate_lead', {
      value: 1500,
      currency: 'PLN',
      lead_type: 'fixes',
      lead_service_name: 'Wdrożenie poprawek z audytu',
      domain: 'dzikistyldemo.vercel.app',
      transaction_id: 'tok_fixes_456',
      user_data: {
        email: 'klient@example.com',
        phone_number: '+48 500 600 700',
      },
    });

    // dataLayer payload check
    expect(window.dataLayer).toContainEqual({
      event: 'lead_konsultacja_audyt',
      domena: 'dzikistyldemo.vercel.app',
      intencja: 'fixes',
      nazwa_uslugi: 'Wdrożenie poprawek z audytu',
      wartosc_pln: 1500,
      token: 'tok_fixes_456',
    });
  });

  it('tracks macro-conversion for full audit intent with value 800 PLN', () => {
    trackLeadConversion({
      domain: 'sklep.pl',
      intent: 'audit',
      email: 'ceo@sklep.pl',
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'generate_lead', expect.objectContaining({
      value: 800,
      lead_type: 'audit',
      lead_service_name: 'Pełny audyt serwisu',
    }));
  });

  it('tracks macro-conversion for both intent with bundle value 2500 PLN', () => {
    trackLeadConversion({
      domain: 'sklep.pl',
      intent: 'both',
      email: 'ceo@sklep.pl',
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'generate_lead', expect.objectContaining({
      value: 2500,
      lead_type: 'both',
      lead_service_name: 'Audyt + wdrożenie poprawek',
    }));
  });

  it('tracks general contact form lead conversion', () => {
    trackGeneralLeadConversion('kontakt@firma.pl', '123456789');

    expect(window.gtag).toHaveBeenCalledWith('set', 'user_data', {
      email: 'kontakt@firma.pl',
      phone_number: '123456789',
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'generate_lead', {
      value: 2000,
      currency: 'PLN',
      lead_type: 'kontakt_ogolny',
      user_data: {
        email: 'kontakt@firma.pl',
        phone_number: '123456789',
      },
    });
  });
});
