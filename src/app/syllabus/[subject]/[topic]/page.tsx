"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { notesData } from "@/data/notes";
import { syllabusData } from "@/data/syllabus";
import { useSyllabus } from "@/context/SyllabusContext";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";

export default function NotesPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { completedTopics, toggleTopicCompletion } = useSyllabus();

  const subjectId = typeof params?.subject === 'string' ? params.subject : '';
  const topicId = typeof params?.topic === 'string' ? params.topic : '';

  const note = notesData[topicId];
  
  // Find topic name from syllabus data if note doesn't exist, to show a fallback
  let topicName = "Topic";
  if (!note) {
     for (const s of syllabusData) {
        for (const c of s.chapters) {
           const t = c.topics.find(t => t.id === topicId);
           if (t) {
              topicName = t.title;
              break;
           }
        }
     }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen" />;

  const isDone = completedTopics.includes(topicId);

  const handleToggle = () => {
    import('@/utils/sounds').then(m => {
       if (!isDone) m.playSound('success');
       else m.playSound('pop');
    });
    toggleTopicCompletion(topicId);
    
    // Optional: Auto-navigate back after a short delay if they just marked it done
    if (!isDone) {
       setTimeout(() => {
          router.push(`/syllabus/${subjectId}`);
       }, 600);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col pb-24 animate-in fade-in duration-500 bg-[var(--color-card)]/30 rounded-3xl overflow-hidden border border-white/40 shadow-sm relative">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-[var(--color-card)]/90 backdrop-blur-md border-b border-[var(--color-lavender-soft)] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href={`/syllabus/${subjectId}`}
            className="bg-[var(--background)] p-2 rounded-full border border-[var(--color-lavender-soft)] text-[var(--color-plum)] hover:bg-[var(--color-lavender-soft)] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <span className="font-bold text-[var(--color-plum)] text-sm uppercase tracking-wider opacity-70">Study Notes</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full">
        {note ? (
           <>
             <h1 className="text-3xl font-serif font-bold text-[var(--color-plum)] mb-8 leading-tight">
               {note.title}
             </h1>
             
             {/* Render HTML content. Note: In a real app, sanitize this or use a safe Markdown renderer. Since we control the data, dangerouslySetInnerHTML is used here. */}
             <div 
               className="prose prose-pink max-w-none prose-headings:text-[var(--color-plum)] prose-headings:font-serif prose-p:text-[var(--color-plum-light)] prose-p:leading-relaxed prose-li:text-[var(--color-plum-light)] prose-strong:text-[var(--color-plum)]"
               dangerouslySetInnerHTML={{ __html: note.content }}
             />
           </>
        ) : (
           <div className="h-full flex flex-col items-center justify-center text-center py-20">
             <div className="w-20 h-20 bg-[var(--color-lavender-soft)] rounded-full flex items-center justify-center mb-6 border border-[var(--color-lavender)]">
                <span className="text-3xl">📝</span>
             </div>
             <h2 className="text-2xl font-bold text-[var(--color-plum)] mb-2">{topicName}</h2>
             <p className="text-[var(--color-plum-light)] max-w-sm">
                Notes for this topic are currently being prepared by our experts. Please check back later!
             </p>
           </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 md:bottom-6 left-0 right-0 flex justify-center px-4 pointer-events-none">
         <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-full shadow-lg border backdrop-blur-md transition-colors ${
               isDone 
                  ? "bg-emerald-50/90 border-emerald-200 text-emerald-600 hover:bg-emerald-100" 
                  : "bg-[var(--color-card)]/90 border-[var(--color-lavender)] text-[var(--color-plum)] hover:bg-[var(--color-lavender-soft)] shadow-pink-500/10"
            }`}
         >
            {isDone ? (
               <>
                  <CheckCircle2 size={24} className="fill-emerald-100" />
                  <span className="font-bold">Topic Completed</span>
               </>
            ) : (
               <>
                  <Circle size={24} className="opacity-50" />
                  <span className="font-bold">Mark as Complete</span>
               </>
            )}
         </motion.button>
      </div>

    </div>
  );
}
