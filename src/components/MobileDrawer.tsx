"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, CheckSquare, Bookmark, Sparkles, Globe, Flame, User, LogOut, Calculator, X } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { progress } = useProgress();
  const { user, signOut } = useAuth();

  const navGroups = [
    {
      label: "MAIN",
      items: [
        { name: "Home", href: "/", icon: Home },
        { name: "Profile", href: "/profile", icon: User },
      ]
    },
    {
      label: "PREPARATION",
      items: [
        { name: "Syllabus", href: "/syllabus", icon: BookOpen },
        { name: "Tests", href: "/tests", icon: CheckSquare },
        { name: "Practice", href: "/practice", icon: Brain },
        { name: "CSAT", href: "/csat", icon: Calculator },
      ]
    },
    {
      label: "RESOURCES",
      items: [
        { name: "Current Affairs", href: "/current-affairs", icon: Globe },
        { name: "Saved", href: "/saved", icon: Bookmark },
        { name: "Sources", href: "/sources", icon: Globe },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-[var(--color-card)]/95 backdrop-blur-xl border-r border-[var(--color-lavender-soft)] z-[70] flex flex-col p-6 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 text-[var(--color-plum)]">
              <div className="flex items-center gap-2">
                <Sparkles size={24} className="text-pink-400" />
                <span className="font-semibold text-lg tracking-wide">UPSC 2027</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--color-lavender-soft)] transition-colors text-[var(--color-plum)]"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6 pb-20">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <h4 className="text-[10px] font-bold text-[var(--color-plum-light)] uppercase tracking-wider mb-2 px-2">
                    {group.label}
                  </h4>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                            isActive
                              ? "bg-[var(--color-lavender-soft)] text-[var(--color-plum)] font-medium shadow-sm"
                              : "text-[var(--color-plum-light)] hover:bg-[var(--color-blush-soft)] hover:text-[var(--color-plum)]"
                          }`}
                        >
                          <Icon size={18} className={isActive ? "fill-current opacity-20" : ""} />
                          <span className="text-sm">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-[var(--color-lavender-soft)] bg-[var(--color-card)] relative z-10">
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
                  <button 
                    onClick={() => { signOut(); onClose(); }} 
                    className="text-[var(--color-plum-light)] hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-center text-[var(--color-plum-light)]">
                  Little progress every day ♡
                </p>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
