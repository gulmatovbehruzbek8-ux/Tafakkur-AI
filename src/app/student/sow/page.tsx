'use client';
import Sidebar from "@/app/components/Sidebar";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { getApiUrl } from "@/lib/api";

type Topic = {
  title: string;
  done?: boolean;
  current?: boolean;
  task?: string;
  id?: number;
};

type Module = {
  module: string;
  topics: Topic[];
};

type Subject = {
  id: string;
  name: string;
  curriculum: Module[];
};

function SOWContent() {
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  
  const subjects: Subject[] = [
    {
      id: "algo",
      name: "Algoritmlar va Ma'lumotlar Tuzilmasi",
      curriculum: [
        {
          module: "1-Modul: Asosiy tushunchalar",
          topics: [
            { title: "Kirish va fan metodologiyasi", done: true },
            { title: "Algoritmlar nazariyasi va murakkablik", done: true },
          ]
        },
        {
          module: "2-Modul: Chiziqli ma'lumotlar tuzilmalari",
          topics: [
            { title: "Massivlar va dinamik ro'yxatlar", done: true },
            { title: "Stek va Navbat (Stack & Queue)", id: 1, current: true, task: "Uy vazifasi: Algoritmlar loyihasi" },
          ]
        },
        {
          module: "3-Modul: Tarmoqlangan va daraxtsimon tuzilmalar",
          topics: [
            { title: "Binar qidiruv daraxtlari (BST)", done: false },
            { title: "Graflar va ularda qidiruv algoritmlari (BFS, DFS)", done: false },
          ]
        }
      ]
    },
    {
      id: "ai",
      name: "Sun'iy Intellekt Asoslari",
      curriculum: [
        {
          module: "1-Modul: AI tarixi va rivojlanishi",
          topics: [
            { title: "Turing testi va intellekt tushunchasi", done: true },
            { title: "Mashinali o'rganishga kirish", current: true, task: "Kichik klassifikator qurish amaliyoti" },
          ]
        },
        {
          module: "2-Modul: Neyron Tarmoqlar",
          topics: [
            { title: "Perseptron va aktivatsiya funksiyalari", done: false },
            { title: "Ko'p qatlamli neyron tarmoqlar (MLP)", done: false },
          ]
        }
      ]
    },
    {
      id: "math",
      name: "Oliy Matematika",
      curriculum: [
        {
          module: "1-Modul: Chiziqli algebra",
          topics: [
            { title: "Matritsalar va ular ustida amallar", done: true },
            { title: "Determinantlar va Kramer usuli", current: true },
          ]
        }
      ]
    }
  ];

  const [activeSubjectId, setActiveSubjectId] = useState(subjects[0].id);
  const activeSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: `Assalomu alaykum! Men **Tafakkur AI** — sizning **${activeSubject.name}** fani bo'yicha shaxsiy repetitoringizman. Mavzular yoki topshiriqlar bo'yicha qanday savolingiz bor?` }
  ]);
  const [input, setInput] = useState('');

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query) return;
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInput('');

    try {
      const res = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          context: `${activeSubject.name} fani bo'yicha o'quv dasturi (SOW).`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'ai', text: data.answer || data.response || "Mavzu bo'yicha ma'lumot tahlil qilindi." }]);
      } else {
        throw new Error();
      }
    } catch {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `[Tafakkur AI • ${activeSubject.name}]: Ushbu mavzu semestr rejasining asosiy qismlaridan biridir. Tushunchani mustahkamlash uchun ma'ruza matnlari va amaliy topshiriqlar bilan tanishib chiqish tavsiya etiladi.` 
        }]);
      }, 500);
    }
  };

  return (
    <div className="tf-main">
      <div className="tf-container-wide flex flex-col xl:flex-row gap-8">
        
        {/* Left: SOW / Curriculum */}
        <div className="flex-1 space-y-6">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">O'quv Dasturi (SOW)</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">Fanlar va Mavzular Rejasi</h1>
              <p className="text-slate-500 text-sm mt-0.5">Semestr davomida o'zlashtirilishi lozim bo'lgan barcha akademik modullar</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Fanni tanlang:</span>
              <select 
                value={activeSubjectId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setActiveSubjectId(newId);
                  const sName = subjects.find(s => s.id === newId)?.name;
                  setMessages([{ 
                    role: 'ai', 
                    text: `Assalomu alaykum! Men **Tafakkur AI** — sizning **${sName}** fani bo'yicha shaxsiy repetitoringizman. Mavzular yoki topshiriqlar bo'yicha qanday savolingiz bor?` 
                  }]);
                }}
                className="bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs cursor-pointer"
              >
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </header>

          <div className="space-y-6">
            {activeSubject.curriculum.map((mod, idx) => (
              <div key={idx} className="tf-card-solid p-6 md:p-7">
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">{mod.module}</h2>
                  <span className="text-xs font-semibold text-slate-400">{mod.topics.length} ta mavzu</span>
                </div>
                <div className="space-y-3">
                  {mod.topics.map((topic, tIdx) => (
                    <div 
                      key={tIdx} 
                      className={`p-4 rounded-xl border transition-all ${
                        topic.current 
                          ? 'border-blue-300 bg-blue-50/50 shadow-xs' 
                          : topic.done 
                            ? 'border-emerald-200/80 bg-emerald-50/20' 
                            : 'border-slate-200/70 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-400">#{tIdx + 1}</span>
                            <h3 className={`font-semibold text-sm ${topic.current ? 'text-slate-900' : 'text-slate-800'}`}>{topic.title}</h3>
                          </div>
                          {topic.task && (
                            <p className="text-xs text-amber-800 font-medium mt-1.5 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              {topic.task}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          {topic.done && (
                            <span className="text-xs font-medium text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              ✓ O'tildi
                            </span>
                          )}
                          {topic.current && (
                            <button 
                              onClick={() => setChatOpen(true)}
                              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
                            >
                              <span>Tafakkur AI bilan o'rganish</span>
                              <span>&rarr;</span>
                            </button>
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

        {/* Right: Slide-in Chatbot Context */}
        {chatOpen && (
          <div className="w-full xl:w-[420px] shrink-0 bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col h-[640px] sticky top-8 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 md:p-5 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <h3 className="font-bold text-base">Tafakkur AI Repetitori</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px]">{activeSubject.name}</p>
              </div>
              <button 
                onClick={() => setChatOpen(false)} 
                className="text-slate-400 hover:text-white text-xl p-1 font-bold"
                aria-label="Yopish"
              >
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-xs' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white border-t border-slate-100">
              <form onSubmit={handleChat} className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Mavzu bo'yicha savol bering..."
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                />
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                  &rarr;
                </button>
              </form>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default function StudentSOWPage() {
  return (
    <div className="tf-page">
      <Sidebar role="student" activeRoute="/student/sow" />
      <Suspense fallback={<div className="p-12 text-sm text-slate-500">Yuklanmoqda...</div>}>
        <SOWContent />
      </Suspense>
    </div>
  );
}
