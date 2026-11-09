import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe } from '../types/recipe';
import { CookingTimer } from './CookingTimer';
import { playStepTick } from '../utils/sound';

interface CookingModeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({ recipe, isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setCompletedSteps([]);
      setIsFinished(false);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, isFinished]);

  if (!isOpen) return null;

  const currentStep = recipe.steps[currentStepIndex];
  const totalSteps = recipe.steps.length;

  const handleNext = () => {
    playStepTick();
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps((prev) => [...prev, currentStepIndex]);
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      playStepTick();
      setCurrentStepIndex((prev) => prev - 1);
      setIsFinished(false);
    }
  };

  const toggleStepCompleted = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 flex flex-col max-h-[90vh] overflow-hidden relative">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-800">
              Interactive Cooking Mode
            </span>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 font-display truncate max-w-md">
              {recipe.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            title="Exit cooking mode (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex items-center gap-1.5">
          {recipe.steps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setCurrentStepIndex(i);
                setIsFinished(false);
              }}
              className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                i === currentStepIndex
                  ? 'bg-amber-600 ring-2 ring-amber-300'
                  : completedSteps.includes(i)
                  ? 'bg-emerald-500'
                  : 'bg-stone-200'
              }`}
              title={`Jump to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="my-auto py-6 sm:py-8 flex-1 overflow-y-auto">
          {isFinished ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="inline-flex p-4 bg-emerald-100 text-emerald-800 rounded-2xl">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
                Bon Appétit! Dish is Ready!
              </h3>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                You whipped up <strong>{recipe.title}</strong> in record time using strictly what you had on hand.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsFinished(false);
                    setCurrentStepIndex(0);
                  }}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Review Steps
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Finish & Close
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-amber-800 tracking-wider uppercase flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Step {currentStepIndex + 1} of {totalSteps}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStepCompleted(currentStepIndex)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                    completedSteps.includes(currentStepIndex)
                      ? 'bg-emerald-100 text-emerald-800 font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedSteps.includes(currentStepIndex) ? 'Completed' : 'Mark done'}</span>
                </button>
              </div>

              {/* Step Instruction */}
              <div className="text-xl sm:text-2xl font-semibold text-stone-900 leading-snug font-display">
                {currentStep.instruction}
              </div>

              {/* Embedded Timer if step has seconds */}
              {currentStep.timerSeconds && currentStep.timerSeconds > 0 && (
                <div className="max-w-md">
                  <CookingTimer
                    initialSeconds={currentStep.timerSeconds}
                    label={`Step ${currentStepIndex + 1} Timer`}
                  />
                </div>
              )}

              {/* Chef tip for this step */}
              {currentStep.tip && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-amber-900 mr-1">Chef Technique:</strong>
                    <span>{currentStep.tip}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isFinished && (
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 disabled:opacity-30 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-stone-400 hidden sm:inline">
              Tip: Press Space or Right Arrow for Next
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentStepIndex === totalSteps - 1 ? 'Finish Dish' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
