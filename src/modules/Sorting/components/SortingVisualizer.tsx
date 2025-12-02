import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AlgorithmStep } from '../../../types';

type SortingVisualizerProps = {
  step: AlgorithmStep<number[]>;
};

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ step }) => {
  const { state: array, highlightIndices, secondaryIndices } = step;
  
  // Calculate max value for height scaling
  const maxVal = Math.max(...array, 1);

  return (
    <div className="flex items-end justify-center gap-2 h-64 w-full bg-slate-800/50 p-8 rounded-xl border border-slate-700 shadow-inner">
      <AnimatePresence>
        {array.map((value, index) => {
          const isHighlighted = highlightIndices?.includes(index);
          const isSecondary = secondaryIndices?.includes(index);
          
          // Determine color based on state
          let bgColor = "bg-blue-500"; // Default
          if (isHighlighted) bgColor = "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)]";
          else if (isSecondary) bgColor = "bg-green-500";

          return (
            <motion.div
              key={value} // Using value as key triggers layout animation on swap
              layout
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25 
              }}
              className={`w-12 rounded-t-md ${bgColor} flex items-end justify-center pb-2 text-xs font-bold text-white transition-colors duration-200`}
              style={{ 
                height: `${(value / maxVal) * 100}%`
              }}
            >
              {value}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
