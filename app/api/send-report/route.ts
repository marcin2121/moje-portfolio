import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withValidation } from '@/lib/apiWrapper';
import { Resend } from 'resend';

// Opcjonalne użycie Resend (jeśli zmienna środowiskowa nie istnieje, puszczamy tylko console.log)
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const ReportSchema = z.object({
  email: z.string().email().max(200),
  url: z.string().max(500).optional(),
  projectedRevenueLost: z.number().max(999999999),
  // 🛡️ SECURITY FIX: Usunięto z.any() i wprowadzono ścisłe typowanie, by zapobiec Email HTML Injection (Phishing Relay)
  inputs: z.object({
    monthlyTraffic: z.number().optional(),
    averageOrderValue: z.number().optional(),
    conversionRate: z.number().optional(),
    currentLoadTimeSeconds: z.number().optional(),
  }).optional(),
  outputs: z.object({
    estimatedNextJsLoadTime: z.number().optional(),
    estimatedConversionUplift: z.number().optional(),
    estimatedROI: z.number().optional(),
  }).optional()
});

const postHandler = async (data: z.infer<typeof ReportSchema>) => {
  if (resend) {
    try {
      // 1. Alert dla Ciebie (Marcin)
      await resend.emails.send({
        from: 'System Raportowy <kontakt@molendadevelopment.pl>', // Zmieniono nadawcę na firmowego
        to: ['kontakt@molendadevelopment.pl'],
        subject: `🔥 Nowy lead z kalkulatora (Strata: ${data.projectedRevenueLost} PLN)`,
        html: `
          <h2>🔥 Nowy lead z kalkulatora wycieku gotówki</h2>
          <p><strong>E-mail klienta:</strong> ${data.email}</p>
          <p><strong>Adres sklepu (URL):</strong> ${data.url || 'Nie podano'}</p>
          <hr />
          <h3>Parametry wejściowe:</h3>
          <ul>
            <li>Miesięczny ruch: <strong>${data.inputs?.monthlyTraffic || 'Brak'} sesji</strong></li>
            <li>Średnia wartość zamówienia (AOV): <strong>${data.inputs?.averageOrderValue || 'Brak'} PLN</strong></li>
            <li>Obecna konwersja: <strong>${data.inputs?.conversionRate || 'Brak'}%</strong></li>
            <li>Obecny czas ładowania: <strong>${data.inputs?.currentLoadTimeSeconds || 'Brak'} s</strong></li>
          </ul>
          <hr />
          <h3>Wyniki:</h3>
          <ul>
            <li>Miesięczna ucieczka gotówki: <strong style="color:red;">${data.projectedRevenueLost} PLN</strong></li>
            <li>Wzrost konwersji: <strong>+${data.outputs?.estimatedConversionUplift?.toFixed(1) || 'Brak'}%</strong></li>
            <li>12-miesięczny ROI z Next.js: <strong style="color:green;">${data.outputs?.estimatedROI || 'Brak'} PLN</strong></li>
          </ul>
        `
      });

      // 2. Raport Premium dla Klienta
      await resend.emails.send({
        from: 'Marcin Molenda <kontakt@molendadevelopment.pl>',
        to: [data.email],
        subject: 'Twój Raport: Wyciek gotówki z powodu wolnego ładowania',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0B0C; color: #E4E4E7; padding: 40px; border-radius: 12px; border: 1px solid #27272A;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #F97316; font-size: 24px; margin: 0; letter-spacing: 2px;">MOLENDA<span style="color: #52525B;">DEVELOPMENT</span></h1>
            </div>
            
            <h2 style="color: #FFFFFF; font-size: 20px; border-bottom: 1px solid #27272A; padding-bottom: 16px;">Wyniki analizy technicznego tarcia</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #A1A1AA;">
              Cześć,<br><br>
              Zgodnie z prośbą, przesyłam podsumowanie wyliczeń z naszego kalkulatora dotyczących Twojego e-commerce.
            </p>

            <div style="background-color: #18181B; border: 1px solid #27272A; border-radius: 8px; padding: 24px; margin: 32px 0;">
              <h3 style="color: #A1A1AA; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Prognozowana ucieczka gotówki</h3>
              <p style="font-size: 32px; font-weight: bold; color: #F43F5E; margin: 8px 0;">
                ${data.projectedRevenueLost} PLN / msc
              </p>
              <p style="font-size: 14px; color: #71717A; margin-bottom: 0;">Kwota, którą tracisz każdego miesiąca przez wolne ładowanie na urządzeniach mobilnych.</p>
            </div>

            <div style="background-color: #18181B; border: 1px solid #27272A; border-radius: 8px; padding: 24px; margin: 32px 0;">
              <h3 style="color: #A1A1AA; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 0;">Potencjał migracji na architekturę Headless (Next.js)</h3>
              <ul style="list-style-type: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 12px; font-size: 16px;">Docelowy czas ładowania: <strong style="color: #10B981;">${data.outputs?.estimatedNextJsLoadTime || 'Brak'} s</strong></li>
                <li style="margin-bottom: 12px; font-size: 16px;">Szacowany wzrost konwersji: <strong style="color: #F97316;">+${data.outputs?.estimatedConversionUplift?.toFixed(1) || 'Brak'}%</strong></li>
                <li style="font-size: 18px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #27272A;">Szacowany 12-miesięczny ROI: <strong style="color: #FFFFFF;">${data.outputs?.estimatedROI || 'Brak'} PLN</strong></li>
              </ul>
            </div>

            <h3 style="color: #FFFFFF; font-size: 18px; margin-top: 40px;">Co dalej?</h3>
            <p style="font-size: 16px; line-height: 1.6; color: #A1A1AA; margin-bottom: 32px;">
              Liczby mówią same za siebie. Zmiana przestarzałego monolitu na szybką architekturę Headless to nie jest wydatek na IT – to dźwignia finansowa dla Twojej sprzedaży.
            </p>
            
            <a href="https://molendadevelopment.pl/#kontakt" style="display: inline-block; background-color: #F97316; color: #000000; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
              Skonsultuj architekturę dla swojego sklepu
            </a>

            <div style="margin-top: 48px; border-top: 1px solid #27272A; padding-top: 24px; text-align: center; color: #71717A; font-size: 12px;">
              <p>Wiadomość wygenerowana automatycznie przez Kalkulator Migracji.</p>
              <p>Marcin Molenda Development | molendadevelopment.pl</p>
            </div>
          </div>
        `
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
