import { NextRequest, NextResponse } from 'next/server';
import { updateStoredUser, deleteStoredUser } from '@/lib/user-store';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const updated = updateStoredUser(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
    }
    const { password: _, ...safeUser } = updated;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server xatosi' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const success = deleteStoredUser(id);
  if (success) {
    return NextResponse.json({ message: "Foydalanuvchi o'chirildi", id });
  }
  return NextResponse.json({ message: "Foydalanuvchi topilmadi yoki allaqachon o'chirilgan", id }, { status: 200 });
}
