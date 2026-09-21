"use client";

import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { AuthGate } from "@/components/AuthGate";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileDrawer } from "@/components/MobileDrawer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <AuthGate>
      <div className="flex flex-col md:flex-row min-h-screen">
        <MobileHeader onOpenDrawer={() => setIsDrawerOpen(true)} />
        <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        <DesktopSidebar />
        
        <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 relative max-w-5xl mx-auto w-full">
          <div className="p-4 md:p-8 w-full max-w-4xl mx-auto">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </AuthGate>
  );
}
