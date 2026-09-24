"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Maximize2, Minimize2, Sparkles, BookOpen } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";

export function StudyTimer() {
  const { isRunning, todaySeconds, toggleTimer } = useTimer();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatTime = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
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
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1217] via-[#2A1B24] to-[#4a2c40] text-white"
    : "bg-gradient-to-br from-[#382430]/90 to-[#2A1B24]/90 backdrop-blur-md rounded-3xl p-6 border border-[#7b4f69]/40 shadow-[0_4px_30px_-5px_rgba(74,44,64,0.3)] relative overflow-hidden my-4 flex flex-col items-center justify-center min-h-[350px]";

  const textColor = "text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-200";

  return (
    <div className={containerClasses}>
      {/* Background glowing effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#7b4f69_0%,_transparent_60%)] opacity-30 pointer-events-none" />
      <div className="absolute top-10 left-10 text-xl opacity-20 pointer-events-none animate-pulse"><Sparkles className="text-pink-300" /></div>
      <div className="absolute bottom-10 right-10 text-2xl opacity-20 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}><Sparkles className="text-pink-300" /></div>

      {/* Fullscreen Toggle */}
      <button
        onClick={toggleFullscreen}
        className={`absolute top-6 right-6 p-2 rounded-full transition-colors z-20 ${
          isFullscreen ? "hover:bg-white/10 text-white/50 hover:text-white" : "hover:bg-[#7b4f69]/40 text-pink-300/70 hover:text-pink-200"
        }`}
      >
        {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
      </button>

      <div className="flex flex-col items-center justify-center relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-10 bg-[#2A1B24]/50 border border-pink-400/20 px-4 py-1.5 rounded-full shadow-inner">
          <BookOpen size={16} className="text-pink-400" />
          <h2 className="font-bold uppercase tracking-[0.2em] text-xs text-pink-300">
            Daily Study Tracker
          </h2>
        </div>

        {/* Massive Timer Display */}
        <div
          className={`font-mono font-bold tracking-tighter transition-all duration-500 ease-in-out select-none ${
            isFullscreen ? "text-[8rem] sm:text-[12rem] md:text-[16rem]" : "text-7xl sm:text-8xl"
          } ${textColor} drop-shadow-sm leading-none mb-12`}
        >
          {formatTime(todaySeconds)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          {/* Main Play/Pause Button */}
          <button
            onClick={toggleTimer}
            className={`px-12 h-16 rounded-full flex items-center justify-center gap-3 transition-all duration-300 active:scale-90 shadow-[0_4px_20px_rgba(244,114,182,0.3)] text-xl font-bold uppercase tracking-wider ${
              isRunning
                ? "bg-[#382430] border border-pink-400/30 text-pink-300 hover:bg-[#4a2c40] translate-y-[-2px]"
                : "bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:from-pink-600 hover:to-rose-500 translate-y-[-2px]"
            }`}
          >
            {isRunning ? (
              <>
                <Pause size={24} className="fill-current" /> Pause
              </>
            ) : (
              <>
                <Play size={24} className="fill-current" /> Start
              </>
            )}
          </button>
        </div>
        
        {/* Helper text */}
        <p className="mt-8 text-xs text-pink-300/50 font-medium tracking-wide">
          Your progress is automatically saved to your shareable card
        </p>
      </div>
    </div>
  );
}
