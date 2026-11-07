// src/components/ui/ThemeToggle.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  readonly variant?: 'icon' | 'pill' | 'switch';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly className?: string;
  readonly showLabel?: boolean;
}

export function ThemeToggle({
  variant = 'icon',
  size = 'md',
  className = '',
  showLabel = false,
}: ThemeToggleProps): React.JSX.Element {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid layout shift during SSR hydration
  if (!mounted) {
    const sizeClasses = {
      sm: 'w-7 h-7',
      md: 'w-8 h-8',
      lg: 'w-10 h-10',
    }[size];

    return (
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-transparent animate-pulse',
          sizeClasses,
          className
        )}
        aria-hidden="true"
      />
    );
  }

  // 1. PILL VARIANT (Icon + Label)
  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer select-none border',
          isDark
            ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700/80 hover:text-amber-200'
            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80 hover:text-slate-900',
          className
        )}
      >
        {isDark ? (
          <Sun className="h-3.5 w-3.5 text-amber-400 rotate-0 transition-transform duration-300" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-slate-600 rotate-0 transition-transform duration-300" />
        )}
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    );
  }

  // 2. SWITCH / TOGGLE VARIANT (Slider track)
  if (variant === 'switch') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#E51919] focus:ring-offset-2',
          isDark ? 'bg-slate-700' : 'bg-slate-300',
          className
        )}
      >
        <span
          className={cn(
            'pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
            isDark ? 'translate-x-5 bg-slate-900 text-amber-300' : 'translate-x-0 bg-white text-slate-600'
          )}
        >
          {isDark ? <Sun className="h-3 w-3 text-amber-400" /> : <Moon className="h-3 w-3 text-slate-600" />}
        </span>
      </button>
    );
  }

  // 3. ICON VARIANT (Default: sleek icon button)
  const sizeMap = {
    sm: {
      btn: 'w-7 h-7 rounded-md p-1',
      icon: 'w-3.5 h-3.5',
    },
    md: {
      btn: 'w-8 h-8 rounded-lg p-1.5',
      icon: 'w-4 h-4',
    },
    lg: {
      btn: 'w-10 h-10 rounded-xl p-2',
      icon: 'w-5 h-5',
    },
  }[size];

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={cn(
        'group relative inline-flex items-center justify-center transition-all duration-200 cursor-pointer border select-none',
        isDark
          ? 'bg-slate-800/90 text-amber-400 border-slate-700 hover:bg-slate-700 hover:text-amber-300 hover:border-slate-600 shadow-xs'
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 shadow-xs',
        sizeMap.btn,
        className
      )}
    >
      {isDark ? (
        <Sun
          className={cn(
            'transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110',
            sizeMap.icon
          )}
        />
      ) : (
        <Moon
          className={cn(
            'transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110',
            sizeMap.icon
          )}
        />
      )}
      {showLabel && (
        <span className="ml-2 text-xs font-semibold">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
