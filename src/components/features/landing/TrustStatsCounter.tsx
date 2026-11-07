// src/components/features/landing/TrustStatsCounter.tsx
'use client';

import React from 'react';
import { Award, Globe2, PackageCheck, Users, Handshake, Headphones } from 'lucide-react';

const STATS = [
  {
    icon: Award,
    value: '8+',
    label: 'Years of Experience',
  },
  {
    icon: Globe2,
    value: '215+',
    label: 'Countries Worldwide',
  },
  {
    icon: PackageCheck,
    value: '10,000+',
    label: 'Successful Shipments',
  },
  {
    icon: Users,
    value: '5,350+',
    label: 'Worldwide Clients',
  },
  {
    icon: Handshake,
    value: '6+',
    label: 'Logistics Partners',
  },
  {
    icon: Headphones,
    value: '100%',
    label: 'Customer Support',
  },
] as const;

export function TrustStatsCounter(): React.JSX.Element {
  return (
    <div className="bg-slate-50 dark:bg-[#111827] border-y border-slate-200/80 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex flex-col items-center group">
              <div className="w-14 h-14 rounded-full bg-blue-900 text-white flex items-center justify-center mb-3 shadow-md group-hover:bg-[#E51919] transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
