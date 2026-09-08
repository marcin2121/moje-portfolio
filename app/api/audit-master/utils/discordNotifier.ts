import { SiteType, SITE_TYPE_LABELS } from '../types';

/**
 * Moduł powiadomień Discord Webhook
 * Działa w trybie Fire-and-Forget – nie blokuje odpowiedzi serwera i nie opóźnia użytkownika.
 */

interface AuditNotificationParams {
  domain: string;
  token: string;
  overallScore: number;
  lossPercentage: number;
  detectedPlatform: string;
  siteType: SiteType;
  criticalLeaksCount?: number;
  competitorDomain?: string;
  competitorScore?: number;
}

interface LeadNotificationParams {
  domain: string;
  email: string;
  phone: string;
  token?: string;
  notes?: string;
}

const getWebhookUrl = (): string | undefined => {
  return process.env.DISCORD_WEBHOOK_URL;
};

/**
 * Wysyła powiadomienie na Discord o nowo wygenerowanym audycie.
 */
export async function notifyAuditGenerated(params: AuditNotificationParams): Promise<void> {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) return;

  try {
    const {
      domain,
      token,
      overallScore,
      lossPercentage,
      detectedPlatform,
      siteType,
      criticalLeaksCount = 0,
      competitorDomain,
      competitorScore
    } = params;

    // Kolor w zależności od wyniku: Zielony (>=80), Bursztynowy (50-79), Czerwony (<50)
    const color = overallScore >= 80 ? 0x10b981 : overallScore >= 50 ? 0xf59e0b : 0xe11d48;
    const siteLabel = SITE_TYPE_LABELS[siteType] || (siteType === 'ecommerce' ? '🛒 E-commerce (Sklep)' : '🏢 Usługi / B2B');
    const auditUrl = `https://molendadevelopment.pl/narzedzia/audyt?token=${token}`;

    const fields = [
      { name: 'Wynik Główny', value: `**${overallScore}/100** (Utrata: ~${lossPercentage}%)`, inline: true },
      { name: 'Typ witryny', value: siteLabel, inline: true },
      { name: 'Wykryta platforma', value: detectedPlatform || 'Nierozpoznano', inline: true },
      { name: 'Krytyczne wycieki', value: `${criticalLeaksCount} krytycznych błędów`, inline: true }
    ];

    if (competitorDomain && competitorScore !== undefined) {
      fields.push({
        name: '⚔️ Benchmark z konkurencją',
        value: `vs **${competitorDomain}** (${competitorScore}/100)`,
        inline: true
      });
    }

    fields.push({
      name: '🔗 Link do raportu',
      value: `[Zobacz pełny audyt dla ${domain}](${auditUrl})`,
      inline: false
    });

    const payload = {
      username: 'Audit Master 2.0',
      avatar_url: 'https://molendadevelopment.pl/icon.png',
      embeds: [
        {
          title: `🔍 Nowy audyt witryny: ${domain}`,
          url: auditUrl,
          color,
          description: `Zrealizowano pełną analizę kodu, telemetryki reklamowej i Core Web Vitals dla domeny **${domain}**.`,
          fields,
          footer: {
            text: 'Audit Master 2.0 · Molenda Development'
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000)
    });
  } catch (err) {
    // Cichy fallback – błąd powiadomienia Discord nie może uszkodzić odpowiedzi klienta
    console.error('[Discord Webhook] Błąd wysyłki powiadomienia o audycie:', err);
  }
}

/**
 * Wysyła powiadomienie na Discord o nowym leadzie / zgłoszeniu na bezpłatną konsultację.
 */
export async function notifyLeadReceived(params: LeadNotificationParams): Promise<void> {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) return;

  try {
    const { domain, email, phone, token, notes } = params;
    const auditUrl = token ? `https://molendadevelopment.pl/narzedzia/audyt?token=${token}` : null;

    const fields = [
      { name: '🌐 Domena klienta', value: domain, inline: true },
      { name: '📧 Adres e-mail', value: `[${email}](mailto:${email})`, inline: true },
      { name: '📞 Telefon', value: `[${phone}](tel:${phone})`, inline: true }
    ];

    if (notes) {
      fields.push({ name: '📝 Treść wiadomości', value: notes, inline: false });
    }

    if (auditUrl) {
      fields.push({
        name: '🔍 Raport audytu klienta',
        value: `[Otwórz audyt powiązany z leadem](${auditUrl})`,
        inline: false
      });
    }

    const payload = {
      username: 'Audit Master Lead Bot',
      avatar_url: 'https://molendadevelopment.pl/icon.png',
      embeds: [
        {
          title: `🔥 NOWY LEAD: Zgłoszenie na konsultację techniczną (${domain})`,
          color: 0x6366f1, // Indigo
          description: `Klient złożył zamówienie na bezpłatną konsultację i wdrożenie naprawcze w 24–48h!`,
          fields,
          footer: {
            text: 'Audit Master Lead Engine · Molenda Development'
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000)
    });
  } catch (err) {
    console.error('[Discord Webhook] Błąd wysyłki powiadomienia o leadzie:', err);
  }
}
