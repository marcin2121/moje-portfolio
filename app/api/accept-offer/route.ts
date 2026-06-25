import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, packageName, price } = body;

    if (!companyName || !packageName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['kontakt@molendadevelopment.pl'],
      subject: `🔥 Nowa akceptacja oferty: ${companyName}`,
      html: `
        <h2>Nowy klient zaakceptował wycenę!</h2>
        <p><strong>Klient / Firma:</strong> ${companyName}</p>
        <p><strong>Wybrany pakiet:</strong> ${packageName}</p>
        <p><strong>Kwota pakietu:</strong> ${price} zł</p>
        <br/>
        <p><em>Zablokowano pakiet. Odezwiij się do klienta w ciągu kilku godzin.</em></p>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
