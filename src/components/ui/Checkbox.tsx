// src/components/ui/Checkbox.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly label: string;
  readonly description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className, id, ...props }, ref) => {
    const generatedId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            id={generatedId}
            ref={ref}
            type="checkbox"
            className={cn(
              'h-4 w-4 rounded border-neutral-border text-brand-purple focus:ring-brand-purple cursor-pointer',
              className
            )}
            {...props}
          />
        </div>
        <div className="ml-2.5 text-xs">
          <label htmlFor={generatedId} className="font-medium text-neutral-textPrimary cursor-pointer select-none">
            {label}
          </label>
          {description && (
            <p className="text-neutral-textSecondary mt-0.5">{description}</p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
