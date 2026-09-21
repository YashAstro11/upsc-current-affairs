"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { csatData, CsatTopicId } from '@/data/csat';
import { useCsat } from '@/context/CsatContext';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CsatPracticePage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { recordAttempt } = useCsat();

  const topicId = (typeof params?.topic === 'string' ? params.topic : '') as CsatTopicId;
  const topicData = csatData[topicId];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!topicData && mounted) {
      router.push('/csat');
    }
  }, [topicData, mounted, router]);

  if (!mounted || !topicData) return <div className="min-h-screen" />;

  const questions = topicData.questions;
  const currentQuestion = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  const handleSelect = (index: number) => {
    if (isSubmitted) return;
    import('@/utils/sounds').then(m => m.playSound('pop'));
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    
    import('@/utils/sounds').then(m => {
       if (isCorrect) m.playSound('success');
       else m.playSound('pop'); // maybe a different sound for incorrect later
    });

    recordAttempt(currentQuestion.id, topicId, isCorrect);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    import('@/utils/sounds').then(m => m.playSound('pop'));
    setSelectedOption(null);
    setIsSubmitted(false);
    setCurrentIndex(prev => prev + 1);
  };

  if (isFinished) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-6">
           <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black text-[var(--color-plum)] mb-4">Practice Complete!</h2>
        <p className="text-[var(--color-plum-light)] mb-8">You have completed all available questions for this topic.</p>
        <Link 
           href="/csat"
           className="bg-[var(--color-plum)] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[var(--color-plum)]/90 transition-all active:scale-95"
        >
           Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-[var(--background)]/80 backdrop-blur-md pt-4 pb-4 flex items-center justify-between">
        <Link 
          href="/csat"
          className="bg-[var(--color-card)] p-2 rounded-full border border-[var(--color-lavender-soft)] text-[var(--color-plum)] hover:bg-[var(--color-lavender-soft)] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2">
           <span className="font-bold text-[var(--color-plum)] text-sm tracking-wide">Q {currentIndex + 1}</span>
           <span className="text-[var(--color-plum-light)] text-sm">/ {questions.length}</span>
        </div>
      </div>

      <div className="bg-[var(--color-card)] border border-[var(--color-lavender-soft)] rounded-3xl p-6 md:p-8 shadow-sm">
         
         {/* Passage (if any) */}
         {currentQuestion.passage && (
            <div className="mb-6 p-5 bg-[var(--background)] rounded-2xl border border-[var(--color-lavender-soft)]">
               <p className="text-[var(--color-plum)] text-sm md:text-base leading-relaxed italic">
                  "{currentQuestion.passage}"
               </p>
            </div>
         )}

         {/* Question */}
         <h3 className="text-lg md:text-xl font-bold text-[var(--color-plum)] leading-snug mb-8 whitespace-pre-wrap">
            {currentQuestion.question}
         </h3>

         {/* Options */}
         <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
               const isSelected = selectedOption === index;
               const isCorrectAnswer = index === currentQuestion.correctOptionIndex;
               
               let optionStyle = "bg-[var(--background)] border border-[var(--color-lavender-soft)] hover:border-[var(--color-lavender)] hover:bg-[var(--color-blush-soft)] text-[var(--color-plum)]";
               
               if (isSubmitted) {
                  if (isCorrectAnswer) {
                     optionStyle = "bg-emerald-50 border-emerald-300 text-emerald-800";
                  } else if (isSelected && !isCorrectAnswer) {
                     optionStyle = "bg-red-50 border-red-300 text-red-800";
                  } else {
                     optionStyle = "bg-[var(--background)] border border-transparent opacity-50";
                  }
               } else if (isSelected) {
                  optionStyle = "bg-[var(--color-lavender-soft)] border-[var(--color-plum)] text-[var(--color-plum)] shadow-sm";
               }

               return (
                  <button
                     key={index}
                     onClick={() => handleSelect(index)}
                     disabled={isSubmitted}
                     className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center justify-between ${optionStyle}`}
                  >
                     <span className="font-medium text-sm md:text-base leading-tight pr-4">{option}</span>
                     
                     {isSubmitted && isCorrectAnswer && <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />}
                     {isSubmitted && isSelected && !isCorrectAnswer && <XCircle size={20} className="text-red-500 shrink-0" />}
                     {!isSubmitted && (
                        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                           isSelected ? "border-[var(--color-plum)]" : "border-[var(--color-lavender)]"
                        }`}>
                           {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-plum)]" />}
                        </div>
                     )}
                  </button>
               );
            })}
         </div>

         {/* Explanation */}
         <AnimatePresence>
            {isSubmitted && (
               <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 overflow-hidden"
               >
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                     <Info size={18} />
                     <span className="font-bold text-sm uppercase tracking-wider">Explanation</span>
                  </div>
                  <p className="text-blue-900/80 text-sm leading-relaxed whitespace-pre-wrap">
                     {currentQuestion.explanation}
                  </p>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Action Area */}
      <div className="fixed bottom-20 md:bottom-6 left-0 right-0 px-4 pointer-events-none flex justify-center">
         <div className="w-full max-w-3xl flex justify-end">
            {!isSubmitted ? (
               <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={selectedOption === null}
                  className={`pointer-events-auto px-8 py-4 rounded-full font-bold shadow-lg transition-all ${
                     selectedOption !== null
                        ? "bg-[var(--color-plum)] text-white hover:bg-[var(--color-plum)]/90"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
               >
                  Check Answer
               </motion.button>
            ) : (
               <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="pointer-events-auto bg-[var(--color-plum)] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[var(--color-plum)]/90 transition-all flex items-center gap-2"
               >
                  Next <ChevronRight size={20} />
               </motion.button>
            )}
         </div>
      </div>

    </div>
  );
}
