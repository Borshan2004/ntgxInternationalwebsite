// src/components/features/landing/KnowledgeCenterSection.tsx
'use client';

import React from 'react';
import { ArrowRight, FileText, Globe, Shield } from 'lucide-react';

const GUIDES = [
  {
    title: 'How to Ship Commercial Garments & Samples to the USA',
    category: 'Commercial Guide',
    snippet: 'Step-by-step breakdown of FDA, CBP import regulations, and packing for North American delivery.',
    icon: Globe,
  },
  {
    title: 'Export Documentation Checklist for Bangladesh Shippers',
    category: 'Export Compliance',
    snippet: 'Essential requirements for EXP issuance, commercial invoices, packing lists, and HS code classifications.',
    icon: FileText,
  },
  {
    title: 'Demystifying Customs Clearance, Tariffs & Duties (DDP vs DAP)',
    category: 'Customs Knowledge',
    snippet: 'Understanding VAT, destination import tariffs, and how to avoid customs inspection hold-ups.',
    icon: Shield,
  },
] as const;

export function KnowledgeCenterSection(): React.JSX.Element {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E51919] block mb-2">
              Shipping Resources
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Export Knowledge Center &amp; Guides
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Helpful insights, regulations, and best practices for shipping from Bangladesh.
            </p>
          </div>

          <a
            href="#faq"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E51919] hover:underline shrink-0"
          >
            <span>Browse All Guides</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <div
                key={guide.title}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-red-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#E51919] bg-red-50 px-2.5 py-1 rounded-full">
                      {guide.category}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#E51919] transition-colors mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {guide.snippet}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4">
                  <a
                    href="#faq"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E51919] hover:underline"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
