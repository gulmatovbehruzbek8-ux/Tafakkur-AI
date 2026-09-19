'use client';

import Sidebar from "@/app/components/Sidebar";
import TafakkurCompanion from "@/app/components/TafakkurCompanion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import HeaderControls from "@/app/components/HeaderControls";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<'hub' | 'profile'>('hub');
  const [greeting, setGreeting] = useState("Xayrli kun");

  const teacher = {
    name: "Prof. Olimjon Turdiyev",
    position: "Katta O'qituvchi, Fanlar Doktori",
    department: "Dasturiy Ta'minot Injiniringi",
    faculty: "Sun'iy Intellekt va Axborot Texnologiyalari",
    id: "PROF-9012",
    email: "o.turdiyev@tafakkur.uz",
    phone: "+998 90 987 65 43",
    room: "A-204 xona",
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Xayrli tong");
    else if (hour >= 12 && hour < 18) setGreeting("Xayrli kun");
    else setGreeting("Xayrli kech");
  }, []);

  const todayClasses = [
    { time: "08:30 - 10:00", subject: "Ma'lumotlar tuzilmasi va algoritmlar", type: "Ma'ruza", room: "A-204 auditoriya", group: "AI-22 (28 talaba)", status: "completed" },
    { time: "10:30 - 12:00", subject: "Binar qidiruv daraxtlari laboratoriyasi", type: "Laboratoriya", room: "212-laboratoriya", group: "AI-22 (28 talaba)", status: "current" },
    { time: "14:00 - 16:00", subject: "Talabalarni qabul qilish va konsultatsiya", type: "Office Hours", room: "A-204 xona", group: "Barcha guruhlar", status: "upcoming" },
  ];

  const attentionItems = [
    { id: 'att-1', count: 48, label: "Baholanmagan talabalar laboratoriya ishi", subtitle: "CS-201: BST binar daraxtlari", actionText: "AI Grader bilan baholash", actionHref: "/teacher/grader", urgency: "critical" },
    { id: 'att-2', count: 7, label: "Javobsiz qolgan akademik savol", subtitle: "Dars materiallari va topshiriq talablari bo'yicha", actionText: "Savollarni ko'rish", actionHref: "/teacher/chatbot", urgency: "warning" },
    { id: 'att-3', count: 2, label: "Davomat xavfi mavjud talaba", subtitle: "3 ta darsdan ko'p qoldirgan talabalar", actionText: "Davomat daftari", actionHref: "/teacher/calendar", urgency: "info" },
  ];

  return (
    <div className="tf-page">
      <Sidebar role="teacher" activeRoute="/teacher" />
      <TafakkurCompanion currentContext="O'qituvchi Boshqaruvi & AI Grader" />

      <main className="tf-main pb-20">
        <div className="tf-container space-y-8">

          {/* =========================================================================
              1. PROFESSOR HERO: GOOD EVENING + AMBIENT HEMIS SYNC
              ========================================================================= */}
          <div className="relative rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-slate-50 dark:bg-[#121215] dark:from-slate-900 dark:to-slate-900 text-slate-900 dark:text-white p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-zinc-800 shadow-xs dark:shadow-xl space-y-6 animate-fade-up">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-white/10 border border-emerald-200 dark:border-white/15 text-emerald-800 dark:text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>HEMIS SYNC ● Connected</span>
                    <span className="text-slate-500 dark:text-white/60">| 2 daqiqa oldin</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-300 font-mono">
                    Urganch Davlat Universiteti
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {greeting}, <span>{teacher.name}</span>.
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2 flex-wrap">
                  <span>Juma, 18-sentyabr, 2026</span>
                  <span>•</span>
                  <span>{teacher.department}</span>
                  <span>•</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{teacher.room}</span>
                </p>
              </div>

              {/* View Switcher, AI Grader Quick Action & HeaderControls */}
              <div className="flex items-center gap-3 flex-wrap self-start lg:self-auto">
                <HeaderControls />
                <Link
                  href="/teacher/grader"
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 group"
                >
                  <span>⚡ AI Grader: 48 ta ishni tekshirish</span>
                  <span className="group-hover:translate-x-0.5 transition-transform font-mono">→</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats Ribbon */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-white/10 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">Bugungi Darslar</span>
                <span className="font-display font-black text-xl text-slate-900 dark:text-white font-mono">3 ta mashg'ulot</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">Talabalar Soni</span>
                <span className="font-display font-black text-xl text-slate-900 dark:text-slate-100 font-mono">112 nafar</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">Tekshiruv Kutilmoqda</span>
                <span className="font-display font-black text-xl text-amber-600 dark:text-amber-400 font-mono">48 ta topshiriq</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">Guruh O'rtacha Bali</span>
                <span className="font-display font-black text-xl text-emerald-600 dark:text-emerald-400 font-mono">78%</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              2. WHAT NEEDS ATTENTION (DIQQAT TALAB QILADIGAN ISHLAR)
              ========================================================================= */}
          <section className="space-y-4 animate-fade-up">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                Diqqat Talab Qiladigan Vazifalar (What Needs Attention)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {attentionItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl bg-white dark:bg-[#121215] border transition-all shadow-xs flex flex-col justify-between ${
                    item.urgency === 'critical'
                      ? 'border-red-300 dark:border-red-900/60 hover:border-red-500 ring-1 ring-red-100 dark:ring-red-950/40'
                      : item.urgency === 'warning'
                        ? 'border-amber-300 dark:border-amber-900/60 hover:border-amber-500 ring-1 ring-amber-100 dark:ring-amber-950/40'
                        : 'border-slate-200 dark:border-zinc-800 hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`font-display font-black text-2xl font-mono ${
                        item.urgency === 'critical' ? 'text-red-600 dark:text-red-400' : item.urgency === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {item.count}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 uppercase">
                        Kutilmoqda
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {item.label}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 mt-4">
                    <Link
                      href={item.actionHref}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs ${
                        item.urgency === 'critical'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <span>{item.actionText}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              3. TODAY'S CLASSES & SCHEDULE (BUGUNGI DARSLAR)
              ========================================================================= */}
          <section className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-4 animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h2 className="font-display text-lg font-bold text-ink">
                  Bugungi Mashg'ulotlar Jadvali (Today's Classes)
                </h2>
              </div>
              <Link
                href="/teacher/calendar"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Haftalik taqvim →
              </Link>
            </div>

            <div className="space-y-3">
              {todayClasses.map((c, i) => (
                <div
                  key={i}
                  className={`p-4.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    c.status === 'current'
                      ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 ring-1 ring-blue-100 dark:ring-blue-900/30'
                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-white/10 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
                        {c.time}
                      </span>
                      <span className="font-bold text-blue-800 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                        {c.type}
                      </span>
                      {c.status === 'current' && (
                        <span className="font-bold text-white bg-blue-600 px-2 py-0.5 rounded-md animate-pulse">
                          ● Hozir
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">{c.subject}</h4>
                    <p className="text-slate-500 dark:text-slate-400">📍 {c.room} • 👥 {c.group}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 font-bold transition-colors">
                      Jurnalni ochish
                    </button>
                    <Link
                      href="/teacher/grader"
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                    >
                      Topshiriqlar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              4. CLASS INSIGHTS (GURUH AKADEMIK KO'RSATKICHLARI)
              ========================================================================= */}
          <section className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h2 className="font-display text-lg font-bold text-ink">
                  Guruhlar Analitikasi (Class Insights)
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">CS-201 & AI-204</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  O'rtacha Guruh Bali (Class Average)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-slate-900 dark:text-white font-mono">78%</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">O'tgan oyga nisbatan +4.2%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-blue-600 h-full rounded-full w-[78%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Topshirish Qamrovi (Submission Rate)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-blue-800 dark:text-blue-400 font-mono">92%</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Vaqtida yuklangan</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-blue-600 h-full rounded-full w-[92%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Davomat Ko'rsatkichi (Attendance)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-emerald-800 dark:text-emerald-400 font-mono">88%</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Barqaror</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-emerald-600 h-full rounded-full w-[88%]" />
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
