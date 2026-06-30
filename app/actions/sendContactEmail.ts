'use server';

import { Resend } from 'resend';

// Make sure to add RESEND_API_KEY to your .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  try {
    const email = formData.get('email');
    const blocker = formData.get('blocker');
    const msg = formData.get('msg');

    // Input type and length validation (prevent DoS and unexpected types)
    if (typeof email !== 'string' || email.length > 254 ||
        typeof blocker !== 'string' || blocker.length > 100 ||
        (msg && typeof msg !== 'string') || (typeof msg === 'string' && msg.length > 2000)) {
      return { success: false, error: 'Nieprawidłowy format danych.' };
    }

    if (!email || !blocker) {
      return { success: false, error: 'Wypełnij pole e-mail i wybierz problem.' };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Podaj poprawny adres e-mail.' };
    }

    const { data, error } = await resend.emails.send({
      from: 'Kontakt <onboarding@resend.dev>', // You should verify your own domain in Resend later
      to: ['kontakt@molendadevelopment.pl'], // Put your receiving email here
      subject: `Nowe zapytanie B2B: ${blocker}`,
      text: `
Otrzymałeś nowe zapytanie z mini-quizu kontaktowego:

E-mail: ${email}
Główny problem: ${blocker}
Uwagi od klienta: ${msg || 'Brak'}

Masz 24 godziny na przesłanie wstępnej wyceny na adres klienta.
      `,
    });

    if (error) {
      // 🛡️ SECURITY FIX: Log internal error privately, do not leak error.message to the client
      console.error('[sendContactEmail] Resend API Error:', error);
      return { success: false, error: 'Wystąpił problem z wysyłką wiadomości. Spróbuj ponownie później.' };
    }

    return { success: true };
  } catch (err) {
    console.error('[sendContactEmail] Unexpected Error:', err);
    return { success: false, error: 'Wystąpił nieoczekiwany błąd.' };
  }
}
