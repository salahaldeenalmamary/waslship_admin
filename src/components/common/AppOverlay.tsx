import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';
import { cn } from '../../lib/utils';

// ============================================================================
// 1. APP DIALOG / MODAL OVERLAY COMPONENT
// ============================================================================

interface AppDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export function AppDialog({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdropClick = true,
  showCloseButton = true,
  className,
  headerClassName,
  bodyClassName
}: AppDialogProps) {
  const { isRTL } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll on body when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-[calc(100vw-2rem)] md:max-w-6xl h-[calc(100vh-2rem)] md:h-[85vh]'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop Shadow Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => closeOnBackdropClick && onClose()}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            ref={modalRef}
            className={cn(
              "relative bg-white border border-slate-200/80 shadow-2xl rounded-2xl w-full overflow-hidden flex flex-col z-10",
              sizeClasses[size],
              className
            )}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header section */}
            {(title || showCloseButton) && (
              <div 
                className={cn(
                  "px-6 py-4.5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center flex-shrink-0",
                  headerClassName
                )}
              >
                {title ? (
                  <h3 className="font-bold text-slate-900 text-sm md:text-base leading-none">
                    {title}
                  </h3>
                ) : (
                  <div />
                )}

                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-all cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Body Content */}
            <div className={cn("p-6 overflow-y-auto flex-1 text-xs md:text-sm text-slate-600 leading-relaxed", bodyClassName)}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// 2. CONTEXT-AWARE HOVER TOOLTIP COMPONENT
// ============================================================================

interface AppTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function AppTooltip({
  content,
  children,
  position = 'top',
  className
}: AppTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2 origin-top',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2 origin-right',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2 origin-left'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "absolute z-50 px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg shadow-md whitespace-nowrap pointer-events-none",
              positionClasses[position],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// 3. POPOVER OVERLAY TRIGGER COMPONENT
// ============================================================================

interface AppPopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  widthClassName?: string;
  className?: string;
}

export function AppPopover({
  trigger,
  children,
  align = 'center',
  widthClassName = 'w-64',
  className
}: AppPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAlignClass = () => {
    if (align === 'left') return 'left-0 origin-top-left';
    if (align === 'right') return 'right-0 origin-top-right';
    return 'left-1/2 -translate-x-1/2 origin-top';
  };

  return (
    <div className={cn("relative inline-block", className)} ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-40 mt-2 p-4 bg-white border border-slate-200/80 rounded-xl shadow-xl",
              widthClassName,
              getAlignClass()
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
