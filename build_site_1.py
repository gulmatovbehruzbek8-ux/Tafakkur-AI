import os
import json

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip())

# 1. Data Mock
write_file("frontend/src/lib/data.ts", """
export interface Program { slug: string; title: string; degree: string; department: string; desc: string; }
export interface Person { slug: string; name: string; role: string; department: string; bio: string; email: string; }
export interface NewsItem { slug: string; title: string; date: string; excerpt: string; content: string; }
export interface EventItem { id: string; title: string; date: string; location: string; type: string; }

export const programs: Program[] = [
  { slug: 'cs-bsc', title: 'Kompyuter Ilmlari', degree: 'Bakalavr', department: 'Muhandislik va Amaliy Fanlar', desc: 'Algoritmlar, sun\\'iy intellekt va dasturiy injiniring bo\\'yicha fundamental bilimlar.' },
  { slug: 'business-mba', title: 'Biznes Boshqaruvi (MBA)', degree: 'Magistratura', department: 'Biznes Maktabi', desc: 'Global iqtisodiyotda yetakchilar tayyorlash uchun mo\\'ljallangan intensiv dastur.' },
  { slug: 'law-llb', title: 'Huquqshunoslik', degree: 'Bakalavr', department: 'Huquqshunoslik Maktabi', desc: 'Xalqaro va milliy huquq normalarini chuqur o\\'rganish.' },
  { slug: 'medicine-md', title: 'Umumiy Tibbiyot', degree: 'Doktorantura', department: 'Tibbiyot Maktabi', desc: 'Zamonaviy klinik amaliyot va biotibbiyot tadqiqotlari.' },
];

export const people: Person[] = [
  { slug: 'ali-valiyev', name: 'Dr. Ali Valiyev', role: 'Professor', department: 'Muhandislik va Amaliy Fanlar', bio: 'Sun\\'iy intellekt va mashinali o\\'rganish bo\\'yicha yetakchi tadqiqotchi.', email: 'a.valiyev@tafakkur.uz' },
  { slug: 'nodira-karimova', name: 'Prof. Nodira Karimova', role: 'Dekan', department: 'Biznes Maktabi', bio: 'Xalqaro iqtisodiyot va strategik menejment bo\\'yicha 20 yillik tajribaga ega.', email: 'n.karimova@tafakkur.uz' },
];

export const news: NewsItem[] = [
  { slug: 'new-ai-lab', title: 'Yangi Sun\\'iy Intellekt Laboratoriyasi Ochildi', date: '2026-09-15', excerpt: 'Tafakkur universiteti zamonaviy AI laboratoriyasini talabalar ixtiyoriga topshirdi.', content: 'Universitet o\\'zining yangi tadqiqot markazini ochish marosimini o\\'tkazdi...' },
  { slug: 'global-ranking', title: 'Universitetimiz Xalqaro Reytingda Kuchli 100 talikka Kirdi', date: '2026-09-10', excerpt: 'Ta\\'lim sifati va tadqiqotlar natijasida universitet nufuzi oshdi.', content: 'QS World University Rankings ma\\'lumotlariga ko\\'ra...' },
];

export const events: EventItem[] = [
  { id: '1', title: 'Kuzgi Ilmiy Simpozium', date: '2026-10-05', location: 'Asosiy Majlislar Zali', type: 'Konferensiya' },
  { id: '2', title: 'Ochiq Eshiklar Kuni', date: '2026-10-15', location: 'Markaziy Kampus', type: 'Qabul' },
];
""")

# 2. Advanced Header
write_file("frontend/src/app/components/Header.tsx", """
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <header className="bg-slate-900 border-b-[12px] border-rose-900 sticky top-0 z-50 shadow-sm">
      {/* Top Audience Nav */}
      <div className="hidden md:block bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end space-x-6 py-2 text-xs font-serif tracking-widest uppercase text-slate-300">
            <Link href="/login" className="hover:text-white transition-colors">Talabalar</Link>
            <Link href="/login" className="hover:text-white transition-colors">O'qituvchilar</Link>
            <Link href="/people" className="hover:text-white transition-colors">Xodimlar va Bitiruvchilar</Link>
          </div>
        </div>
      </div>
      
      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-rose-900 flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-serif font-bold text-xl">T</span>
            </div>
            <span className="text-white font-serif text-2xl font-bold tracking-widest uppercase">Tafakkur</span>
          </Link>
          
          <nav className="hidden lg:flex space-x-8 items-center">
            {[
              { path: '/about', label: 'Universitet' },
              { path: '/programs', label: 'Dasturlar' },
              { path: '/admissions', label: 'Qabul' },
              { path: '/research', label: 'Tadqiqot' },
              { path: '/campus', label: 'Kampus' },
              { path: '/international', label: 'Xalqaro' },
              { path: '/news', label: 'Yangiliklar' }
            ].map(item => (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`font-serif uppercase tracking-widest text-xs transition-colors py-2 border-b-2 ${isActive(item.path) ? 'border-rose-500 text-white' : 'border-transparent text-slate-300 hover:text-white hover:border-slate-500'}`}
              >
                {item.label}
              </Link>
            ))}
            
            <Link href="/search" className="text-slate-300 hover:text-white ml-4" aria-label="Qidiruv">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </Link>
          </nav>

          <div className="lg:hidden flex items-center">
             <Link href="/search" className="text-slate-300 hover:text-white mr-4" aria-label="Qidiruv">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link href="/about" className="block px-3 py-3 text-white font-serif uppercase tracking-widest text-sm border-b border-slate-700">Universitet Haqida</Link>
            <Link href="/programs" className="block px-3 py-3 text-white font-serif uppercase tracking-widest text-sm border-b border-slate-700">Akademik Dasturlar</Link>
            <Link href="/admissions" className="block px-3 py-3 text-white font-serif uppercase tracking-widest text-sm border-b border-slate-700">Qabul Jarayoni</Link>
            <Link href="/research" className="block px-3 py-3 text-white font-serif uppercase tracking-widest text-sm border-b border-slate-700">Tadqiqotlar</Link>
            <Link href="/campus" className="block px-3 py-3 text-white font-serif uppercase tracking-widest text-sm border-b border-slate-700">Kampus Hayoti</Link>
            <Link href="/international" className="block px-3 py-3 text-white font-serif uppercase tracking-widest text-sm border-b border-slate-700">Xalqaro</Link>
            <div className="pt-4 flex flex-col gap-2">
               <Link href="/login" className="block text-center px-6 py-3 bg-rose-900 text-white font-bold uppercase tracking-widest text-xs">Tizimga Kirish</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
""")

# 3. Advanced Homepage
write_file("frontend/src/app/page.tsx", """
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { news, events } from '@/lib/data';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans selection:bg-rose-100 flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Editorial Hero */}
        <section className="relative h-[85vh] bg-slate-900 flex items-center justify-center overflow-hidden border-b-8 border-rose-900">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-10"></div>
          {/* Abstract background representing research/university */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDIwaDQwTTAgMTBoNDBNMCAzMGg0ME0yMCAwdjQwTTEwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] z-0"></div>
          
          <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-tight tracking-tight">
              Haqiqatni Izlab, <br/><span className="text-rose-400 italic">Dunyoni O'zgartirib.</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 font-serif max-w-3xl mx-auto mb-12">
              Tafakkur universiteti — fundamental fanlar, ilg'or tadqiqotlar va sun'iy intellekt yechimlarini birlashtirgan yetakchi akademik markaz.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/admissions" className="px-8 py-4 bg-rose-900 text-white font-bold tracking-widest uppercase hover:bg-rose-800 transition-colors text-sm">
                Hujjat Topshirish
              </Link>
              <Link href="/programs" className="px-8 py-4 bg-transparent text-white border-2 border-white font-bold tracking-widest uppercase hover:bg-white hover:text-slate-900 transition-colors text-sm">
                Dasturlarni O'rganish
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Links / Audiences */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { title: 'Bo\\'lajak Talabalar', link: '/admissions', desc: 'Bakalavriat va magistratura qabuli' },
                { title: 'Joriy Talabalar', link: '/login', desc: 'Akademik portal va resurslar' },
                { title: 'Professor-o\\'qituvchilar', link: '/login', desc: 'Tadqiqot va o\\'qitish vositalari' },
                { title: 'Bitiruvchilar', link: '/people', desc: 'Alumni tarmog\\'i va tadbirlar' }
              ].map(item => (
                <Link key={item.title} href={item.link} className="group block border-l-4 border-slate-200 hover:border-rose-900 pl-4 transition-all">
                  <h3 className="text-lg font-serif font-bold text-slate-900 uppercase tracking-widest mb-2 group-hover:text-rose-900 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-600 font-sans">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-[#FDFBF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div>
                <div className="text-5xl font-serif font-bold text-rose-900 mb-2">1636</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tashkil etilgan yil (An'ana)</div>
              </div>
              <div>
                <div className="text-5xl font-serif font-bold text-slate-900 mb-2">15:1</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Talaba va O'qituvchi nisbati</div>
              </div>
              <div>
                <div className="text-5xl font-serif font-bold text-rose-900 mb-2">45+</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tadqiqot markazlari</div>
              </div>
              <div>
                <div className="text-5xl font-serif font-bold text-slate-900 mb-2">120</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Xalqaro hamkorliklar</div>
              </div>
            </div>
          </div>
        </section>

        {/* News & Events Grid */}
        <section className="py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12 border-b-2 border-slate-900 pb-4">
              <h2 className="text-3xl font-serif font-bold text-slate-900 uppercase tracking-widest">Yangiliklar va Tadbirlar</h2>
              <Link href="/news" className="text-rose-900 font-bold uppercase tracking-widest text-xs hover:text-slate-900 transition-colors">Barchasini ko'rish →</Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                {news.map(n => (
                  <Link key={n.slug} href={`/news/${n.slug}`} className="group block">
                    <div className="aspect-[4/3] bg-slate-100 mb-4 border border-slate-200 overflow-hidden">
                       <div className="w-full h-full bg-slate-200 group-hover:scale-105 transition-transform duration-500"></div>
                    </div>
                    <div className="text-xs text-rose-900 font-bold tracking-widest uppercase mb-2">{n.date}</div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 group-hover:text-rose-900 transition-colors leading-tight">{n.title}</h3>
                    <p className="text-slate-600 font-sans text-sm">{n.excerpt}</p>
                  </Link>
                ))}
              </div>
              
              <div className="bg-slate-50 p-8 border border-slate-200">
                <h3 className="text-xl font-serif font-bold text-slate-900 uppercase tracking-widest mb-8 border-b border-slate-300 pb-2">Kelgusi Tadbirlar</h3>
                <div className="space-y-6">
                  {events.map(e => (
                    <div key={e.id} className="border-b border-slate-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-rose-900 text-white flex-shrink-0">
                          <span className="text-xs font-bold uppercase">{new Date(e.date).toLocaleString('uz-UZ', { month: 'short' })}</span>
                          <span className="text-xl font-serif font-bold">{new Date(e.date).getDate()}</span>
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-slate-900 leading-tight mb-1"><Link href={`/events/${e.id}`} className="hover:text-rose-900">{e.title}</Link></h4>
                          <p className="text-xs text-slate-500 uppercase tracking-wider">{e.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/events" className="inline-block mt-8 text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-900 pb-1 hover:text-rose-900 hover:border-rose-900 transition-all">To'liq taqvim</Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
""")
