'use client';

import Sidebar from "@/app/components/Sidebar";
import TafakkurCompanion from "@/app/components/TafakkurCompanion";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

interface AdminClass {
  id: number;
  name: string;
  group: string;
  teacher: string;
  progress: number;
  attendance: string;
  status: "A'lo" | "Yaxshi" | "Diqqat talab";
  faculty?: string;
  room?: string;
  recentTopic?: string;
}

const DEFAULT_CLASSES: AdminClass[] = [
  { 
    id: 1, 
    name: "Algoritmlar nazariyasi (Ma'ruza)", 
    group: "AI-22", 
    teacher: "Prof. Olimjon Turdiyev", 
    progress: 85, 
    attendance: "24/25", 
    status: "Yaxshi",
    faculty: "Sun'iy intellekt",
    room: "A-204",
    recentTopic: "AVL Daraxtlar va Balanslash rotatsiyalari"
  },
  { 
    id: 2, 
    name: "Ma'lumotlar tuzilmasi", 
    group: "SE-21", 
    teacher: "Dots. Anvar Qosimov", 
    progress: 60, 
    attendance: "18/20", 
    status: "Diqqat talab",
    faculty: "Dasturiy injiniring",
    room: "B-108",
    recentTopic: "Bog'langan ro'yxatlar va steklar"
  },
  { 
    id: 3, 
    name: "Sun'iy intellekt asoslari", 
    group: "AI-23", 
    teacher: "Dots. Nigora Karimova", 
    progress: 92, 
    attendance: "25/25", 
    status: "A'lo",
    faculty: "Sun'iy intellekt",
    room: "Lab-3",
    recentTopic: "Ko'p qatlamli perseptron (MLP) va Backprop"
  },
  { 
    id: 4, 
    name: "Dasturlash asoslari", 
    group: "CS-11", 
    teacher: "Katta o'q. Mansur Aliyev", 
    progress: 45, 
    attendance: "28/30", 
    status: "Yaxshi",
    faculty: "Kompyuter ilmlari",
    room: "C-302",
    recentTopic: "C++ ko'rsatkichlari va dinamik xotira"
  },
];

export default function PrincipalDashboard() {
  const [classes, setClasses] = useState<AdminClass[]>(DEFAULT_CLASSES);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<AdminClass | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("2 daqiqa oldin");
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Add Class Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    group: 'AI-24',
    teacher: '',
    progress: 50,
    attendance: '25/25',
    status: "Yaxshi" as AdminClass['status'],
    faculty: "Sun'iy Intellekt va Axborot Texnologiyalari",
    room: 'A-101',
    recentTopic: 'Kirish ma\'ruzasi',
  });

  // Load custom classes and user stats from localStorage
  const [totalStudentsCount, setTotalStudentsCount] = useState(1420);
  const [totalTeachersCount, setTotalTeachersCount] = useState(84);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Classes
      const savedClasses = localStorage.getItem('tafakkur_admin_classes');
      if (savedClasses) {
        try {
          const parsed = JSON.parse(savedClasses);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setClasses(parsed);
          }
        } catch {}
      }

      // 2. Derive dynamic user counts
      try {
        const customUsers = JSON.parse(localStorage.getItem('tafakkur_custom_users') || '[]');
        if (customUsers.length > 0) {
          const addedStudents = customUsers.filter((u: any) => u.role === 'student' || u.role === 'oquvchi').length;
          const addedTeachers = customUsers.filter((u: any) => u.role === 'teacher' || u.role === 'mentor').length;
          setTotalStudentsCount(1420 + addedStudents);
          setTotalTeachersCount(84 + addedTeachers);
        }
      } catch {}
    }
  }, []);

  const handleHemisSync = () => {
    setIsSyncing(true);
    setSyncToast("UrDU HEMIS shlyuziga so'rov yuborilmoqda...");
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime("Hozirgina");
      setSyncToast("✅ HEMIS bilan to'liq sinxronlandi! (Barcha fakultetlar va o'zlashtirish jurnali yangilandi)");
      setTimeout(() => setSyncToast(null), 3500);
    }, 1000);
  };

  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name.trim() || !newClass.teacher.trim()) return;

    const created: AdminClass = {
      id: Date.now(),
      name: newClass.name.trim(),
      group: newClass.group.trim(),
      teacher: newClass.teacher.trim(),
      progress: Number(newClass.progress) || 50,
      attendance: newClass.attendance.trim() || "24/25",
      status: newClass.status,
      faculty: newClass.faculty,
      room: newClass.room,
      recentTopic: newClass.recentTopic || "Reja bo'yicha 1-mavzu",
    };

    const updated = [created, ...classes];
    setClasses(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tafakkur_admin_classes', JSON.stringify(updated));
    }

    setIsAddModalOpen(false);
    setNewClass({
      name: '',
      group: 'AI-24',
      teacher: '',
      progress: 50,
      attendance: '25/25',
      status: "Yaxshi",
      faculty: "Sun'iy Intellekt va Axborot Texnologiyalari",
      room: 'A-101',
      recentTopic: 'Kirish ma\'ruzasi',
    });
    setSyncToast("Yangi dars va guruh muvaffaqiyatli biriktirildi!");
    setTimeout(() => setSyncToast(null), 3000);
  };

  const filteredClasses = useMemo(() => {
    return classes.filter(cls => {
      const matchesStatus = filterStatus === 'all' ? true : cls.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesStatus;
      return matchesStatus && (
        cls.name.toLowerCase().includes(q) ||
        cls.group.toLowerCase().includes(q) ||
        cls.teacher.toLowerCase().includes(q)
      );
    });
  }, [classes, filterStatus, searchQuery]);

  // Dynamic unique groups count
  const uniqueGroupsCount = useMemo(() => {
    const set = new Set(classes.map(c => c.group));
    return Math.max(56, set.size);
  }, [classes]);

  const globalMetrics = [
    { label: "Jami Talabalar", value: totalStudentsCount.toLocaleString(), change: "+12% o'sish" },
    { label: "O'qituvchilar", value: totalTeachersCount.toString(), change: "To'liq shtat" },
    { label: "Faol Guruhlar", value: uniqueGroupsCount.toString(), change: "4 ta fakultet" },
    { label: "O'rtacha Davomat", value: "92.4%", change: "Barqaror" },
    { label: "Universitet GPA", value: "4.12", change: "+0.15 ball" }
  ];

  return (
    <div className="tf-page">
      <Sidebar role="admin" activeRoute="/admin" />
      <TafakkurCompanion currentContext="Rektorat Boshqaruv Markazi" />
      
      <main className="tf-main pb-20">
        <div className="tf-container-wide space-y-6">

          {/* Sync Toast */}
          {syncToast && (
            <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400/30 animate-bounce">
              <span className="text-lg">⚡</span>
              <span className="text-xs sm:text-sm font-bold">{syncToast}</span>
            </div>
          )}
          
          {/* Header */}
          <header className="tf-header animate-fade-up">
            <div>
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                <button
                  onClick={handleHemisSync}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full bg-emerald-500 ${isSyncing ? 'animate-spin' : 'animate-pulse'}`} />
                  <span>HEMIS SYNC ● {lastSyncTime}</span>
                </button>
                <span className="text-xs text-slate-400 font-mono">Urganch Davlat Universiteti</span>
              </div>
              <h1 className="tf-title">Universitet Ekotizimi Salomatligi</h1>
              <p className="tf-subtitle">Barcha fakultetlar, talabalar faolligi, professorlar yuki va akademik tendensiyalar</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm shadow-teal-600/20 flex items-center gap-2"
              >
                <span>+ Guruh & Dars Biriktirish</span>
              </button>
              <span className="tf-badge tf-badge-success">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Barcha Tizimlar Barqaror
              </span>
            </div>
          </header>

          {/* Global Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-up delay-1">
            {globalMetrics.map((metric) => (
              <div key={metric.label} className="tf-metric">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                <div className="mt-3">
                  <span className="text-2xl md:text-3xl font-bold text-ink font-mono tracking-tight">{metric.value}</span>
                  <p className="text-[11px] font-semibold text-blue-700 mt-1">{metric.change}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SOW & Groups Table Block */}
          <div className="tf-card-solid overflow-hidden animate-fade-up delay-2">
            
            {/* Table Controls Header */}
            <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-base font-bold text-ink tracking-tight">Guruhlar va Dars O&apos;zlashtirish (SOW)</h2>
                <p className="text-xs text-slate-400 mt-0.5">Semestr rejasi va darslarga qatnashish tahlili ({filteredClasses.length} ta dars)</p>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Fan, guruh yoki o'qituvchi qidirish..."
                  className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white w-48 sm:w-60 transition-all"
                />

                {/* Status Segmented Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  {[
                    { id: 'all', label: "Barchasi" },
                    { id: "A'lo", label: "A'lo" },
                    { id: "Yaxshi", label: "Yaxshi" },
                    { id: "Diqqat talab", label: "Diqqat talab" },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterStatus(tab.id)}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        filterStatus === tab.id
                          ? 'bg-white text-slate-900 font-bold shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <Link href="/admin/users" className="text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors">
                  Foydalanuvchilar →
                </Link>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse tf-table">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="p-4 pl-6">Fan va Guruh</th>
                    <th className="p-4">Biriktirilgan O&apos;qituvchi</th>
                    <th className="p-4">Davomat</th>
                    <th className="p-4">SOW O&apos;zlashtirish</th>
                    <th className="p-4 pr-6 text-right">Holat & Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredClasses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-xs text-slate-400">
                        Hech qanday dars yoki guruh topilmadi. Qidiruv so'zini o'zgartiring yoki yangi guruh qo'shing.
                      </td>
                    </tr>
                  ) : (
                    filteredClasses.map(cls => (
                      <tr 
                        key={cls.id} 
                        onClick={() => setSelectedClass(cls)}
                        className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                      >
                        <td className="p-4 pl-6">
                          <div className="font-semibold text-ink flex items-center gap-2">
                            <span>{cls.name}</span>
                            {cls.room && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
                                {cls.room}
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono font-medium text-blue-700 mt-0.5">{cls.group} guruhi</div>
                        </td>
                        <td className="p-4 text-slate-700 font-medium">{cls.teacher}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200/60 font-mono text-xs font-semibold text-slate-700">
                            {cls.attendance}
                          </span>
                        </td>
                        <td className="p-4 w-1/3">
                          <div className="flex items-center gap-3">
                            <div className="tf-progress flex-1">
                              <span 
                                style={{ 
                                  width: `${cls.progress}%`, 
                                  background: cls.progress >= 85 ? 'linear-gradient(90deg,#059669,#10b981)' : cls.progress >= 60 ? 'linear-gradient(90deg,#0f766e,#14b8a6)' : 'linear-gradient(90deg,#e11d48,#fb7185)' 
                                }} 
                              />
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-700 w-10 text-right">{cls.progress}%</span>
                          </div>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className={`tf-badge ${
                              cls.status === "A'lo" ? 'tf-badge-success' :
                              cls.status === 'Diqqat talab' ? 'tf-badge-danger' :
                              'tf-badge-teal'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                cls.status === "A'lo" ? 'bg-emerald-500' :
                                cls.status === 'Diqqat talab' ? 'bg-rose-500' : 'bg-blue-500'
                              }`} />
                              {cls.status}
                            </span>
                            <span className="text-slate-400 hover:text-blue-600 text-xs">
                              🔍
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* =========================================================================
              MODAL: ADD NEW CLASS / GROUP BINDING
              ========================================================================= */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#121215] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-5 animate-scale-up">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                      Yangi Fan va Guruhni Biriktirish
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      O'quv rejasiga muvofiq yangi dars yuklamasini kiritish
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
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Fan Nomi (Course Name) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Kiberxavfsizlik asoslari"
                      value={newClass.name}
                      onChange={(e) => setNewClass(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Guruh (Group) *</label>
                      <input
                        type="text"
                        required
                        placeholder="AI-24"
                        value={newClass.group}
                        onChange={(e) => setNewClass(p => ({ ...p, group: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mas'ul O'qituvchi *</label>
                      <input
                        type="text"
                        required
                        placeholder="Prof. Olimjon"
                        value={newClass.teacher}
                        onChange={(e) => setNewClass(p => ({ ...p, teacher: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Auditoriya / Xona</label>
                      <input
                        type="text"
                        placeholder="A-204"
                        value={newClass.room}
                        onChange={(e) => setNewClass(p => ({ ...p, room: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Holat</label>
                      <select
                        value={newClass.status}
                        onChange={(e) => setNewClass(p => ({ ...p, status: e.target.value as any }))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500"
                      >
                        <option value="A'lo">A'lo</option>
                        <option value="Yaxshi">Yaxshi</option>
                        <option value="Diqqat talab">Diqqat talab</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">SOW O'zlashtirish (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={newClass.progress}
                        onChange={(e) => setNewClass(p => ({ ...p, progress: Number(e.target.value) }))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Davomat (e.g. 24/25)</label>
                      <input
                        type="text"
                        value={newClass.attendance}
                        onChange={(e) => setNewClass(p => ({ ...p, attendance: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
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
                      Jadvalga Saqlash ✓
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODAL: CLASS DETAIL INSPECTION
              ========================================================================= */}
          {selectedClass && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#121215] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-5 animate-scale-up">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-bold">
                      {selectedClass.group} GURUHI
                    </span>
                    <h3 className="font-display font-bold text-slate-900 dark:text-white text-base sm:text-lg mt-1">
                      {selectedClass.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedClass(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-slate-300 flex items-center justify-center font-bold text-sm transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Biriktirilgan Professor:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{selectedClass.teacher}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Auditoriya:</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{selectedClass.room || "A-204"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Davomat ko'rsatkichi:</span>
                      <span className="font-mono font-bold text-blue-700 dark:text-blue-400">{selectedClass.attendance}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">O'zlashtirish darajasi:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{selectedClass.progress}% ({selectedClass.status})</strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/60 space-y-1">
                    <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider block">
                      Oxirgi o'tilgan SOW mavzusi:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      {selectedClass.recentTopic || "Mavzular taqvimi to'liq tasdiqlangan"}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/sow?subject=${selectedClass.name}`}
                    className="px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-bold transition-colors"
                  >
                    SOW Rejasini Ochish
                  </Link>
                  <button
                    onClick={() => setSelectedClass(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-zinc-800 text-white font-bold hover:bg-slate-800 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
