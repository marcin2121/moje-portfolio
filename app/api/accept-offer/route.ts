import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { withValidation } from '@/lib/apiWrapper';
import { notifyOfferAccepted } from '@/lib/offerDiscordNotifier';

const resend = new Resend(process.env.RESEND_API_KEY);

const OfferSchema = z.object({
  companyName: z.string().min(2).max(100),
  packageName: z.string().min(2).max(100),
  price: z.string().or(z.number()),
  slug: z.string().optional(),
  clientName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  comment: z.string().max(1000).optional(),
});

// 🛡️ SECURITY FIX: W-pamięciowy Rate Limiter
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 godzina
const MAX_REQUESTS = 5;

function escapeHtml(unsafe: string | undefined): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const postHandler = async (data: z.infer<typeof OfferSchema>, req: Request) => {
  // 🛡️ SECURITY FIX: Sprawdzanie IP dla Rate Limitera
  const ip = req.headers.get('x-vercel-ip') ?? req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',').pop()?.trim() ?? 'unknown-ip';
  const now = Date.now();
  
  if (ip !== 'unknown-ip') {
    const clientRecord = rateLimitMap.get(ip);
    if (clientRecord && now - clientRecord.timestamp < RATE_LIMIT_WINDOW) {
      if (clientRecord.count >= MAX_REQUESTS) {
        return NextResponse.json({ error: 'Zbyt wiele zgłoszeń.' }, { status: 429 });
      }
      clientRecord.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }
  }

  const safeCompanyName = escapeHtml(data.companyName);
  const safePackageName = escapeHtml(data.packageName);
  const safePrice = escapeHtml(String(data.price));
  const safeClientName = escapeHtml(data.clientName || 'Klient');
  const safeEmail = escapeHtml(data.email || 'Brak e-maila');
  const safePhone = escapeHtml(data.phone || 'Brak telefonu');
  const safeComment = escapeHtml(data.comment || '');

  // 🔔 1. Powiadomienie Discord (Fire-and-Forget)
  notifyOfferAccepted({
    slug: data.slug || 'oferta',
    companyName: data.companyName,
    packageName: data.packageName,
    price: data.price,
    clientName: data.clientName || 'Klient',
    email: data.email || 'brak@podano.pl',
    phone: data.phone,
    comment: data.comment
  }).catch(err => console.error('[Discord Accept Error]', err));

  // 📧 2. Wysłanie e-maila przez Resend
  const { data: resendData, error } = await resend.emails.send({
    from: 'System Ofertowy <kontakt@panel.molendadevelopment.pl>',
    to: ['kontakt@molendadevelopment.pl'],
    subject: `🔥 Nowa akceptacja oferty: ${safeCompanyName} (${safePackageName})`,
    html: `
      <h2>Nowy klient zaakceptował wycenę!</h2>
      <p><strong>Firma:</strong> ${safeCompanyName}</p>
      <p><strong>Osoba:</strong> ${safeClientName}</p>
      <p><strong>Wybrany pakiet:</strong> ${safePackageName}</p>
      <p><strong>Wartość:</strong> ${safePrice} zł</p>
      <p><strong>E-mail:</strong> ${safeEmail}</p>
      <p><strong>Telefon:</strong> ${safePhone}</p>
      ${safeComment ? `<p><strong>Uwagi / Termin:</strong> ${safeComment}</p>` : ''}
      <br/>
      <p><em>Zgłoszenie zarejestrowane. Odezwij się do klienta w celu podpisania umowy i rozpoczęcia prac.</em></p>
    `,
  });

  if (error) {
    console.error("Resend Error:", error);
    return NextResponse.json({ error: 'Nie udało się wysłać oferty. Spróbuj ponownie później.' }, { status: 400 });
  }

  return NextResponse.json({ success: true, data: resendData });
};

export const POST = withValidation(OfferSchema, postHandler);

