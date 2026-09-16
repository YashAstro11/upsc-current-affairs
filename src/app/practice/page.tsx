"use client";

import { useState } from "react";
import { mcqsData as staticMcqs } from "@/data/mcqs";
import { McqPractice } from "@/components/McqPractice";
import { useProgress } from "@/hooks/useProgress";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import { Play, RotateCcw, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PracticePage() {
  const { progress, markMcqDone, recordMcqAttempt } = useProgress();
  const { mcqs } = useFirebaseData();
  const [filter, setFilter] = useState("All");
  
  // Quiz State
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [quizQueue, setQuizQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });

  const dataSource = mcqs.length > 0 ? mcqs : staticMcqs;
  const categories = ["All", ...Array.from(new Set(staticMcqs.map(item => item.category)))];
  const filteredData = filter === "All" ? dataSource : dataSource.filter(item => item.category === filter);

  const startQuiz = () => {
    // Only queue questions that haven't been done yet
    const pendingQuestions = filteredData.filter(item => !progress.mcqsDone.includes(item.id));
    setQuizQueue(pendingQuestions.length > 0 ? pendingQuestions : filteredData); // fallback to all if completed
    setCurrentIndex(0);
    setSessionScore({ correct: 0, total: 0 });
    setIsQuizStarted(true);
  };

  const handleComplete = (id: string, isCorrect: boolean, category: string) => {
    markMcqDone(id);
    recordMcqAttempt(category, isCorrect);
    setSessionScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNext = () => {
    if (currentIndex < quizQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Quiz finished
      setCurrentIndex(quizQueue.length); 
    }
  };

  const resetQuiz = () => {
    setIsQuizStarted(false);
    setQuizQueue([]);
    setCurrentIndex(0);
  };

  const pendingCount = filteredData.filter(item => !progress.mcqsDone.includes(item.id)).length;
  const isFinished = isQuizStarted && currentIndex >= quizQueue.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-plum)] mb-2">Practice MCQs</h1>
          <p className="text-sm text-[var(--color-plum-light)]">Test your knowledge with daily questions.</p>
        </div>
        
        {!isQuizStarted && (
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[var(--color-card)] border-2 border-[var(--color-lavender-soft)] text-[var(--color-plum)] rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-pink-300"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </header>

      <AnimatePresence mode="wait">
        {!isQuizStarted ? (
          <motion.div 
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[var(--color-card)] border border-[var(--color-lavender-soft)] rounded-3xl p-8 text-center shadow-lg"
          >
            <div className="w-20 h-20 bg-[var(--color-blush-soft)] rounded-full flex items-center justify-center mx-auto mb-6 text-pink-400">
              <Play fill="currentColor" size={32} className="ml-2" />
            </div>
            
            <h2 className="text-2xl font-bold text-[var(--color-plum)] mb-2">Ready to test yourself?</h2>
            <p className="text-[var(--color-plum-light)] mb-8 max-w-md mx-auto">
              Focus mode active. You'll see one question at a time. Take your time to read the explanations!
            </p>
            
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <button 
                onClick={startQuiz}
                className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(244,114,182,0.3)] hover:shadow-[0_0_30px_rgba(244,114,182,0.5)] hover:-translate-y-1 transition-all active:scale-95"
              >
                Start Quiz ({pendingCount > 0 ? pendingCount : filteredData.length} Questions)
              </button>
            </div>
          </motion.div>
        ) : isFinished ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-card)] border border-[var(--color-lavender-soft)] rounded-3xl p-8 text-center shadow-lg"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-pink-500/20">
              <Trophy size={40} />
            </div>
            
            <h2 className="text-3xl font-bold text-[var(--color-plum)] mb-2">Quiz Completed!</h2>
            <p className="text-[var(--color-plum-light)] mb-6">Here is how you did today ♡</p>
            
            <div className="bg-[var(--color-blush-soft)] rounded-2xl p-6 mb-8 max-w-sm mx-auto">
              <div className="text-5xl font-black text-pink-500 mb-2">
                {sessionScore.correct} <span className="text-2xl text-pink-400/60">/ {sessionScore.total}</span>
              </div>
              <p className="text-sm font-bold tracking-widest uppercase text-pink-400">
                Correct Answers
              </p>
            </div>
            
            <button 
              onClick={resetQuiz}
              className="px-8 py-3 rounded-xl border-2 border-[var(--color-lavender-soft)] text-[var(--color-plum)] font-bold flex items-center justify-center gap-2 mx-auto hover:bg-[var(--color-lavender-soft)] transition-colors"
            >
              <RotateCcw size={18} /> Back to Start
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2 px-1">
                <span className="text-sm font-bold text-pink-400 tracking-widest uppercase">
                  Question {currentIndex + 1}
                </span>
                <span className="text-sm font-bold text-[var(--color-plum)]">
                  {currentIndex + 1} / {quizQueue.length}
                </span>
              </div>
              <div className="h-2.5 w-full bg-[var(--color-blush-soft)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${((currentIndex) / quizQueue.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Single Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={quizQueue[currentIndex].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <McqPractice 
                  data={quizQueue[currentIndex]} 
                  onComplete={(id, isCorrect) => handleComplete(id, isCorrect, quizQueue[currentIndex].category)}
                  onNext={handleNext}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
