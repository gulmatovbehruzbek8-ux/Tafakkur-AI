'use client';

import Sidebar from "@/app/components/Sidebar";
import TafakkurCompanion from "@/app/components/TafakkurCompanion";
import Link from "next/link";
import { useState, useEffect } from "react";

interface StudentData {
  firstName: string;
  lastName: string;
  studentId: string;
  faculty: string;
  course: string;
  group: string;
  gpa: string;
  educationType: string;
  email: string;
  phone: string;
  status: string;
  birthDate: string;
  citizenship: string;
}

const DEFAULT_STUDENT: StudentData = {
  firstName: "Bunyodbek",
  lastName: "Gulmatov",
  studentId: "38491023",
  faculty: "Sun'iy Intellekt va Axborot Texnologiyalari",
  course: "2-bosqich",
  group: "AI-22",
  gpa: "4.82",
  educationType: "Kunduzgi",
  email: "b.gulmatov@student.tafakkur.uz",
  phone: "+998 90 123 45 67",
  status: "Faol",
  birthDate: "15 Aprel, 2004",
  citizenship: "O'zbekiston Respublikasi",
};

interface ActivityDetail {
  time: string;
  title: string;
  type: string;
  room: string;
  floor: string;
  instructor: string;
  instructorEmail: string;
  officeHours: string;
  status: 'completed' | 'current' | 'upcoming';
  badgeColor: string;
  topic: string;
  actionText: string;
  actionHref: string;
}

interface MilestoneData {
  id: number;
  week: string;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  score?: string;
  topics: string[];
  description: string;
}

export default function MyCampusPage() {
  const [student, setStudent] = useState<StudentData>(DEFAULT_STUDENT);
  const [currentTime, setCurrentTime] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("2 daqiqa oldin");
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  // Selected Activity for interactive drawer
  const [selectedActivity, setSelectedActivity] = useState<ActivityDetail | null>(null);

  // Selected Milestone for Journey line inspection
  const [selectedMilestone, setSelectedMilestone] = useState<number>(3);

  // Quick submit modal
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeReviewModal, setActiveReviewModal] = useState<boolean>(false);

  // Countdown timer for urgent task (seconds remaining: 4h 12m)
  const [countdownSeconds, setCountdownSeconds] = useState(15120);

  useEffect(() => {
    // Real-time clock
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timerInterval = setInterval(updateTime, 1000);

    // Countdown interval
    const countInterval = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Student profile from storage or API
    try {
      const stored = localStorage.getItem('tafakkur_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const p = parsed.profile || {};
        let first = p.firstName;
        let last = p.lastName;
        if (!first && p.name) {
          const parts = p.name.split(' ');
          first = parts[0];
          last = parts.slice(1).join(' ');
        }
        setStudent(prev => ({
          ...prev,
          firstName: first || prev.firstName,
          lastName: last !== undefined ? last : prev.lastName,
          studentId: p.studentId || prev.studentId,
          faculty: p.faculty || prev.faculty,
          course: p.course || prev.course,
          group: p.group || prev.group,
          gpa: p.gpa || prev.gpa,
        }));
      }
    } catch {}

    // Announcements from Admin
    try {
      const storedAnn = localStorage.getItem('tafakkur_announcements');
      if (storedAnn) {
        setAnnouncements(JSON.parse(storedAnn));
      }
    } catch {}

    return () => {
      clearInterval(timerInterval);
      clearInterval(countInterval);
    };
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleHemisSync = () => {
    setIsSyncing(true);
    setSyncToast("HEMIS API shlyuziga ulanmoqda...");
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime("Hozirgina");
      setSyncToast("✅ HEMIS bilan 100% muvaffaqiyatli sinxronlandi! (Barcha baholar va jadval yangilandi)");
      setTimeout(() => setSyncToast(null), 4000);
    }, 1200);
  };

  // 1. Dynamic Activities
  const todayActivities: ActivityDetail[] = [
    {
      time: "08:30 - 10:00",
      title: "Ma'lumotlar tuzilmasi va algoritmlar",
      type: "Ma'ruza",
      room: "A-204 auditoriya",
      floor: "2-bino, 2-qavat",
      instructor: "Prof. Olimjon Turdiyev",
      instructorEmail: "o.turdiyev@urdu.uz",
      officeHours: "Chorshanba va Juma 14:00 - 16:00",
      status: "completed",
      badgeColor: "bg-white/10 text-slate-300 border-white/10",
      topic: "Binar qidiruv daraxtlari: Balanslangan daraxtlar va AVL rotatsiyasi nazariyasi",
      actionText: "Konspektni ko'rish",
      actionHref: "/student/courses",
    },
    {
      time: "10:30 - 12:00",
      title: "Mustaqil ta'lim & Laboratoriya",
      type: "Amaliy mashg'ulot",
      room: "212-laboratoriya",
      floor: "Bosh bino, 2-qavat (IT markazi)",
      instructor: "Prof. Olimjon Turdiyev",
      instructorEmail: "o.turdiyev@urdu.uz",
      officeHours: "Chorshanba va Juma 14:00 - 16:00",
      status: "current",
      badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      topic: "C++ va Python yordamida AVL daraxtida elementlarni qidirish va o'chirish algoritmini dasturlash",
      actionText: "AI Repetitor bilan ishlash",
      actionHref: "/student/tutor",
    },
    {
      time: "13:30 - 15:00",
      title: "Oliy Matematika va Chiziqli Algebra",
      type: "Seminar",
      room: "B-108 xona",
      floor: "B-korpus, 1-qavat",
      instructor: "Dots. Nigora Karimova",
      instructorEmail: "n.karimova@urdu.uz",
      officeHours: "Seshanba 11:00 - 13:00",
      status: "upcoming",
      badgeColor: "bg-blue-400/10 text-blue-300 border-blue-400/20",
      topic: "Xos qiymatlar (eigenvalues) va xos vektorlar tahlili, matritsa determinantlari",
      actionText: "Tezislarni yuklash",
      actionHref: "/student/courses",
    },
    {
      time: "17:30 - 19:00",
      title: "Robototexnika & AI Innovatsiya Klubi",
      type: "Akademik to'garak",
      room: "Kovorking hududi",
      floor: "Talabalar saroyi, 3-qavat",
      instructor: "Tafakkur AI ilmiy jamoasi",
      instructorEmail: "ai-club@tafakkur.uz",
      officeHours: "Har kuni 17:00 dan so'ng",
      status: "upcoming",
      badgeColor: "bg-amber-400/10 text-amber-300 border-amber-400/20",
      topic: "Umummilliy AI Xakaton loyihasi doirasida kompyuter ko'rishi (CV) arxitekturasini sinovdan o'tkazish",
      actionText: "Ishtirokni tasdiqlash",
      actionHref: "/student/calendar",
    },
  ];

  // 2. Semestr bosqichlari (Milestones)
  const semesterMilestones: MilestoneData[] = [
    {
      id: 1,
      week: "1-4 Hafta",
      title: "Fundamental Asoslar & Kirish",
      status: "completed",
      score: "96 ball (A'lo)",
      topics: ["Algoritmik murakkablik O(N)", "Xotira boshqaruvi", "Massivlar va ko'rsatkichlar"],
      description: "Fundamental tushunchalar to'liq o'zlashtirildi. 1-laboratoriya ishi 100 ball bilan qabul qilindi.",
    },
    {
      id: 2,
      week: "5-8 Hafta",
      title: "Chiziqli Ma'lumotlar Tuzilmalari",
      status: "completed",
      score: "94 ball (A'lo)",
      topics: ["Stek va navbatlar", "Bog'langan ro'yxatlar (Linked Lists)", "Xesh jadvallar"],
      description: "Chiziqli ma'lumotlar tuzilmasi bo'yicha oraliq nazorat muvaffaqiyatli topshirildi.",
    },
    {
      id: 3,
      week: "9-12 Hafta",
      title: "Ierarxik Tuzilmalar & Qidiruv Daraxtlari",
      status: "current",
      score: "75% o'tildi (Joriy)",
      topics: ["Binar qidiruv daraxtlari (BST)", "AVL va Qizil-Qora daraxtlar", "B-daraxtlar"],
      description: "Hozirgi faol bosqich. Binar daraxtlar bo'yicha laboratoriya ishi jarayonda (Muddati: bugun).",
    },
    {
      id: 4,
      week: "13-14 Hafta",
      title: "Graflar va Tarmoq Algoritmlari",
      status: "upcoming",
      score: "Rejalashtirilgan",
      topics: ["Dijkstra algoritmi", "Minimal qamrovchi daraxt (MST)", "Tarmoq oqimlari"],
      description: "Oraliq nazorat va murakkab muhandislik keyslarini himoya qilish haftaligi.",
    },
    {
      id: 5,
      week: "15-16 Hafta",
      title: "Yakuniy Nazorat & ECTS Sertifikatsiyasi",
      status: "upcoming",
      score: "Yakuniy bosqich",
      topics: ["Semestr yakuniy imtihoni", "Loyiha himoyasi", "ECTS kreditlarni qayd etish"],
      description: "Barcha topshiriqlar bo'yicha yakuniy ballar hisoblanadi va HEMIS tizimiga uzatiladi.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08111d] text-slate-100 flex">
      {/* Sidebar with Point 3 Novus styling */}
      <Sidebar role="student" activeRoute="/student" />

      {/* Persistent OS Contextual AI Companion (Point 4) */}
      <TafakkurCompanion currentContext="Mening Kampusim & Bugungi Darslar" />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-[1360px] flex-1 px-4 py-7 sm:px-7 lg:px-8 space-y-7 pb-20">

          {/* Toast feedback banner */}
          {syncToast && (
            <div className="p-3.5 rounded-2xl bg-[#0c1a2e] text-white text-xs font-semibold shadow-lg border border-blue-500/30 flex items-center justify-between animate-fade-up">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                {syncToast}
              </span>
              <button onClick={() => setSyncToast(null)} className="text-white/60 hover:text-white text-sm">✕</button>
            </div>
          )}

          {/* Live Admin Announcement Banner */}
          {announcements.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-up">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-base shrink-0 border border-amber-400/30">
                  📢
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 uppercase">
                      Universitet E'loni
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {announcements[0].createdAt}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm text-white mt-0.5 line-clamp-1">
                    {announcements[0].title}
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                    {announcements[0].content}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Link
                  href="/student/events"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                >
                  Batafsil →
                </Link>
                <button
                  onClick={() => setAnnouncements([])}
                  className="p-1.5 text-slate-400 hover:text-white text-xs"
                  title="Yopish"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              HEADER WITH NOVUS KICKER & EMOTIONAL HEADING (Point 4)
              ========================================================================= */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                JUMA · 18-SENTABR, 2026
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Kuningiz, diqqat markazida.
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Xush kelibsiz, {student.firstName}. Bugungi dars jadvali, navbatdagi faoliyat va diqqat talab akademik vazifalar.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleHemisSync}
                disabled={isSyncing}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/8 transition-colors"
                title="HEMIS bazasi bilan yangilash"
              >
                <span className={`size-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-spin' : 'bg-emerald-400 animate-pulse'}`} />
                <span>{isSyncing ? "Sinxronlanmoqda..." : "HEMIS Yangilash"}</span>
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">| {lastSyncTime}</span>
              </button>

              <Link
                href="/student/tutor"
                className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-blue-500 shadow-lg shadow-xs"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                  <path d="M9 13a4.5 4.5 0 0 0 3-4" />
                  <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
                  <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
                  <path d="M6 18a4 4 0 0 1-1.967-.516" />
                  <circle cx="16" cy="13" r=".5" />
                  <circle cx="18" cy="3" r=".5" />
                  <circle cx="20" cy="21" r=".5" />
                  <circle cx="20" cy="8" r=".5" />
                </svg>
                <span>Open AI Tutor</span>
              </Link>
            </div>
          </div>

          {/* =========================================================================
              TOP BENTO GRID: ACADEMIC PASSPORT HERO + NEXT UP (Points 4 & 5)
              ========================================================================= */}
          <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
            {/* Featured Academic Passport Card */}
            <section className="rounded-3xl border border-blue-500/30 bg-slate-900 p-6 text-white flex flex-col justify-between shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold bg-blue-500/15 text-blue-400 tracking-wider border border-blue-500/30">
                    AKADEMIK PASPORT
                  </span>
                  <h2 className="mt-4 text-2xl font-semibold text-white leading-snug">
                    Barqaror semestr<br />shakllanmoqda.
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
                    O'zlashtirish va topshiriqlar dinamikangiz guruh o'rtachasidan ancha yuqori. Haftalik rejangizni shu maromda davom ettiring.
                  </p>
                </div>
                
                <div className="grid size-12 place-items-center rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                    <path d="M22 10v6" />
                    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                  </svg>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
                <div>
                  <p className="text-2xl font-semibold text-white font-mono">{student.gpa}</p>
                  <p className="mt-1 text-[10px] text-slate-400">Joriy GPA</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white font-mono">46/60</p>
                  <p className="mt-1 text-[10px] text-slate-400">Kreditlar</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white font-mono">92.4%</p>
                  <p className="mt-1 text-[10px] text-slate-400">O'zlashtirish</p>
                </div>
              </div>
            </section>

            {/* NEXT UP Card (Point 5) */}
            <section className="rounded-3xl border border-white/8 bg-white/[0.04] p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold bg-amber-400/10 text-amber-300 tracking-wider border border-amber-400/20">
                      NEXT UP
                    </span>
                    <h2 className="mt-3 text-lg font-semibold text-white">
                      Ma'lumotlar tuzilmasi
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-blue-400 font-mono bg-blue-500/15 px-2.5 py-1 rounded-lg border border-blue-500/30">
                    10:30
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-white/8 pt-4">
                  <div className="grid size-10 place-items-center rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 7v14" />
                      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">
                      AVL & Binar qidiruv daraxtlari laboratoriyasi
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      212-laboratoriya · Prof. Olimjon Turdiyev
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedActivity(todayActivities[1])}
                className="mt-5 flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors pt-2"
              >
                <span>Bugungi dars tafsilotlari</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </section>
          </div>

          {/* =========================================================================
              SECONDARY BENTO GRID: WHAT NEEDS YOU + AI INSIGHT (Points 4 & 5)
              ========================================================================= */}
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            {/* WHAT NEEDS YOU Card */}
            <section className="rounded-3xl border border-white/8 bg-white/[0.04] p-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    WHAT NEEDS YOU
                  </p>
                  <h2 className="mt-1.5 text-lg font-semibold text-white">
                    Bugun uchun qisqa ro'yxat
                  </h2>
                </div>
                <Link href="/student/assignments" className="text-xs font-semibold text-blue-400 hover:text-blue-300">
                  Barchasi →
                </Link>
              </div>

              <div className="mt-5 flex flex-col divide-y divide-white/8">
                {/* Task 1: In progress / Submit */}
                <div 
                  onClick={() => setSubmitModalOpen(true)}
                  className="flex items-center gap-3 py-3 text-left first:pt-0 last:pb-0 cursor-pointer group hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                >
                  <span className="grid size-8 place-items-center rounded-lg bg-amber-400/10 text-amber-300 shrink-0 border border-amber-400/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                      <path d="M10 9H8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-slate-200 group-hover:text-blue-300">
                      BST Laboratoriya loyihasi (C++/Python)
                    </span>
                    <span className="mt-0.5 block text-[10px] text-amber-300 font-mono">
                      ⏳ Qolgan vaqt: {formatCountdown(countdownSeconds)}
                    </span>
                  </span>
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    In progress
                  </span>
                </div>

                {/* Task 2: Exam */}
                <Link
                  href="/student/courses"
                  className="flex items-center gap-3 py-3 text-left first:pt-0 last:pb-0 group hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                >
                  <span className="grid size-8 place-items-center rounded-lg bg-blue-500/15 text-blue-400 shrink-0 border border-blue-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-slate-200 group-hover:text-blue-300">
                      Sun'iy Intellekt asoslari oraliq imtihoni
                    </span>
                    <span className="mt-0.5 block text-[10px] text-slate-400">
                      21-sentyabr, 10:00 · 25 ta test va 2 ta amaliy keys
                    </span>
                  </span>
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    Oraliq nazorat
                  </span>
                </Link>

                {/* Task 3: Graded / Review */}
                <div 
                  onClick={() => setActiveReviewModal(true)}
                  className="flex items-center gap-3 py-3 text-left first:pt-0 last:pb-0 cursor-pointer group hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                >
                  <span className="grid size-8 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300 shrink-0 border border-emerald-400/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <path d="m9 11 3 3L22 4" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-slate-200 group-hover:text-blue-300">
                      Prof. Turdiyev 2-laboratoriya taqrizi: 92/100
                    </span>
                    <span className="mt-0.5 block text-[10px] text-slate-400">
                      "Linked-list arxitekturasi namunali yozilgan"
                    </span>
                  </span>
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                    Graded
                  </span>
                </div>
              </div>
            </section>

            {/* AI INSIGHT Card (Point 5) */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-blue-400">
                    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                    <path d="M20 2v4" />
                    <path d="M22 4h-4" />
                    <circle cx="4" cy="20" r="2" />
                  </svg>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">
                    AI INSIGHT
                  </p>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Bugun 23:59 gacha BST laboratoriya ishingizni topshirishingiz kerak. O'tgan haftadagi C++ laboratoriyasida xotira tozalash bo'yicha kichik xatolik bo'lgan edi — topshirishdan oldin AI Repetitor bilan kodni sinovdan o'tkazing.
                </p>
              </div>

              <Link
                href="/student/tutor"
                className="mt-5 flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Plan my week & AI Tutor bilan tekshirish</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </section>
          </div>

          {/* =========================================================================
              BUGUNGI KUNINGIZ (YOUR DAY TIMELINE)
              ========================================================================= */}
          <section className="rounded-3xl border border-white/8 bg-white/[0.04] p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                  KUN TARTIBI
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mt-1">
                  Bugungi Kuningiz (Your Day Timeline)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Darslar, laboratoriyalar va ilmiy to'garaklarning vaqt bo'yicha ketma-ketligi
                </p>
              </div>

              <Link
                href="/student/calendar"
                className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 bg-blue-500/15 px-3.5 py-2 rounded-xl border border-blue-500/30 self-start sm:self-auto"
              >
                <span>To'liq semestr taqvimi</span>
                <span className="font-mono">→</span>
              </Link>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-white/10 space-y-5">
              {todayActivities.map((slot, idx) => (
                <div key={idx} className="relative group">
                  {/* Visual Node */}
                  <span 
                    className={`absolute -left-[31px] sm:-left-[39px] top-3 size-4 rounded-full border-2 transition-all ${
                      slot.status === 'current'
                        ? 'bg-blue-600 border-slate-950 ring-4 ring-blue-500/40 animate-pulse'
                        : slot.status === 'completed'
                          ? 'bg-emerald-400 border-slate-950 ring-2 ring-emerald-400/20'
                          : 'bg-slate-800 border-slate-600 group-hover:border-blue-500'
                    }`} 
                  />

                  <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    slot.status === 'current'
                      ? 'bg-blue-500/[0.06] border-blue-500/30 shadow-md'
                      : 'bg-white/[0.02] border-white/8 hover:bg-white/[0.04]'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-blue-300 bg-blue-500/15 px-2.5 py-0.5 rounded-md border border-blue-500/30">
                            {slot.time}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${slot.badgeColor}`}>
                            {slot.type}
                          </span>
                          {slot.status === 'current' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white animate-pulse">
                              ● Hozirgi dars
                            </span>
                          )}
                          {slot.status === 'completed' && (
                            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                              ✓ O'tildi
                            </span>
                          )}
                        </div>

                        <h3 className="font-semibold text-base text-white">
                          {slot.title}
                        </h3>

                        <p className="text-xs text-slate-300 leading-snug">
                          {slot.topic}
                        </p>

                        <div className="pt-1 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                          <span className="font-medium text-slate-200">📍 {slot.room}</span>
                          <span>•</span>
                          <span>👤 {slot.instructor}</span>
                          <span>•</span>
                          <span>🏢 {slot.floor}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                        <button
                          onClick={() => setSelectedActivity(slot)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 text-slate-300 hover:text-white text-xs font-semibold transition-all"
                        >
                          Tafsilotlar
                        </button>
                        
                        <Link
                          href={slot.actionHref}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1"
                        >
                          <span>{slot.actionText}</span>
                          <span className="font-mono">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              YOUR MOMENTUM & SEMESTER JOURNEY
              ========================================================================= */}
          <section className="rounded-3xl border border-white/8 bg-white/[0.04] p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                  AKADEMIK DINAMIKA
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mt-1">
                  Sizning Akademik Impulsingiz (Your Momentum)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  O'zlashtirish, davomat, o'qish seriyasi va topshiriqlar tezligining sintez dinamikasi
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 self-start sm:self-auto">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Barqaror Yuksalishda (+6.4%)
              </span>
            </div>

            {/* 4 Performance Pillars */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">O'zlashtirish</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400">Top 3%</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-mono">92.4%</span>
                  <span className="text-xs font-bold text-emerald-400">A'lo</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full w-[92.4%]" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 block">GPA: {student.gpa} / 5.0</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-blue-400/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Davomat</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-400/10 text-blue-300">24/25 Dars</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-mono">96.0%</span>
                  <span className="text-xs font-bold text-blue-400">Sababsiz 0</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full w-[96%]" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 block">1 ta uzrli sabab</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-amber-400/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">O'qish Seriyasi</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300">🔥 14 Kun</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-mono">14 Kun</span>
                  <span className="text-xs font-bold text-amber-400">Faol Streak</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full w-[85%]" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 block">Har kungi dars odati</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 hover:border-emerald-400/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Topshiriqlar</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-300">90% Vaqtida</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-mono">18 / 20</span>
                  <span className="text-xs font-bold text-emerald-400">Topshirildi</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full w-[90%]" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 block">2 ta faol topshiriq</span>
              </div>
            </div>

            {/* Semester Journey Track */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#07101B] via-[#0a1e30] to-[#071822] text-white relative overflow-hidden border border-white/8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Semestr Traektoriyasi (Semester Journey)</span>
                    <span className="text-[10px] bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full font-mono border border-blue-500/30">
                      Kuz 2026
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Bosqichni tanlab, o'tilgan yoki kutilayotgan modullar tafsilotini tekshiring
                  </p>
                </div>

                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/15 px-3 py-1 rounded-full border border-blue-500/30 self-start sm:self-auto">
                  Tezlik: Optimum marom (92%)
                </span>
              </div>

              {/* Glowing Track */}
              <div className="relative pt-4 pb-2 px-2">
                <div className="absolute top-1/2 left-6 right-6 h-1.5 -translate-y-1/2 bg-white/10 rounded-full" />
                <div className="absolute top-1/2 left-6 w-[55%] h-1.5 -translate-y-1/2 bg-blue-600 rounded-full" />

                <div className="relative flex justify-between items-center text-center">
                  {semesterMilestones.map((m) => {
                    const isSelected = selectedMilestone === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMilestone(m.id)}
                        className="flex flex-col items-center space-y-2 group focus:outline-none transition-all"
                      >
                        <div 
                          className={`size-9 sm:size-10 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                            m.status === 'completed'
                              ? 'bg-emerald-400 text-slate-950 shadow-md ring-4 ring-emerald-400/20 group-hover:scale-110'
                              : m.status === 'current'
                                ? 'bg-blue-600 text-white ring-4 ring-blue-500/40 shadow-lg animate-pulse scale-110'
                                : 'bg-white/10 border border-white/20 text-white/60 group-hover:border-white/50 group-hover:text-white'
                          } ${isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-950' : ''}`}
                        >
                          {m.status === 'completed' ? '✓' : m.status === 'current' ? '●' : m.id}
                        </div>

                        <div className="text-center">
                          <p className={`text-[11px] sm:text-xs font-bold transition-colors ${
                            isSelected ? 'text-blue-400 underline' : 'text-white/90 group-hover:text-white'
                          }`}>
                            {m.week}
                          </p>
                          <p className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block max-w-[90px] truncate">
                            {m.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Milestone Inspection Box */}
              {semesterMilestones.find(m => m.id === selectedMilestone) && (
                <div className="relative mt-6 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-up">
                  {(() => {
                    const m = semesterMilestones.find(item => item.id === selectedMilestone)!;
                    return (
                      <>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-blue-400 text-sm">{m.week}: {m.title}</span>
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px]">
                              {m.score}
                            </span>
                          </div>
                          <p className="text-slate-300 leading-relaxed max-w-2xl">
                            {m.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap pt-1">
                            <span className="text-slate-400 text-[10px] uppercase font-bold">Mavzular:</span>
                            {m.topics.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-white/10 text-white/90 text-[10px] border border-white/10">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Link
                          href="/student/courses"
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
                        >
                          <span>Modul Materiallari</span>
                          <span>→</span>
                        </Link>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </section>

          {/* =========================================================================
              INTERACTIVE ACTIVITY DETAIL MODAL
              ========================================================================= */}
          {selectedActivity && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0b1320] text-slate-100 rounded-3xl border border-white/15 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-scale-up">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      {selectedActivity.type}
                    </span>
                    <span className="font-mono text-xs text-slate-400 font-bold">
                      {selectedActivity.time}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="size-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    {selectedActivity.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.03] p-3.5 rounded-xl border border-white/8">
                    <strong className="text-white block mb-1">Mavzu:</strong>
                    {selectedActivity.topic}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Xona & Manzil</span>
                      <span className="font-bold text-white">{selectedActivity.room}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{selectedActivity.floor}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">O'qituvchi</span>
                      <span className="font-bold text-white">{selectedActivity.instructor}</span>
                      <span className="text-[11px] text-blue-400 block mt-0.5 truncate">{selectedActivity.instructorEmail}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-500/[0.05] border border-blue-500/30 text-xs text-blue-300">
                    <span className="font-bold block mb-0.5">Qabul soatlari:</span>
                    <span>{selectedActivity.officeHours}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-300"
                  >
                    Yopish
                  </button>
                  <Link
                    href={selectedActivity.actionHref}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
                  >
                    {selectedActivity.actionText} →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              QUICK SUBMIT MODAL (Urgent Task)
              ========================================================================= */}
          {submitModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0b1320] text-slate-100 rounded-3xl border border-white/15 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-scale-up">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Topshiriqni topshirish (BST Laboratoriya)
                    </h3>
                    <p className="text-xs text-amber-300 font-mono">
                      Qolgan vaqt: {formatCountdown(countdownSeconds)}
                    </p>
                  </div>
                  <button
                    onClick={() => { setSubmitModalOpen(false); setSubmitSuccess(false); }}
                    className="size-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>

                {submitSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 text-center space-y-3">
                    <span className="size-12 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-xl mx-auto font-bold">
                      ✓
                    </span>
                    <h4 className="font-bold text-base text-white">
                      Topshiriq muvaffaqiyatli qabul qilindi!
                    </h4>
                    <p className="text-xs text-emerald-300">
                      Fayllaringiz Tafakkur AI Grader va Prof. O. Turdiyevga tekshirish uchun yuborildi.
                    </p>
                    <button
                      onClick={() => { setSubmitModalOpen(false); setSubmitSuccess(false); }}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500"
                    >
                      Tushunarli
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-blue-500 text-center cursor-pointer bg-white/[0.02] transition-colors">
                      <div className="size-10 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center mx-auto mb-2 font-bold">
                        📁
                      </div>
                      <p className="font-bold text-white">Loyihani bu yerga yuklang</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">.cpp, .py, yoki .pdf formatida (Maks: 25 MB)</p>
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 block mb-1">
                        Dasturiy kod havolasi (GitHub / GitLab) yoki izoh:
                      </label>
                      <input
                        type="text"
                        placeholder="https://github.com/bunyodbek/bst-algorithms"
                        defaultValue="https://github.com/bunyodbek/bst-project-urdu"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 text-white text-xs"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] flex items-center gap-2">
                      <span className="font-bold">✨ AI Grader:</span>
                      <span>Topshirganingizdan so'ng AI algoritmingiz xotira va vaqt murakkabligini avtomatik tahlil qiladi.</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSubmitModalOpen(false)}
                        className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-300"
                      >
                        Bekor qilish
                      </button>
                      <button
                        onClick={() => setSubmitSuccess(true)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
                      >
                        Topshiriqni tasdiqlash
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TEACHER REVIEW MODAL (Prof. Turdiyev feedback)
              ========================================================================= */}
          {activeReviewModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0b1320] text-slate-100 rounded-3xl border border-white/15 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-up">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-emerald-400" />
                    <h3 className="text-base font-bold text-white">
                      O'qituvchi Taqrizi & AI Grader Bahosi
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveReviewModal(false)}
                    className="size-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-emerald-400">Qo'yilgan Baho</span>
                    <h4 className="text-2xl font-black text-white font-mono">92 / 100 Ball</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 font-bold text-xs">
                    A'lo (A)
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-white">Prof. Olimjon Turdiyev:</span>
                      <span className="text-[10px] text-slate-400">Bugun 14:15</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed italic">
                      "Bunyodbek, 2-laboratoriya ishingizda linked-list va stek tuzilmasi sinf arxitekturasi bilan namunali yozilgan. Xotirani tozalash (destructor) ham unutilmagan. Keyingi BST topshirig'ida balanslashni shunday uslubda davom ettiring."
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[11px] text-blue-300">
                    <span className="font-bold block mb-1">🤖 AI Grader dastlabki tahlili:</span>
                    <span>Test keyslardan o'tish ko'rsatkichi: 10/10. Qo'shimcha xotira sarfi: O(1) optimal.</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveReviewModal(false)}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500"
                  >
                    Tushunarli
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
