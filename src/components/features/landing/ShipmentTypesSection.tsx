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
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-2">
          What Are You Shipping?
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Tailored Shipping Solutions for Every Item
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Select what you are shipping to find custom routing, special packaging, and negotiated rates.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {SHIPMENT_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.title}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 text-center flex flex-col items-center justify-between shadow-sm hover:shadow-lg hover:border-orange-300 hover:-translate-y-1 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-200 flex items-center justify-center text-blue-900 group-hover:text-orange-600 transition-colors mb-3">
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors mb-1.5">
                  {type.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  {type.description}
                </p>
              </div>

              <span className="mt-3 text-[10px] font-bold text-slate-600 bg-slate-100 group-hover:bg-orange-100 group-hover:text-orange-700 px-2.5 py-0.5 rounded-full transition-colors">
                {type.badge}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
