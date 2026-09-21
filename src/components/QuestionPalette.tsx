import React from "react";
import { useTest } from "@/context/TestContext";
import { TestQuestion } from "@/data/tests";
import { Bookmark } from "lucide-react";

interface QuestionPaletteProps {
  questions: TestQuestion[];
  currentQuestionIndex: number;
  onNavigate: (index: number) => void;
}

export function QuestionPalette({ questions, currentQuestionIndex, onNavigate }: QuestionPaletteProps) {
  const { activeState, isMarkedForReview } = useTest();

  if (!activeState) return null;

  const answeredCount = Object.keys(activeState.answers).length;
  const reviewCount = activeState.markedForReview.length;
  const unattemptedCount = questions.length - answeredCount;

  return (
    <div className="bg-[var(--color-card)]/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-2xl p-4 shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-bold tracking-widest uppercase text-pink-400 mb-4">Question Palette</h3>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mb-6 text-[10px] font-medium text-[var(--color-plum-light)]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-emerald-500/20 border border-emerald-500/50"></div>
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-[var(--color-card)] border border-[var(--color-lavender)]"></div>
          <span>Not Answered ({unattemptedCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
            <Bookmark size={10} className="text-purple-500" />
          </div>
          <span>Marked for Review ({reviewCount})</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-2 overflow-y-auto pr-2 pb-2 flex-1 content-start">
        {questions.map((q, idx) => {
          const isAnswered = activeState.answers[q.id] !== undefined;
          const isMarked = isMarkedForReview(q.id);
          const isCurrent = currentQuestionIndex === idx;

          let btnClass = "bg-[var(--color-card)] border-[var(--color-lavender)] text-[var(--color-plum-light)]";
          
          if (isMarked) {
             btnClass = "bg-purple-900/20 border-purple-500/50 text-purple-400";
          } else if (isAnswered) {
             btnClass = "bg-emerald-900/20 border-emerald-500/50 text-emerald-400";
          }

          if (isCurrent) {
            btnClass += " ring-2 ring-pink-400 ring-offset-2 ring-offset-[var(--background)]";
          }

          return (
            <button
              key={q.id}
              onClick={() => onNavigate(idx)}
              className={`w-full aspect-square rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition-all hover:scale-105 active:scale-95 ${btnClass}`}
            >
              {isMarked && <Bookmark size={10} className="mb-0.5" />}
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
