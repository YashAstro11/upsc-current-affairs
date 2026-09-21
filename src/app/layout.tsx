import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { TimerProvider } from "@/context/TimerContext";
import { TestProvider } from "@/context/TestContext";
import { SyllabusProvider } from "@/context/SyllabusContext";
import { CsatProvider } from "@/context/CsatContext";
import { AppShell } from "@/components/AppShell";

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
        <AuthProvider>
          <ProgressProvider>
            <TimerProvider>
              <TestProvider>
                <SyllabusProvider>
                  <CsatProvider>
                    <AppShell>
                      {children}
                    </AppShell>
                  </CsatProvider>
                </SyllabusProvider>
              </TestProvider>
            </TimerProvider>
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
