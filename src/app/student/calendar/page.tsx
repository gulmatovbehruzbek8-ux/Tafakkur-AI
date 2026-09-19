'use client';

import Sidebar from "@/app/components/Sidebar";
import TafakkurCompanion from "@/app/components/TafakkurCompanion";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

export interface CalendarEvent {
  id: string;
  year: number;
  month: number; // 0-indexed: 0 = Yanvar, 8 = Sentyabr
  day: number;
  time: string;
  title: string;
  type: 'class' | 'assignment' | 'exam' | 'event';
  room?: string;
  instructor?: string;
  description?: string;
  completed?: boolean;
}

const MONTH_NAMES = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
];

const WEEK_DAYS = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"];

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    year: 2026,
    month: 8, // Sentyabr
    day: 18,
    time: "08:30 - 10:00",
    title: "Ma'lumotlar tuzilmasi: Binar daraxtlar",
    type: "class",
    room: "A-204 auditoriya",
    instructor: "Prof. Olimjon Turdiyev",
    description: "BST daraxtlarida qidiruv va kiritish amallari. Ma'ruza va amaliy tushunchalar."
  },
  {
    id: 'e2',
    year: 2026,
    month: 8,
    day: 18,
    time: "10:30 - 12:00",
    title: "BST Laboratoriyasi (Mustaqil amaliyot)",
    type: "class",
    room: "212-laboratoriya",
    instructor: "Prof. Olimjon Turdiyev",
    description: "C++ va Python tillarida binar qidiruv daraxtini realizatsiya qilish."
  },
  {
    id: 'e3',
    year: 2026,
    month: 8,
    day: 18,
    time: "23:59",
    title: "AVL Daraxti topshirig'i muddati",
    type: "assignment",
    instructor: "CS-201 Kafedrasi",
    description: "Balanslangan AVL daraxti bo'yicha 2-amaliy vazifani LMS tizimiga yuklash."
  },
  {
    id: 'e4',
    year: 2026,
    month: 8,
    day: 18,
    time: "17:30 - 19:00",
    title: "Robototexnika & AI Klubi mashg'uloti",
    type: "event",
    room: "Talabalar Kovorkingi",
    instructor: "AI Jamoasi",
    description: "Avtonom robotlar va Computer Vision modellari bo'yicha amaliy workshop."
  },
  {
    id: 'e5',
    year: 2026,
    month: 8,
    day: 21,
    time: "10:00 - 12:00",
    title: "Sun'iy Intellekt fanidan Oraliq Nazorat",
    type: "exam",
    room: "B-Bosh bino Katta Zal",
    instructor: "Dots. Nigora Karimova",
    description: "1- va 2-modullar bo'yicha 30 ballik yozma va test oraliq nazorat imtihoni."
  },
  {
    id: 'e6',
    year: 2026,
    month: 8,
    day: 23,
    time: "23:59",
    title: "MNIST Neyron to'r loyihasi topshirish",
    type: "assignment",
    instructor: "AI-204",
    description: "PyTorch yordamida qurilgan MLP modelining kodi va hisoboti."
  },
  {
    id: 'e7',
    year: 2026,
    month: 8,
    day: 25,
    time: "18:00",
    title: "Umummilliy AI Xakaton ro'yxatdan o'tish yopilishi",
    type: "event",
    room: "IT Park & UrDU",
    instructor: "Tashkiliy qo'mita",
    description: "Ta'lim yo'nalishidagi AI loyihalar tanlovi uchun arizalar qabuli tugaydi."
  },
  {
    id: 'e8',
    year: 2026,
    month: 8,
    day: 28,
    time: "09:00 - 17:00",
    title: "Dasturlash Olimpiadasi (ICPC Quyi bosqich)",
    type: "event",
    room: "Bosh kompyuter zali",
    instructor: "Olimpiada komissiyasi",
    description: "Universitet bosqichidagi algoritmik dasturlash musobaqasi."
  },
  {
    id: 'e9',
    year: 2026,
    month: 9, // Oktyabr
    day: 5,
    time: "14:00 - 16:00",
    title: "Kiberxavfsizlik ochiq seminari",
    type: "event",
    room: "Axborot Texnologiyalari Zali",
    instructor: "Taklif etilgan mutaxassis"
  },
  {
    id: 'e10',
    year: 2026,
    month: 9, // Oktyabr
    day: 15,
    time: "23:59",
    title: "Algoritmlar loyihasi 2-bosqich topshirish",
    type: "assignment",
    instructor: "CS-201"
  }
];

export default function BeautifulCalendarPage() {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  
  // Current active date in navigation
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(8); // Sentyabr (0-indexed: 8)
  const [selectedDay, setSelectedDay] = useState<number>(18);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Events state
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  
  // Modals state
  const [selectedEventModal, setSelectedEventModal] = useState<CalendarEvent | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  
  // New event form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CalendarEvent['type']>('event');
  const [newDay, setNewDay] = useState(18);
  const [newTime, setNewTime] = useState('14:00 - 15:30');
  const [newRoom, setNewRoom] = useState('');
  const [newInstructor, setNewInstructor] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const user = localStorage.getItem('tafakkur_user');
      setIsLoggedIn(!!user);
      const saved = localStorage.getItem('tafakkur_calendar_events');
      if (saved) {
        setEvents(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveEvents = (updated: CalendarEvent[]) => {
    setEvents(updated);
    try {
      localStorage.setItem('tafakkur_calendar_events', JSON.stringify(updated));
    } catch {}
  };

  // Month navigation: previous and next
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonthIndex(prev => prev - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonthIndex(prev => prev + 1);
    }
    setSelectedDay(1);
  };

  // Days calculations
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  }, [currentYear, currentMonthIndex]);

  // First day of month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  // Convert so Monday = 0, Sunday = 6
  const startDayOffset = useMemo(() => {
    const rawDay = new Date(currentYear, currentMonthIndex, 1).getDay();
    return rawDay === 0 ? 6 : rawDay - 1;
  }, [currentYear, currentMonthIndex]);

  // Filter events for active month & year
  const monthEvents = useMemo(() => {
    return events.filter(e => e.year === currentYear && e.month === currentMonthIndex);
  }, [events, currentYear, currentMonthIndex]);

  // Filtered by category
  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'all') return monthEvents;
    return monthEvents.filter(e => e.type === selectedCategory);
  }, [monthEvents, selectedCategory]);

  // Selected Day's events
  const selectedDayEvents = useMemo(() => {
    return monthEvents.filter(e => e.day === selectedDay);
  }, [monthEvents, selectedDay]);

  // Toggle event completion
  const handleToggleComplete = (eventId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = events.map(ev => {
      if (ev.id === eventId) {
        return { ...ev, completed: !ev.completed };
      }
      return ev;
    });
    saveEvents(updated);
    if (selectedEventModal && selectedEventModal.id === eventId) {
      setSelectedEventModal(prev => prev ? { ...prev, completed: !prev.completed } : null);
    }
  };

  // Add new event
  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: `custom-ev-${Date.now()}`,
      year: currentYear,
      month: currentMonthIndex,
      day: Number(newDay),
      time: newTime.trim() || "10:00 - 11:30",
      title: newTitle.trim(),
      type: newType,
      room: newRoom.trim(),
      instructor: newInstructor.trim(),
      description: newDescription.trim()
    };

    const updated = [...events, newEv];
    saveEvents(updated);
    setSelectedDay(Number(newDay));
    setIsAddEventOpen(false);

    // Reset form
    setNewTitle('');
    setNewRoom('');
    setNewInstructor('');
    setNewDescription('');
  };

  const getEventBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'assignment':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case 'exam':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
      case 'event':
        return 'bg-purple-50 text-purple-800 border-purple-200';
    }
  };

  // Weekly view calculations (7 days around selectedDay)
  const weekDays = useMemo(() => {
    // Find Monday of the current week containing selectedDay
    const dateObj = new Date(currentYear, currentMonthIndex, selectedDay);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentYear, currentMonthIndex, selectedDay + distanceToMonday + i);
      days.push({
        dateObj: d,
        dayNum: d.getDate(),
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        dayName: WEEK_DAYS[i],
        events: events.filter(e => 
          e.year === d.getFullYear() && 
          e.month === d.getMonth() && 
          e.day === d.getDate()
        )
      });
    }
    return days;
  }, [currentYear, currentMonthIndex, selectedDay, events]);

  const isCurrentRealToday = (dayNum: number) => {
    return currentYear === 2026 && currentMonthIndex === 8 && dayNum === 18;
  };

  return (
    <div className="tf-page bg-[#f8fafc]">
      <Sidebar role="student" activeRoute="/student/calendar" />
      <TafakkurCompanion currentContext={`Akademik Taqvim: ${selectedDay}-${MONTH_NAMES[currentMonthIndex].toLowerCase()} rejalari`} />

      <main className="tf-main pb-20">
        <div className="tf-container space-y-6">

          {!isLoggedIn && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-base">🔒</span>
                <span>
                  <strong>Mehmon ko&apos;rinishi:</strong> Universitet dars jadvali va muddatlarini to&apos;liq tahrirlash uchun tizimga kiring.
                </span>
              </div>
              <Link 
                href="/login?redirect=/student/calendar" 
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shrink-0 text-center shadow-xs"
              >
                Tizimga Kirish →
              </Link>
            </div>
          )}

          {/* =========================================================================
              1. HEADER: CONTROLS & MONTH NAVIGATOR
              ========================================================================= */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 animate-fade-up">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Universitet Taqvim Tizimi
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Akademik Taqvim & Vazifalar
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Darslar, topshiriq muddatlari, imtihonlar va olimpiadalarning interaktiv jadvali
              </p>
            </div>

            {/* View Mode Switcher + Month Controller + Add Event Button */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* View Switcher */}
              <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'month' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Oylik (Month)
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'week' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Haftalik (Week)
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === 'day' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kunlik (Day)
                </button>
              </div>

              {/* Month Navigator with functional Prev/Next Buttons */}
              <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="font-display font-bold text-xs sm:text-sm text-slate-900 min-w-[125px] text-center select-none">
                  {MONTH_NAMES[currentMonthIndex]} {currentYear}
                </span>
                <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                  <button 
                    type="button"
                    onClick={handlePrevMonth}
                    title="Oldingi oy"
                    className="w-7 h-7 rounded-lg hover:bg-slate-100 active:scale-95 flex items-center justify-center text-sm font-bold text-slate-700 transition-all"
                  >
                    ‹
                  </button>
                  <button 
                    type="button"
                    onClick={handleNextMonth}
                    title="Keyingi oy"
                    className="w-7 h-7 rounded-lg hover:bg-slate-100 active:scale-95 flex items-center justify-center text-sm font-bold text-slate-700 transition-all"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Add Event Button */}
              <button
                type="button"
                onClick={() => {
                  setNewDay(selectedDay);
                  setIsAddEventOpen(true);
                }}
                className="tf-btn tf-btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-xs hover:shadow-md"
              >
                <span>+</span>
                <span>Voqea qo&apos;shish</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              2. CATEGORY FILTERS
              ========================================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Barcha Voqealar ({monthEvents.length})
              </button>
              <button
                type="button"
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
                type="button"
                onClick={() => setSelectedCategory('assignment')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'assignment'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Topshiriqlar</span>
              </button>
              <button
                type="button"
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
                type="button"
                onClick={() => setSelectedCategory('event')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'event'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Olimpiada & Tadbirlar</span>
              </button>
            </div>

            <span className="text-slate-400 font-medium">
              Vazifa ustiga bosib, tafsilotlarini ko&apos;ring va bajaring
            </span>
          </div>

          {/* =========================================================================
              3. VIEW MODES: MONTH, WEEK, DAY
              ========================================================================= */}
          {viewMode === 'month' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up">
              {/* Month Grid */}
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

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {/* Offset for first day */}
                  {Array.from({ length: startDayOffset }).map((_, idx) => (
                    <div key={`offset-${idx}`} className="min-h-[85px] sm:min-h-[105px] p-2 rounded-2xl bg-slate-50/40 border border-transparent opacity-30" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dayEvs = filteredEvents.filter(e => e.day === dayNum);
                    const isToday = isCurrentRealToday(dayNum);
                    const isSelected = selectedDay === dayNum;

                    return (
                      <div
                        key={`day-${dayNum}`}
                        onClick={() => setSelectedDay(dayNum)}
                        className={`min-h-[85px] sm:min-h-[105px] p-2 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer group ${
                          isSelected
                            ? 'ring-2 ring-slate-900 border-slate-900 bg-slate-50/80 shadow-sm'
                            : isToday
                              ? 'bg-blue-50/50 border-blue-400 shadow-2xs'
                              : 'bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-xs font-bold font-mono ${
                            isToday
                              ? 'w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold'
                              : isSelected
                                ? 'text-slate-950 font-black'
                                : 'text-slate-600 group-hover:text-slate-900'
                          }`}>
                            {dayNum}
                          </span>

                          {isToday && (
                            <span className="text-[9px] font-bold text-blue-700 hidden sm:inline-block">
                              Bugun
                            </span>
                          )}
                        </div>

                        {/* Event Pills inside Day Cell */}
                        <div className="space-y-1 w-full mt-1">
                          {dayEvs.slice(0, 2).map((ev) => (
                            <div
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEventModal(ev);
                              }}
                              className={`p-1 rounded-md text-[10px] truncate leading-tight border transition-transform hover:scale-102 flex items-center justify-between gap-1 ${getEventBadge(ev.type)} ${
                                ev.completed ? 'line-through opacity-50' : ''
                              }`}
                            >
                              <span className="truncate font-semibold">{ev.title}</span>
                              {ev.completed && <span className="text-[9px] font-bold text-emerald-600 shrink-0">✓</span>}
                            </div>
                          ))}
                          {dayEvs.length > 2 && (
                            <span className="text-[9px] font-bold text-slate-400 block text-right">
                              +{dayEvs.length - 2} ta yana
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Day Timeline */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                      Kunlik Reja (Day View)
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-900">
                      {selectedDay}-{MONTH_NAMES[currentMonthIndex]}, {currentYear}
                    </h3>
                  </div>
                  {isCurrentRealToday(selectedDay) && (
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                      Bugungi kun
                    </span>
                  )}
                </div>

                {selectedDayEvents.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                    <span className="text-3xl">☕</span>
                    <p className="font-semibold text-xs text-slate-600">Ushbu kunda mashg&apos;ulotlar belgilanmagan</p>
                    <p className="text-[11px]">Mustaqil ta&apos;lim va o&apos;z ustida ishlash uchun qulay vaqt</p>
                    <button
                      type="button"
                      onClick={() => {
                        setNewDay(selectedDay);
                        setIsAddEventOpen(true);
                      }}
                      className="mt-2 text-xs font-bold text-blue-700 hover:text-slate-900"
                    >
                      + Vazifa qo&apos;shish
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                    {selectedDayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEventModal(ev)}
                        className={`p-4 rounded-2xl border text-xs space-y-2 transition-all cursor-pointer hover:shadow-sm ${getEventBadge(ev.type)} ${
                          ev.completed ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono font-bold flex items-center gap-1.5">
                            <input 
                              type="checkbox" 
                              checked={!!ev.completed}
                              onChange={(e) => handleToggleComplete(ev.id, e as any)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className={ev.completed ? 'line-through text-slate-500' : ''}>{ev.time}</span>
                          </span>
                          <span className="uppercase tracking-wider text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-white/80">
                            {ev.type === 'class' ? 'Dars' : ev.type === 'assignment' ? 'Topshiriq' : ev.type === 'exam' ? 'Imtihon' : 'Tadbir'}
                          </span>
                        </div>

                        <h4 className={`font-display font-bold text-sm text-slate-900 leading-snug ${
                          ev.completed ? 'line-through text-slate-500' : ''
                        }`}>
                          {ev.title}
                        </h4>

                        <div className="space-y-0.5 text-[11px] opacity-85">
                          {ev.room && <div>📍 Xona: {ev.room}</div>}
                          {ev.instructor && <div>👤 {ev.instructor}</div>}
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Batafsil ko&apos;rish →</span>
                          {ev.completed && <span className="text-emerald-700 font-bold">Bajarildi ✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Helper */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Savol bormi?</span>
                  <Link
                    href="/student/tutor"
                    className="text-blue-700 hover:text-slate-900 font-bold flex items-center gap-1"
                  >
                    <span>AI dan dars haqida so&apos;rash</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              WEEK VIEW
              ========================================================================= */}
          {viewMode === 'week' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6 animate-fade-up">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Haftalik Dars va Topshiriqlar Jadvali
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tanlangan hafta: {weekDays[0].dayNum}-{MONTH_NAMES[weekDays[0].monthIndex]} dan {weekDays[6].dayNum}-{MONTH_NAMES[weekDays[6].monthIndex]} gacha
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDay(prev => Math.max(1, prev - 7))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50"
                  >
                    ← Oldingi hafta
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDay(prev => Math.min(daysInMonth, prev + 7))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50"
                  >
                    Keyingi hafta →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {weekDays.map((dayData, idx) => {
                  const isToday = isCurrentRealToday(dayData.dayNum) && dayData.monthIndex === 8;
                  const isSelected = selectedDay === dayData.dayNum;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedDay(dayData.dayNum);
                        setCurrentMonthIndex(dayData.monthIndex);
                        setCurrentYear(dayData.year);
                      }}
                      className={`rounded-2xl border p-3.5 space-y-3 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-slate-900 bg-slate-50/90 ring-2 ring-slate-900/20' 
                          : isToday
                          ? 'border-blue-500 bg-blue-50/40'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">{dayData.dayName}</p>
                          <p className="text-base font-bold text-slate-900 font-mono">{dayData.dayNum}</p>
                        </div>
                        {isToday && (
                          <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-md">
                            Bugun
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 min-h-[120px]">
                        {dayData.events.length === 0 ? (
                          <p className="text-[10px] text-slate-400 text-center pt-8">Bo&apos;sh kun</p>
                        ) : (
                          dayData.events.map(ev => (
                            <div
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEventModal(ev);
                              }}
                              className={`p-2 rounded-xl text-[11px] space-y-1 border cursor-pointer hover:scale-102 transition-transform ${getEventBadge(ev.type)} ${
                                ev.completed ? 'line-through opacity-50' : ''
                              }`}
                            >
                              <div className="flex items-center justify-between text-[9px] font-bold">
                                <span>{ev.time}</span>
                                {ev.completed && <span>✓</span>}
                              </div>
                              <p className="font-bold leading-tight line-clamp-2">{ev.title}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              DAY VIEW (FULL HOURLY DETAIL)
              ========================================================================= */}
          {viewMode === 'day' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Kunlik Kun Tartibi</span>
                  <h3 className="text-xl font-bold text-slate-900 font-display">
                    {selectedDay}-{MONTH_NAMES[currentMonthIndex]}, {currentYear}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDay(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50"
                  >
                    ← Oldingi kun
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDay(prev => Math.min(daysInMonth, prev + 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50"
                  >
                    Keyingi kun →
                  </button>
                </div>
              </div>

              {selectedDayEvents.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-3">
                  <span className="text-4xl">🌟</span>
                  <h4 className="text-sm font-bold text-slate-700">Ushbu kunga rejalashtirilgan vazifalar yo&apos;q</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Yangi dars, topshiriq yoki shaxsiy rejangizni kiritish uchun quyidagi tugmani bosing.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewDay(selectedDay);
                      setIsAddEventOpen(true);
                    }}
                    className="tf-btn tf-btn-primary text-xs py-2 px-4"
                  >
                    + Ushbu kunga vazifa qo&apos;shish
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayEvents.map(ev => (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEventModal(ev)}
                      className={`p-5 rounded-2xl border text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all ${getEventBadge(ev.type)} ${
                        ev.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <input
                          type="checkbox"
                          checked={!!ev.completed}
                          onChange={(e) => handleToggleComplete(ev.id, e as any)}
                          className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs">{ev.time}</span>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/80">
                              {ev.type}
                            </span>
                          </div>
                          <h4 className={`text-base font-bold text-slate-900 ${ev.completed ? 'line-through text-slate-500' : ''}`}>
                            {ev.title}
                          </h4>
                          {ev.description && (
                            <p className="text-xs text-slate-600 font-sans">{ev.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs opacity-80 pt-1">
                            {ev.room && <span>📍 {ev.room}</span>}
                            {ev.instructor && <span>👤 {ev.instructor}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs font-bold text-slate-700 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200">
                          Batafsil →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* =========================================================================
          EVENT DETAIL & ACTION MODAL
          ========================================================================= */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getEventBadge(selectedEventModal.type)}`}>
                  {selectedEventModal.type === 'class' ? 'Dars mashg\'uloti' :
                   selectedEventModal.type === 'assignment' ? 'Topshiriq (Deadline)' :
                   selectedEventModal.type === 'exam' ? 'Nazorat Imtihoni' : 'Olimpiada / Tadbir'}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-display leading-snug">
                  {selectedEventModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEventModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-500">Sana va Vaqt:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {selectedEventModal.day}-{MONTH_NAMES[selectedEventModal.month]}, {selectedEventModal.time}
                </span>
              </div>

              {selectedEventModal.room && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-500">Auditoriya / Xona:</span>
                  <span className="font-bold text-slate-900">{selectedEventModal.room}</span>
                </div>
              )}

              {selectedEventModal.instructor && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-500">O&apos;qituvchi / Tashkilotchi:</span>
                  <span className="font-bold text-slate-900">{selectedEventModal.instructor}</span>
                </div>
              )}

              {selectedEventModal.description && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-semibold text-slate-500 block">Tafsilotlar:</span>
                  <p className="text-slate-700 leading-relaxed">{selectedEventModal.description}</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleToggleComplete(selectedEventModal.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedEventModal.completed 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {selectedEventModal.completed ? '✓ Bajarildi' : 'Bajarildi deb belgilash'}
              </button>

              <Link
                href="/student/tutor"
                className="tf-btn tf-btn-primary text-xs py-2 px-3.5"
              >
                AI Yordamchi bilan o&apos;rganish →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD EVENT / VAZIFA MODAL
          ========================================================================= */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Yangi Voqea / Vazifa Qo&apos;shish</h3>
                <p className="text-xs text-slate-500">{MONTH_NAMES[currentMonthIndex]} {currentYear} taqvimi uchun</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEventOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vazifa / Tadbir Nomi
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Masalan: Algoritmlardan oraliq nazorat"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Turi
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="class">Dars mashg&apos;uloti</option>
                    <option value="assignment">Topshiriq (Deadline)</option>
                    <option value="exam">Imtihon / Nazorat</option>
                    <option value="event">Olimpiada / Tadbir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sana ({MONTH_NAMES[currentMonthIndex]})
                  </label>
                  <select
                    value={newDay}
                    onChange={e => setNewDay(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {Array.from({ length: daysInMonth }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}-{MONTH_NAMES[currentMonthIndex]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vaqt oralig&apos;i
                </label>
                <input
                  type="text"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  placeholder="Masalan: 10:00 - 11:30 yoki 23:59"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Xona / Manzil
                  </label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={e => setNewRoom(e.target.value)}
                    placeholder="212-xona"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    O&apos;qituvchi
                  </label>
                  <input
                    type="text"
                    value={newInstructor}
                    onChange={e => setNewInstructor(e.target.value)}
                    placeholder="Prof. Olimjon"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Izoh yoki talablar
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Qo'shimcha eslatmalar..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="tf-btn tf-btn-primary text-xs py-2 px-4"
                >
                  Taqvimga saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
