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
    description: 'Comprehensive support for international express courier and door-to-door deliveries worldwide.',
    icon: Plane,
  },
  {
    title: 'Business-Focused Solutions',
    description: 'Specialized corporate tariff accounts, bulk invoicing, and commercial export logistics.',
    icon: Users2,
  },
  {
    title: 'Shipment Visibility',
    description: 'Milestone scan telemetry and live tracking from pickup in Bangladesh to destination consignee.',
    icon: ShieldCheck,
  },
  {
    title: 'Logistics & Customs Support',
    description: 'End-to-end guidance for HS tariff classification, commercial invoice generation, and clearance.',
    icon: Settings,
  },
  {
    title: 'Flexible Shipping Options',
    description: 'Choose between International Priority, Economy Air Cargo, and Ocean Containerized Freight.',
    icon: Shuffle,
  },
  {
    title: 'Dedicated Customer Support',
    description: 'Direct phone, email, and WhatsApp dispatch coordination for prompt exception handling.',
    icon: Headset,
  },
] as const;

export function WhyChooseSection(): React.JSX.Element {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-2">
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
          className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline shrink-0"
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
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 group-hover:bg-orange-50 group-hover:text-orange-600 flex items-center justify-center mb-4 transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
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
