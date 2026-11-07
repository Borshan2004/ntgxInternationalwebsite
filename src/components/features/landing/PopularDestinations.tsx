// src/components/features/landing/PopularDestinations.tsx
'use client';

import React from 'react';
import { ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

const DESTINATIONS = [
  {
    country: 'United States (USA)',
    code: 'US',
    flag: '🇺🇸',
    transit: '3-5 Days',
    majorHub: 'JFK / ORD / LAX',
  },
  {
    country: 'United Kingdom (UK)',
    code: 'GB',
    flag: '🇬🇧',
    transit: '2-4 Days',
    majorHub: 'LHR / MAN',
  },
  {
    country: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    transit: '3-5 Days',
    majorHub: 'YYZ / YVR / YUL',
  },
  {
    country: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    transit: '4-6 Days',
    majorHub: 'SYD / MEL / BNE',
  },
  {
    country: 'United Arab Emirates',
    code: 'AE',
    flag: '🇦🇪',
    transit: '2-3 Days',
    majorHub: 'DXB / SHJ',
  },
  {
    country: 'Germany & EU',
    code: 'DE',
    flag: '🇩🇪',
    transit: '3-4 Days',
    majorHub: 'FRA / CDG / AMS',
  },
] as const;

export function PopularDestinations(): React.JSX.Element {
  return (
    <section id="destinations" className="py-20 lg:py-24 bg-[#08172B] dark:bg-[#040C17] text-white relative overflow-hidden transition-colors">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E51B23]">
              <span className="w-1.5 h-3.5 rounded-full bg-[#E51B23]" />
              <span>Global Destinations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Worldwide Reach, Global Impact
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal">
              We connect Bangladesh to major destinations across the globe with reliable shipping solutions and daily outbound flights.
            </p>
          </div>

          <a
            href="#rate-estimator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-[#E51B23] hover:bg-[#C81212] active:bg-[#9B0E0E] shadow-md shadow-red-600/30 hover:scale-105 transition-all shrink-0 self-start md:self-auto"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 2-Column Grid: World Map Route Visualization + Destination Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive World Map with Red Flight Arcs */}
          <div className="lg:col-span-7 bg-[#10243D]/60 border border-slate-700/70 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden min-h-[380px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Hazrat Shahjalal Int&apos;l Airport Hub (DAC) &bull; Live Telemetry</span>
              </div>
              <span className="text-[11px] font-semibold text-[#E51B23] bg-red-500/10 border border-red-500/30 px-2.5 py-0.5 rounded-full">
                215+ Active Corridors
              </span>
            </div>

            {/* Stylized SVG Map Graphics with Curved Red Route Arcs */}
            <div className="relative my-4 flex-1 flex items-center justify-center">
              <svg viewBox="0 0 800 420" className="w-full h-auto select-none">
                <defs>
                  <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E51B23" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FF4D4D" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Continental Silhouette Paths */}
                {/* North America */}
                <path
                  d="M140 100 Q 200 80 240 130 T 210 220 T 150 200 Z"
                  fill="#1C3558"
                  opacity="0.45"
                />
                {/* South America */}
                <path
                  d="M240 240 Q 280 260 270 330 T 230 380 T 210 290 Z"
                  fill="#1C3558"
                  opacity="0.35"
                />
                {/* Europe */}
                <path
                  d="M380 90 Q 430 80 460 120 T 420 160 T 370 120 Z"
                  fill="#1C3558"
                  opacity="0.45"
                />
                {/* Africa */}
                <path
                  d="M400 170 Q 450 180 470 240 T 420 320 T 380 230 Z"
                  fill="#1C3558"
                  opacity="0.35"
                />
                {/* Asia */}
                <path
                  d="M480 80 Q 600 70 680 130 T 630 220 T 520 170 Z"
                  fill="#1C3558"
                  opacity="0.5"
                />
                {/* Australia */}
                <path
                  d="M620 270 Q 690 260 700 320 T 630 350 T 600 300 Z"
                  fill="#1C3558"
                  opacity="0.4"
                />

                {/* Bangladesh Origin Node (approx coordinates: x=535, y=180) */}
                {/* Flight Arcs to Destinations */}
                {/* Route 1: Bangladesh -> New York (x=210, y=140) */}
                <path
                  d="M 535 180 Q 370 40 210 140"
                  fill="none"
                  stroke="url(#routeGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="6,4"
                />
                {/* Route 2: Bangladesh -> London (x=390, y=110) */}
                <path
                  d="M 535 180 Q 460 80 390 110"
                  fill="none"
                  stroke="url(#routeGrad)"
                  strokeWidth="2"
                  strokeDasharray="5,3"
                />
                {/* Route 3: Bangladesh -> Dubai (x=450, y=170) */}
                <path
                  d="M 535 180 Q 490 150 450 170"
                  fill="none"
                  stroke="url(#routeGrad)"
                  strokeWidth="2"
                  strokeDasharray="4,3"
                />
                {/* Route 4: Bangladesh -> Sydney (x=660, y=310) */}
                <path
                  d="M 535 180 Q 620 230 660 310"
                  fill="none"
                  stroke="url(#routeGrad)"
                  strokeWidth="2"
                  strokeDasharray="5,3"
                />
                {/* Route 5: Bangladesh -> Toronto (x=195, y=125) */}
                <path
                  d="M 535 180 Q 340 30 195 125"
                  fill="none"
                  stroke="url(#routeGrad)"
                  strokeWidth="1.75"
                  strokeDasharray="6,4"
                />

                {/* Destination Nodes */}
                {/* New York */}
                <circle cx="210" cy="140" r="4.5" fill="#E51B23" />
                <text x="210" y="125" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">USA (JFK)</text>

                {/* London */}
                <circle cx="390" cy="110" r="4" fill="#E51B23" />
                <text x="390" y="95" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">UK (LHR)</text>

                {/* Dubai */}
                <circle cx="450" cy="170" r="4" fill="#E51B23" />
                <text x="450" y="195" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">UAE (DXB)</text>

                {/* Sydney */}
                <circle cx="660" cy="310" r="4" fill="#E51B23" />
                <text x="660" y="335" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">Australia (SYD)</text>

                {/* DHAKA ORIGIN HUB (Pulsing Red) */}
                <circle cx="535" cy="180" r="9" fill="#E51B23" opacity="0.3" className="animate-ping" />
                <circle cx="535" cy="180" r="6" fill="#E51B23" />
                <circle cx="535" cy="180" r="2.5" fill="#FFFFFF" />
                <text x="535" y="165" fill="#FF4D4D" fontSize="12" fontWeight="900" textAnchor="middle">DHAKA HUB (BD)</text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/60">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Direct passenger &amp; dedicated cargo freighters
              </span>
              <span className="font-mono text-slate-300">24/7 Scan Telemetry</span>
            </div>
          </div>

          {/* Right Column: Destination Cards with Country Flags and Transit Times */}
          <div className="lg:col-span-5 space-y-3">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.country}
                className="bg-[#10243D]/70 hover:bg-[#10243D] border border-slate-700/70 hover:border-red-500/50 rounded-2xl p-4 transition-all flex items-center justify-between group shadow-lg"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl select-none">{dest.flag}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                      {dest.country}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Hubs: {dest.majorHub}
                    </p>
                  </div>
                </div>

                {/* Red Transit Pill Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E51B23] text-white text-xs font-bold shadow-md shadow-red-600/30">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{dest.transit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}