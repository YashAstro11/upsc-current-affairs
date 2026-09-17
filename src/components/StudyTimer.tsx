"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Save, Clock, Sparkles } from "lucide-react";

interface StudyTimerProps {
  trackedStudySeconds: number;
  addStudyTime: (seconds: number) => void;
}

export function StudyTimer({ trackedStudySeconds, addStudyTime }: StudyTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Automatically save every 60 seconds to prevent data loss if tab is closed
  useEffect(() => {
    if (isRunning && sessionSeconds > 0 && sessionSeconds % 60 === 0) {
      addStudyTime(60);
      setSessionSeconds(0);
    }
  }, [sessionSeconds, isRunning, addStudyTime]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const toggleTimer = () => {
    if (isRunning) {
      // Pause
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      // Start
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
      import('@/utils/sounds').then(({ playSound }) => playSound('pop'));
    }
  };

  const handleSave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    if (sessionSeconds > 0) {
      addStudyTime(sessionSeconds);
      setSessionSeconds(0);
    }
    import('@/utils/sounds').then(({ playSound }) => playSound('success'));
  };

  const totalSeconds = trackedStudySeconds + sessionSeconds;
  
  const formatTime = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[var(--color-card)]/80 backdrop-blur-md rounded-3xl p-6 border border-pink-200/30 shadow-[0_4px_20px_-10px_rgba(74,44,64,0.15)] relative overflow-hidden my-4">
      {/* Decorative */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full blur-3xl transition-opacity duration-1000 ${isRunning ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
      
      <div className="flex flex-col items-center justify-center relative z-10">
        <div className="flex items-center gap-2 mb-2 text-pink-400 font-bold uppercase tracking-widest text-xs">
          <Clock size={16} />
          <span>Focus Time</span>
          {isRunning && <Sparkles size={14} className="text-orange-400 animate-pulse" />}
        </div>
        
        <div className="font-mono text-6xl font-bold text-[var(--color-plum)] my-4 tracking-tighter drop-shadow-sm">
          {formatTime(totalSeconds)}
        </div>
        
        <p className="text-xs text-[var(--color-plum-light)] font-medium mb-6">
          {isRunning ? "Deep work in progress..." : "Ready to focus on UPSC?"}
        </p>

        <div className="flex gap-6">
          <button
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 ${
              isRunning 
                ? "bg-orange-100 text-orange-600 hover:bg-orange-200" 
                : "bg-pink-100 text-pink-600 hover:bg-pink-200"
            }`}
          >
            {isRunning ? <Pause size={28} className="fill-orange-600" /> : <Play size={28} className="fill-pink-600 ml-1.5" />}
          </button>
          
          <button
            onClick={handleSave}
            disabled={sessionSeconds === 0 && !isRunning}
            className="w-16 h-16 rounded-full bg-[var(--color-lavender-soft)] text-[var(--color-plum)] flex items-center justify-center transition-all hover:bg-[var(--color-lavender)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm"
          >
            <Save size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
