// src/components/features/landing/KnowledgeCenterSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

const GUIDES = [
  {
    title: 'How to Ship Commercial Garments & Samples to the USA',
    category: 'Commercial RMG Guide',
    readTime: '4 min read',
    snippet: 'Complete breakdown of CBP regulations, HS code classifications, and packing standards for US deliveries.',
    image: '/images/industry-garments.jpg',
  },
  {
    title: 'Export Documentation Checklist for Bangladesh Shippers',
    category: 'Export Compliance',
    readTime: '6 min read',
    snippet: 'Essential requirements for EXP certification, commercial invoice preparation, and customs declarations.',
    image: '/images/service-warehouse-cinematic.jpg',
  },
  {
    title: 'Demystifying Customs Clearance, Tariffs & Duties (DDP vs DAP)',
    category: 'Customs Knowledge',
    readTime: '5 min read',
    snippet: 'Understanding destination import VAT, commercial duties, and how to avoid customs inspection hold-ups.',
    image: '/images/hero-port-sunset.jpg',
  },
] as const;

export function KnowledgeCenterSection(): React.JSX.Element {
  return (
    <section className="py-20 lg:py-24 bg-[#F3F6FA] dark:bg-[#0B0F19] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E51B23]">
              <span className="w-1.5 h-3.5 rounded-full bg-[#E51B23]" />
              <span>Shipping Resources</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Export Knowledge Center &amp; Guides
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl font-normal">
              Helpful insights, customs regulations, and best practices for commercial exporters in Bangladesh.
            </p>
          </div>

          <a
            href="#faq"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-[#E51B23] hover:bg-[#C81212] active:bg-[#9B0E0E] shadow-md shadow-red-600/30 hover:scale-105 transition-all shrink-0 self-start md:self-auto"
          >
            <span>Browse All Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Professional Editorial Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <div
              key={guide.title}
              className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-red-200 dark:hover:border-red-900/50 hover:-translate-y-1 transition-all flex flex-col group"
            >
              {/* Image Banner */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={guide.image}
                  alt={guide.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={90}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-[#E51B23] px-2.5 py-1 rounded-full shadow-xs">
                    {guide.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#E51B23]" />
                    <span>{guide.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#E51B23] transition-colors leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {guide.snippet}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E51B23] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#E51B23] transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}