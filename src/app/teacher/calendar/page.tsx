'use client';

import Sidebar from "@/app/components/Sidebar";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

interface TeacherClassEvent {
  id: number | string;
  date: number; // day of current month
  monthIndex: number;
  year: number;
  title: string;
  group: string;
  room: string;
  time: string;
  type: "Ma'ruza" | "Amaliyot" | "Laboratoriya" | "Seminar";
  color: string;
  attendance: string;
  totalStudents: number;
  presentCount: number;
  topic: string;
}

const MONTH_NAMES = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
];

const INITIAL_TEACHER_CLASSES: TeacherClassEvent[] = [
  { 
    id: 1, 
    date: 18, 
    monthIndex: 8, // September 
    year: 2026,
    title: "Algoritmlar nazariyasi", 
    group: "AI-22", 
    room: "A-204",
    time: "08:30 - 10:00",
    type: "Ma'ruza",
    color: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 dark:bg-blue-950/60 dark:border-blue-800/60 dark:text-blue-300 dark:hover:bg-blue-900/60",
    attendance: "24/25",
    totalStudents: 25,
    presentCount: 24,
    topic: "Binar qidiruv daraxtida AVL rotatsiyalari"
  },
  { 
    id: 2, 
    date: 18, 
    monthIndex: 8, 
    year: 2026,
    title: "Algoritmlar nazariyasi", 
    group: "AI-23", 
    room: "Lab-3",
    time: "10:15 - 11:45",
    type: "Laboratoriya",
    color: "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:border-emerald-800/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60",
    attendance: "25/25",
    totalStudents: 25,
    presentCount: 25,
    topic: "C++ da daraxtlarni muvozanatlash amaliyoti"
  },
  { 
    id: 3, 
    date: 21, 
    monthIndex: 8, 
    year: 2026,
    title: "Ma'lumotlar tuzilmasi", 
    group: "SE-21", 
    room: "B-108",
    time: "13:00 - 14:30",
    type: "Amaliyot",
    color: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 dark:bg-blue-950/60 dark:border-blue-800/60 dark:text-blue-300 dark:hover:bg-blue-900/60",
    attendance: "18/20",
    totalStudents: 20,
    presentCount: 18,
    topic: "Xesh jadvallar va to'qnashuvlar tahlili"
  },
  { 
    id: 4, 
    date: 23, 
    monthIndex: 8, 
    year: 2026,
    title: "Sun'iy intellekt asoslari", 
    group: "AI-22", 
    room: "A-204",
    time: "09:00 - 10:30",
    type: "Ma'ruza",
    color: "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:border-amber-800/60 dark:text-amber-300 dark:hover:bg-amber-900/60",
    attendance: "23/25",
    totalStudents: 25,
    presentCount: 23,
    topic: "Gradient tushishi va optimizatsiya usullari"
  },
  { 
    id: 5, 
    date: 25, 
    monthIndex: 8, 
    year: 2026,
    title: "Dasturlash asoslari", 
    group: "CS-11", 
    room: "C-302",
    time: "14:45 - 16:15",
    type: "Seminar",
    color: "bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100 dark:bg-rose-950/60 dark:border-rose-800/60 dark:text-rose-300 dark:hover:bg-rose-900/60",
    attendance: "28/30",
    totalStudents: 30,
    presentCount: 28,
    topic: "Oraliq nazorat sinov imtihoni"
  },
];

export default function TeacherCalendarPage() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // September
  const [currentYear, setCurrentYear] = useState(2026);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [classes, setClasses] = useState<TeacherClassEvent[]>(INITIAL_TEACHER_CLASSES);
  
  // Selected class detail modal
  const [selectedClass, setSelectedClass] = useState<TeacherClassEvent | null>(null);

  // Add Class Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    title: '',
    group: 'AI-24',
    room: 'A-204',
    time: '08:30 - 10:00',
    type: "Ma'ruza" as TeacherClassEvent['type'],
    date: 18,
    topic: '',
    totalStudents: 25,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tafakkur_teacher_schedule');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setClasses(parsed);
          }
        } catch {}
      }
    }
  }, []);

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  }, [currentYear, currentMonthIndex]);

  const startDayOffset = useMemo(() => {
    const day = new Date(currentYear, currentMonthIndex, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday start
  }, [currentYear, currentMonthIndex]);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonthIndex(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonthIndex(m => m + 1);
    }
  };

  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.title.trim()) return;

    const colors = {
      "Ma'ruza": "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
      "Amaliyot": "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
      "Laboratoriya": "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100",
      "Seminar": "bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100",
    };

    const created: TeacherClassEvent = {
      id: Date.now(),
      date: Number(newClass.date) || 18,
      monthIndex: currentMonthIndex,
      year: currentYear,
      title: newClass.title.trim(),
      group: newClass.group.trim(),
      room: newClass.room.trim() || "A-204",
      time: newClass.time || "08:30 - 10:00",
      type: newClass.type,
      color: colors[newClass.type] || "bg-blue-50 border-blue-200 text-blue-800",
      attendance: `${newClass.totalStudents}/${newClass.totalStudents}`,
      totalStudents: Number(newClass.totalStudents) || 25,
      presentCount: Number(newClass.totalStudents) || 25,
      topic: newClass.topic.trim() || "O'quv dasturi (SOW) bo'yicha mashg'ulot",
    };

    const updated = [created, ...classes];
    setClasses(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tafakkur_teacher_schedule', JSON.stringify(updated));
    }

    setIsAddModalOpen(false);
    showToast("Yangi dars jadvalga muvaffaqiyatli qo'shildi!");
  };

  const handleMarkAttendance = (delta: number) => {
    if (!selectedClass) return;
    const newPresent = Math.min(selectedClass.totalStudents, Math.max(0, selectedClass.presentCount + delta));
    const newAtt = `${newPresent}/${selectedClass.totalStudents}`;

    const updated = classes.map(c => c.id === selectedClass.id ? {
      ...c,
      presentCount: newPresent,
      attendance: newAtt
    } : c);

    setClasses(updated);
    setSelectedClass(prev => prev ? { ...prev, presentCount: newPresent, attendance: newAtt } : null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tafakkur_teacher_schedule', JSON.stringify(updated));
    }
  };

  const monthClasses = classes.filter(c => c.monthIndex === currentMonthIndex && c.year === currentYear);

  return (
    <div className="tf-page">
      <Sidebar role="teacher" activeRoute="/teacher/calendar" />
      
      <main className="tf-main pb-20">
        <div className="tf-container space-y-6">

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400/30 animate-bounce">
              <span className="text-lg">📅</span>
              <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
            </div>
          )}
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">O'qituvchi Jadvali</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">Darslar Taqvim va Jadvali</h1>
              <p className="text-slate-500 text-sm mt-0.5">O'qitilayotgan guruhlar, ma'ruzalar va talabalar davomati monitoringi</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm shadow-xs flex items-center gap-1.5"
              >
                <span>+ Dars Qo'shish</span>
              </button>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl text-xs">
                {(['month', 'week', 'day'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      viewMode === mode ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {mode === 'month' ? "Oylik" : mode === 'week' ? "Haftalik" : "Kunlik"}
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Calendar Card */}
          <div className="tf-card-solid p-6 md:p-8 space-y-6">
            
            {/* Navigation & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl font-bold text-ink tracking-tight">
                  {MONTH_NAMES[currentMonthIndex]} {currentYear}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                  {monthClasses.length} ta dars jadvalda
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  ‹ Oldingi oy
                </button>
                <button
                  onClick={() => {
                    setCurrentMonthIndex(8);
                    setCurrentYear(2026);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Bugun
                </button>
                <button
                  onClick={handleNextMonth}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Keyingi oy ›
                </button>
              </div>
            </div>

            {/* MONTH VIEW */}
            {viewMode === 'month' && (
              <div className="grid grid-cols-7 gap-2">
                {['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'].map(day => (
                  <div key={day} className="p-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
                
                {/* Empty start offset cells */}
                {Array.from({ length: startDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[110px] p-2 rounded-xl bg-slate-50/40 dark:bg-zinc-900/40 border border-transparent" />
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dailyClasses = monthClasses.filter(c => c.date === day);
                  const isToday = currentMonthIndex === 8 && day === 18;
                  
                  return (
                    <div 
                      key={day} 
                      className={`min-h-[110px] p-2 rounded-xl border transition-all ${
                        isToday 
                          ? 'bg-blue-50/40 dark:bg-blue-950/40 border-blue-500 shadow-xs' 
                          : 'bg-white dark:bg-[#18181b] border-slate-200/70 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50/40 dark:hover:bg-zinc-800/40'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-xs font-bold font-mono ${isToday ? 'text-blue-700 dark:text-blue-400 font-black' : 'text-slate-500 dark:text-slate-400'}`}>
                          {day}
                        </span>
                        {isToday && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-600 text-white">
                            Bugun
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {dailyClasses.map(c => (
                          <button 
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedClass(c)}
                            className={`w-full text-left p-2 rounded-lg text-xs font-medium border transition-all shadow-2xs ${c.color}`}
                          >
                            <div className="font-semibold truncate leading-tight">{c.title}</div>
                            <div className="text-[10px] opacity-80 mt-0.5 flex items-center justify-between font-mono">
                              <span>{c.group}</span>
                              <span>{c.room}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* WEEK VIEW */}
            {viewMode === 'week' && (
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {['Dushanba (14)', 'Seshanba (15)', 'Chorshanba (16)', 'Payshanba (17)', 'Juma (18)', 'Shanba (19)', 'Yakshanba (20)'].map((dayLabel, idx) => {
                  const dayNum = 14 + idx;
                  const dayClasses = monthClasses.filter(c => c.date === dayNum);
                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 space-y-3">
                      <div className="text-xs font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-zinc-800 pb-2">
                        {dayLabel}
                      </div>
                      {dayClasses.length === 0 ? (
                        <p className="text-[11px] text-slate-400">Dars yo'q</p>
                      ) : (
                        dayClasses.map(c => (
                          <button
                            key={c.id}
                            onClick={() => setSelectedClass(c)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs ${c.color} shadow-xs`}
                          >
                            <span className="font-bold block truncate">{c.title}</span>
                            <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono block mt-0.5">{c.time} • {c.group}</span>
                            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 block mt-1">Davomat: {c.attendance}</span>
                          </button>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* DAY VIEW */}
            {viewMode === 'day' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-blue-200 text-sm">
                    Bugun: 18-Sentyabr, 2026 (Juma) — O'qituvchining kunlik jadvali
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs font-mono">
                    2 ta faol mashg'ulot
                  </span>
                </div>

                <div className="space-y-3">
                  {monthClasses.filter(c => c.date === 18).map(c => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedClass(c)}
                      className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-zinc-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                            {c.type}
                          </span>
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-bold">{c.time}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-bold">{c.room}</span>
                        </div>
                        <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">{c.title}</h4>
                        <p className="text-xs text-slate-500">Mavzu: {c.topic}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase">Davomat ko'rsatkichi</span>
                          <span className="text-sm font-bold font-mono text-emerald-600">{c.attendance}</span>
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">
                          Tafsilot →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* =========================================================================
              MODAL: CLASS DETAILS & ATTENDANCE RECORDING
              ========================================================================= */}
          {selectedClass && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#121215] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-5 animate-scale-up">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-bold">
                      {selectedClass.group} • {selectedClass.type}
                    </span>
                    <h3 className="font-display font-bold text-slate-900 dark:text-white text-base sm:text-lg mt-1">
                      {selectedClass.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedClass(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-slate-300 flex items-center justify-center font-bold text-sm transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Dars vaqti va xona:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">{selectedClass.time} | {selectedClass.room}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Sana:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">{selectedClass.date}-{MONTH_NAMES[selectedClass.monthIndex]}, {selectedClass.year}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Mavzu:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedClass.topic}</strong>
                    </div>
                  </div>

                  {/* Interactive Attendance Counter */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">Darsdagi Talabalar Davomati:</span>
                      <span className="font-mono text-sm font-black text-blue-700 dark:text-blue-400">
                        {selectedClass.presentCount} / {selectedClass.totalStudents}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleMarkAttendance(-1)}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-blue-200 dark:border-zinc-700 text-blue-800 dark:text-blue-300 font-bold hover:bg-blue-100 dark:hover:bg-zinc-700 transition-colors"
                      >
                        - 1 Talaba
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(1)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                      >
                        + 1 Talaba
                      </button>
                      <span className="text-[11px] text-blue-800 dark:text-blue-300 ml-auto font-medium">
                        HEMIS ga avtomatik sinxronlanadi
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-2">
                  <Link
                    href={`/teacher/sow?class=${selectedClass.id}`}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 font-bold text-slate-700 dark:text-slate-200 text-xs transition-colors"
                  >
                    SOW Rejasini Ochish 📖
                  </Link>

                  <button
                    onClick={() => {
                      showToast("Davomat HEMIS ga muvaffaqiyatli saqlandi! ✓");
                      setSelectedClass(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    Saqlash va Yopish ✓
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODAL: ADD NEW CLASS TO SCHEDULE
              ========================================================================= */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#121215] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-5 animate-scale-up">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                      Yangi Dars Qo'shish
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      O'qituvchi jadvaliga yangi mashg'ulotni kiritish
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-slate-300 flex items-center justify-center font-bold text-sm transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddClassSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Fan Nomi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Algoritmlar nazariyasi"
                      value={newClass.title}
                      onChange={(e) => setNewClass(p => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Guruh (Group) *</label>
                      <input
                        type="text"
                        required
                        placeholder="AI-22"
                        value={newClass.group}
                        onChange={(e) => setNewClass(p => ({ ...p, group: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Dars Turi</label>
                      <select
                        value={newClass.type}
                        onChange={(e) => setNewClass(p => ({ ...p, type: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500"
                      >
                        <option value="Ma'ruza">Ma'ruza</option>
                        <option value="Amaliyot">Amaliyot</option>
                        <option value="Laboratoriya">Laboratoriya</option>
                        <option value="Seminar">Seminar</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Oyning Kuni *</label>
                      <input
                        type="number"
                        min={1}
                        max={31}
                        value={newClass.date}
                        onChange={(e) => setNewClass(p => ({ ...p, date: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Vaqti</label>
                      <input
                        type="text"
                        placeholder="08:30 - 10:00"
                        value={newClass.time}
                        onChange={(e) => setNewClass(p => ({ ...p, time: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Xona</label>
                      <input
                        type="text"
                        placeholder="A-204"
                        value={newClass.room}
                        onChange={(e) => setNewClass(p => ({ ...p, room: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Dars Mavzusi</label>
                    <input
                      type="text"
                      placeholder="Binar qidiruv daraxtlari..."
                      value={newClass.topic}
                      onChange={(e) => setNewClass(p => ({ ...p, topic: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 font-bold text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm"
                    >
                      Jadvalga Qo'shish ✓
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
