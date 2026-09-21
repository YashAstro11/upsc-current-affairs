"use client";

import { Menu, Sparkles } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { Flame } from "lucide-react";

interface MobileHeaderProps {
  onOpenDrawer: () => void;
}

export function MobileHeader({ onOpenDrawer }: MobileHeaderProps) {
  const { progress } = useProgress();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--color-card)]/80 backdrop-blur-md border-b border-[var(--color-lavender-soft)] z-50 flex items-center justify-between px-4">
      <div className="flex items-center gap-2 text-[var(--color-plum)]">
        <Sparkles size={20} className="text-pink-400" />
        <span className="font-bold tracking-wide">UPSC 2027</span>
      </div>

      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm ${
          progress.streak > 0 
            ? "bg-orange-100 border-orange-200" 
            : "bg-gray-100 border-gray-200"
        }`}>
          <Flame size={14} className={`${
            progress.streak > 0 
              ? "text-orange-500 fill-orange-500 animate-pulse" 
              : "text-gray-400 fill-gray-400"
          }`} />
          <span className={`text-[10px] font-bold ${
            progress.streak > 0 ? "text-orange-700" : "text-gray-500"
          }`}>{progress.streak} Day</span>
        </div>

        <button 
          onClick={onOpenDrawer}
          className="p-2 -mr-2 text-[var(--color-plum)] hover:bg-[var(--color-lavender-soft)] rounded-full transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
