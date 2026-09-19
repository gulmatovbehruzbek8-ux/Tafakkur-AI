'use client';

import Sidebar from "@/app/components/Sidebar";
import Link from "next/link";
import { useState, useEffect } from "react";

interface SettingsState {
  allowNotifications: boolean;
  notifyClassReminders: boolean;
  notifyDeadlines: boolean;
  notifyAnnouncements: boolean;
  notifyAITutor: boolean;
  notifySound: boolean;
  language: 'uz-lat' | 'uz-cyr' | 'en' | 'ru';
  themeMode: 'light' | 'dark' | 'system';
  accentColor: 'teal' | 'indigo' | 'emerald' | 'sky';
  fontSize: 'normal' | 'compact' | 'large';
}

const DEFAULT_SETTINGS: SettingsState = {
  allowNotifications: true,
  notifyClassReminders: true,
  notifyDeadlines: true,
  notifyAnnouncements: true,
  notifyAITutor: false,
  notifySound: true,
  language: 'uz-lat',
  themeMode: 'light',
  accentColor: 'teal',
  fontSize: 'normal',
};

export default function StudentSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tafakkur_settings');
      if (saved) {
        try {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
        } catch {
          // fallback
        }
      }
      if ('Notification' in window) {
        setBrowserPermission(Notification.permission);
      }
    }
  }, []);

  const handleToggle = (key: keyof SettingsState) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectLanguage = (lang: SettingsState['language']) => {
    setSettings(prev => ({ ...prev, language: lang }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('tafakkur_lang', lang);
    }
  };

  const handleSelectTheme = (theme: SettingsState['themeMode']) => {
    setSettings(prev => ({ ...prev, themeMode: theme }));
  };

  const handleSelectAccent = (color: SettingsState['accentColor']) => {
    setSettings(prev => ({ ...prev, accentColor: color }));
  };

  const requestBrowserNotification = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
        if (perm === 'granted') {
          new Notification("Tafakkur AI", {
            body: "Bildirishnomalar muvaffaqiyatli faollashtirildi! Darslar va muddatlar eslatiladi.",
            icon: "/logo.png"
          });
          setSettings(prev => ({ ...prev, allowNotifications: true }));
        }
      } catch {
        // notification request failed
      }
    }
  };

  const saveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tafakkur_settings', JSON.stringify(settings));
    }
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  return (
    <div className="tf-page bg-[#f8fafc]">
      <Sidebar role="student" activeRoute="/student/settings" />

      <main className="tf-main pb-16">
        <div className="tf-container max-w-4xl space-y-6">

          {/* Toast Notification */}
          {isSavedToast && (
            <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400/30 animate-bounce">
              <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <div className="text-xs sm:text-sm font-bold">
                Sozlamalar muvaffaqiyatli saqlandi!
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-gradient-to-r from-[#07101B] to-[#0d2238] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  ⚙️ FOYDALANUVCHI SOZLAMALARI
                </span>
                <span className="text-xs text-slate-400 font-mono">UrDU Platformasi</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Tizim va Shaxsiy Sozlamalar
              </h1>
              <p className="text-xs text-slate-300 max-w-xl mt-1">
                Bildirishnomalar, til tanlovi va interfeys ko'rinishini o'z ta'lim qulayligingizga moslashtiring.
              </p>
            </div>

            <button
              onClick={saveSettings}
              className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-teal-500/20 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Saqlash</span>
              <span>💾</span>
            </button>
          </div>

          {/* SECTION 1: NOTIFICATIONS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl">
                  🔔
                </div>
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-base sm:text-lg">
                    Bildirishnomalar (Notifications)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Darslar, topshiriq muddatlari va universitet yangiliklaridan doimiy xabardor bo'ling
                  </p>
                </div>
              </div>

              {/* Master Push Toggle Button */}
              <button
                onClick={requestBrowserNotification}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  browserPermission === 'granted'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700'
                }`}
              >
                {browserPermission === 'granted' ? '✓ Brauzerda Yoqilgan' : 'Brauzer Ruxsati Olish'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Allow All Notifications */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Barcha bildirishnomalarga ruxsat</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tizim bo'yicha asosiy xabarnomalarni qabul qilish</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('allowNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.allowNotifications ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${settings.allowNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Class Reminders */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Dars va ma'ruza eslatmalari</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Dars boshlanishidan 15 daqiqa oldin eslatish</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('notifyClassReminders')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifyClassReminders ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${settings.notifyClassReminders ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Deadlines */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Topshiriq va Deadline muddatlari</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Vazifa topshirish muddati tugashidan oldin ogohlantirish</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('notifyDeadlines')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifyDeadlines ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${settings.notifyDeadlines ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* University Announcements */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Universitet va Dekanat e'lonlari</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Muhim yangiliklar, tadbirlar va olimpiadalar</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('notifyAnnouncements')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifyAnnouncements ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${settings.notifyAnnouncements ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* AI Tutor proactive tips */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">AI Repetitor tavsiyalari</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Kunlik takrorlash va bo'shliqlar bo'yicha maslahatlar</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('notifyAITutor')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifyAITutor ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${settings.notifyAITutor ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Sound toggle */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Ovozli signallar</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Bildirishnoma vaqtida ovoz chiqarish</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('notifySound')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifySound ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${settings.notifySound ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: LANGUAGE */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">
                🌐
              </div>
              <div>
                <h2 className="font-display font-bold text-slate-900 text-base sm:text-lg">
                  Tilni Tanlash (Language)
                </h2>
                <p className="text-xs text-slate-500">
                  Platformaning interfeysi va AI javoblari uchun qulay tilni tanlang
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'uz-lat', name: "O'zbekcha", sub: "Lotin yozuvi (Asosiy)", flag: "🇺🇿" },
                { id: 'uz-cyr', name: "Ўзбекча", sub: "Кирилл алифбоси", flag: "🇺🇿" },
                { id: 'en', name: "English", sub: "Academic International", flag: "🇬🇧" },
                { id: 'ru', name: "Русский", sub: "Язык обучения", flag: "🇷🇺" },
              ].map((lang) => {
                const isSelected = settings.language === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => handleSelectLanguage(lang.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{lang.flag}</div>
                    <div className="font-display font-bold text-slate-900 text-sm">{lang.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{lang.sub}</div>
                    {isSelected && (
                      <div className="mt-3 flex items-center gap-1.5 text-teal-700 text-xs font-bold">
                        <span>✓ Faol til</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: APPEARANCE */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                🎨
              </div>
              <div>
                <h2 className="font-display font-bold text-slate-900 text-base sm:text-lg">
                  Interfeys Ko'rinishi (Appearance)
                </h2>
                <p className="text-xs text-slate-500">
                  Mavzu, rang sxemasi va ko'rinish rejimini belgilang
                </p>
              </div>
            </div>

            {/* Mode Selectors */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-3 uppercase tracking-wider">
                Mavzu Rejimi (Theme Mode):
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: "Yorug' (Light)", icon: "☀️", desc: "Kun davomida qulay" },
                  { id: 'dark', label: "Qorong'i (Dark)", icon: "🌙", desc: "Tungi darslar uchun" },
                  { id: 'system', label: "Tizimga mos", icon: "💻", desc: "Qurilma sozlamasi" },
                ].map((th) => {
                  const isSelected = settings.themeMode === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => handleSelectTheme(th.id as any)}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-teal-500/30'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{th.icon}</span>
                      <span className="font-bold text-xs sm:text-sm block">{th.label}</span>
                      <span className={`text-[10px] mt-0.5 block ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {th.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Colors */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700 block mb-3 uppercase tracking-wider">
                Asosiy Urg'u Rangi (Accent Color):
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { id: 'teal', label: "Tafakkur Zangori", color: "bg-teal-500" },
                  { id: 'indigo', label: "Akademik Indigo", color: "bg-indigo-600" },
                  { id: 'emerald', label: "Zangori Yashil", color: "bg-emerald-500" },
                  { id: 'sky', label: "Moviy Osmon", color: "bg-sky-500" },
                ].map((acc) => {
                  const isSelected = settings.accentColor === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => handleSelectAccent(acc.id as any)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${acc.color}`} />
                      <span>{acc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Size & Compact */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Matn Kattaligi (Text Size):
                </label>
                <div className="flex items-center gap-2">
                  {(['compact', 'normal', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSettings(prev => ({ ...prev, fontSize: size }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        settings.fontSize === size
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {size === 'compact' ? "Ixcham" : size === 'normal' ? "Standart" : "Katta"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Ixcham ekran ko'rinishi</h4>
                  <p className="text-[11px] text-slate-500">Kichikroq padding va kengroq ish maydoni</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, fontSize: prev.fontSize === 'compact' ? 'normal' : 'compact' }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.fontSize === 'compact' ? 'bg-teal-600' : 'bg-slate-300'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${settings.fontSize === 'compact' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/student"
              className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-colors"
            >
              Bekor qilish
            </Link>
            <button
              onClick={saveSettings}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-teal-600/20 hover:scale-[1.02] flex items-center gap-2"
            >
              <span>O'zgarishlarni Saqlash</span>
              <span>💾</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
