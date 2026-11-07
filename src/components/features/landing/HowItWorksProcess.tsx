// src/components/features/landing/HowItWorksProcess.tsx
'use client';

import React from 'react';
import {
  FileText,
  CalendarCheck,
  Package,
  Plane,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

const STEPS = [
  {
    step: 1,
    title: 'Request a Quote',
    description: 'Select destination, cargo type, and weight for instant tariff pricing.',
    icon: FileText,
  },
  {
    step: 2,
    title: 'Book Your Shipment',
    description: 'Confirm shipper & consignee details and generate your 3-page AWB.',
    icon: CalendarCheck,
  },
  {
    step: 3,
    title: 'Cargo Collection',
    description: 'Our dispatch fleet collects your consignment from your factory or office.',
    icon: Package,
  },
  {
    step: 4,
    title: 'International Transit',
    description: 'Daily express flight departures with continuous milestone GPS telemetry.',
    icon: Plane,
  },
  {
    step: 5,
    title: 'Customs Clearance',
    description: 'Expedited export and import customs clearance at destination ports.',
    icon: ShieldCheck,
  },
  {
    step: 6,
    title: 'Final Delivery',
    description: 'Doorstep delivery to the consignee with signed Proof of Delivery (POD).',
    icon: CheckCircle,
  },
] as const;

export function HowItWorksProcess(): React.JSX.Element {
  return (
    <section id="process" className="py-20 lg:py-24 bg-[#F3F6FA] dark:bg-[#0B0F19] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E51B23]">
            <span className="w-1.5 h-3.5 rounded-full bg-[#E51B23]" />
            <span>How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simple Steps, Global Delivery
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            From factory pickup in Bangladesh to destination doorstep, experience seamless end-to-end logistics.
          </p>
        </div>

        {/* Desktop: Horizontal Timeline with Connecting Line */}
        <div className="hidden lg:block relative">
          {/* Subtle Connecting Line */}
          <div className="absolute top-6 left-12 right-12 h-0.5 border-t-2 border-dashed border-slate-300 dark:border-slate-700 -z-0" />

          <div className="grid grid-cols-6 gap-4 relative z-10">
            {STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex flex-col items-center text-center group">
                  {/* Step Number Circle */}
                  <div className="relative mb-5">
                    <div className="w-12 h-12 rounded-full bg-[#E51B23] text-white flex items-center justify-center font-extrabold text-base shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                  </div>

                  {/* Icon & Title */}
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center mb-3 group-hover:text-[#E51B23] group-hover:border-red-300 transition-colors shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-[#E51B23] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tablet: Vertical Timeline */}
        <div className="lg:hidden space-y-6 relative pl-6 border-l-2 border-dashed border-[#E51B23]/40 ml-4">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative group">
                {/* Step Pill on Left Border */}
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-[#E51B23] text-white flex items-center justify-center text-xs font-bold shadow-md">
                  {item.step}
                </div>

                <div className="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm ml-2">
                  <div className="flex items-center gap-2.5 mb-1">
                    <Icon className="w-4 h-4 text-[#E51B23]" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}