"use client";

import { useAuth } from "@/context/AuthContext";
import { Sparkles, Loader2 } from "lucide-react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <Sparkles className="text-pink-400 animate-spin" size={32} />
          <p className="text-[var(--color-plum-light)] text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-6">
        <div className="max-w-sm w-full text-center space-y-8 animate-in fade-in duration-700">
          {/* Logo & Branding */}
          <div className="space-y-3">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center mx-auto shadow-lg shadow-pink-200/50">
                <Sparkles size={40} className="text-white" />
              </div>
              <span className="absolute -top-2 -right-2 text-3xl">🎀</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-[var(--color-plum)]">UPSC 2027</h1>
            <p className="text-sm text-[var(--color-plum-light)] italic">Little progress every day ♡</p>
          </div>

          {/* Features preview */}
          <div className="bg-[var(--color-card)]/80 backdrop-blur-md rounded-3xl p-5 border border-[var(--color-lavender-soft)] space-y-3 text-left">
            <p className="text-xs font-bold text-pink-400 uppercase tracking-widest text-center mb-3">What awaits you</p>
            <div className="flex items-center gap-3 text-sm text-[var(--color-plum)]">
              <span className="text-base">📰</span>
              <span className="font-medium">Daily Current Affairs</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--color-plum)]">
              <span className="text-base">🧠</span>
              <span className="font-medium">MCQ Practice with Analytics</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--color-plum)]">
              <span className="text-base">🃏</span>
              <span className="font-medium">Flashcard Revision</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--color-plum)]">
              <span className="text-base">⏳</span>
              <span className="font-medium">Focus Timer & Streak Tracking</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--color-plum)]">
              <span className="text-base">✨</span>
              <span className="font-medium">Shareable Progress Cards</span>
            </div>
          </div>

          {/* Sign in button */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-[var(--color-card)] border-2 border-[var(--color-lavender)] px-6 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-bold text-[var(--color-plum)] group-hover:text-pink-500 transition-colors">Sign in with Google</span>
          </button>

          <p className="text-[10px] text-[var(--color-plum-light)]">Made with ♡ for your UPSC journey</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
