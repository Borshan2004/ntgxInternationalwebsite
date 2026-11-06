// src/components/features/landing/FinalCtaBanner.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PackagePlus } from 'lucide-react';

export function FinalCtaBanner(): React.JSX.Element {
  return (
    <section className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 py-16 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        <div className="max-w-2xl text-center lg:text-left space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-sm">
            Ready to Ship Worldwide?
          </h2>
          <p className="text-sm sm:text-base text-orange-100 font-normal">
            Get a transparent quote, schedule a courier pickup in Dhaka, or talk to our export logistics specialists today.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
          <a
            href="#rate-estimator"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-xl shadow-lg transition-all text-sm"
          >
            <span>Get a Free Quote</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <Link
            href="/shipments/new"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900/90 hover:bg-slate-900 text-white font-bold rounded-xl shadow-lg border border-white/20 transition-all text-sm"
          >
            <PackagePlus className="w-4 h-4 text-orange-400" />
            <span>Book a Pickup</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
