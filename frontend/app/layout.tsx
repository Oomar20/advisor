import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "المستشار",
  description: "واجهة حجز جلسة مستشار مبنية من تصميم Figma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
