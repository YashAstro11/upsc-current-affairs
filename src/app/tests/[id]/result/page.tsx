"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTest } from "@/context/TestContext";
import { sampleTests, TestQuestion } from "@/data/tests";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle, Trophy, Target, Clock } from "lucide-react";

export default function TestResultPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { activeState, endTestAndClear } = useTest();
  
  const testId = typeof params?.id === 'string' ? params.id : '';
  const test = sampleTests.find(t => t.id === testId);

  useEffect(() => {
    setMounted(true);
    // If there is no active state or the state is not submitted, redirect
    if (!activeState || activeState.status !== "submitted" || activeState.testId !== testId) {
      router.push(`/tests/${testId}`);
    }
  }, [activeState, testId, router]);

  if (!mounted || !test || !activeState || activeState.status !== "submitted") return <div className="min-h-screen" />;

  // Calculate Results
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  test.questions.forEach(q => {
    const ans = activeState.answers[q.id];
    if (ans === undefined) {
      unattemptedCount++;
    } else if (ans === q.correctAnswerIndex) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const rawScore = (correctCount * test.positiveMarks) - (incorrectCount * test.negativeMarks);
  const finalScore = Math.max(0, Number(rawScore.toFixed(2))); // Prevent negative total score for display if needed, but UPSC can be negative. Let's allow negative but format it.
  
  const accuracy = correctCount + incorrectCount > 0 
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
    : 0;

  const handleExit = () => {
    endTestAndClear();
    router.push("/tests");
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExit}
            className="bg-[var(--color-card)] p-2 rounded-full border border-[var(--color-lavender-soft)] text-[var(--color-plum)] hover:bg-[var(--color-lavender-soft)] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="font-bold text-[var(--color-plum)]">Test Report</span>
        </div>
      </div>

      {/* Scorecard Hero */}
      <div className="bg-[var(--color-card)]/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-3xl p-6 shadow-sm text-center relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
           <Trophy size={120} className="text-yellow-500" />
         </div>
         
         <h2 className="text-[var(--color-plum-light)] font-bold mb-2">{test.title}</h2>
         <div className="flex items-end justify-center gap-1 mb-2">
            <span className="text-5xl font-black text-[var(--color-plum)] tracking-tighter">{finalScore.toFixed(2)}</span>
            <span className="text-lg font-bold text-[var(--color-plum-light)] mb-1.5">/ {test.totalMarks}</span>
         </div>
         <p className="text-xs font-bold tracking-widest uppercase text-pink-400 bg-[var(--color-blush-soft)] px-3 py-1 rounded-full inline-block">
           Final Score
         </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-[var(--color-card)] p-4 rounded-3xl border border-[var(--color-lavender-soft)] flex flex-col items-center justify-center gap-2">
            <Target size={24} className="text-[var(--color-plum)]" />
            <div className="text-2xl font-bold text-[var(--color-plum)]">{accuracy}%</div>
            <div className="text-[10px] text-[var(--color-plum-light)] uppercase font-bold tracking-widest">Accuracy</div>
         </div>
         <div className="bg-[var(--color-card)] p-4 rounded-3xl border border-[var(--color-lavender-soft)] flex flex-col items-center justify-center gap-2">
            <Clock size={24} className="text-[var(--color-plum)]" />
            <div className="text-2xl font-bold text-[var(--color-plum)]">
               {Math.floor((test.durationMinutes * 60 - activeState.timeRemaining) / 60)}m
            </div>
            <div className="text-[10px] text-[var(--color-plum-light)] uppercase font-bold tracking-widest">Time Taken</div>
         </div>
      </div>

      {/* Breakdown */}
      <div className="bg-[var(--color-card)] border border-[var(--color-lavender-soft)] rounded-3xl p-4 flex justify-around">
         <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-emerald-500 mb-1">
               <CheckCircle2 size={16} /> <span className="font-bold">{correctCount}</span>
            </div>
            <span className="text-[10px] text-[var(--color-plum-light)] uppercase font-bold">Correct</span>
         </div>
         <div className="w-px bg-[var(--color-lavender-soft)]"></div>
         <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-rose-500 mb-1">
               <XCircle size={16} /> <span className="font-bold">{incorrectCount}</span>
            </div>
            <span className="text-[10px] text-[var(--color-plum-light)] uppercase font-bold">Incorrect</span>
         </div>
         <div className="w-px bg-[var(--color-lavender-soft)]"></div>
         <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-gray-400 mb-1">
               <MinusCircle size={16} /> <span className="font-bold">{unattemptedCount}</span>
            </div>
            <span className="text-[10px] text-[var(--color-plum-light)] uppercase font-bold">Skipped</span>
         </div>
      </div>

      {/* Detailed Solutions */}
      <div>
         <h3 className="text-xl font-bold text-[var(--color-plum)] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[var(--color-lavender)] rounded-full inline-block"></span>
            Detailed Solutions
         </h3>
         
         <div className="space-y-6">
            {test.questions.map((q, idx) => {
               const userAnswer = activeState.answers[q.id];
               const isCorrect = userAnswer === q.correctAnswerIndex;
               const isUnattempted = userAnswer === undefined;
               
               let statusColor = "bg-gray-100 border-gray-200 text-gray-500";
               let StatusIcon = MinusCircle;
               if (!isUnattempted) {
                  if (isCorrect) {
                     statusColor = "bg-emerald-50 border-emerald-200 text-emerald-600";
                     StatusIcon = CheckCircle2;
                  } else {
                     statusColor = "bg-rose-50 border-rose-200 text-rose-600";
                     StatusIcon = XCircle;
                  }
               }

               return (
                  <div key={q.id} className="bg-[var(--color-card)] border border-[var(--color-lavender-soft)] rounded-2xl overflow-hidden shadow-sm">
                     {/* Question Header */}
                     <div className={`px-4 py-2 border-b flex justify-between items-center ${statusColor}`}>
                        <div className="flex items-center gap-2 font-bold text-sm">
                           <StatusIcon size={16} />
                           Q. {idx + 1}
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">
                           {isUnattempted ? "Skipped" : (isCorrect ? `+${test.positiveMarks}` : `-${test.negativeMarks}`)}
                        </span>
                     </div>
                     
                     <div className="p-4">
                        <p className="text-[var(--color-plum)] font-medium text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                           {q.text}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                           {q.options.map((opt, optIdx) => {
                              const isCorrectOpt = optIdx === q.correctAnswerIndex;
                              const isSelectedOpt = optIdx === userAnswer;
                              
                              let optClass = "border-[var(--color-lavender-soft)] text-[var(--color-plum-light)] bg-[var(--background)]";
                              
                              if (isCorrectOpt) {
                                 optClass = "border-emerald-500/50 bg-emerald-50 text-emerald-700";
                              } else if (isSelectedOpt && !isCorrectOpt) {
                                 optClass = "border-rose-500/50 bg-rose-50 text-rose-700";
                              }

                              return (
                                 <div key={optIdx} className={`p-3 rounded-xl border text-sm flex gap-3 ${optClass}`}>
                                    <span className="font-bold opacity-70">{String.fromCharCode(65 + optIdx)}.</span>
                                    <span>{opt}</span>
                                    {isCorrectOpt && <CheckCircle2 size={16} className="ml-auto text-emerald-500" />}
                                    {isSelectedOpt && !isCorrectOpt && <XCircle size={16} className="ml-auto text-rose-500" />}
                                 </div>
                              );
                           })}
                        </div>
                        
                        <div className="bg-[var(--color-lavender-soft)]/50 p-4 rounded-xl">
                           <p className="text-xs font-bold text-pink-500 mb-1 uppercase tracking-wider">Explanation</p>
                           <p className="text-sm text-[var(--color-plum)] leading-relaxed">
                              {q.explanation}
                           </p>
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>

    </div>
  );
}
