"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { sampleTests } from "@/data/tests";
import { useTest } from "@/context/TestContext";
import { ArrowLeft, Clock, FileText, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function TestInstructionPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { startTest, activeState, endTestAndClear } = useTest();
  
  const testId = typeof params?.id === 'string' ? params.id : '';
  const test = sampleTests.find(t => t.id === testId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !test) return <div className="min-h-screen" />;

  const hasActiveSessionForThisTest = activeState?.testId === testId && activeState.status === "in-progress";
  const hasActiveSessionForOtherTest = activeState?.testId && activeState.testId !== testId && activeState.status === "in-progress";

  const handleStart = () => {
    import('@/utils/sounds').then(m => m.playSound('pop'));
    if (!hasActiveSessionForThisTest) {
       startTest(test.id);
    }
    router.push(`/tests/${test.id}/attempt`);
  };
  
  const handleStartFresh = () => {
     import('@/utils/sounds').then(m => m.playSound('pop'));
     endTestAndClear(); // clear any old test state
     startTest(test.id);
     router.push(`/tests/${test.id}/attempt`);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Top Bar */}
      <div className="flex items-center gap-4">
        <Link 
          href="/tests"
          onClick={() => import('@/utils/sounds').then(m => m.playSound('pop'))}
          className="bg-[var(--color-card)] p-2 rounded-full border border-[var(--color-lavender-soft)] text-[var(--color-plum)] hover:bg-[var(--color-lavender-soft)] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-[var(--color-plum)]">Test Details</span>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-blush)] rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
          <FileText size={80} className="text-white" />
        </div>
        
        <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-plum)] bg-white/40 px-2 py-1 rounded-md mb-4 inline-block">
          {test.type} {test.year && `• ${test.year}`}
        </span>
        
        <h1 className="text-2xl font-bold text-[var(--color-plum)] mb-4">{test.title}</h1>
        
        <div className="flex flex-wrap gap-4 text-sm font-medium text-[var(--color-plum)]/80 bg-white/30 p-3 rounded-2xl w-fit backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <FileText size={16} />
            {test.totalQuestions} Questions
          </div>
          <div className="w-px h-4 bg-[var(--color-plum)]/20"></div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            {test.durationMinutes} Mins
          </div>
        </div>
      </div>
      
      {/* Status Warning */}
      {hasActiveSessionForOtherTest && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 flex gap-3 text-sm text-orange-700">
           <AlertTriangle size={20} className="shrink-0 mt-0.5" />
           <p>You have an ongoing session for another test. Starting this test will discard your previous progress.</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-[var(--color-card)]/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--color-plum)] mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-pink-400" />
          Instructions
        </h2>
        
        <ul className="space-y-4 text-sm text-[var(--color-plum-light)]">
          <li className="flex gap-3">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>The test contains <strong>{test.totalQuestions} questions</strong> and total marks are <strong>{test.totalMarks}</strong>.</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>You will be awarded <strong>+{test.positiveMarks} marks</strong> for each correct answer.</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>There is a negative marking of <strong>-{test.negativeMarks} marks</strong> for each incorrect answer.</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>No marks will be deducted for unattempted questions.</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>The test will automatically submit when the timer ends ({test.durationMinutes} minutes).</span>
          </li>
        </ul>
      </div>

      {/* Start Button */}
      <div className="pt-4">
        {hasActiveSessionForThisTest ? (
           <div className="flex gap-3">
             <button
                onClick={handleStartFresh}
                className="w-1/3 bg-[var(--color-card)] border-2 border-pink-400 text-pink-500 py-4 rounded-2xl font-bold tracking-wide transition-all hover:bg-pink-50 active:scale-[0.98]"
              >
                Restart
             </button>
             <button
              onClick={handleStart}
              className="w-2/3 bg-gradient-to-r from-pink-400 to-purple-400 text-white py-4 rounded-2xl font-bold tracking-wide shadow-lg shadow-pink-200 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Resume Test
            </button>
           </div>
        ) : (
          <button
            onClick={handleStartFresh}
            disabled={test.questions.length === 0}
            className="w-full bg-gradient-to-r from-[var(--color-lavender)] to-[var(--color-blush)] text-[var(--color-plum)] py-4 rounded-2xl font-bold tracking-wide shadow-lg shadow-[var(--color-lavender-soft)] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
          >
            {test.questions.length === 0 ? "Test Coming Soon" : "Start Test"}
          </button>
        )}
      </div>

    </div>
  );
}
