import React from 'react';
import { Clock, Box, Target, AlertTriangle, Lightbulb, BookOpen } from 'lucide-react';
import type { AlgorithmProfile } from '../../types';

interface AlgorithmIntelProps {
  profile: AlgorithmProfile;
}

export const AlgorithmIntel: React.FC<AlgorithmIntelProps> = ({ profile }) => {
  return (
    <div className="space-y-6 font-sans">
      {/* Complexity Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Clock size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">时间复杂度</span>
          </div>
          <div className="text-lg font-bold text-slate-700 dark:text-slate-200 font-mono">
            {profile.complexity.time}
          </div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Box size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">空间复杂度</span>
          </div>
          <div className="text-lg font-bold text-slate-700 dark:text-slate-200 font-mono">
            {profile.complexity.space}
          </div>
        </div>
      </div>

      {/* Key Concepts (Tags) */}
      <div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
          <Lightbulb size={14} />
          <span className="text-xs font-semibold uppercase tracking-wider">核心概念</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.keyConcepts.map((concept, idx) => (
            <span 
              key={idx} 
              className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-100 dark:border-blue-800/30"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>

      {/* Description & How it works */}
      <div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
          <BookOpen size={14} />
          <span className="text-xs font-semibold uppercase tracking-wider">原理解析</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2 font-medium">
          {profile.description}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {profile.howItWorks}
        </p>
      </div>

      {/* Scenarios */}
      <div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
          <Target size={14} />
          <span className="text-xs font-semibold uppercase tracking-wider">适用场景</span>
        </div>
        <ul className="space-y-1.5">
          {profile.scenarios.map((scenario, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
              <span>{scenario}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Limitations (Optional) */}
      {profile.limitations && profile.limitations.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
            <AlertTriangle size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">局限性</span>
          </div>
          <ul className="space-y-1">
            {profile.limitations.map((limit, idx) => (
              <li key={idx} className="text-xs text-amber-700 dark:text-amber-300/80 flex items-start gap-2">
                <span>•</span>
                <span>{limit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
