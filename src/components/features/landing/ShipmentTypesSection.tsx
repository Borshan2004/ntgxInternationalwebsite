// src/components/features/landing/ShipmentTypesSection.tsx
'use client';

import React from 'react';
import {
  FileText,
  Gift,
  ShoppingCart,
  Boxes,
  Send,
  Sparkles,
} from 'lucide-react';

const SHIPMENT_TYPES = [
  {
    title: 'Documents',
    description: 'Contracts, passports, educational certificates, and urgent bank paperwork.',
    icon: FileText,
    badge: 'Express Priority',
  },
  {
    title: 'Personal Parcels',
    description: 'Care packages, gifts, garments, and personal effects sent to loved ones abroad.',
    icon: Gift,
    badge: 'Door to Door',
  },
  {
    title: 'E-commerce Orders',
    description: 'Cross-border B2C fulfillment for online sellers, boutiques, and handicrafts.',
    icon: ShoppingCart,
    badge: 'Bulk Discount',
  },
  {
    title: 'Product Samples',
    description: 'Garments sample swatches, apparel prototypes, and lab test samples with rapid delivery.',
    icon: Sparkles,
    badge: 'Factory Direct',
  },
  {
    title: 'Commercial Cargo',
    description: 'Palletized freight, heavy machinery parts, and wholesale merchandise.',
    icon: Boxes,
    badge: 'Air & Sea',
  },
  {
    title: 'Export Shipments',
    description: 'Full commercial exports with EXP, commercial invoices, and customs documentation.',
    icon: Send,
    badge: 'B2B Tariff',
  },
] as const;

export function ShipmentTypesSection(): React.JSX.Element {
  return (
    <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E51B23]">
          <span className="w-1.5 h-3.5 rounded-full bg-[#E51B23]" />
          <span>What Are You Shipping?</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tailored Shipping Solutions for Every Item
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
          Select what you are shipping to find custom routing, special packaging, and negotiated rates.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {SHIPMENT_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.title}
              className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-between shadow-md hover:shadow-xl hover:border-red-300 dark:hover:border-red-900/50 hover:-translate-y-1 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50/60 dark:bg-slate-800 border border-red-100/80 dark:border-slate-700 group-hover:bg-red-50 dark:group-hover:bg-red-950/50 group-hover:border-red-200 dark:group-hover:border-red-900/50 flex items-center justify-center text-[#E51B23] transition-colors mb-3 shadow-xs">
                <Icon className="w-6 h-6 stroke-[1.75]" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#E51B23] transition-colors mb-1.5">
                  {type.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {type.description}
                </p>
              </div>

              <span className="mt-3 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 group-hover:bg-red-100 dark:group-hover:bg-red-950/50 group-hover:text-red-700 dark:group-hover:text-red-400 px-2.5 py-0.5 rounded-full transition-colors">
                {type.badge}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
