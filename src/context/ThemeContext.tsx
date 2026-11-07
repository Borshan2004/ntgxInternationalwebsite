// src/context/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  readonly theme: Theme;
  readonly resolvedTheme: ResolvedTheme;
  readonly isDark: boolean;
  readonly setTheme: (theme: Theme) => void;
  readonly toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'ntgx_theme';

export function ThemeProvider({
  children,
}: {
  readonly children: React.ReactNode;
}): React.JSX.Element {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState<boolean>(false);

  // Helper to determine resolved theme from system preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Apply theme class to <html>
  const applyTheme = useCallback((targetTheme: ResolvedTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (targetTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
    setResolvedTheme(targetTheme);
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
        applyTheme(stored);
      } else {
        setThemeState('system');
        const system = getSystemTheme();
        applyTheme(system);
      }
    } catch {
      applyTheme('light');
    }
  }, [applyTheme, getSystemTheme]);

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const nextTheme = mediaQuery.matches ? 'dark' : 'light';
      applyTheme(nextTheme);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    return undefined;
  }, [mounted, theme, applyTheme]);

  // Set explicit theme
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      try {
        if (newTheme === 'system') {
          localStorage.removeItem(THEME_STORAGE_KEY);
          applyTheme(getSystemTheme());
        } else {
          localStorage.setItem(THEME_STORAGE_KEY, newTheme);
          applyTheme(newTheme);
        }
      } catch {
        // LocalStorage fallback
      }
    },
    [applyTheme, getSystemTheme]
  );

  // Quick toggle between light and dark
  const toggleTheme = useCallback(() => {
    const nextTheme: ResolvedTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      isDark: resolvedTheme === 'dark',
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
