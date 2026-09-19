import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Akademik Tutor",
    desc: "Talabalar uchun SOW asosida shaxsiy repetitor — savollarga mahalliy modelda javob.",
    icon: "⚡",
  },
  {
    title: "AI Avto-Baholovchi",
    desc: "Rubrika bo‘yicha topshiriqlarni sonli baho va tuzilgan fikr-mulohaza bilan baholash.",
    icon: "🎯",
  },
  {
    title: "E’lonlar Generatori",
    desc: "Qisqa tezislardan rasmiy universitet e’lonlari va farmoyish matnlarini yaratish.",
    icon: "📢",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden bg-[#070d14]">
      {/* Hero — one composition, brand-first, full-bleed */}
      <section className="relative min-h-screen flex flex-col justify-between">
        <div className="tf-mesh absolute inset-0" aria-hidden />
        <div className="tf-grid-fade absolute inset-0" aria-hidden />
        <div className="tf-noise absolute inset-0" aria-hidden />

        {/* Navigation Bar */}
        <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 animate-fade-in border-b border-white/5 bg-[#070d14]/40 backdrop-blur-md">
          <div className="flex items-center gap-3.5 group cursor-pointer">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-gradient-to-tr from-cyan-500/20 via-teal-400/30 to-emerald-400/20 border border-teal-400/30 p-1.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="relative w-full h-full">
                <Image 
                  src="/Logo.png" 
                  alt="Tafakkur AI" 
                  fill 
                  sizes="44px" 
                  className="object-contain" 
                  priority 
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-white">
                  tafakkur<span className="text-cyan-300">.ai</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-400/15 text-teal-300 border border-teal-400/30">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] uppercase font-semibold tracking-[0.2em] text-slate-400">
                UrDU University OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/login?redirect=/student/calendar" 
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Akademik Taqvim
            </Link>
            <Link 
              href="/login?redirect=/student/events" 
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Tadbirlar & Xakaton
            </Link>
            <Link 
              href="/login" 
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-teal-500/20 hover:scale-[1.02]"
            >
              Tizimga Kirish →
            </Link>
          </div>
        </header>

        {/* Main Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 py-12 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-bold animate-fade-up">
                <span className="size-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Urganch Davlat Universiteti Integratsiyalangan AI Muhiti</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-white animate-fade-up delay-1">
                Universitet AI <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300">
                  Operatsion Tizimi
                </span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-slate-300/90 leading-relaxed animate-fade-up delay-2">
                Talaba, o'qituvchi va ma'muriyat uchun yaxlit intellektual ekotizim: SOW asosidagi AI Tutor, rubrika bo'yicha baholovchi va mahalliy LLM klasteri.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 animate-fade-up delay-3">
                <Link 
                  href="/login" 
                  className="px-7 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-teal-500/25 hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Portalga kirish</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <a 
                  href="#imkoniyatlar" 
                  className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-teal-200 border border-teal-400/30 text-sm font-semibold transition-all"
                >
                  Imkoniyatlarni ko‘rish ↓
                </a>
              </div>

              {/* Quick Specs */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span>100% Mahalliy Ollama</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-cyan-400" />
                  <span>HEMIS API Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-400" />
                  <span>Zero Data Leakage</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Brand Emblem & Interactive Card */}
            <div className="lg:col-span-5 flex justify-center animate-fade-up delay-2">
              <div className="relative w-full max-w-md">
                {/* Glowing Ambient Backdrop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 rounded-3xl blur-2xl opacity-25 animate-pulse" />

                <div className="relative rounded-3xl bg-[#0c1928]/90 border border-teal-500/30 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
                  {/* Central Branded Logo Showcase */}
                  <div className="relative mx-auto w-32 h-32 rounded-3xl bg-gradient-to-br from-white/10 to-teal-500/10 border border-white/20 p-4 shadow-2xl shadow-teal-500/30 flex items-center justify-center group hover:scale-105 transition-transform">
                    <div className="relative w-full h-full">
                      <Image
                        src="/Logo.png"
                        alt="Tafakkur AI Logo"
                        fill
                        sizes="128px"
                        className="object-contain filter drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                        priority
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
                      tafakkur<span className="text-cyan-300">.ai</span>
                    </h3>
                    <p className="text-xs text-teal-300 font-medium">
                      O'zbekiston Oliy Ta'limi Uchun Mahalliy AI
                    </p>
                  </div>

                  {/* Micro Badges inside Card */}
                  <div className="space-y-2.5 pt-2 text-left text-xs">
                    <Link 
                      href="/student/tutor" 
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-400/40 flex items-center justify-between transition-all group block"
                    >
                      <span className="text-slate-300 group-hover:text-white flex items-center gap-2">
                        <span>🎓</span> Shaxsiy AI Repetitor (SOW)
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">FAOL →</span>
                    </Link>
                    <Link 
                      href="/student/tutor?mode=PRACTICE" 
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-400/40 flex items-center justify-between transition-all group block"
                    >
                      <span className="text-slate-300 group-hover:text-white flex items-center gap-2">
                        <span>⚡</span> Amaliyot & Oraliq Prep
                      </span>
                      <span className="text-teal-400 font-bold font-mono">TAYYOR →</span>
                    </Link>
                    <Link 
                      href="/student/calendar" 
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-400/40 flex items-center justify-between transition-all group block"
                    >
                      <span className="text-slate-300 group-hover:text-white flex items-center gap-2">
                        <span>📅</span> Interaktiv Taqvim & Voqealar
                      </span>
                      <span className="text-cyan-400 font-bold font-mono">SINXRON →</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 pb-6 flex justify-center opacity-60">
          <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-teal-300/80 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features — Three AI Modules */}
      <section id="imkoniyatlar" className="relative bg-[#f4f7fb] text-slate-900 py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="tf-kicker mb-2 justify-center">
              <span className="tf-kicker-dot" />
              Asosiy Funksional Modullar
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950">
              Ta’lim jarayonini tezlashtiradigan AI agentlar
            </h2>
            <p className="mt-3 text-slate-500 text-sm md:text-base">
              Talaba o'zlashtirishi, professor baholashi va dekanat hujjat aylanishi uchun yagona tizim.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((f, i) => (
              <article
                key={f.title}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:-translate-y-1.5 hover:shadow-xl hover:border-teal-300 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mb-6 text-2xl font-display font-bold">
                  {f.icon}
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight text-slate-900">{f.title}</h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy strip */}
      <section className="relative bg-[#0b1320] text-white py-16 md:py-20 px-6 md:px-12 overflow-hidden border-t border-white/10">
        <div className="tf-noise absolute inset-0" aria-hidden />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 text-xs font-bold mb-3">
              🔒 100% Maxfiy va Xavfsiz
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              Inference universitetning o'z serverida
            </h2>
            <p className="mt-3 text-slate-400 text-sm md:text-base leading-relaxed">
              Llama / Qwen kabi ochiq modellar Ollama orqali ishlaydi. HEMIS ma’lumotlari sinxronlashadi, lekin chet el bulutlariga chiqmaydi.
            </p>
          </div>
          <Link href="/login" className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-teal-500/20 shrink-0 self-start md:self-auto">
            Demo hisob bilan sinash →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070d14] text-slate-500 text-xs py-10 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative w-6 h-6 rounded-lg overflow-hidden">
              <Image src="/Logo.png" alt="Tafakkur AI" fill sizes="24px" className="object-contain" />
            </div>
            <span className="font-display font-semibold text-slate-300 text-sm">Tafakkur AI</span>
            <span className="text-slate-600">|</span>
            <span>Urganch Davlat Universiteti</span>
          </div>
          <span>Umummilliy AI Xakaton · Ta’lim yo‘nalishi · 2026</span>
        </div>
      </footer>
    </div>
  );
}
