"use client";

import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import { getApiUrl } from '@/lib/api';

export default function AdminNewsPage() {
  const [bulletPoints, setBulletPoints] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
      setAnnouncement(data.response);
    } catch (error) {
      console.error(error);
      setAnnouncement("[MOCK/DEMO - Mahalliy Ollama ulanmagan]\n\nHURMATLI TALABALAR VA PROFESSOR-O'QITUVCHILAR!\n\nUniversitet ma'muriyati quyidagilarni rasman ma'lum qiladi:\n\n• Ushbu rasmiy xabar Tafakkur AI yordamida tezkor generatsiya qilindi.\n• Ko'rsatilgan asosiy ma'lumotlar to'liq tekshirildi va tasdiqlandi.\n\nQo'shimcha savollar bo'yicha dekanat yoki rektorat matbuot xizmatiga murojaat qilishingiz mumkin.");
    } finally {
      setLoading(false);
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
      
      <main className="tf-main">
        <div className="tf-container space-y-6">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rektorat Axborot Xizmati</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">E'lonlar va Yangiliklar Generatori</h1>
              <p className="text-slate-500 text-sm mt-0.5">Qisqa tezislarni Tafakkur AI yordamida rasmiy universitet e'loniga aylantirish</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
                Tafakkur AI Press
              </span>
            </div>
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="tf-card-solid p-6 md:p-8 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">
                    Asosiy Fikrlar va Tezislar
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
                  <label className="block text-xs font-semibold text-slate-600 mb-2">E'lon mazmuni (Tezislar)</label>
                  <textarea 
                    className="w-full border border-slate-200 rounded-xl bg-slate-50/50 p-4 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 outline-none transition-all resize-none font-sans leading-relaxed"
                    rows={6} 
                    placeholder="Masalan:&#10;- Xakaton 17-20 sentyabrda o'tkaziladi&#10;- Barcha talabalar ishtirok etishi mumkin&#10;- G'oliblar esdalik sovg'alari bilan taqdirlanadi" 
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
            
            {/* Output Section */}
            <div className="tf-card-solid p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <h2 className="font-display text-lg font-bold text-ink">Tayyor Rasmiy Hujjat</h2>
                  </div>
                  {announcement && (
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-teal-600 hover:bg-teal-50 border border-slate-200 transition-colors"
                    >
                      {copied ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-emerald-600">Nusxalandi!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Nusxa olish
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {loading ? (
                  <div className="flex flex-col justify-center items-center h-72 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                    <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-slate-600 text-xs font-semibold">Tafakkur AI tahrirlamoqda...</p>
                    <p className="text-slate-400 text-[11px] mt-1">Rasmiy uslub va orfoepiya tekshirilmoqda</p>
                  </div>
                ) : announcement ? (
                  <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 h-72 overflow-y-auto whitespace-pre-wrap font-sans text-sm text-slate-800 leading-relaxed">
                    {announcement}
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center h-72 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <p className="text-slate-600 text-xs font-semibold">E'lon matni hali yaratilmadi</p>
                    <p className="text-slate-400 text-[11px] max-w-xs mt-1">
                      Chap tarafdagi maydonga qisqa fikrlarni kiritib, "Rasmiy E'lon Yaratish" tugmasini bosing.
                    </p>
                  </div>
                )}
              </div>

              {announcement && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Hajm: {announcement.length} ta belgi</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Portalga chiqarishga tayyor
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
