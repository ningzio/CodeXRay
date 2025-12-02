import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder || 'Select an option';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-between items-center w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-lg font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer min-w-[240px]"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {displayLabel}
        <ChevronDown
          className={cn(
            'ml-2 -mr-1 h-5 w-5 transform transition-transform duration-200',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white dark:bg-slate-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <a
                key={option.value}
                href="#"
                className={cn(
                  'block px-4 py-2 text-sm font-medium transition-colors',
                  option.value === value
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
                role="menuitem"
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
