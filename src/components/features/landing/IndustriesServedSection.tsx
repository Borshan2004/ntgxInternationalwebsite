// src/components/features/landing/IndustriesServedSection.tsx
'use client';

import React from 'react';
import { Shirt, Sprout, Briefcase, ShoppingBag, Factory, Building, ArrowRight, CheckCircle2 } from 'lucide-react';

const INDUSTRIES = [
  {
    title: 'Garments & Ready-Made Textiles',
    description: 'Fast sample approvals, urgent size-set dispatches, and full production garment air shipments.',
    icon: Shirt,
    badge: 'RMG Sector',
  },
  {
    title: 'Jute & Diversified Eco Products',
    description: 'Export shipping for biodegradable packaging, twine, hessian cloth, and handicraft bags.',
    icon: Sprout,
    badge: 'Eco Export',
  },
  {
    title: 'Leather & Footwear',
    description: 'Secure export handling for finished leather goods, footwear prototypes, and commercial consignments.',
    icon: Briefcase,
    badge: 'High Value',
  },
  {
    title: 'Cross-Border E-Commerce',
    description: 'International parcel shipping for Etsy, Shopify, and local artisan boutiques delivering globally.',
    icon: ShoppingBag,
    badge: 'B2C Delivery',
  },
  {
    title: 'Manufacturing & Pharmaceuticals',
    description: 'Temperature-sensitive and industrial machinery replacement parts with customs documentation priority.',
    icon: Factory,
    badge: 'Industrial',
  },
  {
    title: 'Global Buying Houses',
    description: 'Bulk multi-vendor sample consolidation, lab testing couriers, and international buyer liaison.',
    icon: Building,
    badge: 'Liaison Support',
  },
] as const;

export function IndustriesServedSection(): React.JSX.Element {
  return (
    <section id="industries" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-2">
            Industries We Serve
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Industry-Specific Export Solutions
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Engineered logistics workflows optimized for Bangladesh&apos;s leading export sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.title}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {ind.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {ind.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {ind.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Real Case Study Banner */}
        <div className="mt-14 bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
              Verified Case Study
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bangladesh &rarr; USA Garments Commercial Shipment
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Assisted an apparel exporter in Gazipur with shipping 2,800 kg of knitwear to Newark (EWR),
              achieving complete customs clearance and final warehouse delivery in just 4 business days.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Zero Customs Delay
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                100% Real-Time Milestone Visibility
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Competitive B2B Tariff
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-600/30 transition-all"
            >
              <span>Explore Business Tariff</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
