import React, { useMemo, useEffect, useRef } from 'react';
import { parseCodeWithLabels } from '../../utils/codeParser';

type CodeViewerProps = {
  code: string;
  activeLabel?: string;
};

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, activeLabel }) => {
  const { cleanCode, labelMap } = useMemo(() => parseCodeWithLabels(code), [code]);
  const activeLineIndex = activeLabel ? labelMap[activeLabel] : -1;
  
  const lines = cleanCode.split('\n');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineIndex !== -1 && activeLineRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const element = activeLineRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      // If element is out of view, scroll to it
      if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
         element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLineIndex]);

  return (
    <div 
      ref={scrollContainerRef}
      className="h-full overflow-y-auto font-mono text-xs sm:text-sm"
    >
      <div className="flex flex-col min-h-full">
        {lines.map((line, index) => {
          const isActive = index === activeLineIndex;
          
          return (
            <div 
              key={index}
              ref={isActive ? activeLineRef : null}
              className={`flex px-4 py-1 transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-50 dark:bg-blue-500/20 border-l-2 border-blue-500 dark:border-blue-400' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 border-l-2 border-transparent'
              }`}
            >
              {/* Line Number */}
              <span className={`w-8 select-none text-right mr-4 flex-shrink-0 ${
                isActive ? 'text-blue-500 dark:text-blue-300' : 'text-slate-400 dark:text-slate-600'
              }`}>
                {index + 1}
              </span>
              
              {/* Code Content */}
              <pre className={`whitespace-pre-wrap font-mono ${
                isActive 
                  ? 'text-slate-900 dark:text-blue-100 font-bold' 
                  : 'text-slate-600 dark:text-slate-400'
              }`}>
                {line}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
