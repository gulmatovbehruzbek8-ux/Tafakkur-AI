import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tafakkur AI | Mahalliy AI Ta'lim Platformasi",
  description:
    "Universitetlar uchun maxfiylikni saqlovchi, mahalliy ishlaydigan sun'iy intellekt platformasi — tutor, avto-baholovchi va e'lonlar generatori.",
  keywords: ["Tafakkur AI", "ta'lim", "universitet", "Ollama", "O'zbekiston", "AI"],
  icons: {
    icon: "/Logo.png",
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
};

import CommandPalette from "@/app/components/CommandPalette";
import ThemeAndUIModeProvider from "@/app/components/ThemeAndUIModeProvider";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-ink">
        <ThemeAndUIModeProvider>
          <CommandPalette />
          {children}
        </ThemeAndUIModeProvider>
      </body>
    </html>
  );
}
