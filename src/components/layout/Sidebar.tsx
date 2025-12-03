import React, { useState } from 'react';
import { ChevronDown, ChevronRight, X, Box } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SidebarItem = {
  value: string;
  label: string;
};

export type SidebarGroup = {
  id: string;
  label: string;
  icon?: React.ElementType;
  items: SidebarItem[];
};

interface SidebarProps {
  groups: SidebarGroup[];
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  groups,
  value,
  onChange,
  isOpen,
  onClose,
  className,
}) => {
  // Track expanded groups. Default to all expanded or based on active item.
  // Initialize with the group containing the active value expanded
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    const activeGroup = groups.find(g => g.items.some(i => i.value === value));
    return activeGroup ? [activeGroup.id] : [];
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleItemClick = (itemValue: string) => {
    onChange(itemValue);
    // On mobile, close sidebar after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-6rem)] lg:rounded-2xl lg:border lg:shadow-sm lg:mt-6 lg:ml-6 lg:mb-6",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between lg:hidden">
            <span className="font-bold text-slate-900 dark:text-white">菜单</span>
            <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {groups.map((group) => {
              const isExpanded = expandedGroups.includes(group.id);
              const GroupIcon = group.icon || Box;

              return (
                <div key={group.id} className="space-y-1">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <GroupIcon size={16} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                      <span>{group.label}</span>
                    </div>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {isExpanded && (
                    <div className="ml-4 pl-4 border-l border-slate-200 dark:border-slate-800 space-y-0.5 animate-in slide-in-from-left-1 fade-in duration-200">
                      {group.items.map((item) => {
                        const isActive = item.value === value;
                        return (
                          <button
                            key={item.value}
                            onClick={() => handleItemClick(item.value)}
                            className={cn(
                              "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors border border-transparent",
                              isActive
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium border-blue-100 dark:border-blue-800/30"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                            )}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};
