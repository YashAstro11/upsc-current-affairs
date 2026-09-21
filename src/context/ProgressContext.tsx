"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "./AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  trackedStudySeconds: number;
}

interface ProgressContextType {
  progress: ProgressState;
  markCaRead: (id: string) => void;
  markMcqDone: (id: string) => void;
  recordMcqAttempt: (category: string, isCorrect: boolean) => void;
  markRevisionDone: (id: string) => void;
  isRevisionDone: (id: string) => boolean;
  justHitGoal: boolean;
  getEstimatedStudyTime: () => number;
  addStudyTime: (seconds: number) => void;
}

const getTodayStr = () => new Date().toISOString().split("T")[0];
const getYesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

const defaultProgress: ProgressState = {
  caRead: [],
  mcqsDone: [],
  revisionDone: [],
  lastUpdated: getTodayStr(),
  streak: 0,
  lastGoalHitDate: "",
  mcqStats: {},
  trackedStudySeconds: 0,
};

export const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [progressState, setProgressState] = useLocalStorage<ProgressState>("upsc_progress", defaultProgress);
  const [justHitGoal, setJustHitGoal] = useState(false);
  const [isFirebaseLoaded, setIsFirebaseLoaded] = useState(false);

  const progress = {
    ...defaultProgress,
    ...progressState,
  };

  // 1. Sync FROM Firebase on Login
  useEffect(() => {
    async function syncFromFirebase() {
      if (!user) {
        setIsFirebaseLoaded(false);
        return;
      }
      
      try {
        const docRef = doc(db, "userProgress", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const remoteData = docSnap.data() as ProgressState;
          setProgressState(remoteData);
        } else {
          // If no remote data, upload local data to start tracking
          await setDoc(docRef, progressState);
        }
      } catch (error) {
        console.error("Error syncing progress from Firebase:", error);
      } finally {
        setIsFirebaseLoaded(true);
      }
    }
    
    syncFromFirebase();
  }, [user]);

  // 2. Sync TO Firebase on Local Change
  useEffect(() => {
    async function syncToFirebase() {
      if (!user || !isFirebaseLoaded) return;
      try {
        const docRef = doc(db, "userProgress", user.uid);
        await setDoc(docRef, progressState, { merge: true });
      } catch (error) {
        console.error("Error syncing progress to Firebase:", error);
      }
    }
    
    // Using a timeout to slightly debounce writes to Firebase
    const timeoutId = setTimeout(() => {
      syncToFirebase();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [progressState, user, isFirebaseLoaded]);

  // Reset progress if it's a new day
  if (progress.lastUpdated !== getTodayStr()) {
    setProgressState((prev) => ({
      ...prev,
      caRead: [],
      mcqsDone: [],
      revisionDone: [],
      lastUpdated: getTodayStr(),
      trackedStudySeconds: 0,
    }));
  }

  // Retroactively award streak if goal was met today but bug prevented it from saving
  useEffect(() => {
    if (progress.caRead.length >= 10 && progress.mcqsDone.length >= 10 && progress.revisionDone.length >= 10) {
      if (progress.lastGoalHitDate !== getTodayStr()) {
        const isYesterday = progress.lastGoalHitDate === getYesterdayStr();
        setProgressState((prev) => ({
          ...prev,
          streak: isYesterday ? (prev.streak || 0) + 1 : 1,
          lastGoalHitDate: getTodayStr(),
        }));
        setJustHitGoal(true);
        setTimeout(() => setJustHitGoal(false), 5000);
      }
    }
  }, [progress.caRead.length, progress.mcqsDone.length, progress.lastGoalHitDate, setProgressState]);

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
      setProgressState((prev) => {
        const next = { ...prev, caRead: [...prev.caRead, id] };
        return applyGoalCheck(next);
      });
    }
  };

  const markMcqDone = (id: string) => {
    if (!progress.mcqsDone.includes(id)) {
      setProgressState((prev) => {
        const next = { ...prev, mcqsDone: [...prev.mcqsDone, id] };
        return applyGoalCheck(next);
      });
    }
  };

  const markRevisionDone = (id: string) => {
    if (!progress.revisionDone.includes(id)) {
      setProgressState((prev) => {
        const next = { ...prev, revisionDone: [...prev.revisionDone, id] };
        return applyGoalCheck(next);
      });
    }
  };
  
  const isRevisionDone = (id: string) => progress.revisionDone.includes(id);

  const recordMcqAttempt = (category: string, isCorrect: boolean) => {
    setProgressState((prev) => {
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

  const getEstimatedStudyTime = () => {
    const caMinutes = progress.caRead.length * 5;
    const mcqMinutes = progress.mcqsDone.length * 2;
    const revisionMinutes = progress.revisionDone.length * 1;
    return caMinutes + mcqMinutes + revisionMinutes;
  };

  const addStudyTime = (seconds: number) => {
    setProgressState((prev) => ({
      ...prev,
      trackedStudySeconds: (prev.trackedStudySeconds || 0) + seconds
    }));
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markCaRead,
        markMcqDone,
        recordMcqAttempt,
        markRevisionDone,
        isRevisionDone,
        justHitGoal,
        getEstimatedStudyTime,
        addStudyTime
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
