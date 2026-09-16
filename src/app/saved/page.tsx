"use client";

import { currentAffairsData as staticCa } from "@/data/currentAffairs";
import { CurrentAffairCard } from "@/components/CurrentAffairCard";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useProgress } from "@/hooks/useProgress";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { Heart } from "lucide-react";

export default function SavedPage() {
  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();
  const { markCaRead } = useProgress();
  const { currentAffairs } = useFirebaseData();

  const dataSource = currentAffairs.length > 0 ? currentAffairs : staticCa;
  const savedData = dataSource.filter(item => bookmarks.includes(item.id));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-plum)] mb-2 flex items-center gap-2">
          Saved <Heart className="text-pink-400 fill-pink-400 mt-1" size={24} />
        </h1>
        <p className="text-sm text-[var(--color-plum-light)]">Your bookmarked current affairs for quick access.</p>
      </header>

      <div className="pt-2">
        {savedData.length > 0 ? (
          savedData.map(ca => (
            <CurrentAffairCard 
              key={ca.id} 
              data={ca} 
              isBookmarked={isBookmarked(ca.id)}
              onBookmark={toggleBookmark}
              onRead={markCaRead}
            />
          ))
        ) : (
          <div className="text-center py-16 bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-3xl shadow-sm">
            <Heart size={48} className="mx-auto text-[var(--color-lavender)] mb-4" />
            <p className="font-bold text-[var(--color-plum)] text-lg mb-2">No saved items yet</p>
            <p className="text-sm text-[var(--color-plum-light)] max-w-[200px] mx-auto">
              Tap the heart icon on any current affair to save it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
