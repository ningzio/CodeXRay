import React from 'react';
import { Moon, Sun, Github, Menu } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl transition-colors duration-300">
      <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between max-w-[1920px] mx-auto">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          {onMenuClick && (
             <button
               onClick={onMenuClick}
               className="p-2 -ml-2 mr-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
               aria-label="Open Menu"
             >
               <Menu size={20} />
             </button>
          )}

          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-lg font-mono">X</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              CodeXRay
            </h1>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Algorithm Internals
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/ningzio/CodeXRay"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
          >
            <Github size={20} />
          </a>
          
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors relative overflow-hidden"
          >
            <div className="relative z-10">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
