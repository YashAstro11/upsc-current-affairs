"use client";

import { revisionData as staticRev } from "@/data/revision";
import { RevisionFact } from "@/components/RevisionFact";
import { useProgress } from "@/hooks/useProgress";
import { useFirebaseData } from "@/hooks/useFirebaseData";

export default function RevisionPage() {
  const { markRevisionDone, isRevisionDone, progress } = useProgress();
  const { revisionFacts, loading } = useFirebaseData();

  const dataSource = revisionFacts.length > 0 ? revisionFacts : staticRev;

  const totalCompleted = progress.revisionDone.length;
  const isAllComplete = totalCompleted >= dataSource.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-plum)] mb-2">Quick Revision</h1>
        <p className="text-sm text-[var(--color-plum-light)]">Review important facts and boost your memory.</p>
      </header>

      <div className="flex justify-between items-center mb-6 px-2">
        <span className="text-sm font-bold text-[var(--color-plum)]">Progress</span>
        <span className="text-sm font-bold text-pink-400 bg-[var(--color-blush-soft)] px-3 py-1 rounded-full">
          {totalCompleted} / {dataSource.length}
        </span>
      </div>

      <div className="space-y-4">
        {dataSource.map((fact) => (
          <RevisionFact
            key={fact.id}
            data={fact}
            isDone={isRevisionDone(fact.id)}
            onDone={markRevisionDone}
          />
        ))}
      </div>

      {isAllComplete && (
        <div className="text-center p-8 mt-6 bg-[var(--color-blush-soft)] rounded-2xl border border-pink-200">
          <p className="font-bold text-[var(--color-plum)]">Excellent revision today!</p>
          <p className="text-sm text-[var(--color-plum-light)] mt-2">You remembered all the facts ♡</p>
        </div>
      )}
    </div>
  );
}
