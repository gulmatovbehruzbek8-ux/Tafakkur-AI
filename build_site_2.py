import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip())

# 4. Programs Page (List + Filter mock)
write_file("frontend/src/app/programs/page.tsx", """
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import { programs } from '@/lib/data';

export default function ProgramsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <Header />
      <main className="flex-grow">
        <div className="bg-slate-900 text-white py-24 border-b-8 border-rose-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-serif font-bold uppercase tracking-widest mb-6">Akademik Dasturlar</h1>
            <p className="text-xl font-serif italic text-slate-300 max-w-3xl">Kelajak mutaxassislarini tayyorlovchi zamonaviy o'quv yo'nalishlari.</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10 flex flex-wrap gap-4 border-b border-slate-300 pb-6">
             <select className="bg-white border border-slate-300 px-4 py-2 text-sm font-sans font-bold uppercase tracking-wider text-slate-700 outline-none">
               <option>Barcha darajalar</option>
               <option>Bakalavr</option>
               <option>Magistratura</option>
             </select>
             <select className="bg-white border border-slate-300 px-4 py-2 text-sm font-sans font-bold uppercase tracking-wider text-slate-700 outline-none">
               <option>Barcha maktablar</option>
               <option>Muhandislik</option>
               <option>Biznes</option>
               <option>Huquq</option>
             </select>
          </div>
          <div className="space-y-6">
            {programs.map(p => (
              <Link key={p.slug} href={`/programs/${p.slug}`} className="block bg-white border border-slate-200 p-8 hover:shadow-lg transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-300 group-hover:bg-rose-900 transition-colors"></div>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pl-4">
                  <div>
                    <span className="text-xs font-bold text-rose-900 uppercase tracking-widest mb-2 block">{p.degree} | {p.department}</span>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-rose-900 transition-colors">{p.title}</h2>
                  </div>
                  <div className="text-slate-500 font-sans text-sm max-w-md">
                    {p.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
""")

# 5. Program Detail Page
write_file("frontend/src/app/programs/[slug]/page.tsx", """
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { programs } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProgramDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const program = programs.find(p => p.slug === resolvedParams.slug);
  if (!program) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <Header />
      <main className="flex-grow">
        <div className="bg-slate-100 py-16 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/programs" className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-rose-900 mb-6 block">← Dasturlarga qaytish</Link>
            <span className="text-sm font-bold text-rose-900 uppercase tracking-widest mb-4 block">{program.degree} • {program.department}</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 uppercase tracking-widest mb-6">{program.title}</h1>
            <a href="#apply" className="inline-block px-6 py-3 bg-rose-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-slate-900 transition-colors mt-4">Hujjat Topshirish</a>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-slate prose-lg font-sans">
          <p className="lead text-xl text-slate-700 italic font-serif border-l-4 border-rose-900 pl-6">{program.desc}</p>
          <h2 className="font-serif uppercase tracking-widest text-slate-900 mt-12">Dastur haqida</h2>
          <p>Ushbu dastur talabalarni jahon andozalari darajasidagi bilimlarga ega bo'lishlari uchun maxsus ishlab chiqilgan. Talabalar nafaqat nazariy bilimlarni, balki amaliy laboratoriyalarda o'z ko'nikmalarini sinab ko'rish imkoniyatiga ega bo'ladilar.</p>
          <h3 className="font-serif uppercase tracking-widest text-slate-900 mt-10">O'quv rejasi</h3>
          <ul>
            <li>Asosiy fanlar (Core Curriculum)</li>
            <li>Mutaxassislik fanlari (Electives)</li>
            <li>Tadqiqot va amaliyot (Research & Internship)</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
""")

# 6. People Directory
write_file("frontend/src/app/people/page.tsx", """
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import { people } from '@/lib/data';

export default function PeoplePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <Header />
      <main className="flex-grow">
        <div className="bg-slate-900 text-white py-24 border-b-8 border-rose-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-serif font-bold uppercase tracking-widest mb-6">Xodimlar va Professorlar</h1>
            <p className="text-xl font-serif italic text-slate-300 max-w-3xl">Universitetimizning asosiy kuchi - bu bizning fidoyi va bilimli jamoamizdir.</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {people.map(p => (
              <Link key={p.slug} href={`/people/${p.slug}`} className="block border border-slate-200 bg-white group hover:shadow-lg transition-all">
                <div className="aspect-square bg-slate-200 flex items-center justify-center text-slate-400 font-serif italic border-b border-slate-200">[Surat: {p.name}]</div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-rose-900 transition-colors mb-1">{p.name}</h3>
                  <p className="text-xs font-bold text-rose-900 uppercase tracking-widest mb-4">{p.role}</p>
                  <p className="text-sm text-slate-500 font-sans border-t border-slate-100 pt-4">{p.department}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
""")

# 7. People Detail Page
write_file("frontend/src/app/people/[slug]/page.tsx", """
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { people } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function PersonDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const person = people.find(p => p.slug === resolvedParams.slug);
  if (!person) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <Header />
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/people" className="text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-rose-900 mb-8 block">← Xodimlar ro'yxati</Link>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-1/3 aspect-square bg-slate-200 flex items-center justify-center border border-slate-300 text-slate-400 font-serif italic">
              [Surat: {person.name}]
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">{person.name}</h1>
              <p className="text-lg font-serif italic text-rose-900 mb-6">{person.role}</p>
              
              <div className="bg-white border border-slate-200 p-6 mb-8">
                <p className="text-sm font-sans mb-2"><strong>Fakultet:</strong> {person.department}</p>
                <p className="text-sm font-sans mb-2"><strong>Email:</strong> <a href={`mailto:${person.email}`} className="text-rose-900 hover:underline">{person.email}</a></p>
              </div>
              
              <div className="prose prose-slate prose-lg font-sans">
                <h3 className="font-serif uppercase tracking-widest text-slate-900 text-xl border-b border-slate-300 pb-2 mb-4">Biografiya</h3>
                <p>{person.bio}</p>
                <p>Uzoq yillik tajribasi davomida ko'plab ilmiy maqolalar chop etgan va xalqaro konferensiyalarda ishtirok etgan.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
""")
