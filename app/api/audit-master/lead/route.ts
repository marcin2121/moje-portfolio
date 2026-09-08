import { NextResponse } from 'next/server';
import { saveLead } from '../utils/storage';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, domain, token, notes } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Podaj poprawny adres e-mail' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return NextResponse.json({ error: 'Podaj poprawny numer telefonu' }, { status: 400 });
    }

    const cleanDomain = domain ? String(domain).trim() : 'Brak domeny';

    // 1. Zapis do bazy / pliku
    await saveLead({
      auditToken: token ? String(token).trim() : undefined,
      domain: cleanDomain,
      email: email.trim(),
      phone: phone.trim(),
      notes: notes ? String(notes).trim() : undefined
    });

    // 2. Powiadomienie e-mail przez Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'Audyt Molenda Dev <powiadomienia@molendadevelopment.pl>',
          to: 'kontakt@molendadevelopment.pl',
          subject: `🔥 Nowy lead z Audytu: ${cleanDomain} (${email})`,
          html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
              <h2 style="color: #0f172a;">Nowe zgłoszenie na konsultację techniczną!</h2>
              <p>Klient zamówił bezpłatną konsultację audytu:</p>
              <ul>
                <li><strong>Domena:</strong> ${cleanDomain}</li>
                <li><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></li>
                <li><strong>Telefon:</strong> <a href="tel:${phone}">${phone}</a></li>
                ${token ? `<li><strong>Link do audytu:</strong> <a href="https://molendadevelopment.pl/narzedzia/audyt?token=${token}">Zobacz raport audytu klienta</a></li>` : ''}
                ${notes ? `<li><strong>Dodatkowa notatka:</strong> ${notes}</li>` : ''}
              </ul>
              <p style="font-size: 12px; color: #64748b;">Wysłano z silnika Audytu Odporności Cyfrowej 2.0</p>
            </div>
          `
        });
      } catch {
        // Ignoruj błąd wysyłki powiadomienia, lead jest już w bazie
      }
    }

    return NextResponse.json({ success: true, message: 'Zgłoszenie zostało przyjęte. Odezwiemy się wkrótce!' });
  } catch {
    return NextResponse.json({ error: 'Wystąpił błąd podczas zapisywania zgłoszenia' }, { status: 500 });
  }
}
