"use client";

import { useState } from "react";
import { currentAffairsData as staticCa } from "@/data/currentAffairs";
import { useProgress } from "@/hooks/useProgress";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { CurrentAffairCard } from "@/components/CurrentAffairCard";

export default function CurrentAffairs() {
  const { progress, markCaRead } = useProgress();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { currentAffairs, loading } = useFirebaseData();
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(staticCa.map(item => item.category)))];

  const dataSource = currentAffairs.length > 0 ? currentAffairs : staticCa;
  
  const filteredData = filter === "All" ? dataSource : dataSource.filter(item => item.category === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-plum)] mb-2">Current Affairs</h1>
        <p className="text-sm text-[var(--color-plum-light)]">Stay updated with daily important events.</p>
      </header>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === cat
                ? "bg-pink-400 text-white shadow-sm"
                : "bg-[var(--color-card)] text-[var(--color-plum-light)] border hover:bg-pink-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="pt-4">
        {filteredData.length > 0 ? (
          filteredData.map(ca => (
            <CurrentAffairCard 
              key={ca.id} 
              data={ca} 
              isBookmarked={isBookmarked(ca.id)}
              onBookmark={toggleBookmark}
              onRead={markCaRead}
            />
          ))
        ) : (
          <div className="text-center py-12 text-[var(--color-plum-light)]">
            <p>No current affairs found for this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
