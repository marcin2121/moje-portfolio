import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kalkulator ROI Migracji';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image(req: Request) {
  // Oczekujemy, że Next.js wstrzyknie obiekt Request, z którego wyciągniemy parametry
  const { searchParams } = new URL(req.url);
  const lost = searchParams.get('lost');
  const time = searchParams.get('time');

  if (lost) {
    return new ImageResponse(
      (
        <div
          style={{
            background: '#0f172a',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        >
          <div style={{ color: '#ef4444', fontSize: 48, fontWeight: 'bold', marginBottom: 20, letterSpacing: '0.05em' }}>
            FINANCIAL FRICTION DETECTED
          </div>
          <div style={{ color: '#ffffff', fontSize: 72, fontWeight: '900', marginBottom: 40, textAlign: 'center', padding: '0 40px' }}>
            {lost} PLN / month lost to load times
          </div>
          <div style={{ color: '#94a3b8', fontSize: 32, fontWeight: 'normal' }}>
            WordPress to Next.js Architecture ROI Benchmark
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // Fallback cover
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ color: '#ffffff', fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
          Kalkulator ROI Migracji
        </div>
        <div style={{ color: '#94a3b8', fontSize: 36 }}>
          Sprawdź ile przychodów pochłania technologiczne tarcie.
        </div>
      </div>
    ),
    { ...size }
  );
}
