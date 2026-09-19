import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledgeBase, queryExternalLLM, generatePedagogicalResponse } from '@/lib/ai-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = body?.prompt || '';
    const model: string = body?.model || 'llama-3.3-70b-versatile';
    const extraContext: string = typeof body?.context === 'string' ? body.context : '';
    const role: string = body?.role === 'teacher' ? "o'qituvchi (professor)" : body?.role === 'student' ? 'talaba' : '';

    if (!prompt.trim()) {
      return NextResponse.json({ response: "Iltimos, savol yoki so'rovingizni kiriting." }, { status: 400 });
    }

    // 1. Search SOW & Knowledge Base for relevant curriculum document
    const matched = searchKnowledgeBase(prompt);

    // 2. Formulate grounded prompt for external LLM (Groq, Ollama, Gemini, OpenAI)
    let augmentedPrompt = prompt;
    if (extraContext) {
      augmentedPrompt =
        `Foydalanuvchi${role ? ` (${role})` : ''} uchun quyidagi rasmiy kontekstga tayanib javob bering:\n\n` +
        `=== KONTEKST ===\n${extraContext}\n\n=== SO'ROV ===\n${prompt}`;
    } else if (matched) {
      augmentedPrompt = 
        `Siz universitetning intellektual Tafakkur AI ta'lim assistentisiz.\n` +
        `Quyida universitet ma'muriyati tomonidan tasdiqlangan rasmiy o'quv dasturi (SOW) va sillabus ma'lumotlari keltirilgan:\n\n` +
        `=== RASMIY SOW RESURSI ===\n` +
        `Fan: ${matched.subjectName}\n` +
        `Hujjat: ${matched.title} (${matched.moduleName})\n` +
        `Mazmun: ${matched.content}\n\n` +
        `=== FOYDALANUVCHI SO'ROVI ===\n` +
        `${prompt}\n\n` +
        `${role ? `Foydalanuvchi: ${role}. ` : ''}Talaba yoki o'qituvchiga yuqoridagi rasmiy SOW ma'lumotlariga tayangan holda O'zbek tilida aniq, pedagogik, professional va samimiy javob bering.`;
    }

    // 3. Attempt external high-speed LLM call (e.g. Groq free Llama 3.3 70B, Ollama, etc.)
    const externalResponse = await queryExternalLLM(augmentedPrompt, model);
    if (externalResponse) {
      return NextResponse.json({ 
        response: externalResponse,
        source: 'llm',
        matched: matched ? { id: matched.id, title: matched.title, subject: matched.subjectName } : null
      });
    }

    // 4. Built-in Pedagogical SOW Intelligence Engine (Zero-Config Vercel Fallback)
    const fallbackResponse = generatePedagogicalResponse(prompt, matched);
    return NextResponse.json({ 
      response: fallbackResponse,
      source: 'sow_pedagogy',
      matched: matched ? { id: matched.id, title: matched.title, subject: matched.subjectName } : null
    });
  } catch (error: any) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json({
      response: "Tizimda vaqtinchalik uzilish yuz berdi. Iltimos, qayta urinib ko'ring yoki SOW o'quv rejasi bo'limiga murojaat qiling.",
      error: error?.message
    }, { status: 500 });
  }
}
