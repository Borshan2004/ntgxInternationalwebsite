// src/components/features/landing/CustomerTestimonials.tsx
'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Mohammad Rahman',
    role: 'Export Manager, Chittagong',
    review:
      'Best logistics partner for our apparel & garment exports. Customs clearance documentation is handled seamlessly without any clearance delays in Europe.',
    rating: 5,
    avatar: 'MR',
  },
  {
    name: 'Emily Carter',
    role: 'Fashion Boutique Owner, Toronto, Canada',
    review:
      'NTGX handles our overseas product sample imports from Dhaka with utmost professionalism. Tracking updates are precise and delivery is consistently on time.',
    rating: 5,
    avatar: 'EC',
  },
  {
    name: 'Fatima Noor',
    role: 'International Consultant, Dubai, UAE',
    review:
      'Affordable rates and dependable 3-day express delivery. I trust NTGX with all my urgent legal contracts, certificates, and commercial documents.',
    rating: 5,
    avatar: 'FN',
  },
] as const;

export function CustomerTestimonials(): React.JSX.Element {
  return (
    <section className="py-20 lg:py-24 bg-[#F3F6FA] dark:bg-[#0B0F19] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E51B23]">
            <span className="w-1.5 h-3.5 rounded-full bg-[#E51B23]" />
            <span>Customer Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trusted by Exporters Worldwide
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            Real feedback from commercial businesses and individuals shipping overseas from Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.name}
              className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-7 shadow-xl flex flex-col justify-between hover:shadow-2xl hover:border-red-200 dark:hover:border-red-900/50 hover:-translate-y-1 transition-all"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-amber-500" />
                  ))}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal mb-6 relative">
                  <Quote className="w-6 h-6 text-slate-300 dark:text-slate-700 absolute -top-2 -left-2 -z-10 opacity-40" />
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-[#08172B] dark:bg-slate-800 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {rev.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{rev.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}