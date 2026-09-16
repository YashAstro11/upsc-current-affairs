"use client";

import { motion } from "framer-motion";
import { ProgressState } from "@/hooks/useProgress";

interface AnalyticsHeatmapProps {
  stats: ProgressState["mcqStats"];
}

export function AnalyticsHeatmap({ stats }: AnalyticsHeatmapProps) {
  const categories = Object.keys(stats || {});

  if (categories.length === 0) {
    return (
      <div className="bg-[var(--color-card)]/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-3xl p-6 shadow-sm mb-8 text-center">
        <h3 className="text-sm font-bold tracking-widest uppercase text-pink-400 mb-2">
          Subject Analytics 📊
        </h3>
        <p className="text-sm text-[var(--color-plum-light)]">
          Solve some MCQs to generate your weakness heatmap!
        </p>
      </div>
    );
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return "bg-emerald-400";
    if (percentage >= 50) return "bg-amber-400";
    return "bg-pink-500";
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 75) return "Strong";
    if (percentage >= 50) return "Review";
    return "Weak";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--color-card)]/80 backdrop-blur-sm border-2 border-dashed border-[var(--color-lavender-soft)] rounded-3xl p-6 shadow-sm mb-8"
    >
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-pink-400 mb-1">
            Subject Analytics 📊
          </h3>
          <p className="text-xs text-[var(--color-plum-light)]">Your accuracy heatmap across subjects.</p>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(category => {
          const { correct, total } = stats[category];
          const percentage = Math.round((correct / total) * 100) || 0;
          const colorClass = getStatusColor(percentage);

          return (
            <div key={category} className="group">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm font-semibold text-[var(--color-plum)]">{category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[var(--color-plum-light)]">
                    {correct}/{total}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white ${colorClass}`}>
                    {getStatusText(percentage)}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar Track */}
              <div className="h-2.5 w-full bg-[var(--color-blush-soft)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${colorClass}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
