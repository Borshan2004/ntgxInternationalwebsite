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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-2">
            Customer Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Exporters &amp; Individuals
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Real feedback from commercial clients and individuals shipping worldwide from Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.name}
              className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-orange-200 transition-all"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-normal mb-6 relative">
                  <Quote className="w-6 h-6 text-slate-300 absolute -top-2 -left-2 -z-10 opacity-40" />
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200/80">
                <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs">
                  {rev.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{rev.name}</div>
                  <div className="text-xs text-slate-500">{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
