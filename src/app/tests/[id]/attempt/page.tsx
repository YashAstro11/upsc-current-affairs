"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTest } from "@/context/TestContext";
import { TestQuestionView } from "@/components/TestQuestionView";
import { QuestionPalette } from "@/components/QuestionPalette";
import { Clock, LayoutGrid, CheckCircle2, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function TestAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const { activeTest, activeState, submitTest, setTimeRemaining } = useTest();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPalette, setShowPalette] = useState(false); // For mobile
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  useEffect(() => {
    if (!activeTest || !activeState || activeState.status !== "in-progress") {
      router.push("/tests");
    }
  }, [activeTest, activeState, router]);

  // Timer Effect
  useEffect(() => {
    if (!activeState || activeState.status !== "in-progress") return;

    const timer = setInterval(() => {
      if (activeState.timeRemaining <= 0) {
        clearInterval(timer);
        handleSubmit();
      } else {
        setTimeRemaining(activeState.timeRemaining - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeState?.timeRemaining, activeState?.status, setTimeRemaining]);

  if (!activeTest || !activeState || activeState.status !== "in-progress") {
    return <div className="min-h-screen" />;
  }

  const currentQuestion = activeTest.questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < activeTest.questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
    } else {
       // Last question save logic can just trigger submit confirmation
       setShowConfirmSubmit(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
    }
  };

  const handleNavigate = (index: number) => {
    import('@/utils/sounds').then(m => m.playSound('pop'));
    setCurrentIndex(index);
    setShowPalette(false);
  };

  const handleSubmit = () => {
    submitTest();
    router.replace(`/tests/${activeTest.id}/result`);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] pb-2">
      
      {/* Top Bar */}
      <div className="bg-[var(--color-card)]/80 backdrop-blur-md border-b border-[var(--color-lavender-soft)] px-4 py-3 flex items-center justify-between shadow-sm shrink-0 rounded-2xl mb-4">
        <button 
          onClick={() => setShowPalette(!showPalette)}
          className="md:hidden text-[var(--color-plum)] bg-[var(--color-lavender-soft)] p-2 rounded-xl"
        >
          <LayoutGrid size={20} />
        </button>
        
        <div className="hidden md:block font-bold text-[var(--color-plum)] truncate flex-1 pr-4">
          {activeTest.title}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-pink-50 text-pink-500 font-bold px-3 py-1.5 rounded-lg text-sm border border-pink-200">
            <Clock size={16} />
            <span className="tabular-nums">{formatTime(activeState.timeRemaining)}</span>
          </div>
          
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="bg-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden relative">
        {/* Main Area */}
        <div className="flex-1 bg-[var(--color-card)]/40 rounded-3xl p-4 md:p-6 border border-white/60 shadow-sm overflow-hidden flex flex-col">
          {currentQuestion ? (
             <TestQuestionView
                question={currentQuestion}
                index={currentIndex}
                total={activeTest.questions.length}
                onNext={handleNext}
                onPrev={handlePrev}
             />
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--color-plum-light)]">
               Question data missing.
            </div>
          )}
        </div>

        {/* Sidebar (Desktop) */}
        <div className="hidden md:block w-72 shrink-0">
          <QuestionPalette 
            questions={activeTest.questions} 
            currentQuestionIndex={currentIndex}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Mobile Palette Drawer */}
        <AnimatePresence>
          {showPalette && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-0 z-10 md:hidden bg-[var(--background)] p-4 flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-[var(--color-plum)]">Question Palette</h2>
                <button onClick={() => setShowPalette(false)} className="text-[var(--color-plum-light)] p-2 bg-[var(--color-card)] rounded-full">✕</button>
              </div>
              <div className="flex-1 overflow-hidden">
                <QuestionPalette 
                  questions={activeTest.questions} 
                  currentQuestionIndex={currentIndex}
                  onNavigate={handleNavigate}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--background)] rounded-3xl p-6 shadow-xl max-w-sm w-full border border-[var(--color-lavender-soft)]"
            >
              <div className="bg-orange-100 text-orange-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                 <AlertCircle size={24} />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-plum)] mb-2">Submit Test?</h2>
              <p className="text-[var(--color-plum-light)] text-sm mb-6">
                Are you sure you want to submit the test? You will not be able to change your answers after submission.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--color-card)] p-3 rounded-xl border border-[var(--color-lavender)] text-center">
                   <div className="text-xl font-bold text-[var(--color-plum)]">{Object.keys(activeState.answers).length}</div>
                   <div className="text-[10px] text-[var(--color-plum-light)] uppercase font-bold tracking-wider">Answered</div>
                </div>
                <div className="bg-[var(--color-card)] p-3 rounded-xl border border-[var(--color-lavender)] text-center">
                   <div className="text-xl font-bold text-[var(--color-plum)]">{activeTest.questions.length - Object.keys(activeState.answers).length}</div>
                   <div className="text-[10px] text-[var(--color-plum-light)] uppercase font-bold tracking-wider">Unanswered</div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 bg-[var(--color-card)] border border-[var(--color-lavender)] text-[var(--color-plum)] py-3 rounded-xl font-bold hover:bg-[var(--color-lavender-soft)] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
