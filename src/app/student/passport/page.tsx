'use client';

import Sidebar from "@/app/components/Sidebar";
import TafakkurCompanion from "@/app/components/TafakkurCompanion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Achievement {
  id: string;
  year: string;
  title: string;
  category: 'olympiad' | 'research' | 'certificate' | 'honor';
  organization: string;
  badge: string;
  verificationHash: string;
  description: string;
  skills: string[];
}

export default function AcademicPassportPage() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const student = {
    name: "Bunyodbek Gulmatov",
    id: "38491023",
    group: "AI-22",
    course: "2-bosqich (Bakalavr)",
    faculty: "Sun'iy Intellekt va Axborot Texnologiyalari",
    university: "Urganch Davlat Universiteti",
    gpa: "4.82",
    ects: "64 / 240",
    rank: "Guruhda 1-o'rin (Fakultetda 4-o'rin)",
    verificationCode: "UZ-HEMIS-2026-8F9B4C2E",
  };

  const skills = [
    { name: "Algoritmik Tahlil & BST", level: 94, category: "Asosiy", tag: "Ekspert" },
    { name: "Python & PyTorch (AI)", level: 88, category: "AI & ML", tag: "Ilg'or" },
    { name: "Diskret Matematika & Ehtimollik", level: 91, category: "Nazariy", tag: "A'lo" },
    { name: "Tizimli Dasturiy Arxitektura", level: 85, category: "Muhandislik", tag: "Yuqori" },
    { name: "Ingliz tili (Akademik)", level: 90, category: "Til", tag: "IELTS 7.5" },
  ];

  const achievements: Achievement[] = [
    {
      id: 'ach-1',
      year: '2026',
      title: "Umummilliy AI Xakaton — 1-o'rin G'olibi",
      category: 'olympiad',
      organization: "Raqamli Texnologiyalar Vazirligi & IT Park",
      badge: "🏆 1-o'rin",
      verificationHash: "0x98f41...23a",
      description: "Universitet ta'lim jarayonlarini raqamlashtirish bo'yicha 'Tafakkur AI' operatsion tizimi arxitekturasi uchun oliy mukofot.",
      skills: ["AI Arxitektura", "Next.js", "Python FastAPI", "LLM Integratsiyasi"]
    },
    {
      id: 'ach-2',
      year: '2026',
      title: "ACM ICPC Regional Yarim Final Ishtirokchisi",
      category: 'olympiad',
      organization: "ICPC International Foundation",
      badge: "🎖️ Finalist",
      verificationHash: "0x77c29...e1b",
      description: "Markaziy Osiyo mintaqasi bo'yicha algoritmik dasturlash olimpiadasida universitet terma jamoasi safida ishtirok.",
      skills: ["C++", "Dinamik Dasturlash", "Graf Algoritmlari", "Murakkablik Tahlili"]
    },
    {
      id: 'ach-3',
      year: '2025',
      title: "Scopus Indekslangan Ilmiy Maqola Muallifi",
      category: 'research',
      organization: "International Journal of Intelligent Education",
      badge: "📄 Scopus Q2",
      verificationHash: "0x44a19...90f",
      description: "'Adaptive Machine Learning Frameworks in Central Asian Higher Education Systems' mavzusida ilmiy tadqiqot maqolasi.",
      skills: ["Akademik Tadqiqot", "Ma'lumotlar Tahlili", "Ilmiy Metodologiya"]
    },
    {
      id: 'ach-4',
      year: '2025',
      title: "IELTS 7.5 Akademik Sertifikati",
      category: 'certificate',
      organization: "British Council & IDP Education",
      badge: "🌍 C1 Advanced",
      verificationHash: "0x12d88...63c",
      description: "Xalqaro akademik ingliz tili malaka sertifikati (Listening 8.0, Reading 8.0, Writing 7.0, Speaking 7.0).",
      skills: ["Akademik Yozuv", "Taqdimot Mahorati", "Xalqaro Muloqot"]
    },
    {
      id: 'ach-5',
      year: '2024',
      title: "Universitet Rektorat Faxriy Yulduzi & Stipendiya",
      category: 'honor',
      organization: "Urganch Davlat Universiteti Rektorati",
      badge: "💡 Rektorat Grant",
      verificationHash: "0x55f71...88a",
      description: "1-o'quv yili yakunlari bo'yicha fakultetning eng yuqori o'zlashtirish va ijtimoiy faollik ko'rsatkichiga ega talabasi sifatida.",
      skills: ["Yetakchilik", "Akademik Mas'uliyat", "Jamoaviy Faollik"]
    },
  ];

  const openShareModal = (ach: Achievement) => {
    setSelectedAchievement(ach);
    setShareModalOpen(true);
    setCopiedLink(false);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`https://tafakkur.uz/verify/passport/${student.id}/${selectedAchievement?.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="tf-page">
      <Sidebar role="student" activeRoute="/student/passport" />
      <TafakkurCompanion currentContext="Raqamli Akademik Pasport" />

      <main className="tf-main pb-20">
        <div className="tf-container space-y-8">

          {/* =========================================================================
              1. ACADEMIC PASSPORT SIGNATURE HERO (Living Digital Identity)
              ========================================================================= */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#07101B] via-[#0d2238] to-[#082a44] text-white p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl animate-fade-up">
            <div className="tf-mesh absolute inset-0 opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Left Identity Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-blue-600 p-1 shadow-xl shrink-0">
                  <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center overflow-hidden relative">
                    <Image src="/Logo.png" alt="Bunyodbek Gulmatov" fill sizes="128px" className="object-contain p-4" />
                  </div>
                  <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] shadow-md border-2 border-slate-900">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      🎓 RAQAMLI AKADEMIK PASPORT
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      HEMIS ID: {student.id}
                    </span>
                  </div>

                  <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {student.name}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    {student.faculty} • <strong className="text-blue-400">{student.group}</strong> ({student.course})
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-400 flex-wrap">
                    <span>🏛️ {student.university}</span>
                    <span>•</span>
                    <span className="text-blue-300">Kriptografik Hash: {student.verificationCode}</span>
                  </div>
                </div>
              </div>

              {/* Right Mini Verification QR Card */}
              <div className="p-4.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-4 shrink-0 self-start lg:self-auto">
                <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
                  <div className="w-full h-full bg-slate-900 rounded flex flex-col items-center justify-center text-white text-[9px] font-mono text-center p-0.5 leading-none">
                    <span>QR</span>
                    <span className="text-[7px] text-blue-400">VERIFY</span>
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <span className="font-bold text-white block">Rasmiy Tekshiruv</span>
                  <span className="text-[11px] text-slate-300 block">HEMIS & Universitet Rektorati tomonidan tasdiqlangan</span>
                  <span className="text-[10px] text-emerald-400 font-mono">● Active Valid Credential</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Akademik GPA</span>
                <span className="font-display text-2xl font-black text-blue-400 font-mono">{student.gpa}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Maksimal: 5.0 (Top 3%)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">ECTS Kreditlar</span>
                <span className="font-display text-2xl font-black text-blue-300 font-mono">{student.ects}</span>
                <span className="text-[10px] text-blue-200 block mt-0.5">2-bosqich rejasi</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Reyting Darajasi</span>
                <span className="font-display text-2xl font-black text-amber-300 font-mono">1-o'rin</span>
                <span className="text-[10px] text-amber-200 block mt-0.5">Guruh bo'yicha yetakchi</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Yutuqlar Soni</span>
                <span className="font-display text-2xl font-black text-emerald-300 font-mono">5 ta</span>
                <span className="text-[10px] text-slate-300 block mt-0.5">Xalqaro & Milliy</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              2. VERIFIED SKILLS & COMPETENCY RADAR
              ========================================================================= */}
          <section className="bg-white dark:bg-[#121215] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kompetensiyalar</span>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Tasdiqlangan Ko'nikmalar & Malaka Matritsasi
                </h2>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
                HEMIS dars va laboratoriya natijalariga asoslangan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {s.category}
                      </span>
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                        {s.name}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-bold text-xs font-mono">
                      {s.tag}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span>O'zlashtirish:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{s.level}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              3. VERIFIED CREDENTIALS & ACHIEVEMENTS TIMELINE
              ========================================================================= */}
          <section className="bg-white dark:bg-[#121215] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hayotiy Xronologiya</span>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Akademik Yutuqlar & Sertifikatlar Xronologiyasi
                </h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Har bir yutuq alohida tekshiriluvchi raqamli sertifikatga ega
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
              {achievements.map((ach) => (
                <div key={ach.id} className="relative group">
                  {/* Milestone Marker */}
                  <span className="absolute -left-[31px] sm:-left-[39px] top-2 w-4 h-4 rounded-full bg-blue-600 border-2 border-white ring-4 ring-blue-500/20 group-hover:scale-125 transition-transform" />

                  <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/80 transition-all shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {ach.year}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                            {ach.badge}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Hash: {ach.verificationHash}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                          {ach.title}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          Tashkilotchi: {ach.organization}
                        </p>
                      </div>

                      <button
                        onClick={() => openShareModal(ach)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start shrink-0 cursor-pointer"
                      >
                        <span>Ulashish</span>
                        <span className="font-mono">↗</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ach.description}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {ach.skills.map((sk, skIdx) => (
                        <span key={skIdx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200 dark:border-slate-700">
                          #{sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              4. "SHARE ACHIEVEMENT" POLISHED MODAL (Stanford / Apple Wallet Style)
              ========================================================================= */}
          {shareModalOpen && selectedAchievement && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-scale-up">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Yutuqni Ulashish & Tasdiqlash Kartasi
                  </h3>
                  <button
                    onClick={() => setShareModalOpen(false)}
                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Polished Academic Achievement Credential Card */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#07101B] via-[#0b2136] to-[#07243a] text-white p-6 border border-white/10 shadow-lg space-y-4">
                  <div className="tf-mesh absolute inset-0 opacity-40 pointer-events-none" />

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image src="/Logo.png" alt="Tafakkur" width={20} height={20} className="object-contain" />
                      <span className="font-display font-bold text-xs tracking-wider text-blue-400">
                        TAFAKKUR AI PASSPORT
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-bold text-blue-300 border border-white/10">
                      {selectedAchievement.year}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                      {selectedAchievement.badge}
                    </span>
                    <h4 className="font-display font-black text-lg text-white leading-tight">
                      {selectedAchievement.title}
                    </h4>
                    <p className="text-xs text-slate-300">
                      Berildi: <strong className="text-white">{student.name}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {student.university} • {student.faculty}
                    </p>
                  </div>

                  <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Hash: {selectedAchievement.verificationHash}</span>
                    <span className="text-emerald-400">● HEMIS Verified</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 text-xs">
                  <button
                    onClick={copyShareLink}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>{copiedLink ? "✓ Nusxa olindi!" : "🔗 Ulashish havolasidan nusxa olish"}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => alert("LinkedIn sertifikati havolasi tayyorlandi.")}
                      className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 transition-colors"
                    >
                      LinkedIn-da ulashish
                    </button>
                    <button
                      onClick={() => alert("Raqamli sertifikat PDF shaklida yuklab olinmoqda...")}
                      className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 transition-colors"
                    >
                      PDF yuklab olish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
