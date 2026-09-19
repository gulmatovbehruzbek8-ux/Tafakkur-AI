'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  contextTag?: string;
  actionButton?: {
    label: string;
    href: string;
  };
}

interface TafakkurCompanionProps {
  currentContext?: string;
}

export default function TafakkurCompanion({ currentContext = "Mening Kampusim" }: TafakkurCompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Salom, Bunyodbek! Men Tafakkur AI yordamchisiman. Hozir siz **"${currentContext}"** sahifasidasiz. Bugungi darslaringiz, topshiriqlaringiz yoki tushunarsiz mavzular bo'yicha qanday yordam bera olaman?`,
      time: 'Hozir',
      contextTag: 'Universitet Konteksti',
    }
  ]);

  const quickPrompts = [
    { label: "🗓️ Bugungi tayyorgarlik rejasi", prompt: "Bugungi darslarim uchun nimalarga alohida e'tibor qaratishim kerak?" },
    { label: "🌲 BST laboratoriyasini tushuntir", prompt: "Ikkilik qidiruv daraxtlari (BST) topshirig'i bo'yicha asosiy formulalar va kod qoidalarini aytib ber" },
    { label: "📈 O'zlashtirish tahlili", prompt: "Mening o'zlashtirish ko'rsatkichim nima hisobiga 92.4% ga yetdi?" },
    { label: "🎯 AI Xakaton tavsiyalari", prompt: "Umummilliy AI Xakatoni uchun loyiha tanlashda qanday maslahat berasan?" },
  ];

  useEffect(() => {
    // Keyboard shortcut: Cmd+J or Ctrl+J to toggle companion
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      let action: { label: string; href: string } | undefined;

      const lower = query.toLowerCase();
      if (lower.includes('dars') || lower.includes('rejasi') || lower.includes('bugun')) {
        reply = "Bugun soat 10:30 da **212-laboratoriyada** Binar qidiruv daraxtlari (BST) bo'yicha amaliy mashg'ulot bor. Darsdan oldin AVL rotatsiyalari va balansi buzilgan daraxtlarni tuzatish mavzusini 10 daqiqa ko'rib chiqishingizni tavsiya qilaman.";
        action = { label: "To'liq Kalendarni ochish", href: "/student/calendar" };
      } else if (lower.includes('bst') || lower.includes('daraxt') || lower.includes('laboratoriya')) {
        reply = "BST da asosiy qoida: chap farzand qiymati ota tugundan kichik, o'ng farzandniki esa katta bo'ladi. Qidirish, qo'shish va o'chirish o'rtacha $O(\\log N)$, eng yomon holatda esa $O(N)$ bo'ladi. Topshiriqni topshirish uchun 4 soat qoldi!";
        action = { label: "AI Repetitorga o'tish", href: "/student/tutor" };
      } else if (lower.includes('o\'zlashtirish') || lower.includes('ball') || lower.includes('gpa')) {
        reply = "Sizning GPA ko'rsatkichingiz **4.82** (o'zlashtirish **92.4%**). Oxirgi laboratoriya ishida Prof. O. Turdiyev sizga 92 ball bergan. Davomat 96% bo'lib, guruhda 1-o'rinda boryapsiz!";
        action = { label: "Akademik Pasportni ko'rish", href: "/student/passport" };
      } else {
        reply = `Tafakkur AI tahlili bo'yicha: ushbu savol bo'yicha chuqurroq o'rganish uchun bizning interaktiv **AI Repetitor (Tutor)** rejimimizga o'tishingiz mumkin. U yerda viktorina, kod tekshiruvi va nazariy konspektlar mavjud.`;
        action = { label: "AI Repetitor bilan ishlash", href: "/student/tutor" };
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          contextTag: 'Tafakkur AI Agent',
          actionButton: action
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating OS Capsule Button (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
          <button
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#07101B] via-[#0c1f33] to-[#0f3b57] text-white shadow-xl hover:shadow-teal-500/20 border border-teal-500/30 hover:border-teal-400 transition-all duration-300 hover:scale-105"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/40">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping absolute" />
              <span className="text-xs font-black">AI</span>
            </div>
            
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                Tafakkur AI
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-teal-500/20 text-teal-300 font-mono border border-teal-400/30">
                  Ctrl+J
                </span>
              </span>
              <span className="text-[10px] text-teal-200/80 font-medium">
                Kontekstual Yordamchi
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Slide-out / Floating OS Companion Panel */}
      {isOpen && (
        <div 
          className={`fixed right-4 md:right-8 z-50 bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized 
              ? 'bottom-6 w-80 h-16' 
              : 'bottom-6 w-[94vw] sm:w-[420px] lg:w-[460px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#07101B] via-[#0c1f33] to-[#0a273b] text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center border border-teal-400/40 overflow-hidden">
                <Image src="/Logo.png" alt="Tafakkur AI" width={24} height={24} className="object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">Tafakkur AI Companion</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-teal-200 font-mono">
                  HEMIS Data Linked • v2.4
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-7 h-7 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center text-xs transition-colors"
                title={isMinimized ? "Kengaytirish" : "Kichraytirish"}
              >
                {isMinimized ? '▢' : '—'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center text-xs transition-colors"
                title="Yopish"
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context Pill Banner */}
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Kontekst:</span>
                  <span className="font-semibold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md truncate">
                    {currentContext}
                  </span>
                </div>
                <Link
                  href="/student/tutor"
                  className="text-teal-700 hover:text-teal-900 font-bold hover:underline shrink-0 ml-2"
                >
                  AI Repetitor →
                </Link>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#fafcff]">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {m.contextTag && (
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                        {m.contextTag}
                      </span>
                    )}
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-xs ${
                        m.sender === 'user'
                          ? 'bg-teal-600 text-white rounded-br-xs font-medium'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                      }`}
                    >
                      {m.text}

                      {m.actionButton && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <Link
                            href={m.actionButton.href}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] transition-colors"
                          >
                            <span>{m.actionButton.label}</span>
                            <span>→</span>
                          </Link>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">
                      {m.time}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200/80 w-24">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Contextual Quick Prompts */}
              <div className="px-4 py-2 border-t border-slate-100 bg-white overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp.prompt)}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-teal-800 text-slate-600 text-[11px] font-medium border border-slate-200 whitespace-nowrap transition-colors shrink-0"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-slate-100 bg-white shrink-0">
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
                    placeholder="Tafakkur AI dan so'rang..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white transition-colors flex items-center justify-center shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
