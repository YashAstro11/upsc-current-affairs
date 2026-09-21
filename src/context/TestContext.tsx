"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Test, sampleTests } from "@/data/tests";

export type TestStatus = "idle" | "in-progress" | "submitted";

export type TestState = {
  testId: string;
  status: TestStatus;
  answers: Record<string, number>; // questionId -> selected option index
  markedForReview: string[]; // array of questionIds
  timeRemaining: number; // in seconds
  lastUpdated: number;
};

interface TestContextType {
  activeState: TestState | null;
  activeTest: Test | null;
  startTest: (testId: string) => void;
  submitTest: () => void;
  answerQuestion: (questionId: string, optionIndex: number) => void;
  clearResponse: (questionId: string) => void;
  toggleReview: (questionId: string) => void;
  isMarkedForReview: (questionId: string) => boolean;
  setTimeRemaining: (time: number) => void;
  endTestAndClear: () => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({ children }: { children: ReactNode }) {
  const [activeState, setActiveState] = useLocalStorage<TestState | null>("upsc_test_state", null);
  const [activeTest, setActiveTest] = useState<Test | null>(null);

  useEffect(() => {
    if (activeState && activeState.testId) {
      const test = sampleTests.find((t) => t.id === activeState.testId);
      if (test) {
        setActiveTest(test);
      }
    } else {
      setActiveTest(null);
    }
  }, [activeState?.testId]);

  const startTest = (testId: string) => {
    const test = sampleTests.find((t) => t.id === testId);
    if (!test) return;

    setActiveState({
      testId,
      status: "in-progress",
      answers: {},
      markedForReview: [],
      timeRemaining: test.durationMinutes * 60,
      lastUpdated: Date.now(),
    });
  };

  const submitTest = () => {
    if (!activeState) return;
    setActiveState({
      ...activeState,
      status: "submitted",
      lastUpdated: Date.now(),
    });
  };

  const answerQuestion = (questionId: string, optionIndex: number) => {
    if (!activeState || activeState.status !== "in-progress") return;
    setActiveState({
      ...activeState,
      answers: {
        ...activeState.answers,
        [questionId]: optionIndex,
      },
      lastUpdated: Date.now(),
    });
  };

  const clearResponse = (questionId: string) => {
    if (!activeState || activeState.status !== "in-progress") return;
    const newAnswers = { ...activeState.answers };
    delete newAnswers[questionId];
    setActiveState({
      ...activeState,
      answers: newAnswers,
      lastUpdated: Date.now(),
    });
  };

  const toggleReview = (questionId: string) => {
    if (!activeState || activeState.status !== "in-progress") return;
    const isMarked = activeState.markedForReview.includes(questionId);
    let newMarked = [...activeState.markedForReview];
    
    if (isMarked) {
      newMarked = newMarked.filter((id) => id !== questionId);
    } else {
      newMarked.push(questionId);
    }
    
    setActiveState({
      ...activeState,
      markedForReview: newMarked,
      lastUpdated: Date.now(),
    });
  };

  const isMarkedForReview = (questionId: string) => {
    return activeState?.markedForReview.includes(questionId) || false;
  };

  const setTimeRemaining = (time: number) => {
    if (!activeState || activeState.status !== "in-progress") return;
    
    // Only update localStorage every 5 seconds to avoid performance issues
    const now = Date.now();
    if (now - activeState.lastUpdated > 5000) {
      setActiveState({
        ...activeState,
        timeRemaining: time,
        lastUpdated: now,
      });
    } else {
      // Just update local state for the UI, don't trigger the useLocalStorage save yet
      // This is a bit of a hack, a better way would be a separate ref for time
      // But for simplicity we'll just let the UI component handle the tick and occasionally sync to context
    }
  };
  
  const endTestAndClear = () => {
     setActiveState(null);
  };

  return (
    <TestContext.Provider
      value={{
        activeState,
        activeTest,
        startTest,
        submitTest,
        answerQuestion,
        clearResponse,
        toggleReview,
        isMarkedForReview,
        setTimeRemaining,
        endTestAndClear
      }}
    >
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
}
