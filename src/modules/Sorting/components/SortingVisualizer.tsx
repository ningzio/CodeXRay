import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AlgorithmStep } from '../../../types';

type SortingVisualizerProps = {
  step: AlgorithmStep<number[]>;
};

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ step }) => {
  const { state: array, highlightIndices, secondaryIndices, activeRange } = step;
  
  // Calculate max value for height scaling
  const maxVal = Math.max(...array, 1);

  return (
    <div className="flex items-end justify-center gap-2 h-64 w-full bg-slate-800/50 p-8 rounded-xl border border-slate-700 shadow-inner relative overflow-hidden">
      {/* Active Range Indicator Background (Optional enhancement) */}
      {activeRange && (
        <div 
          className="absolute bottom-0 h-1 bg-blue-500/30 transition-all duration-300"
          style={{
             left: `calc(2rem + ${activeRange[0] * 3.5}rem)`, // approximate calculation based on gap-2 (0.5rem) + w-12 (3rem)
             width: `calc(${(activeRange[1] - activeRange[0] + 1) * 3.5}rem - 0.5rem)`
          }}
        />
      )}

      <AnimatePresence>
        {array.map((value, index) => {
          const isHighlighted = highlightIndices?.includes(index);
          const isSecondary = secondaryIndices?.includes(index);
          
          // Check if the element is inside the active range (if activeRange is defined)
          const isActive = activeRange ? (index >= activeRange[0] && index <= activeRange[1]) : true;

          // Determine color based on state
          let bgColor = "bg-blue-500"; // Default
          if (isHighlighted) bgColor = "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)]";
          else if (isSecondary) bgColor = "bg-green-500";
          else if (!isActive) bgColor = "bg-slate-600 opacity-40"; // Dim inactive elements

          return (
            <motion.div
              key={value} // Using value as key triggers layout animation on swap
              layout
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25 
              }}
              className={`w-12 rounded-t-md ${bgColor} flex items-end justify-center pb-2 text-xs font-bold text-white transition-colors duration-200 relative`}
              style={{ 
                height: `${(value / maxVal) * 100}%`
              }}
            >
              {value}
              {/* Small marker for inactive elements to show they are not in focus */}
              {!isActive && activeRange && (
                 <span className="absolute -top-6 text-[10px] text-slate-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                   Inactive
                 </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
