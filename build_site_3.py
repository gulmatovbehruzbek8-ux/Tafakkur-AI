import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip())

# 8. News detail
write_file("frontend/src/app/news/[slug]/page.tsx", """
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { news } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function NewsDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const item = news.find(n => n.slug === resolvedParams.slug);
  if (!item) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/news" className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-rose-900 mb-8 block">← Barcha Yangiliklar</Link>
          <div className="text-xs font-bold text-rose-900 uppercase tracking-widest mb-4">{item.date}</div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">{item.title}</h1>
          
          <div className="w-full aspect-[21/9] bg-slate-200 mb-12 border border-slate-300 flex items-center justify-center text-slate-400 font-serif italic">
             [Yangilik Surati]
          </div>
          
          <div className="prose prose-slate prose-lg font-sans max-w-3xl mx-auto">
            <p className="lead text-xl text-slate-700 italic font-serif border-l-4 border-slate-300 pl-6 mb-8">{item.excerpt}</p>
            <p>{item.content}</p>
            <p>Batafsil ma'lumotlar keyinroq qo'shiladi. Jurnalistlar va OAV vakillari uchun maxsus press-relizlar mavjud.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
""")

# 9. Events Page
write_file("frontend/src/app/events/page.tsx", """
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { events } from '@/lib/data';

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <Header />
      <main className="flex-grow">
        <div className="bg-slate-900 text-white py-24 border-b-8 border-rose-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-serif font-bold uppercase tracking-widest mb-6">Tadbirlar Taqvim</h1>
            <p className="text-xl font-serif italic text-slate-300 max-w-3xl">Universitetdagi ilmiy, madaniy va ijtimoiy tadbirlardan xabardor bo'ling.</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-6">
            {events.map(e => (
              <div key={e.id} className="flex flex-col md:flex-row gap-8 bg-white border border-slate-200 p-8 hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center justify-center w-24 h-24 bg-rose-900 text-white flex-shrink-0">
                  <span className="text-sm font-bold uppercase">{new Date(e.date).toLocaleString('uz-UZ', { month: 'short' })}</span>
                  <span className="text-3xl font-serif font-bold">{new Date(e.date).getDate()}</span>
                </div>
                <div className="flex-grow">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">{e.type}</span>
                  <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">{e.title}</h3>
                  <p className="text-sm text-slate-600 font-sans flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {e.location}
                  </p>
                </div>
                <div className="flex items-center">
                  <button className="px-6 py-2 border-2 border-slate-900 text-slate-900 font-bold uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-colors">Ro'yxatdan o'tish</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
""")

# 10. Search Page
write_file("frontend/src/app/search/page.tsx", """
'use client';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl font-serif font-bold text-slate-900 uppercase tracking-widest mb-8">Qidiruv</h1>
          <form className="relative max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="Nimani qidiryapsiz?" 
              className="w-full px-6 py-5 text-lg font-sans border-2 border-slate-300 focus:border-rose-900 outline-none transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 px-8 bg-slate-900 text-white font-bold uppercase tracking-widest text-sm hover:bg-rose-900 transition-colors">
              Izlash
            </button>
          </form>
          {query && (
            <div className="mt-12 text-left">
              <p className="text-slate-500 font-sans mb-6">"{query}" bo'yicha qidiruv natijalari:</p>
              <div className="bg-white border border-slate-200 p-8 text-center text-slate-500 font-sans italic">
                Ayni paytda qidiruv tizimi sozlanmoqda...
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
""")

# 11. International Page
write_file("frontend/src/app/international/page.tsx", """
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function InternationalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <Header />
      <main className="flex-grow">
        <div className="bg-slate-900 text-white py-24 border-b-8 border-rose-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-serif font-bold uppercase tracking-widest mb-6">Xalqaro Aloqalar</h1>
            <p className="text-xl font-serif italic text-slate-300 max-w-3xl">Global miqyosdagi hamkorliklar va chet ellik talabalar uchun dasturlar.</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-slate prose-lg font-sans">
          <h2>Global Jamiyat</h2>
          <p>Tafakkur universiteti dunyoning 50 dan ortiq davlatlaridan kelgan talabalarga mezbonlik qiladi. Biz madaniyatlararo almashinuv va global nuqtai nazarni qo'llab-quvvatlaymiz.</p>
          
          <h3>Almashinuv Dasturlari (Exchange Programs)</h3>
          <p>Talabalarimiz Yevropa, Osiyo va Amerikaning nufuzli universitetlarida 1 yoki 2 semestr davomida o'qish imkoniyatiga ega. Erasmus+ va boshqa xalqaro fondlar bilan mustahkam hamkorlik o'rnatilgan.</p>
          
          <h3>Xalqaro Talabalar Qabuli</h3>
          <p>Chet el fuqarolari uchun qabul jarayoni osonlashtirilgan bo'lib, maxsus grantlar va stipendiyalar taklif etiladi. Barcha xalqaro talabalar kampusda yashash joyi bilan ta'minlanadi.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
""")

# 12. 404 Not Found
write_file("frontend/src/app/not-found.tsx", """
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 bg-rose-900 flex items-center justify-center mb-8">
        <span className="text-white font-serif font-bold text-3xl">T</span>
      </div>
      <h1 className="text-8xl font-serif font-bold text-slate-900 mb-4">404</h1>
      <h2 className="text-2xl font-serif uppercase tracking-widest text-slate-600 mb-8">Sahifa Topilmadi</h2>
      <p className="text-slate-500 font-sans max-w-md text-center mb-10">Siz izlayotgan sahifa o'chirilgan, nomi o'zgargan yoki vaqtincha mavjud emas.</p>
      <Link href="/" className="px-8 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-sm hover:bg-rose-900 transition-colors">
        Bosh Sahifaga Qaytish
      </Link>
    </div>
  );
}
""")

# 13. Error
write_file("frontend/src/app/error.tsx", """
'use client';
export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 bg-rose-900 flex items-center justify-center mb-8">
        <span className="text-white font-serif font-bold text-3xl">T</span>
      </div>
      <h1 className="text-4xl font-serif font-bold text-slate-900 uppercase tracking-widest mb-6">Tizimda Xatolik</h1>
      <p className="text-slate-500 font-sans max-w-md text-center mb-10">Texnik muammo yuzaga keldi. Iltimos, qayta urinib ko'ring.</p>
      <button onClick={() => reset()} className="px-8 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-sm hover:bg-rose-900 transition-colors">
        Qayta yuklash
      </button>
    </div>
  );
}
""")
