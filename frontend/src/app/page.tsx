import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Akademik Tutor",
    desc: "Talabalar uchun SOW asosida shaxsiy repetitor — savollarga mahalliy modelda javob.",
  },
  {
    title: "AI Avto-Baholovchi",
    desc: "Rubrika bo‘yicha topshiriqlarni sonli baho va tuzilgan fikr-mulohaza bilan baholash.",
  },
  {
    title: "E’lonlar Generatori",
    desc: "Qisqa tezislardan rasmiy universitet e’lonlari va farmoyish matnlarini yaratish.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden">
      {/* Hero — one composition, brand-first, full-bleed */}
      <section className="relative min-h-screen flex flex-col">
        <div className="tf-mesh absolute inset-0" aria-hidden />
        <div className="tf-grid-fade absolute inset-0" aria-hidden />
        <div className="tf-noise absolute inset-0" aria-hidden />

        <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/10 border border-white/15">
              <Image src="/Logo.png" alt="Tafakkur AI" fill sizes="40px" className="object-contain p-1.5" priority />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Tafakkur AI</span>
          </div>
          <Link href="/login" className="tf-btn tf-btn-ghost !bg-white/10 !text-white !border-white/20 hover:!bg-white/15">
            Kirish
          </Link>
        </header>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-10 pb-20 pt-8 max-w-6xl mx-auto w-full">
          <p className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] animate-fade-up">
            Tafakkur AI
          </p>
          <h1 className="mt-6 max-w-2xl text-xl sm:text-2xl md:text-3xl font-display font-semibold text-teal-100/95 tracking-tight animate-fade-up delay-1">
            Universitet AI — serveringizda, ma’lumotlaringiz sizda.
          </h1>
          <p className="mt-4 max-w-xl text-base md:text-lg text-slate-300/90 leading-relaxed animate-fade-up delay-2">
            Tutor, avto-baholovchi va e’lonlar — Ollama orqali mahalliy ishlaydi. Talaba yozuvlari bulakka chiqmaydi.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3 animate-fade-up delay-3">
            <Link href="/login" className="tf-btn tf-btn-primary text-sm uppercase tracking-wider">
              Portalga kirish
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a href="#imkoniyatlar" className="tf-btn tf-btn-ghost !bg-transparent !text-teal-100 !border-teal-400/30 hover:!bg-white/5">
              Imkoniyatlarni ko‘rish
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float opacity-70" aria-hidden>
          <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-teal-300/80" />
          </div>
        </div>
      </section>

      {/* Features — one job: show three AI modules */}
      <section id="imkoniyatlar" className="relative bg-[#f4f7fb] text-ink py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <p className="tf-kicker mb-3">
            <span className="tf-kicker-dot" />
            Uchta asosiy modul
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink max-w-xl">
            Ta’lim jarayonini tezlashtiradigan AI agentlar
          </h2>
          <p className="mt-3 text-slate-500 max-w-lg text-sm md:text-base">
            Professor, talaba va ma’muriyat uchun bitta mahalliy platforma.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((f, i) => (
              <article
                key={f.title}
                className={`tf-card-solid p-7 md:p-8 hover:-translate-y-1 transition-transform duration-300 animate-fade-up ${
                  i === 0 ? 'delay-1' : i === 1 ? 'delay-2' : 'delay-3'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mb-5 font-display font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy strip */}
      <section className="relative bg-ink text-white py-16 md:py-20 px-6 md:px-10 overflow-hidden">
        <div className="tf-noise absolute inset-0" aria-hidden />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              Maxfiylik birinchi: inference universitet serverida
            </h2>
            <p className="mt-3 text-slate-400 text-sm md:text-base leading-relaxed">
              Llama / Qwen kabi ochiq modellar Ollama orqali ishlaydi. HEMIS ma’lumotlari sinxronlashadi, lekin chet el bulaklariga chiqmaydi.
            </p>
          </div>
          <Link href="/login" className="tf-btn tf-btn-primary shrink-0 self-start md:self-auto">
            Demo hisob bilan sinash
          </Link>
        </div>
      </section>

      <footer className="bg-[#070d14] text-slate-500 text-xs py-8 px-6 md:px-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-3">
          <span className="font-display font-semibold text-slate-300">Tafakkur AI</span>
          <span>Umummilly AI Xakaton · Ta’lim yo‘nalishi · 2026</span>
        </div>
      </footer>
    </div>
  );
}
