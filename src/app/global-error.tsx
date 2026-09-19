'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="uz">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#0f172a' }}>
            Tizimda kutilmagan xatolik yuz berdi
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '28rem' }}>
            Iltimos, sahifani qayta yuklang yoki keyinroq urinib ko&apos;ring.
          </p>
          <button
            onClick={() => reset()}
            style={{ padding: '0.625rem 1.25rem', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            Qayta yuklash
          </button>
        </div>
      </body>
    </html>
  );
}
