/**
 * Moduł powiadomień Discord dla Interaktywnego Systemu Ofert (/oferta/[slug])
 * Działa w trybie Fire-and-Forget, nie blokując wątku i nie obciążając użytkownika.
 */

interface OfferOpenedParams {
  slug: string;
  companyName: string;
  clientName?: string;
  referrer?: string;
  deviceType?: string;
}

interface OfferAttentionParams {
  slug: string;
  companyName: string;
  totalSeconds: number;
  sectionTimes: Record<string, number>; // sekcja -> sekundy
}

interface OfferAcceptedParams {
  slug: string;
  companyName: string;
  packageName: string;
  price: string | number;
  clientName: string;
  email: string;
  phone?: string;
  comment?: string;
}

interface OfferQuestionParams {
  slug: string;
  companyName: string;
  clientName: string;
  email: string;
  phone?: string;
  section?: string;
  question: string;
}

const getWebhookUrl = (): string | undefined => {
  return process.env.DISCORD_WEBHOOK_URL;
};

const formatSeconds = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
};

const SECTION_LABELS: Record<string, string> = {
  hero: 'Wstęp i powitanie',
  video: 'Wideo od architekta',
  diagnosis: 'Diagnoza i analiza konkurencji',
  pricing: 'Cennik i pakiety',
  faq: 'Pytania i odpowiedzi',
  guarantee: 'Gwarancja i warunki'
};

/**
 * 1. Powiadomienie: Klient właśnie otworzył ofertę
 */
export async function notifyOfferOpened(params: OfferOpenedParams): Promise<void> {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) return;

  try {
    const { slug, companyName, clientName, deviceType } = params;
    const offerUrl = `https://molendadevelopment.pl/oferta/${slug}`;

    const fields = [
      { name: '🏢 Firma', value: companyName, inline: true },
      { name: '👤 Odbiorca', value: clientName || 'Klient', inline: true },
      { name: '📱 Urządzenie', value: deviceType || 'Desktop', inline: true },
      { name: '🔗 Link do oferty', value: `[Otwórz ofertę ${companyName}](${offerUrl})`, inline: false }
    ];

    const payload = {
      username: 'Molenda Offers Bot',
      avatar_url: 'https://molendadevelopment.pl/icon.png',
      embeds: [
        {
          title: `👀 Klient właśnie otworzył ofertę: ${companyName}`,
          url: offerUrl,
          color: 0x38bdf8, // Sky blue
          description: `Wykryto otwarcie dokumentu ofertowego online. Klient przegląda ofertę w czasie rzeczywistym.`,
          fields,
          footer: {
            text: 'System Ofertowy Traferto-Style · Molenda Development'
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
    console.error('[Discord Webhook] Błąd wysyłki zdarzenia offer_opened:', err);
  }
}

/**
 * 2. Powiadomienie: Podsumowanie czasu czytania i mapa uwagi (Attention Map)
 */
export async function notifyOfferAttention(params: OfferAttentionParams): Promise<void> {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) return;

  try {
    const { slug, companyName, totalSeconds, sectionTimes } = params;
    
    // Ignoruj wizyty poniżej 5 sekund (przypadkowe kliknięcia / boty)
    if (totalSeconds < 5) return;

    const offerUrl = `https://molendadevelopment.pl/oferta/${slug}`;

    // Znajdź sekcję, na której spędził najwięcej czasu
    let maxSection = '';
    let maxTime = 0;
    const sectionEntries = Object.entries(sectionTimes)
      .filter(([, time]) => time > 0)
      .sort(([, a], [, b]) => b - a);

    sectionEntries.forEach(([sec, time]) => {
      if (time > maxTime) {
        maxTime = time;
        maxSection = sec;
      }
    });

    const breakdownText = sectionEntries.length > 0
      ? sectionEntries.map(([sec, time]) => {
          const label = SECTION_LABELS[sec] || sec;
          const pct = Math.round((time / Math.max(totalSeconds, 1)) * 100);
          const icon = sec === maxSection ? '🔥' : '⏱️';
          return `${icon} **${label}**: ${formatSeconds(time)} (${pct}%)`;
        }).join('\n')
      : 'Brak szczegółowego podziału sekcji';

    const fields = [
      { name: '⏱️ Łączny czas czytania', value: `**${formatSeconds(totalSeconds)}**`, inline: true },
      { name: '🎯 Główny punkt skupienia', value: SECTION_LABELS[maxSection] || 'Ogólne przeglądanie', inline: true },
      { name: '📊 Czas na poszczególnych sekcjach', value: breakdownText, inline: false },
      { name: '🔗 Dokument', value: `[Wróć do oferty](${offerUrl})`, inline: false }
    ];

    const payload = {
      username: 'Molenda Offers Bot',
      avatar_url: 'https://molendadevelopment.pl/icon.png',
      embeds: [
        {
          title: `📊 Mapa uwagi klienta: ${companyName}`,
          url: offerUrl,
          color: 0x818cf8, // Indigo
          description: `Klient zakończył przeglądanie oferty. Oto podsumowanie zaangażowania i sekcji, które czytał najdłużej.`,
          fields,
          footer: {
            text: 'Telemetryka Zaangażowania · Molenda Development'
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
    console.error('[Discord Webhook] Błąd wysyłki zdarzenia offer_attention:', err);
  }
}

/**
 * 3. Powiadomienie: Klient oficjalnie zaakceptował ofertę
 */
export async function notifyOfferAccepted(params: OfferAcceptedParams): Promise<void> {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) return;

  try {
    const { slug, companyName, packageName, price, clientName, email, phone, comment } = params;
    const offerUrl = `https://molendadevelopment.pl/oferta/${slug}`;

    const fields = [
      { name: '💼 Wybrany pakiet', value: `**${packageName}**`, inline: true },
      { name: '💰 Wartość zlecenia', value: `**${price} zł**`, inline: true },
      { name: '🏢 Firma', value: companyName, inline: true },
      { name: '👤 Osoba akceptująca', value: clientName, inline: true },
      { name: '📧 E-mail', value: `[${email}](mailto:${email})`, inline: true },
      { name: '📞 Telefon', value: phone ? `[${phone}](tel:${phone})` : 'Nie podano', inline: true }
    ];

    if (comment && comment.trim().length > 0) {
      fields.push({ name: '📝 Uwagi / Preferowany termin startu', value: comment, inline: false });
    }

    fields.push({
      name: '🔗 Zaakceptowana oferta',
      value: `[Otwórz dokument ofertowy](${offerUrl})`,
      inline: false
    });

    const payload = {
      username: 'Molenda Offers Bot',
      avatar_url: 'https://molendadevelopment.pl/icon.png',
      embeds: [
        {
          title: `🎉 OFERTA ZAAKCEPTOWANA: ${companyName}`,
          url: offerUrl,
          color: 0x10b981, // Emerald
          description: `Klient zatwierdził warunki współpracy i wybrał pakiet wdrożeniowy! Przygotuj umowę i harmonogram prac.`,
          fields,
          footer: {
            text: 'Akceptacja Zlecenia B2B · Molenda Development'
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
    console.error('[Discord Webhook] Błąd wysyłki zdarzenia offer_accepted:', err);
  }
}

/**
 * 4. Powiadomienie: Klient zadał pytanie do oferty
 */
export async function notifyOfferQuestion(params: OfferQuestionParams): Promise<void> {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) return;

  try {
    const { slug, companyName, clientName, email, phone, section, question } = params;
    const offerUrl = `https://molendadevelopment.pl/oferta/${slug}`;

    const fields = [
      { name: '🏢 Firma', value: companyName, inline: true },
      { name: '👤 Klient', value: clientName, inline: true },
      { name: '📧 E-mail', value: `[${email}](mailto:${email})`, inline: true },
      { name: '📞 Telefon', value: phone ? `[${phone}](tel:${phone})` : 'Nie podano', inline: true },
      { name: '📍 Dotyczy sekcji', value: SECTION_LABELS[section || ''] || section || 'Ogólne', inline: true },
      { name: '❓ Treść pytania', value: `> ${question}`, inline: false },
      { name: '🔗 Dokument', value: `[Otwórz ofertę](${offerUrl})`, inline: false }
    ];

    const payload = {
      username: 'Molenda Offers Bot',
      avatar_url: 'https://molendadevelopment.pl/icon.png',
      embeds: [
        {
          title: `💬 Pytanie do oferty od: ${companyName}`,
          url: offerUrl,
          color: 0xf59e0b, // Amber
          description: `Klient ma wątpliwości lub dodatkowe pytania dotyczące oferty. Odpowiedz, aby domknąć transakcję.`,
          fields,
          footer: {
            text: 'System Pytań do Oferty · Molenda Development'
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
    console.error('[Discord Webhook] Błąd wysyłki zdarzenia offer_question:', err);
  }
}
