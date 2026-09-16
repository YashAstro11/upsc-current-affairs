"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { MCQ } from "@/data/mcqs";
import { playSound } from "@/utils/sounds";

interface McqPracticeProps {
  data: MCQ;
  onComplete: (id: string, isCorrect: boolean) => void;
}

export function McqPractice({ data, onComplete }: McqPracticeProps) {
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
      className="bg-white/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-2xl p-5 shadow-[0_4px_20px_-10px_rgba(74,44,64,0.08)] mb-4"
    >
      <span className="text-[10px] font-bold tracking-widest uppercase text-pink-400 bg-[var(--color-blush-soft)] px-2 py-1 rounded-md mb-3 inline-block">
        {data.category}
      </span>
      
      <p className="text-[var(--color-plum)] font-medium mb-5">{data.question}</p>

      <div className="space-y-3 mb-6">
        {data.options.map((option, idx) => {
          let buttonClass = "border-[var(--color-lavender)] bg-white text-[var(--color-plum-light)]";
          
          if (submitted) {
            if (idx === data.answer) {
              buttonClass = "border-green-400 bg-green-50 text-green-700";
            } else if (idx === selected) {
              buttonClass = "border-red-400 bg-red-50 text-red-700";
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
              <span className="font-bold text-lg mr-3 font-serif italic text-pink-400">{String.fromCharCode(65 + idx)}.</span>
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
            className="w-full bg-[var(--color-plum)] disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-all"
          >
            Check Answer
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div className={`p-4 rounded-xl mb-4 flex items-start gap-3 ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
              {isCorrect ? (
                <Check className="text-green-500 mt-0.5 shrink-0" size={18} />
              ) : (
                <X className="text-red-500 mt-0.5 shrink-0" size={18} />
              )}
              <div>
                <p className={`font-bold text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                  {isCorrect ? "Correct!" : "Incorrect"}
                </p>
                <p className="text-sm mt-1 text-[var(--color-plum-light)]">
                  {data.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
