'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  PackagePlus,
  Package,
  Search,
  BarChart2,
  Users,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types/shipment';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface SidebarProps {
  readonly currentPath: string;
  readonly userRole: UserRole;
  readonly userName: string;
  readonly organizationName: string;
  readonly isCollapsed: boolean;
  readonly onToggleCollapse: () => void;
}

interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: React.ElementType;
  readonly roles: readonly UserRole[];
}

const NAV_ITEMS: readonly NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'EMPLOYEE', 'CUSTOMER', 'DRIVER'],
  },
  {
    label: 'New Shipment',
    href: '/shipments/new',
    icon: PackagePlus,
    roles: ['ADMIN', 'EMPLOYEE', 'CUSTOMER'],
  },
  {
    label: 'Shipments',
    href: '/shipments',
    icon: Package,
    roles: ['ADMIN', 'EMPLOYEE', 'CUSTOMER', 'DRIVER'],
  },
  {
    label: 'Tracking',
    href: '/tracking',
    icon: Search,
    roles: ['ADMIN', 'EMPLOYEE', 'CUSTOMER', 'DRIVER'],
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: BarChart2,
    roles: ['ADMIN', 'EMPLOYEE', 'CUSTOMER'],
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
    roles: ['ADMIN', 'EMPLOYEE'],
  },
  {
    label: 'Rate Cards',
    href: '/admin/rates',
    icon: DollarSign,
    roles: ['ADMIN'],
  },
  {
    label: 'Support',
    href: '/support',
    icon: HelpCircle,
    roles: ['ADMIN', 'EMPLOYEE', 'CUSTOMER', 'DRIVER'],
  },
] as const;

export function Sidebar({
  currentPath,
  userRole,
  userName,
  organizationName,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps): React.JSX.Element {
  const visibleItems = NAV_ITEMS.filter((item) =>
    (item.roles as readonly string[]).includes(userRole)
  );

  const initials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'NX';

  return (
    <aside
      aria-label="Sidebar navigation"
      className={cn(
        'relative flex flex-col border-r border-neutral-200 dark:border-slate-800 bg-white dark:bg-[#111827] transition-all duration-300 ease-in-out select-none shadow-sm',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Section Header & Collapse Toggle */}
      <div
        className={cn(
          'flex h-11 items-center border-b border-neutral-100 dark:border-slate-800 bg-white dark:bg-[#111827] px-3',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        {!isCollapsed && (
          <span className="text-2xs font-bold uppercase tracking-wider text-neutral-400">
            Logistics Console
          </span>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="Main menu">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          let isActive = false;
          if (item.href === '/dashboard') {
            isActive = currentPath === '/dashboard';
          } else if (item.href === '/shipments/new') {
            isActive = currentPath === '/shipments/new';
          } else if (item.href === '/shipments') {
            isActive =
              currentPath === '/shipments' ||
              (currentPath.startsWith('/shipments/') && currentPath !== '/shipments/new');
          } else {
            isActive = currentPath.startsWith(item.href);
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-ntgx-red text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isActive ? 'text-white' : 'text-neutral-500 group-hover:text-ntgx-red',
                  !isCollapsed && 'mr-3'
                )}
              />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Appearance & Dark Mode Switch */}
      <div className="border-t border-neutral-200 dark:border-slate-800 p-2.5">
        <div className={cn('flex items-center', isCollapsed ? 'justify-center' : 'justify-between px-1.5')}>
          {!isCollapsed && (
            <span className="text-2xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Mode
            </span>
          )}
          <ThemeToggle variant={isCollapsed ? 'icon' : 'pill'} size="sm" />
        </div>
      </div>

      {/* Organization & User Footer */}
      <div className="border-t border-neutral-200 dark:border-slate-800 p-3">
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-lg bg-neutral-50 dark:bg-slate-800/80 p-2',
            isCollapsed && 'justify-center p-1.5'
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ntgx-red text-xs font-bold text-white shadow-xs">
            {initials}
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-neutral-900 dark:text-neutral-100">{userName}</p>
              <div className="flex items-center gap-1 text-2xs text-neutral-500 dark:text-neutral-400">
                <Building2 className="h-3 w-3 shrink-0" />
                <span className="truncate">{organizationName}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
