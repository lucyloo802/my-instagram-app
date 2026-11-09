import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Check } from 'lucide-react';
import { playTimerChime } from '../utils/sound';

interface CookingTimerProps {
  initialSeconds: number;
  label?: string;
}

export const CookingTimer: React.FC<CookingTimerProps> = ({ initialSeconds, label }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setIsFinished(true);
            playTimerChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsLeft]);

  const toggleTimer = () => {
    if (isFinished) {
      setSecondsLeft(initialSeconds);
      setIsFinished(false);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setSecondsLeft(initialSeconds);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = Math.max(0, Math.min(100, ((initialSeconds - secondsLeft) / initialSeconds) * 100));

  return (
    <div className={`mt-2.5 p-2.5 rounded-lg border text-xs transition-colors ${
      isFinished
        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
        : isRunning
        ? 'bg-amber-50/80 border-amber-300 text-stone-900'
        : 'bg-stone-50 border-stone-200 text-stone-700'
    }`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isFinished ? (
            <div className="p-1 bg-emerald-600 text-white rounded-md">
              <Check className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="p-1 bg-stone-200 text-stone-700 rounded-md">
              <Bell className="w-3.5 h-3.5" />
            </div>
          )}

          <div>
            <div className="font-semibold text-stone-900">
              {label || 'Cooking Timer'}
            </div>
            <div className="text-[11px] text-stone-500">
              {isFinished ? 'Timer complete! Ready for next step.' : `${Math.round(initialSeconds / 60)} min step timer`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold tracking-tight tabular-nums px-2 py-0.5 bg-white rounded border border-stone-200 shadow-2xs">
            {formatTime(secondsLeft)}
          </span>

          <button
            type="button"
            onClick={toggleTimer}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isRunning
                ? 'bg-amber-200 hover:bg-amber-300 text-stone-900'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
            title={isRunning ? 'Pause timer' : 'Start timer'}
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>

          {(isRunning || secondsLeft < initialSeconds) && (
            <button
              type="button"
              onClick={resetTimer}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-2 w-full h-1 bg-stone-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isFinished ? 'bg-emerald-500' : 'bg-amber-600'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
