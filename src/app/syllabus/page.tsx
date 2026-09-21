"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { syllabusData, SyllabusSubject } from "@/data/syllabus";
import { useSyllabus } from "@/context/SyllabusContext";
import { ProgressBar } from "@/components/ProgressBar";
import { Target, BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function SyllabusDashboard() {
  const [mounted, setMounted] = useState(false);
  const { getSubjectProgress } = useSyllabus();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen" />;

  // Calculate overall progress
  let totalTopics = 0;
  let totalCompleted = 0;
  
  syllabusData.forEach(subject => {
    const prog = getSubjectProgress(subject.id);
    totalTopics += prog.total;
    totalCompleted += prog.completed;
  });

  const overallPercentage = totalTopics === 0 ? 0 : Math.round((totalCompleted / totalTopics) * 100);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-[var(--color-card)]/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <BookOpen size={100} />
        </div>
        <h1 className="text-2xl font-serif text-[var(--color-plum)] mb-2 flex items-center gap-2">
          <Target size={28} className="text-pink-400" />
          Syllabus Tracker
        </h1>
        <p className="text-[var(--color-plum-light)] font-medium text-sm">
          Track your UPSC Prelims preparation topic by topic.
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-blush)] rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-50"><Sparkles className="text-white" size={32} /></div>
        <h2 className="text-sm font-bold tracking-widest uppercase text-[var(--color-plum)]/70 mb-4">Overall Completion</h2>
        
        <div className="flex items-end gap-2 mb-4">
          <span className="text-5xl font-black text-[var(--color-plum)] tracking-tighter">{overallPercentage}%</span>
          <span className="text-sm font-bold text-[var(--color-plum)]/70 mb-2">Done</span>
        </div>
        
        <ProgressBar 
          percentage={overallPercentage} 
          height="h-3" 
          colorClass="bg-[var(--color-plum)]" 
          bgColorClass="bg-white/30" 
        />
        
        <div className="flex justify-between text-xs font-bold text-[var(--color-plum)]/70 mt-2">
           <span>{totalCompleted} Topics Completed</span>
           <span>{totalTopics - totalCompleted} Remaining</span>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {syllabusData.map((subject, index) => {
           const progress = getSubjectProgress(subject.id);
           return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  href={`/syllabus/${subject.id}`}
                  className="block bg-[var(--color-card)]/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  onClick={() => import('@/utils/sounds').then(m => m.playSound('pop'))}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-lavender-soft)] flex items-center justify-center text-2xl border border-[var(--color-lavender)]">
                      {subject.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[var(--color-plum)] text-lg truncate">{subject.title}</h3>
                      <p className="text-xs font-medium text-[var(--color-plum-light)]">
                        {subject.chapters.length} Chapters • {progress.total} Topics
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                     <div className="flex-1">
                        <ProgressBar percentage={progress.percentage} />
                     </div>
                     <span className="text-xs font-bold text-[var(--color-plum)] w-8 text-right">
                        {progress.percentage}%
                     </span>
                  </div>
                </Link>
              </motion.div>
           );
        })}
      </div>

    </div>
  );
}
