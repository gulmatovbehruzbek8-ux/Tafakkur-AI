'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SidebarProps {
  role: 'student' | 'teacher' | 'admin' | 'mentor' | 'oquvchi';
  activeRoute: string;
}

export default function Sidebar({ role: initialRole, activeRoute }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [displayName, setDisplayName] = useState('Foydalanuvchi');
  const [userRole, setUserRole] = useState(initialRole);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tafakkur_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.profile?.name) {
          setDisplayName(parsed.profile.name);
        } else if (parsed.profile?.firstName) {
          setDisplayName(`${parsed.profile.firstName} ${parsed.profile.lastName || ''}`.trim());
        } else if (parsed.username) {
          setDisplayName(parsed.username);
        }
        if (parsed.role) {
          setUserRole(parsed.role);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const normalizedRole = (userRole === 'mentor' ? 'teacher' : userRole === 'oquvchi' ? 'student' : userRole) as 'student' | 'teacher' | 'admin';

  const studentItems = [
    { 
      label: 'Mening Kampusim', 
      href: '/student', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ) 
    },
    { 
      label: 'Fanlar & Kurslar', 
      href: '/student/courses', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ) 
    },
    { 
      label: 'AI Repetitor', 
      href: '/student/tutor', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ) 
    },
    { 
      label: 'Raqamli Pasport', 
      href: '/student/passport', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ) 
    },
    { 
      label: 'Topshiriqlar', 
      href: '/student/assignments', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ) 
    },
    { 
      label: 'Akademik Taqvim', 
      href: '/student/calendar', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ) 
    },
    { 
      label: 'Tadbirlar & Olimpiadalar', 
      href: '/student/events', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ) 
    },
    { 
      label: 'Akademik Analitika', 
      href: '/student/analytics', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ) 
    },
    { 
      label: "O'quv rejasi (SOW)", 
      href: '/student/sow', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ) 
    },
  ];

  const teacherItems = [
    { 
      label: "O'qituvchi Profili", 
      href: '/teacher', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ) 
    },
    { 
      label: 'Darslar Kalendari', 
      href: '/teacher/calendar', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ) 
    },
    { 
      label: "O'quv rejasi (SOW)", 
      href: '/teacher/sow', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ) 
    },
    { 
      label: 'AI Avto-Baholovchi', 
      href: '/teacher/grader', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) 
    },
    { 
      label: 'Tafakkur AI Professor', 
      href: '/teacher/chatbot', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ) 
    },
  ];

  const adminItems = [
    { 
      label: 'Tizim Boshqaruvi', 
      href: '/admin', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ) 
    },
    { 
      label: 'Foydalanuvchilar', 
      href: '/admin/users', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) 
    },
    { 
      label: "Xabarlar va E'lonlar", 
      href: '/admin/news', 
      icon: (
        <svg className="w-[17px] h-[17px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ) 
    },
  ];

  const items = normalizedRole === 'student' ? studentItems : normalizedRole === 'teacher' ? teacherItems : adminItems;
  const displayRole = normalizedRole === 'student' ? 'Talaba' : normalizedRole === 'teacher' ? "O'qituvchi" : "Ma'muriyat";

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tafakkur_user');
    }
  };

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0b1320]/95 backdrop-blur-md border-b border-white/8 sticky top-0 z-50 text-white">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-xl bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
              <circle cx="4" cy="20" r="2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-white leading-none">
              tafakkur<span className="text-cyan-300">.ai</span>
            </p>
            <p className="text-[8px] uppercase tracking-[0.2em] text-slate-400 mt-0.5">University OS</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)} 
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors" 
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Modern Desktop & Mobile Drawer Sidebar - Permanently fixed full height */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[248px] h-screen bg-[#0b1320] text-slate-100 flex flex-col border-r border-white/8 px-3 py-5 transition-transform duration-200 ease-out md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header (Point 3) */}
        <div className="mb-6 flex items-center justify-between px-2 pt-1">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20 group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                <path d="M20 2v4" />
                <path d="M22 4h-4" />
                <circle cx="4" cy="20" r="2" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-bold tracking-tight text-white leading-none">
                tafakkur<span className="text-cyan-300">.ai</span>
              </p>
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-500 mt-1">
                University OS
              </p>
            </div>
          </Link>

          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/5"
            aria-label="Close navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Role Pill Header */}
        <div className="px-2 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Menyu</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
              {displayRole}
            </span>
          </div>
        </div>

        {/* Navigation Items (Point 3) */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
          {items.map((item) => {
            const isActive = activeRoute === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors text-xs font-medium ${
                  isActive 
                    ? 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span className={isActive ? 'text-cyan-300' : 'text-slate-500 group-hover:text-slate-300'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)] shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Bottom Section: HEMIS Connected & User Profile (Point 3) */}
        <div className="mt-auto pt-3 border-t border-white/8 space-y-3 shrink-0">
          {/* Dedicated HEMIS Connected Box */}
          <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider text-emerald-300">HEMIS CONNECTED</span>
            </div>
            <p className="mt-1.5 text-[10px] text-slate-400">Synced 2 minutes ago • UrDU</p>
          </div>

          {/* User Profile Chip */}
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/8 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-8 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-slate-400 capitalize">{displayRole}</p>
              </div>
            </div>
            
            <Link 
              href="/login" 
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
              title="Chiqish"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Link>
          </div>
        </div>
      </aside>

      {/* Desktop layout spacer to maintain flex column flow beside the fixed sidebar */}
      <div className="hidden md:block w-[248px] shrink-0 pointer-events-none" aria-hidden="true" />
      
      {isMobileOpen && (
        <div className="fixed inset-0 bg-slate-950/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>
      )}
    </>
  );
}
