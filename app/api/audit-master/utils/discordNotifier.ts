import { SiteType, SITE_TYPE_LABELS } from '../types';

/**
 * Moduł powiadomień Discord Webhook
 * Działa w trybie Fire-and-Forget - nie blokuje odpowiedzi serwera i nie opóźnia użytkownika.
 */

interface AuditNotificationParams {
  domain: string;
  token: string;
  overallScore: number;
  lossPercentage: number;
  detectedPlatform: string;
  siteType: SiteType;
  criticalLeaksCount?: number;
  criticalIssues?: string[];
  competitorDomain?: string;
  competitorScore?: number;
}

interface LeadNotificationParams {
  domain: string;
  email: string;
  phone?: string;
  token?: string;
  notes?: string;
}

const getWebhookUrl = (): string | undefined => {
  return process.env.DISCORD_WEBHOOK_URL;
};

function formatCriticalIssuesCount(count: number): string {
  if (count === 0) return 'Brak błędów krytycznych';
  if (count === 1) return '1 błąd krytyczny';
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} błędy krytyczne`;
  }
  return `${count} błędów krytycznych`;
}

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
      criticalIssues,
      competitorDomain,
      competitorScore
    } = params;

    // Kolor w zależności od wyniku: Zielony (>=80), Bursztynowy (50-79), Czerwony (<50)
    const color = overallScore >= 80 ? 0x10b981 : overallScore >= 50 ? 0xf59e0b : 0xe11d48;
    const siteLabel = SITE_TYPE_LABELS[siteType] || (siteType === 'ecommerce' ? '🛒 E-commerce (Sklep)' : '🏢 Usługi / B2B');
    const auditUrl = `https://molendadevelopment.pl/narzedzia/audyt?token=${token}&url=${encodeURIComponent(domain)}`;

    const lossText = overallScore >= 100 || lossPercentage === 0
      ? 'Maksymalna wydajność'
      : `Szacowany spadek: ~${lossPercentage}%`;

    const fields = [
      { name: 'Wynik Główny', value: `**${overallScore}/100** (${lossText})`, inline: true },
      { name: 'Typ witryny', value: siteLabel, inline: true },
      { name: 'Wykryta platforma', value: detectedPlatform || 'Nierozpoznano', inline: true },
      { name: 'Błędy krytyczne', value: formatCriticalIssuesCount(criticalLeaksCount), inline: true }
    ];

    if (criticalIssues && criticalIssues.length > 0) {
      fields.push({
        name: '⚠️ Kluczowe usterki',
        value: criticalIssues.slice(0, 4).map(t => `• ${t}`).join('\n'),
        inline: false
      });
    }

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
    // Cichy fallback - błąd powiadomienia Discord nie może uszkodzić odpowiedzi klienta
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
    const auditUrl = token ? `https://molendadevelopment.pl/narzedzia/audyt?token=${token}&url=${encodeURIComponent(domain)}` : null;

    const fields = [
      { name: '🌐 Domena klienta', value: domain, inline: true },
      { name: '📧 Adres e-mail', value: `[${email}](mailto:${email})`, inline: true },
      { name: '📞 Telefon', value: phone ? `[${phone}](tel:${phone})` : 'Brak (kontakt mailowy)', inline: true }
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
          description: 'Klient złożył zapytanie o konsultację techniczną i wdrożenie poprawek.',
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
