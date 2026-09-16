"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, CheckSquare, Bookmark } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "CA", href: "/current-affairs", icon: BookOpen },
    { name: "Practice", href: "/practice", icon: Brain },
    { name: "Revision", href: "/revision", icon: CheckSquare },
    { name: "Saved", href: "/saved", icon: Bookmark },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[var(--color-lavender-soft)] pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-[var(--color-plum)] font-medium" : "text-[var(--color-plum-light)]"
              }`}
            >
              <Icon size={20} className={isActive ? "fill-[var(--color-lavender-soft)]" : ""} />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
