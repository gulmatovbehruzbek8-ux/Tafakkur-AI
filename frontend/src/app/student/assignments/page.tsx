'use client';

import Sidebar from "@/app/components/Sidebar";
import TafakkurCompanion from "@/app/components/TafakkurCompanion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface TaskItem {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  instructor: string;
  group: 'today' | 'this_week' | 'later';
  deadline: string;
  countdownSeconds?: number;
  status: 'pending' | 'submitted' | 'graded';
  score?: string;
  difficulty: 'Fundamental' | 'O\'rta' | 'Murakkab';
  attachmentsCount: number;
  instructions: string;
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: "3-Laboratoriya: AVL Binar Qidiruv Daraxtida Rotatsiya",
    course: "Ma'lumotlar tuzilmasi va algoritmlar",
    courseCode: "CS-201",
    instructor: "Prof. Olimjon Turdiyev",
    group: 'today',
    deadline: "Bugun, 23:59 (4 soat qoldi)",
    countdownSeconds: 14850,
    status: 'pending',
    difficulty: 'Murakkab',
    attachmentsCount: 2,
    instructions: "C++ yoki Python tilida AVL daraxti balanslash koeffitsienti (balance factor) -2 yoki +2 ga yetganda Left-Right va Right-Left rotatsiyalarini to'g'ri qayta tiklovchi dastur kodi va test natijalari hisobotini topshiring."
  },
  {
    id: 'task-2',
      title: "Matritsalar va Xos Qiymatlar Amaliy Hisoboti",
      course: "Oliy Matematika va Chiziqli Algebra",
      courseCode: "MATH-102",
      instructor: "Dots. Nigora Karimova",
      group: 'this_week',
      deadline: "Dushanba, 21-sentyabr, 18:00",
      status: 'pending',
      difficulty: 'O\'rta',
      attachmentsCount: 1,
      instructions: "Berilgan 3x3 o'lchamli 5 ta matritsaning xos qiymatlarini determinant usulida hisoblang va qadamlarni qog'ozda yoki LaTeX formatida yozing."
    },
    {
      id: 'task-3',
      title: "MNIST Ko'p Qatlamli Perseptron (MLP) Modeli",
      course: "Sun'iy Intellekt va Mashinali O'rganish",
      courseCode: "AI-204",
      instructor: "Dots. Nigora Karimova",
      group: 'this_week',
      deadline: "Chorshanba, 23-sentyabr, 23:59",
      status: 'pending',
      difficulty: 'Murakkab',
      attachmentsCount: 3,
      instructions: "PyTorch yordamida MNIST raqamlar bazasida kamida 97% aniqlikka erishuvchi neyron to'r arxitekturasini quring va yo'qotish funksiyasi (loss curve) grafigini ilova qiling."
    },
    {
      id: 'task-4',
      title: "Mikroservislar Arxitekturasi va REST API Loyihasi",
      course: "Dasturiy Ta'minot Arxitekturasi",
      courseCode: "SE-301",
      instructor: "Prof. Olimjon Turdiyev",
      group: 'later',
      deadline: "12-oktyabr, 23:59 (3 hafta qoldi)",
      status: 'pending',
      difficulty: 'O\'rta',
      attachmentsCount: 2,
      instructions: "FastAPI va Docker yordamida foydalanuvchilar autentifikatsiyasi va darslar jadvalini boshqaruvchi mini mikroservis tizimini yarating."
    },
    {
      id: 'task-5',
      title: "2-Laboratoriya: Bog'langan Ro'yxatlar va Stek",
      course: "Ma'lumotlar tuzilmasi va algoritmlar",
      courseCode: "CS-201",
      instructor: "Prof. Olimjon Turdiyev",
      group: 'this_week',
      deadline: "10-sentyabr (Topshirilgan)",
      status: 'graded',
      score: "92 / 100",
      difficulty: 'O\'rta',
      attachmentsCount: 1,
      instructions: "Bir bog'langan ro'yxat (Singly Linked List) asosida LIFO tamoyili bo'yicha stek yaratish."
    },
    {
      id: 'task-6',
      title: "1-Laboratoriya: Xotira Boshqaruvi va Pointerlar",
      course: "Ma'lumotlar tuzilmasi va algoritmlar",
      courseCode: "CS-201",
      instructor: "Prof. Olimjon Turdiyev",
      group: 'later',
      deadline: "28-avgust (Topshirilgan)",
      status: 'graded',
      score: "96 / 100",
      difficulty: 'Fundamental',
      attachmentsCount: 1,
      instructions: "Dinamik massivlar va C++ pointer aritmetikasi bo'yicha mustaqil laboratoriya ishi."
  }
];

export default function AssignmentsPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [countdown, setCountdown] = useState(14850);
  const [taskList, setTaskList] = useState<TaskItem[]>(INITIAL_TASKS);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const submitted = JSON.parse(localStorage.getItem('tafakkur_submitted_tasks') || '[]');
        if (Array.isArray(submitted) && submitted.length > 0) {
          setTaskList(prev => prev.map(t => submitted.includes(t.id) ? { ...t, status: 'submitted' } : t));
        }
      } catch {}
    }
  }, []);

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredTasks = taskList.filter(t => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const todayTasks = filteredTasks.filter(t => t.group === 'today');
  const thisWeekTasks = filteredTasks.filter(t => t.group === 'this_week');
  const laterTasks = filteredTasks.filter(t => t.group === 'later');

  const openSubmitDrawer = (task: TaskItem) => {
    setSelectedTask(task);
    setSubmitModalOpen(true);
    setSubmissionSuccess(false);
  };

  return (
    <div className="tf-page">
      <Sidebar role="student" activeRoute="/student/assignments" />
      <TafakkurCompanion currentContext="Akademik Topshiriqlar (Assignments)" />

      <main className="tf-main pb-20">
        <div className="tf-container space-y-8">

          {/* =========================================================================
              HEADER: LINEAR / THINGS 3 STYLE TASK HUB
              ========================================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 animate-fade-up">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Vazifalar Boshqaruvi
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Topshiriqlar & Laboratoriyalar
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Vaqt shkalasi va shoshilinchlik darajasiga ko'ra saralangan vazifalar maydoni
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: `Barchasi (${taskList.length})` },
                { id: 'pending', label: 'Topshirilishi kutilmoqda (4)' },
                { id: 'graded', label: 'Baholangan (2)' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    filterStatus === tab.id
                      ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* =========================================================================
              SMART GROUP 1: BUGUN (TODAY) — HIGH VISUAL URGENCY
              ========================================================================= */}
          {todayTasks.length > 0 && (
            <section className="space-y-3 animate-fade-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <h2 className="font-display font-bold text-base text-slate-900 dark:text-white uppercase tracking-wide">
                    Bugun (Today) — Shoshilinch Muddat
                  </h2>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 px-2.5 py-0.5 rounded-lg font-mono">
                  {todayTasks.length} ta vazifa
                </span>
              </div>

              <div className="space-y-3">
                {todayTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#121215] border-2 border-red-400/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-red-500"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold text-red-700 bg-red-100/80 dark:bg-red-950/60 dark:text-red-300 px-2 py-0.5 rounded-md">
                          {task.courseCode}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {task.course}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 animate-pulse">
                          <span>⏳ Qolgan vaqt:</span>
                          <span>{formatCountdown(countdown)}</span>
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        {task.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                        {task.instructions}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                        <span>👤 {task.instructor}</span>
                        <span>•</span>
                        <span>📎 {task.attachmentsCount} ta fayl biriktirilgan</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-600">Daraja: {task.difficulty}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                      <Link
                        href="/student/tutor"
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        AI dan so'rash
                      </Link>
                      <button
                        onClick={() => openSubmitDrawer(task)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <span>Topshirish</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =========================================================================
              SMART GROUP 2: SHU HAFTA (THIS WEEK)
              ========================================================================= */}
          {thisWeekTasks.length > 0 && (
            <section className="space-y-3 animate-fade-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h2 className="font-display font-bold text-base text-slate-900 dark:text-white uppercase tracking-wide">
                    Shu Hafta (This Week)
                  </h2>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {thisWeekTasks.length} ta topshiriq
                </span>
              </div>

              <div className="space-y-3">
                {thisWeekTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md">
                          {task.courseCode}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {task.course}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                          📅 {task.deadline}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                        {task.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                        {task.instructions}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                        <span>👤 {task.instructor}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{task.difficulty}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                      {task.status === 'graded' ? (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-display font-black text-sm font-mono border border-emerald-200 dark:border-emerald-800/60">
                            {task.score}
                          </span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">✓ Baholangan</span>
                        </div>
                      ) : (
                        <>
                          <Link
                            href="/student/tutor"
                            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                          >
                            AI konspekti
                          </Link>
                          <button
                            onClick={() => openSubmitDrawer(task)}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                          >
                            Topshirish →
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =========================================================================
              SMART GROUP 3: KEYINROQ (LATER) — CALM ELEGANT VIEW
              ========================================================================= */}
          {laterTasks.length > 0 && (
            <section className="space-y-3 animate-fade-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <h2 className="font-display font-bold text-base text-slate-600 uppercase tracking-wide">
                    Keyinroq (Later) — Semestr Rejasi
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {laterTasks.length} ta topshiriq
                </span>
              </div>

              <div className="space-y-2.5">
                {laterTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-4 rounded-2xl bg-white/70 border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white transition-all text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {task.courseCode}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm">{task.title}</h4>
                        <span className="text-slate-400 font-mono">({task.deadline})</span>
                      </div>
                      <p className="text-slate-500 truncate max-w-2xl">{task.instructions}</p>
                    </div>

                    <div className="shrink-0 self-end md:self-center">
                      {task.status === 'graded' ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold font-mono">
                          {task.score}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-medium">Rejalashtirilgan</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* =========================================================================
              SUBMISSION DRAWER / MODAL
              ========================================================================= */}
          {submitModalOpen && selectedTask && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#121215] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-scale-up">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                      {selectedTask.courseCode} • {selectedTask.course}
                    </span>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      Topshiriqni topshirish
                    </h3>
                  </div>
                  <button
                    onClick={() => setSubmitModalOpen(false)}
                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>

                {submissionSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                    <span className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xl mx-auto font-bold">
                      ✓
                    </span>
                    <h4 className="font-display font-bold text-base text-emerald-950 dark:text-emerald-200">
                      Topshiriq muvaffaqiyatli topshirildi!
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      {selectedTask.title} o'qituvchi ({selectedTask.instructor}) tekshiruviga yuborildi.
                    </p>
                    <button
                      onClick={() => setSubmitModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white text-xs font-bold"
                    >
                      Tushunarli
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-1">
                      <strong className="text-slate-800 dark:text-white block">{selectedTask.title}</strong>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedTask.instructions}</p>
                    </div>

                    <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-blue-500 dark:hover:border-blue-400 text-center cursor-pointer bg-slate-50 dark:bg-white/[0.02] transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center mx-auto mb-1.5 font-bold">
                        📁
                      </div>
                      <p className="font-bold text-slate-700 dark:text-slate-200">Fayllarni bu yerga tortib tashlang</p>
                      <p className="text-[11px] text-slate-400">PDF, C++, Python, ZIP arxivlar</p>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        GitHub / GitLab repository yoki izoh:
                      </label>
                      <input
                        type="text"
                        defaultValue="https://github.com/bunyodbek/avl-tree-implementation"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] focus:bg-white dark:focus:bg-[#18181b] focus:outline-none focus:border-blue-500 text-slate-800 dark:text-white text-xs"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSubmitModalOpen(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10"
                      >
                        Bekor qilish
                      </button>
                      <button
                        onClick={() => {
                          setSubmissionSuccess(true);
                          setTaskList(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'submitted' } : t));
                          if (typeof window !== 'undefined') {
                            const submitted = JSON.parse(localStorage.getItem('tafakkur_submitted_tasks') || '[]');
                            if (!submitted.includes(selectedTask.id)) {
                              localStorage.setItem('tafakkur_submitted_tasks', JSON.stringify([...submitted, selectedTask.id]));
                            }
                          }
                        }}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                      >
                        Tasdiqlab topshirish ✓
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
