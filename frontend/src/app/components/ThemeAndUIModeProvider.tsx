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
      {children}
    </ThemeAndUIContext.Provider>
  );
}
