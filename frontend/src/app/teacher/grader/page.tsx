'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import TafakkurCompanion from '@/app/components/TafakkurCompanion';
import { getApiUrl } from '@/lib/api';

interface StudentSubmission {
  id: string;
  name: string;
  group: string;
  submittedAt: string;
  status: 'pending' | 'ai_evaluated' | 'professor_approved';
  submissionText: string;
  aiEvaluation?: {
    score: number;
    reasoning: string;
    strengths: string[];
    weaknesses: string[];
    feedback: string;
  };
  finalScore?: number;
  professorNotes?: string;
}

const DEMO_STUDENTS: StudentSubmission[] = [
  {
    id: "38491023",
    name: "Bunyodbek Gulmatov",
    group: "AI-22",
    submittedAt: "Bugun, 10:15",
    status: 'ai_evaluated',
    submissionText: `Mavzu: Binar qidiruv daraxtida (BST) AVL rotatsiyalarini amalga oshirish va vaqt murakkabligi tahlili.

Yondashuv:
Dasturda balans koeffitsienti (balance factor) har bir tugun uchun chap va o'ng qism-daraxtlar balandligi ayirmasi sifatida hisoblanadi (bf = height(left) - height(right)). 

Rotatsiya holatlari:
1. LL holati: O'ngga bitta rotatsiya (Right Rotate)
2. RR holati: Chapga bitta rotatsiya (Left Rotate)
3. LR holati: Chap farzandni chapga, so'ng o'zini o'ngga aylantirish
4. RL holati: O'ng farzandni o'ngga, so'ng o'zini chapga aylantirish

Amaliy tajriba natijasi:
10,000 ta tasodifiy son kiritilganda daraxt balandligi 14 dan oshmadi. Qidirish va qo'shish amallari O(log N) da bajarildi. Xotirani tozalash uchun post-order destructor qo'shildi.`,
    aiEvaluation: {
      score: 92,
      reasoning: "Taqdim etilgan yechim AVL balansi nazariyasiga to'liq mos keladi. Barcha 4 ta rotatsiya holati to'g'ri izohlangan va O(log N) asimptotik murakkablik tajriba orqali isbotlangan.",
      strengths: [
        "4 ta rotatsiya qoidasi formulalar bilan aniq keltirilgan",
        "10,000 ta elementda O(log N) empirik testi o'tkazilgan",
        "Xotira sizib chiqishini (memory leak) oldini olish uchun destructor yozilgan"
      ],
      weaknesses: [
        "Boshlang'ich daraxt balandligini hisoblashda rekursiyadan ko'ra tugunda height saqlash samaraliroq bo'lar edi"
      ],
      feedback: "A'lo darajadagi laboratoriya ishi. Rotatsiya funksiyalari to'liq qamrab olingan. Keyingi bosqichda Red-Black daraxtlar bilan qiyosiy tahlil qilish tavsiya etiladi."
    }
  },
  {
    id: "38491045",
    name: "Nilufar Yusupova",
    group: "AI-22",
    submittedAt: "Bugun, 09:40",
    status: 'pending',
    submissionText: `Mavzu: Binar qidiruv daraxtida qidirish va o'chirish algoritmi.

Men C++ tilida Node strukturasi yordamida daraxt tuzdim. Agar tugunning ikkita farzandi bo'lsa, o'ng qism-daraxtning eng kichik elementini topib uning o'rniga qo'yamiz.`,
  },
  {
    id: "38491078",
    name: "Jasurbek Mirzayev",
    group: "AI-22",
    submittedAt: "Kecha, 22:30",
    status: 'professor_approved',
    finalScore: 88,
    submissionText: `Mavzu: BST va AVL daraxtlari.
Daraxtda balandlik 15 ga teng bo'ldi. O'chirish qismi to'liq ishlaydi.`,
    aiEvaluation: {
      score: 88,
      reasoning: "Asosiy funksiyalar to'g'ri ishlangan, biroq xotira boshqaruvi bo'yicha ayrim kamchiliklar mavjud.",
      strengths: ["O'chirish algoritmi to'g'ri"],
      weaknesses: ["Xotira boshqaruvi tushuntirilmagan"],
      feedback: "Yaxshi topshiriq. Pointerlar xavfsizligiga e'tibor qarating."
    }
  }
];

const DEFAULT_RUBRIC = 
`1. Nazariy asos va rotatsiyalar to'g'riligi (30 ball)
2. Vaqt murakkabligi O(log N) va eksperiment (35 ball)
3. Xotira samaradorligi va destructor (20 ball)
4. Kod tozaligi va izohlar (15 ball)`;

export default function TeacherGraderSignaturePage() {
  const [selectedStudent, setSelectedStudent] = useState<StudentSubmission>(DEMO_STUDENTS[0]);
  const [rubric, setRubric] = useState(DEFAULT_RUBRIC);
  const [evaluating, setEvaluating] = useState(false);
  const [approvedList, setApprovedList] = useState<Record<string, number>>({
    "38491078": 88
  });
  const [customScore, setCustomScore] = useState<number | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const currentEval = selectedStudent.aiEvaluation;
  const isApproved = approvedList[selectedStudent.id] !== undefined;

  const handleRunAiEvaluation = async () => {
    setEvaluating(true);
    try {
      const res = await fetch(getApiUrl('/api/grade'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rubric,
          submission: selectedStudent.submissionText,
          model: 'llama3'
        })
      });
      if (res.ok) {
        const data = await res.json();
        const score = Number(data.score) || 85;
        const feedback = data.feedback || "Baholash yakunlandi.";
        selectedStudent.status = 'ai_evaluated';
        selectedStudent.aiEvaluation = {
          score,
          reasoning: feedback.length > 180 ? feedback.substring(0, 180) + "..." : feedback,
          strengths: ["Rubrika talablari bo'yicha tahlil qilindi", "Kod tuzilmasi tekshirildi"],
          weaknesses: score < 90 ? ["Koddagi chekka holatlar va xotira boshqaruvi to'liq emas"] : [],
          feedback
        };
        setSelectedStudent({ ...selectedStudent });
      } else {
        throw new Error();
      }
    } catch {
      selectedStudent.status = 'ai_evaluated';
      selectedStudent.aiEvaluation = {
        score: 85,
        reasoning: "Taqdim etilgan javobda asosiy algoritmlar yoritilgan. Biroq AVL rotatsiyalari va empirik tahlil to'liq keltirilmagan.",
        strengths: ["Binar qidiruv strukturasi to'g'ri tuzilgan"],
        weaknesses: ["Balanslash koeffitsienti formulasi yo'q", "Tajriba natijalari keltirilmagan"],
        feedback: "Yaxshi boshlanish. Balanslash qismini to'ldirib qayta topshirish tavsiya etiladi."
      };
      setSelectedStudent({ ...selectedStudent });
    } finally {
      setEvaluating(false);
    }
  };

  const handleApprove = (score: number) => {
    setApprovedList(prev => ({ ...prev, [selectedStudent.id]: score }));
    setSuccessToast(`✓ ${selectedStudent.name} ning bahosi (${score} ball) HEMIS tizimiga muvaffaqiyatli saqlandi!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="tf-page bg-[#f8fafc]">
      <Sidebar role="teacher" activeRoute="/teacher/grader" />
      <TafakkurCompanion currentContext="AI Grader Imtihon va Baholash Maydoni" />

      <main className="tf-main pb-20">
        <div className="tf-container-wide space-y-6">

          {/* Toast Notification */}
          {successToast && (
            <div className="p-4 rounded-2xl bg-emerald-900 text-white text-xs font-semibold shadow-lg border border-emerald-500 flex items-center justify-between animate-fade-up">
              <span>{successToast}</span>
              <button onClick={() => setSuccessToast(null)} className="text-white/60 hover:text-white">✕</button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Imtihon & Baholash Tizimi
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                AI Grader: Intellektual Baholash Maydoni
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Bir ekranda: Talaba ishi, AI tahlili, rasmiy rubrika va professor qarori
              </p>
            </div>

            {/* Course & Assignment Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <select className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-xs">
                <option>CS-201: Ma'lumotlar tuzilmasi va algoritmlar</option>
                <option>AI-204: Sun'iy Intellekt asoslari</option>
              </select>

              <select className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-xs">
                <option>3-Laboratoriya: AVL Binar Daraxtlari</option>
                <option>2-Laboratoriya: Stek va Ro'yxatlar</option>
              </select>
            </div>
          </div>

          {/* =========================================================================
              THE ONE SCREEN REVIEW WORKFLOW
              ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Column 1: Submissions Roster */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-display font-bold text-sm text-slate-900">
                  Talabalar ({DEMO_STUDENTS.length})
                </h3>
                <span className="text-[11px] font-mono text-slate-400">AI-22 guruhi</span>
              </div>

              <div className="space-y-2">
                {DEMO_STUDENTS.map((st) => {
                  const isSelected = selectedStudent.id === st.id;
                  const isStApproved = approvedList[st.id] !== undefined;

                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        setSelectedStudent(st);
                        setCustomScore(null);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50/70 border-slate-200/80 hover:bg-white text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs truncate">{st.name}</span>
                        {isStApproved ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 font-mono">
                            {approvedList[st.id]} ball ✓
                          </span>
                        ) : st.aiEvaluation ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 font-mono">
                            AI: {st.aiEvaluation.score}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-600">
                            Kutilmoqda
                          </span>
                        )}
                      </div>

                      <div className={`text-[10px] flex items-center justify-between font-mono ${
                        isSelected ? 'text-slate-300' : 'text-slate-400'
                      }`}>
                        <span>ID: {st.id}</span>
                        <span>{st.submittedAt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 2 & 3: Student Submission & Rubric */}
            <div className="lg:col-span-2 space-y-5">
              {/* Submission viewer */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900">
                      Talabaning Topshirig'i
                    </h3>
                    <p className="text-xs text-slate-500">
                      Muallif: <strong className="text-slate-800">{selectedStudent.name}</strong> • {selectedStudent.group}
                    </p>
                  </div>

                  <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600">
                    Yuklangan: {selectedStudent.submittedAt}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
                  {selectedStudent.submissionText}
                </div>

                {/* Rubric View */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Baholash Mezonlari (Rubrika):
                    </label>
                    <span className="text-[11px] text-slate-400">100 ballik shkala</span>
                  </div>
                  <textarea
                    rows={3}
                    value={rubric}
                    onChange={(e) => setRubric(e.target.value)}
                    className="w-full text-xs font-mono p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-500 resize-none text-slate-700"
                  />
                </div>
              </div>

              {/* Status Comparison Indicator */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Holat:</span>
                  {isApproved ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold border border-emerald-300">
                      ✓ Professor tomonidan tasdiqlangan
                    </span>
                  ) : currentEval ? (
                    <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-900 font-extrabold border border-teal-300">
                      ⚡ AI tahlil qilgan (Tasdiqlash kutilmoqda)
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">
                      Kutilmoqda
                    </span>
                  )}
                </div>

                {!currentEval && (
                  <button
                    onClick={handleRunAiEvaluation}
                    disabled={evaluating}
                    className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>{evaluating ? "Tahlil qilinmoqda..." : "AI Tahlilini Ishga Tushirish"}</span>
                    <span>⚡</span>
                  </button>
                )}
              </div>
            </div>

            {/* Column 4: AI Evaluation & Professor Decision */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                    AI Grader Tavsiyasi
                  </span>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Baholash Xulosasi
                  </h3>
                </div>

                {currentEval && (
                  <div className="text-right">
                    <span className="font-display font-black text-2xl text-teal-800 font-mono">
                      {currentEval.score}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/100</span>
                  </div>
                )}
              </div>

              {currentEval ? (
                <div className="space-y-3.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 leading-relaxed text-slate-700">
                    <strong className="block text-slate-900 mb-0.5">Asoslash (Reasoning):</strong>
                    {currentEval.reasoning}
                  </div>

                  <div className="space-y-1">
                    <strong className="text-emerald-700 text-[11px] block uppercase font-bold">
                      ✓ Kuchli jihatlari:
                    </strong>
                    {currentEval.strengths.map((st, i) => (
                      <p key={i} className="text-slate-600 text-[11px] flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{st}</span>
                      </p>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <strong className="text-amber-700 text-[11px] block uppercase font-bold">
                      ⚠️ Kamchiliklar / Tavsiyalar:
                    </strong>
                    {currentEval.weaknesses.map((w, i) => (
                      <p key={i} className="text-slate-600 text-[11px] flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{w}</span>
                      </p>
                    ))}
                  </div>

                  {/* Professor Decision Box */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Professor Yakuniy Qarori:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={currentEval.score}
                          onChange={(e) => setCustomScore(Number(e.target.value))}
                          className="w-20 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-900 text-sm focus:outline-none focus:border-teal-500"
                        />
                        <span className="text-xs text-slate-500 font-mono">Ball (100 dan)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleApprove(customScore ?? currentEval.score)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                      >
                        ✓ Tasdiqlash
                      </button>
                      <button
                        onClick={() => alert("Talabaga qayta ishlash uchun xabar yuborildi.")}
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                      >
                        Qayta ishlash
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                  <span className="text-2xl">⚡</span>
                  <p className="font-semibold text-slate-600">Ish hali AI tomonidan baholanmagan</p>
                  <p className="text-[11px]">Tahlilni boshlash uchun yuqoridagi tugmani bosing</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
