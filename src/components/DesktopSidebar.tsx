"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, CheckSquare, Bookmark, Sparkles, Globe, Flame, User, LogOut } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/context/AuthContext";

export function DesktopSidebar() {
  const pathname = usePathname();
  const { progress } = useProgress();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Syllabus", href: "/syllabus", icon: BookOpen },
    { name: "Tests", href: "/tests", icon: CheckSquare },
    { name: "Current Affairs", href: "/current-affairs", icon: Globe },
    { name: "Practice", href: "/practice", icon: Brain },
    { name: "Saved", href: "/saved", icon: Bookmark },
    { name: "Sources", href: "/sources", icon: Globe },
    { name: "Profile", href: "/profile", icon: User },
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
        {user ? (
          <div className="flex items-center gap-3 px-2">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || "User"} 
                className="w-8 h-8 rounded-full border border-pink-300"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 text-sm font-bold">
                {(user.displayName || "U").charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[var(--color-plum)] truncate">{user.displayName}</p>
              <p className="text-[10px] text-[var(--color-plum-light)] truncate">{user.email}</p>
            </div>
            <button onClick={signOut} className="text-[var(--color-plum-light)] hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <p className="text-xs text-center text-[var(--color-plum-light)]">
            Little progress every day ♡
          </p>
        )}
      </div>
    </aside>
  );
}

