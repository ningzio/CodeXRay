import React, { useState } from 'react';
import { Clock, Box, Target, AlertTriangle, Lightbulb, ExternalLink, GraduationCap, Zap } from 'lucide-react';
import type { AlgorithmProfile } from '../../types';

interface AlgorithmIntelProps {
  profile: AlgorithmProfile;
}

export const AlgorithmIntel: React.FC<AlgorithmIntelProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tactics' | 'deepdive'>('overview');

  const tabs = [
    { id: 'overview', label: '概览', icon: GraduationCap },
    { id: 'tactics', label: '战术', icon: Target },
    { id: 'deepdive', label: '深潜', icon: BookOpen },
  ];

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Tabs Header */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg mb-4 border border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Definition */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
               <div className="flex items-start gap-2">
                 <div className="mt-0.5 text-blue-500 dark:text-blue-400">
                   <Lightbulb size={16} />
                 </div>
                 <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                   {profile.description}
                 </p>
               </div>
            </div>

            {/* Complexity Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">复杂度分析</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Clock size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-wider">时间 (Time)</span>
                  </div>
                  <div className="text-lg font-bold text-slate-700 dark:text-slate-200 font-mono">
                    {profile.complexity.time}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Box size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-wider">空间 (Space)</span>
                  </div>
                  <div className="text-lg font-bold text-slate-700 dark:text-slate-200 font-mono">
                    {profile.complexity.space}
                  </div>
                </div>
              </div>

              {(profile.complexity.bestCase || profile.complexity.worstCase) && (
                <div className="grid grid-cols-1 gap-2 text-xs">
                   {profile.complexity.bestCase && (
                     <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                       <span className="font-medium">最好情况</span>
                       <span className="font-mono">{profile.complexity.bestCase}</span>
                     </div>
                   )}
                   {profile.complexity.worstCase && (
                     <div className="flex items-center justify-between px-3 py-2 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-300">
                       <span className="font-medium">最坏情况</span>
                       <span className="font-mono">{profile.complexity.worstCase}</span>
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TACTICS TAB */}
        {activeTab === 'tactics' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Core Idea */}
            <div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                <Zap size={14} />
                <span className="text-xs font-semibold uppercase tracking-wider">核心思想</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                {profile.howItWorks}
              </p>
            </div>

            {/* Key Concepts */}
            <div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                <Target size={14} />
                <span className="text-xs font-semibold uppercase tracking-wider">关键概念</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.keyConcepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700"
                  >
                    {concept}
                  </span>
                ))}
              </div>
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
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                    <span>{scenario}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pitfalls */}
            {profile.pitfalls && profile.pitfalls.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
                  <AlertTriangle size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">避坑指南</span>
                </div>
                <ul className="space-y-1">
                  {profile.pitfalls.map((limit, idx) => (
                    <li key={idx} className="text-xs text-amber-700 dark:text-amber-300/80 flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                      <span>{limit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* DEEP DIVE TAB */}
        {activeTab === 'deepdive' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30 text-center">
               <p className="text-sm text-indigo-800 dark:text-indigo-200 mb-2 font-medium">
                 准备好深入研究了吗？
               </p>
               <p className="text-xs text-indigo-600 dark:text-indigo-300/80 leading-relaxed">
                 以下资源可以帮助你更全面地掌握该算法的数学证明和工业级实现。
               </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">推荐链接</h4>
              {profile.links && profile.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-blue-500 transition-colors">
                      <BookOpen size={16} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {link.label}
                    </span>
                  </div>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                </a>
              ))}
              {(!profile.links || profile.links.length === 0) && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  暂无外部链接
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Helper icon component since we use it in tabs definition
function BookOpen(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
