"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronRight, Bookmark } from "lucide-react";
import { CurrentAffair } from "@/data/currentAffairs";
import { playSound } from "@/utils/sounds";

interface CurrentAffairCardProps {
  data: CurrentAffair;
  isBookmarked: boolean;
  onBookmark: (id: string) => void;
  onRead: (id: string) => void;
}

export function CurrentAffairCard({
  data,
  isBookmarked,
  onBookmark,
  onRead,
}: CurrentAffairCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReadClick = () => {
    playSound("pop");
    setIsOpen(true);
    onRead(data.id);
  };

  const handleBookmarkClick = () => {
    playSound(isBookmarked ? "pop" : "chime");
    onBookmark(data.id);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-card)]/80 backdrop-blur-sm border-2 border-dashed border-[var(--color-lavender-soft)] rounded-3xl p-5 shadow-[0_4px_20px_-10px_rgba(74,44,64,0.08)] mb-4 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-3 opacity-20 text-3xl pointer-events-none transform rotate-12 group-hover:scale-110 transition-transform">🎀</div>
        
        <div className="flex justify-between items-start mb-2 relative z-10">
          <span className="text-[10px] font-bold tracking-widest uppercase text-pink-400 bg-[var(--color-blush-soft)] px-3 py-1.5 rounded-full border border-pink-100">
            {data.category}
          </span>
          <button
            onClick={handleBookmarkClick}
            className="p-1 text-[var(--color-plum-light)] transition-transform active:scale-75"
          >
            <Heart
              size={22}
              className={`transition-all duration-300 ${
                isBookmarked ? "fill-pink-400 text-pink-400 drop-shadow-md scale-110" : ""
              }`}
            />
          </button>
        </div>

        <h3 className="text-lg font-semibold text-[var(--color-plum)] mb-2 leading-tight">
          {data.title}
        </h3>

        <div className="text-sm text-[var(--color-plum-light)] mb-4">
          <p className="font-medium mb-1">Why it matters:</p>
          <p className="line-clamp-2">{data.summary}</p>
        </div>

        <button
          onClick={handleReadClick}
          className="w-full flex items-center justify-center gap-1 bg-[var(--color-lavender-soft)] hover:bg-[var(--color-lavender)] text-[var(--color-plum)] py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          Read <ChevronRight size={16} />
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-[var(--color-plum)]/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-[var(--color-card)] rounded-t-3xl md:rounded-3xl shadow-2xl h-[85vh] md:h-auto md:max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 overflow-y-auto flex-1">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold tracking-widest uppercase text-pink-400 bg-[var(--color-blush-soft)] px-2 py-1 rounded-md">
                    {data.category}
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-[var(--color-plum-light)] hover:text-[var(--color-plum)]"
                  >
                    Close
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-[var(--color-plum)] mb-6">
                  {data.title}
                </h2>

                <div className="space-y-6">
                  <section>
                    <h4 className="text-sm font-bold text-pink-400 mb-2">Why in News</h4>
                    <p className="text-[var(--color-plum)] text-sm leading-relaxed bg-[var(--color-blush-soft)] p-4 rounded-xl">
                      {data.whyInNews}
                    </p>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold text-[var(--color-plum)] mb-2">Explanation</h4>
                    <p className="text-[var(--color-plum-light)] text-sm leading-relaxed">
                      {data.summary}
                    </p>
                  </section>

                  <section className="bg-[var(--color-lavender-soft)] p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-[var(--color-plum)] mb-3 flex items-center gap-2">
                      <Bookmark size={16} className="text-pink-400" />
                      Important for Prelims
                    </h4>
                    <ul className="space-y-2">
                      {data.prelimsFacts.map((fact, idx) => (
                        <li key={idx} className="text-sm text-[var(--color-plum-light)] flex gap-2">
                          <span className="text-pink-400 mt-0.5">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h4 className="text-sm font-bold text-[var(--color-plum)] mb-2">Static Connection</h4>
                    <div className="text-sm text-[var(--color-plum-light)] border border-[var(--color-lavender)] px-4 py-3 rounded-xl">
                      {data.staticConnection}
                    </div>
                  </section>
                </div>
              </div>

              <div className="p-4 border-t border-[var(--color-lavender-soft)] bg-[var(--color-card)]">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-[var(--color-plum)] text-white py-3.5 rounded-xl font-medium transition-transform active:scale-[0.98]"
                >
                  Mark as Read ♡
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
