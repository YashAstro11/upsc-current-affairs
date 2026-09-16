"use client";
import { useState, useEffect } from "react";
import { RevisionFact } from "@/data/revision";
import { SwipeableCard } from "./SwipeableCard";
import { playSound } from "@/utils/sounds";
import { motion, AnimatePresence } from "framer-motion";

interface FlashcardDeckProps {
  facts: RevisionFact[];
  onFactRemembered: (id: string) => void;
  completedIds: string[];
}

export function FlashcardDeck({ facts, onFactRemembered, completedIds }: FlashcardDeckProps) {
  const [queue, setQueue] = useState<RevisionFact[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Filter out facts that are already completed
    const initialQueue = facts.filter(f => !completedIds.includes(f.id));
    setQueue(initialQueue);
    setMounted(true);
  }, [facts, completedIds]);

  if (!mounted) return null;

  if (queue.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="text-center p-8 mt-12 bg-[var(--color-card)]/80 backdrop-blur-sm rounded-3xl border border-[var(--color-lavender-soft)] shadow-lg"
      >
        <div className="text-6xl mb-4">🎉</div>
        <p className="font-bold text-2xl text-[var(--color-plum)] mb-2">Excellent revision today!</p>
        <p className="text-sm text-[var(--color-plum-light)] font-medium">You remembered all the facts ♡</p>
      </motion.div>
    );
  }

  const handleSwipeLeft = () => {
    playSound('pop');
    setQueue(prev => {
      const current = prev[0];
      const rest = prev.slice(1);
      return [...rest, current]; // Put at the back of the queue
    });
  };

  const handleSwipeRight = () => {
    playSound('success');
    const currentFact = queue[0];
    onFactRemembered(currentFact.id);
    // Queue update is handled by the parent re-rendering with new completedIds, 
    // but to be snappy, we update local state too.
    setQueue(prev => prev.slice(1));
  };

  return (
    <div className="relative w-full h-[400px] flex justify-center items-center mt-8">
      {/* Background stack effect */}
      {queue.length > 1 && (
        <div className="absolute w-full max-w-sm mx-auto inset-0 m-auto bg-[var(--color-card)]/60 border border-[var(--color-lavender-soft)] rounded-3xl h-[380px] shadow-sm transform scale-95 translate-y-4 z-0 pointer-events-none" />
      )}
      {queue.length > 2 && (
        <div className="absolute w-full max-w-sm mx-auto inset-0 m-auto bg-[var(--color-card)]/40 border border-[var(--color-lavender-soft)] rounded-3xl h-[380px] shadow-sm transform scale-90 translate-y-8 z-0 pointer-events-none" />
      )}
      
      {/* Current Active Card */}
      <AnimatePresence>
        {queue.map((fact, index) => (
          <SwipeableCard
            key={`${fact.id}-${index}`} // Index in key forces remount when put at the back
            fact={fact}
            isActive={index === 0}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
