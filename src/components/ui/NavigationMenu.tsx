import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type NavigationItem = {
  value: string;
  label: string;
};

export type NavigationGroup = {
  label: string; // Display name for the category (e.g., "排序算法")
  items: NavigationItem[];
};

interface NavigationMenuProps {
  groups: NavigationGroup[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  groups,
  value,
  onChange,
  className,
}) => {
  const [openGroupIndex, setOpenGroupIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenGroupIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGroupClick = (index: number) => {
    setOpenGroupIndex(openGroupIndex === index ? null : index);
  };

  const handleItemClick = (itemValue: string) => {
    onChange(itemValue);
    setOpenGroupIndex(null);
  };

  return (
    <div className={cn("flex items-center gap-2", className)} ref={containerRef}>
      {groups.map((group, index) => {
        const isActiveGroup = group.items.some(item => item.value === value);
        const isOpen = openGroupIndex === index;

        return (
          <div key={group.label} className="relative">
            <button
              onClick={() => handleGroupClick(index)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                isActiveGroup || isOpen
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 shadow-sm"
                  : "bg-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50"
              )}
            >
              {group.label}
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform duration-200",
                  isOpen ? "rotate-180" : "rotate-0"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-1.5 space-y-0.5">
                  {group.items.map((item) => {
                    const isSelected = item.value === value;
                    return (
                      <button
                        key={item.value}
                        onClick={() => handleItemClick(item.value)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors text-left",
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                      >
                        {item.label}
                        {isSelected && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
