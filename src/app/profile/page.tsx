"use client";

import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { useBookmarks } from "@/hooks/useBookmarks";
import { AnalyticsHeatmap } from "@/components/AnalyticsHeatmap";
import { ShareableCard } from "@/components/ShareableCard";
import { config } from "@/constants/config";
import { Flame, Clock, BookOpen, Brain, CheckSquare, LogOut, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { progress, getEstimatedStudyTime } = useProgress();
  const { bookmarks } = useBookmarks();

  // User is always signed in (AuthGate handles the gate)
  const displayName = user?.displayName || config.studentName;
  const photoURL = user?.photoURL;
  const email = user?.email;

  const trackedMinutes = Math.ceil((progress.trackedStudySeconds || 0) / 60);
  const studyTimeDisplay = trackedMinutes > 0 ? trackedMinutes : getEstimatedStudyTime();

  const formatTime = (minutes: number) => {
    if (minutes <= 0) return "0m";
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const caCount = Math.min(progress.caRead.length, 10);
  const mcqCount = Math.min(progress.mcqsDone.length, 10);
  const revCount = Math.min(progress.revisionDone.length, 10);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      {/* Profile Header */}
      <div className="bg-[var(--color-card)]/80 backdrop-blur-md rounded-3xl p-6 border border-[var(--color-lavender-soft)] shadow-sm relative overflow-hidden">
        <div className="absolute -top-4 -right-2 text-4xl opacity-80 transform rotate-12 drop-shadow-md">🎀</div>
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles size={100} />
        </div>

        <div className="flex items-center gap-4">
          {photoURL ? (
            <img 
              src={photoURL} 
              alt={displayName} 
              className="w-16 h-16 rounded-full border-3 border-pink-300 shadow-md"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {displayName.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-serif font-bold text-[var(--color-plum)]">{displayName}</h1>
            {email && <p className="text-xs text-[var(--color-plum-light)]">{email}</p>}
            <p className="text-[10px] text-pink-400 font-bold tracking-widest uppercase mt-1">UPSC Aspirant 2027</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--color-card)]/80 rounded-2xl p-4 border border-[var(--color-lavender-soft)] text-center">
          <div className={`mx-auto mb-2 w-10 h-10 rounded-full flex items-center justify-center ${
            progress.streak > 0 ? "bg-orange-100" : "bg-gray-100"
          }`}>
            <Flame size={20} className={progress.streak > 0 ? "text-orange-500 fill-orange-500" : "text-gray-400"} />
          </div>
          <p className="text-lg font-bold text-[var(--color-plum)]">{progress.streak}</p>
          <p className="text-[10px] text-[var(--color-plum-light)] font-medium">Day Streak</p>
        </div>

        <div className="bg-[var(--color-card)]/80 rounded-2xl p-4 border border-[var(--color-lavender-soft)] text-center">
          <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
            <Clock size={20} className="text-pink-500" />
          </div>
          <p className="text-lg font-bold text-[var(--color-plum)]">{formatTime(studyTimeDisplay)}</p>
          <p className="text-[10px] text-[var(--color-plum-light)] font-medium">Study Time</p>
        </div>

        <div className="bg-[var(--color-card)]/80 rounded-2xl p-4 border border-[var(--color-lavender-soft)] text-center">
          <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <BookOpen size={20} className="text-purple-500" />
          </div>
          <p className="text-lg font-bold text-[var(--color-plum)]">{bookmarks.length}</p>
          <p className="text-[10px] text-[var(--color-plum-light)] font-medium">Bookmarks</p>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-[var(--color-card)]/80 backdrop-blur-sm rounded-3xl p-6 border border-[var(--color-lavender-soft)] shadow-sm">
        <h2 className="text-sm font-bold tracking-widest uppercase text-pink-400 mb-4 text-center">
          Today's Progress
        </h2>
        <div className="space-y-4">
          <ProgressBar icon={BookOpen} label="News Read" current={caCount} total={10} color="bg-emerald-400" />
          <ProgressBar icon={Brain} label="MCQs Solved" current={mcqCount} total={10} color="bg-amber-400" />
          <ProgressBar icon={CheckSquare} label="Flashcards" current={revCount} total={10} color="bg-pink-400" />
        </div>
      </div>

      {/* MCQ Analytics */}
      <AnalyticsHeatmap stats={progress.mcqStats} />

      {/* Shareable Card */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-plum)] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-pink-400 rounded-full inline-block"></span>
          Share Your Journey
        </h2>
        <ShareableCard 
          progress={progress} 
          estimatedStudyTime={getEstimatedStudyTime()} 
          userName={displayName} 
        />
      </section>

      {/* Sign Out */}
      <button
        onClick={signOut}
        className="w-full flex items-center justify-center gap-2 bg-[var(--color-card)] border border-red-200 text-red-400 font-medium py-3.5 rounded-2xl hover:bg-red-50 transition-all active:scale-[0.98]"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}

function ProgressBar({ icon: Icon, label, current, total, color }: { 
  icon: React.ElementType; 
  label: string; 
  current: number; 
  total: number; 
  color: string;
}) {
  const percentage = Math.min((current / total) * 100, 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-[var(--color-plum)] flex items-center gap-2">
          <Icon size={14} className="text-[var(--color-plum-light)]" />
          {label}
        </span>
        <span className="text-xs font-bold text-[var(--color-plum-light)]">{current}/{total}</span>
      </div>
      <div className="h-2.5 w-full bg-[var(--color-blush-soft)] rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
