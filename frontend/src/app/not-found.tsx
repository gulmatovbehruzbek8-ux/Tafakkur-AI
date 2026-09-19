import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="tf-card-solid w-16 h-16 flex items-center justify-center mb-6">
        <span className="font-display text-2xl font-bold text-blue-600">404</span>
      </div>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight mb-2">Sahifa Topilmadi</h1>
      <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
        Siz izlayotgan sahifa o&apos;chirilgan, manzili o&apos;zgargan yoki tizimda vaqtincha mavjud emas.
      </p>
      <Link href="/" className="tf-btn tf-btn-primary">
        Bosh Sahifaga Qaytish
      </Link>
    </div>
  );
}
