"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { csatData, CsatTopicId } from '@/data/csat';
import { useCsat } from '@/context/CsatContext';
import { ProgressBar } from '@/components/ProgressBar';
import { Calculator, BrainCircuit, BookType, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const getTopicIcon = (topic: string) => {
  switch (topic) {
    case 'math': return <Calculator className="text-blue-500" />;
    case 'reasoning': return <BrainCircuit className="text-purple-500" />;
    case 'comprehension': return <BookType className="text-emerald-500" />;
    default: return <Sparkles className="text-pink-500" />;
  }
};

export default function CsatDashboard() {
  const [mounted, setMounted] = useState(false);
  const { getOverallProgress, getTopicProgress } = useCsat();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen" />;

  const overall = getOverallProgress();
  const topics = Object.keys(csatData) as CsatTopicId[];

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[var(--color-plum)] tracking-tight mb-2 flex items-center gap-2">
          CSAT Practice <Sparkles className="text-pink-400" size={24} />
        </h1>
        <p className="text-[var(--color-plum-light)] text-sm">
          Master Prelims Paper-II with topic-wise practice and instant feedback.
        </p>
      </div>

      {/* Overall Stats */}
      <div className="bg-[var(--color-card)]/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
        <div className="w-24 h-24 rounded-full border-4 border-[var(--color-lavender)] flex flex-col items-center justify-center shrink-0 bg-white">
          <span className="text-2xl font-black text-[var(--color-plum)]">{overall.accuracy}%</span>
          <span className="text-[10px] font-bold text-[var(--color-plum-light)] uppercase tracking-wider">Accuracy</span>
        </div>
        <div className="flex-1 w-full">
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--background)] p-4 rounded-2xl border border-[var(--color-lavender-soft)]">
                 <p className="text-[10px] font-bold text-[var(--color-plum-light)] uppercase tracking-wider mb-1">Attempted</p>
                 <p className="text-xl font-bold text-[var(--color-plum)]">{overall.attempted} <span className="text-sm font-normal text-[var(--color-plum-light)]">Qs</span></p>
              </div>
              <div className="bg-[var(--background)] p-4 rounded-2xl border border-[var(--color-lavender-soft)]">
                 <p className="text-[10px] font-bold text-[var(--color-plum-light)] uppercase tracking-wider mb-1">Correct</p>
                 <p className="text-xl font-bold text-[var(--color-plum)]">{overall.correct} <span className="text-sm font-normal text-[var(--color-plum-light)]">Qs</span></p>
              </div>
           </div>
        </div>
      </div>

      {/* Topics */}
      <div>
         <h2 className="text-lg font-bold text-[var(--color-plum)] mb-4">Practice by Topic</h2>
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topicId) => {
               const data = csatData[topicId];
               const progress = getTopicProgress(topicId);
               
               return (
                  <Link 
                     key={topicId}
                     href={`/csat/practice/${topicId}`}
                     className="bg-[var(--color-card)] border border-[var(--color-lavender-soft)] rounded-3xl p-5 hover:border-[var(--color-lavender)] hover:shadow-md transition-all group flex flex-col"
                  >
                     <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--background)] border border-[var(--color-lavender-soft)] flex items-center justify-center">
                           {getTopicIcon(topicId)}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[var(--color-blush-soft)] flex items-center justify-center text-[var(--color-plum)] group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors">
                           <ChevronRight size={16} />
                        </div>
                     </div>
                     
                     <h3 className="font-bold text-[var(--color-plum)] text-lg mb-1">{data.title}</h3>
                     <p className="text-xs text-[var(--color-plum-light)] mb-6 line-clamp-2">{data.description}</p>
                     
                     <div className="mt-auto">
                        <div className="flex items-end justify-between mb-2">
                           <span className="text-sm font-bold text-[var(--color-plum)]">{progress.accuracy}%</span>
                           <span className="text-[10px] font-bold text-[var(--color-plum-light)] uppercase">{progress.attempted} Att</span>
                        </div>
                        <ProgressBar percentage={progress.accuracy} height="h-1.5" />
                     </div>
                  </Link>
               );
            })}
         </div>
      </div>
      
    </div>
  );
}
