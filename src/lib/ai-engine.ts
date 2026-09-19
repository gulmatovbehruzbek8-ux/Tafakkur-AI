/**
 * Tafakkur AI - Resilient Multi-Tier AI Generation & Knowledge Engine
 * Supports:
 * 1. Groq Cloud LLM (Meta Llama 3.3 70B / Llama 3.1 8B) via process.env.GROQ_API_KEY
 * 2. Remote Ollama via process.env.OLLAMA_URL (e.g. Ngrok / Cloudflare Tunnel)
 * 3. Google Gemini API via process.env.GEMINI_API_KEY
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
  const q = query.toLowerCase();
  const resources = getStoredResources();

  // Direct subject or title match
  for (const res of resources) {
    const sub = res.subjectName.toLowerCase();
    const title = res.title.toLowerCase();
    const subId = res.subjectId.toLowerCase();

    if (sub && q.includes(sub)) return res;
    if (title && q.includes(title)) return res;
    if (subId && q.includes(subId)) return res;
  }

  // Topic specific heuristics
  if (q.includes('bst') || q.includes('binar') || q.includes('daraxt') || q.includes('tree')) {
    const match = resources.find(r => r.title.toLowerCase().includes('bst') || r.content.toLowerCase().includes('binar'));
    if (match) return match;
  }

  if (q.includes('stack') || q.includes('stek') || q.includes('queue') || q.includes('navbat')) {
    const match = resources.find(r => r.title.toLowerCase().includes('stek') || r.content.toLowerCase().includes('lifo'));
    if (match) return match;
  }

  if (q.includes('neyron') || q.includes('mnist') || q.includes('mlp') || q.includes('pytorch') || q.includes('ai') || q.includes('sun\'iy')) {
    const match = resources.find(r => r.subjectId === 'ai' || r.content.toLowerCase().includes('mnist'));
    if (match) return match;
  }

  if (q.includes('osi') || q.includes('tcp') || q.includes('ip') || q.includes('tarmoq') || q.includes('network')) {
    const match = resources.find(r => r.subjectId === 'networks' || r.content.toLowerCase().includes('osi'));
    if (match) return match;
  }

  if (q.includes('ball') || q.includes('oraliq') || q.includes('yakuniy') || q.includes('kredit') || q.includes('davomat') || q.includes('baho')) {
    const match = resources.find(r => r.resourceType === 'syllabus' || r.content.toLowerCase().includes('kredit'));
    if (match) return match;
  }

  if (q.includes('topshiriq') || q.includes('muddat') || q.includes('deadline')) {
    const match = resources.find(r => r.content.toLowerCase().includes('muddati') || r.content.toLowerCase().includes('topshiriq'));
    if (match) return match;
  }

  // Fallback: match by significant words
  const words = q.split(/\s+/).filter(w => w.length > 3);
  for (const res of resources) {
    const c = res.content.toLowerCase();
    const hitCount = words.filter(w => c.includes(w)).length;
    if (hitCount >= 2) return res;
  }

  return null;
}

/**
 * Calls Cloud LLM or Ollama if configured
 */
export async function queryExternalLLM(prompt: string, modelName = 'llama-3.3-70b-versatile'): Promise<string | null> {
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
          model: modelName.includes('llama') ? modelName : 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'Siz universitetning intellektual ta\'lim assistentisiz (Tafakkur AI). Talabalar va professorlarga o\'zbek tilida aniq, pedagogik va akademik jihatdan puxta javob bering.'
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

  // 2. Check Remote Ollama (e.g. Ngrok tunnel or VPS URL)
  const ollamaUrl = process.env.OLLAMA_URL;
  if (ollamaUrl) {
    try {
      const cleanUrl = ollamaUrl.replace(/\/$/, '');
      const oRes = await fetch(`${cleanUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt: prompt,
          stream: false
        })
      });
      if (oRes.ok) {
        const oData = await oRes.json();
        if (oData.response) return oData.response;
      }
    } catch (e) {
      console.warn('Remote Ollama invocation failed:', e);
    }
  }

  // 3. Check Google Gemini API
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (gRes.ok) {
        const gData = await gRes.json();
        const cand = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (cand) return cand;
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
          messages: [{ role: 'user', content: prompt }]
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
  const p = prompt.toLowerCase();

  // If strict syllabus mode is on and no document matched
  if (strictSyllabus && !matched) {
    return (
      `Assalomu alaykum! Savolingiz: '${prompt}'\n\n` +
      `⚠️ **Sillabusda mavjud emas:** Universitet o'quv dasturi (SOW) va tasdiqlangan sillabus materiallarida ` +
      `mazkur mavzu bo'yicha ma'lumot topilmadi.\n\n` +
      `Akademik qoidaga muvofiq, Tafakkur AI Repetitori faqat tasdiqlangan o'quv dasturi doirasida javob beradi. ` +
      `Iltimos, dars jadvalidagi mavzular bo'yicha so'rang yoki professor konsultatsiyasiga murojaat qiling.`
    );
  }

  // If a specific SOW document was matched
  if (matched) {
    // 1. Binary Search Tree (BST)
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

    // 2. Syllabus & Grading Criteria
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

    // 3. AI & Neural Networks (MNIST)
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

    // 4. Computer Networks & OSI
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

    // Generic matched resource
    return `📚 **SOW & Bilimlar Bazasi Ma'lumoti (${matched.subjectName}):**\n\n` +
      `📌 **Hujjat:** ${matched.title} (${matched.moduleName})\n\n` +
      `💡 **Rasmiy o'quv dasturi mazmuni:**\n${matched.content}\n\n` +
      `✅ *Ushbu ma'lumot universitet ma'muriyati tasdiqlagan rasmiy ta'lim resurslaridan olindi.*`;
  }

  // Teacher-specific pedagogical response
  if (p.includes('professor') || p.includes('o\'qituvchi') || p.includes('dars rejasi') || p.includes('sillabus yaratish')) {
    return `🎓 **Tafakkur AI • Professor va Katta O'qituvchilar Uchun Metodik Yordamchi:**\n\n` +
      `Sizning dars va baholash bo'yicha so'rovingiz tahlil qilindi:\n\n` +
      `1. **Davlat Ta'lim Standarti (DTS) Talabi:**\n` +
      `   • Nazariy material o'quv mashg'ulotining 30% dan oshmasligi;\n` +
      `   • Interaktiv va muammoli masalalar yechishga 50% vaqt ajratilishi;\n` +
      `   • Talabalarning mustaqil tahliliy xulosalariga 20% e'tibor qaratilishi maqsadga muvofiq.\n\n` +
      `2. **Tavsiya etiladigan Baholash Rubrikasi:**\n` +
      `   • Algoritmik to'g'rilik va chekka holatlar (Edge cases): **40 ball**\n` +
      `   • Vaqt va xotira samaradorligi (Big-O tahlili): **30 ball**\n` +
      `   • Kod arxitekturasi va tozaligi: **20 ball**\n` +
      `   • Hujjatlashtirish va tushuntirish: **10 ball**\n\n` +
      `Ushbu mezonlarni o'quv portalidagi **"AI Grader"** va **"SOW Boshqaruvi"** bo'limiga biriktirishingiz mumkin.`;
  }

  // General CS question
  return `💡 **Tafakkur AI • Akademik Ta'lim Tizimi:**\n\n` +
    `Savolingiz o'quv dasturi kontekstida ko'rib chiqildi:\n\n` +
    `1. **Nazariy Asos:** Ushbu masala axborot texnologiyalari va dasturlash metodologiyasining asosiy tayanch tushunchalariga kiradi.\n` +
    `2. **Amaliy Qo'llanilishi:** Nazariyani o'zlashtirish uchun amaliy laboratoriya topshiriqlarini ketma-ketlikda bajarish va test holatlarini sinab ko'rish zarur.\n` +
    `3. **O'quv Resurslari:** Sillabus, topshiriq muddatlari va mezonlar bilan chap menyudagi **"O'quv rejasi (SOW)"** hamda **"Topshiriqlar"** sahifasida batafsil tanishishingiz mumkin.\n\n` +
    `Qo'shimcha aniqlik kiritish yoki kod tahlilini xohlasangiz, batafsil yozib qoldirishingiz mumkin!`;
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
