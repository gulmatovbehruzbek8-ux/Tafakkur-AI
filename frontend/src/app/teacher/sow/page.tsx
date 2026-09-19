'use client';

import Sidebar from "@/app/components/Sidebar";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function TeacherSOWContent() {
  const searchParams = useSearchParams();
  const classId = searchParams?.get('class') || '1';
  
  const [selectedGroup, setSelectedGroup] = useState('AI-22');

  const groups = ['AI-22', 'AI-23', 'SE-21'];

  type Topic = {
    title: string;
    done?: boolean;
    current?: boolean;
    attendance?: string;
    task?: string;
  };

  type Module = {
    module: string;
    topics: Topic[];
  };

  const curriculum: Module[] = [
    {
      module: "1-Modul: Asosiy tushunchalar",
      topics: [
        { title: "Kirish va fan metodologiyasi", done: true, attendance: "24/25" },
        { title: "Algoritmlar nazariyasi va murakkablik", done: true, attendance: "25/25" },
      ]
    },
    {
      module: "2-Modul: Chiziqli ma'lumotlar tuzilmalari",
      topics: [
        { title: "Massivlar va dinamik ro'yxatlar", done: true, attendance: "23/25" },
        { title: "Stek va Navbat (Stack & Queue)", current: true, attendance: "25/25", task: "Uy vazifalarini baholash kutilmoqda (18 ta topshirildi)" },
      ]
    },
    {
      module: "3-Modul: Tarmoqlangan va daraxtsimon tuzilmalar",
      topics: [
        { title: "Binar qidiruv daraxtlari (BST)", done: false },
        { title: "Graflar va ularda qidiruv algoritmlari (BFS, DFS)", done: false },
      ]
    }
  ];

  return (
    <div className="tf-main">
      <div className="tf-container space-y-6">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pedagogik Reja</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">O'quv Rejasi Boshqaruvi (SOW)</h1>
            <p className="text-slate-500 text-sm mt-0.5">Siz o'qitayotgan fanlar va guruhlar bo'yicha semestr monitoringi</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">Guruh:</span>
            <select 
              value={selectedGroup} 
              onChange={e => setSelectedGroup(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 uppercase tracking-wider outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs cursor-pointer"
            >
              {groups.map(g => <option key={g} value={g}>{g} guruhi</option>)}
            </select>
          </div>
        </header>

        <div className="space-y-6">
          {curriculum.map((mod, idx) => (
            <div key={idx} className="tf-card-solid p-6 md:p-7 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">{mod.module}</h2>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{mod.topics.length} ta mavzu</span>
              </div>

              <div className="space-y-3">
                {mod.topics.map((topic, tIdx) => (
                  <div 
                    key={tIdx} 
                    className={`p-4 rounded-xl border transition-all ${
                      topic.current 
                        ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-500/20' 
                        : topic.done 
                          ? 'bg-slate-50/50 border-slate-200/70' 
                          : 'bg-white border-slate-200/60 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">#{tIdx + 1}</span>
                          <h3 className={`font-semibold text-sm ${topic.current ? 'text-slate-900 font-bold' : 'text-slate-800'}`}>
                            {topic.title}
                          </h3>
                        </div>
                        {topic.task && (
                          <p className="text-xs text-amber-900 font-medium mt-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            {topic.task}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        {topic.attendance && (
                          <span className="text-xs font-mono font-medium text-slate-600 bg-white border border-slate-200/80 px-2.5 py-1 rounded-md shadow-2xs">
                            Davomat: <strong className="text-slate-900">{topic.attendance}</strong>
                          </span>
                        )}
                        {topic.done && (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            ✓ O'tildi
                          </span>
                        )}
                        {topic.current && (
                          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                            ● Joriy mavzu
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default function TeacherSOWPage() {
  return (
    <div className="tf-page">
      <Sidebar role="teacher" activeRoute="/teacher/sow" />
      <Suspense fallback={<div className="p-12 text-center text-slate-400">Yuklanmoqda...</div>}>
        <TeacherSOWContent />
      </Suspense>
    </div>
  );
}
