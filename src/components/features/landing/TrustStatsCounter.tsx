// src/components/features/landing/TrustStatsCounter.tsx
'use client';

import React from 'react';
import { Calendar, Globe2, Package, Users } from 'lucide-react';

const STATS = [
  {
    icon: Calendar,
    value: '8+',
    label: 'Years of Experience',
  },
  {
    icon: Globe2,
    value: '215+',
    label: 'Countries Worldwide',
  },
  {
    icon: Package,
    value: '10,000+',
    label: 'Successful Shipments',
  },
  {
    icon: Users,
    value: '5,350+',
    label: 'Worldwide Clients',
  },
] as const;

export function TrustStatsCounter(): React.JSX.Element {
  return (
    <div className="bg-[#08172B] dark:bg-[#040C17] border-y border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white transition-colors">
      {/* Subtle world map or grid decoration in background */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`flex items-center justify-center gap-4 py-2 ${
                idx < STATS.length - 1 ? 'lg:border-r lg:border-slate-800' : ''
              }`}
            >
              {/* Red Line Icon in Rounded Square */}
              <div className="w-13 h-13 rounded-2xl bg-[#E51B23]/10 border border-[#E51B23]/30 text-[#E51B23] flex items-center justify-center shrink-0 shadow-sm">
                <Icon className="w-6 h-6 stroke-[1.75]" />
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}