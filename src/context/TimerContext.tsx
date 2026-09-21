"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useProgress } from "@/hooks/useProgress";

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

export const MODE_DURATIONS = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
}

export interface TimerContextType {
  activeTab: TimerMode;
  timers: Record<TimerMode, TimerState>;
  changeTab: (newTab: TimerMode) => void;
  toggleTimer: () => void;
  handleReset: () => void;
}

export const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const { addStudyTime } = useProgress();

  const [activeTab, setActiveTab] = useState<TimerMode>("pomodoro");
  const [timers, setTimers] = useState<Record<TimerMode, TimerState>>({
    pomodoro: { timeLeft: MODE_DURATIONS.pomodoro, isRunning: false },
    shortBreak: { timeLeft: MODE_DURATIONS.shortBreak, isRunning: false },
    longBreak: { timeLeft: MODE_DURATIONS.longBreak, isRunning: false },
  });
  
  // Track seconds for saving pomodoro time
  const [unrecordedStudySeconds, setUnrecordedStudySeconds] = useState(0);

  // Automatically save every 60 seconds to prevent data loss if tab is closed
  useEffect(() => {
    const isPomodoroRunning = timers.pomodoro.isRunning;
    if (isPomodoroRunning && unrecordedStudySeconds > 0 && unrecordedStudySeconds % 60 === 0) {
      addStudyTime(60);
      setUnrecordedStudySeconds(0);
    }
  }, [unrecordedStudySeconds, timers.pomodoro.isRunning, addStudyTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        let playSoundForSuccess = false;
        let saveTime = false;
        
        const next = { ...prev };
        let pomodoroTicked = false;

        (Object.keys(next) as TimerMode[]).forEach((mode) => {
          if (next[mode].isRunning && next[mode].timeLeft > 0) {
            next[mode] = { ...next[mode], timeLeft: next[mode].timeLeft - 1 };
            if (mode === "pomodoro") {
              pomodoroTicked = true;
            }
            if (next[mode].timeLeft === 0) {
              next[mode].isRunning = false;
              playSoundForSuccess = true;
              if (mode === "pomodoro") {
                saveTime = true;
              }
            }
          }
        });

        if (pomodoroTicked) {
          setUnrecordedStudySeconds((prevSec) => prevSec + 1);
        }

        if (playSoundForSuccess) {
          import('@/utils/sounds').then(({ playSound }) => playSound('success'));
        }

        if (saveTime) {
          setUnrecordedStudySeconds((currentUnrecorded) => {
            if (currentUnrecorded > 0) {
              setTimeout(() => addStudyTime(currentUnrecorded), 0);
              return 0;
            }
            return currentUnrecorded;
          });
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [addStudyTime]);

  const toggleTimer = () => {
    const currentlyRunning = timers[activeTab].isRunning;
    if (!currentlyRunning) {
      import('@/utils/sounds').then(({ playSound }) => playSound('pop'));
    }
    setTimers((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        isRunning: !currentlyRunning,
      }
    }));
  };

  const handleReset = () => {
    setTimers((prev) => ({
      ...prev,
      [activeTab]: {
        timeLeft: MODE_DURATIONS[activeTab],
        isRunning: false,
      }
    }));
    
    if (activeTab === "pomodoro") {
      setUnrecordedStudySeconds((current) => {
        if (current > 0) {
          addStudyTime(current);
        }
        return 0;
      });
    }
  };

  const changeTab = (newTab: TimerMode) => {
    setActiveTab(newTab);
  };

  return (
    <TimerContext.Provider value={{ activeTab, timers, changeTab, toggleTimer, handleReset }}>
      {children}
    </TimerContext.Provider>
  );
}
