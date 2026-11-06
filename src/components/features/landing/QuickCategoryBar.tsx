// src/components/features/landing/QuickCategoryBar.tsx
'use client';

import React from 'react';
import { Plane, Package, Send, Building, ShieldCheck, Globe } from 'lucide-react';

const CATEGORIES = [
  {
    title: 'International Courier',
    icon: Plane,
    color: 'text-orange-600 bg-orange-50 border-orange-100',
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
    color: 'text-purple-600 bg-purple-50 border-purple-100',
    href: '#services',
  },
  {
    title: 'Business Shipping',
    icon: Building,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    href: '#industries',
  },
  {
    title: 'Customs Support',
    icon: ShieldCheck,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    href: '#faq',
  },
  {
    title: 'Global Delivery',
    icon: Globe,
    color: 'text-sky-600 bg-sky-50 border-sky-100',
    href: '#destinations',
  },
] as const;

export function QuickCategoryBar(): React.JSX.Element {
  return (
    <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <a
              key={cat.title}
              href={cat.href}
              className="flex flex-col items-center text-center p-3.5 rounded-xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all group bg-slate-50/50 hover:bg-white"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 border ${cat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                {cat.title}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
