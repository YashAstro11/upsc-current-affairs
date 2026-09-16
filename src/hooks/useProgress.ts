import { useLocalStorage } from "./useLocalStorage";
import { useState, useEffect } from "react";

export interface ProgressState {
  caRead: string[];
  mcqsDone: string[];
  revisionDone: string[];
  lastUpdated: string;
  streak: number;
  lastGoalHitDate: string;
  mcqStats: {
    [category: string]: { correct: number; total: number };
  };
}

export function useProgress() {
  const getTodayStr = () => new Date().toISOString().split("T")[0];
  
  const getYesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const [progressState, setProgress] = useLocalStorage<ProgressState>("upsc_progress", {
    caRead: [],
    mcqsDone: [],
    revisionDone: [],
    lastUpdated: getTodayStr(),
    streak: 0,
    lastGoalHitDate: "",
    mcqStats: {},
  });
  
  // Provide fallbacks for users with older localStorage schemas
  const progress = {
    ...progressState,
    streak: progressState.streak || 0,
    lastGoalHitDate: progressState.lastGoalHitDate || "",
    mcqStats: progressState.mcqStats || {},
  };

  const [justHitGoal, setJustHitGoal] = useState(false);

  // Reset progress if it's a new day
  if (progress.lastUpdated !== getTodayStr()) {
    setProgress((prev) => ({
      ...prev,
      caRead: [],
      mcqsDone: [],
      revisionDone: [],
      lastUpdated: getTodayStr(),
    }));
  }

  // Retroactively award streak if goal was met today but bug prevented it from saving
  useEffect(() => {
    if (progress.caRead.length >= 10 && progress.mcqsDone.length >= 10 && progress.revisionDone.length >= 10) {
      if (progress.lastGoalHitDate !== getTodayStr()) {
        const isYesterday = progress.lastGoalHitDate === getYesterdayStr();
        setProgress((prev) => ({
          ...prev,
          streak: isYesterday ? (prev.streak || 0) + 1 : 1,
          lastGoalHitDate: getTodayStr(),
        }));
        setJustHitGoal(true);
        setTimeout(() => setJustHitGoal(false), 5000);
      }
    }
  }, [progress.caRead.length, progress.mcqsDone.length, progress.lastGoalHitDate, setProgress]);

  // Pure function to calculate new streak state based on incoming state
  const applyGoalCheck = (state: ProgressState): ProgressState => {
    if (state.caRead.length >= 10 && state.mcqsDone.length >= 10 && state.revisionDone.length >= 10) {
      if (state.lastGoalHitDate !== getTodayStr()) {
        const isYesterday = state.lastGoalHitDate === getYesterdayStr();
        const newStreak = isYesterday ? (state.streak || 0) + 1 : 1;
        
        setJustHitGoal(true);
        setTimeout(() => setJustHitGoal(false), 5000);
        
        return {
          ...state,
          streak: newStreak,
          lastGoalHitDate: getTodayStr(),
        };
      }
    }
    return state;
  };

  const markCaRead = (id: string) => {
    if (!progress.caRead.includes(id)) {
      setProgress((prev) => {
        const next = { ...prev, caRead: [...prev.caRead, id] };
        return applyGoalCheck(next);
      });
    }
  };

  const markMcqDone = (id: string) => {
    if (!progress.mcqsDone.includes(id)) {
      setProgress((prev) => {
        const next = { ...prev, mcqsDone: [...prev.mcqsDone, id] };
        return applyGoalCheck(next);
      });
    }
  };

  const markRevisionDone = (id: string) => {
    if (!progress.revisionDone.includes(id)) {
      setProgress((prev) => {
        const next = { ...prev, revisionDone: [...prev.revisionDone, id] };
        return applyGoalCheck(next);
      });
    }
  };
  
  const isRevisionDone = (id: string) => progress.revisionDone.includes(id);

  const recordMcqAttempt = (category: string, isCorrect: boolean) => {
    setProgress((prev) => {
      const currentStats = prev.mcqStats || {};
      const catStats = currentStats[category] || { correct: 0, total: 0 };
      
      return {
        ...prev,
        mcqStats: {
          ...currentStats,
          [category]: {
            correct: catStats.correct + (isCorrect ? 1 : 0),
            total: catStats.total + 1,
          }
        }
      };
    });
  };

  return { 
    progress, 
    markCaRead, 
    markMcqDone, 
    recordMcqAttempt,
    markRevisionDone, 
    isRevisionDone,
    justHitGoal
  };
}
