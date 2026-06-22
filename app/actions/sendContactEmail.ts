'use server';

import { Resend } from 'resend';

// Make sure to add RESEND_API_KEY to your .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const industry = formData.get('industry') as string;

    if (!name || !phone || !industry) {
      return { success: false, error: 'Wypełnij wszystkie pola.' };
    }

    const { data, error } = await resend.emails.send({
      from: 'Kontakt <onboarding@resend.dev>', // You should verify your own domain in Resend later
      to: ['kontakt@molendadevelopment.pl'], // Put your receiving email here
      subject: `Nowe zapytanie B2B - ${name}`,
      text: `
Otrzymałeś nowe zapytanie z formularza kontaktowego:

Imię: ${name}
Telefon: ${phone}
Branża: ${industry}

Zadzwoń do klienta w ciągu najbliższych 3 godzin!
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
