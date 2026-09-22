import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  notifyOfferOpened,
  notifyOfferAttention,
  notifyOfferQuestion
} from '@/lib/offerDiscordNotifier';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Schemat walidacji akcji telemetrycznych
const TelemetrySchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('opened'),
    slug: z.string().min(1).max(100),
    companyName: z.string().min(1).max(200),
    clientName: z.string().optional(),
    referrer: z.string().optional(),
    deviceType: z.string().optional()
  }),
  z.object({
    action: z.literal('attention'),
    slug: z.string().min(1).max(100),
    companyName: z.string().min(1).max(200),
    totalSeconds: z.number().nonnegative(),
    sectionTimes: z.record(z.string(), z.number().nonnegative())
  }),
  z.object({
    action: z.literal('question'),
    slug: z.string().min(1).max(100),
    companyName: z.string().min(1).max(200),
    clientName: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().optional(),
    section: z.string().optional(),
    question: z.string().min(3).max(2000)
  })
]);

export async function POST(req: Request) {
  try {
    let rawBody: unknown;

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      rawBody = await req.json().catch(() => null);
    } else {
      // Obsługa navigator.sendBeacon (często wysyła jako text/plain)
      const text = await req.text().catch(() => '');
      try {
        rawBody = JSON.parse(text);
      } catch {
        return NextResponse.json({ error: 'Nieprawidłowy format JSON' }, { status: 400 });
      }
    }

    if (!rawBody || typeof rawBody !== 'object') {
      return NextResponse.json({ error: 'Brak danych w żądaniu' }, { status: 400 });
    }

    const parseResult = TelemetrySchema.safeParse(rawBody);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Błąd walidacji danych telemetrycznych' }, { status: 400 });
    }

    const data = parseResult.data;

    if (data.action === 'opened') {
      notifyOfferOpened({
        slug: data.slug,
        companyName: data.companyName,
        clientName: data.clientName,
        referrer: data.referrer,
        deviceType: data.deviceType
      }).catch(err => console.error('[Telemetry] Błąd notifyOfferOpened:', err));

      return NextResponse.json({ success: true, event: 'opened' });
    }

    if (data.action === 'attention') {
      notifyOfferAttention({
        slug: data.slug,
        companyName: data.companyName,
        totalSeconds: data.totalSeconds,
        sectionTimes: data.sectionTimes
      }).catch(err => console.error('[Telemetry] Błąd notifyOfferAttention:', err));

      return NextResponse.json({ success: true, event: 'attention' });
    }

    if (data.action === 'question') {
      notifyOfferQuestion({
        slug: data.slug,
        companyName: data.companyName,
        clientName: data.clientName,
        email: data.email,
        phone: data.phone,
        section: data.section,
        question: data.question
      }).catch(err => console.error('[Telemetry] Błąd notifyOfferQuestion:', err));

      // Opcjonalna wysyłka e-maila z kopią pytania do Marcina
      if (resend) {
        resend.emails.send({
          from: 'System Ofertowy <kontakt@panel.molendadevelopment.pl>',
          to: ['kontakt@molendadevelopment.pl'],
          replyTo: data.email,
          subject: `💬 Pytanie do oferty od: ${data.companyName} (${data.clientName})`,
          html: `
            <h2>Nowe pytanie do oferty ${data.companyName}</h2>
            <p><strong>Od:</strong> ${data.clientName} (&lt;${data.email}&gt;)</p>
            <p><strong>Telefon:</strong> ${data.phone || 'Brak'}</p>
            <p><strong>Sekcja:</strong> ${data.section || 'Ogólne'}</p>
            <hr/>
            <p><strong>Treść pytania:</strong></p>
            <blockquote style="background:#f4f4f5;padding:12px;border-left:4px solid #6366f1;">
              ${data.question.replace(/\n/g, '<br/>')}
            </blockquote>
            <p><a href="https://molendadevelopment.pl/oferta/${data.slug}">Zobacz ofertę online</a></p>
          `
        }).catch(err => console.error('[Telemetry Resend Error]', err));
      }

      return NextResponse.json({ success: true, event: 'question' });
    }

    return NextResponse.json({ error: 'Nieobsługiwana akcja' }, { status: 400 });
  } catch (err) {
    console.error('[Telemetry Endpoint Error]', err);
    return NextResponse.json({ error: 'Błąd przetwarzania telemetrii' }, { status: 500 });
  }
}
