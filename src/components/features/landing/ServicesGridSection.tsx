// src/components/features/landing/ServicesGridSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const SERVICES = [
  {
    title: 'International Courier',
    tag: 'Express Priority',
    description: 'Time-definite documents, sample parcels, and express door-to-door international shipments worldwide.',
    image: '/images/service-air-courier-cinematic.jpg',
    href: '#rate-estimator',
  },
  {
    title: 'Air Freight Cargo',
    tag: 'Commercial Cargo',
    description: 'Scheduled commercial cargo space on major international freighters & passenger flights for heavy freight.',
    image: '/images/service-air-cargo-cinematic.jpg',
    href: '#rate-estimator',
  },
  {
    title: 'Ocean / Sea Freight',
    tag: 'Ocean Freight FCL & LCL',
    description: 'FCL (Full Container Load) and LCL consolidation from Chittagong Port to major international sea hubs.',
    image: '/images/service-ocean-cargo-cinematic.jpg',
    href: '#rate-estimator',
  },
  {
    title: 'Export Logistics & Compliance',
    tag: 'Customs & EXP',
    description: 'Comprehensive EXP certification, GSP/COO documentation, customs clearance, and bonded dispatch.',
    image: '/images/service-warehouse-cinematic.jpg',
    href: '#rate-estimator',
  },
] as const;

export function ServicesGridSection(): React.JSX.Element {
  return (
    <section id="services" className="py-20 lg:py-24 bg-white dark:bg-[#0B0F19] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E51B23]">
              <span className="w-1.5 h-3.5 rounded-full bg-[#E51B23]" />
              <span>Our Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Comprehensive Logistics Solutions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl font-normal">
              From urgent documents to large-scale commercial cargo, we handle it all with care and precision.
            </p>
          </div>

          <a
            href="#rate-estimator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-[#E51B23] hover:bg-[#C81212] active:bg-[#9B0E0E] shadow-md shadow-red-600/30 hover:scale-105 transition-all shrink-0 self-start md:self-auto"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Premium Photographic Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((srv) => (
            <div
              key={srv.title}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-end p-6"
            >
              {/* Background Photographic Asset */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={srv.image}
                  alt={srv.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  quality={90}
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 select-none"
                />
                {/* Cinematic Dark Gradient Mask: keeps image visible while text remains legible */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20 group-hover:from-slate-950/95 transition-colors duration-300" />
              </div>

              {/* Card Top Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/40 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full">
                  {srv.tag}
                </span>
              </div>

              {/* Card Content at Bottom */}
              <div className="relative z-10 space-y-2 text-white">
                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-red-400 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-normal opacity-90 group-hover:opacity-100 transition-opacity">
                  {srv.description}
                </p>

                {/* Circular Red Action Arrow Button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                    Learn Details
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#E51B23] text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#C81212] transition-transform">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}