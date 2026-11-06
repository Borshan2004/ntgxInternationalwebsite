// src/components/features/landing/WhyChooseSection.tsx
'use client';

import React from 'react';
import {
  Plane,
  Users2,
  ShieldCheck,
  Settings,
  Shuffle,
  Headset,
  ArrowRight,
} from 'lucide-react';

const FEATURES = [
  {
    title: 'International Shipping',
    description: 'Direct air express courier connections and scheduled sea cargo departures worldwide.',
    icon: Plane,
  },
  {
    title: 'Business-Focused Tariffs',
    description: 'Corporate volume discounts, bulk invoicing, and specialized commercial RMG export rates.',
    icon: Users2,
  },
  {
    title: 'Shipment Visibility',
    description: 'Comprehensive milestone scan telemetry from factory pickup in Bangladesh to consignee delivery.',
    icon: ShieldCheck,
  },
  {
    title: 'Logistics & Customs Support',
    description: 'End-to-end guidance for HS tariff classification, commercial invoice generation, and clearance.',
    icon: Settings,
  },
  {
    title: 'Flexible Transit Options',
    description: 'Select International Priority for urgent air delivery or Ocean Freight for cost-effective heavy cargo.',
    icon: Shuffle,
  },
  {
    title: 'Dedicated Operations Desk',
    description: 'Direct phone, email, and WhatsApp dispatch coordination for prompt exception handling.',
    icon: Headset,
  },
] as const;

export function WhyChooseSection(): React.JSX.Element {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E51919] block mb-2">
            Why Choose NTGX
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Reliable Shipping Solutions for a Global World
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
            We provide secure, efficient, and cost-effective international shipping and export logistics solutions
            from Dhaka, Chittagong, and across Bangladesh.
          </p>
        </div>

        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E51919] hover:underline shrink-0"
        >
          <span>More About Our Operations</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-red-200 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 group-hover:bg-red-50 group-hover:text-[#E51919] group-hover:border-red-100 flex items-center justify-center mb-4 transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#E51919] transition-colors">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
