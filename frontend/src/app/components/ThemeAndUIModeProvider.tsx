'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type UIMode = 'default' | 'simple';

interface ThemeAndUIContextType {
  theme: Theme;
  uiMode: UIMode;
  toggleTheme: () => void;
  toggleUIMode: () => void;
  setTheme: (t: Theme) => void;
  setUIMode: (m: UIMode) => void;
}

const ThemeAndUIContext = createContext<ThemeAndUIContextType>({
  theme: 'light',
  uiMode: 'default',
  toggleTheme: () => {},
  toggleUIMode: () => {},
  setTheme: () => {},
  setUIMode: () => {},
});

export const useThemeAndUI = () => useContext(ThemeAndUIContext);

export default function ThemeAndUIModeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [uiMode, setUIModeState] = useState<UIMode>('default');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem('tafakkur_theme') as Theme | null;
      const savedUIMode = localStorage.getItem('tafakkur_ui_mode') as UIMode | null;

      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeState(savedTheme);
      }
      if (savedUIMode === 'simple' || savedUIMode === 'default') {
        setUIModeState(savedUIMode);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const body = document.body;

    // 1. Theme
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('tafakkur_theme', theme);

    // 2. UI Mode (Elder / Simple vs Default)
    if (uiMode === 'simple') {
      root.classList.add('tf-simple-mode');
      body.classList.add('tf-simple-mode');
      root.setAttribute('data-ui-mode', 'simple');
    } else {
      root.classList.remove('tf-simple-mode');
      body.classList.remove('tf-simple-mode');
      root.setAttribute('data-ui-mode', 'default');
    }
    localStorage.setItem('tafakkur_ui_mode', uiMode);
  }, [theme, uiMode, mounted]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleUIMode = () => {
    setUIModeState(prev => (prev === 'default' ? 'simple' : 'default'));
  };

  const setTheme = (t: Theme) => setThemeState(t);
  const setUIMode = (m: UIMode) => setUIModeState(m);

  return (
    <ThemeAndUIContext.Provider value={{ theme, uiMode, toggleTheme, toggleUIMode, setTheme, setUIMode }}>
      {/* Elder / Simple Mode Indicator Notice Bar at very top */}
      {uiMode === 'simple' && (
        <div className="bg-amber-400 text-slate-950 font-bold px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between shadow-md border-b-2 border-amber-600 sticky top-0 z-[9999]">
          <div className="flex items-center gap-2.5">
            <span className="text-base sm:text-lg">👴</span>
            <span>
              <strong>Oddiy va Soddalashtirilgan Rejim (Katta yoshli professor-o'qituvchilar uchun):</strong> Shriftlar yirik, kontrast baland, ortiqcha animatsiyalar o'chirilgan.
            </span>
          </div>
          <button
            onClick={toggleUIMode}
            className="px-3 py-1 rounded-lg bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition-colors whitespace-nowrap ml-3"
          >
            Standart rejimga qaytish ✕
          </button>
        </div>
      )}

      {/* Floating Accessibility Switcher Toolbar (Always reachable on all screens) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#0c1928]/95 backdrop-blur-md p-1.5 rounded-2xl border border-teal-500/30 shadow-2xl text-white text-xs font-semibold">
        {/* Simple UI Mode Toggle */}
        <button
          onClick={toggleUIMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            uiMode === 'simple'
              ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
              : 'hover:bg-white/10 text-slate-300'
          }`}
          title="Katta yoshli professorlar uchun oddiy, katta shriftli interfeys"
        >
          <span>{uiMode === 'simple' ? '👴 Oddiy UI' : '👓 Oddiy UI'}</span>
          <span className="hidden sm:inline text-[10px] opacity-80 font-normal">
            ({uiMode === 'simple' ? 'Faol' : 'Kattalar uchun'})
          </span>
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            theme === 'dark'
              ? 'bg-teal-500 text-slate-950 font-bold'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          title="Yorug' yoki Qorong'i rejimga o'tish"
        >
          <span>{theme === 'dark' ? '🌙 Qorong\'i' : '☀️ Yorug\''}</span>
        </button>
      </div>

      {children}
    </ThemeAndUIContext.Provider>
  );
}
