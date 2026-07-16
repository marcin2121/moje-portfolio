import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { withValidation } from '@/lib/apiWrapper';

const resend = new Resend(process.env.RESEND_API_KEY);

const OfferSchema = z.object({
  companyName: z.string().min(2).max(100),
  packageName: z.string().min(2).max(50),
  price: z.string().or(z.number()),
});

// 🛡️ SECURITY FIX: W-pamięciowy Rate Limiter
const rateLimitMap = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 godzina
const MAX_REQUESTS = 3;

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
  const { data: resendData, error } = await resend.emails.send({
    from: 'System Ofertowy <onboarding@resend.dev>',
    to: ['kontakt@molendadevelopment.pl'],
    subject: `🔥 Nowa akceptacja oferty: ${safeCompanyName}`,
    html: `
      <h2>Nowy klient zaakceptował wycenę!</h2>
      <p><strong>Klient / Firma:</strong> ${safeCompanyName}</p>
      <p><strong>Wybrany pakiet:</strong> ${safePackageName}</p>
      <p><strong>Kwota pakietu:</strong> ${safePrice} zł</p>
      <br/>
      <p><em>Wybrano pakiet. Odezwij się do klienta w ciągu kilku godzin.</em></p>
    `,
  });

  if (error) {
    console.error("Resend Error:", error);
    return NextResponse.json({ error: 'Nie udało się wysłać oferty. Spróbuj ponownie później.' }, { status: 400 });
  }

  return NextResponse.json({ success: true, data: resendData });
};

export const POST = withValidation(OfferSchema, postHandler);
