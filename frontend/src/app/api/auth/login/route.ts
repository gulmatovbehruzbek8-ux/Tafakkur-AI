import { NextRequest, NextResponse } from 'next/server';
import { getStoredUsers } from '@/lib/user-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = (body?.username || '').trim().toLowerCase();
    const password = body?.password || '';

    if (!username || !password) {
      return NextResponse.json({ error: "Foydalanuvchi nomi va parolni kiriting." }, { status: 400 });
    }

    const users = getStoredUsers();
    const found = users.find(u => u.username.toLowerCase() === username);

    if (found) {
      // Allow correct password, or default demo passwords
      const isMatch = found.password ? found.password === password : true;
      if (isMatch || password === 'admin123' || password === 'teacher123' || password === 'student123' || password === 'tafakkur2026' || password === 'password123') {
        const { password: _, ...userSafe } = found;
        return NextResponse.json({
          message: "Muvaffaqiyatli tizimga kirildi",
          token: `jwt_token_${found.username}_${Date.now()}`,
          user: userSafe
        });
      }
    }

    // Role-based instant fallback if user types standard role names
    if (['admin', 'teacher', 'student'].includes(username)) {
      const fallbackUser = {
        id: `usr-${username}`,
        username,
        fullName: username === 'admin' ? 'Bosh Administrator' : (username === 'teacher' ? 'Prof. O. Turdiyev' : 'Talaba'),
        role: username,
        email: `${username}@tafakkur.edu.uz`,
        status: 'active',
        lastActive: 'Hozir onlayn'
      };
      return NextResponse.json({
        message: "Muvaffaqiyatli tizimga kirildi",
        token: `jwt_token_${username}_${Date.now()}`,
        user: fallbackUser
      });
    }

    return NextResponse.json({ error: "Foydalanuvchi nomi yoki parol noto'g'ri." }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server xatosi' }, { status: 500 });
  }
}
