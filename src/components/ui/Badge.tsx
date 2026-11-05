// src/components/ui/Badge.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { ShipmentStatus } from '@/types/shipment';
import { getStatusBadgeStyle } from '@/lib/tokens';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  readonly status?: ShipmentStatus;
  readonly variant?: 'default' | 'purple' | 'orange' | 'blue';
  readonly showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  showDot = true,
  children,
  className,
  ...props
}) => {
  if (status) {
    const style = getStatusBadgeStyle(status);
    return (
      <span
        style={{
          backgroundColor: style.bg,
          color: style.text,
          borderColor: style.border,
        }}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none',
          className
        )}
        {...props}
      >
        {showDot && (
          <span
            style={{ backgroundColor: style.dot }}
            className="h-1.5 w-1.5 rounded-full"
          />
        )}
        {children || style.label}
      </span>
    );
  }

  const customVariantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    purple: 'bg-brand-purpleSubtle text-brand-purple border-purple-200',
    orange: 'bg-brand-orangeSubtle text-brand-orange border-orange-200',
    blue: 'bg-blue-50 text-brand-accentBlue border-blue-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border select-none',
        customVariantClasses[variant || 'default'],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
