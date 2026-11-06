// src/components/features/landing/HowItWorksProcess.tsx
'use client';

import React from 'react';
import {
  Calculator,
  ClipboardCheck,
  Truck,
  FileCheck2,
  Plane,
  Home,
  ArrowRight,
} from 'lucide-react';

const STEPS = [
  {
    step: 1,
    title: 'Get a Quote',
    description: 'Provide destination, item type, and weight to view instant transparent pricing.',
    icon: Calculator,
  },
  {
    step: 2,
    title: 'Book Shipment',
    description: 'Confirm receiver address, commercial details, and download your barcode AWB.',
    icon: ClipboardCheck,
  },
  {
    step: 3,
    title: 'Free Pickup',
    description: 'Our courier collects the parcel from your factory, office, or residence in Dhaka.',
    icon: Truck,
  },
  {
    step: 4,
    title: 'Customs & Sort',
    description: 'Export clearance, airport security screening, and international pallet tagging.',
    icon: FileCheck2,
  },
  {
    step: 5,
    title: 'Global Transit',
    description: 'Daily direct flight departures with 24/7 GPS & milestone scan telemetry.',
    icon: Plane,
  },
  {
    step: 6,
    title: 'Doorstep Delivery',
    description: 'Final delivery to consignee with signature verification & proof of delivery (POD).',
    icon: Home,
  },
] as const;

export function HowItWorksProcess(): React.JSX.Element {
  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E51919] block mb-2">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            A Simple, Streamlined Shipping Process
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            From Dhaka pickup to global delivery, experience end-to-end transparency at every step.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="flex flex-col items-center text-center relative group">
                {/* Connecting arrow for desktop */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 -right-3 text-slate-300 pointer-events-none">
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-red-300 transition-colors" />
                  </div>
                )}

                {/* Step Circle with Number */}
                <div className="relative mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#E51919] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-red-600/25 group-hover:scale-105 transition-transform">
                    {item.step}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-[#E51919] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
