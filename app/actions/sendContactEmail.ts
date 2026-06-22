'use server';

import { Resend } from 'resend';

// Make sure to add RESEND_API_KEY to your .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const blocker = formData.get('blocker') as string;

    if (!name || !email || !blocker) {
      return { success: false, error: 'Wypełnij wszystkie pola.' };
    }

    const { data, error } = await resend.emails.send({
      from: 'Kontakt <onboarding@resend.dev>', // You should verify your own domain in Resend later
      to: ['kontakt@molendadevelopment.pl'], // Put your receiving email here
      subject: `Nowe zapytanie o wycenę B2B - ${name}`,
      text: `
Otrzymałeś nowe zapytanie z formularza kontaktowego:

Imię: ${name}
E-mail: ${email}
Główny problem: ${blocker}

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
