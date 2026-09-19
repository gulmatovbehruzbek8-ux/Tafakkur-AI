import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CommandPalette from "@/app/components/CommandPalette";
import ThemeAndUIModeProvider from "@/app/components/ThemeAndUIModeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uz"
      className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('tafakkur_theme');if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');}var u=localStorage.getItem('tafakkur_ui_mode');if(u==='simple'){document.documentElement.classList.add('tf-simple-mode');document.documentElement.setAttribute('data-ui-mode','simple');}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeAndUIModeProvider>
          <CommandPalette />
          {children}
        </ThemeAndUIModeProvider>
      </body>
    </html>
  );
}
