// src/components/features/landing/FinalCtaBanner.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, PhoneCall } from 'lucide-react';

export function FinalCtaBanner(): React.JSX.Element {
  return (
    <section className="relative py-20 lg:py-24 text-white overflow-hidden bg-[#08172B]">
      {/* Background Container Port at Sunset Photographic Asset */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-port-sunset.jpg"
          alt="International Ocean Container Port at Sunset"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-center select-none"
        />
        {/* Cinematic Deep Navy Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08172B]/95 via-[#08172B]/85 to-[#08172B]/75" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Ready to Ship Internationally?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 font-normal">
              Get your free quote today and experience the NTGX difference with reliable air and ocean freight forwarding.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 shrink-0 w-full sm:w-auto">
            <a
              href="#rate-estimator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#E51B23] hover:bg-[#C81212] active:bg-[#9B0E0E] text-white font-bold rounded-full shadow-lg shadow-red-600/35 hover:scale-105 transition-all text-sm"
            >
              <span>Get a Free Quote</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="tel:+8801681637836"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white font-bold rounded-full border border-slate-700 hover:border-slate-500 backdrop-blur-md transition-all text-sm"
            >
              <PhoneCall className="w-4 h-4 text-[#E51B23]" />
              <span>Contact Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}