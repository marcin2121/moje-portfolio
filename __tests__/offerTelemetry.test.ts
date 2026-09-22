import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  notifyOfferOpened,
  notifyOfferAttention,
  notifyOfferAccepted,
  notifyOfferQuestion
} from '@/lib/offerDiscordNotifier';

describe('Offer Telemetry & Discord Notification Engine (Traferto-Style)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('handles missing webhook URL silently without throwing errors', async () => {
    delete process.env.DISCORD_WEBHOOK_URL;
    const fetchSpy = vi.spyOn(global, 'fetch');

    await expect(notifyOfferOpened({
      slug: 'test-slug',
      companyName: 'Test Sp. z o.o.'
    })).resolves.not.toThrow();

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('sends rich embed on offer opened', async () => {
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/mock';
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));

    await notifyOfferOpened({
      slug: 'auto-serwis-tomasz',
      companyName: 'Auto Serwis Tomasz',
      clientName: 'Tomasz',
      deviceType: 'Komputer (Desktop)'
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const callArgs = fetchSpy.mock.calls[0];
    expect(callArgs[0]).toBe('https://discord.com/api/webhooks/mock');
    
    const body = JSON.parse(callArgs[1]?.body as string);
    expect(body.embeds[0].title).toContain('Auto Serwis Tomasz');
    expect(body.embeds[0].color).toBe(0x38bdf8); // Sky blue
  });

  it('sends attention map breakdown on attention ping', async () => {
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/mock';
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));

    await notifyOfferAttention({
      slug: 'stowarzyszenie-aktywacja',
      companyName: 'Stowarzyszenie Aktywacja',
      totalSeconds: 95,
      sectionTimes: {
        hero: 15,
        diagnosis: 20,
        pricing: 60
      }
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    expect(body.embeds[0].title).toContain('Mapa uwagi klienta');
    expect(body.embeds[0].color).toBe(0x818cf8); // Indigo
    const pricingField = body.embeds[0].fields.find((f: { name: string }) => f.name.includes('Czas na poszczególnych sekcjach'));
    expect(pricingField?.value).toContain('Cennik i pakiety');
  });

  it('ignores attention ping under 5 seconds to avoid bot noise', async () => {
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/mock';
    const fetchSpy = vi.spyOn(global, 'fetch');

    await notifyOfferAttention({
      slug: 'bot-test',
      companyName: 'Bot Scanner',
      totalSeconds: 3,
      sectionTimes: { hero: 3 }
    });

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('sends high-priority alert on offer acceptance', async () => {
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/mock';
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));

    await notifyOfferAccepted({
      slug: 'stowarzyszenie-aktywacja',
      companyName: 'Stowarzyszenie Aktywacja',
      packageName: 'KOMPLETNY PORTAL STOWARZYSZENIA',
      price: '12 500',
      clientName: 'Jan Kowalski',
      email: 'zarzad@aktywacja.org.pl',
      phone: '+48 600 100 200',
      comment: 'Zależy nam na starcie od 1 października'
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    expect(body.embeds[0].title).toContain('OFERTA ZAAKCEPTOWANA');
    expect(body.embeds[0].color).toBe(0x10b981); // Emerald
    expect(body.embeds[0].fields.some((f: { value: string }) => f.value.includes('12 500 zł'))).toBe(true);
  });

  it('sends alert on client question', async () => {
    process.env.DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/mock';
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));

    await notifyOfferQuestion({
      slug: 'stowarzyszenie-aktywacja',
      companyName: 'Stowarzyszenie Aktywacja',
      clientName: 'Anna Nowak',
      email: 'anna@aktywacja.org.pl',
      section: 'pricing',
      question: 'Czy płatność za portal można podzielić na 3 transze dotacyjne?'
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const body = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
    expect(body.embeds[0].title).toContain('Pytanie do oferty');
    expect(body.embeds[0].color).toBe(0xf59e0b); // Amber
    expect(body.embeds[0].fields.some((f: { value: string }) => f.value.includes('transze dotacyjne'))).toBe(true);
  });
});
