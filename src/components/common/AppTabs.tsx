import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../providers/LanguageProvider';
import { cn } from '../../lib/utils';

export interface AppTabItem {
  id: string;
  label: string | React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'primary' | 'danger' | 'warning' | 'neutral';
  content: React.ReactNode | (() => React.ReactNode);
  disabled?: boolean;
}

interface AppTabsProps {
  tabs: AppTabItem[];
  defaultTabId?: string;
  activeTabId?: string; // Controlled mode
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'bordered' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  persistenceKey?: string; // Key to persist active tab
  persistenceMode?: 'local' | 'session' | 'url-query' | 'url-hash' | 'none';
  lazy?: boolean; // Only render active tab content to save resources
  animated?: boolean; // Smooth layout animations
  className?: string;
  tabBarClassName?: string;
  contentClassName?: string;
}

export default function AppTabs({
  tabs,
  defaultTabId,
  activeTabId,
  onChange,
  variant = 'underline',
  size = 'md',
  fullWidth = false,
  persistenceKey,
  persistenceMode = 'local',
  lazy = true,
  animated = true,
  className,
  tabBarClassName,
  contentClassName
}: AppTabsProps) {
  const { isRTL } = useLanguage();

  // 1. Determine Initial Active Tab
  const getInitialTab = (): string => {
    // If activeTabId is supplied from outer controlled state, respect it
    if (activeTabId) return activeTabId;

    const fallbackId = defaultTabId || (tabs.length > 0 ? tabs[0].id : '');

    if (!persistenceKey || persistenceMode === 'none') return fallbackId;

    try {
      if (persistenceMode === 'local') {
        const stored = localStorage.getItem(`app_tabs_${persistenceKey}`);
        if (stored && tabs.some(t => t.id === stored)) return stored;
      } else if (persistenceMode === 'session') {
        const stored = sessionStorage.getItem(`app_tabs_${persistenceKey}`);
        if (stored && tabs.some(t => t.id === stored)) return stored;
      } else if (persistenceMode === 'url-query') {
        const params = new URLSearchParams(window.location.search);
        const queryVal = params.get(persistenceKey);
        if (queryVal && tabs.some(t => t.id === queryVal)) return queryVal;
      } else if (persistenceMode === 'url-hash') {
        const hash = window.location.hash.replace('#', '');
        if (hash && tabs.some(t => t.id === hash)) return hash;
      }
    } catch (e) {
      console.warn('Error fetching persisted tab state:', e);
    }

    return fallbackId;
  };

  const [localActiveId, setLocalActiveId] = useState<string>(getInitialTab);
  const activeId = activeTabId !== undefined ? activeTabId : localActiveId;

  // Track rendered tabs for non-lazy persistence (keepAlive style)
  const [renderedTabIds, setRenderedTabIds] = useState<Record<string, boolean>>({
    [activeId]: true
  });

  useEffect(() => {
    setRenderedTabIds(prev => ({
      ...prev,
      [activeId]: true
    }));
  }, [activeId]);

  // Handle Controlled/Uncontrolled state syncer
  const handleTabChange = (id: string) => {
    const targetTab = tabs.find(t => t.id === id);
    if (!targetTab || targetTab.disabled) return;

    if (activeTabId === undefined) {
      setLocalActiveId(id);
    }

    // Persist if persistence key matches
    if (persistenceKey && persistenceMode !== 'none') {
      try {
        if (persistenceMode === 'local') {
          localStorage.setItem(`app_tabs_${persistenceKey}`, id);
        } else if (persistenceMode === 'session') {
          sessionStorage.setItem(`app_tabs_${persistenceKey}`, id);
        } else if (persistenceMode === 'url-query') {
          const url = new URL(window.location.href);
          url.searchParams.set(persistenceKey, id);
          window.history.replaceState({}, '', url.toString());
        } else if (persistenceMode === 'url-hash') {
          window.location.hash = id;
        }
      } catch (e) {
        console.warn('Error saving persisted tab state:', e);
      }
    }

    if (onChange) {
      onChange(id);
    }
  };

  // Synchronize external query or hash changes
  useEffect(() => {
    if (!persistenceKey || persistenceMode === 'none') return;

    const handleLocationChange = () => {
      try {
        if (persistenceMode === 'url-query') {
          const params = new URLSearchParams(window.location.search);
          const queryVal = params.get(persistenceKey);
          if (queryVal && queryVal !== activeId && tabs.some(t => t.id === queryVal)) {
            if (activeTabId === undefined) setLocalActiveId(queryVal);
            if (onChange) onChange(queryVal);
          }
        } else if (persistenceMode === 'url-hash') {
          const hash = window.location.hash.replace('#', '');
          if (hash && hash !== activeId && tabs.some(t => t.id === hash)) {
            if (activeTabId === undefined) setLocalActiveId(hash);
            if (onChange) onChange(hash);
          }
        }
      } catch (e) {
        console.warn('Error parsing state updates on location change:', e);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [persistenceKey, persistenceMode, activeId, activeTabId, tabs, onChange]);

  // Style helper classes based on variant parameters
  const isUnderline = variant === 'underline';
  const isPills = variant === 'pills';
  const isBordered = variant === 'bordered';
  const isSegmented = variant === 'segmented';

  return (
    <div className={cn("w-full space-y-5", className)} id={`app-tabs-${persistenceKey || 'reusable'}`}>
      {/* Tab Navigation Wrapper */}
      <div 
        className={cn(
          "w-full overflow-x-auto scrollbar-none",
          isSegmented && "bg-slate-100/90 p-1 rounded-xl border border-slate-200/50 flex",
          isPills && "bg-slate-50/50 p-1.5 rounded-lg border border-slate-100/80 flex",
          tabBarClassName
        )}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div 
          className={cn(
            "flex items-center min-w-max",
            fullWidth ? "w-full" : "w-auto",
            isUnderline && "border-b border-slate-200/80 gap-6",
            isPills && "gap-1",
            isBordered && "gap-0",
            isSegmented && "w-full gap-0.5"
          )}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={tab.disabled}
                className={cn(
                  "relative flex items-center justify-center gap-2 font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer select-none",
                  fullWidth || isSegmented ? "flex-1" : "flex-shrink-0",
                  tab.disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "",
                  
                  // Sizings
                  size === 'sm' && "text-xs px-3.5 py-1.5",
                  size === 'md' && "text-sm px-4.5 py-2.5",
                  size === 'lg' && "text-base px-6 py-3.5",

                  // Underline Mode Styles
                  isUnderline && cn(
                    "pb-3.5 px-1 border-b-2 font-bold",
                    isActive 
                      ? "border-indigo-600 text-indigo-600" 
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  ),

                  // Pills Mode Styles
                  isPills && cn(
                    "rounded-md z-10 px-4 py-2 font-bold",
                    isActive 
                      ? "text-indigo-700 font-extrabold shadow-xs" 
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                  ),

                  // Bordered Tab Styles (Classic Folder Tab Look)
                  isBordered && cn(
                    "border-t border-r border-l border-slate-200/80 -mb-px rounded-t-lg font-bold px-5 py-2.5",
                    isActive
                      ? "bg-white border-b-white text-indigo-600"
                      : "bg-slate-50/50 border-b-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-100/40"
                  ),

                  // Segmented Tabs Styles (iOS segmented style)
                  isSegmented && cn(
                    "rounded-lg z-10 px-3 py-1.5 text-xs font-bold",
                    isActive 
                      ? "text-slate-900 font-bold" 
                      : "text-slate-500 hover:text-slate-800"
                  )
                )}
              >
                {/* Underline Slide Motion Indicator */}
                {isUnderline && isActive && animated && (
                  <motion.div
                    layoutId={`active-underline-${persistenceKey || 'default'}`}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Pills Active Sliding Background */}
                {isPills && isActive && animated && (
                  <motion.div
                    layoutId={`active-pill-bg-${persistenceKey || 'default'}`}
                    className="absolute inset-0 bg-white border border-slate-200/60 rounded-md shadow-xs -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Segmented Active Sliding Background */}
                {isSegmented && isActive && animated && (
                  <motion.div
                    layoutId={`active-segmented-bg-${persistenceKey || 'default'}`}
                    className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10 border border-slate-200/40"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
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

                {/* Tab Label */}
                <span className="leading-none">{tab.label}</span>

                {/* Badge component */}
                {tab.badge !== undefined && (
                  <span 
                    className={cn(
                      "ml-1.5 rtl:mr-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all",
                      isActive 
                        ? (tab.badgeVariant === 'danger' ? "bg-rose-100 text-rose-700" : 
                           tab.badgeVariant === 'warning' ? "bg-amber-100 text-amber-700" :
                           "bg-indigo-100 text-indigo-700")
                        : "bg-slate-200/60 text-slate-600"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels Container with Direction-aware Slide transition */}
      <div className={cn("w-full min-h-[100px]", contentClassName)}>
        <AnimatePresence mode="wait">
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            
            // Handle rendering choices:
            // - If lazy is enabled, only render when active
            // - If not lazy, we render everything, but toggle display none to persist component state tree
            if (lazy) {
              if (!isActive) return null;
            } else {
              if (!renderedTabIds[tab.id] && !isActive) return null;
            }

            const contentNode = typeof tab.content === 'function' ? tab.content() : tab.content;

            return (
              <div
                key={tab.id}
                className={cn(
                  "w-full transition-opacity duration-150",
                  !isActive ? "hidden" : "block"
                )}
              >
                {animated && isActive ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {contentNode}
                  </motion.div>
                ) : (
                  <div dir={isRTL ? 'rtl' : 'ltr'}>{contentNode}</div>
                )}
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
