import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "سوقنا | Souqna - منصة التجارة الإلكترونية الشاملة",
  description: "تسوق أفضل العروض والمنتجات بأسعار منافسة وتوصيل سريع لكافة المحافظات السورية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="font-sans min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
