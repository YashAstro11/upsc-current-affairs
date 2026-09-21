import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  percentage: number;
  height?: string;
  colorClass?: string;
  bgColorClass?: string;
}

export function ProgressBar({ 
  percentage, 
  height = "h-2", 
  colorClass = "bg-gradient-to-r from-pink-400 to-purple-400",
  bgColorClass = "bg-[var(--color-lavender-soft)]"
}: ProgressBarProps) {
  return (
    <div className={`w-full rounded-full overflow-hidden ${bgColorClass} ${height}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full rounded-full ${colorClass}`}
      />
    </div>
  );
}
