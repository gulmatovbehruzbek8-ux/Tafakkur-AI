'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuthRouteGuardProps {
  children: React.ReactNode;
}

export default function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const isProtectedPath = 
    pathname.startsWith('/student') ||
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/professor');

  useEffect(() => {
    if (!isProtectedPath) {
      setIsAuthorized(true);
      return;
    }

    try {
      const stored = localStorage.getItem('tafakkur_user');
      if (!stored) {
        setIsAuthorized(false);
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      const user = JSON.parse(stored);
      const role = user.role || 'student';

      // Role check: prevent students from viewing admin pages
      if (pathname.startsWith('/admin') && role !== 'admin') {
        setIsAuthorized(false);
        router.replace('/student');
        return;
      }

      // Role check: prevent students from viewing teacher pages
      if (pathname.startsWith('/teacher') && role === 'student') {
        setIsAuthorized(false);
        router.replace('/student');
        return;
      }

      setIsAuthorized(true);
    } catch {
      setIsAuthorized(false);
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, isProtectedPath, router]);

  // Public pages render immediately
  if (!isProtectedPath) {
    return <>{children}</>;
  }

  // Waiting for client-side authorization check
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#070d14] flex flex-col items-center justify-center text-slate-300 p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs tracking-wider uppercase text-teal-400 font-mono">Xavfsizlik tekshiruvi...</p>
        </div>
      </div>
    );
  }

  // Not authorized: show friendly barrier while redirect executes
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#070d14] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-400/30 flex items-center justify-center mb-4 text-3xl shadow-lg shadow-teal-500/20">
          🔒
        </div>
        <h2 className="text-xl font-bold mb-2">Tizimga kirish talab etiladi</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-6">
          Ushbu sahifaga faqat universitet hisobiga ega bo&apos;lgan ro&apos;yxatdan o&apos;tgan foydalanuvchilar kira oladi.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={`/login?redirect=${encodeURIComponent(pathname)}`}
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-teal-500/20"
          >
            Tizimga Kirish →
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all"
          >
            Bosh Sahifa
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
