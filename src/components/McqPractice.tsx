import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { MCQ } from "@/data/mcqs";
import { playSound } from "@/utils/sounds";

interface McqPracticeProps {
  data: MCQ;
  onComplete: (id: string, isCorrect: boolean) => void;
  onNext?: () => void;
}

export function McqPractice({ data, onComplete, onNext }: McqPracticeProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (idx: number) => {
    playSound("pop");
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const correct = selected === data.answer;
    playSound(correct ? "success" : "pop");
    onComplete(data.id, correct);
  };

  const isCorrect = selected === data.answer;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[var(--color-card)]/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-2xl p-5 shadow-[0_4px_20px_-10px_rgba(74,44,64,0.08)] mb-4"
    >
      <span className="text-[10px] font-bold tracking-widest uppercase text-pink-400 bg-[var(--color-blush-soft)] px-2 py-1 rounded-md mb-3 inline-block">
        {data.category}
      </span>
      
      <p className="text-[var(--color-plum)] font-medium mb-5">{data.question}</p>

      <div className="space-y-3 mb-6">
        {data.options.map((option, idx) => {
          let buttonClass = "border-[var(--color-lavender)] bg-[var(--color-card)] text-[var(--color-plum-light)] hover:bg-[var(--color-lavender-soft)]/30";
          
          if (submitted) {
            if (idx === data.answer) {
              buttonClass = "border-emerald-500/50 bg-emerald-900/20 text-emerald-400";
            } else if (idx === selected) {
              buttonClass = "border-rose-500/50 bg-rose-900/20 text-rose-400";
            } else {
               buttonClass = "border-[var(--color-lavender)] bg-[var(--color-card)] text-[var(--color-plum-light)] opacity-50";
            }
          } else if (selected === idx) {
            buttonClass = "border-[var(--color-plum)] bg-[var(--color-lavender-soft)] text-[var(--color-plum)]";
          }

          return (
            <button
              key={idx}
              disabled={submitted}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 border-dashed text-sm transition-all duration-200 ${buttonClass}`}
            >
              <span className="font-bold text-lg mr-3 font-serif italic opacity-70">{String.fromCharCode(65 + idx)}.</span>
              {option}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {!submitted ? (
          <motion.button
            exit={{ opacity: 0, height: 0 }}
            disabled={selected === null}
            onClick={handleSubmit}
            className="w-full bg-[var(--color-blush)] disabled:opacity-50 text-[var(--color-plum)] py-3 rounded-xl font-bold tracking-wide shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Check Answer
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div className={`p-4 rounded-xl mb-4 flex flex-col gap-4 border ${isCorrect ? "bg-emerald-900/10 border-emerald-500/20" : "bg-rose-900/10 border-rose-500/20"}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <div className="bg-emerald-500/20 p-1.5 rounded-full mt-0.5 shrink-0">
                    <Check className="text-emerald-400" size={16} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="bg-rose-500/20 p-1.5 rounded-full mt-0.5 shrink-0">
                    <X className="text-rose-400" size={16} strokeWidth={3} />
                  </div>
                )}
                <div>
                  <p className={`font-bold text-sm ${isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  <p className="text-sm mt-2 text-[var(--color-plum-light)] leading-relaxed">
                    {data.explanation}
                  </p>
                </div>
              </div>
              
              {onNext && (
                <button 
                  onClick={onNext}
                  className="w-full mt-2 py-3 rounded-xl bg-[var(--color-lavender-soft)] text-[var(--color-plum)] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Next Question <ArrowRight size={18} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
