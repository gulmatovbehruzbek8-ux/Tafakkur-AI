'use client';

import Sidebar from "@/app/components/Sidebar";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getApiUrl } from "@/lib/api";

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  mode?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    selectedIndex?: number;
  };
}

interface SowDocument {
  id?: string;
  title: string;
  content: string;
  moduleName?: string;
  subjectId?: string;
}

const COURSES = [
  {
    id: 'cs-201',
    name: "Ma'lumotlar tuzilmasi va algoritmlar",
    chapters: [
      "Binar qidiruv daraxtlari (BST)",
      "AVL va Balanslangan daraxtlar",
      "Graf algoritmlari (Dijkstra, BFS)",
      "Xesh jadvallar va to'qnashuvlar",
      "Dinamik dasturlash asoslari"
    ]
  },
  {
    id: 'ai-204',
    name: "Sun'iy intellekt asoslari",
    chapters: [
      "Neyron to'rlar va Perceptron",
      "Gradient tushishi va optimallashtirish",
      "Konvolyutsion to'rlar (CNN)",
      "Transformatorlar va LLM arxitekturasi",
      "Qaror daraxtlari (Decision Trees)"
    ]
  },
  {
    id: 'math-102',
    name: "Oliy Matematika va Chiziqli Algebra",
    chapters: [
      "Xos qiymatlar va xos vektorlar",
      "Matritsalar almashtirishlari",
      "Chiziqli tenglamalar sistemasi",
      "Vektor fazolari va bazis"
    ]
  }
];

const MODES = [
  { id: 'LEARN', label: "O'rganish", icon: "📖", desc: "Nazariy asoslar va vizual tushunchalar" },
  { id: 'PRACTICE', label: "Amaliyot", icon: "💻", desc: "Kod yozish va algoritmik masalalar" },
  { id: 'QUIZ', label: "Viktorina", icon: "🎯", desc: "Interaktiv test va tezkor baholash" },
  { id: 'REVIEW', label: "Takrorlash", icon: "🔄", desc: "Konspekt va xulosalarni mustahkamlash" },
  { id: 'EXAM_PREP', label: "Imtihon Prep", icon: "⚡", desc: "Oraliq nazorat savollari simulyatori" },
];

export default function AITutorPage() {
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(COURSES[0].chapters[0]);
  const [difficulty, setDifficulty] = useState<'Boshlang\'ich' | 'O\'rta' | 'Murakkab' | 'Olimpiada'>('O\'rta');
  const [activeMode, setActiveMode] = useState<'LEARN' | 'PRACTICE' | 'QUIZ' | 'REVIEW' | 'EXAM_PREP'>('LEARN');

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentCourse = COURSES[selectedCourseIndex];

  // Conversation history
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Salom, Bunyodbek! Men sizning **${currentCourse.name}** fani bo'yicha maxsus AI Repetitoringizman.\n\nHozirgi mavzu: **"${COURSES[0].chapters[0]}"**.\n\nQuyidagi tugmalar orqali o'rganish rejimini tanlang yoki savolingizni yo'llang. Agar biror qismni tushunmasangiz, pastdagi **"Boshqacha tushuntir"** vositalaridan foydalaning!`,
      time: '10:45',
      mode: 'LEARN',
      codeSnippet: {
        language: 'cpp',
        code: `// Binar qidiruv daraxti (BST) tuguni
struct Node {
    int key;
    Node* left;
    Node* right;
    Node(int val) : key(val), left(nullptr), right(nullptr) {}
};

// Element qidirish algoritmi - O(log N)
Node* searchBST(Node* root, int target) {
    if (root == nullptr || root->key == target)
        return root;
    if (target < root->key)
        return searchBST(root->left, target);
    return searchBST(root->right, target);
}`
      }
    }
  ]);

  const [sowDocs, setSowDocs] = useState<SowDocument[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tafakkur_sow_resources');
      if (stored) {
        try {
          setSowDocs(JSON.parse(stored));
        } catch {}
      }

      // Check query parameter for initial mode
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get('mode')?.toUpperCase();
      if (urlMode && ['PRACTICE', 'EXAM_PREP', 'QUIZ', 'REVIEW', 'LEARN'].includes(urlMode)) {
        setActiveMode(urlMode as any);
        setTimeout(() => {
          if (urlMode === 'PRACTICE') {
            handleSend("Ushbu mavzu bo'yicha amaliy dasturlash topshirig'i va masala ber", 'PRACTICE');
          } else if (urlMode === 'EXAM_PREP') {
            handleSend("Oraliq nazorat imtihoni uchun simulyatsiya savollari va keyslarini ber", 'EXAM_PREP');
          } else if (urlMode === 'QUIZ') {
            handleSend("Viktorina savoli ber", 'QUIZ');
          }
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (overrideText?: string, modeOverride?: 'LEARN' | 'PRACTICE' | 'QUIZ' | 'REVIEW' | 'EXAM_PREP') => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    const currentActiveMode = modeOverride || activeMode;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!overrideText) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "";
      let code: { language: string; code: string } | undefined;
      let quiz: Message['quiz'] | undefined;

      const lower = textToSend.toLowerCase();

      if (currentActiveMode === 'QUIZ' || lower.includes('viktorina') || lower.includes('test')) {
        aiText = `Ajoyib! **${selectedChapter}** mavzusi bo'yicha tezkor sinov savoli:\n\nQuyidagi variantlardan qaysi biri to'g'ri?`;
        quiz = {
          question: `Balanslanmagan eng yomon holatda Binar Qidiruv Daraxti (BST) da qidirish murakkabligi qanchaga teng bo'ladi?`,
          options: [
            "O(1)",
            "O(log N)",
            "O(N)",
            "O(N log N)"
          ],
          correctIndex: 2,
          explanation: "To'g'ri javob: O(N). Agar daraxtga elementlar o'sish tartibida kiritilsa, daraxt bir tomonga cho'zilib, oddiy bog'langan ro'yxat (linked list) ga aylanadi va qidirish O(N) ga tushadi. Buni oldini olish uchun AVL yoki Qizil-Qora daraxtlar ishlatiladi."
        };
      } else if (currentActiveMode === 'PRACTICE' || lower.includes('amaliyot') || lower.includes('masala') || lower.includes('topshiriq')) {
        aiText = `💻 **AMALIYOT DASTURLASH TOPSHIRIG'I**\n📚 **Fan:** ${currentCourse.name}\n📌 **Mavzu:** ${selectedChapter}\n🎯 **Qiyinlik darajasi:** ${difficulty}\n\n` +
          `**Masala Sharti:**\n` +
          `Sizga butun sonlardan iborat massiv berilgan. Ushbu elementlardan foydalanib Binar Qidiruv Daraxtini (BST) quring va undagi eng kichik $K$-chi elementni topuvchi funksiyani yozing.\n\n` +
          `**Cheklovlar:**\n` +
          `• $1 \\le N \\le 10^5$\n` +
          `• $1 \\le K \\le N$\n` +
          `• Vaqt chegarasi: 1.0 soniya, Xotira: 64 MB\n\n` +
          `**Kiruvchi ma'lumot:**\n` +
          `[5, 3, 6, 2, 4, null, null, 1], K = 3\n\n` +
          `**Chiquvchi ma'lumot:**\n` +
          `3\n\n` +
          `Quyidagi boshlang'ich andozani to'ldirib, o'z yechimingizni chatga yuboring:`;
        code = {
          language: 'python',
          code: `# Python 3: K-chi eng kichik elementni topish (In-order traversal)
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def kthSmallest(self, root: TreeNode, k: int) -> int:
        # TODO: Yechimingizni shu yerga yozing
        # Maslahat: In-order traversing elementlarni o'sish tartibida aylanadi!
        stack = []
        curr = root
        
        while curr or stack:
            while curr:
                stack.append(curr)
                curr = curr.left
            curr = stack.pop()
            k -= 1
            if k == 0:
                return curr.val
            curr = curr.right
            
        return -1`
        };
      } else if (currentActiveMode === 'EXAM_PREP' || lower.includes('imtihon') || lower.includes('oraliq') || lower.includes('nazorat') || lower.includes('simulyats')) {
        aiText = `⚡ **ORALIQ NAZORAT IMTIHONI SIMULYATORI (100 BALL)**\n` +
          `🏢 **Urganch Davlat Universiteti • O'quv Dasturi (SOW)**\n` +
          `📚 **Fan:** ${currentCourse.name}\n` +
          `📌 **Bob:** ${selectedChapter}\n\n` +
          `Imtihon qoidalari: Sizga quyidagi 3 ta topshiriq beriladi. O'z javoblaringizni yozib jo'nating, AI Repetitor sizni haqiqiy imtihon mezoni asosida baholaydi:\n\n` +
          `1️⃣ **Nazariy Savol (25 Ball):**\n` +
          `Binar Qidiruv Daraxti (BST) va AVL Balanslangan Daraxti o'rtasidagi asosiy farqlarni tushuntiring. AVL daraxtida aylantirishlar (Rotations: LL, RR, LR, RL) nima uchun zarur?\n\n` +
          `2️⃣ **Algoritm va Kod Yozish (50 Ball):**\n` +
          `Berilgan ixtiyoriy binar daraxt haqiqiy Binar Qidiruv Daraxti (Valid BST) ekanligini $O(N)$ vaqt va $O(H)$ xotirada tekshiruvchi algoritm yozing.\n\n` +
          `3️⃣ **Vaziyatli Keys / Arxitektura (25 Ball):**\n` +
          `10 million foydalanuvchiga ega elektron ta'lim tizimida talabalar reytingini real vaqtda yangilab turish uchun qaysi ma'lumotlar tuzilmasini tanlaysiz va nega?`;
        code = {
          language: 'cpp',
          code: `// 2-savol uchun C++ shabloni: Valid BST tekshirish
#include <iostream>
#include <climits>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

bool isValidBSTHelper(TreeNode* node, long long minVal, long long maxVal) {
    if (!node) return true;
    if (node->val <= minVal || node->val >= maxVal) return false;
    return isValidBSTHelper(node->left, minVal, node->val) &&
           isValidBSTHelper(node->right, node->val, maxVal);
}

bool isValidBST(TreeNode* root) {
    return isValidBSTHelper(root, LLONG_MIN, LLONG_MAX);
}`
        };
      } else if (lower.includes('oddiy') || lower.includes('sodda')) {
        aiText = `💡 **Oddiy tilda tushuntirish:**\n\nBinar qidiruv daraxtini telefon kitobiga o'xshatish mumkin. Tasavvur qiling, siz kitobning o'rtasini ochasiz. Agar qidirayotgan familiyangiz o'rtadagi harfdan oldin kelsa — faqat chap yarmini tekshirasiz, agar keyin kelsa — faqat o'ng yarmini. Har bir qadamda variantlarning yarmi tashlab yuboriladi!`;
      } else if (lower.includes('analogiya') || lower.includes('hayotiy')) {
        aiText = `🎭 **Hayotiy analogiya:**\n\nTasavvur qiling, siz supermarketda mahsulot izlayapsiz. Har bir chorrahada yo'l ikkiga bo'linadi: narxi 50,000 dan arzonlari chapga, qimmatlari o'ngga. Siz butun do'konni aylanib chiqmasdan, atigi 4-5 ta belgi orqali kerakli rastani topib borasiz. Mana shu $O(\\log N)$ tezlikdir!`;
      } else if (lower.includes('misol') || lower.includes('kod')) {
        aiText = `💻 **Python da BST ga element qo'shish (Insertion):**\n\nQuyida element qo'shish rekursiv algoritmi keltirilgan:`;
        code = {
          language: 'python',
          code: `class TreeNode:
    def __init__(self, key):
        self.val = key
        self.left = None
        self.right = None

def insert(root, key):
    if root is None:
        return TreeNode(key)
    if key < root.val:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root`
        };
      } else if (lower.includes('sinab') || lower.includes('challenge')) {
        aiText = `⚔️ **Amaliy Challenge:**\n\nBerilgan BST da eng kichik (minimum) elementni qanday topasiz? Yechim g'oyasi yoki kodini yozib bering!`;
      } else if (lower.includes('xulosa') || lower.includes('konspekt')) {
        aiText = `📝 **Mavzu Xulosasi (Cheat Sheet):**\n\n1. **Asosiy qoida**: Left < Root < Right.\n2. **O'rtacha vaqt**: Qidirish, qo'shish, o'chirish — $O(\\log N)$.\n3. **Eng yomon holat**: $O(N)$ (agar balanslanmagan bo'lsa).\n4. **Inorder aylanib chiqish** (Left, Root, Right) elementlarni tartiblangan holda chiqaradi.`;
      } else {
        // Asynchronously query live /api/chat with timeout & graceful fallback
        (async () => {
          let liveText = "";
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 7000);
            const res = await fetch(getApiUrl('/api/chat'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                question: textToSend,
                context: `${currentCourse.name}: ${selectedChapter}`,
                model: 'llama3'
              }),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res.ok) {
              const data = await res.json();
              liveText = data.answer || data.response || "";
            }
          } catch {}

          if (!liveText) {
            // Check for matching Admin SOW document
            const matchingSow = sowDocs.find((doc: SowDocument) => {
              const titleLower = (doc.title || '').toLowerCase();
              const contentLower = (doc.content || '').toLowerCase();
              const words = lower.split(' ').filter((w: string) => w.length > 3);
              return words.some((w: string) => titleLower.includes(w) || contentLower.includes(w));
            });

            if (matchingSow) {
              liveText = `Assalomu alaykum! Ma'muriyat tomonidan tasdiqlangan rasmiy o'quv dasturi (SOW) asosida ma'lumot topildi:\n\n` +
                `📚 **Rasmiy Hujjat:** ${matchingSow.title}\n` +
                `📌 **Modul:** ${matchingSow.moduleName || 'Umumiy Reja'}\n\n` +
                `${matchingSow.content}\n\n` +
                `✅ *Ushbu ma'lumot universitet dekanati tomonidan yuklangan rasmiy resurslar asosida berildi.*`;
            } else {
              liveText = `Tushunarli! **${selectedChapter}** bo'yicha ko'rib chiqayotgan masalangiz juda muhim. Ushbu algoritm oraliq nazorat imtihonida 20% vaznga ega.\n\nSavolingiz bo'yicha ma'ruza konspekti yoki amaliy topshiriq kerak bo'lsa, istalgan vaqtda yozishingiz mumkin!`;
            }
          }

          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'ai',
              text: liveText,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              mode: currentActiveMode,
              codeSnippet: code,
              quiz: quiz,
            }
          ]);
          setIsTyping(false);
        })();
        return;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: currentActiveMode,
          codeSnippet: code,
          quiz: quiz,
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuizSelect = (msgId: string, optionIndex: number) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id === msgId && m.quiz) {
          return {
            ...m,
            quiz: {
              ...m.quiz,
              selectedIndex: optionIndex
            }
          };
        }
        return m;
      })
    );
  };

  const handleExplainDifferently = (type: 'simple' | 'analogy' | 'code' | 'challenge' | 'summarize') => {
    const prompts = {
      simple: "Iltimos, ushbu mavzuni sodda va tushunarli so'zlar bilan tushuntirib bering.",
      analogy: "Mavzuni tushunishim uchun hayotiy bir o'xshatish yoki analogiya keltiring.",
      code: "Bu qoidani amaliy dasturiy kod va batafsil misol bilan ko'rsating.",
      challenge: "Bilimimni sinab ko'rish uchun menga murakkabroq challenge topshiriq bering.",
      summarize: "Ushbu tushunchaning asosiy xulosalarini qisqa konspekt shaklida bering.",
    };
    handleSend(prompts[type]);
  };

  return (
    <div className="tf-page">
      <Sidebar role="student" activeRoute="/student/tutor" />

      <main className="tf-main pb-16">
        <div className="tf-container space-y-6">

          {/* =========================================================================
              1. ACADEMIC CONTEXT HEADER: COURSE, CHAPTER, DIFFICULTY & GOAL
              ========================================================================= */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-[#07101B] dark:via-[#0c1e30] dark:to-[#072438] rounded-3xl p-6 sm:p-8 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-xl space-y-6 animate-fade-up">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-50 text-blue-700 border border-blue-200">
                    ⚡ TAFAKKUR AI TUTOR
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Urganch Davlat Universiteti • Akademik Yordamchi
                  </span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Intellektual Universitet Repetitori
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
                  Har bir fanning o'quv rejasi (SOW) bilan to'liq sinxronlangan kontekstual ta'lim muhiti
                </p>
              </div>

              {/* Quick Links */}
              <div className="flex items-center gap-2">
                <Link
                  href="/student/courses"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-white/15 transition-colors"
                >
                  Kurslar Workspacesi →
                </Link>
                <Link
                  href="/student"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors"
                >
                  Kampusga qaytish
                </Link>
              </div>
            </div>

            {/* Academic Context Selectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
              {/* Course */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Fan (Course):
                </label>
                <select
                  value={selectedCourseIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setSelectedCourseIndex(idx);
                    setSelectedChapter(COURSES[idx].chapters[0]);
                  }}
                  className="w-full bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-medium focus:outline-none focus:border-blue-500"
                >
                  {COURSES.map((c, i) => (
                    <option key={c.id} value={i} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Mavzu / Bob (Chapter):
                </label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-medium focus:outline-none focus:border-blue-500 truncate"
                >
                  {currentCourse.chapters.map((ch, i) => (
                    <option key={i} value={ch} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white truncate">
                      {ch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Qiyinlik Darajasi:
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-white/10 border border-slate-200 dark:border-white/15 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="Boshlang'ich" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Boshlang'ich (Fundamental)</option>
                  <option value="O'rta" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">O'rta (Universitet standardi)</option>
                  <option value="Murakkab" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Murakkab (Chuqurlashtirilgan)</option>
                  <option value="Olimpiada" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Olimpiada / Xakaton darajasi</option>
                </select>
              </div>

              {/* Active Context Status */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Joriy Maqsad:
                </label>
                <div className="w-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl px-3 py-2 text-blue-700 dark:text-blue-300 font-semibold flex items-center justify-between">
                  <span>Oraliq nazoratga tayyorgarlik</span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              2. LEARNING MODES SELECTOR (TABS)
              ========================================================================= */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {MODES.map((mode) => {
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    const newMode = mode.id as any;
                    setActiveMode(newMode);
                    if (newMode === 'QUIZ') {
                      handleSend("Viktorina savoli ber", 'QUIZ');
                    } else if (newMode === 'REVIEW') {
                      handleSend("Mavzu bo'yicha xulosa konspekt ber", 'REVIEW');
                    } else if (newMode === 'PRACTICE') {
                      handleSend("Ushbu mavzu bo'yicha amaliy dasturlash topshirig'i va masala ber", 'PRACTICE');
                    } else if (newMode === 'EXAM_PREP') {
                      handleSend("Oraliq nazorat imtihoni uchun simulyatsiya savollari va keyslarini ber", 'EXAM_PREP');
                    } else if (newMode === 'LEARN') {
                      handleSend("Mavzuning nazariy tushunchasini batafsil o'rganishni boshlaymiz", 'LEARN');
                    }
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    isActive
                      ? 'bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-600 shadow-md ring-2 ring-blue-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{mode.icon}</span>
                    <span className="font-display font-bold text-xs">{mode.label}</span>
                  </div>
                  <p className={`text-[10px] leading-tight line-clamp-2 ${isActive ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {mode.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* =========================================================================
              3. "EXPLAIN DIFFERENTLY" QUICK ACTION TOOLBAR
              ========================================================================= */}
          <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Boshqacha tushuntir (Explain Differently):
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => handleExplainDifferently('simple')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
              >
                💡 Oddiy tilda
              </button>
              <button
                onClick={() => handleExplainDifferently('analogy')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
              >
                🎭 Hayotiy analogiya
              </button>
              <button
                onClick={() => handleExplainDifferently('code')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
              >
                💻 Kod va misol
              </button>
              <button
                onClick={() => handleExplainDifferently('challenge')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
              >
                ⚔️ Meni sinab ko'r
              </button>
              <button
                onClick={() => handleExplainDifferently('summarize')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
              >
                📝 Xulosa konspekt
              </button>
            </div>
          </div>

          {/* =========================================================================
              4. CONVERSATION WORKSPACE: VISUALLY RICH MESSAGE FEED
              ========================================================================= */}
          <div className="bg-white dark:bg-[#121215] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col h-[600px] overflow-hidden">
            {/* Feed Header */}
            <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {currentCourse.name}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  {selectedChapter}
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                Rejim: <strong className="text-slate-800 dark:text-slate-200">{activeMode}</strong> | Qiyinlik: {difficulty}
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#fbfcff] dark:bg-[#09090b]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    {m.sender === 'ai' ? (
                      <>
                        <span className="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                          AI
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Tafakkur Repetitor</span>
                        {m.mode && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 uppercase">
                            {m.mode}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Bunyodbek Gulmatov</span>
                        <span className="w-5 h-5 rounded-lg bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold">
                          BG
                        </span>
                      </>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">{m.time}</span>
                  </div>

                  <div
                    className={`max-w-[90%] sm:max-w-[80%] p-4.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-xs font-medium'
                        : 'bg-white dark:bg-[#18181b] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-tl-xs'
                    }`}
                  >
                    {m.text}

                    {/* Code snippet with syntax box */}
                    {m.codeSnippet && (
                      <div className="mt-3.5 rounded-xl overflow-hidden bg-slate-950 text-slate-200 border border-slate-800 text-xs font-mono">
                        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{m.codeSnippet.language.toUpperCase()}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(m.codeSnippet!.code)}
                            className="hover:text-blue-300 transition-colors"
                          >
                            Nusxa olish 📋
                          </button>
                        </div>
                        <pre className="p-4 overflow-x-auto text-[11.5px] leading-relaxed">
                          <code>{m.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Interactive Quiz Block */}
                    {m.quiz && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                        <h4 className="font-display font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {m.quiz.question}
                        </h4>

                        <div className="space-y-2">
                          {m.quiz.options.map((opt, optIdx) => {
                            const isSelected = m.quiz?.selectedIndex === optIdx;
                            const isCorrect = m.quiz?.correctIndex === optIdx;
                            const hasAnswered = m.quiz?.selectedIndex !== undefined;

                            let btnStyle = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200";
                            if (hasAnswered) {
                              if (isCorrect) btnStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold";
                              else if (isSelected) btnStyle = "bg-red-50 dark:bg-red-950/40 border-red-400 text-red-900 dark:text-red-200 line-through";
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={hasAnswered}
                                onClick={() => handleQuizSelect(m.id, optIdx)}
                                className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{String.fromCharCode(65 + optIdx)}) {opt}</span>
                                {hasAnswered && isCorrect && <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ To'g'ri</span>}
                                {hasAnswered && isSelected && !isCorrect && <span className="text-red-600 dark:text-red-400 font-bold">✗ Xato</span>}
                              </button>
                            );
                          })}
                        </div>

                        {m.quiz.selectedIndex !== undefined && (
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-950 dark:text-blue-200 text-xs leading-relaxed animate-fade-up">
                            <strong className="block mb-0.5">Izoh:</strong>
                            {m.quiz.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 w-28">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white dark:bg-[#121215] border-t border-slate-200 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`"${selectedChapter}" bo'yicha savol bering yoki kod so'rang...`}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Yuborish</span>
                  <span>→</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
