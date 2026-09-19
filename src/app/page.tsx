import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Akademik Tutor",
    desc: "Talabalar uchun SOW asosida shaxsiy repetitor — savollarga mahalliy modelda aniq javob.",
    icon: "⚡",
  },
  {
    title: "AI Avto-Baholovchi",
    desc: "Rubrika bo‘yicha topshiriqlarni sonli baho va tuzilgan xolis fikr-mulohaza bilan baholash.",
    icon: "🎯",
  },
  {
    title: "E’lonlar Generatori",
    desc: "Qisqa tezislardan rasmiy universitet e’lonlari va farmoyish matnlarini avtomatik shakllantirish.",
    icon: "📢",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen text-slate-100 overflow-x-hidden bg-[#09090b]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-between">
        {/* Navigation Bar */}
        <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-md">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/10 border border-white/15 p-1.5 transition-transform group-hover:scale-105">
              <div className="relative w-full h-full">
                <Image 
                  src="/Logo.png" 
                  alt="Tafakkur AI" 
                  fill 
                  sizes="40px" 
                  className="object-contain" 
                  priority 
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-white">
                  tafakkur<span className="text-blue-500">.ai</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-slate-300 border border-white/10">
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs"
            >
              Tizimga Kirish →
            </Link>
          </div>
        </header>

        {/* Main Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 py-16 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Urganch Davlat Universiteti Integratsiyalangan AI Muhiti</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
                Universitet AI <br />
                <span className="text-blue-500">
                  Operatsion Tizimi
                </span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-slate-400 leading-relaxed">
                Talaba, o'qituvchi va ma'muriyat uchun yaxlit intellektual ekotizim: SOW asosidagi AI Tutor, rubrika bo'yicha baholovchi va xavfsiz mahalliy LLM klasteri.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link 
                  href="/login" 
                  className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Portalga kirish</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <a 
                  href="#imkoniyatlar" 
                  className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-sm font-semibold transition-all"
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
                  <span className="size-2 rounded-full bg-blue-400" />
                  <span>HEMIS API Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-amber-400" />
                  <span>Zero Data Leakage</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Showcase Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="relative rounded-3xl bg-slate-900/90 border border-white/10 p-8 shadow-2xl text-center space-y-6">
                  {/* Central Branded Logo Showcase */}
                  <div className="relative mx-auto w-28 h-28 rounded-2xl bg-white/5 border border-white/10 p-4 shadow-sm flex items-center justify-center transition-transform hover:scale-105">
                    <div className="relative w-full h-full">
                      <Image
                        src="/Logo.png"
                        alt="Tafakkur AI Logo"
                        fill
                        sizes="112px"
                        className="object-contain"
                        priority
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
                      tafakkur<span className="text-blue-400">.ai</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      O'zbekiston Oliy Ta'limi Uchun Mahalliy AI
                    </p>
                  </div>

                  {/* Micro Badges inside Card */}
                  <div className="space-y-2.5 pt-2 text-left text-xs">
                    <Link 
                      href="/student/tutor" 
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 flex items-center justify-between transition-all group block"
                    >
                      <span className="text-slate-300 group-hover:text-white flex items-center gap-2">
                        <span>🎓</span> Shaxsiy AI Repetitor (SOW)
                      </span>
                      <span className="text-blue-400 font-bold font-mono">FAOL →</span>
                    </Link>
                    <Link 
                      href="/student/tutor?mode=PRACTICE" 
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 flex items-center justify-between transition-all group block"
                    >
                      <span className="text-slate-300 group-hover:text-white flex items-center gap-2">
                        <span>⚡</span> Amaliyot & Oraliq Prep
                      </span>
                      <span className="text-slate-300 font-bold font-mono">TAYYOR →</span>
                    </Link>
                    <Link 
                      href="/student/calendar" 
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 flex items-center justify-between transition-all group block"
                    >
                      <span className="text-slate-300 group-hover:text-white flex items-center gap-2">
                        <span>📅</span> Interaktiv Taqvim & Voqealar
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">SINXRON →</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 pb-6 flex justify-center opacity-40">
          <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-slate-300 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features — Three AI Modules */}
      <section id="imkoniyatlar" className="relative bg-[#0c0c0e] text-white py-20 md:py-28 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold mb-3">
              <span>●</span> Asosiy Funksional Modullar
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Ta’lim jarayonini tezlashtiradigan AI agentlar
            </h2>
            <p className="mt-3 text-slate-400 text-sm md:text-base">
              Talaba o'zlashtirishi, professor baholashi va dekanat hujjat aylanishi uchun yagona tizim.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((f) => (
              <article
                key={f.title}
                className="bg-[#121215] rounded-2xl p-8 border border-white/10 shadow-lg hover:-translate-y-1 hover:border-blue-500/50 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center mb-6 text-2xl">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-bold tracking-tight text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy strip */}
      <section className="relative bg-slate-900 text-white py-16 md:py-20 px-6 md:px-12 overflow-hidden border-t border-slate-800">
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
          <Link href="/login" className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-xs shrink-0 self-start md:self-auto">
            Demo hisob bilan sinash →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#09090b] text-slate-500 text-xs py-10 px-6 md:px-12 border-t border-white/5">
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
