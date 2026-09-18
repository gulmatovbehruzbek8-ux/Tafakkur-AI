'use client';

import Sidebar from "@/app/components/Sidebar";
import TafakkurCompanion from "@/app/components/TafakkurCompanion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CalendarEvent {
  id: string;
  day: number;
  time: string;
  title: string;
  type: 'class' | 'assignment' | 'exam' | 'event';
  room?: string;
  instructor?: string;
  status?: string;
}

export default function BeautifulCalendarPage() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDay, setSelectedDay] = useState<number>(18); // Today: 18-sentyabr
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentMonth = "Sentyabr";
  const currentYear = 2026;
  const daysInMonth = 30;

  const events: CalendarEvent[] = [
    {
      id: 'e1',
      day: 18,
      time: "08:30 - 10:00",
      title: "Ma'lumotlar tuzilmasi: Binar daraxtlar",
      type: "class",
      room: "A-204 auditoriya",
      instructor: "Prof. Olimjon Turdiyev"
    },
    {
      id: 'e2',
      day: 18,
      time: "10:30 - 12:00",
      title: "BST Laboratoriyasi (Mustaqil amaliyot)",
      type: "class",
      room: "212-laboratoriya",
      instructor: "Prof. Olimjon Turdiyev"
    },
    {
      id: 'e3',
      day: 18,
      time: "23:59",
      title: "AVL Daraxti topshirig'i muddati",
      type: "assignment",
      instructor: "CS-201 Kafedrasi"
    },
    {
      id: 'e4',
      day: 18,
      time: "17:30 - 19:00",
      title: "Robototexnika & AI Klubi mashg'uloti",
      type: "event",
      room: "Talabalar Kovorkingi",
      instructor: "AI Jamoasi"
    },
    {
      id: 'e5',
      day: 21,
      time: "10:00 - 12:00",
      title: "Sun'iy Intellekt fanidan Oraliq Nazorat",
      type: "exam",
      room: "B-Bosh bino Katta Zal",
      instructor: "Dots. Nigora Karimova"
    },
    {
      id: 'e6',
      day: 23,
      time: "23:59",
      title: "MNIST Neftron to'r loyihasi topshirish",
      type: "assignment",
      instructor: "AI-204"
    },
    {
      id: 'e7',
      day: 25,
      time: "18:00",
      title: "Umummilliy AI Xakaton ro'yxatdan o'tish yopilishi",
      type: "event",
      room: "IT Park & UrDU",
      instructor: "Tashkiliy qo'mita"
    },
    {
      id: 'e8',
      day: 28,
      time: "09:00 - 17:00",
      title: "Dasturlash Olimpiadasi (ICPC Quyi bosqich)",
      type: "event",
      room: "Bosh kompyuter zali",
      instructor: "Olimpiada komissiyasi"
    }
  ];

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(e => e.type === selectedCategory);

  const selectedDayEvents = events.filter(e => e.day === selectedDay);

  const getEventBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'assignment':
        return 'bg-red-50 text-red-700 border-red-200 font-bold';
      case 'exam':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
      case 'event':
        return 'bg-violet-50 text-violet-800 border-violet-200';
    }
  };

  return (
    <div className="tf-page bg-[#f8fafc]">
      <Sidebar role="student" activeRoute="/student/calendar" />
      <TafakkurCompanion currentContext={`Akademik Taqvim: ${selectedDay}-sentyabr rejalari`} />

      <main className="tf-main pb-20">
        <div className="tf-container space-y-8">

          {/* =========================================================================
              HEADER: CALENDAR CONTROLS & VIEWS (MONTH, WEEK, DAY)
              ========================================================================= */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 animate-fade-up">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Universitet Taqvim Tizimi
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Akademik Taqvim & Voqealar
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Darslar, topshiriq muddatlari, oraliq imtihonlar va olimpiadalarning yaxlit xaritasi
              </p>
            </div>

            {/* View Mode Switcher + Month Controller */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Month / Week / Day tabs */}
              <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'month' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Oylik (Month)
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'week' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Haftalik (Week)
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'day' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kunlik (Day)
                </button>
              </div>

              {/* Month Navigator */}
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="font-display font-bold text-xs sm:text-sm text-slate-900">
                  {currentMonth} {currentYear}
                </span>
                <div className="flex items-center gap-0.5 ml-2">
                  <button className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-xs text-slate-600">
                    ‹
                  </button>
                  <button className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-xs text-slate-600">
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              CATEGORY FILTERS & LEGEND
              ========================================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Barcha Voqealar ({events.length})
              </button>
              <button
                onClick={() => setSelectedCategory('class')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'class'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Darslar</span>
              </button>
              <button
                onClick={() => setSelectedCategory('assignment')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'assignment'
                    ? 'bg-red-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Topshiriqlar</span>
              </button>
              <button
                onClick={() => setSelectedCategory('exam')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'exam'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Imtihonlar</span>
              </button>
              <button
                onClick={() => setSelectedCategory('event')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'event'
                    ? 'bg-violet-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                <span>Olimpiada & Xakaton</span>
              </button>
            </div>

            <span className="text-slate-400 font-medium">
              Sana ustiga bosib, kunlik kun tartibini oching
            </span>
          </div>

          {/* =========================================================================
              MAIN CALENDAR + INTERACTIVE "DAY VIEW" SPLIT
              ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up">

            {/* Left 2 Columns: The Big Interactive Calendar Grid */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                <span>Du</span>
                <span>Se</span>
                <span>Ch</span>
                <span>Pa</span>
                <span>Ju</span>
                <span>Sh</span>
                <span>Ya</span>
              </div>

              {/* Month Days Grid */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {/* 4 days offset for September 2026 (starts on Tuesday = 1 offset) */}
                <div className="min-h-[85px] sm:min-h-[105px] p-2 rounded-2xl bg-slate-50/40 border border-transparent" />

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayEvents = filteredEvents.filter(e => e.day === dayNum);
                  const isToday = dayNum === 18;
                  const isSelected = selectedDay === dayNum;

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedDay(dayNum)}
                      className={`min-h-[85px] sm:min-h-[105px] p-2 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                        isSelected
                          ? 'ring-2 ring-slate-900 border-slate-900 bg-slate-50/80 shadow-sm'
                          : isToday
                            ? 'bg-teal-50/50 border-teal-400/80 shadow-2xs'
                            : 'bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-bold font-mono ${
                          isToday
                            ? 'w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold'
                            : isSelected
                              ? 'text-slate-950 font-black'
                              : 'text-slate-600 group-hover:text-slate-900'
                        }`}>
                          {dayNum}
                        </span>

                        {isToday && (
                          <span className="text-[9px] font-bold text-teal-700 hidden sm:inline-block">
                            Bugun
                          </span>
                        )}
                      </div>

                      {/* Mini Event Dots or Pills */}
                      <div className="space-y-1 w-full mt-1">
                        {dayEvents.slice(0, 2).map((ev) => (
                          <div
                            key={ev.id}
                            className={`p-1 rounded-md text-[10px] truncate leading-tight border ${getEventBadge(ev.type)}`}
                          >
                            <span className="font-semibold">{ev.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-[9px] font-bold text-slate-400 block text-right">
                            +{dayEvents.length - 2} ta yana
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: "DAY VIEW" TIMELINE (Selected Day Details) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                    Kunlik Reja (Day View)
                  </span>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    {selectedDay}-Sentyabr, 2026
                  </h3>
                </div>
                {selectedDay === 18 && (
                  <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                    Bugungi kun
                  </span>
                )}
              </div>

              {selectedDayEvents.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                  <span className="text-3xl">☕</span>
                  <p className="font-semibold text-xs text-slate-600">Ushbu kunda rasmiy mashg'ulotlar belgilanmagan</p>
                  <p className="text-[11px]">Mustaqil ta'lim va o'z ustida ishlash uchun qulay vaqt</p>
                </div>
              ) : (
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {selectedDayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${getEventBadge(ev.type)}`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono font-bold">{ev.time}</span>
                        <span className="uppercase tracking-wider text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-white/70">
                          {ev.type === 'class' ? 'Dars' : ev.type === 'assignment' ? 'Topshiriq' : ev.type === 'exam' ? 'Imtihon' : 'Tadbir'}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-sm text-slate-900 leading-snug">
                        {ev.title}
                      </h4>

                      <div className="space-y-0.5 text-[11px] opacity-85">
                        {ev.room && <div>📍 Xona: {ev.room}</div>}
                        {ev.instructor && <div>👤 {ev.instructor}</div>}
                      </div>

                      {ev.type === 'assignment' ? (
                        <div className="pt-2 border-t border-red-200/60 flex justify-end">
                          <Link
                            href="/student/assignments"
                            className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px]"
                          >
                            Topshirishga o'tish →
                          </Link>
                        </div>
                      ) : ev.type === 'exam' ? (
                        <div className="pt-2 border-t border-amber-200/60 flex justify-end">
                          <Link
                            href="/student/tutor"
                            className="px-3 py-1 rounded-lg bg-amber-700 text-white font-bold text-[11px]"
                          >
                            AI bilan tayyorlanish →
                          </Link>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-slate-200/60 flex justify-end">
                          <Link
                            href="/student/courses"
                            className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold text-[11px]"
                          >
                            Dars materiallari →
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Quick Contextual Helper */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Savol bormi?</span>
                <Link
                  href="/student/tutor"
                  className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1"
                >
                  <span>AI dan dars haqida so'rash</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
