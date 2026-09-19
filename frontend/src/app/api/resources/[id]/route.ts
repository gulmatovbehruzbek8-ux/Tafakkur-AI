import { NextRequest, NextResponse } from 'next/server';
import { deleteStoredResource } from '@/lib/ai-engine';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const deleted = deleteStoredResource(id);
  if (deleted) {
    return NextResponse.json({ message: "Resurs o'chirildi", id });
  }
  return NextResponse.json({ message: "Resurs topilmadi yoki allaqachon o'chirilgan", id }, { status: 200 });
}
