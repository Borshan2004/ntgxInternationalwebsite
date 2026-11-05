// src/components/ui/Accordion.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

export interface AccordionItemProps {
  readonly stepNumber: number;
  readonly title: string;
  readonly summarySubtitle?: string;
  readonly isComplete?: boolean;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
  readonly children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  stepNumber,
  title,
  summarySubtitle,
  isComplete = false,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border bg-white transition-all duration-200 overflow-hidden mb-3',
        isOpen
          ? 'border-brand-purple shadow-accordionActive ring-1 ring-brand-purple'
          : 'border-neutral-border hover:border-gray-300'
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors',
          isOpen ? 'bg-brand-purpleSubtle/40' : 'bg-white hover:bg-neutral-surfaceMuted'
        )}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
              isComplete
                ? 'bg-emerald-600 text-white'
                : isOpen
                ? 'bg-brand-purple text-white'
                : 'bg-neutral-surfaceMuted text-neutral-textSecondary border border-neutral-border'
            )}
          >
            {isComplete ? <Check className="h-4 w-4 stroke-[2.5]" /> : stepNumber}
          </div>
          <div>
            <span
              className={cn(
                'text-sm font-bold tracking-tight block',
                isOpen ? 'text-brand-purple' : 'text-neutral-textPrimary'
              )}
            >
              {stepNumber}. {title}
            </span>
            {!isOpen && summarySubtitle && (
              <span className="text-xs text-neutral-textSecondary line-clamp-1 mt-0.5">
                {summarySubtitle}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isComplete && !isOpen && (
            <span className="text-2xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Complete
            </span>
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-neutral-textSecondary transition-transform duration-200',
              isOpen && 'transform rotate-180 text-brand-purple'
            )}
          />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-neutral-border px-5 py-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};
