import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, X } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';
import { cn } from '../../lib/utils';

// ==========================================
// 1. DROPDOWN ACTION MENU COMPONENT
// ==========================================

export interface DropdownMenuItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'primary' | 'danger' | 'warning' | 'neutral';
  disabled?: boolean;
  className?: string;
  onClick?: (id: string) => void;
  divider?: boolean;
}

interface AppDropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right' | 'center' | 'start' | 'end';
  width?: 'auto' | 'sm' | 'md' | 'lg' | string;
  onItemSelect?: (id: string) => void;
  className?: string;
  menuClassName?: string;
}

export function AppDropdownMenu({
  trigger,
  items,
  align = 'end', // Default to 'end' (which corresponds to LTR right / RTL left)
  width = 'md',
  onItemSelect,
  className,
  menuClassName
}: AppDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close when pressing Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine width class
  const getWidthClass = () => {
    if (width === 'auto') return 'w-auto min-w-[140px]';
    if (width === 'sm') return 'w-40';
    if (width === 'md') return 'w-56';
    if (width === 'lg') return 'w-72';
    return width; // custom width class e.g. "w-48"
  };

  // Determine alignment based on current RTL/LTR language direction
  const getAlignClass = () => {
    // Convert generic start/end alignments
    let computedAlign = align;
    if (align === 'start') computedAlign = isRTL ? 'right' : 'left';
    if (align === 'end') computedAlign = isRTL ? 'left' : 'right';

    if (computedAlign === 'left') return 'left-0 origin-top-left';
    if (computedAlign === 'right') return 'right-0 origin-top-right';
    return 'left-1/2 -translate-x-1/2 origin-top';
  };

  return (
    <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={cn(
              "absolute z-50 mt-1.5 rounded-xl bg-white border border-slate-200/80 shadow-lg ring-1 ring-black/5 divide-y divide-slate-100 overflow-hidden focus:outline-none",
              getWidthClass(),
              getAlignClass(),
              menuClassName
            )}
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              {items.map((item, idx) => {
                const Icon = item.icon;

                if (item.divider) {
                  return <hr key={`div-${idx}`} className="border-slate-100 my-1" />;
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.disabled) return;
                      if (item.onClick) item.onClick(item.id);
                      if (onItemSelect) onItemSelect(item.id);
                      setIsOpen(false);
                    }}
                    disabled={item.disabled}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2.5 text-xs text-start font-semibold transition-colors cursor-pointer select-none",
                      item.disabled 
                        ? "text-slate-300 cursor-not-allowed bg-slate-50/20" 
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100",
                      item.className
                    )}
                    role="menuitem"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {Icon && (
                        <Icon 
                          className={cn(
                            "w-4 h-4 flex-shrink-0 transition-colors",
                            item.disabled ? "text-slate-300" : "text-slate-400"
                          )} 
                        />
                      )}
                      <span className="truncate leading-none">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span 
                        className={cn(
                          "ml-2 rtl:mr-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                          item.badgeVariant === 'danger' && "bg-rose-100 text-rose-700",
                          item.badgeVariant === 'warning' && "bg-amber-100 text-amber-700",
                          item.badgeVariant === 'primary' && "bg-indigo-100 text-indigo-700",
                          (!item.badgeVariant || item.badgeVariant === 'neutral') && "bg-slate-100 text-slate-600"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ==========================================
// 2. PREMIUM SELECT CUSTOM COMPONENT
// ==========================================

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  disabled?: boolean;
}

interface AppSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
  triggerClassName?: string;
  id?: string;
}

export function AppSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  searchable = false,
  className,
  triggerClassName,
  id
}: AppSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options if search is active
  const filteredOptions = searchable
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opt.description && opt.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : options;

  const handleSelect = (optionValue: string) => {
    const opt = options.find(o => o.value === optionValue);
    if (opt?.disabled) return;
    
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={cn("w-full space-y-1.5", className)} ref={containerRef} id={id}>
      {label && (
        <label className="block text-xs font-bold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-white border rounded-lg text-xs font-semibold text-start shadow-xs transition-all select-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500",
            isOpen ? "border-indigo-500 ring-1 ring-indigo-500/10" : "border-slate-300 hover:border-slate-400",
            error ? "border-rose-500 focus:ring-rose-500/10" : "",
            disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed opacity-70 border-slate-200" : "text-slate-800",
            triggerClassName
          )}
        >
          <div className="flex items-center gap-2 truncate min-w-0">
            {selectedOption?.icon && (
              <selectedOption.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            )}
            <span className={cn("truncate", !selectedOption && "text-slate-400 font-medium")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <ChevronDown 
            className={cn(
              "w-4 h-4 text-slate-400 transition-transform flex-shrink-0 duration-150",
              isOpen && "transform rotate-180 text-indigo-500"
            )} 
          />
        </button>

        {/* Options Overlay Panel */}
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="absolute z-50 w-full mt-1.5 max-h-60 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden flex flex-col focus:outline-none"
            >
              {/* Optional Search bar inside select box */}
              {searchable && (
                <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex items-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={isRTL ? "البحث والتصفية..." : "Type to filter options..."}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="p-1 ml-1 text-slate-400 hover:bg-slate-200/60 rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Scrollable List wrapper */}
              <div className="overflow-y-auto max-h-52 divide-y divide-slate-50/50 scrollbar-none py-1">
                {filteredOptions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 font-medium">
                    {isRTL ? "لا توجد نتائج مطابقة" : "No results matched your filter"}
                  </div>
                ) : (
                  filteredOptions.map((opt) => {
                    const isSelected = opt.value === value;
                    const OptIcon = opt.icon;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt.value)}
                        disabled={opt.disabled}
                        className={cn(
                          "w-full flex items-start gap-3 px-3.5 py-2.5 text-xs text-start transition-colors cursor-pointer select-none",
                          opt.disabled 
                            ? "opacity-40 cursor-not-allowed bg-slate-50/30 text-slate-400" 
                            : isSelected
                              ? "bg-indigo-50/60 text-indigo-900 font-bold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        {/* Selected Tick Indicator */}
                        {isSelected ? (
                          <div className="flex-shrink-0 self-center">
                            <Check className="w-4 h-4 text-indigo-600" />
                          </div>
                        ) : OptIcon ? (
                          <div className="flex-shrink-0 self-center">
                            <OptIcon className="w-4 h-4 text-slate-400" />
                          </div>
                        ) : (
                          // Visual indent spacer for consistent alignment
                          <div className="w-4 flex-shrink-0" />
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold leading-none truncate">{opt.label}</p>
                          {opt.description && (
                            <p className="text-[10px] text-slate-400 mt-1 truncate leading-relaxed">
                              {opt.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="text-[10px] text-rose-500 font-semibold">{error}</p>
      )}
    </div>
  );
}
