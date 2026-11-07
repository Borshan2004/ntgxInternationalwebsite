// src/components/features/landing/IndustriesServedSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import {
  Shirt,
  Factory,
  Sprout,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';

const INDUSTRIES = [
  {
    title: 'Ready-Made Garments & Textiles',
    badge: 'RMG Sector',
    image: '/images/industry-garments.jpg',
    description: 'Fast sample approvals, urgent size-set dispatches, and full production export garment air shipments.',
    icon: Shirt,
  },
  {
    title: 'Industrial Manufacturing & Machinery',
    badge: 'Heavy Cargo',
    image: '/images/industry-machinery.jpg',
    description: 'Industrial machinery, engineering components, and replacement parts with customs documentation priority.',
    icon: Factory,
  },
  {
    title: 'Jute & Diversified Eco Exports',
    badge: 'Eco Export',
    image: '/images/service-warehouse-cinematic.jpg',
    description: 'Export shipping for biodegradable packaging, twine, hessian cloth, and handicraft bags.',
    icon: Sprout,
  },
  {
    title: 'Cross-Border E-Commerce & D2C',
    badge: 'B2C Delivery',
    image: '/images/service-air-courier-cinematic.jpg',
    description: 'Global parcel shipping for Shopify, Etsy, and domestic artisan brands delivering to international customers.',
    icon: ShoppingBag,
  },
] as const;

export function IndustriesServedSection(): React.JSX.Element {
  return (
    <section id="industries" className="py-20 lg:py-24 bg-white dark:bg-[#0B0F19] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E51B23]">
            <span className="w-1.5 h-3.5 rounded-full bg-[#E51B23]" />
            <span>Industries We Serve</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Industry-Specific Shipping Solutions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            Specialized freight workflows engineered for Bangladesh&apos;s primary commercial export sectors.
          </p>
        </div>

        {/* 4 Image-Based Industry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIES.map((ind) => (
            <div
              key={ind.title}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-lg border border-slate-200/90 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-end p-5"
            >
              {/* Authentic Photo */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={ind.image}
                  alt={ind.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  quality={90}
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/15 group-hover:from-slate-950/90 transition-colors" />
              </div>

              {/* Top Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-[#E51B23]/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs">
                  {ind.badge}
                </span>
              </div>

              {/* Bottom Details */}
              <div className="relative z-10 space-y-1.5 text-white">
                <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
                  {ind.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 font-normal leading-relaxed">
                  {ind.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Navy Case Study Panel */}
        <div className="mt-16 bg-[#08172B] dark:bg-[#040C17] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#E51B23]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left: Case Study Information & Real Metrics */}
          <div className="lg:col-span-7 space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E51B23]/20 border border-[#E51B23]/40 text-red-300 text-xs font-bold uppercase tracking-wider">
              <span>Verified Case Study</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bangladesh &rarr; USA Garments Commercial Shipment
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Assisted a leading knitwear export manufacturer in Gazipur with an urgent delivery of 2,800 kg apparel cargo to Newark (EWR) to meet strict department store launch deadlines.
            </p>

            {/* 3 Metrics Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-[#10243D] border border-slate-700/80 p-3 rounded-xl text-center">
                <div className="text-lg sm:text-xl font-extrabold text-[#E51B23]">2,800 KG</div>
                <div className="text-[11px] text-slate-400 font-medium">Chargeable Weight</div>
              </div>

              <div className="bg-[#10243D] border border-slate-700/80 p-3 rounded-xl text-center">
                <div className="text-lg sm:text-xl font-extrabold text-emerald-400">100%</div>
                <div className="text-[11px] text-slate-400 font-medium">On-Time Delivery</div>
              </div>

              <div className="bg-[#10243D] border border-slate-700/80 p-3 rounded-xl text-center">
                <div className="text-lg sm:text-xl font-extrabold text-white">4 Hours</div>
                <div className="text-[11px] text-slate-400 font-medium">Customs Clearance</div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#rate-estimator"
                className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
              >
                <span>Request a Custom Quote for Your Sector</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right: Large Port & Ship Photograph */}
          <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80">
            <Image
              src="/images/hero-port-sunset.jpg"
              alt="Container Port and Vessel Logistics"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              quality={90}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-slate-200 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center justify-between">
              <span>ROUTE: DAC &rarr; EWR (JFK)</span>
              <span className="text-emerald-400 font-bold">&bull; CLEARED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}