'use client';

import Sidebar from "@/app/components/Sidebar";
import TafakkurCompanion from "@/app/components/TafakkurCompanion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AcademicAnalystPage() {
  const [perspective, setPerspective] = useState<'student' | 'class' | 'university'>('student');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const overviewMetrics = {
    gpa: { value: "4.82", change: "+6.2%", period: "Semestr boshiga nisbatan", status: "positive" },
    attendance: { value: "96.0%", change: "+2.4%", period: "24/25 dars qatnashilgan", status: "positive" },
    assignments: { value: "90.0%", change: "18/20", period: "O'rtacha 1.8 kun oldin topshirilgan", status: "positive" },
    ects: { value: "64 / 240", change: "Top 3%", period: "Kuzgi semestr: 4-hafta", status: "positive" }
  };

  const aiInsights = [
    {
      id: 'in-1',
      category: 'KUCHLI JIHAT',
      type: 'strength',
      title: "Algoritmik va dasturiy fanlarda eng yuqori dinamika",
      description: "Sizning 'Ma'lumotlar tuzilmasi va algoritmlar' fani bo'yicha amaliy topshiriqlaringiz o'rtacha 94% natija ko'rsatmoqda. Kod arxitekturasi va vaqt murakkabligi tahlili sizning eng kuchli kompetensiyangizdir.",
      recommendation: "ACM ICPC yoki Umummilliy AI Xakatonida universitet nomidan qatnashish qobiliyatingiz to'liq yetarli.",
      actionLabel: "Olimpiada loyihalarini ko'rish",
      actionHref: "/student/calendar"
    },
    {
      id: 'in-2',
      category: 'DIQQAT TALAB',
      type: 'warning',
      title: "Chiziqli algebra bo'yicha oraliq nazorat tavsiyasi",
      description: "Oliy matematika fanidan matritsalar va determinantlar bo'yicha joriy ko'rsatkich 88% ni tashkil etmoqda. 21-sentyabrdagi oraliq nazoratdan oldin xos qiymatlar (eigenvalues) mavzusiga e'tibor qaratish tavsiya etiladi.",
      recommendation: "AI Repetitor yordamida matritsa amaliyotlarini 15 daqiqa takrorlash o'zlashtirishni 93% dan oshiradi.",
      actionLabel: "AI Repetitor bilan takrorlash",
      actionHref: "/student/tutor"
    },
    {
      id: 'in-3',
      category: 'BARQARORLIK',
      type: 'success',
      title: "Vaqtni rejalashtirish va topshiriqlar tezligi a'lo darajada",
      description: "Oxirgi 20 ta laboratoriya va mustaqil ishning 18 tasi belgilangan muddatdan kamida 24-48 soat oldin topshirilgan. Kechiktirilgan yoki qabul qilinmagan ishlar mavjud emas.",
      recommendation: "Ushbu sur'atni saqlab qolish semestr yakunida stresssiz a'lo baholarga erishish kafolatidir.",
      actionLabel: "Topshiriqlar jadvalini ko'rish",
      actionHref: "/student/assignments"
    }
  ];

  const subjectBreakdowns = [
    {
      code: "CS-201",
      name: "Ma'lumotlar tuzilmasi va algoritmlar",
      score: 92,
      attendance: 96,
      taskSpeed: "1.9 kun oldin",
      instructor: "Prof. Olimjon Turdiyev",
      grade: "A (A'lo)"
    },
    {
      code: "AI-204",
      name: "Sun'iy Intellekt va Mashinali O'rganish",
      score: 94,
      attendance: 100,
      taskSpeed: "2.1 kun oldin",
      instructor: "Dots. Nigora Karimova",
      grade: "A+ (Namunali)"
    },
    {
      code: "MATH-102",
      name: "Oliy Matematika va Chiziqli Algebra",
      score: 88,
      attendance: 92,
      taskSpeed: "1.2 kun oldin",
      instructor: "Dots. Nigora Karimova",
      grade: "B+ (Yaxshi)"
    },
    {
      code: "SE-301",
      name: "Dasturiy Ta'minot Arxitekturasi",
      score: 90,
      attendance: 96,
      taskSpeed: "1.5 kun oldin",
      instructor: "Prof. Olimjon Turdiyev",
      grade: "A (A'lo)"
    }
  ];

  const filteredSubjects = selectedSubject === 'all'
    ? subjectBreakdowns
    : subjectBreakdowns.filter(s => s.code === selectedSubject);

  return (
    <div className="tf-page bg-[#f8fafc]">
      <Sidebar role="student" activeRoute="/student/analytics" />
      <TafakkurCompanion currentContext="Akademik Tahlilchi (Analyst)" />

      <main className="tf-main pb-20">
        <div className="tf-container space-y-8">

          {/* =========================================================================
              HEADER: TAFAKKUR ACADEMIC ANALYST & PERSPECTIVE SWITCHER
              ========================================================================= */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#07101B] via-[#091f33] to-[#07243a] text-white p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl space-y-6 animate-fade-up">
            <div className="tf-mesh absolute inset-0 opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                    📊 ACADEMIC ANALYST v2.4
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    Urganch Davlat Universiteti • Ma'lumotlarga asoslangan intellekt
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Akademik Tahlilchi & O'sish Ko'zgusi
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  Universitet ma'lumotlarini quruq raqamlarga emas, tushunarli xulosalar va amaliy tavsiyalarga aylantiruvchi intellektual qatlam.
                </p>
              </div>

              {/* 3-Perspective Switcher */}
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 self-start lg:self-auto">
                <button
                  onClick={() => setPerspective('student')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    perspective === 'student'
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Mening Dinamikam
                </button>
                <button
                  onClick={() => setPerspective('class')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    perspective === 'class'
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Guruh Ko'rsatkichi
                </button>
                <button
                  onClick={() => setPerspective('university')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    perspective === 'university'
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Universitet Qiyosi
                </button>
              </div>
            </div>

            {/* Sub-banner for perspective */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span>
                {perspective === 'student' && "👤 Shaxsiy talaba tahlili: Bunyodbek Gulmatov (AI-22)"}
                {perspective === 'class' && "👥 AI-22 akademik guruhi o'rtacha dinamikasi (24 nafar talaba)"}
                {perspective === 'university' && "🏛️ Axborot texnologiyalari fakulteti umumiy reytingi"}
              </span>
              <span className="font-mono text-teal-300 text-[11px]">
                Oxirgi tahlil: Bugun 10:45 da
              </span>
            </div>
          </div>

          {/* =========================================================================
              LAYER 1: OVERVIEW (3-LAYER ANALYTICS ARCHITECTURE)
              ========================================================================= */}
          <section className="space-y-4 animate-fade-up">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1-Qatlam: Umumiy Holat (OVERVIEW)
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Akademik GPA
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl sm:text-4xl font-black text-slate-900 font-mono">
                    {overviewMetrics.gpa.value}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ↑ {overviewMetrics.gpa.change}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {overviewMetrics.gpa.period}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Davomat
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl sm:text-4xl font-black text-blue-900 font-mono">
                    {overviewMetrics.attendance.value}
                  </span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    ↑ {overviewMetrics.attendance.change}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {overviewMetrics.attendance.period}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Topshiriqlar Muvaffaqiyati
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl sm:text-4xl font-black text-emerald-900 font-mono">
                    {overviewMetrics.assignments.value}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {overviewMetrics.assignments.change}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {overviewMetrics.assignments.period}
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  ECTS Bosqichi
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl sm:text-4xl font-black text-violet-900 font-mono">
                    {overviewMetrics.ects.value}
                  </span>
                  <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">
                    {overviewMetrics.ects.change}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {overviewMetrics.ects.period}
                </span>
              </div>
            </div>
          </section>

          {/* =========================================================================
              LAYER 2: INSIGHTS (AI NATURAL-LANGUAGE TAKEAWAYS)
              ========================================================================= */}
          <section className="space-y-4 animate-fade-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2-Qatlam: Aqlli Xulosalar (INSIGHTS)
                </span>
              </div>
              <span className="text-xs text-slate-500">Tafakkur AI tahliliy xulosalari</span>
            </div>

            <div className="space-y-3.5">
              {aiInsights.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl bg-white border shadow-xs transition-all ${
                    item.type === 'strength'
                      ? 'border-emerald-200 hover:border-emerald-400'
                      : item.type === 'warning'
                        ? 'border-amber-200 hover:border-amber-400'
                        : 'border-blue-200 hover:border-blue-400'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                          item.type === 'strength'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : item.type === 'warning'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {item.category}
                        </span>
                        <h3 className="font-display font-bold text-base text-slate-900">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center gap-2">
                        <span className="font-bold text-teal-800">💡 Tavsiya:</span>
                        <span>{item.recommendation}</span>
                      </div>
                    </div>

                    <div className="shrink-0 self-start md:self-center">
                      <Link
                        href={item.actionHref}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <span>{item.actionLabel}</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              LAYER 3: DETAILS (UNDERLYING PERFORMANCE GRAPHS & COURSE MATRIX)
              ========================================================================= */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    3-Qatlam: Chuqur Tafsilotlar (DETAILS)
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                  Fanlar Kesimidagi Taqqoslash Matritsasi
                </h2>
              </div>

              {/* Subject Filter */}
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-semibold focus:outline-none focus:border-teal-500"
                >
                  <option value="all">Barcha Fanlar (4 ta)</option>
                  <option value="CS-201">Ma'lumotlar tuzilmasi (CS-201)</option>
                  <option value="AI-204">Sun'iy Intellekt (AI-204)</option>
                  <option value="MATH-102">Oliy Matematika (MATH-102)</option>
                  <option value="SE-301">Dasturiy Arxitektura (SE-301)</option>
                </select>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubjects.map((sub) => (
                <div key={sub.code} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md">
                        {sub.code}
                      </span>
                      <h4 className="font-display font-bold text-base text-slate-900 mt-1">
                        {sub.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{sub.instructor}</p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs font-mono">
                      {sub.grade}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex items-center justify-between text-slate-600 mb-1">
                        <span>O'zlashtirish balli:</span>
                        <span className="font-bold text-slate-900 font-mono">{sub.score}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full"
                          style={{ width: `${sub.score}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-slate-600 mb-1">
                        <span>Davomat ko'rsatkichi:</span>
                        <span className="font-bold text-slate-900 font-mono">{sub.attendance}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${sub.attendance}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span>Vazifalar topshirish: <strong>{sub.taskSpeed}</strong></span>
                    <Link
                      href="/student/courses"
                      className="text-teal-700 font-bold hover:underline"
                    >
                      Kurs maydoniga o'tish →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
