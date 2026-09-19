'use client';

import Sidebar from "@/app/components/Sidebar";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { getApiUrl } from "@/lib/api";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import HeaderControls from "@/app/components/HeaderControls";

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function StudentChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: "Assalomu alaykum, Bunyodbek! Men Tafakkur AI — sizning shaxsiy ta'lim yordamchingizman. Dars materiallari, o'quv dasturi (SOW), mustaqil ishlar yoki nazorat savollari bo'yicha qanday yordam bera olaman?",
      timestamp: 'Hozir'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterQuestions = [
    "Algoritmlar nazariyasi bo'yicha 2-topshiriq muddati qachon?",
    "Binar qidiruv daraxti (BST) algoritmini oddiy tushuntirib ber",
    "Oraliq nazoratga tayyorlanish uchun 5 ta muhim savol tuz",
    "Mening joriy semestrdagi o'rtacha GPA ko'rsatkichim qanday?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText.trim(),
      timestamp: timeString
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText.trim(), role: 'student', model: 'llama-3.3-70b-versatile' })
      });

      const data = await response.json();
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data.response || "Kechirasiz, javob olishda xatolik yuz berdi.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      let localGroundedText = "";
      try {
        const stored = localStorage.getItem('tafakkur_sow_resources');
        if (stored) {
          const list = JSON.parse(stored);
          const lowerQ = userText.toLowerCase();
          const match = list.find((r: any) => 
            lowerQ.includes(r.subjectName?.toLowerCase()) ||
            lowerQ.includes(r.title?.toLowerCase()) ||
            (lowerQ.includes('bst') && (r.content?.includes('BST') || r.title?.includes('BST'))) ||
            (lowerQ.includes('topshiriq') && r.content?.includes('topshiriq')) ||
            (lowerQ.includes('muddati') && r.content?.includes('muddati')) ||
            (lowerQ.includes('sillabus') && r.resourceType === 'syllabus')
          );
          if (match) {
            localGroundedText = `📚 **SOW & Bilimlar Bazasidan Olingan Rasmiy Ma'lumot:**\n\n📌 **Fan:** ${match.subjectName}\n📄 **Hujjat:** ${match.title} (${match.moduleName})\n\n💡 **Mazmun:**\n${match.content}\n\n✅ *Ushbu ma'lumot universitet ma'muriyati yuklagan rasmiy SOW o'quv dasturi asosida taqdim etildi.*`;
          }
        }
      } catch {}

      const mockMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: localGroundedText || `[Tafakkur AI • Ta'lim Tizimi]\n\nSavolingiz: "${userText}"\n\n1. O'quv rejasiga binoan, ushbu mavzu o'quv dasturi (SOW) doirasida qamrab olingan.\n2. Tegishli ma'ruza matnlari va amaliy ko'rsatmalarni "O'quv rejasi (SOW)" bo'limidan ko'rishingiz mumkin.\n3. Qo'shimcha nazorat savollari kerak bo'lsa, istalgan vaqtda so'rashingiz mumkin!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, mockMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="tf-page">
      <Sidebar role="student" activeRoute="/student/chatbot" />
      
      <main className="tf-main flex flex-col h-screen overflow-hidden">
        <div className="tf-container w-full h-full flex flex-col space-y-4">
          
          {/* Header */}
          <header className="tf-card-solid p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="relative w-11 h-11 rounded-xl bg-blue-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <Image src="/Logo.png" alt="Tafakkur AI" fill sizes="44px" className="object-contain p-1.5" priority />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">Tafakkur AI</h1>
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                    Akademik Repetitor
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Talabalar uchun shaxsiy akademik maslahatchi va o'quv repetitori
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
              <HeaderControls />
              <button 
                onClick={() => setMessages([messages[0]])}
                className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-semibold border border-slate-200 dark:border-zinc-700 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Suhbatni tozalash"
              >
                Tozalash
              </button>
            </div>
          </header>

          {/* Chat Container */}
          <div className="flex-1 tf-card-solid flex flex-col overflow-hidden">
            
            {/* Starter Prompts */}
            <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-800 overflow-x-auto shrink-0 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Tavsiya savollar:</span>
              <div className="flex gap-2">
                {starterQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 transition-colors whitespace-nowrap shadow-2xs"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="relative w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-slate-200 dark:border-zinc-700 flex items-center justify-center shrink-0 mt-1 overflow-hidden shadow-xs">
                      <Image src="/Logo.png" alt="AI" fill sizes="32px" className="object-contain p-1" />
                    </div>
                  )}

                  <div className={`max-w-[85%] md:max-w-[75%] space-y-1.5`}>
                    <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {msg.role === 'user' ? "Siz" : "Tafakkur AI"}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    
                    <div className={`p-4 text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' ? 'tf-chat-bubble-user whitespace-pre-line' : 'tf-chat-bubble-ai'
                    }`}>
                      {msg.role === 'user' ? msg.text : <MarkdownRenderer content={msg.text} />}
                    </div>

                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-2 pt-0.5 px-1">
                        <button 
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="text-[11px] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>{copiedId === msg.id ? "Nusxalandi!" : "Nusxa olish"}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      U
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3">
                  <div className="relative w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-slate-200 dark:border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                    <Image src="/Logo.png" alt="AI" fill sizes="32px" className="object-contain p-1" />
                  </div>
                  <div className="bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 p-3.5 rounded-2xl rounded-tl-xs flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tafakkur AI tahlil qilmoqda</span>
                    <span className="flex gap-1 items-center ml-1">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Composer */}
            <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
                className="flex items-center gap-2.5"
              >
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Tafakkur AI ga savol bering (masalan: 'Algoritm nima?', 'Oraliq nazorat talablari')..." 
                    className="w-full pl-4 pr-10 py-3 bg-slate-50/70 dark:bg-zinc-900/60 rounded-xl border border-slate-200 dark:border-zinc-700 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                  {input && (
                    <button 
                      type="button" 
                      onClick={() => setInput('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
                    >
                      &times;
                    </button>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none shadow-sm flex items-center gap-2 shrink-0"
                >
                  <span>Yuborish</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
              <div className="flex justify-between items-center mt-2 px-1 text-[11px] text-slate-400">
                <span>Enter tugmasini bosib yuboring</span>
                <span>Tafakkur AI • Oliy Ta'lim Akademik Dvigateli</span>
              </div>
            </div>

          </div>
          
        </div>
      </main>
    </div>
  );
}
