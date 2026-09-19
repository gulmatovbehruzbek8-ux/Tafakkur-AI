import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: "algo",
      name: "Algoritmlar va Ma'lumotlar Tuzilmasi",
      curriculum: [
        {
          module: "1-Modul: Asosiy tushunchalar",
          topics: [
            { title: "Kirish va fan metodologiyasi", done: true },
            { title: "Algoritmlar nazariyasi va murakkablik", done: true }
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
      curriculum: [
        {
          module: "1-Modul: AI tarixi va rivojlanishi",
          topics: [
            { title: "Turing testi va intellekt tushunchasi", done: true },
            { title: "Mashinali o'rganishga kirish", current: true, task: "Kichik klassifikator qurish amaliyoti" }
          ]
        },
        {
          module: "2-Modul: Neyron Tarmoqlar",
          topics: [
            { title: "Sun'iy neyron va faollashtirish funksiyalari", done: false },
            { title: "Ko'p qatlamli perseptron (MLP)", done: false }
          ]
        }
      ]
    }
  ]);
}
