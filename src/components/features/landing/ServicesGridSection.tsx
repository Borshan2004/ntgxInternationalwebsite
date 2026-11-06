// src/components/features/landing/ServicesGridSection.tsx
'use client';

import React from 'react';
import { ArrowRight, Plane, Box, Anchor, FileCheck } from 'lucide-react';

const SERVICES = [
  {
    title: 'International Courier',
    description: 'Time-definite documents, sample parcels, and express door-to-door international shipments.',
    icon: Plane,
    tag: 'Express Priority',
    color: 'from-slate-900 to-slate-950',
  },
  {
    title: 'Air Freight Cargo',
    description: 'Scheduled commercial cargo space on major international passenger & freighter flights for heavy air cargo.',
    icon: Box,
    tag: 'Commercial Cargo',
    color: 'from-blue-900 to-slate-950',
  },
  {
    title: 'Ocean / Sea Freight',
    description: 'FCL (Full Container Load) and LCL consolidation from Chittagong Port to key European & North American hubs.',
    icon: Anchor,
    tag: 'Ocean Freight',
    color: 'from-[#0B1E38] to-[#071324]',
  },
  {
    title: 'Export Logistics & Compliance',
    description: 'Comprehensive EXP certification, GSP/COO documentation, customs clearance, and courier dispatch.',
    icon: FileCheck,
    tag: 'Full Compliance',
    color: 'from-slate-900 to-red-950',
  },
] as const;

export function ServicesGridSection(): React.JSX.Element {
  return (
    <section id="services" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E51919] block mb-2">
              Our Core Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              International Shipping Services
            </h2>
          </div>

          <a
            href="#rate-estimator"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E51919] hover:underline"
          >
            <span>Get an Instant Quote</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.title}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group"
              >
                {/* Visual Header Banner */}
                <div className={`h-36 bg-gradient-to-br ${srv.color} p-5 flex flex-col justify-between text-white relative`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-white/10 border border-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                      {srv.tag}
                    </span>
                    <Icon className="w-7 h-7 text-red-400 opacity-90" />
                  </div>
                  <h3 className="text-lg font-bold leading-snug drop-shadow-sm">
                    {srv.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-normal">
                    {srv.description}
                  </p>

                  <a
                    href="#rate-estimator"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E51919] hover:text-[#C81212] group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Check Rates &amp; Transit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
