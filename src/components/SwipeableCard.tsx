"use client";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { RevisionFact } from "@/data/revision";
import { X, Check } from "lucide-react";
import { useState } from "react";

interface SwipeableCardProps {
  fact: RevisionFact;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isActive: boolean;
}

export function SwipeableCard({ fact, onSwipeLeft, onSwipeRight, isActive }: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacityLeft = useTransform(x, [-100, -200], [0, 1]);
  const opacityRight = useTransform(x, [100, 200], [0, 1]);
  const scale = useTransform(x, [-200, 0, 200], [0.9, 1, 0.9]);

  const [exitX, setExitX] = useState<number>(0);
  const [isExiting, setIsExiting] = useState(false);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      setExitX(300);
      setIsExiting(true);
      setTimeout(onSwipeRight, 300);
    } else if (info.offset.x < -100 || info.velocity.x < -500) {
      setExitX(-300);
      setIsExiting(true);
      setTimeout(onSwipeLeft, 300);
    }
  };

  const manualSwipe = (direction: "left" | "right") => {
    if (direction === "left") {
      setExitX(-300);
      setIsExiting(true);
      setTimeout(onSwipeLeft, 300);
    } else {
      setExitX(300);
      setIsExiting(true);
      setTimeout(onSwipeRight, 300);
    }
  };

  if (!isActive && !isExiting) return null;

  return (
    <motion.div
      className="absolute w-full max-w-sm mx-auto inset-0 m-auto h-[380px]"
      style={{ x, rotate, scale, zIndex: isActive ? 10 : 1 }}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={isExiting ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileTap={{ cursor: "grabbing" }}
    >
      <div className="bg-[var(--color-card)] rounded-3xl p-6 shadow-xl border border-[var(--color-lavender-soft)] h-full flex flex-col items-center justify-between relative overflow-hidden cursor-grab">
        
        {/* Overlay Tags */}
        <motion.div style={{ opacity: opacityLeft }} className="absolute top-8 right-8 border-4 border-rose-400 text-rose-400 rounded-xl px-4 py-1 font-bold text-2xl rotate-12 bg-[var(--color-card)]/50 backdrop-blur-sm z-20 pointer-events-none">
          FORGOT
        </motion.div>
        
        <motion.div style={{ opacity: opacityRight }} className="absolute top-8 left-8 border-4 border-emerald-400 text-emerald-400 rounded-xl px-4 py-1 font-bold text-2xl -rotate-12 bg-[var(--color-card)]/50 backdrop-blur-sm z-20 pointer-events-none">
          REMEMBERED
        </motion.div>

        {/* Header Badge */}
        <div className="w-full flex justify-start mb-2 z-10">
          <div className="bg-[var(--color-blush-soft)] text-[var(--color-foreground)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            {fact.category}
          </div>
        </div>
        
        {/* Content */}
        <div className="text-center w-full z-10 px-2 flex-1 overflow-y-auto my-2 flex flex-col">
          <div className="m-auto w-full py-2">
            <p className="text-lg md:text-xl font-serif text-[var(--color-plum)] leading-relaxed mb-4">
              "{fact.fact}"
            </p>
            <div>
              <div className="inline-block bg-[var(--color-lavender-soft)] text-[var(--color-plum)]/70 text-xs font-medium px-4 py-1.5 rounded-full">
                Topic: {fact.relatedTopic}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex justify-center gap-12 px-6 z-20 mt-2 shrink-0 pb-2">
          <button 
            onClick={() => manualSwipe("left")}
            className="w-14 h-14 shrink-0 bg-[var(--color-card)] border-2 border-rose-500/30 rounded-full flex items-center justify-center text-rose-400 shadow-md hover:bg-rose-500/10 transition-colors active:scale-90"
          >
            <X size={28} strokeWidth={3} />
          </button>
          
          <button 
            onClick={() => manualSwipe("right")}
            className="w-14 h-14 shrink-0 bg-[var(--color-card)] border-2 border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-md hover:bg-emerald-500/10 transition-colors active:scale-90"
          >
            <Check size={28} strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
