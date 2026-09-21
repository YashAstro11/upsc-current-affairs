"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { sampleTests, Test } from "@/data/tests";
import { ClipboardList, Clock, FileText, Filter, CheckCircle2 } from "lucide-react";
import { useTest } from "@/context/TestContext";

export default function TestsPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"All" | "GS" | "CSAT" | "PYQ">("All");
  const { activeState } = useTest();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen" />;

  const filteredTests = filter === "All" 
    ? sampleTests 
    : sampleTests.filter(t => t.type === filter);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-[var(--color-card)]/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm">
        <h1 className="text-2xl font-serif text-[var(--color-plum)] mb-2 flex items-center gap-2">
          <ClipboardList size={28} className="text-pink-400" />
          Test Series
        </h1>
        <p className="text-[var(--color-plum-light)] font-medium text-sm">
          Evaluate your preparation with full-length mocks and PYQs.
        </p>
      </div>

      {/* Ongoing Test Alert */}
      {activeState?.status === "in-progress" && (
         <div className="bg-pink-500/10 border border-pink-500/30 rounded-2xl p-4 flex items-center justify-between">
           <div>
             <h3 className="font-bold text-pink-500 text-sm">Test in Progress!</h3>
             <p className="text-xs text-[var(--color-plum-light)] mt-1">You have an active test session.</p>
           </div>
           <Link 
             href={`/tests/${activeState.testId}/attempt`}
             className="bg-pink-500 text-white text-xs font-bold px-4 py-2 rounded-xl hover:brightness-110 active:scale-95 transition-all"
            >
              Resume
            </Link>
         </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["All", "GS", "CSAT", "PYQ"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === f 
                ? "bg-[var(--color-plum)] text-white shadow-md" 
                : "bg-[var(--color-card)] text-[var(--color-plum)] border border-[var(--color-lavender)] hover:bg-[var(--color-lavender-soft)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Test List */}
      <div className="space-y-4">
        {filteredTests.map(test => (
          <TestCard key={test.id} test={test} />
        ))}
        
        {filteredTests.length === 0 && (
          <div className="text-center py-10 bg-[var(--color-card)]/50 rounded-3xl border border-[var(--color-lavender-soft)]">
            <Filter size={40} className="mx-auto text-[var(--color-lavender)] mb-3 opacity-50" />
            <p className="text-[var(--color-plum-light)] font-medium text-sm">No tests found in this category.</p>
          </div>
        )}
      </div>

    </div>
  );
}

function TestCard({ test }: { test: Test }) {
  // In a real app, we'd check if the user has already submitted this test
  const isCompleted = false; 
  
  return (
    <Link 
      href={`/tests/${test.id}`}
      className="block bg-[var(--color-card)]/80 backdrop-blur-sm border border-[var(--color-lavender-soft)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold tracking-widest uppercase text-pink-400 bg-[var(--color-blush-soft)] px-2 py-1 rounded-md">
          {test.type} {test.year && `• ${test.year}`}
        </span>
        {isCompleted && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
            <CheckCircle2 size={12} /> Completed
          </span>
        )}
      </div>
      
      <h3 className="font-bold text-lg text-[var(--color-plum)] mb-4">{test.title}</h3>
      
      <div className="flex flex-wrap gap-4 text-xs font-medium text-[var(--color-plum-light)]">
        <div className="flex items-center gap-1.5">
          <FileText size={14} className="text-[var(--color-lavender)]" />
          {test.totalQuestions} Questions
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-[var(--color-lavender)]" />
          {test.durationMinutes} Mins
        </div>
        <div className="flex items-center gap-1.5">
           <span className="text-[var(--color-lavender)] font-bold">M</span>
           {test.totalMarks} Marks
        </div>
      </div>
    </Link>
  );
}
