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
        'rounded-lg border border-neutral-border bg-white shadow-card overflow-hidden',
        className
      )}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between border-b border-neutral-border px-5 py-3.5 bg-neutral-surfaceMuted">
          <div>
            {title && (
              <h3 className="text-sm font-bold text-neutral-textPrimary tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-neutral-textSecondary mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};
