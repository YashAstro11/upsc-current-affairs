"use client";

import { revisionData as staticRev } from "@/data/revision";
import { useProgress } from "@/hooks/useProgress";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { FlashcardDeck } from "@/components/FlashcardDeck";

export default function RevisionPage() {
  const { markRevisionDone, progress } = useProgress();
  const { revisionFacts } = useFirebaseData();

  const dataSource = revisionFacts.length > 0 ? revisionFacts : staticRev;
  const totalCompleted = progress.revisionDone.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-[var(--color-plum)] mb-2">Quick Revision</h1>
        <p className="text-sm text-[var(--color-plum-light)]">Review important facts and boost your memory.</p>
      </header>

      <div className="flex justify-between items-center px-2">
        <span className="text-sm font-bold text-[var(--color-plum)]">Today's Progress</span>
        <span className="text-sm font-bold text-pink-400 bg-[var(--color-blush-soft)] px-3 py-1 rounded-full">
          {totalCompleted} / {dataSource.length}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="h-2 w-full bg-[var(--color-blush-soft)] rounded-full overflow-hidden mx-2 mt-2">
        <div 
          className="h-full bg-pink-400 transition-all duration-500 ease-out"
          style={{ width: `${(totalCompleted / dataSource.length) * 100}%` }}
        />
      </div>

      <FlashcardDeck 
        facts={dataSource} 
        onFactRemembered={markRevisionDone} 
        completedIds={progress.revisionDone} 
      />
    </div>
  );
}
