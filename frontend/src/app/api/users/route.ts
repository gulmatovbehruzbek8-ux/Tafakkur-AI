import { NextRequest, NextResponse } from 'next/server';
import { getStoredUsers, addStoredUser } from '@/lib/user-store';

export async function GET() {
  const users = getStoredUsers();
  const safeUsers = users.map(({ password: _, ...u }) => u);
  return NextResponse.json(safeUsers);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = addStoredUser(body);
    const { password: _, ...safeUser } = created;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server xatosi' }, { status: 500 });
  }
}
