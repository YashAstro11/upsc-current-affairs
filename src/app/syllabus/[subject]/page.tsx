"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { syllabusData } from "@/data/syllabus";
import { useSyllabus } from "@/context/SyllabusContext";
import { ProgressBar } from "@/components/ProgressBar";
import { ArrowLeft, CheckCircle2, Circle, ChevronDown, ChevronUp, BookText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { completedTopics, toggleTopicCompletion, getSubjectProgress, getChapterProgress } = useSyllabus();
  
  // State for expanded chapters (default to all closed except maybe first one, but let's default all closed for cleanliness)
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  const subjectId = typeof params?.subject === 'string' ? params.subject : '';
  const subject = syllabusData.find((s) => s.id === subjectId);

  useEffect(() => {
    setMounted(true);
    if (!subject && mounted) {
      router.push('/syllabus');
    }
  }, [subject, mounted, router]);

  if (!mounted || !subject) return <div className="min-h-screen" />;

  const progress = getSubjectProgress(subject.id);

  const toggleChapter = (chapterId: string) => {
    import('@/utils/sounds').then(m => m.playSound('pop'));
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleToggleTopic = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering other clicks if any
    
    // Play sound based on new state
    const willBeCompleted = !completedTopics.includes(topicId);
    import('@/utils/sounds').then(m => {
       if (willBeCompleted) m.playSound('success');
       else m.playSound('pop');
    });

    toggleTopicCompletion(topicId);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Top Bar */}
      <div className="flex items-center gap-4">
        <Link 
          href="/syllabus"
          className="bg-[var(--color-card)] p-2 rounded-full border border-[var(--color-lavender-soft)] text-[var(--color-plum)] hover:bg-[var(--color-lavender-soft)] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-[var(--color-plum)] line-clamp-1">{subject.title}</span>
      </div>

      {/* Hero Stats */}
      <div className="bg-[var(--color-card)]/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-3xl p-6 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-lavender-soft)] flex items-center justify-center text-3xl border border-[var(--color-lavender)] shrink-0">
          {subject.icon}
        </div>
        <div className="flex-1">
           <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-black text-[var(--color-plum)]">{progress.percentage}%</span>
              <span className="text-xs font-bold text-[var(--color-plum-light)]">{progress.completed}/{progress.total} Topics</span>
           </div>
           <ProgressBar percentage={progress.percentage} height="h-2" />
        </div>
      </div>

      {/* Chapters Accordion */}
      <div className="space-y-4">
        {subject.chapters.map((chapter) => {
          const isExpanded = expandedChapters.includes(chapter.id);
          const chapProgress = getChapterProgress(chapter.id);
          const isAllDone = chapProgress.percentage === 100;

          return (
            <div key={chapter.id} className="bg-[var(--color-card)] border border-[var(--color-lavender-soft)] rounded-2xl overflow-hidden shadow-sm">
              
              {/* Chapter Header (Clickable) */}
              <button 
                onClick={() => toggleChapter(chapter.id)}
                className="w-full px-5 py-4 flex items-center justify-between bg-transparent hover:bg-[var(--color-blush-soft)] transition-colors"
              >
                <div className="flex-1 text-left pr-4">
                  <h3 className={`font-bold text-sm ${isAllDone ? 'text-emerald-600 line-through opacity-70' : 'text-[var(--color-plum)]'}`}>
                    {chapter.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                     <div className="w-24">
                        <ProgressBar 
                           percentage={chapProgress.percentage} 
                           height="h-1" 
                           colorClass={isAllDone ? "bg-emerald-500" : "bg-[var(--color-plum)]"} 
                        />
                     </div>
                     <span className="text-[10px] font-bold text-[var(--color-plum-light)]">
                        {chapProgress.completed}/{chapProgress.total}
                     </span>
                  </div>
                </div>
                <div className="text-[var(--color-plum-light)]">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {/* Topics List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[var(--color-lavender-soft)] bg-[var(--background)]/50 overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      {chapter.topics.map((topic) => {
                        const isDone = completedTopics.includes(topic.id);
                        return (
                          <div 
                            key={topic.id}
                            onClick={(e) => handleToggleTopic(topic.id, e)}
                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${
                              isDone 
                                ? "bg-emerald-50 border border-emerald-100" 
                                : "hover:bg-[var(--color-card)] border border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                               <button className={`${isDone ? "text-emerald-500" : "text-[var(--color-lavender)]"}`}>
                                 {isDone ? <CheckCircle2 size={22} className="fill-emerald-100" /> : <Circle size={22} />}
                               </button>
                               <span className={`text-sm font-medium ${isDone ? "text-emerald-700 line-through opacity-70" : "text-[var(--color-plum)]"}`}>
                                 {topic.title}
                               </span>
                            </div>

                            {topic.notesAvailable && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/syllabus/${subject.id}/${topic.id}`);
                                }}
                                className="text-pink-400 p-1.5 rounded-lg hover:bg-pink-50 transition-colors flex items-center gap-1"
                                title="Read Notes"
                              >
                                <BookText size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Notes</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>

    </div>
  );
}
