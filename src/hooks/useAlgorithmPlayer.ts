import { useState, useEffect, useRef, useCallback } from 'react';
import type { AlgorithmGenerator, AlgorithmStep } from '../types';

type UseAlgorithmPlayerProps<T> = {
  algorithm: AlgorithmGenerator<T>;
  initialData: T;
  autoPlay?: boolean;
  initialSpeed?: number; // ms per step
};

export function useAlgorithmPlayer<T>({
  algorithm,
  initialData,
  autoPlay = false,
  initialSpeed = 500,
}: UseAlgorithmPlayerProps<T>) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep<T>[]>([]);
  const [speed, setSpeed] = useState(initialSpeed);
  
  // Timer reference for the playback loop
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize steps when algorithm or data changes
  useEffect(() => {
    const gen = algorithm(JSON.parse(JSON.stringify(initialData))); // Deep copy initial data
    const generatedSteps: AlgorithmStep<T>[] = [];
    
    // Initial state is the first step
    generatedSteps.push({ state: JSON.parse(JSON.stringify(initialData)), log: 'Initial State' });

    for (const step of gen) {
      generatedSteps.push(step);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(autoPlay); // Respect autoPlay prop on reset
    
    if (timerRef.current) clearInterval(timerRef.current);
  }, [algorithm, initialData, autoPlay]);

  // Playback logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length, speed]);

  // Controls
  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);
  
  const next = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prev = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const seek = useCallback((index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
  }, [steps.length]);

  return {
    currentStep: steps[currentStepIndex] || { state: initialData }, // Safe fallback
    currentStepIndex,
    totalSteps: steps.length,
    isPlaying,
    speed,
    setSpeed,
    controls: {
      togglePlay,
      next,
      prev,
      reset,
      seek
    }
  };
}
