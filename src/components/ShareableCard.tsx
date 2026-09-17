"use client";

import { useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { Flame, Star, Sparkles, Share, Download, Loader2 } from "lucide-react";
import { ProgressState } from "@/hooks/useProgress";

interface ShareableCardProps {
  progress: ProgressState;
  estimatedStudyTime: number;
  userName: string;
}

export function ShareableCard({ progress, estimatedStudyTime, userName }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const formatTime = (minutes: number) => {
    if (minutes <= 0) return "0m";
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const hasTrackedTime = (progress.trackedStudySeconds || 0) > 0;
  const trackedMinutes = Math.ceil((progress.trackedStudySeconds || 0) / 60);
  // If they have used the timer even for a few seconds today, use tracked time.
  const displayMinutes = hasTrackedTime ? trackedMinutes : estimatedStudyTime;

  const caCount = Math.min(progress.caRead.length, 10);
  const mcqCount = Math.min(progress.mcqsDone.length, 10);
  const revCount = Math.min(progress.revisionDone.length, 10);

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    return await toBlob(cardRef.current, {
      quality: 1,
      pixelRatio: 3,
      backgroundColor: '#2A1B24',
      style: {
        transform: 'scale(1)',
      }
    });
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const blob = await generateImage();
      if (!blob) throw new Error("Could not generate image");

      const file = new File([blob], "my-upsc-progress.png", { type: "image/png" });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My UPSC Progress 🎀",
          text: "Little progress every day ♡ #UPSC2027 #StudyAesthetics",
          files: [file],
        });
      } else {
        // Fallback to download if share is totally unsupported
        downloadBlob(blob);
      }
    } catch (err: any) {
      console.error("Error sharing:", err);
      if (err.name !== 'AbortError') {
        alert("Oops! Couldn't share the card right now.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = async () => {
    setIsSharing(true);
    try {
      const blob = await generateImage();
      if (!blob) throw new Error("Could not generate image");
      downloadBlob(blob);
    } catch (err) {
      console.error("Error downloading:", err);
      alert("Oops! Couldn't download the card.");
    } finally {
      setIsSharing(false);
    }
  };

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "upsc-progress-card.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTodayFormatted = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 mt-6 mb-4">
      {/* 
        This is the card that gets rendered to an image.
        We style it with inline hex colors matching the CSS variables 
        because html-to-image sometimes struggles with CSS variables if not computed correctly,
        although recent versions handle it fine. We use direct tailwind colors for safety.
      */}
      <div 
        ref={cardRef} 
        className="w-[320px] aspect-[4/5] bg-gradient-to-br from-[#4a2c40] to-[#2A1B24] rounded-[2rem] p-6 shadow-2xl border-4 border-[#7b4f69]/40 relative overflow-hidden flex flex-col justify-between"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_#7b4f69_0%,_transparent_60%)] opacity-30 pointer-events-none" />
        <div className="absolute -top-4 -right-4 text-6xl opacity-40 transform rotate-12 drop-shadow-lg pointer-events-none">🎀</div>
        <div className="absolute bottom-6 left-4 text-2xl opacity-60 pointer-events-none"><Sparkles className="text-pink-300" /></div>
        <div className="absolute top-1/2 right-4 text-2xl opacity-20 pointer-events-none"><Sparkles className="text-pink-300" /></div>
        
        {/* Header */}
        <div className="relative z-10 text-center space-y-1">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-pink-300/90">Daily Summary</p>
          <h3 className="text-2xl font-serif text-[#FDFBF7] font-bold tracking-tight">{getTodayFormatted()}</h3>
        </div>

        {/* Main Stats */}
        <div className="relative z-10 bg-[#382430]/60 backdrop-blur-md rounded-2xl p-5 border border-[#FDFBF7]/10 flex-1 my-5 flex flex-col justify-center gap-5 shadow-inner">
          <div className="text-center">
            <p className="text-[10px] font-bold text-[#d1b8c4] uppercase tracking-widest mb-1.5">Study Time</p>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-200 drop-shadow-sm">{formatTime(displayMinutes)}</p>
          </div>

          <div className="space-y-3.5 mt-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#FDFBF7] font-medium flex items-center gap-2"><Star size={14} className="text-pink-400 fill-pink-400/20" /> News Read</span>
              <span className="font-bold text-pink-100 bg-[#2A1B24] px-2.5 py-0.5 rounded-full border border-pink-400/30 shadow-sm">{caCount}/10</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#FDFBF7] font-medium flex items-center gap-2"><Star size={14} className="text-pink-400 fill-pink-400/20" /> MCQs Solved</span>
              <span className="font-bold text-pink-100 bg-[#2A1B24] px-2.5 py-0.5 rounded-full border border-pink-400/30 shadow-sm">{mcqCount}/10</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#FDFBF7] font-medium flex items-center gap-2"><Star size={14} className="text-pink-400 fill-pink-400/20" /> Flashcards</span>
              <span className="font-bold text-pink-100 bg-[#2A1B24] px-2.5 py-0.5 rounded-full border border-pink-400/30 shadow-sm">{revCount}/10</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[#FDFBF7] text-lg font-bold font-serif leading-tight">{userName}</span>
            <span className="text-[10px] text-pink-300/80 font-bold tracking-widest uppercase">UPSC 2027</span>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-b from-orange-500/20 to-orange-600/10 border border-orange-500/30 px-3.5 py-1.5 rounded-xl shadow-sm">
            <Flame size={18} className="text-orange-400 fill-orange-400/50 mb-0.5" />
            <span className="text-[11px] font-bold text-orange-200">{progress.streak} Day</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 w-[320px]">
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-3.5 rounded-2xl shadow-[0_4px_20px_rgba(244,114,182,0.3)] transition-all active:scale-[0.98] hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSharing ? <Loader2 size={18} className="animate-spin" /> : <Share size={18} />}
          Share 🎀
        </button>
        
        <button
          onClick={handleDownload}
          disabled={isSharing}
          className="flex-1 flex items-center justify-center gap-2 bg-[#382430] border border-[#7b4f69]/50 text-pink-300 font-bold py-3.5 rounded-2xl shadow-sm transition-all active:scale-[0.98] hover:bg-[#4a2c40] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          Save
        </button>
      </div>
    </div>
  );
}
