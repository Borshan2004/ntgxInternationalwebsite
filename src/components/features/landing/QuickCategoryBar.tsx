// src/components/features/landing/QuickCategoryBar.tsx
'use client';

import React from 'react';
import { Plane, Package, Send, Building, ShieldCheck, Globe } from 'lucide-react';

const CATEGORIES = [
  {
    title: 'International Courier',
    icon: Plane,
    color: 'text-red-600 bg-red-50 border-red-100',
    href: '#services',
  },
  {
    title: 'Export Logistics',
    icon: Package,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    href: '#services',
  },
  {
    title: 'Air & Sea Freight',
    icon: Send,
    color: 'text-slate-700 bg-slate-100 border-slate-200',
    href: '#services',
  },
  {
    title: 'Corporate Accounts',
    icon: Building,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    href: '#industries',
  },
  {
    title: 'Customs Clearance',
    icon: ShieldCheck,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    href: '#faq',
  },
  {
    title: 'Global Delivery',
    icon: Globe,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    href: '#destinations',
  },
] as const;

export function QuickCategoryBar(): React.JSX.Element {
  return (
    <div className="bg-white dark:bg-[#111827] border-b border-slate-200/80 dark:border-slate-800 py-5 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <a
              key={cat.title}
              href={cat.href}
              className="flex flex-col items-center text-center p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-red-200 dark:hover:border-red-900/50 hover:shadow-sm transition-all group bg-slate-50/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-105 border ${cat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#E51919] transition-colors">
                {cat.title}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
