import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";

const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "UPSC 2027 | Little progress every day ♡",
  description: "A simple, beautiful, mobile-first UPSC Current Affairs website.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} font-sans antialiased bg-[var(--background)] min-h-screen text-[var(--foreground)]`}>
        <div className="flex flex-col md:flex-row min-h-screen">
          <DesktopSidebar />
          <main className="flex-1 md:ml-64 pb-20 md:pb-0 relative max-w-5xl mx-auto w-full">
            <div className="p-4 md:p-8 w-full max-w-4xl mx-auto">
              {children}
            </div>
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
