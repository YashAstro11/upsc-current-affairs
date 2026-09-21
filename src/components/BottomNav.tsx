"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, CheckSquare, Bookmark, User, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Syllabus", href: "/syllabus", icon: BookOpen },
    { name: "Tests", href: "/tests", icon: CheckSquare },
    { name: "CA", href: "/current-affairs", icon: Globe },
    { name: "Saved", href: "/saved", icon: Bookmark },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-card)]/80 backdrop-blur-md border-t border-[var(--color-lavender-soft)] pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isProfile = item.name === "Profile";
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-[var(--color-plum)] font-medium" : "text-[var(--color-plum-light)]"
              }`}
            >
              {isProfile && user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className={`w-6 h-6 rounded-full ${isActive ? "ring-2 ring-pink-400" : ""}`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Icon size={20} className={isActive ? "fill-[var(--color-lavender-soft)]" : ""} />
              )}
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

