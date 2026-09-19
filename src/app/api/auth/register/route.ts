import { NextRequest, NextResponse } from 'next/server';
import { addStoredUser } from '@/lib/user-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = (body?.username || '').trim().toLowerCase();
    const password = body?.password || 'tafakkur2026';
    const role = body?.role || 'student';
    const fullName = body?.full_name || body?.fullName || username;
    const email = body?.email || `${username}@tafakkur.edu.uz`;

    if (!username) {
      return NextResponse.json({ error: "Foydalanuvchi nomi kiritilishi shart." }, { status: 400 });
    }

    const created = addStoredUser({
      username,
      password,
      role,
      fullName,
      email,
      department: body?.department || (role === 'student' ? 'CS-22 Guruhi' : 'Axborot Texnologiyalari'),
      status: 'active'
    });

    const { password: _, ...safeUser } = created;
    return NextResponse.json({
      message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi",
      token: `jwt_token_${created.username}_${Date.now()}`,
      user: safeUser
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server xatosi' }, { status: 500 });
  }
}
