import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interaction Playground",
  description: "Design to Developer Handoff Playground",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
      </head>
      <body className="antialiased bg-[#f0f2f5] flex min-h-screen font-sans">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
