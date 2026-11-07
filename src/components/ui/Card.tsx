// src/components/ui/Card.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly title?: string;
  readonly subtitle?: string;
  readonly action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-border dark:border-slate-800 bg-white dark:bg-[#111827] shadow-card overflow-hidden transition-colors',
        className
      )}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between border-b border-neutral-border dark:border-slate-800 px-5 py-3.5 bg-neutral-surfaceMuted dark:bg-[#161F30]">
          <div>
            {title && (
              <h3 className="text-sm font-bold text-neutral-textPrimary dark:text-white tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-neutral-textSecondary dark:text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};
