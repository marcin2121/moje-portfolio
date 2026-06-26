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

const postHandler = async (data: z.infer<typeof OfferSchema>) => {
  const { data: resendData, error } = await resend.emails.send({
    from: 'System Ofertowy <onboarding@resend.dev>',
    to: ['kontakt@molendadevelopment.pl'],
    subject: `🔥 Nowa akceptacja oferty: ${data.companyName}`,
    html: `
      <h2>Nowy klient zaakceptował wycenę!</h2>
      <p><strong>Klient / Firma:</strong> ${data.companyName}</p>
      <p><strong>Wybrany pakiet:</strong> ${data.packageName}</p>
      <p><strong>Kwota pakietu:</strong> ${data.price} zł</p>
      <br/>
      <p><em>Wybrano pakiet. Odezwij się do klienta w ciągu kilku godzin.</em></p>
    `,
  });

  if (error) {
    console.error("Resend Error:", error);
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ success: true, data: resendData });
};

export const POST = withValidation(OfferSchema, postHandler);
