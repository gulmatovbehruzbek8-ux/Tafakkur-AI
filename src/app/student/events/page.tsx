'use client';

import Sidebar from "@/app/components/Sidebar";
import TafakkurCompanion from "@/app/components/TafakkurCompanion";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface TimelineItem {
  id: string;
  type: 'event' | 'olympiad';
  date: string;
  displayDate: string;
  title: string;
  subtitle: string;
  location: string;
  registrationDeadline: string;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  prize?: string;
  organizer: string;
  difficulty?: string;
  eligibility: string;
  categoryTag: string;
  recommendedReason?: string;
  position: 'above' | 'below';
  description: string;
  agenda: string[];
}

const INITIAL_TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: 'item-1',
    type: 'event',
    date: '2026-09-18',
    displayDate: 'SEP 18',
    title: "Robototexnika & AI Innovatsiya Klubi",
    subtitle: "STEM Markazi • Amaliy Workshop",
    location: "UrDU Talabalar Saroyi, 3-qavat",
    registrationDeadline: "Bugun 17:00",
    daysRemaining: 0,
    hoursRemaining: 6,
    minutesRemaining: 45,
    organizer: "UrDU AI Lab & IT Park",
    eligibility: "Barcha IT va Muhandislik talabalari",
    categoryTag: "Seminar & Workshop",
    recommendedReason: "Sun'iy intellekt va robototexnika qiziqishlaringizga mos",
    position: 'above',
    description: "Kompyuter ko'rishi (Computer Vision) va avtonom robotlarni boshqarish bo'yicha amaliy mashg'ulot.",
    agenda: [
      "17:30 - Kirish va texnik vositalar bilan tanishuv",
      "18:00 - YOLOv8 modelini edge qurilmada ishga tushirish",
      "18:45 - Savol-javob va loyihalar muhokamasi"
    ]
  },
    {
      id: 'item-2',
      type: 'event',
      date: '2026-09-23',
      displayDate: 'SEP 23',
      title: "IT Career Day: Katta Texnologik Kompaniyalar Bilan Uchrashuv",
      subtitle: "15 dan ortiq IT kompaniyalar va amaliyot o'rinlari",
      location: "Universitet Bosh Korpusi / Katta Zal",
      registrationDeadline: "22-sentyabr, 18:00",
      daysRemaining: 4,
      hoursRemaining: 18,
      minutesRemaining: 20,
      organizer: "Universitet Karyera Markazi",
      eligibility: "2, 3 va 4-bosqich talabalari",
      categoryTag: "Karyera & Vakansiyalar",
      recommendedReason: "Kompaniyalarda pullik amaliyot o'tash imkoniyati",
      position: 'below',
      description: "EPAM, Uzinfocom, IT Park rezidentlari bilan to'g'ridan-to'g'ri intervyu va portfolio ko'rigi.",
      agenda: [
        "10:00 - Kompaniyalar taqdimoti",
        "11:30 - Mock-intervyular va rezyume tahlili",
        "14:00 - Tezkor takliflar (Speed hiring)"
      ]
    },
    {
      id: 'item-3',
      type: 'olympiad',
      date: '2026-09-25',
      displayDate: 'SEP 25',
      title: "Umummilliy AI Xakaton (Ta'lim Yo'nalishi)",
      subtitle: "50,000,000 UZS Sovrin Jamg'armasi",
      location: "IT Park Xorazm Filiali & Onlayn",
      registrationDeadline: "25-sentyabr, 18:00",
      daysRemaining: 6,
      hoursRemaining: 19,
      minutesRemaining: 34,
      prize: "50,000,000 UZS + Rektorat Granti",
      organizer: "Raqamli Texnologiyalar Vazirligi",
      difficulty: "Murakkab (Xakaton darajasi)",
      eligibility: "Barcha Oliy ta'lim talabalari (Jamoaviy)",
      categoryTag: "AI Xakaton",
      recommendedReason: "Tafakkur AI loyihasi bo'yicha jamoa a'zosi sifatida tavsiya etiladi",
      position: 'above',
      description: "Oliy ta'lim tizimida sun'iy intellekt agentlari va operatsion tizimlarini yaratish bo'yicha 48 soatlik marafon.",
      agenda: [
        "25-sent 18:00 - Ro'yxatdan o'tish yopilishi",
        "26-sent 09:00 - Xakaton start va keyslar taqdimoti",
        "27-sent 16:00 - Demo Day va g'oliblarni taqdirlash"
      ]
    },
    {
      id: 'item-4',
      type: 'olympiad',
      date: '2026-09-28',
      displayDate: 'SEP 28',
      title: "ACM ICPC Dasturlash Olimpiadasi (Saralash)",
      subtitle: "Xalqaro darajadagi algoritmik bellashuv",
      location: "Bosh Kompyuter Markazi (212 & 214-zallar)",
      registrationDeadline: "26-sentyabr, 20:00",
      daysRemaining: 9,
      hoursRemaining: 21,
      minutesRemaining: 15,
      prize: "Yarim Final Yo'llanmasi + Noutbuklar",
      organizer: "ICPC Regional Qo'mitasi",
      difficulty: "Olimpiada (Ekspert)",
      eligibility: "Dasturlash va algoritmlardan a'lochi talabalar",
      categoryTag: "Algoritmik Olimpiada",
      recommendedReason: "BST va Algoritmlar bo'yicha 94% natijangiz uchun tavsiya etiladi",
      position: 'below',
      description: "C++, Java va Python tillarida 5 soat davomida 12 ta murakkab algoritmik masalani yechish.",
      agenda: [
        "09:00 - Ro'yxatdan o'tish va texnik sinov",
        "10:00 - 15:00 - Asosiy musobaqa (5 soat)",
        "16:00 - Natijalar tahlili va taqdirlash"
      ]
    },
    {
      id: 'item-5',
      type: 'event',
      date: '2026-10-08',
      displayDate: 'OCT 08',
      title: "Open Source AI & LLM Modellar Konferensiyasi",
      subtitle: "Mahalliy tillarda ishlovchi sun'iy intellekt ekotizimi",
      location: "UrDU Konferentsiyalar Zali",
      registrationDeadline: "05-oktyabr",
      daysRemaining: 19,
      hoursRemaining: 12,
      minutesRemaining: 0,
      organizer: "Tafakkur AI & O'zbekiston AI Jamiyati",
      eligibility: "Barcha qiziquvchi talaba va tadqiqotchilar",
      categoryTag: "Ilmiy Konferensiya",
      recommendedReason: "Sun'iy intellekt tadqiqotlari yo'nalishingizga to'liq mos",
      position: 'above',
      description: "O'zbek tilidagi katta til modellarini (LLM) o'qitish va ta'lim tizimida qo'llash istiqbollari.",
      agenda: [
        "10:00 - Yalpi majlis",
        "11:30 - Panel munozarasi",
        "14:00 - Yosh olimlar seksiya ma'ruzalari"
      ]
    }
];

export default function EventsAndOlympiadsPage() {
  const [activeSegment, setActiveSegment] = useState<'all' | 'events' | 'olympiads'>('all');
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(INITIAL_TIMELINE_ITEMS);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [registeredList, setRegisteredList] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  // Form state for adding new event/olympiad
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'event' as 'event' | 'olympiad',
    date: '2026-10-15',
    subtitle: '',
    location: '',
    prize: '',
    organizer: 'UrDU Raqamli Ta\'lim Markazi',
    difficulty: 'O\'rta',
    categoryTag: 'Universitet Tadbiri',
    description: '',
  });

  // Load persisted custom events
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tafakkur_custom_events');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTimelineItems([...parsed, ...INITIAL_TIMELINE_ITEMS]);
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const dateObj = new Date(newEvent.date || '2026-10-15');
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const displayDate = `${monthNames[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, '0')}`;

    const createdItem: TimelineItem = {
      id: `custom-event-${Date.now()}`,
      type: newEvent.type,
      date: newEvent.date,
      displayDate,
      title: newEvent.title,
      subtitle: newEvent.subtitle || (newEvent.type === 'olympiad' ? "Universitet Olimpiadasi" : "Akademik Tadbir"),
      location: newEvent.location || "UrDU Bosh Korpusi",
      registrationDeadline: `${newEvent.date}, 18:00`,
      daysRemaining: Math.max(1, Math.round((dateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
      hoursRemaining: 12,
      minutesRemaining: 0,
      prize: newEvent.prize || undefined,
      organizer: newEvent.organizer || "UrDU",
      difficulty: newEvent.difficulty,
      eligibility: "Barcha talabalar",
      categoryTag: newEvent.categoryTag || (newEvent.type === 'olympiad' ? "Olimpiada" : "Seminar"),
      position: 'above',
      description: newEvent.description || "Ushbu tadbir haqida to'liq ma'lumot dekanat tomonidan taqdim etiladi.",
      agenda: [
        "09:30 - Ro'yxatdan o'tish va tanishuv",
        "10:00 - Asosiy qismning ochilishi",
        "14:00 - Xulosa va taqdirlash"
      ]
    };

    const updated = [createdItem, ...timelineItems];
    setTimelineItems(updated);

    if (typeof window !== 'undefined') {
      const existingCustom = JSON.parse(localStorage.getItem('tafakkur_custom_events') || '[]');
      localStorage.setItem('tafakkur_custom_events', JSON.stringify([createdItem, ...existingCustom]));
    }

    setIsAddModalOpen(false);
    setNewEvent({
      title: '',
      type: 'event',
      date: '2026-10-15',
      subtitle: '',
      location: '',
      prize: '',
      organizer: 'UrDU Raqamli Ta\'lim Markazi',
      difficulty: 'O\'rta',
      categoryTag: 'Universitet Tadbiri',
      description: '',
    });
  };

  const filteredItems = timelineItems.filter(item => {
    if (activeSegment === 'all') return true;
    if (activeSegment === 'events') return item.type === 'event';
    if (activeSegment === 'olympiads') return item.type === 'olympiad';
    return true;
  });

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (timelineScrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      timelineScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const toggleRegister = (id: string) => {
    if (registeredList.includes(id)) {
      setRegisteredList(prev => prev.filter(item => item !== id));
    } else {
      setRegisteredList(prev => [...prev, id]);
    }
  };

  return (
    <div className="tf-page bg-[#f8fafc]">
      <Sidebar role="student" activeRoute="/student/events" />
      <TafakkurCompanion currentContext="Tadbirlar & Olimpiadalar (Events & Olympiads)" />

      <main className="tf-main pb-20">
        <div className="tf-container-wide space-y-8">

          {/* =========================================================================
              HEADER: EVENTS & OLYMPIADS + SEGMENTED TABS
              ========================================================================= */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#07101B] via-[#0b1f33] to-[#07243b] text-white p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl space-y-6 animate-fade-up">
            <div className="tf-mesh absolute inset-0 opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    🏆 EVENTS & OLYMPIADS
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    Urganch Davlat Universiteti • Raqamli Kampus Imkoniyatlari
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Tadbirlar, Xakatonlar va Olimpiadalar
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                  Universitet hayotidagi eng nufuzli ilmiy anjumanlar, karyera kunlari va xalqaro dasturlash musobaqalarining gorizontal xronologik yo'lagi.
                </p>
              </div>

              {/* Segmented Big Tabs */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 self-start lg:self-auto">
                <button
                  onClick={() => setActiveSegment('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSegment === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Barchasi ({timelineItems.length})
                </button>
                <button
                  onClick={() => setActiveSegment('events')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSegment === 'events'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  🎉 Tadbirlar (Events)
                </button>
                <button
                  onClick={() => setActiveSegment('olympiads')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSegment === 'olympiads'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  ⚔️ Olimpiadalar (Olympiads)
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 transition-all shadow-md shadow-amber-400/20 hover:scale-[1.02] flex items-center gap-1.5 ml-1"
                >
                  <span>+ Tadbir / Olimpiada</span>
                </button>
              </div>
            </div>

            {/* Timeline Controls Banner */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Gorizontal xronologiyani o'ngga va chapga siljiting (Drag / Trackpad / Tugmalar)</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollTimeline('left')}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-colors"
                  title="Oldingi sanalarga siljitish"
                >
                  ‹
                </button>
                <button
                  onClick={() => scrollTimeline('right')}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-colors"
                  title="Keyingi sanalarga siljitish"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SIGNATURE FEATURE: HORIZONTAL CHRONOLOGICAL TIMELINE (HEART OF THE PAGE)
              ========================================================================= */}
          <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4 animate-fade-up overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h2 className="font-display font-bold text-lg text-slate-900">
                  Xronologik Voqealar Chizig'i (Academic Timeline)
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Sentyabr — Oktyabr 2026
              </span>
            </div>

            {/* Scrollable Horizontal Track Container */}
            <div 
              ref={timelineScrollRef}
              className="overflow-x-auto py-12 px-4 scrollbar-none relative min-h-[460px] select-none"
            >
              {/* Continuous Horizontal Center Line */}
              <div className="absolute top-[230px] left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-amber-400 to-violet-500 rounded-full min-w-[1400px] shadow-[0_0_12px_rgba(245,158,11,0.4)]" />

              {/* Items in Alternating Layout (Above / Below) */}
              <div className="flex items-center gap-12 min-w-[1400px] relative">
                {filteredItems.map((item, idx) => {
                  const isRegistered = registeredList.includes(item.id);
                  const isAbove = item.position === 'above';

                  return (
                    <div 
                      key={item.id} 
                      className="relative w-80 shrink-0 flex flex-col items-center"
                      style={{
                        marginTop: isAbove ? '0px' : '260px',
                        marginBottom: isAbove ? '260px' : '0px',
                      }}
                    >
                      {/* Event Card Node */}
                      <div 
                        onClick={() => setSelectedItem(item)}
                        className={`w-full p-5 rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1 bg-white ${
                          item.type === 'olympiad'
                            ? 'border-amber-300 hover:border-amber-500 ring-1 ring-amber-100'
                            : 'border-slate-200 hover:border-teal-400'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded-md">
                              {item.displayDate}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              item.type === 'olympiad' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                            }`}>
                              {item.categoryTag}
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                            {item.title}
                          </h3>

                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {item.subtitle}
                          </p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 font-mono">
                              ⏳ {item.daysRemaining > 0 ? `${item.daysRemaining} kun qoldi` : `${item.hoursRemaining} soat qoldi`}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRegister(item.id);
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                                isRegistered
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-900 hover:bg-teal-700 text-white'
                              }`}
                            >
                              {isRegistered ? '✓ Ro\'yxatdasiz' : 'Qatnashish →'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Vertical Connector Stem & Central Circle Node */}
                      <div 
                        className="absolute flex flex-col items-center pointer-events-none"
                        style={{
                          top: isAbove ? '100%' : 'auto',
                          bottom: isAbove ? 'auto' : '100%',
                          height: '42px',
                        }}
                      >
                        <div className="w-0.5 h-full bg-slate-300" />
                      </div>

                      {/* Dot Node on the Horizontal Line */}
                      <div 
                        className={`absolute w-6 h-6 rounded-full border-4 border-white shadow-md flex items-center justify-center text-[9px] font-bold transition-transform hover:scale-125 ${
                          item.type === 'olympiad'
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50'
                            : 'bg-teal-500 text-white ring-2 ring-teal-400/50'
                        }`}
                        style={{
                          top: isAbove ? 'calc(100% + 30px)' : 'auto',
                          bottom: isAbove ? 'auto' : 'calc(100% + 30px)',
                        }}
                      >
                        ●
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =========================================================================
              PERSONALIZED DISCOVERY: "RECOMMENDED FOR YOU"
              ========================================================================= */}
          <section className="bg-gradient-to-r from-teal-900 via-slate-900 to-[#07101B] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-lg space-y-4 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block">
                  Shaxsiy Tavsiyalar (Personalized Discovery)
                </span>
                <h3 className="font-display font-bold text-xl text-white">
                  Siz uchun maxsus saralangan imkoniyatlar
                </h3>
              </div>
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-slate-300 border border-white/10">
                AI & Kompyuter Fanlari talabasi bo'lganingiz uchun
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                    Olimpiada Tavsiyasi
                  </span>
                  <h4 className="font-display font-bold text-sm text-white">
                    ACM ICPC Saralash Bosqichi
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sizning Ma'lumotlar tuzilmasi bo'yicha 92.4% o'zlashtirish ballingiz universitet jamoasida qatnashish uchun yuqori tavsiya hisoblanadi.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(timelineItems[3])}
                  className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
                >
                  Ko'rish →
                </button>
              </div>

              <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded bg-teal-400/20 text-teal-300 text-[10px] font-bold">
                    Xakaton Tavsiyasi
                  </span>
                  <h4 className="font-display font-bold text-sm text-white">
                    Umummilliy AI Xakaton (50 mln so'm)
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tafakkur AI ta'lim operatsion tizimi arxitekturasi bilan ishtirok etish uchun tayyorgarlik ko'ring. Ro'yxatdan o'tish juma kuni yopiladi.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(timelineItems[2])}
                  className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
                >
                  Ko'rish →
                </button>
              </div>
            </div>
          </section>

          {/* =========================================================================
              EVENT & OLYMPIAD FULL DETAIL EXPANDED MODAL
              ========================================================================= */}
          {selectedItem && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                      {selectedItem.categoryTag}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {selectedItem.displayDate}, 2026
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* Hero Countdown Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#07101B] to-[#0d2238] text-white space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                    RO'YXATDAN O'TISH YOPILISHIGA QOLDI:
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                      <span className="font-display font-black text-2xl text-white block">
                        {String(selectedItem.daysRemaining).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] text-slate-300 uppercase">KUN</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                      <span className="font-display font-black text-2xl text-white block">
                        {String(selectedItem.hoursRemaining).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] text-slate-300 uppercase">SOAT</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                      <span className="font-display font-black text-2xl text-white block">
                        {String(selectedItem.minutesRemaining).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] text-slate-300 uppercase">DAQIQA</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 leading-tight">
                    {selectedItem.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedItem.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block mb-0.5">Manzil</span>
                      <span className="font-bold text-slate-800">{selectedItem.location}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block mb-0.5">Tashkilotchi</span>
                      <span className="font-bold text-slate-800">{selectedItem.organizer}</span>
                    </div>

                    {selectedItem.prize && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 col-span-2">
                        <span className="text-[10px] font-bold uppercase block mb-0.5">Sovrin Jamg'armasi</span>
                        <span className="font-display font-black text-base">{selectedItem.prize}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <strong className="text-slate-800 block">Dastur va Reglament (Agenda):</strong>
                    {selectedItem.agenda.map((ag, i) => (
                      <div key={i} className="text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        <span>{ag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      toggleRegister(selectedItem.id);
                    }}
                    className={`px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      registeredList.includes(selectedItem.id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-teal-700 text-white'
                    }`}
                  >
                    {registeredList.includes(selectedItem.id) ? '✓ Ro\'yxatdan o\'tgansiz' : 'Ro\'yxatdan o\'tish (Register)'}
                  </button>

                  <Link
                    href="/student/calendar"
                    className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                  >
                    Taqvimga qo'shish 📅
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODAL: ADD NEW EVENT OR OLYMPIAD
              ========================================================================= */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <div>
                      <h3 className="font-display font-bold text-slate-900 text-base">
                        Yangi Tadbir yoki Olimpiada Qo'shish
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Talabalar va jamoalar uchun yangi akademik tadbir yaratish
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddEventSubmit} className="space-y-3.5 text-xs">
                  {/* Type Selector */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewEvent(p => ({ ...p, type: 'event' }))}
                      className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                        newEvent.type === 'event'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      <span>🎉 Tadbir / Seminar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewEvent(p => ({ ...p, type: 'olympiad' }))}
                      className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                        newEvent.type === 'olympiad'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      <span>⚔️ Olimpiada / Xakaton</span>
                    </button>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Nomi (Sarlavha) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: AI & Data Science Xakatoni"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(p => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Date & Location */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Sana *
                      </label>
                      <input
                        type="date"
                        required
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(p => ({ ...p, date: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Joylashuv
                      </label>
                      <input
                        type="text"
                        placeholder="UrDU Korpusi / Onlayn"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent(p => ({ ...p, location: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Prize / Subtitle */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        {newEvent.type === 'olympiad' ? "Sovrin Jamg'armasi" : "Qisqa shior"}
                      </label>
                      <input
                        type="text"
                        placeholder={newEvent.type === 'olympiad' ? "Masalan: 20,000,000 UZS" : "Workshop & Masterclass"}
                        value={newEvent.prize}
                        onChange={(e) => setNewEvent(p => ({ ...p, prize: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Tashkilotchi
                      </label>
                      <input
                        type="text"
                        placeholder="UrDU, IT Park, AI Lab"
                        value={newEvent.organizer}
                        onChange={(e) => setNewEvent(p => ({ ...p, organizer: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Tadbir Haqida Qisqacha
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tadbirning maqsadi, ishtirokchilar uchun talablar va imkoniyatlar..."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(p => ({ ...p, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-600 transition-colors"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-colors"
                    >
                      Qo'shish va E'lon Qilish ✓
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
