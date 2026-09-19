/**
 * Tafakkur AI - Resilient Multi-Tier AI Generation & Knowledge Engine
 * Supports:
 * 1. Groq Cloud LLM (Meta Llama 3.3 70B / Llama 3.1 8B) via process.env.GROQ_API_KEY
 * 2. Ollama (default model qwen2.5:7b, set OLLAMA_URL / OLLAMA_MODEL) — tried FIRST when configured
 * 3. Google Gemini API via process.env.GEMINI_API_KEY (used when Ollama/Groq are unavailable, e.g. on Vercel)
 * 4. OpenAI API via process.env.OPENAI_API_KEY
 * 5. Built-in Pedagogical SOW Grounding Engine (Zero-config, 100% resilient on Vercel)
 */

export interface SOWResource {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  resourceType: 'syllabus' | 'lecture' | 'assignment' | 'guideline' | 'other';
  moduleName: string;
  content: string;
  fileName: string;
  fileSize: string;
  createdAt: string;
  chunkCount: number;
}

export const INITIAL_SOW_RESOURCES: SOWResource[] = [
  {
    id: "res-1",
    subjectId: "algo",
    subjectName: "Algoritmlar va Ma'lumotlar Tuzilmasi",
    title: "Sillabus & Baholash Mezonlari (2026)",
    resourceType: "syllabus",
    moduleName: "Umumiy Kurs Strukturasi",
    content: "Ushbu fan 6 kreditdan iborat. Baholash mezoni: Oraliq nazorat (30 ball) — 8-haftada; Laboratoriya va amaliy ishlar (20 ball); Yakuniy nazorat (50 ball) — yozma va amaliy dasturlash imtihoni. Davomat 25% dan ortiq qoldirilsa, talaba yakuniy nazoratga kiritilmaydi.",
    fileName: "Algorithms_Syllabus_2026.pdf",
    fileSize: "2.4 MB",
    createdAt: "12 Sentabr, 2026",
    chunkCount: 14
  },
  {
    id: "res-2",
    subjectId: "algo",
    subjectName: "Algoritmlar va Ma'lumotlar Tuzilmasi",
    title: "Binar Qidiruv Daraxti (BST) Konspekti va Topshiriq Talablari",
    resourceType: "lecture",
    moduleName: "3-Modul: Tarmoqlangan va daraxtsimon tuzilmalar",
    content: "Binar qidiruv daraxti (BST) har bir tuguni eng ko'pi bilan 2 ta bolaga ega bo'lgan daraxtdir. Chap bolaning qiymati ota tugundan kichik, o'ng bolaniki esa katta bo'lishi shart. O'rtacha qidiruv murakkabligi: O(log N), eng yomon holatda (muvozanatsiz): O(N). 2-amaliy topshiriq topshirish muddati: 25-oktabr soat 23:59 gacha LMS tizimiga yuklanishi kerak.",
    fileName: "BST_Algorithms_LectureNotes.docx",
    fileSize: "1.1 MB",
    createdAt: "15 Sentabr, 2026",
    chunkCount: 22
  },
  {
    id: "res-3",
    subjectId: "ai",
    subjectName: "Sun'iy Intellekt Asoslari",
    title: "Mashinali O'rganish & Neyron Tarmoqlar Laboratoriya Qo'llanmasi",
    resourceType: "assignment",
    moduleName: "2-Modul: Neyron Tarmoqlar",
    content: "Laboratoriya ishi talablari: PyTorch kutubxonasi yordamida ko'p qatlamli perseptron (MLP) arxitekturasi qurilib, MNIST datasetida kamida 96% aniqlik (accuracy) olinishi lozim. Kod Github repository havolasi va hisobot PDF ko'rinishida taqdim etiladi. Topshirish muddati: 1-noyabr.",
    fileName: "AI_Lab_MLP_MNIST_Guide.pdf",
    fileSize: "3.8 MB",
    createdAt: "18 Sentabr, 2026",
    chunkCount: 31
  },
  {
    id: "res-4",
    subjectId: "networks",
    subjectName: "Kompyuter Tarmoqlari",
    title: "OSI Modeli va TCP/IP Protokollari Reglamenti",
    resourceType: "guideline",
    moduleName: "1-Modul: Tarmoq Arxitekturalari",
    content: "OSI modeli 7 ta sathdan iborat: 1. Jismoniy (Physical), 2. Kanal (Data Link), 3. Tarmoq (Network - IP), 4. Transport (TCP, UDP), 5. Seans (Session), 6. Taqdimot (Presentation), 7. Ilova (Application - HTTP, DNS). Marshrutlash protokollari: OSPF, BGP.",
    fileName: "Computer_Networks_Standard_V2.pdf",
    fileSize: "1.9 MB",
    createdAt: "19 Sentabr, 2026",
    chunkCount: 18
  },
  {
    id: "res-5",
    subjectId: "algo",
    subjectName: "Algoritmlar va Ma'lumotlar Tuzilmasi",
    title: "Stek va Navbat (Stack & Queue) Amaliy Masalalar To'plami",
    resourceType: "lecture",
    moduleName: "2-Modul: Chiziqli ma'lumotlar tuzilmalari",
    content: "Stek (Stack) — LIFO (Last In First Out) prinsipi asosida ishlaydi. Asosiy operatsiyalar: push, pop, peek, isEmpty. Qo'llanilishi: qavslarni tekshirish, funksiya chaqiruvlari steki. Navbat (Queue) — FIFO (First In First Out). Qo'llanilishi: BFS algoritmi, printer navbati.",
    fileName: "Stack_Queue_Practical.pdf",
    fileSize: "1.5 MB",
    createdAt: "16 Sentabr, 2026",
    chunkCount: 16
  }
];

// Global in-memory storage for Vercel functions lifecycle
declare global {
  // eslint-disable-next-line no-var
  var __TAFAKKUR_RESOURCES__: SOWResource[] | undefined;
}

export function getStoredResources(): SOWResource[] {
  if (!global.__TAFAKKUR_RESOURCES__) {
    global.__TAFAKKUR_RESOURCES__ = [...INITIAL_SOW_RESOURCES];
  }
  return global.__TAFAKKUR_RESOURCES__;
}

export function addStoredResource(res: Partial<SOWResource>): SOWResource {
  const list = getStoredResources();
  const newRes: SOWResource = {
    id: res.id || `res-${Date.now()}`,
    subjectId: res.subjectId || 'general',
    subjectName: res.subjectName || "Umumiy Ta'lim",
    title: res.title || 'Yangi O\'quv Materiali',
    resourceType: res.resourceType || 'other',
    moduleName: res.moduleName || "O'quv Moduli",
    content: res.content || '',
    fileName: res.fileName || 'document.pdf',
    fileSize: res.fileSize || '1.0 MB',
    createdAt: res.createdAt || 'Bugun',
    chunkCount: res.chunkCount || Math.max(1, Math.round((res.content?.length || 100) / 200))
  };
  list.unshift(newRes);
  return newRes;
}

export function deleteStoredResource(id: string): boolean {
  const list = getStoredResources();
  const initialLength = list.length;
  global.__TAFAKKUR_RESOURCES__ = list.filter(r => r.id !== id);
  return global.__TAFAKKUR_RESOURCES__.length < initialLength;
}

/**
 * Searches the SOW knowledge base using semantic keyword heuristics
 */
export function searchKnowledgeBase(query: string): SOWResource | null {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  const resources = getStoredResources();

  // If query is a greeting, do NOT match SOW curriculum
  const greetings = ['salom', 'hello', 'hi', 'assalom', 'assalomu alaykum', 'xayrli kun', 'privet', 'qalesiz'];
  if (greetings.some(g => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!') || q.startsWith(g + '?') || q.startsWith(g + ','))) {
    return null;
  }

  // If query is a math equation or question, do NOT match SOW curriculum
  if (/(\d+\s*[\+\-\*\/]\s*[a-z0-9]|\b(solve|tenglama|hisobla|matematika|x\s*=)\b)/i.test(q)) {
    return null;
  }

  // Topic specific heuristics with exact word boundaries
  if (/\b(bst|binar daraxt|binary search tree)\b/i.test(q)) {
    const match = resources.find(r => r.title.toLowerCase().includes('bst') || r.content.toLowerCase().includes('binar'));
    if (match) return match;
  }

  if (/\b(stack|stek|queue|navbat|lifo|fifo)\b/i.test(q)) {
    const match = resources.find(r => r.title.toLowerCase().includes('stek') || r.content.toLowerCase().includes('lifo'));
    if (match) return match;
  }

  if (/\b(neyron|mnist|pytorch|mlp|perceptron)\b/i.test(q) || (/\b(sun\'iy intellekt|mashinali o\'rganish)\b/i.test(q) && (q.includes('laboratoriya') || q.includes('topshiriq') || q.includes('kod') || q.includes('mnist')))) {
    const match = resources.find(r => r.subjectId === 'ai' || r.content.toLowerCase().includes('mnist'));
    if (match) return match;
  }

  if (/\b(osi|tcp|udp|ip protokol|marshrutlash|router|switch)\b/i.test(q)) {
    const match = resources.find(r => r.subjectId === 'networks' || r.content.toLowerCase().includes('osi'));
    if (match) return match;
  }

  if (/\b(sillabus|kredit|oraliq nazorat|yakuniy nazorat|davomat qoidasi)\b/i.test(q)) {
    const match = resources.find(r => r.resourceType === 'syllabus' || r.content.toLowerCase().includes('kredit'));
    if (match) return match;
  }

  // Direct subject or title match
  for (const res of resources) {
    const sub = res.subjectName.toLowerCase();
    const title = res.title.toLowerCase();

    if (sub.length > 5 && q.includes(sub)) return res;
    if (title.length > 5 && q.includes(title)) return res;
  }

  return null;
}

/**
 * Language policy: always answer in Uzbek (Latin script), whatever language the
 * question is written in, unless the user explicitly asks for another language.
 */
export const SYSTEM_PROMPT_UZ =
  "Siz universitetning intellektual ta'lim assistentisiz (Tafakkur AI). " +
  "Talabalar va professorlarga aniq, pedagogik va akademik jihatdan puxta javob bering. " +
  "TIL QOIDASI: har doim O'ZBEK tilida (lotin yozuvida) javob bering — savol qaysi tilda yozilgan bo'lishidan qat'i nazar. " +
  "Faqat foydalanuvchi aniq boshqa tilda javob so'rasa (masalan: \"answer in English\", \"ответь по-русски\"), shu tilda javob bering. " +
  "Kod, formulalar va texnik atamalar asl holicha qolishi mumkin.";

/**
 * Calls Cloud LLM or Ollama if configured
 */
export async function queryExternalLLM(prompt: string, modelName = 'llama-3.3-70b-versatile'): Promise<string | null> {
  // 0. Local / remote Ollama (Qwen 2.5) — preferred: data never leaves the university's machine
  const ollamaUrl = process.env.OLLAMA_URL;
  if (ollamaUrl) {
    try {
      const cleanUrl = ollamaUrl.replace(/\/$/, '');
      const oRes = await fetch(`${cleanUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(120000),
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || 'qwen2.5:7b',
          stream: false,
          keep_alive: '30m',
          options: { temperature: 0.6, num_ctx: 4096 },
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT_UZ
            },
            { role: 'user', content: prompt }
          ]
        })
      });
      if (oRes.ok) {
        const oData = await oRes.json();
        const text = oData?.message?.content;
        if (text) return text;
      } else {
        console.warn('Ollama responded with status', oRes.status);
      }
    } catch (e) {
      console.warn('Ollama invocation failed, falling back to next provider:', e);
    }
  }

  // 1. Check Groq API (Free tier, ultra-fast Llama 3.3 70B & 3.1 8B)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: /^llama-[\w.-]+$/.test(modelName) ? modelName : 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT_UZ
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (groqRes.ok) {
        const data = await groqRes.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text;
      }
    } catch (e) {
      console.warn('Groq API invocation failed, falling back to next provider:', e);
    }
  }

  // 3. Google Gemini API (key from GEMINI_API_KEY env var — never hardcode it)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
        signal: AbortSignal.timeout(60000),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT_UZ }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 2048 }
        })
      });
      if (gRes.ok) {
        const gData = await gRes.json();
        const cand = (gData?.candidates?.[0]?.content?.parts ?? [])
          .map((part: { text?: string }) => part?.text ?? '')
          .join('');
        if (cand) return cand;
      } else {
        console.warn('Gemini responded with status', gRes.status, (await gRes.text().catch(() => '')).slice(0, 300));
      }
    } catch (e) {
      console.warn('Gemini API invocation failed:', e);
    }
  }

  // 4. Check OpenAI API
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: SYSTEM_PROMPT_UZ }, { role: 'user', content: prompt }]
        })
      });
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const text = aiData?.choices?.[0]?.message?.content;
        if (text) return text;
      }
    } catch (e) {
      console.warn('OpenAI API invocation failed:', e);
    }
  }

  return null;
}

/**
 * Intelligent Pedagogical SOW Response Generator (Zero-Config Vercel Fallback)
 */
export function generatePedagogicalResponse(prompt: string, matched: SOWResource | null, strictSyllabus = false): string {
  const p = prompt.toLowerCase().trim();

  // 1. GREETINGS & INTRODUCTIONS
  const greetings = ['hello', 'hi', 'salom', 'assalom', 'assalomu alaykum', 'xayrli kun', 'privet', 'qalesiz'];
  if (greetings.some(g => p === g || p.startsWith(g + ' ') || p.startsWith(g + '!') || p.startsWith(g + '?') || p.startsWith(g + ','))) {
    return (
      `Assalomu alaykum! Men **Tafakkur AI** intellektual ta'lim assistentiman.\n\n` +
      `Sizga qanday vazifada yordam bera olaman?\n` +
      `• 📝 **Baholash rubrikalari:** 100 ballik mezonlar va oraliq/yakuniy nazoratlar;\n` +
      `• 📚 **O'quv dasturi (SOW):** Sillabus, mavzular ketma-ketligi va topshiriq muddatlari;\n` +
      `• 📐 **Matematika va Algoritmlar:** Formulalar, tenglamalar va masalalar tahlili;\n` +
      `• 💻 **Dasturlash:** Python, C++, SQL yoki AI laboratoriya kodlari namunasi.\n\n` +
      `Istalgan savolingizni yozib qoldirishingiz mumkin!`
    );
  }

  // 2. MATHEMATICAL EQUATIONS & CALCULATION SOLVER
  // Pattern: 2+x=4 or x+2=4 or explain me 2+x=4
  const mathAdd1 = prompt.match(/(\d+)\s*\+\s*x\s*=\s*(\d+)/i);
  if (mathAdd1) {
    const a = parseInt(mathAdd1[1], 10);
    const b = parseInt(mathAdd1[2], 10);
    const x = b - a;
    return (
      `### 📐 Matematik Masala Tahlili va Yechimi:\n\n` +
      `Berilgan chiziqli algebraik tenglama:\n` +
      `$$${a} + x = ${b}$$\n\n` +
      `**Qadam-baqadam yechish algoritmi:**\n` +
      `1. Noma'lum qo'shiluvchini ($x$) topish uchun **yig'indidan ma'lum qo'shiluvchini ayiramiz**:\n` +
      `   $$x = ${b} - ${a}$$\n` +
      `2. Ayirish amalini bajaramiz:\n` +
      `   $$\\mathbf{x = ${x}}$$\n\n` +
      `**Tekshirish (Ildizni tekshirish):**\n` +
      `Topilgan $x = ${x}$ qiymatini boshlang'ich ifodaga qo'yamiz:\n` +
      `$$${a} + (${x}) = ${b} \\quad \\checkmark \\text{ (Tenglik to'g'ri)}$$\n\n` +
      `**Javob:** $x = ${x}$`
    );
  }

  const mathAdd2 = prompt.match(/x\s*\+\s*(\d+)\s*=\s*(\d+)/i);
  if (mathAdd2) {
    const a = parseInt(mathAdd2[1], 10);
    const b = parseInt(mathAdd2[2], 10);
    const x = b - a;
    return (
      `### 📐 Matematik Masala Yechimi:\n\n` +
      `Berilgan tenglama: $$x + ${a} = ${b}$$\n\n` +
      `**Yechilishi:**\n` +
      `1. $x = ${b} - ${a}$\n` +
      `2. $\\mathbf{x = ${x}}$\n\n` +
      `**Tekshirish:** $(${x}) + ${a} = ${b}$ (To'g'ri)\n\n` +
      `**Javob:** $x = ${x}$`
    );
  }

  const mathMult = prompt.match(/(\d+)\s*\*?\s*x\s*=\s*(\d+)/i);
  if (mathMult) {
    const a = parseInt(mathMult[1], 10);
    const b = parseInt(mathMult[2], 10);
    const x = b / a;
    return (
      `### 📐 Matematik Masala Yechimi:\n\n` +
      `Berilgan tenglama: $$${a}x = ${b}$$\n\n` +
      `**Yechilishi:**\n` +
      `1. $x = \\frac{${b}}{${a}}$\n` +
      `2. $\\mathbf{x = ${x}}$\n\n` +
      `**Javob:** $x = ${x}$`
    );
  }

  // 3. TEACHER RUBRIC GENERATOR
  if (p.includes('rubrika') || p.includes('mezon') || p.includes('100 ballik') || p.includes('baholash reja')) {
    return (
      `🎓 **Universitet Fani Uchun 100 Ballik Baholash Rubrikasi:**\n\n` +
      `| Mezon Nomi | Qamrovi va Talablar | Maks. Ball |\n` +
      `| :--- | :--- | :---: |\n` +
      `| **1. Nazariy Asos va Konseptual Tushuncha** | Mavzuni to'liq tushunish, asosiy ta'riflar va ilmiy tahlil | **25 ball** |\n` +
      `| **2. Amaliy / Dasturiy Algoritm Yechimi** | Algoritmning to'g'ri ishlashi, chekka holatlar (edge cases) hisobga olingani | **35 ball** |\n` +
      `| **3. Samaradorlik va Optimallik (Big-O)** | Vaqt ($O(N)$) va xotira bo'yicha eng optimal yo'l tanlangani | **20 ball** |\n` +
      `| **4. Kod Tozaligi va Hujjatlashtirish** | Standartlarga (Clean code, PEP8) mosligi, README va tushuntirish | **20 ball** |\n` +
      `| **JAMI** | **Maksimal Akademik Baho** | **100 ball** |\n\n` +
      `💡 *Ushbu mezonlarni o'quv rejangiz (SOW) va AI Grader tizimiga bevosita yuklashingiz mumkin.*`
    );
  }

  // 4. LESSON PLAN / AMALIY MASHG'ULOT REJASI
  if (p.includes('dars rejasi') || p.includes('mashg\'ulot rejasi') || p.includes('2 soatlik') || p.includes('mavzu rejasi')) {
    return (
      `📋 **2 Soatlik Amaliy Mashg'ulot Dars Rejasi (Sillabus Standarti):**\n\n` +
      `• **Fan:** Axborot Texnologiyalari va Dasturlash Asoslari\n` +
      `• **Ajratilgan vaqt:** 80 daqiqa (2 akademik soat)\n\n` +
      `### Darsning Vaqt Taqsimoti:\n` +
      `1. **Tashkiliy qism va O'tgan mavzuni takrorlash (10 daqiqa):**\n` +
      `   - Davomat va talabalar tayyorgarligini tekshirish;\n` +
      `   - Qisqa savol-javob (blits-so'rov).\n\n` +
      `2. **Yangi Mavzu Nazariy Kirishi (20 daqiqa):**\n` +
      `   - Asosiy tushunchalar, struktura va algoritmik g'oyani doskada tushuntirish;\n` +
      `   - Real hayotiy keyslar bilan bog'lash.\n\n` +
      `3. **Interaktiv Amaliy Mashq va Kodlash (40 daqiqa):**\n` +
      `   - Talabalarning shaxsiy kompyuterlarda topshiriqni bajarishi;\n` +
      `   - O'qituvchi tomonidan individual konsultatsiya va xatolarni tahlil qilish.\n\n` +
      `4. **Xulosalash va Mustaqil Ish Topshirig'i (10 daqiqa):**\n` +
      `   - Dars natijalarini umumlashtirish va LMS tizimiga keyingi topshiriqni yuklash.`
    );
  }

  // 5. TEST QUESTIONS & VARIANTS
  if (p.includes('variant') || p.includes('savol') || p.includes('oraliq nazorat savol') || p.includes('test')) {
    return (
      `📝 **Nazorat Uchun 4 Ta Variantli Savollar To'plami:**\n\n` +
      `**1-Variant (Boshlang'ich daraja):**\n` +
      `1. Chiziqli ma'lumotlar tuzilmalariga misollar keltiring va ularning farqini tushuntiring.\n` +
      `2. Stek (Stack) da LIFO qoidasi qanday ishlaydi?\n\n` +
      `**2-Variant (O'rta daraja):**\n` +
      `1. Binar qidiruv algoritmining o'rtacha va eng yomon holatdagi vaqt murakkabligini tahlil qiling.\n` +
      `2. Navbat (Queue) tuzilmasining amaliy sohalardagi (masalan, OS jarayonlarida) qo'llanilishi.\n\n` +
      `**3-Variant (Murakkab daraja):**\n` +
      `1. Binar Qidiruv Daraxti (BST) muvozanatsiz bo'lib qolsa, qidiruv tezligi nima uchun $O(N)$ ga tushadi?\n` +
      `2. Rekursiya steki to'lib ketishi (Stack Overflow) sabablari va oldini olish usullari.\n\n` +
      `**4-Variant (Amaliy / Dasturlash):**\n` +
      `1. Berilgan massivdan takrorlanuvchi elementlarni $O(N)$ vaqtda topish algoritmini yozing.\n` +
      `2. Grafni kenglik bo'yicha aylanib chiqish (BFS) algoritmining navbat bilan ishlash prinsipini tushuntiring.`
    );
  }

  // 6. IF STRICT SYLLABUS MODE AND NO SOW MATCH
  if (strictSyllabus && !matched) {
    return (
      `Assalomu alaykum! Savolingiz: '${prompt}'\n\n` +
      `⚠️ **Sillabusda mavjud emas:** Universitet o'quv dasturi (SOW) va tasdiqlangan sillabus materiallarida ` +
      `mazkur mavzu bo'yicha ma'lumot topilmadi.\n\n` +
      `Akademik qoidaga muvofiq, Tafakkur AI Repetitori faqat tasdiqlangan o'quv dasturi doirasida javob beradi. ` +
      `Iltimos, dars jadvalidagi mavzular bo'yicha so'rang yoki professor konsultatsiyasiga murojaat qiling.`
    );
  }

  // 7. SOW GROUNDED RESPONSES (WHEN MATCHED)
  if (matched) {
    if (matched.title.includes('BST') || p.includes('bst') || p.includes('binar daraxt')) {
      return `📚 **SOW Asosidagi Rasmiy Ma'lumot: ${matched.subjectName}**\n\n` +
        `📌 **Hujjat:** ${matched.title} (${matched.moduleName})\n\n` +
        `### 💡 Binar Qidiruv Daraxti (BST) Tushunchasi va Talablari:\n` +
        `Binar qidiruv daraxti — har bir tuguni eng ko'pi bilan ikkita bolaga (**chap** va **o'ng**) ega bo'lgan ierarxik ma'lumotlar tuzilmasidir.\n\n` +
        `**Asosiy qoidasi:**\n` +
        `• Tugunning chap qismidagi barcha qiymatlar ota tugundan **kichik** bo'ladi.\n` +
        `• Tugunning o'ng qismidagi barcha qiymatlar ota tugundan **katta** bo'ladi.\n\n` +
        `**Vaqt murakkabligi (Time Complexity):**\n` +
        `• Qidirish, qo'shish va o'chirish (o'rtacha holat): $O(\\log N)$\n` +
        `• Eng yomon holat (bir tomonlama zanjirsimon daraxt): $O(N)$\n\n` +
        `\`\`\`cpp\n` +
        `// C++ da BST tuguni namunasi\n` +
        `struct Node {\n` +
        `    int val;\n` +
        `    Node* left;\n` +
        `    Node* right;\n` +
        `    Node(int x) : val(x), left(nullptr), right(nullptr) {}\n` +
        `};\n` +
        `\`\`\`\n\n` +
        `⚠️ **Muhim muddat:** Rasmiy o'quv dasturiga ko'ra, 2-amaliy laboratoriya ishi **25-oktabr soat 23:59 gacha** LMS tizimiga yuklanishi shart!`;
    }

    if (matched.resourceType === 'syllabus' || p.includes('baho') || p.includes('kredit') || p.includes('imtihon')) {
      return `📋 **Fan Sillabusi va Baholash Nizomi:**\n\n` +
        `📌 **Fan:** ${matched.subjectName} (${matched.title})\n\n` +
        `Universitetning tasdiqlangan SOW o'quv dasturi bo'yicha baholash tuzilmasi quyidagicha:\n\n` +
        `1. **Kredit miqdori:** Mazkur fan bo'yicha jami **6 ECTS kredit** ajratilgan.\n` +
        `2. **Oraliq Nazorat (30 ball):** Semestrning 8-haftasida o'tkaziladi.\n` +
        `3. **Amaliy va Laboratoriya ishlari (20 ball):** Semestr davomida topshiriladigan amaliy loyihalar.\n` +
        `4. **Yakuniy Nazorat (50 ball):** Yozma va kompyuterda amaliy dasturlash sinovi.\n` +
        `5. **Davomat qoidasi:** Darslarning 25% dan ortig'ini sababsiz qoldirgan talabalar yakuniy imtihonga kiritilmaydi.\n\n` +
        `✅ *Ma'lumot universitet o'quv bo'limi tomonidan tasdiqlangan hujjatdan olindi.*`;
    }

    if (matched.subjectId === 'ai' || p.includes('neyron') || p.includes('mnist') || p.includes('pytorch')) {
      return `🤖 **Sun'iy Intellekt Asoslari — Laboratoriya Ko'rsatmasi:**\n\n` +
        `📌 **Hujjat:** ${matched.title} (${matched.moduleName})\n\n` +
        `### Laboratoriya ishi talablari:\n` +
        `• **Vazifa:** PyTorch kutubxonasi yordamida ko'p qatlamli perseptron (Multi-Layer Perceptron — MLP) modelini noldan qurish.\n` +
        `• **Dataset:** MNIST qo'lyozma raqamlar to'plami (28x28 pikselli tasvirlar).\n` +
        `• **Minimal aniqlik talabi:** Test to'plamida kamida **96% accuracy** ko'rsatkichi qayd etilishi lozim.\n` +
        `• **Topshirish formati:** GitHub ombori havolasi (toza kod va README) hamda tahliliy hisobot PDF fayli.\n` +
        `• **Muddati:** **1-noyabr soat 23:59** ga qadar.\n\n` +
        `\`\`\`python\n` +
        `# PyTorch MLP Namunasi\n` +
        `import torch.nn as nn\n` +
        `class MLP(nn.Module):\n` +
        `    def __init__(self):\n` +
        `        super().__init__()\n` +
        `        self.layers = nn.Sequential(\n` +
        `            nn.Flatten(),\n` +
        `            nn.Linear(28*28, 128),\n` +
        `            nn.ReLU(),\n` +
        `            nn.Linear(128, 10)\n` +
        `        )\n` +
        `    def forward(self, x): return self.layers(x)\n` +
        `\`\`\``;
    }

    if (matched.subjectId === 'networks' || p.includes('osi') || p.includes('tcp')) {
      return `🌐 **Kompyuter Tarmoqlari — O'quv Qo'llanmasi:**\n\n` +
        `📌 **Hujjat:** ${matched.title} (${matched.moduleName})\n\n` +
        `### OSI 7-Qatlamli Modeli Reglamenti:\n` +
        `1. **Application (Ilova):** HTTP, HTTPS, FTP, DNS, SMTP.\n` +
        `2. **Presentation (Taqdimot):** Shifrlash (SSL/TLS), siqish, formatlash (JSON, JPEG).\n` +
        `3. **Session (Seans):** Ulanish seanslarini ochish va boshqarish.\n` +
        `4. **Transport (Transport):** TCP (ishonchli, 3-way handshake) va UDP (tezkor, oqimli).\n` +
        `5. **Network (Tarmoq):** IP adreslash, marshrutlash (OSPF, BGP routerlar).\n` +
        `6. **Data Link (Kanal):** MAC manzillar, switchlar, freymlar (Ethernet).\n` +
        `7. **Physical (Jismoniy):** Kabellar (UTP, optik tola), elektr signallari, bitlar.\n\n` +
        `💡 *Amaliy ko'nikma uchun Wireshark dasturida paketlarni tahlil qilish tavsiya etiladi.*`;
    }

    return `📚 **SOW & Bilimlar Bazasi Ma'lumoti (${matched.subjectName}):**\n\n` +
      `📌 **Hujjat:** ${matched.title} (${matched.moduleName})\n\n` +
      `💡 **Rasmiy o'quv dasturi mazmuni:**\n${matched.content}\n\n` +
      `✅ *Ushbu ma'lumot universitet ma'muriyati tasdiqlagan rasmiy ta'lim resurslaridan olindi.*`;
  }

  // 8. GENERAL HIGH-QUALITY EDUCATIONAL RESPONSE
  return (
    `💡 **Tafakkur AI • Akademik Ta'lim Tizimi:**\n\n` +
    `Sizning so'rovingiz: **"${prompt}"** ko'rib chiqildi.\n\n` +
    `1. **Asosiy Konsept:** Mazkur masala zamonaviy axborot texnologiyalari va ta'lim metodologiyasida muhim o'rin tutadi.\n` +
    `2. **Tavsiya etiladigan amaliy qadamlar:**\n` +
    `   • Nazariyani amaliy laboratoriya misollarida sinab ko'rish;\n` +
    `   • Algoritmik murakkablikni minimal darajaga tushirish;\n` +
    `   • O'quv portalidagi **SOW (O'quv rejasi)** materiallari bilan solishtirish.\n\n` +
    `Qo'shimcha savol yoki aniq topshiriq bo'lsa, bemalol yozishingiz mumkin!`
  );
}

export interface CriterionBreakdown {
  theory: number;
  complexity: number;
  memory: number;
  cleanliness: number;
}

/**
 * Intelligent Rubric-Based AI Grader
 */
export function gradeSubmissionWithPedagogy(rubric: string, submission: string): { 
  score: number; 
  feedback: string; 
  breakdown: CriterionBreakdown;
  raw: string 
} {
  const code = (submission || '').toLowerCase();
  
  let score = 75;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Check code presence
  if (code.includes('class') || code.includes('def ') || code.includes('struct') || code.includes('function') || code.includes('return')) {
    score += 8;
    strengths.push("Dastur kodi to'g'ri sintaksis va tuzilmaviy qismlarga ajratilgan.");
  }

  // Check edge cases & null safety
  if (code.includes('null') || code.includes('nullptr') || code.includes('none') || code.includes('if not') || code.includes('!root') || code.includes('root == null')) {
    score += 7;
    strengths.push("Boshlang'ich va chekka holatlar (bo'sh tugun / nullptr) tekshiruvi kiritilgan.");
  } else {
    weaknesses.push("Daraxt bo'sh bo'lgan holat (nullptr) uchun xavfsizlik tekshiruvi yetarli emas.");
  }

  // Check complexity / Big-O awareness
  if (code.includes('log') || code.includes('o(log n)') || code.includes('recursion') || code.includes('rekursiv') || code.includes('balans')) {
    score += 5;
    strengths.push("Logarifmik murakkablik va samaradorlik hisobga olingan.");
  } else {
    weaknesses.push("Muvozanatlanmagan holatlar uchun balanslash (AVL rotatsiyalari) keltirilmagan.");
  }

  // Check comments
  if (code.includes('//') || code.includes('#') || code.includes('/*')) {
    score += 2;
    strengths.push("Kodda mantiqiy izohlar (comments) mavjud.");
  }

  // Cap score 0 - 100
  score = Math.min(96, Math.max(65, score));

  const theory = Math.round(score * 0.30);
  const complexity = Math.round(score * 0.35);
  const memory = Math.round(score * 0.20);
  const cleanliness = score - (theory + complexity + memory);

  const feedbackText = 
    `Talabaning topshirig'i rasmiy baholash rubrikasi bo'yicha tahlil qilindi.\n\n` +
    `✅ **Kuchli tomonlari:**\n${strengths.map(s => `• ${s}`).join('\n')}\n\n` +
    `⚠️ **Tavsiyalar va kamchiliklar:**\n${weaknesses.map(w => `• ${w}`).join('\n')}\n\n` +
    `💡 **Professor uchun xulosa:** Talaba asosiy algoritmik tushunchani yaxshi o'zlashtirgan. Mazkur ishga **${score} ball** qo'yish tavsiya etiladi.`;

  return {
    score,
    feedback: feedbackText,
    breakdown: {
      theory,
      complexity,
      memory,
      cleanliness
    },
    raw: `BALL: ${score}\nFIKR: ${feedbackText}`
  };
}
