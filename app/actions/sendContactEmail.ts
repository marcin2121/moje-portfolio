'use server';

import { Resend } from 'resend';

// Make sure to add RESEND_API_KEY to your .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const blocker = formData.get('blocker') as string;
    const msg = formData.get('msg') as string;

    if (!email || !blocker) {
      return { success: false, error: 'Wypełnij pole e-mail i wybierz problem.' };
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
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'Wystąpił nieoczekiwany błąd.' };
  }
}
