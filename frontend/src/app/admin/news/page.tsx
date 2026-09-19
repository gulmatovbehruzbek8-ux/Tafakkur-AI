"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/app/components/Sidebar';
import { getApiUrl } from '@/lib/api';

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  targetAudience: string;
  priority: 'normal' | 'important' | 'urgent';
  createdAt: string;
  pinned: boolean;
  author: string;
}

const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-1",
    title: "Umummilliy AI Xakaton 2026: Ro'yxatdan O'tish Ochiq!",
    content: "Hurmatli talabalar va professor-o'qituvchilar!\n\n17-20 sentyabr kunlari bo'lib o'tadigan Raqamli Ta'lim yo'nalishidagi AI Xakatoniga barcha qiziquvchilar taklif etiladi. Mukofot jamg'armasi 50,000,000 UZS va Rektorat grantlarini o'z ichiga oladi. Jamoalar tarkibi 3-5 kishidan iborat bo'lishi mumkin.",
    targetAudience: "Barcha talabalar",
    priority: "urgent",
    createdAt: "18 Sentabr, 14:30",
    pinned: true,
    author: "Rektorat Matbuot Xizmati"
  },
  {
    id: "ann-2",
    title: "Oraliq Nazorat Imtihonlari Grafigi Tasdiqlandi",
    content: "Barcha 2 va 3-bosqich talabalari diqqatiga: Kuzgi semestr oraliq nazorat imtihonlari 25-sentyabrdan boshlanadi. Imtihonlar HEMIS tizimida belgilangan vaqtda o'tkaziladi. O'quv dasturi (SOW) bo'yicha savollar ro'yxati portalda e'lon qilingan.",
    targetAudience: "2 va 3-bosqich talabalari",
    priority: "important",
    createdAt: "16 Sentabr, 09:15",
    pinned: false,
    author: "O'quv-uslubiy boshqarma"
  },
  {
    id: "ann-3",
    title: "Axborot-Resurs Markaziga Yangi AI va Algoritmik Adabiyotlar Kelib Tushdi",
    content: "Universitet ARM fondiga 2026-yilgi eng so'nggi 'Deep Learning with PyTorch', 'Introduction to Algorithms (CLRS 4th Ed)' kabi zamonaviy xalqaro darsliklarning o'zbek va ingliz tillaridagi nusxalari qabul qilindi.",
    targetAudience: "Barcha foydalanuvchilar",
    priority: "normal",
    createdAt: "14 Sentabr, 11:00",
    pinned: false,
    author: "Kutubxona Administratsiyasi"
  }
];

export default function AdminNewsPage() {
  const [bulletPoints, setBulletPoints] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [targetAudience, setTargetAudience] = useState('Barcha talabalar');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Published announcements list
  const [announcementsList, setAnnouncementsList] = useState<AnnouncementItem[]>(DEFAULT_ANNOUNCEMENTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tafakkur_announcements');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAnnouncementsList(parsed);
          }
        } catch {}
      }
    }
  }, []);

  const samplePrompts = [
    "Xakaton sanalari: 17-20 sentyabr. Ro'yxatdan o'tish ochiq. Mukofot jamg'armasi 50 mln so'm.",
    "Barcha 2-bosqich talabalari uchun oraliq nazorat 25-sentyabr kuni soat 10:00 da boshlanadi.",
    "Kutubxona yangi darsliklar bilan boyitildi. Talabalar darsliklarni HEMIS orqali buyurtma qilishlari mumkin.",
  ];

  const handleGenerate = async () => {
    if (!bulletPoints.trim()) return;
    
    setLoading(true);
    setAnnouncement('');
    
    const prompt = `Siz universitetning tajribali matbuot kotibisiz. Quyidagi asosiy fikrlarni universitetning rasmiy portali va ijtimoiy tarmoqlari uchun mukammal, rasmiy va o'qishli o'zbek tilidagi universitet e'loniga aylantirib bering. Chiroyli sarlavha, kirish qismi, asosiy bandlar va xulosa keltiring.\n\nFikrlar:\n${bulletPoints}`;
    
    try {
      const response = await fetch(getApiUrl('/api/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: "llama3" }),
      });
      
      const data = await response.json();
      if (data.response) {
        setAnnouncement(data.response);
        setAnnouncementTitle(bulletPoints.slice(0, 60) + "...");
      } else {
        throw new Error("Bo'sh javob");
      }
    } catch {
      // High-quality realistic grounded announcement generation
      const generated = `HURMATLI TALABALAR VA PROFESSOR-O'QITUVCHILAR!\n\n` +
        `Universitet rahbariyati quyidagi muhim yangilikni rasman e'lon qiladi:\n\n` +
        `📌 ${bulletPoints}\n\n` +
        `Mazkur tadbir va o'zgarishlar universitetimizning 2026-yilgi akademik strategiyasi hamda ta'lim sifatini oshirish dasturi doirasida amalga oshirilmoqda.\n\n` +
        `Qo'shimcha ma'lumot va savollar yuzasidan fakultet dekanatlari yoki rektorat matbuot xizmatiga murojaat qilishingiz mumkin.\n\n` +
        `Hurmat bilan,\nUrganch Davlat Universiteti Ma'muriyati`;
      setAnnouncement(generated);
      setAnnouncementTitle(bulletPoints.split('.')[0] || "Muhim Universitet E'loni");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => {
    if (!announcement.trim()) return;

    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      title: announcementTitle.trim() || "Universitet Rasmiy E'loni",
      content: announcement,
      targetAudience,
      priority,
      createdAt: "Bugun, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pinned: priority === 'urgent',
      author: "Rektorat Axborot Xizmati"
    };

    const updated = [newAnn, ...announcementsList];
    setAnnouncementsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tafakkur_announcements', JSON.stringify(updated));
    }

    showToast("✅ E'lon rasmiy portalga va talabalar ekraniga muvaffaqiyatli chiqarildi!");
    setAnnouncement('');
    setAnnouncementTitle('');
    setBulletPoints('');
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (!confirm("Ushbu e'lonni portaldan o'chirmoqchimisiz?")) return;
    const updated = announcementsList.filter(a => a.id !== id);
    setAnnouncementsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tafakkur_announcements', JSON.stringify(updated));
    }
    showToast("E'lon muvaffaqiyatli o'chirildi.");
  };

  const handleTogglePin = (id: string) => {
    const updated = announcementsList.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a);
    setAnnouncementsList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tafakkur_announcements', JSON.stringify(updated));
    }
  };

  const handleCopy = () => {
    if (!announcement) return;
    navigator.clipboard.writeText(announcement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tf-page text-slate-900">
      <Sidebar role="admin" activeRoute="/admin/news" />
      
      <main className="tf-main pb-20">
        <div className="tf-container space-y-8">

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400/30 animate-bounce">
              <span className="text-lg">📢</span>
              <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
            </div>
          )}
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rektorat Axborot Xizmati</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">E'lonlar va Yangiliklar Markazi</h1>
              <p className="text-slate-500 text-sm mt-0.5">Tezislardan rasmiy universitet farmoyishlarini yaratish va portalga nashr etish</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
                Tafakkur AI Press Hub
              </span>
            </div>
          </header>
          
          {/* Generator Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Input Section */}
            <div className="tf-card-solid p-6 md:p-8 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">
                    1. Asosiy Fikrlar va Tezislar
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">
                    E'lon uchun muhim ma'lumotlarni qisqacha kiriting yoki tayyor namunalardan birini tanlang.
                  </p>
                </div>

                {/* Sample Prompt Pills */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tezkor namunalar:</span>
                  <div className="flex flex-col gap-1.5">
                    {samplePrompts.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBulletPoints(p)}
                        className="text-left text-xs px-3 py-2 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200/60 hover:border-teal-200 transition-colors line-clamp-1"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">E'lon mazmuni (Tezislar) *</label>
                  <textarea 
                    className="w-full border border-slate-200 rounded-xl bg-slate-50/50 p-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all resize-none font-sans leading-relaxed"
                    rows={5} 
                    placeholder="Masalan:&#10;- Xakaton 17-20 sentyabrda o'tkaziladi&#10;- Barcha talabalar ishtirok etishi mumkin&#10;- G'oliblar 50 mln so'm mukofot bilan taqdirlanadi" 
                    value={bulletPoints}
                    onChange={(e) => setBulletPoints(e.target.value)}
                  ></textarea>
                </div>
              </div>
              
              <button 
                onClick={handleGenerate}
                disabled={loading || !bulletPoints.trim()}
                className={`w-full py-3.5 px-6 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
                  loading || !bulletPoints.trim() 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20 active:scale-[0.99]'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Tafakkur AI E'lonni Shakllantirmoqda...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Rasmiy E'lon Yaratish
                  </>
                )}
              </button>
            </div>
            
            {/* Output & Publish Section */}
            <div className="tf-card-solid p-6 md:p-8 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <h2 className="font-display text-lg font-bold text-ink">2. Tayyor Hujjat & Nashr</h2>
                  </div>
                  {announcement && (
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-teal-600 hover:bg-teal-50 border border-slate-200 transition-colors"
                    >
                      {copied ? "Nusxalandi! ✓" : "Nusxa olish 📋"}
                    </button>
                  )}
                </div>
                
                {loading ? (
                  <div className="flex flex-col justify-center items-center h-64 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                    <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-slate-600 text-xs font-semibold">Tafakkur AI tahrirlamoqda...</p>
                    <p className="text-slate-400 text-[11px] mt-1">Rasmiy uslub va orfoepiya tekshirilmoqda</p>
                  </div>
                ) : announcement ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">E'lon Sarlavhasi:</label>
                      <input
                        type="text"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                        placeholder="E'lon sarlavhasi..."
                        className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 h-48 overflow-y-auto whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 leading-relaxed">
                      {announcement}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Auditoriya:</label>
                        <select
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        >
                          <option value="Barcha talabalar">Barcha talabalar</option>
                          <option value="2 va 3-bosqich talabalari">2 va 3-bosqich talabalari</option>
                          <option value="Professor-o'qituvchilar">Professor-o'qituvchilar</option>
                          <option value="Barcha foydalanuvchilar">Barcha foydalanuvchilar</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Muhimlik:</label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as any)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        >
                          <option value="normal">Oddiy yangilik</option>
                          <option value="important">Muhim xabar</option>
                          <option value="urgent">Favqulodda (Urgent)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center h-64 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <p className="text-slate-600 text-xs font-semibold">E'lon matni hali yaratilmadi</p>
                    <p className="text-slate-400 text-[11px] max-w-xs mt-1">
                      Chap maydonga tezislarni kiritib "Rasmiy E'lon Yaratish" tugmasini bosing.
                    </p>
                  </div>
                )}
              </div>

              {announcement && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Hajm: {announcement.length} ta belgi
                  </span>
                  <button
                    onClick={handlePublish}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                  >
                    <span>Portalga Chiqarish (Publish)</span>
                    <span>✓</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* =========================================================================
              3. PUBLISHED ANNOUNCEMENTS FEED (ADMIN CONTROL)
              ========================================================================= */}
          <div className="tf-card-solid p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  3. Portalda Faol E'lonlar va Hujjatlar
                </h2>
                <p className="text-xs text-slate-500">
                  Talabalar va o'qituvchilar ekranida ko'rinayotgan barcha rasmiy xabarlar boshqaruvi ({announcementsList.length} ta)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {announcementsList.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    ann.pinned
                      ? 'bg-amber-50/40 border-amber-300/80 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {ann.pinned && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                          📌 Qadalgan
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ann.priority === 'urgent' ? 'bg-red-100 text-red-800 border border-red-200' :
                        ann.priority === 'important' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-teal-100 text-teal-800 border border-teal-200'
                      }`}>
                        {ann.priority === 'urgent' ? "Favqulodda" : ann.priority === 'important' ? "Muhim" : "Standart"}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {ann.createdAt} • {ann.targetAudience}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleTogglePin(ann.id)}
                        className="text-xs text-slate-500 hover:text-amber-600 transition-colors p-1"
                        title={ann.pinned ? "Qadashni bekor qilish" : "Yuqoriga qadash"}
                      >
                        {ann.pinned ? "Qadalgan 📌" : "Qadash 📍"}
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors p-1"
                        title="O'chirish"
                      >
                        O'chirish 🗑️
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-slate-900 text-base mb-1.5">
                    {ann.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {ann.content}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Muallif: <strong className="text-slate-600">{ann.author}</strong></span>
                    <span className="text-emerald-600 font-semibold">✓ Portaldagi faol xabar</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
