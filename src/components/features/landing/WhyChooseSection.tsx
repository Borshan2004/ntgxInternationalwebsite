// src/components/features/landing/WhyChooseSection.tsx
'use client';

import React from 'react';
import { Globe2, ShieldCheck, Headphones, ArrowRight } from 'lucide-react';

const WHY_FEATURES = [
  {
    title: 'Global Network',
    description: 'Ship to 215+ countries with our extensive air, sea, and overland logistics network.',
    icon: Globe2,
  },
  {
    title: 'Reliable & Secure',
    description: 'Your cargo is in safe hands with automated milestone tracking and end-to-end handling.',
    icon: ShieldCheck,
  },
  {
    title: '24/7 Support',
    description: 'Dedicated operations desk and proactive customer service whenever you need assistance.',
    icon: Headphones,
  },
] as const;

export function WhyChooseSection(): React.JSX.Element {
  return (
    <section id="about" className="py-20 lg:py-24 bg-[#F3F6FA] dark:bg-[#0B0F19] transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Subtitle & Learn More Button */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E51B23]">
              <span className="w-1.5 h-3.5 rounded-full bg-[#E51B23]" />
              <span>Why Choose NTGX</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Your Trusted Global <br />
              Logistics Partner
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              With years of experience and a robust global network, NTGX ensures your shipments reach their destination safely, securely and on time from Bangladesh.
            </p>

            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E51B23] hover:bg-[#C81212] active:bg-[#9B0E0E] text-white font-bold rounded-xl shadow-md shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 active:scale-95 transition-all text-sm"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: 3 Feature Cards & Global Network Graphic */}
          <div className="lg:col-span-7 relative">
            {/* World Network Graphic Background */}
            <div className="absolute inset-0 -top-8 -right-8 opacity-25 dark:opacity-20 pointer-events-none flex items-center justify-center">
              <svg viewBox="0 0 600 300" className="w-full h-full text-slate-400 dark:text-slate-600">
                <circle cx="100" cy="150" r="3" fill="#E51B23" />
                <circle cx="280" cy="120" r="4" fill="#E51B23" />
                <circle cx="450" cy="160" r="3" fill="#E51B23" />
                <circle cx="520" cy="80" r="3" fill="#E51B23" />
                <path
                  d="M100 150 Q 190 60 280 120 T 450 160 T 520 80"
                  fill="none"
                  stroke="#E51B23"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
              </svg>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 relative z-10">
              {WHY_FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900/50 hover:-translate-y-1 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Red Outlined Circular Icon */}
                      <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 text-[#E51B23] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-xs">
                        <Icon className="w-6 h-6 stroke-[1.75]" />
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#E51B23] transition-colors">
                        {feat.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}