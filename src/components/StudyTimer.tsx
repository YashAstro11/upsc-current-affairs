"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Brain } from "lucide-react";
import { useTimer, TimerMode } from "@/hooks/useTimer";

export function StudyTimer() {
  const { activeTab, timers, changeTab, toggleTimer, handleReset } = useTimer();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] text-white"
    : "bg-[var(--color-card)]/80 backdrop-blur-sm rounded-3xl p-6 border border-[var(--color-lavender-soft)] shadow-[0_4px_20px_-10px_rgba(74,44,64,0.08)] relative overflow-hidden my-4 flex flex-col items-center justify-center min-h-[350px]";

  const textColor = isFullscreen ? "text-white" : "text-[var(--color-foreground)]";

  const activeTimerState = timers[activeTab];

  return (
    <div className={containerClasses}>
      {/* Fullscreen Toggle */}
      <button
        onClick={toggleFullscreen}
        className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${
          isFullscreen ? "hover:bg-white/10 text-white/50 hover:text-white" : "hover:bg-[var(--color-lavender-soft)] text-[var(--color-plum-light)] hover:text-[var(--color-plum)]"
        }`}
      >
        {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
      </button>

      <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Brain size={20} className={isFullscreen ? "text-white/50" : "text-[var(--color-plum-light)]"} />
          <h2 className={`font-bold uppercase tracking-widest text-sm ${isFullscreen ? "text-white/50" : "text-pink-400"}`}>
            Focus Session
          </h2>
        </div>

        {/* Mode Selector */}
        <div className={`flex items-center gap-2 mb-8 p-1.5 rounded-full ${isFullscreen ? "bg-white/10" : "bg-[var(--color-lavender-soft)] shadow-inner"}`}>
          <button
            onClick={() => changeTab("pomodoro")}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 relative ${
              activeTab === "pomodoro"
                ? isFullscreen
                  ? "bg-white text-black"
                  : "bg-[var(--color-card)] text-[var(--color-plum)] shadow-sm translate-y-[-2px]"
                : isFullscreen
                ? "text-white/70 hover:text-white"
                : "text-[var(--color-plum-light)] hover:text-[var(--color-plum)]"
            }`}
          >
            Pomodoro
            {timers.pomodoro.isRunning && activeTab !== "pomodoro" && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse shadow-sm"></span>
            )}
          </button>
          <button
            onClick={() => changeTab("shortBreak")}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 relative ${
              activeTab === "shortBreak"
                ? isFullscreen
                  ? "bg-white text-black"
                  : "bg-[var(--color-card)] text-blue-400 shadow-sm translate-y-[-2px]"
                : isFullscreen
                ? "text-white/70 hover:text-white"
                : "text-[var(--color-plum-light)] hover:text-blue-400"
            }`}
          >
            Short Break
            {timers.shortBreak.isRunning && activeTab !== "shortBreak" && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-sm"></span>
            )}
          </button>
          <button
            onClick={() => changeTab("longBreak")}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 relative ${
              activeTab === "longBreak"
                ? isFullscreen
                  ? "bg-white text-black"
                  : "bg-[var(--color-card)] text-purple-400 shadow-sm translate-y-[-2px]"
                : isFullscreen
                ? "text-white/70 hover:text-white"
                : "text-[var(--color-plum-light)] hover:text-purple-400"
            }`}
          >
            Long Break
            {timers.longBreak.isRunning && activeTab !== "longBreak" && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-sm"></span>
            )}
          </button>
        </div>

        {/* Massive Timer Display */}
        <div
          className={`font-mono font-bold tracking-tighter transition-all duration-500 ease-in-out select-none ${
            isFullscreen ? "text-[8rem] sm:text-[12rem] md:text-[16rem]" : "text-7xl sm:text-8xl"
          } ${textColor} drop-shadow-sm leading-none mb-12`}
        >
          {formatTime(activeTimerState.timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          {/* Main Play/Pause Button */}
          <button
            onClick={toggleTimer}
            className={`px-12 h-16 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-lg text-xl font-bold uppercase tracking-wider ${
              isFullscreen
                ? activeTimerState.isRunning
                  ? "bg-white/20 text-white hover:bg-white/30"
                  : "bg-white text-black hover:bg-gray-200"
                : activeTimerState.isRunning
                ? "bg-orange-900/30 text-orange-400 hover:bg-orange-900/40 shadow-orange-500/10 translate-y-[-2px]"
                : "bg-gradient-to-r from-pink-400 to-rose-400 text-white hover:from-pink-500 hover:to-rose-500 shadow-pink-500/30 translate-y-[-2px]"
            }`}
          >
            {activeTimerState.isRunning ? "Pause" : "Start"}
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
              isFullscreen 
              ? "bg-white/10 text-white hover:bg-white/20" 
              : "bg-[var(--color-lavender-soft)] text-[var(--color-plum-light)] hover:bg-[var(--color-lavender)] hover:text-[var(--color-plum)] hover:shadow-sm"
            }`}
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
