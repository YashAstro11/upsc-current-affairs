"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CsatTopicId } from '@/data/csat';

interface CsatAttempt {
  questionId: string;
  topicId: CsatTopicId;
  isCorrect: boolean;
  timestamp: number;
}

interface CsatContextType {
  attempts: CsatAttempt[];
  recordAttempt: (questionId: string, topicId: CsatTopicId, isCorrect: boolean) => void;
  getTopicProgress: (topicId: CsatTopicId) => { attempted: number; correct: number; accuracy: number };
  getOverallProgress: () => { attempted: number; correct: number; accuracy: number };
}

const CsatContext = createContext<CsatContextType | undefined>(undefined);

export function CsatProvider({ children }: { children: ReactNode }) {
  const [attempts, setAttempts] = useState<CsatAttempt[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('upsc_csat_progress');
      if (stored) {
        setAttempts(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load CSAT progress", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('upsc_csat_progress', JSON.stringify(attempts));
    }
  }, [attempts, isInitialized]);

  const recordAttempt = (questionId: string, topicId: CsatTopicId, isCorrect: boolean) => {
    setAttempts(prev => [
      ...prev,
      { questionId, topicId, isCorrect, timestamp: Date.now() }
    ]);
  };

  const getTopicProgress = (topicId: CsatTopicId) => {
    const topicAttempts = attempts.filter(a => a.topicId === topicId);
    const correct = topicAttempts.filter(a => a.isCorrect).length;
    const attempted = topicAttempts.length;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    
    return { attempted, correct, accuracy };
  };

  const getOverallProgress = () => {
    const correct = attempts.filter(a => a.isCorrect).length;
    const attempted = attempts.length;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    
    return { attempted, correct, accuracy };
  };

  return (
    <CsatContext.Provider value={{
      attempts,
      recordAttempt,
      getTopicProgress,
      getOverallProgress
    }}>
      {children}
    </CsatContext.Provider>
  );
}

export function useCsat() {
  const context = useContext(CsatContext);
  if (context === undefined) {
    throw new Error('useCsat must be used within a CsatProvider');
  }
  return context;
}
