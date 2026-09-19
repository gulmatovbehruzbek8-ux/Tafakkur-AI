'use client';

import Sidebar from "@/app/components/Sidebar";
import TafakkurCompanion from "@/app/components/TafakkurCompanion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CourseModule {
  id: number;
  number: string;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  score?: string;
  progressPercent: number;
  topics: string[];
  lessonsCount: number;
}

interface CourseData {
  id: string;
  code: string;
  title: string;
  category: string;
  credits: number;
  currentGrade: number;
  attendance: number;
  instructor: {
    name: string;
    title: string;
    email: string;
    room: string;
    officeHours: string;
  };
  schedule: string;
  currentModuleTitle: string;
  modules: CourseModule[];
  assignments: {
    id: string;
    title: string;
    deadline: string;
    status: 'submitted' | 'pending' | 'graded';
    score?: string;
    difficulty: string;
  }[];
  resources: {
    name: string;
    type: string;
    size: string;
  }[];
}

const COURSES: CourseData[] = [
  {
    id: 'cs-201',
    code: 'CS-201',
    title: "Ma'lumotlar tuzilmasi va algoritmlar",
    category: "Asosiy mutaxassislik",
    credits: 6,
    currentGrade: 92,
    attendance: 96,
    instructor: {
      name: "Prof. Olimjon Turdiyev",
      title: "Kafedra mudiri, Fanlar doktori",
      email: "o.turdiyev@urdu.uz",
      room: "A-204 xona",
      officeHours: "Chorshanba va Juma 14:00 - 16:00"
    },
    schedule: "Dush, Chor, Juma 08:30 - 10:00 (A-204 & 212-lab)",
    currentModuleTitle: "Modul 3: Binar qidiruv daraxtlari (BST)",
    modules: [
      {
        id: 1,
        number: "Modul 1",
        title: "Fundamental asoslar va algoritmik murakkablik",
        status: "completed",
        score: "96 / 100",
        progressPercent: 100,
        topics: ["Asimptotik tahlil O, Omega, Theta", "Statik va dinamik massivlar", "Xotira segmentatsiyasi"],
        lessonsCount: 6
      },
      {
        id: 2,
        number: "Modul 2",
        title: "Chiziqli ma'lumotlar tuzilmalari",
        status: "completed",
        score: "94 / 100",
        progressPercent: 100,
        topics: ["Stek va navbatlar", "Bir va ikki bog'langan ro'yxatlar", "Xesh jadvallar"],
        lessonsCount: 8
      },
      {
        id: 3,
        number: "Modul 3",
        title: "Binar qidiruv daraxtlari & Balanslash",
        status: "current",
        score: "Jarayonda",
        progressPercent: 75,
        topics: ["BST arxitekturasi va rekursiya", "AVL daraxti va rotatsiyalar", "Qizil-qora daraxtlar asoslari"],
        lessonsCount: 8
      },
      {
        id: 4,
        number: "Modul 4",
        title: "Graflar va eng qisqa yo'l algoritmlari",
        status: "upcoming",
        progressPercent: 0,
        topics: ["Graf matritsasi va qo'shnichilik ro'yxati", "Dijkstra va Bellman-Ford", "Minimal daraxt (Prim, Kruskal)"],
        lessonsCount: 8
      },
      {
        id: 5,
        number: "Modul 5",
        title: "Dinamik dasturlash va murakkab muammolar",
        status: "upcoming",
        progressPercent: 0,
        topics: ["Memoizatsiya va tabulyatsiya", "Ryukzak masalasi", "NP-to'liq muammolar"],
        lessonsCount: 6
      }
    ],
    assignments: [
      {
        id: 'a1',
        title: "1-Laboratoriya: Xotira boshqaruvi va dinamik massivlar",
        deadline: "28-avgust",
        status: "graded",
        score: "96 / 100",
        difficulty: "O'rta"
      },
      {
        id: 'a2',
        title: "2-Laboratoriya: Bog'langan ro'yxat va stek realizatsiyasi",
        deadline: "10-sentyabr",
        status: "graded",
        score: "92 / 100",
        difficulty: "O'rta"
      },
      {
        id: 'a3',
        title: "3-Laboratoriya: AVL binar qidiruv daraxtida rotatsiya",
        deadline: "Bugun, 23:59",
        status: "pending",
        difficulty: "Murakkab"
      }
    ],
    resources: [
      { name: "CLRS - Introduction to Algorithms (4th Edition).pdf", type: "Darslik", size: "18.4 MB" },
      { name: "3-Modul: Binar daraxtlar taqdimot slaydlari.pptx", type: "Slayd", size: "4.2 MB" },
      { name: "AVL daraxti namunaviy kodi (C++ / Python).zip", type: "Kod arxivi", size: "1.1 MB" }
    ]
  },
  {
    id: 'ai-204',
    code: 'AI-204',
    title: "Sun'iy Intellekt va Mashinali O'rganish",
    category: "Mutaxassislik tanlov fani",
    credits: 5,
    currentGrade: 94,
    attendance: 100,
    instructor: {
      name: "Dots. Nigora Karimova",
      title: "Dotsent, PhD",
      email: "n.karimova@urdu.uz",
      room: "B-310 xona",
      officeHours: "Seshanba 14:00 - 16:00"
    },
    schedule: "Seshanba, Payshanba 10:30 - 12:00 (AI Lab)",
    currentModuleTitle: "Modul 2: Neyron to'rlar va Optimizatsiya",
    modules: [
      {
        id: 1,
        number: "Modul 1",
        title: "Klassik ML va regressiya modellari",
        status: "completed",
        score: "95 / 100",
        progressPercent: 100,
        topics: ["Chiziqli va logistik regressiya", "K-means klasterlash"],
        lessonsCount: 6
      },
      {
        id: 2,
        number: "Modul 2",
        title: "Chuqur o'rganish va Ko'p qatlamli perseptron",
        status: "current",
        score: "Jarayonda",
        progressPercent: 60,
        topics: ["Backpropagation algoritmi", "Faollashtirish funksiyalari (ReLU, Sigmoid)"],
        lessonsCount: 8
      },
      {
        id: 3,
        number: "Modul 3",
        title: "Kompyuter ko'rishi (CNN) va Ob'ektlarni aniqlash",
        status: "upcoming",
        progressPercent: 0,
        topics: ["Konvolyutsiya qatlamlari", "ResNet arxitekturasi"],
        lessonsCount: 8
      }
    ],
    assignments: [
      {
        id: 'ai-a1',
        title: "MNIST ma'lumotlar to'plamida klassifikatsiya modeli",
        deadline: "15-sentyabr",
        status: "graded",
        score: "95 / 100",
        difficulty: "O'rta"
      }
    ],
    resources: [
      { name: "Deep Learning with PyTorch Book.pdf", type: "Darslik", size: "22 MB" }
    ]
  }
];

export default function CoursesPage() {
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'modules' | 'assignments' | 'tutor' | 'resources'>('modules');
  const [selectedModuleDetail, setSelectedModuleDetail] = useState<CourseModule | null>(null);

  const course = COURSES[selectedCourseIndex] || COURSES[0];

  return (
    <div className="tf-page">
      <Sidebar role="student" activeRoute="/student/courses" />
      <TafakkurCompanion currentContext={`Kurs Ishchi Maydoni: ${course.title}`} />

      <main className="tf-main pb-20">
        <div className="tf-container space-y-6">

          {/* =========================================================================
              1. COURSE SELECTOR TABS
              ========================================================================= */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none animate-fade-up">
            {COURSES.map((c, idx) => {
              const isSelected = selectedCourseIndex === idx;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCourseIndex(idx);
                    setSelectedModuleDetail(null);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-blue-400">
                    {c.code}
                  </span>
                  <span>{c.title}</span>
                </button>
              );
            })}
          </div>

          {/* =========================================================================
              2. DEDICATED ACADEMIC WORKSPACE HEADER
              ========================================================================= */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#07101B] via-[#0c1f33] to-[#07243b] text-white p-6 sm:p-8 border border-white/10 shadow-xl space-y-6 animate-fade-up">
            <div className="tf-mesh absolute inset-0 opacity-30 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {course.code}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {course.category}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs text-blue-300 font-mono font-bold">
                    {course.credits} ECTS Kredit
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {course.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2 flex-wrap">
                  <span>📅 {course.schedule}</span>
                </p>
              </div>

              {/* Course Score & Attendance Cards */}
              <div className="flex items-center gap-3">
                <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Joriy Baho</span>
                  <span className="font-display text-2xl font-black text-blue-400 font-mono">
                    {course.currentGrade}%
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold block">A'lo (A)</span>
                </div>

                <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Davomat</span>
                  <span className="font-display text-2xl font-black text-blue-300 font-mono">
                    {course.attendance}%
                  </span>
                  <span className="text-[10px] text-blue-400 font-bold block">Faol</span>
                </div>
              </div>
            </div>

            {/* Professor & Office Hours Card */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-display font-bold flex items-center justify-center border border-blue-500/30 shrink-0">
                  Prof
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{course.instructor.name}</h4>
                  <p className="text-slate-300 text-[11px]">{course.instructor.title} • {course.instructor.room}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-blue-400 font-bold">Qabul soatlari:</span>
                <span>{course.instructor.officeHours}</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              3. VISUAL LEARNING JOURNEY (5 MODULE ROADMAP)
              ========================================================================= */}
          <section className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">O'quv Traektoriyasi</span>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Modullar Ketma-ketligi & Bosqichlar
                </h2>
              </div>
              <span className="text-xs font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 self-start sm:self-auto">
                Hozir: {course.currentModuleTitle}
              </span>
            </div>

            {/* Horizontal Module Journey Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {course.modules.map((m) => {
                const isSelected = selectedModuleDetail?.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModuleDetail(m)}
                    className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      m.status === 'completed'
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                        : m.status === 'current'
                          ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 shadow-sm ring-2 ring-blue-500/30'
                          : 'bg-slate-50/60 dark:bg-white/[0.02] border-slate-200/70 dark:border-white/10 hover:bg-white dark:hover:bg-white/5'
                    } ${isSelected ? 'ring-2 ring-blue-600' : ''}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {m.number}
                        </span>
                        {m.status === 'completed' && (
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">
                            ✓
                          </span>
                        )}
                        {m.status === 'current' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600 text-white animate-pulse">
                            ● Hozir
                          </span>
                        )}
                        {m.status === 'upcoming' && (
                          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold">
                            ○
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                        {m.title}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">{m.lessonsCount} ta dars</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{m.score || `${m.progressPercent}%`}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Module Detail Panel */}
            {selectedModuleDetail && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#121215] text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 text-xs space-y-3 animate-fade-up shadow-2xs dark:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-mono text-[11px] font-bold border border-blue-200 dark:border-blue-500/30">
                      {selectedModuleDetail.number}
                    </span>
                    <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      {selectedModuleDetail.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedModuleDetail(null)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1.5">
                  <p className="text-slate-600 dark:text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
                    Ushbu modulda o'rganiladigan asosiy mavzular:
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedModuleDetail.topics.map((t, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-white dark:bg-white/10 text-slate-700 dark:text-white text-xs border border-slate-200 dark:border-white/10 shadow-2xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-white/10">
                  <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">
                    Status: {selectedModuleDetail.status === 'completed' ? 'To\'liq yakunlangan' : selectedModuleDetail.status === 'current' ? 'Hozirgi faol modul' : 'Kelgusi reja'}
                  </span>
                  <Link
                    href="/student/tutor"
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                  >
                    Ushbu modulni AI bilan o'rganish →
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* =========================================================================
              4. WORKSPACE TABS: ASSIGNMENTS, RESOURCES & SOW
              ========================================================================= */}
          <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-up">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              {[
                { id: 'modules', label: "Mavzular va Ma'ruzalar", icon: "📚" },
                { id: 'assignments', label: "Laboratoriya & Topshiriqlar", icon: "📝" },
                { id: 'resources', label: "Resurslar & Adabiyotlar", icon: "📁" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab 1: Assignments */}
            {activeTab === 'assignments' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    Barcha amaliy laboratoriya topshiriqlari ({course.assignments.length})
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Jami ballar jamg'armasi: 100 ball
                  </span>
                </div>

                <div className="space-y-3">
                  {course.assignments.map((a) => (
                    <div
                      key={a.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            a.status === 'graded'
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                              : 'bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300 animate-pulse'
                          }`}>
                            {a.status === 'graded' ? 'Baholangan' : 'Topshirish kutilmoqda'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            ⏳ Muddat: {a.deadline}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                          {a.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {a.score ? (
                          <span className="font-display font-black text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 font-mono">
                            {a.score}
                          </span>
                        ) : (
                          <Link
                            href="/student"
                            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
                          >
                            Topshirish →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Modules Syllabus */}
            {activeTab === 'modules' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs text-slate-900 dark:text-blue-200 flex items-center justify-between">
                  <span>
                    💡 <strong>O'quv qo'llanmasi:</strong> Barcha ma'ruzalar va amaliy mashg'ulotlar O'zbekiston Respublikasi Oliy ta'lim standarti hamda xalqaro ACM/IEEE Computer Science mezonlariga mos keladi.
                  </span>
                  <Link
                    href="/student/tutor"
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 ml-3"
                  >
                    AI bilan o'rganish
                  </Link>
                </div>

                <div className="space-y-3">
                  {course.modules.map((m) => (
                    <div key={m.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{m.number}: {m.title}</span>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{m.lessonsCount} ta ma'ruza</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 dark:text-slate-300">
                        {m.topics.map((t, idx) => (
                          <span key={idx} className="bg-white dark:bg-white/5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10">
                            • {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white pb-1">
                  Rasmiy darsliklar va elektron materiallar
                </h3>

                <div className="space-y-2.5">
                  {course.resources.map((r, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 hover:bg-white dark:hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          PDF
                        </span>
                        <div>
                          <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{r.name}</h4>
                          <span className="text-[11px] text-slate-400 font-mono">{r.type} • {r.size}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`"${r.name}" yuklab olinmoqda...`)}
                        className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-semibold shadow-2xs"
                      >
                        Yuklab olish ⬇
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
