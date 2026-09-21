import React, { useState, useEffect } from "react";
import { TestQuestion } from "@/data/tests";
import { useTest } from "@/context/TestContext";
import { Bookmark, Eraser, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TestQuestionViewProps {
  question: TestQuestion;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

export function TestQuestionView({ question, index, total, onNext, onPrev }: TestQuestionViewProps) {
  const { activeState, answerQuestion, clearResponse, toggleReview, isMarkedForReview } = useTest();
  
  // Local state for immediate feedback before saving to context on "Save & Next"
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (activeState) {
      setSelectedOption(activeState.answers[question.id] ?? null);
    }
  }, [question.id, activeState?.answers]);

  const handleOptionClick = (idx: number) => {
    import('@/utils/sounds').then(m => m.playSound('pop'));
    setSelectedOption(idx);
    answerQuestion(question.id, idx);
  };

  const handleClear = () => {
    setSelectedOption(null);
    clearResponse(question.id);
  };

  const handleMarkReview = () => {
    toggleReview(question.id);
  };

  const isMarked = isMarkedForReview(question.id);

  return (
    <div className="flex flex-col h-full">
      {/* Question Header */}
      <div className="flex justify-between items-center mb-6 border-b border-[var(--color-lavender)] pb-4">
        <div className="flex items-center gap-3">
          <span className="bg-[var(--color-lavender-soft)] text-[var(--color-plum)] font-bold px-3 py-1.5 rounded-lg text-sm">
            Q. {index + 1}
          </span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-pink-400 bg-[var(--color-blush-soft)] px-2 py-1 rounded-md">
            {question.subject}
          </span>
        </div>
        <div className="text-sm font-medium text-[var(--color-plum-light)]">
          {index + 1} of {total}
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-8 overflow-y-auto pr-2" style={{ maxHeight: "40vh" }}>
        <p className="text-[var(--color-plum)] font-medium text-lg leading-relaxed whitespace-pre-wrap">
          {question.text}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-auto">
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 ${
                isSelected
                  ? "border-[var(--color-plum)] bg-[var(--color-lavender-soft)] text-[var(--color-plum)] shadow-sm"
                  : "border-[var(--color-lavender)] bg-[var(--color-card)] text-[var(--color-plum-light)] hover:bg-[var(--color-lavender-soft)]/50 hover:border-[var(--color-plum)]/30"
              }`}
            >
              <span className={`font-bold text-lg font-serif italic mt-0.5 ${isSelected ? "opacity-100" : "opacity-60"}`}>
                {String.fromCharCode(65 + idx)}.
              </span>
              <span className="leading-relaxed">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="grid grid-cols-3 gap-3 mt-8 pt-4 border-t border-[var(--color-lavender)]">
        <button
          onClick={handleMarkReview}
          className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border text-xs font-bold transition-all ${
            isMarked
              ? "bg-purple-900/20 border-purple-500/50 text-purple-400"
              : "bg-[var(--color-card)] border-[var(--color-lavender)] text-[var(--color-plum-light)] hover:bg-[var(--color-lavender-soft)]"
          }`}
        >
          <Bookmark size={18} className={isMarked ? "fill-purple-400" : ""} />
          {isMarked ? "Marked" : "Review"}
        </button>
        
        <button
          onClick={handleClear}
          disabled={selectedOption === null}
          className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl border border-[var(--color-lavender)] bg-[var(--color-card)] text-[var(--color-plum-light)] hover:bg-rose-900/10 hover:text-rose-400 hover:border-rose-500/30 text-xs font-bold transition-all disabled:opacity-50 disabled:hover:bg-[var(--color-card)] disabled:hover:text-[var(--color-plum-light)] disabled:hover:border-[var(--color-lavender)]"
        >
          <Eraser size={18} />
          Clear
        </button>

        <button
          onClick={onNext}
          className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-[var(--color-plum)] text-white text-xs font-bold hover:brightness-110 transition-all shadow-md active:scale-95"
        >
          <ArrowRight size={18} />
          {index === total - 1 ? "Save" : "Save & Next"}
        </button>
      </div>
      
      {/* Previous button for non-first questions */}
      {index > 0 && (
         <button
         onClick={onPrev}
         className="absolute top-4 right-4 bg-[var(--color-card)] border border-[var(--color-lavender)] text-[var(--color-plum-light)] p-2 rounded-full hover:bg-[var(--color-lavender-soft)] transition-colors md:hidden"
       >
         <ArrowLeft size={16} />
       </button>
      )}
    </div>
  );
}
