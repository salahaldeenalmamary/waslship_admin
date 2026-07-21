import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  size = 'md',
  fullWidth = false,
  className
}: TabsProps) {
  const isUnderline = variant === 'underline';
  const isPills = variant === 'pills';
  const isBordered = variant === 'bordered';

  return (
    <div 
      className={cn(
        "w-full overflow-x-auto scrollbar-none",
        isPills && "bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50",
        isBordered && "border-b border-slate-200 flex",
        className
      )}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div 
        className={cn(
          "flex items-center min-w-max",
          fullWidth ? "w-full" : "w-auto",
          isUnderline && "border-b border-slate-200/80 gap-6",
          isPills && "gap-1",
          isBordered && "gap-0"
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex items-center justify-center gap-2 font-semibold transition-all whitespace-nowrap cursor-pointer select-none",
                fullWidth ? "flex-1" : "flex-shrink-0",
                
                // Sizes
                size === 'sm' && "text-xs px-3 py-1.5",
                size === 'md' && "text-sm px-4 py-2.5",
                size === 'lg' && "text-base px-6 py-3.5",

                // Underline variant styles
                isUnderline && cn(
                  "pb-4 px-1 border-b-2 font-bold",
                  isActive 
                    ? "border-indigo-600 text-indigo-600" 
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                ),

                // Pills variant styles
                isPills && cn(
                  "rounded-lg z-10 px-4 py-2 text-xs font-bold",
                  isActive 
                    ? "text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                ),

                // Bordered variant styles
                isBordered && cn(
                  "border-t border-r border-l border-slate-200 -mb-px rounded-t-lg font-bold px-5 py-2.5",
                  isActive
                    ? "bg-white border-b-white text-indigo-600"
                    : "bg-slate-50 border-b-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                )
              )}
            >
              {/* Active Background Slide for Pills */}
              {isPills && isActive && (
                <motion.div
                  layoutId="active-pill-bg"
                  className="absolute inset-0 bg-white border border-slate-200/50 rounded-lg shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon */}
              {Icon && (
                <Icon 
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-indigo-600" : "text-slate-400"
                  )} 
                />
              )}

              {/* Label */}
              <span className="leading-none">{tab.label}</span>

              {/* Badge */}
              {tab.badge !== undefined && (
                <span 
                  className={cn(
                    "ml-1 rtl:mr-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors",
                    isActive 
                      ? "bg-indigo-100 text-indigo-700" 
                      : "bg-slate-200/60 text-slate-600"
                  )}
                >
                  {tab.badge}
                </span>
              )}

              {/* Active Bottom Bar Slide for Underline (Alternative option if we don't want static borders) */}
              {/* We can use native React borders or a motion line. Let's keep it robust and performant. */}
            </button>
          );
        })}
      </div>
    </div>
  );
}
