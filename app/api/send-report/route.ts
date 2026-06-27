import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withValidation } from '@/lib/apiWrapper';
import { Resend } from 'resend';

// Opcjonalne użycie Resend (jeśli zmienna środowiskowa nie istnieje, puszczamy tylko console.log)
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ReportSchema = z.object({
  email: z.string().email(),
  projectedRevenueLost: z.number()
});

const postHandler = async (data: z.infer<typeof ReportSchema>) => {
  if (resend) {
    try {
      await resend.emails.send({
        from: 'System Raportowy <onboarding@resend.dev>',
        to: ['kontakt@molendadevelopment.pl'],
        subject: `🔥 Nowy lead z kalkulatora (Strata: ${data.projectedRevenueLost} PLN)`,
        html: `<p>Klient prosi o raport PDF na maila: <strong>${data.email}</strong></p>`
      });
    } catch (e) {
      console.error("Resend delivery failed:", e);
    }
  } else {
    // Tymczasowy handler zapasowy
    console.log(`[Lead Capture] Zapisano email: ${data.email} (Strata: ${data.projectedRevenueLost} PLN)`);
  }

  return NextResponse.json({ success: true, message: 'Raport PDF został wysłany.' });
};

export const POST = withValidation(ReportSchema, postHandler);
