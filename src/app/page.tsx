"use client";

import { useEffect, useState } from "react";
import { config } from "@/constants/config";
import { currentAffairsData as staticCa } from "@/data/currentAffairs";
import { mcqsData as staticMcqs } from "@/data/mcqs";
import { revisionData as staticRev } from "@/data/revision";
import { useProgress } from "@/hooks/useProgress";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { CurrentAffairCard } from "@/components/CurrentAffairCard";
import { McqPractice } from "@/components/McqPractice";
import { RevisionFact } from "@/components/RevisionFact";
import { AnalyticsHeatmap } from "@/components/AnalyticsHeatmap";
import { Sparkles, CheckCircle2, Circle, Loader2, ArrowRight, BookOpen, Brain, Flame, PartyPopper } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { progress, markCaRead, markMcqDone, recordMcqAttempt, markRevisionDone, isRevisionDone, justHitGoal } = useProgress();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { currentAffairs, mcqs, revisionFacts, loading } = useFirebaseData();
  
  const [daysLeft, setDaysLeft] = useState<number>(0);

  const motivationalQuotes = [
    "Consistency is what transforms average into excellence.",
    "LBSNAA is waiting for you. Keep going!",
    "One day, all these late nights and early mornings will pay off.",
    "Don't stop when you're tired. Stop when you're done.",
    "Every MCQ you solve takes you one step closer to your dream.",
  ];
  
  const [quote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  useEffect(() => {
    setMounted(true);
    const prelimsDate = new Date(config.prelimsDate);
    const today = new Date();
    const diffTime = Math.abs(prelimsDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);
  }, []);

  useEffect(() => {
    if (justHitGoal) {
      import('@/utils/sounds').then(({ playSound }) => playSound('success'));
    }
  }, [justHitGoal]);

  if (!mounted) return <div className="min-h-screen" />;

  const todayCA = currentAffairs.slice(0, 10);
  const todayMCQs = mcqs.slice(0, 10);
  const todayRevision = revisionFacts.slice(0, 10);

  const targetCaCount = Math.min(progress.caRead.length, 10);
  const targetMcqCount = Math.min(progress.mcqsDone.length, 10);
  const targetRevCount = Math.min(progress.revisionDone.length, 10);
  
  const isTargetComplete = targetCaCount >= 10 && targetMcqCount >= 10 && targetRevCount >= 10;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {justHitGoal && (
        <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-4 rounded-3xl text-white flex items-center gap-4 shadow-lg shadow-pink-200 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-[var(--color-card)]/20 p-2 rounded-full">
            <PartyPopper className="text-white" />
          </div>
          <div>
            <h3 className="font-bold">Daily Goal Met! 🎉</h3>
            <p className="text-xs text-white/90">You are one step closer to LBSNAA. So proud of you! 💖</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <section className="bg-[var(--color-card)]/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles size={100} />
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif text-[var(--color-plum)] mb-2">
              Good evening, {config.studentName} <span className="text-pink-400">♡</span>
            </h1>
            <p className="text-[var(--color-plum-light)] font-medium mb-1">Let's make today's preparation count.</p>
            <p className="text-xs text-pink-400 italic font-medium mt-2 border-l-2 border-pink-300 pl-2">{quote}</p>
          </div>
          
          <div className={`flex flex-col items-center justify-center p-2 bg-[var(--color-card)] rounded-2xl shadow-sm border ${
            progress.streak > 0 ? "border-orange-100" : "border-gray-100"
          }`}>
            <Flame size={20} className={`mb-1 ${
              progress.streak > 0 ? "text-orange-500 fill-orange-500" : "text-gray-400 fill-gray-400"
            }`} />
            <span className={`text-[10px] font-bold ${
              progress.streak > 0 ? "text-orange-700" : "text-gray-500"
            }`}>{progress.streak} Day</span>
          </div>
        </div>
        <div className="absolute -top-4 -right-2 text-4xl opacity-80 transform rotate-12 drop-shadow-md">🎀</div>
      </section>

      {/* Countdown Card */}
      <div className="bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-blush)] rounded-3xl p-6 text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-50"><Sparkles className="text-white" size={32} /></div>
        <div className="absolute bottom-0 left-0 p-4 opacity-50"><Sparkles className="text-white" size={24} /></div>
        <p className="text-xs font-bold tracking-[0.2em] text-[var(--color-plum)]/70 uppercase mb-2">UPSC Prelims 2027</p>
        <div className="text-5xl font-bold text-[var(--color-plum)] mb-2 tracking-tight">
          {daysLeft} <span className="text-2xl font-medium tracking-normal text-[var(--color-plum)]/70">Days</span>
        </div>
        <p className="text-sm text-[var(--color-plum)]/80 font-medium">Your goal is getting closer.</p>
      </div>

      {/* Daily Target */}
      <div className="bg-[var(--color-card)]/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-3xl p-6 shadow-[0_4px_20px_-10px_rgba(74,44,64,0.08)]">
        <h2 className="text-sm font-bold tracking-widest uppercase text-pink-400 mb-4 text-center">
          Today's Little Target
        </h2>
        
        <div className="space-y-3 mb-6">
          <TargetItem title="Read 10 Current Affairs" current={targetCaCount} total={10} />
          <TargetItem title="Solve 10 MCQs" current={targetMcqCount} total={10} />
          <TargetItem title="Revise 10 Facts" current={targetRevCount} total={10} />
        </div>

        {isTargetComplete && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl text-center text-sm font-medium animate-in zoom-in duration-300 flex items-center justify-center gap-2">
            <CheckCircle2 size={18} /> Today's target complete ♡
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/practice" onClick={() => import('@/utils/sounds').then(m => m.playSound('pop'))} className="bg-gradient-to-br from-[var(--color-lavender-soft)] to-[var(--color-card)] border border-[var(--color-lavender)] p-4 rounded-3xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95 text-center">
          <div className="bg-[var(--color-lavender)] text-white p-3 rounded-full">
            <Brain size={24} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[var(--color-foreground)]">MCQ Quiz</h3>
            <p className="text-[10px] text-[var(--color-plum-light)]">Practice PYQs</p>
          </div>
        </Link>

        <Link href="/revision" onClick={() => import('@/utils/sounds').then(m => m.playSound('pop'))} className="bg-gradient-to-br from-[var(--color-blush-soft)] to-[var(--color-card)] border border-[var(--color-blush)] p-4 rounded-3xl flex flex-col items-center justify-center gap-2 hover:shadow-md transition-all active:scale-95 text-center">
          <div className="bg-[var(--color-blush)] text-white p-3 rounded-full">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[var(--color-foreground)]">Flashcards</h3>
            <p className="text-[10px] text-[var(--color-plum-light)]">Quick Revision</p>
          </div>
        </Link>
      </div>

      {/* Analytics Heatmap */}
      <AnalyticsHeatmap stats={progress.mcqStats} />

      {/* Today's CA */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-plum)] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-pink-400 rounded-full inline-block"></span>
          Today's Current Affairs
        </h2>
        <div>
          {todayCA.map(ca => (
            <CurrentAffairCard 
              key={ca.id} 
              data={ca} 
              isBookmarked={isBookmarked(ca.id)}
              onBookmark={toggleBookmark}
              onRead={markCaRead}
            />
          ))}
        </div>
      </section>

      {/* Quick Practice */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-plum)] mb-4 flex items-center gap-2 mt-8">
          <span className="w-1.5 h-6 bg-[var(--color-lavender)] rounded-full inline-block"></span>
          Quick Practice
        </h2>
        <div>
          {todayMCQs.map(mcq => (
            <McqPractice 
              key={mcq.id} 
              data={mcq} 
              onComplete={(id, isCorrect) => {
                markMcqDone(id);
                recordMcqAttempt(mcq.category, isCorrect);
              }} 
            />
          ))}
        </div>
      </section>

      {/* Quick Revision */}
      <section>
        <h2 className="text-xl font-bold text-[var(--color-plum)] mb-4 flex items-center gap-2 mt-8">
          <span className="w-1.5 h-6 bg-[var(--color-blush)] rounded-full inline-block"></span>
          Quick Revision
        </h2>
        <div>
          {todayRevision.map(rev => (
            <RevisionFact 
              key={rev.id} 
              data={rev} 
              isDone={isRevisionDone(rev.id)}
              onDone={markRevisionDone} 
            />
          ))}
        </div>
      </section>
      
    </div>
  );
}

function TargetItem({ title, current, total }: { title: string, current: number, total: number }) {
  const isComplete = current >= total;
  return (
    <div className="flex items-center gap-3 text-[var(--color-plum)]">
      {isComplete ? (
        <CheckCircle2 size={20} className="text-pink-400 shrink-0" />
      ) : (
        <Circle size={20} className="text-[var(--color-lavender)] shrink-0" />
      )}
      <div className="flex-1 text-sm font-medium">{title}</div>
      <div className="text-xs font-bold text-[var(--color-plum-light)] bg-[var(--color-lavender-soft)] px-2 py-1 rounded-md">
        {current} / {total}
      </div>
    </div>
  );
}
