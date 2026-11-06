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
    gradient: 'from-[#071324] to-[#0D1F38]',
  },
  {
    country: 'United Kingdom (UK)',
    flag: '🇬🇧',
    transit: '2-4 Business Days',
    tag: 'Direct London Route',
    majorHub: 'LHR / MAN',
    gradient: 'from-[#09182E] to-[#0A1322]',
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    transit: '3-5 Business Days',
    tag: 'Door to Door',
    majorHub: 'YYZ / YVR / YUL',
    gradient: 'from-[#141220] to-[#0A1322]',
  },
  {
    country: 'United Arab Emirates (UAE)',
    flag: '🇦🇪',
    transit: '2-3 Business Days',
    tag: 'Middle East Hub',
    majorHub: 'DXB / SHJ',
    gradient: 'from-[#0B1E28] to-[#0A1322]',
  },
  {
    country: 'Australia',
    flag: '🇦🇺',
    transit: '4-6 Business Days',
    tag: 'Oceania Express',
    majorHub: 'SYD / MEL / BNE',
    gradient: 'from-[#09192C] to-[#08121E]',
  },
  {
    country: 'Germany & EU',
    flag: '🇩🇪',
    transit: '3-4 Business Days',
    tag: 'Europe Central',
    majorHub: 'FRA / CDG / AMS',
    gradient: 'from-[#161824] to-[#0A1322]',
  },
] as const;

export function PopularDestinations(): React.JSX.Element {
  return (
    <section id="destinations" className="py-20 bg-[#07111E] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/15 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-2">
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
            className="inline-flex items-center gap-1.5 text-sm font-bold text-red-400 hover:text-red-300 hover:underline"
          >
            <span>Calculate Destination Rates</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.country}
              className={`bg-gradient-to-br ${dest.gradient} border border-slate-700/80 rounded-2xl p-6 shadow-xl hover:border-red-500/60 hover:-translate-y-1 transition-all group`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{dest.flag}</span>
                <span className="text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-full">
                  {dest.tag}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors mb-2">
                {dest.country}
              </h3>

              <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span>Transit: <strong className="text-white">{dest.transit}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <PlaneTakeoff className="w-4 h-4 text-slate-400" />
                  <span>Gateways: <span className="font-mono text-slate-300">{dest.majorHub}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
