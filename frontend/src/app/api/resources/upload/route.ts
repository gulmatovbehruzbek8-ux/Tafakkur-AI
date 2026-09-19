import { NextRequest, NextResponse } from 'next/server';
import { addStoredResource } from '@/lib/ai-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = addStoredResource(body);
    return NextResponse.json({
      message: "Resurs muvaffaqiyatli yuklandi va AI bilimlar bazasiga indekslandi",
      resource: created
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
