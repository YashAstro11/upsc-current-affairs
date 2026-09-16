"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, CheckSquare, Bookmark, Sparkles, Globe, Flame } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";

export function DesktopSidebar() {
  const pathname = usePathname();
  const { progress } = useProgress();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Current Affairs", href: "/current-affairs", icon: BookOpen },
    { name: "Practice", href: "/practice", icon: Brain },
    { name: "Revision", href: "/revision", icon: CheckSquare },
    { name: "Saved", href: "/saved", icon: Bookmark },
    { name: "Sources", href: "/sources", icon: Globe },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-[var(--color-lavender-soft)] bg-[var(--color-card)]/50 backdrop-blur-xl p-6">
        <div className="flex items-center justify-between mb-10 text-[var(--color-plum)]">
        <div className="flex items-center gap-2">
          <Sparkles size={24} className="text-pink-400" />
          <span className="font-semibold text-lg tracking-wide">UPSC 2027</span>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm animate-in fade-in zoom-in duration-500 ${
          progress.streak > 0 
            ? "bg-orange-100 border-orange-200" 
            : "bg-gray-100 border-gray-200"
        }`}>
          <Flame size={16} className={`${
            progress.streak > 0 
              ? "text-orange-500 fill-orange-500 animate-pulse" 
              : "text-gray-400 fill-gray-400"
          }`} />
          <span className={`text-xs font-bold ${
            progress.streak > 0 ? "text-orange-700" : "text-gray-500"
          }`}>{progress.streak} Day</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[var(--color-lavender-soft)] text-[var(--color-plum)] font-medium shadow-sm"
                  : "text-[var(--color-plum-light)] hover:bg-[var(--color-blush-soft)] hover:text-[var(--color-plum)]"
              }`}
            >
              <Icon size={20} className={isActive ? "fill-current opacity-20" : ""} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-[var(--color-lavender-soft)]">
        <p className="text-xs text-center text-[var(--color-plum-light)]">
          Little progress every day ♡
        </p>
      </div>
    </aside>
  );
}
