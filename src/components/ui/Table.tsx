// src/components/ui/Table.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  readonly header: string;
  readonly key: string;
  readonly render?: (row: T) => React.ReactNode;
  readonly width?: string;
  readonly align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  readonly columns: readonly Column<T>[];
  readonly data: readonly T[];
  readonly keyExtractor: (row: T) => string;
  readonly emptyMessage?: string;
  readonly onRowClick?: (row: T) => void;
  readonly className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found.',
  onRowClick,
  className,
}: TableProps<T>): React.ReactElement {
  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-lg border border-neutral-border bg-white shadow-card',
        className
      )}
    >
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-neutral-surfaceMuted border-b border-neutral-border">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cn(
                  'px-3 py-2.5 font-bold uppercase tracking-wider text-neutral-textSecondary select-none whitespace-nowrap',
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                    ? 'text-right'
                    : 'text-left'
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-border">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-neutral-textMuted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'transition-colors hover:bg-neutral-surfaceMuted',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-3 py-2.5 text-neutral-textPrimary whitespace-nowrap',
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String(
                          (row as Record<string, unknown>)[col.key] ?? ''
                        )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
