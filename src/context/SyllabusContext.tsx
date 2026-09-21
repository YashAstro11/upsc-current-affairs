"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { syllabusData, SyllabusSubject } from "@/data/syllabus";

interface SyllabusContextType {
  completedTopics: string[];
  toggleTopicCompletion: (topicId: string) => void;
  getSubjectProgress: (subjectId: string) => { total: number; completed: number; percentage: number };
  getChapterProgress: (chapterId: string) => { total: number; completed: number; percentage: number };
}

const SyllabusContext = createContext<SyllabusContextType | undefined>(undefined);

export function SyllabusProvider({ children }: { children: ReactNode }) {
  const [completedTopics, setCompletedTopics] = useLocalStorage<string[]>("upsc_syllabus_completed", []);

  const toggleTopicCompletion = (topicId: string) => {
    setCompletedTopics((prev) => {
      if (prev.includes(topicId)) {
        return prev.filter((id) => id !== topicId);
      }
      return [...prev, topicId];
    });
  };

  const getSubjectProgress = (subjectId: string) => {
    const subject = syllabusData.find((s) => s.id === subjectId);
    if (!subject) return { total: 0, completed: 0, percentage: 0 };

    let total = 0;
    let completed = 0;

    subject.chapters.forEach((chapter) => {
      chapter.topics.forEach((topic) => {
        total++;
        if (completedTopics.includes(topic.id)) {
          completed++;
        }
      });
    });

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  const getChapterProgress = (chapterId: string) => {
    let chapter: any = null;
    syllabusData.forEach((subject) => {
      const found = subject.chapters.find((c) => c.id === chapterId);
      if (found) chapter = found;
    });

    if (!chapter) return { total: 0, completed: 0, percentage: 0 };

    const total = chapter.topics.length;
    const completed = chapter.topics.filter((t: any) => completedTopics.includes(t.id)).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, percentage };
  };

  return (
    <SyllabusContext.Provider
      value={{
        completedTopics,
        toggleTopicCompletion,
        getSubjectProgress,
        getChapterProgress,
      }}
    >
      {children}
    </SyllabusContext.Provider>
  );
}

export function useSyllabus() {
  const context = useContext(SyllabusContext);
  if (context === undefined) {
    throw new Error("useSyllabus must be used within a SyllabusProvider");
  }
  return context;
}
