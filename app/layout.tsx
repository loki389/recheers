import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "酒别重逢 - 自调酒灵感与知识助手",
  description: "在家用简单材料与工具，找到你的第一杯自调。探索青年群体自调酒调研数据，了解中国自调酒发展历程。",
  openGraph: {
    title: "酒别重逢 - 自调酒灵感与知识助手",
    description: "在家用简单材料与工具，找到你的第一杯自调。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} font-sans scroll-smooth`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

