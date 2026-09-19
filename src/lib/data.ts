export interface Program { slug: string; title: string; degree: string; department: string; desc: string; }
export interface Person { slug: string; name: string; role: string; department: string; bio: string; email: string; }
export interface NewsItem { slug: string; title: string; date: string; excerpt: string; content: string; }
export interface EventItem { id: string; title: string; date: string; location: string; type: string; }

export const programs: Program[] = [
  { slug: 'cs-bsc', title: 'Kompyuter Ilmlari', degree: 'Bakalavr', department: 'Muhandislik va Amaliy Fanlar', desc: 'Algoritmlar, sun\'iy intellekt va dasturiy injiniring bo\'yicha fundamental bilimlar.' },
  { slug: 'business-mba', title: 'Biznes Boshqaruvi (MBA)', degree: 'Magistratura', department: 'Biznes Maktabi', desc: 'Global iqtisodiyotda yetakchilar tayyorlash uchun mo\'ljallangan intensiv dastur.' },
  { slug: 'law-llb', title: 'Huquqshunoslik', degree: 'Bakalavr', department: 'Huquqshunoslik Maktabi', desc: 'Xalqaro va milliy huquq normalarini chuqur o\'rganish.' },
  { slug: 'medicine-md', title: 'Umumiy Tibbiyot', degree: 'Doktorantura', department: 'Tibbiyot Maktabi', desc: 'Zamonaviy klinik amaliyot va biotibbiyot tadqiqotlari.' },
];

export const people: Person[] = [
  { slug: 'ali-valiyev', name: 'Dr. Ali Valiyev', role: 'Professor', department: 'Muhandislik va Amaliy Fanlar', bio: 'Sun\'iy intellekt va mashinali o\'rganish bo\'yicha yetakchi tadqiqotchi.', email: 'a.valiyev@tafakkur.uz' },
  { slug: 'nodira-karimova', name: 'Prof. Nodira Karimova', role: 'Dekan', department: 'Biznes Maktabi', bio: 'Xalqaro iqtisodiyot va strategik menejment bo\'yicha 20 yillik tajribaga ega.', email: 'n.karimova@tafakkur.uz' },
];

export const news: NewsItem[] = [
  { slug: 'new-ai-lab', title: 'Yangi Sun\'iy Intellekt Laboratoriyasi Ochildi', date: '2026-09-15', excerpt: 'Tafakkur universiteti zamonaviy AI laboratoriyasini talabalar ixtiyoriga topshirdi.', content: 'Universitet o\'zining yangi tadqiqot markazini ochish marosimini o\'tkazdi...' },
  { slug: 'global-ranking', title: 'Universitetimiz Xalqaro Reytingda Kuchli 100 talikka Kirdi', date: '2026-09-10', excerpt: 'Ta\'lim sifati va tadqiqotlar natijasida universitet nufuzi oshdi.', content: 'QS World University Rankings ma\'lumotlariga ko\'ra...' },
];

export const events: EventItem[] = [
  { id: '1', title: 'Kuzgi Ilmiy Simpozium', date: '2026-10-05', location: 'Asosiy Majlislar Zali', type: 'Konferensiya' },
  { id: '2', title: 'Ochiq Eshiklar Kuni', date: '2026-10-15', location: 'Markaziy Kampus', type: 'Qabul' },
];