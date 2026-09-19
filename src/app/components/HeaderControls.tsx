'use client';
import React from 'react';
import { useThemeAndUI } from './ThemeAndUIModeProvider';

export default function HeaderControls() {
  const { theme, uiMode, toggleTheme, toggleUIMode } = useThemeAndUI();

  return (
    <div className="flex items-center gap-2">
      {/* Teacher / Elder Simple Mode Switch */}
      <button
        onClick={toggleUIMode}
        type="button"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
          uiMode === 'simple'
            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm ring-2 ring-emerald-400/30'
            : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
        title="O'qituvchilar va professorlar uchun sodda, katta shriftli va tushunarli interfeys"
      >
        <span className="text-sm">👓</span>
        <span>{uiMode === 'simple' ? 'Oddiy Rejim: Yoniq' : 'Sodda Rejim'}</span>
      </button>

      {/* Dark / Light Theme Switch */}
      <button
        onClick={toggleTheme}
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-2xs"
        title="Yorug' yoki Qorong'u mavzuga o'tish"
      >
        <span className="text-sm">{theme === 'dark' ? '🌙' : '☀️'}</span>
        <span>{theme === 'dark' ? 'Tungi' : 'Kunduzgi'}</span>
      </button>
    </div>
  );
}
