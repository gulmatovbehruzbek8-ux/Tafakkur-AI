import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledgeBase, queryExternalLLM, generatePedagogicalResponse } from '@/lib/ai-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question: string = body?.question || body?.prompt || '';
    const context: string = body?.context || '';
    const model: string = body?.model || 'llama-3.3-70b-versatile';

    if (!question.trim()) {
      return NextResponse.json({ 
        answer: "Iltimos, savolingizni yozing.",
        response: "Iltimos, savolingizni yozing." 
      }, { status: 400 });
    }

    const matched = searchKnowledgeBase(question);
    const effectiveContext = context || (matched ? matched.content : '');

    let promptForLLM: string;
    if (effectiveContext) {
      promptForLLM = 
        `Siz universitetning AI repetitorisiz (Tafakkur AI). ` +
        `Talabaga quyidagi rasmiy o'quv dasturi (SOW) va ta'lim ma'lumotlariga tayanib samimiy va aniq O'zbek tilida javob bering:\n\n` +
        `=== SOW KONTEKSTI ===\n${effectiveContext}\n\n` +
        `=== TALABANING SAVOLI ===\n${question}`;
    } else {
      promptForLLM = 
        `Siz universitetning AI repetitorisiz. Talabaning savoliga aniq, pedagogik jihatdan to'g'ri va O'zbek tilida javob bering:\n\n` +
        `Savol: ${question}`;
    }

    const externalAns = await queryExternalLLM(promptForLLM, model);
    if (externalAns) {
      return NextResponse.json({
        answer: externalAns,
        response: externalAns,
        source: 'llm'
      });
    }

    // Built-in Pedagogical Fallback
    const fallbackAns = generatePedagogicalResponse(question, matched);
    return NextResponse.json({
      answer: fallbackAns,
      response: fallbackAns,
      source: 'sow_pedagogy'
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({
      answer: "Kechirasiz, savolingizga javob berishda xatolik yuz berdi.",
      response: "Kechirasiz, savolingizga javob berishda xatolik yuz berdi.",
      error: error?.message
    }, { status: 500 });
  }
}
