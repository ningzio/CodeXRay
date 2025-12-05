import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, action, className, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-sm dark:shadow-2xl dark:shadow-black/50 overflow-hidden",
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="px-4 py-3 border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between">
          {title && <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400/80">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4 h-full min-h-0">
        {children}
      </div>
    </div>
  );
};
