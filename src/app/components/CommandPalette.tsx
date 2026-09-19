'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SearchItem {
  id: string;
  title: string;
  category: 'Kurslar' | 'Topshiriqlar' | 'Taqvim' | 'AI & Tahlil' | 'Professorlar';
  subtitle: string;
  href: string;
  shortcut?: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Kurslar
  { id: 'c1', title: "Ma'lumotlar tuzilmasi va algoritmlar (CS-201)", category: 'Kurslar', subtitle: "Prof. O. Turdiyev • 6 ECTS", href: '/student/courses' },
  { id: 'c2', title: "Sun'iy Intellekt va Mashinali O'rganish (AI-204)", category: 'Kurslar', subtitle: "Dots. N. Karimova • 5 ECTS", href: '/student/courses' },
  { id: 'c3', title: "Oliy Matematika va Chiziqli Algebra (MATH-102)", category: 'Kurslar', subtitle: "Dots. N. Karimova • 4 ECTS", href: '/student/courses' },
  { id: 'c4', title: "Dasturiy Ta'minot Arxitekturasi (SE-301)", category: 'Kurslar', subtitle: "Prof. O. Turdiyev • 5 ECTS", href: '/student/courses' },
  
  // Topshiriqlar
  { id: 't1', title: "3-Laboratoriya: AVL Binar Qidiruv Daraxti", category: 'Topshiriqlar', subtitle: "Muddat: Bugun 23:59 • Shoshilinch", href: '/student/assignments', shortcut: 'Bugun' },
  { id: 't2', title: "Matritsalar va Xos Qiymatlar Hisoboti", category: 'Topshiriqlar', subtitle: "Muddat: 21-sentyabr", href: '/student/assignments' },
  { id: 't3', title: "MNIST Neftron to'r loyihasi", category: 'Topshiriqlar', subtitle: "Muddat: 23-sentyabr", href: '/student/assignments' },

  // AI & Tahlil
  { id: 'a1', title: "Tafakkur AI Repetitori (Tutor)", category: 'AI & Tahlil', subtitle: "5 ta rejim, interaktiv viktorina va kod tahlili", href: '/student/tutor', shortcut: 'Ctrl+J' },
  { id: 'a2', title: "Akademik Analitik (Analyst)", category: 'AI & Tahlil', subtitle: "GPA 4.82, o'sish dinamikasi va tavsiyalar", href: '/student/analytics' },
  { id: 'a3', title: "Raqamli Akademik Pasport", category: 'AI & Tahlil', subtitle: "HEMIS tasdiqlangan QR va yutuqlar", href: '/student/passport' },

  // Taqvim & Voqealar
  { id: 'e1', title: "Akademik Taqvim & Kun Tartibi", category: 'Taqvim', subtitle: "Oylik, haftalik va kunlik reja", href: '/student/calendar' },
  { id: 'e2', title: "Umummilliy AI Xakaton 2026", category: 'Taqvim', subtitle: "Ro'yxatdan o'tish muddati: Juma 18:00", href: '/student/events' },
  { id: 'e3', title: "ACM ICPC Dasturlash Olimpiadasi", category: 'Taqvim', subtitle: "28-sentyabr, Bosh kompyuter zali", href: '/student/events' },

  // Professorlar
  { id: 'p1', title: "Prof. Olimjon Turdiyev", category: 'Professorlar', subtitle: "Kafedra mudiri • A-204 xona", href: '/student/courses' },
  { id: 'p2', title: "Dots. Nigora Karimova", category: 'Professorlar', subtitle: "Katta o'qituvchi • B-310 xona", href: '/student/courses' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = query.trim() === ''
    ? SEARCH_ITEMS.slice(0, 8)
    : SEARCH_ITEMS.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    setQuery('');
    router.push(item.href);
  };

  const handleKeyDownList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-fade-in">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 bg-slate-50/90 border-b border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
            🔍
          </div>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownList}
            placeholder="Fanlar, topshiriqlar, tadbirlar yoki professorlarni qidiring... (masalan: 'BST', 'AI', 'Imtihon')"
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 focus:outline-none placeholder:text-slate-400 font-medium"
          />
          <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 font-mono text-[11px] shrink-0">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              "{query}" bo'yicha hech qanday natija topilmadi.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                    isSelected ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected ? 'bg-teal-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.category}
                      </span>
                      <h4 className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {item.title}
                      </h4>
                    </div>
                    <p className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.shortcut}
                      </span>
                    )}
                    <span className={`font-mono text-xs ${isSelected ? 'text-teal-300' : 'text-slate-400'}`}>
                      ↵
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Harakatlanish</span>
            <span>↵ Tanlash</span>
            <span>ESC Yopish</span>
          </div>
          <span className="text-teal-700 font-bold">
            TAFAKKUR AI UNIVERSAL SEARCH
          </span>
        </div>
      </div>
    </div>
  );
}
