"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useProgress } from "@/hooks/useProgress";

export interface TimerContextType {
  isRunning: boolean;
  todaySeconds: number;
  toggleTimer: () => void;
}

export const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const { addStudyTime, progress } = useProgress();
  const [isRunning, setIsRunning] = useState(false);
  
  // Track seconds that haven't been saved to ProgressContext yet
  const [uncommittedSeconds, setUncommittedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setUncommittedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Commit every 60 seconds to prevent data loss while keeping re-renders low
  useEffect(() => {
    if (uncommittedSeconds >= 60) {
      // Use exactly 60 in case it somehow jumped over 60, we leave the remainder in uncommitted
      addStudyTime(60);
      setUncommittedSeconds((prev) => prev - 60);
    }
  }, [uncommittedSeconds, addStudyTime]);

  const toggleTimer = () => {
    if (isRunning) {
      // Pause: commit remaining seconds
      if (uncommittedSeconds > 0) {
        addStudyTime(uncommittedSeconds);
        setUncommittedSeconds(0);
      }
      // Play a sound when paused
      import('@/utils/sounds').then(({ playSound }) => playSound('pop'));
    } else {
      // Play a sound when started
      import('@/utils/sounds').then(({ playSound }) => playSound('pop'));
    }
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (uncommittedSeconds > 0) {
        addStudyTime(uncommittedSeconds);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [uncommittedSeconds, addStudyTime]);

  const todaySeconds = (progress.trackedStudySeconds || 0) + uncommittedSeconds;

  return (
    <TimerContext.Provider value={{ isRunning, todaySeconds, toggleTimer }}>
      {children}
    </TimerContext.Provider>
  );
}
