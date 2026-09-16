"use client";

import { motion } from "framer-motion";
import { Check, CheckCircle2 } from "lucide-react";
import { RevisionFact as RevisionFactType } from "@/data/revision";
import { playSound } from "@/utils/sounds";

interface RevisionFactProps {
  data: RevisionFactType;
  isDone: boolean;
  onDone: (id: string) => void;
}

export function RevisionFact({ data, isDone, onDone }: RevisionFactProps) {
  const handleDone = () => {
    playSound("chime");
    onDone(data.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-2 border-dashed rounded-3xl p-4 mb-3 transition-colors relative overflow-hidden ${
        isDone 
          ? "bg-[var(--color-blush-soft)] border-pink-200" 
          : "bg-[var(--color-card)]/80 border-[var(--color-lavender-soft)]"
      }`}
    >
      {isDone && <div className="absolute top-1 right-2 text-2xl opacity-30 pointer-events-none transform -rotate-12">🎀</div>}
      <div className="flex justify-between items-start gap-4 relative z-10">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-pink-400 mb-1 inline-block">
            {data.category} • {data.relatedTopic}
          </span>
          <p className={`text-sm ${isDone ? "text-[var(--color-plum)]" : "text-[var(--color-plum)]"}`}>
            {data.fact}
          </p>
        </div>
        
        <button
          onClick={handleDone}
          disabled={isDone}
          className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all ${
            isDone 
              ? "bg-pink-400 text-white shadow-[0_0_10px_rgba(244,114,182,0.5)] scale-110" 
              : "bg-[var(--color-lavender-soft)] text-[var(--color-plum-light)] hover:bg-[var(--color-lavender)]"
          }`}
        >
          {isDone ? <CheckCircle2 size={18} /> : <Check size={16} />}
        </button>
      </div>
    </motion.div>
  );
}
