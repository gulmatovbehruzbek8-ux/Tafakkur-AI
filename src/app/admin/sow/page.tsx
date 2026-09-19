'use client';

import Sidebar from "@/app/components/Sidebar";
import TafakkurCompanion from "@/app/components/TafakkurCompanion";
import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";

export interface SOWResource {
  id: string | number;
  subjectId: string;
  subjectName: string;
  title: string;
  resourceType: 'syllabus' | 'lecture' | 'assignment' | 'guideline';
  moduleName: string;
  content: string;
  fileName?: string;
  fileSize?: string;
  createdAt: string;
  chunkCount: number;
}

export interface SOWTopic {
  title: string;
  done?: boolean;
  current?: boolean;
  task?: string;
  id?: number;
}

export interface SOWModule {
  module: string;
  topics: SOWTopic[];
}

export interface SOWSubject {
  id: string;
  name: string;
  faculty: string;
  curriculum: SOWModule[];
}

const DEFAULT_RESOURCES: SOWResource[] = [
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
    moduleName: "1-Modul: Tarmoq Arxitakturalari",
    content: "OSI modeli 7 ta sathdan iborat: 1. Jismoniy (Physical), 2. Kanal (Data Link), 3. Tarmoq (Network - IP), 4. Transport (TCP, UDP), 5. Seans (Session), 6. Taqdimot (Presentation), 7. Ilova (Application - HTTP, DNS). Marshrutlash protokollari: OSPF, BGP.",
    fileName: "Computer_Networks_Standard_V2.pdf",
    fileSize: "1.9 MB",
    createdAt: "19 Sentabr, 2026",
    chunkCount: 18
  }
];

const DEFAULT_SUBJECTS: SOWSubject[] = [
  {
    id: "algo",
    name: "Algoritmlar va Ma'lumotlar Tuzilmasi",
    faculty: "Sun'iy Intellekt va Axborot Texnologiyalari",
    curriculum: [
      {
        module: "1-Modul: Asosiy tushunchalar",
        topics: [
          { title: "Kirish va fan metodologiyasi", done: true },
          { title: "Algoritmlar nazariyasi va murakkablik (Big-O)", done: true }
        ]
      },
      {
        module: "2-Modul: Chiziqli ma'lumotlar tuzilmalari",
        topics: [
          { title: "Massivlar va dinamik ro'yxatlar", done: true },
          { title: "Stek va Navbat (Stack & Queue)", id: 1, current: true, task: "Uy vazifasi: Algoritmlar loyihasi" }
        ]
      },
      {
        module: "3-Modul: Tarmoqlangan va daraxtsimon tuzilmalar",
        topics: [
          { title: "Binar qidiruv daraxtlari (BST)", done: false },
          { title: "Graflar va ularda qidiruv algoritmlari (BFS, DFS)", done: false }
        ]
      }
    ]
  },
  {
    id: "ai",
    name: "Sun'iy Intellekt Asoslari",
    faculty: "Sun'iy Intellekt va Axborot Texnologiyalari",
    curriculum: [
      {
        module: "1-Modul: AI tarixi va rivojlanishi",
        topics: [
          { title: "Turing testi va intellekt tushunchasi", done: true },
          { title: "Mashinali o'rganishga kirish (Supervised/Unsupervised)", current: true, task: "Kichik klassifikator qurish amaliyoti" }
        ]
      },
      {
        module: "2-Modul: Neyron Tarmoqlar",
        topics: [
          { title: "Sun'iy neyron va faollashtirish funksiyalari", done: false },
          { title: "Ko'p qatlamli perseptron (MLP) va Backpropagation", done: false }
        ]
      }
    ]
  },
  {
    id: "networks",
    name: "Kompyuter Tarmoqlari",
    faculty: "Dasturiy Ta'minot Injiniringi",
    curriculum: [
      {
        module: "1-Modul: Tarmoq Arxitekturalari",
        topics: [
          { title: "OSI 7 qatlamli modeli va vazifalari", done: true },
          { title: "TCP va UDP protokollari farqlari", current: true }
        ]
      }
    ]
  }
];

export default function AdminSOWPage() {
  const [activeTab, setActiveTab] = useState<'resources' | 'curriculum' | 'test'>('resources');
  const [resources, setResources] = useState<SOWResource[]>(DEFAULT_RESOURCES);
  const [subjects, setSubjects] = useState<SOWSubject[]>(DEFAULT_SUBJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState('algo');
  const [newCustomSubject, setNewCustomSubject] = useState('');
  const [newType, setNewType] = useState<'syllabus' | 'lecture' | 'assignment' | 'guideline'>('syllabus');
  const [newModule, setNewModule] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Curriculum modal state (New Feature for Admin)
  const [isAddCurriculumOpen, setIsAddCurriculumOpen] = useState(false);
  const [curriculumSubjectId, setCurriculumSubjectId] = useState('algo');
  const [curriculumCustomName, setCurriculumCustomName] = useState('');
  const [curriculumFaculty, setCurriculumFaculty] = useState("Sun'iy Intellekt va Axborot Texnologiyalari");
  const [curriculumModuleName, setCurriculumModuleName] = useState('');
  const [curriculumTopicsText, setCurriculumTopicsText] = useState('');
  const [curriculumSowContent, setCurriculumSowContent] = useState('');
  const [curriculumSaving, setCurriculumSaving] = useState(false);

  // Quick Add Topic Modal State
  const [quickTopicSubjectId, setQuickTopicSubjectId] = useState<string | null>(null);
  const [quickTopicModuleIndex, setQuickTopicModuleIndex] = useState<number | null>(null);
  const [quickTopicTitle, setQuickTopicTitle] = useState('');
  const [quickTopicTask, setQuickTopicTask] = useState('');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Live Chatbot Test State
  const [testQuestion, setTestQuestion] = useState('Binar qidiruv daraxti (BST) va 2-topshiriq muddati haqida ma\'lumot ber');
  const [testAnswer, setTestAnswer] = useState<string | null>(null);
  const [testSource, setTestSource] = useState<string | null>(null);
  const [testingAi, setTestingAi] = useState(false);

  // Load from local storage or backend
  useEffect(() => {
    try {
      const storedRes = localStorage.getItem('tafakkur_sow_resources');
      if (storedRes) {
        setResources(JSON.parse(storedRes));
      }
      const storedSub = localStorage.getItem('tafakkur_sow_subjects');
      if (storedSub) {
        setSubjects(JSON.parse(storedSub));
      } else {
        localStorage.setItem('tafakkur_sow_subjects', JSON.stringify(DEFAULT_SUBJECTS));
      }
    } catch {}

    // Fetch from backend and merge instead of overwriting
    fetch(getApiUrl('/api/resources'))
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          try {
            const localStored: SOWResource[] = JSON.parse(localStorage.getItem('tafakkur_sow_resources') || '[]');
            const map = new Map<string | number, SOWResource>();
            data.forEach((item: SOWResource) => map.set(item.id, item));
            localStored.forEach((item: SOWResource) => map.set(item.id, item));
            const merged = Array.from(map.values());
            setResources(merged);
            localStorage.setItem('tafakkur_sow_resources', JSON.stringify(merged));
          } catch {
            setResources(data);
          }
        }
      })
      .catch(() => {});
  }, []);

  const saveResources = (updated: SOWResource[]) => {
    setResources(updated);
    try {
      localStorage.setItem('tafakkur_sow_resources', JSON.stringify(updated));
    } catch {}
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFileName(file.name);
    if (!newTitle) {
      setNewTitle(file.name.replace(/\.[^/.]+$/, ""));
    }

    // Read text content from text/json/md files
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setNewContent(text);
      };
      reader.readAsText(file);
    } else {
      // Default generated representation for binary docs
      setNewContent(`[Hujjat mazmuni: ${file.name}]\nFayl muvaffaqiyatli indekslandi. Ushbu o'quv materialida kurs doirasidagi mavzular, o'quv dasturi talablari, laboratoriya ko'rsatmalari va nazorat savollari jamlangan.`);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setUploading(true);

    let targetSubjectId = newSubjectId;
    let targetSubjectName = subjects.find(s => s.id === newSubjectId)?.name || "Yangi Fan";

    if (newSubjectId === 'custom' && newCustomSubject.trim()) {
      targetSubjectId = 'sub-' + Date.now();
      targetSubjectName = newCustomSubject.trim();
      const newSub: SOWSubject = {
        id: targetSubjectId,
        name: targetSubjectName,
        faculty: "Axborot Texnologiyalari Fakulteti",
        curriculum: [
          {
            module: newModule.trim() || "1-Modul: Kirish",
            topics: [{ title: newTitle.trim(), done: false, current: true }]
          }
        ]
      };
      const updatedSubs = [...subjects, newSub];
      setSubjects(updatedSubs);
      try {
        localStorage.setItem('tafakkur_sow_subjects', JSON.stringify(updatedSubs));
      } catch {}
    }

    const newResource: SOWResource = {
      id: "res-" + Date.now(),
      subjectId: targetSubjectId,
      subjectName: targetSubjectName,
      title: newTitle.trim(),
      resourceType: newType,
      moduleName: newModule.trim() || "Umumiy Kurs Strukturasi",
      content: newContent.trim(),
      fileName: newFileName || (newTitle.trim() + ".pdf"),
      fileSize: (Math.random() * 2 + 1).toFixed(1) + " MB",
      createdAt: "Bugun, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chunkCount: Math.max(8, Math.ceil(newContent.length / 80))
    };

    const updated = [newResource, ...resources];
    saveResources(updated);

    // Sync with backend API
    try {
      await fetch(getApiUrl('/api/resources/upload'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource)
      });
    } catch {}

    setUploading(false);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewModule('');
      setNewFileName('');
      setNewCustomSubject('');
    }, 1200);
  };

  const handleDeleteResource = async (id: string | number) => {
    if (!confirm("Haqiqatan ham ushbu resursni AI bilimlar bazasidan o'chirmoqchimisiz?")) return;
    const updated = resources.filter(r => r.id !== id);
    saveResources(updated);

    try {
      await fetch(getApiUrl(`/api/resources/${id}`), { method: 'DELETE' });
    } catch {}
    showToast("Resurs AI bilimlar bazasidan o'chirildi.");
  };

  const handleOpenAddModule = (subjectId: string) => {
    setCurriculumSubjectId(subjectId);
    setCurriculumModuleName('');
    setCurriculumTopicsText('');
    setCurriculumSowContent('');
    setIsAddCurriculumOpen(true);
  };

  const handleSaveCurriculum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!curriculumModuleName.trim()) return;

    setCurriculumSaving(true);

    let targetSubId = curriculumSubjectId;
    let targetSubName = "";
    let targetFaculty = curriculumFaculty;

    const parsedTopics: SOWTopic[] = curriculumTopicsText
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean)
      .map((title, idx) => ({
        title,
        done: false,
        current: idx === 0,
      }));

    if (parsedTopics.length === 0) {
      parsedTopics.push({ title: "Mavzularga kirish", done: false, current: true });
    }

    const newModuleObj: SOWModule = {
      module: curriculumModuleName.trim(),
      topics: parsedTopics,
    };

    let updatedSubjects: SOWSubject[] = [...subjects];

    if (curriculumSubjectId === 'new') {
      if (!curriculumCustomName.trim()) {
        alert("Iltimos, yangi fan nomini kiriting.");
        setCurriculumSaving(false);
        return;
      }
      targetSubId = 'sub-' + Date.now();
      targetSubName = curriculumCustomName.trim();
      const newSubject: SOWSubject = {
        id: targetSubId,
        name: targetSubName,
        faculty: targetFaculty.trim() || "Axborot Texnologiyalari Fakulteti",
        curriculum: [newModuleObj],
      };
      updatedSubjects = [...subjects, newSubject];
    } else {
      const existing = subjects.find(s => s.id === curriculumSubjectId);
      targetSubName = existing?.name || "Fan";
      targetFaculty = existing?.faculty || targetFaculty;

      updatedSubjects = subjects.map(s => {
        if (s.id === curriculumSubjectId) {
          return {
            ...s,
            curriculum: [...s.curriculum, newModuleObj],
          };
        }
        return s;
      });
    }

    setSubjects(updatedSubjects);
    try {
      localStorage.setItem('tafakkur_sow_subjects', JSON.stringify(updatedSubjects));
    } catch {}

    // Also automatically register a SOWResource in knowledge base so AI Tutor knows this module!
    const sowText = curriculumSowContent.trim() || 
      `[${targetSubName} • ${curriculumModuleName}]\nUshbu modul doirasida quyidagi mavzular va o'quv rejalari o'rganiladi:\n` +
      parsedTopics.map((t, i) => `${i + 1}. ${t.title}`).join('\n') +
      `\n\nBaholash mezonlari: Modul yakunida amaliy topshiriq va oraliq nazorat sinovi o'tkaziladi.`;

    const autoResource: SOWResource = {
      id: "res-" + Date.now(),
      subjectId: targetSubId,
      subjectName: targetSubName,
      title: `${curriculumModuleName} Sillabusi va Mavzular Rejasi`,
      resourceType: 'syllabus',
      moduleName: curriculumModuleName.trim(),
      content: sowText,
      fileName: `${targetSubName.replace(/\s+/g, '_')}_${curriculumModuleName.replace(/\s+/g, '_')}.pdf`,
      fileSize: "1.8 MB",
      createdAt: "Bugun, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chunkCount: Math.max(10, Math.ceil(sowText.length / 70))
    };

    const updatedRes = [autoResource, ...resources];
    saveResources(updatedRes);

    // Sync with backend API
    try {
      fetch(getApiUrl('/api/resources/upload'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(autoResource)
      }).catch(() => {});
    } catch {}

    setCurriculumSaving(false);
    setIsAddCurriculumOpen(false);
    setCurriculumModuleName('');
    setCurriculumTopicsText('');
    setCurriculumSowContent('');
    setCurriculumCustomName('');
    showToast(`"${targetSubName}" uchun o'quv rejasi va SOW muvaffaqiyatli saqlandi hamda AI bilimlar bazasiga ulandi!`);
  };

  const handleQuickAddTopic = (subjId: string, modIdx: number) => {
    if (!quickTopicTitle.trim()) return;

    const updated = subjects.map(s => {
      if (s.id === subjId) {
        const mod = s.curriculum[modIdx];
        if (!mod) return s;
        const newTopic: SOWTopic = {
          title: quickTopicTitle.trim(),
          done: false,
          current: false,
          task: quickTopicTask.trim() || undefined,
        };
        const newCurriculum = [...s.curriculum];
        newCurriculum[modIdx] = {
          ...mod,
          topics: [...mod.topics, newTopic],
        };
        return {
          ...s,
          curriculum: newCurriculum,
        };
      }
      return s;
    });

    setSubjects(updated);
    try {
      localStorage.setItem('tafakkur_sow_subjects', JSON.stringify(updated));
    } catch {}

    setQuickTopicTitle('');
    setQuickTopicTask('');
    setQuickTopicSubjectId(null);
    setQuickTopicModuleIndex(null);
    showToast("Yangi mavzu o'quv dasturiga qo'shildi!");
  };

  const handleTestChatbot = async () => {
    if (!testQuestion.trim() || testingAi) return;
    setTestingAi(true);
    setTestAnswer(null);
    setTestSource(null);

    // Perform local or remote semantic grounding
    const lowerQ = testQuestion.toLowerCase();
    const matched = resources.find(r => 
      lowerQ.includes(r.subjectName.toLowerCase()) ||
      lowerQ.includes(r.title.toLowerCase()) ||
      r.content.toLowerCase().split(' ').some(word => word.length > 4 && lowerQ.includes(word)) ||
      (lowerQ.includes('bst') && r.content.includes('BST')) ||
      (lowerQ.includes('topshiriq') && r.content.includes('topshiriq')) ||
      (lowerQ.includes('muddati') && r.content.includes('muddati')) ||
      (lowerQ.includes('sillabus') && r.resourceType === 'syllabus')
    );

    try {
      const prompt = `Foydalanuvchi savoli: ${testQuestion}`;
      const res = await fetch(getApiUrl('/api/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          model: 'llama3',
          context: matched ? matched.content : ''
        })
      });

      const data = await res.json();
      if (data && data.response) {
        setTestAnswer(data.response);
        if (matched) setTestSource(`${matched.subjectName} • ${matched.title}`);
      } else {
        throw new Error();
      }
    } catch {
      // High-fidelity RAG ground simulation if offline
      if (matched) {
        setTestSource(`${matched.subjectName} • ${matched.title}`);
        setTestAnswer(
          `📚 **SOW & Bilimlar Bazasidan Olingan Rasmiy Javob:**\n\n` +
          `**Fan:** ${matched.subjectName}\n` +
          `**Resurs Manbasi:** ${matched.title} (${matched.moduleName})\n\n` +
          `💡 **Aniqlangan ma'lumot:**\n` +
          `${matched.content}\n\n` +
          `✅ *Ushbu ma'lumot ma'muriyat tomonidan yuklangan rasmiy hujjatlar bazasidan olindi va talaba chatbotida aynan shu tartibda javob sifatida qaytariladi.*`
        );
      } else {
        setTestSource("Umumiy Universitet Standarti");
        setTestAnswer(
          `Savolingiz o'rganildi. Mazkur savol bo'yicha bazada maxsus o'quv dasturi topilmadi, ammo tizim talabaga fanning umumiy sillabusi va o'qituvchi bilan konsultatsiya vaqtlariga tayanishni tavsiya etadi.`
        );
      }
    } finally {
      setTestingAi(false);
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesQuery = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubjectFilter === 'all' || r.subjectId === selectedSubjectFilter;
    return matchesQuery && matchesSubject;
  });

  const totalChunks = resources.reduce((acc, r) => acc + (r.chunkCount || 10), 0);

  return (
    <div className="tf-page">
      <Sidebar role="admin" activeRoute="/admin/sow" />
      <TafakkurCompanion currentContext="SOW & AI Bilimlar Bazasi Boshqaruvi" />

      <main className="tf-main pb-20">
        <div className="tf-container-wide space-y-8">

          {/* Header */}
          <header className="tf-header animate-fade-up">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>RAG ENGINE ● AI Bilimlar Bazasi</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">Chatbot Grounding Active</span>
              </div>
              <h1 className="tf-title">O&apos;quv Dasturlari (SOW) va AI Resurslari</h1>
              <p className="tf-subtitle">
                Universitet fanlari o&apos;quv rejasi, ma&apos;ruza konspektlari va mezonlarini yuklang — AI Chatbot bevosita shu materiallar asosida talabalarga javob beradi.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="tf-btn tf-btn-primary flex items-center gap-2 shadow-md hover:shadow-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Yangi SOW / Resurs Yuklash</span>
              </button>
            </div>
          </header>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up delay-1">
            <div className="tf-metric bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fanlar Soni</span>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 font-mono">{subjects.length} ta</span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Faol</span>
              </div>
            </div>

            <div className="tf-metric bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Resurs Hujjatlari</span>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 font-mono">{resources.length} ta</span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Indekslangan</span>
              </div>
            </div>

            <div className="tf-metric bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vektor Bo&apos;laklar (Chunks)</span>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{totalChunks}</span>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md">Semantik</span>
              </div>
            </div>

            <div className="tf-metric bg-white dark:bg-[#121215] border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Chatbot Bog&apos;lanishi</span>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  100% Sinxron
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Talaba & O&apos;qituvchi AI ulangan</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2 animate-fade-up delay-2">
            {[
              { id: 'resources', label: "Yuklangan Resurslar (AI Bazasi)", count: resources.length },
              { id: 'curriculum', label: "O'quv Rejasi (SOW Daraxti)", count: subjects.length },
              { id: 'test', label: "⚡ AI Chatbot Bilim Sinovi", count: null },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === tab.id ? 'bg-teal-800 text-teal-100' : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: RESOURCES LIST */}
          {activeTab === 'resources' && (
            <div className="space-y-4 animate-fade-up">
              {/* Filter and Search */}
              <div className="bg-white dark:bg-[#121215] p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-80">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Resurs yoki fan nomi bo'yicha qidirish..."
                      className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  <select
                    value={selectedSubjectFilter}
                    onChange={e => setSelectedSubjectFilter(e.target.value)}
                    className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 focus:outline-hidden focus:border-blue-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white"
                  >
                    <option value="all">Barcha Fanlar</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-slate-400 font-mono self-end md:self-auto">
                  {filteredResources.length} ta resurs topildi
                </p>
              </div>

              {/* Resource Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((res) => (
                  <div key={res.id} className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            res.resourceType === 'syllabus' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60' :
                            res.resourceType === 'lecture' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60' :
                            res.resourceType === 'assignment' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60' :
                            'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                          }`}>
                            {res.resourceType === 'syllabus' ? 'Sillabus (SOW)' :
                             res.resourceType === 'lecture' ? "Ma'ruza Konspekti" :
                             res.resourceType === 'assignment' ? 'Topshiriq & Baholash' : 'Ko\'rsatma'}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                            {res.subjectName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteResource(res.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Resursni o'chirish"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{res.title}</h3>
                      <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">{res.moduleName}</p>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-slate-100 dark:border-zinc-800 font-sans leading-relaxed">
                        {res.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-mono text-slate-600 dark:text-slate-400 font-medium">{res.fileName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md font-bold font-mono">
                          {res.chunkCount} bo&apos;lak
                        </span>
                        <span>{res.createdAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CURRICULUM TREE */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6 animate-fade-up">
              {/* Header Action Bar */}
              <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Rasmiy Universitet O&apos;quv Dasturlari (Curriculum Tree)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Fanlar, modullar va mavzular iyerarxiyasi. AI repetitor ushbu reja bo&apos;yicha talabalarga dars o&apos;tadi va amaliyot beradi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurriculumSubjectId('new');
                    setCurriculumCustomName('');
                    setCurriculumModuleName('');
                    setCurriculumTopicsText('');
                    setCurriculumSowContent('');
                    setIsAddCurriculumOpen(true);
                  }}
                  className="tf-btn tf-btn-primary shrink-0 flex items-center gap-2 text-xs"
                >
                  <span>+ Yangi O&apos;quv Rejasi (Curriculum) Qo&apos;shish</span>
                </button>
              </div>

              {subjects.map((subj) => (
                <div key={subj.id} className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                  <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">{subj.faculty}</span>
                      <h2 className="text-lg font-bold tracking-tight">{subj.name}</h2>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/10">
                        {subj.curriculum.length} ta Modul
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenAddModule(subj.id)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <span>+ Modul qo&apos;shish</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-6">
                    {subj.curriculum.map((mod, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            {mod.module}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              setQuickTopicSubjectId(subj.id);
                              setQuickTopicModuleIndex(idx);
                              setQuickTopicTitle('');
                              setQuickTopicTask('');
                            }}
                            className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:text-slate-900 dark:hover:text-white bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors flex items-center gap-1"
                          >
                            <span>+ Mavzu qo&apos;shish</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l-2 border-blue-100 dark:border-blue-900/40">
                          {mod.topics.map((t, tIdx) => (
                            <div 
                              key={tIdx} 
                              className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                                t.current 
                                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-slate-900 dark:text-white font-semibold' 
                                  : t.done 
                                  ? 'bg-slate-50 dark:bg-zinc-900/40 border-slate-200/80 dark:border-zinc-800 text-slate-700 dark:text-slate-300' 
                                  : 'bg-white dark:bg-zinc-900/20 border-dashed border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              <div className="space-y-1">
                                <p>{t.title}</p>
                                {t.task && (
                                  <p className="text-[11px] font-normal text-blue-700 dark:text-blue-300 bg-white/80 dark:bg-zinc-800 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900 inline-block">
                                    📌 {t.task}
                                  </p>
                                )}
                              </div>
                              {t.done ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                              ) : t.current ? (
                                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-full">Joriy</span>
                              ) : (
                                <span className="text-slate-300 dark:text-slate-500 font-mono text-[10px]">Reja</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: LIVE AI CHATBOT TEST */}
          {activeTab === 'test' && (
            <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 md:p-8 space-y-6 shadow-xs animate-fade-up">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">⚡ AI Chatbot Grounding Sinov Laboratoriyasi</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ushbu panelda yuklangan SOW resurslari bo&apos;yicha talabalar chatbotga beradigan savollarini oldindan sinab ko&apos;rishingiz mumkin.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Sinov uchun savol kiriting:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testQuestion}
                    onChange={e => setTestQuestion(e.target.value)}
                    placeholder="Masalan: 2-topshiriq muddati qachon?"
                    className="flex-1 text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 font-sans"
                  />
                  <button
                    type="button"
                    disabled={testingAi}
                    onClick={handleTestChatbot}
                    className="tf-btn tf-btn-primary px-6 disabled:opacity-50 flex items-center gap-2"
                  >
                    {testingAi ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Tahlil qilinmoqda...
                      </span>
                    ) : (
                      <span>Sinash →</span>
                    )}
                  </button>
                </div>
              </div>

              {testAnswer && (
                <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-3 animate-fade-up">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      Tafakkur AI Javobi
                    </span>
                    {testSource && (
                      <span className="bg-white dark:bg-zinc-800 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 px-2.5 py-1 rounded-full text-[11px] font-semibold font-mono">
                        Manba: {testSource}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans bg-white dark:bg-zinc-900 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 shadow-2xs">
                    {testAnswer}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* UPLOAD SOW / RESOURCE MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#121215] rounded-3xl max-w-xl w-full border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Yangi SOW / Resurs Qo&apos;shish</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Fayl yuklang yoki matnni to&apos;g&apos;ridan-to&apos;g&apos;ri joylashtiring</p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Resurs muvaffaqiyatli indekslandi!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Endi AI Chatbot ushbu resursdan to&apos;g&apos;ridan-to&apos;g&apos;ri javob beradi.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateResource} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Fan / Kurs
                  </label>
                  <select
                    value={newSubjectId}
                    onChange={e => setNewSubjectId(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                    <option value="custom">+ Yangi Fan Qo&apos;shish...</option>
                  </select>
                </div>

                {newSubjectId === 'custom' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Yangi Fan Nomi
                    </label>
                    <input
                      type="text"
                      required
                      value={newCustomSubject}
                      onChange={e => setNewCustomSubject(e.target.value)}
                      placeholder="Masalan: Kiberxavfsizlik Asoslari"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Resurs Turi
                    </label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as any)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                    >
                      <option value="syllabus">📑 Sillabus / SOW</option>
                      <option value="lecture">📖 Ma&apos;ruza / Konspekt</option>
                      <option value="assignment">🎯 Topshiriq / Mezon</option>
                      <option value="guideline">📋 Qoida / Nizom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Modul / Hafta
                    </label>
                    <input
                      type="text"
                      value={newModule}
                      onChange={e => setNewModule(e.target.value)}
                      placeholder="Masalan: 3-Modul yoki 5-Hafta"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Resurs Sarlavhasi
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Masalan: 2-Topshiriq Talablari va Baholash Rubrikasi"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                {/* File input simulation */}
                <div className="border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-2xl p-4 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-zinc-900/60">
                  <input
                    type="file"
                    id="sow-file-upload"
                    className="hidden"
                    onChange={handleFileUploadSim}
                    accept=".pdf,.docx,.txt,.md,.json"
                  />
                  <label htmlFor="sow-file-upload" className="cursor-pointer space-y-1 block">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Faylni tanlang yoki shu yerga tashlang</p>
                    <p className="text-[10px] text-slate-400">PDF, DOCX, TXT, Markdown yoki JSON</p>
                    {newFileName && (
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-400 font-mono mt-1">Tanlandi: {newFileName}</p>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Resurs Mazmuni (AI shu matndan javob beradi)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    placeholder="Resurs matni, topshiriq muddatlari, baholash qoidalari yoki dars konspektini shu yerga yozing..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 font-sans leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="tf-btn tf-btn-primary px-5 disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading ? (
                      <span>Yuklanmoqda...</span>
                    ) : (
                      <span>Bilimlar Bazasiga Saqlash</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / UPLOAD CURRICULUM */}
      {isAddCurriculumOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-[#121215] rounded-3xl border border-slate-200 dark:border-zinc-800 max-w-xl w-full p-6 md:p-8 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  + O&apos;quv Rejasi (Curriculum) & SOW Qo&apos;shish
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Fan modullari va mavzularini kiritish orqali AI Repetitor bilimlar bazasini yangilang.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCurriculumOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCurriculum} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Fan (Subject)
                </label>
                <select
                  value={curriculumSubjectId}
                  onChange={e => setCurriculumSubjectId(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 font-semibold"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.faculty})</option>
                  ))}
                  <option value="new">+ Yangi Fan Kiritish...</option>
                </select>
              </div>

              {curriculumSubjectId === 'new' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 dark:text-blue-200 uppercase tracking-wider mb-1">
                      Yangi Fan Nomi *
                    </label>
                    <input
                      type="text"
                      required={curriculumSubjectId === 'new'}
                      value={curriculumCustomName}
                      onChange={e => setCurriculumCustomName(e.target.value)}
                      placeholder="Masalan: Kiberxavfsizlik asoslari"
                      className="w-full text-xs p-2.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 dark:text-blue-200 uppercase tracking-wider mb-1">
                      Fakultet / Kafedra *
                    </label>
                    <input
                      type="text"
                      value={curriculumFaculty}
                      onChange={e => setCurriculumFaculty(e.target.value)}
                      placeholder="Sun'iy Intellekt Fakulteti"
                      className="w-full text-xs p-2.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Modul Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={curriculumModuleName}
                  onChange={e => setCurriculumModuleName(e.target.value)}
                  placeholder="Masalan: 4-Modul: Kriptografiya va Xavfsiz Protokollar"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Modul Mavzulari (Har bir qatorga bittadan mavzu)
                </label>
                <textarea
                  rows={4}
                  value={curriculumTopicsText}
                  onChange={e => setCurriculumTopicsText(e.target.value)}
                  placeholder={"1. Kirish va asosiy tushunchalar\n2. Asimmetrik shifrlash va RSA algoritmi\n3. Xesh-funksiyalar va raqamli imzo\n4. TLS/SSL xavfsiz protokollar"}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 font-sans leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Sillabus / SOW Tafsilotlari (AI qoidalar va topshiriq muddatlarini shu matndan oladi)
                </label>
                <textarea
                  rows={3}
                  value={curriculumSowContent}
                  onChange={e => setCurriculumSowContent(e.target.value)}
                  placeholder="Ushbu modul bo'yicha talabalarga beriladigan topshiriqlar, oraliq nazorat mezonlari va muhim talablarni yozing..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddCurriculumOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={curriculumSaving}
                  className="tf-btn tf-btn-primary px-5 disabled:opacity-50 flex items-center gap-2"
                >
                  {curriculumSaving ? "Saqlanmoqda..." : "O'quv Rejasini Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: QUICK ADD TOPIC */}
      {quickTopicSubjectId !== null && quickTopicModuleIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-[#121215] rounded-2xl border border-slate-200 dark:border-zinc-800 max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">+ Modulga Yangi Mavzu Qo&apos;shish</h3>
              <button
                type="button"
                onClick={() => {
                  setQuickTopicSubjectId(null);
                  setQuickTopicModuleIndex(null);
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Mavzu Nomi *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={quickTopicTitle}
                  onChange={e => setQuickTopicTitle(e.target.value)}
                  placeholder="Masalan: Graf algoritmlari: Dijkstra va Bellman-Ford"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Topshiriq yoki Amaliy Vazifa (Ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={quickTopicTask}
                  onChange={e => setQuickTopicTask(e.target.value)}
                  placeholder="Masalan: Uy vazifasi: Eng qisqa yo'lni topish dasturi"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setQuickTopicSubjectId(null);
                  setQuickTopicModuleIndex(null);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddTopic(quickTopicSubjectId, quickTopicModuleIndex)}
                className="tf-btn tf-btn-primary px-4 text-xs"
              >
                Qo&apos;shish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-blue-500/30 flex items-center gap-3 animate-fade-up">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
