// src/components/features/landing/PopularDestinations.tsx
'use client';

import React from 'react';
import { ArrowRight, PlaneTakeoff, Clock } from 'lucide-react';

const DESTINATIONS = [
  {
    country: 'United States (USA)',
    flag: '🇺🇸',
    transit: '3-5 Business Days',
    tag: 'Daily Express Flight',
    majorHub: 'JFK / ORD / LAX',
    gradient: 'from-blue-900 to-indigo-950',
  },
  {
    country: 'United Kingdom (UK)',
    flag: '🇬🇧',
    transit: '2-4 Business Days',
    tag: 'Direct London Route',
    majorHub: 'LHR / MAN',
    gradient: 'from-slate-900 to-blue-950',
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    transit: '3-5 Business Days',
    tag: 'Door to Door',
    majorHub: 'YYZ / YVR / YUL',
    gradient: 'from-red-950 to-slate-900',
  },
  {
    country: 'United Arab Emirates (UAE)',
    flag: '🇦🇪',
    transit: '2-3 Business Days',
    tag: 'Middle East Hub',
    majorHub: 'DXB / SHJ',
    gradient: 'from-emerald-950 to-slate-900',
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    transit: '4-6 Business Days',
    tag: 'Oceania Express',
    majorHub: 'SYD / MEL / BNE',
    gradient: 'from-sky-950 to-indigo-950',
  },
  {
    country: 'Germany & EU',
    flag: '🇩🇪',
    transit: '3-4 Business Days',
    tag: 'Europe Central',
    majorHub: 'FRA / CDG / AMS',
    gradient: 'from-amber-950 to-slate-900',
  },
] as const;

export function PopularDestinations(): React.JSX.Element {
  return (
    <section id="destinations" className="py-20 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-2">
              Ship to 215+ Countries &amp; Territories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Popular Export &amp; Courier Destinations
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Frequent daily outbound departures from Hazrat Shahjalal International Airport (DAC) and Chittagong Port.
            </p>
          </div>

          <a
            href="#rate-estimator"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-400 hover:text-orange-300 hover:underline"
          >
            <span>Calculate Destination Rates</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.country}
              className={`bg-gradient-to-br ${dest.gradient} border border-slate-700/80 rounded-2xl p-6 shadow-xl hover:border-orange-500/60 hover:-translate-y-1 transition-all group`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{dest.flag}</span>
                <span className="text-[11px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 rounded-full">
                  {dest.tag}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors mb-2">
                {dest.country}
              </h3>

              <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>Transit Time: <strong className="text-white">{dest.transit}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <PlaneTakeoff className="w-4 h-4 text-blue-400" />
                  <span>Hub Gateways: <span className="font-mono text-slate-400">{dest.majorHub}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
