// src/components/ui/Input.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly label?: string;
  readonly helperText?: string;
  readonly error?: string;
  readonly leftAddon?: string;
  readonly rightAddon?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftAddon, rightAddon, className, id, ...props }, ref) => {
    const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={generatedId}
            className="block text-xs font-semibold uppercase tracking-wider text-neutral-textSecondary mb-1.5"
          >
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative flex rounded-md shadow-sm">
          {leftAddon && (
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-border dark:border-slate-700 bg-neutral-surfaceMuted dark:bg-slate-800 text-neutral-textSecondary dark:text-slate-400 text-xs">
              {leftAddon}
            </span>
          )}
          <input
            id={generatedId}
            ref={ref}
            className={cn(
              'block w-full min-w-0 rounded-md border border-neutral-border dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-neutral-textPrimary dark:text-neutral-100 placeholder:text-neutral-textMuted dark:placeholder:text-slate-500 transition-colors focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple disabled:bg-neutral-surfaceMuted dark:disabled:bg-slate-900 disabled:cursor-not-allowed',
              leftAddon && 'rounded-l-none',
              rightAddon && 'rounded-r-none',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {rightAddon && (
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-neutral-border dark:border-slate-700 bg-neutral-surfaceMuted dark:bg-slate-800 text-neutral-textSecondary dark:text-slate-400 text-xs font-mono">
              {rightAddon}
            </span>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-neutral-textMuted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
