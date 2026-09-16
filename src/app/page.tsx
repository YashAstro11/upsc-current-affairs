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
import { Sparkles, CheckCircle2, Circle, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { progress, markCaRead, markMcqDone, markRevisionDone, isRevisionDone } = useProgress();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { currentAffairs, mcqs, revisionFacts, loading } = useFirebaseData();
  
  const [daysLeft, setDaysLeft] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    const prelimsDate = new Date(config.prelimsDate);
    const today = new Date();
    const diffTime = Math.abs(prelimsDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);
  }, []);

  if (!mounted) return <div className="min-h-screen" />;

  const todayCA = currentAffairs.length > 0 ? currentAffairs.slice(0, 5) : staticCa.slice(0, 5);
  const todayMCQs = mcqs.length > 0 ? mcqs.slice(0, 5) : staticMcqs.slice(0, 5);
  const todayRevision = revisionFacts.length > 0 ? revisionFacts.slice(0, 5) : staticRev.slice(0, 5);

  const targetCaCount = Math.min(progress.caRead.length, 5);
  const targetMcqCount = Math.min(progress.mcqsDone.length, 5);
  const targetRevCount = Math.min(progress.revisionDone.length, 5);
  
  const isTargetComplete = targetCaCount >= 5 && targetMcqCount >= 5 && targetRevCount >= 5;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header section */}
      <header className="space-y-2 relative">
        <h1 className="text-2xl md:text-3xl font-serif text-[var(--color-plum)]">
          Good evening, {config.studentName} <span className="text-pink-400">♡</span>
        </h1>
        <p className="text-[var(--color-plum-light)] font-medium">Let's make today's preparation count.</p>
        <div className="absolute -top-4 -right-2 text-4xl opacity-80 transform rotate-12 drop-shadow-md">🎀</div>
      </header>

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
      <div className="bg-white/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-3xl p-6 shadow-[0_4px_20px_-10px_rgba(74,44,64,0.08)]">
        <h2 className="text-sm font-bold tracking-widest uppercase text-pink-400 mb-4 text-center">
          Today's Little Target
        </h2>
        
        <div className="space-y-3 mb-6">
          <TargetItem title="Read 5 Current Affairs" current={targetCaCount} total={5} />
          <TargetItem title="Solve 5 MCQs" current={targetMcqCount} total={5} />
          <TargetItem title="Revise 5 Facts" current={targetRevCount} total={5} />
        </div>

        {isTargetComplete && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl text-center text-sm font-medium animate-in zoom-in duration-300 flex items-center justify-center gap-2">
            <CheckCircle2 size={18} /> Today's target complete ♡
          </div>
        )}
      </div>

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
              onComplete={(id) => markMcqDone(id)} 
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
