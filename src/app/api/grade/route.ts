import { NextRequest, NextResponse } from 'next/server';
import { queryExternalLLM, gradeSubmissionWithPedagogy } from '@/lib/ai-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rubric: string = body?.rubric || '';
    const submission: string = body?.submission || '';
    const model: string = body?.model || 'llama-3.3-70b-versatile';

    if (!submission.trim()) {
      return NextResponse.json({
        score: 0,
        feedback: "Talabaning javobi bo'sh bo'lganligi sababli baholanmadi.",
        raw: "BALL: 0\nFIKR: Bo'sh javob."
      });
    }

    const gradingPrompt = 
      `Siz universitetning tajribali professorisiz.\n` +
      `Quyidagi baholash mezonlari (rubrika) va talabaning javobini diqqat bilan o'rganib chiqib, ` +
      `talabaning ishini 100 ballik tizimda baholang va O'zbek tilida konstruktiv fikr bildiring.\n\n` +
      `Javobingizni aniq quyidagi formatda boshlang:\n` +
      `BALL: [0-100 oralig'idagi son]\n` +
      `FIKR: [batafsil izoh va tavsiyalar]\n\n` +
      `=== RASMIY BAHOLASH RUBRIKASI ===\n${rubric || "Standart universitet rubrikasi (Kod tozaligi, aniqlik, samaradorlik)"}\n\n` +
      `=== TALABANING ISHI / KODI ===\n${submission}`;

    const externalResult = await queryExternalLLM(gradingPrompt, model);
    if (externalResult) {
      let score: number | null = null;
      let feedback = externalResult;

      const scoreMatch = externalResult.match(/BALL\s*[:：]\s*\**\s*(\d{1,3}(?:[.,]\d+)?)/i);
      if (scoreMatch) score = Math.round(parseFloat(scoreMatch[1].replace(',', '.')));
      const fikrIdx = externalResult.search(/FIKR\s*[:：]/i);
      if (fikrIdx >= 0) feedback = externalResult.slice(fikrIdx).replace(/^FIKR\s*[:：]\s*/i, '').trim();

      if (score === null) {
        // Model ignored the required format: use the built-in grader instead of inventing a score
        const graded = gradeSubmissionWithPedagogy(rubric, submission);
        return NextResponse.json({ ...graded, feedback: externalResult, raw: externalResult, source: 'llm_unparsed' });
      }

      const finalScore = Math.max(0, Math.min(100, score));
      const theory = Math.round(finalScore * 0.30);
      const complexity = Math.round(finalScore * 0.35);
      const memory = Math.round(finalScore * 0.20);
      const cleanliness = finalScore - (theory + complexity + memory);

      return NextResponse.json({
        score: finalScore,
        feedback: feedback || externalResult,
        breakdown: { theory, complexity, memory, cleanliness },
        raw: externalResult,
        source: 'llm'
      });
    }

    // Built-in intelligent grading
    const graded = gradeSubmissionWithPedagogy(rubric, submission);
    return NextResponse.json({
      ...graded,
      source: 'pedagogy_grader'
    });
  } catch (error: any) {
    console.error('Error in /api/grade:', error);
    return NextResponse.json({
      score: 75,
      feedback: "Baholash davomida texnik xatolik yuz berdi. Dastlabki tavsiya: 75 ball.",
      raw: "BALL: 75",
      error: error?.message
    }, { status: 500 });
  }
}
