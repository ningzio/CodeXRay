import React from 'react';
import { Moon, Sun, Github } from 'lucide-react';
import logo from '../../assets/logo.png';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="CodeXRay Logo" className="w-8 h-8 rounded-lg object-contain shadow-lg shadow-blue-500/20" />
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
