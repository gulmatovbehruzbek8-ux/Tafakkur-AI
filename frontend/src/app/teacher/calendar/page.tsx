import Sidebar from "@/app/components/Sidebar";
import Link from "next/link";

export default function TeacherCalendarPage() {
  const classes = [
    { id: 1, date: 12, title: "Algoritmlar nazariyasi (Ma'ruza)", group: "AI-22", color: "bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100" },
    { id: 2, date: 12, title: "Algoritmlar nazariyasi (Amaliyot)", group: "AI-23", color: "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100" },
    { id: 3, date: 15, title: "Ma'lumotlar tuzilmasi", group: "SE-21", color: "bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100" },
    { id: 4, date: 18, title: "Sun'iy intellekt asoslari", group: "AI-22", color: "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100" },
    { id: 5, date: 22, title: "Dasturlash asoslari", group: "CS-11", color: "bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100" },
  ];

  const currentMonth = "Sentyabr";
  const daysInMonth = 30;

  return (
    <div className="tf-page">
      <Sidebar role="teacher" activeRoute="/teacher/calendar" />
      
      <main className="tf-main">
        <div className="tf-container space-y-6">
          
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">O'qituvchi Jadvali</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">Darslar Taqvim va Jadvali</h1>
              <p className="text-slate-500 text-sm mt-0.5">O'qitilayotgan guruhlar va dars jadvallari monitoringi</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                5 ta dars jadvalda
              </span>
            </div>
          </header>

          <div className="tf-card-solid p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="font-display text-lg font-bold text-ink tracking-tight">{currentMonth} 2026</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  &larr; Oldingi
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                  Keyingi &rarr;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'].map(day => (
                <div key={day} className="p-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {day}
                </div>
              ))}
              
              <div className="min-h-[105px] p-2 rounded-xl bg-slate-50/40 border border-transparent"></div>
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dailyClasses = classes.filter(c => c.date === day);
                const isToday = day === 12;
                
                return (
                  <div 
                    key={day} 
                    className={`min-h-[105px] p-2 rounded-xl border transition-all ${
                      isToday 
                        ? 'bg-teal-50/40 border-teal-500/80 shadow-xs' 
                        : 'bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/40'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-xs font-bold font-mono ${isToday ? 'text-teal-600' : 'text-slate-500'}`}>
                        {day}
                      </span>
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {dailyClasses.map(c => (
                        <Link 
                          key={c.id}
                          href={`/teacher/sow?class=${c.id}`}
                          className={`block p-2 rounded-lg text-xs font-medium border transition-all shadow-2xs ${c.color}`}
                        >
                          <div className="font-semibold truncate leading-tight">{c.title}</div>
                          <div className="text-[10px] opacity-80 mt-0.5 font-mono">{c.group}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
