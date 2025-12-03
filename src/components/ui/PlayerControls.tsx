import React from 'react';
import { Play, Pause, RotateCcw, StepBack, StepForward } from 'lucide-react';

type PlayerControlsProps = {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSeek: (step: number) => void;
  onSpeedChange: (speed: number) => void;
};

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onTogglePlay,
  onNext,
  onPrev,
  onReset,
  onSeek,
  onSpeedChange,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Progress Bar */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono w-20 text-right">
          {currentStep} / {totalSteps > 0 ? totalSteps - 1 : 0}
        </span>
        <input
          type="range"
          min="0"
          max={totalSteps > 0 ? totalSteps - 1 : 0}
          value={currentStep}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>      {/* Buttons & Speed */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 sm:gap-0">
        
        {/* Playback Buttons */}
        <div className="flex items-center gap-4 sm:gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <button
            onClick={onReset}
            className="p-3 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block" />

          <button
            onClick={onPrev}
            disabled={currentStep === 0}
            className="p-3 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
          >
            <StepBack size={24} className="sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="p-4 sm:p-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            {isPlaying ? <Pause size={28} className="sm:w-6 sm:h-6" fill="currentColor" /> : <Play size={28} className="sm:w-6 sm:h-6" fill="currentColor" />}
          </button>

          <button
            onClick={onNext}
            disabled={currentStep >= totalSteps - 1}
            className="p-3 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
          >
            <StepForward size={24} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3 py-2 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 w-full sm:w-auto justify-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">SPEED</span>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            // Reverse scale: lower value = faster speed
            value={1050 - speed} 
            onChange={(e) => onSpeedChange(1050 - Number(e.target.value))}
            className="w-full sm:w-24 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />
        </div>
      </div>
    </div>
  );
};
