"use client";

import { useState } from "react";
import { mcqsData as staticMcqs } from "@/data/mcqs";
import { McqPractice } from "@/components/McqPractice";
import { useProgress } from "@/hooks/useProgress";
import { useFirebaseData } from "@/hooks/useFirebaseData";

export default function PracticePage() {
  const { progress, markMcqDone } = useProgress();
  const { mcqs, loading } = useFirebaseData();
  const [filter, setFilter] = useState("All");
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });

  const dataSource = mcqs.length > 0 ? mcqs : staticMcqs;
  const categories = ["All", ...Array.from(new Set(staticMcqs.map(item => item.category)))];
  const filteredData = filter === "All" ? dataSource : dataSource.filter(item => item.category === filter);

  const handleComplete = (id: string, isCorrect: boolean) => {
    markMcqDone(id);
    setSessionScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const isComplete = sessionScore.total === dataSource.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-plum)] mb-2">Practice MCQs</h1>
        <p className="text-sm text-[var(--color-plum-light)]">Test your knowledge with daily questions.</p>
      </header>

      {sessionScore.total > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-2xl p-6 text-center shadow-sm sticky top-4 z-10">
          <h3 className="text-sm font-bold tracking-widest uppercase text-pink-400 mb-2">
            Today's Score
          </h3>
          <div className="text-3xl font-bold text-[var(--color-plum)] mb-2">
            {sessionScore.correct} <span className="text-xl text-[var(--color-plum-light)]">/ {sessionScore.total}</span>
          </div>
          <p className="text-sm font-medium text-[var(--color-plum-light)]">
            {sessionScore.correct === sessionScore.total 
              ? "You're doing great ♡" 
              : "Don't worry. Review the topics and try again."}
          </p>
        </div>
      )}

      <div className="pt-2">
        {filteredData.map(mcq => (
          <McqPractice 
            key={mcq.id} 
            data={mcq} 
            onComplete={handleComplete}
          />
        ))}
      </div>

      {isComplete && (
        <div className="text-center p-8 bg-[var(--color-blush-soft)] rounded-2xl border border-pink-200">
          <p className="font-bold text-[var(--color-plum)]">All caught up for today!</p>
          <p className="text-sm text-[var(--color-plum-light)] mt-2">Check back tomorrow for more questions ♡</p>
        </div>
      )}
    </div>
  );
}
