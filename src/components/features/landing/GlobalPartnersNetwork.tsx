// src/components/features/landing/GlobalPartnersNetwork.tsx
'use client';

import React from 'react';
import { Plane } from 'lucide-react';

const PARTNERS = [
  { name: 'DHL Express', tag: 'Global Courier Network' },
  { name: 'FedEx Express', tag: 'Air Express Priority' },
  { name: 'Aramex International', tag: 'Middle East & Africa' },
  { name: 'UPS Worldwide', tag: 'North America Network' },
  { name: 'Emirates SkyCargo', tag: 'Daily Freight Flight' },
  { name: 'Qatar Airways Cargo', tag: 'Transcontinental Cargo' },
  { name: 'Turkish Cargo', tag: 'European Hub Connection' },
  { name: 'Singapore Airlines Cargo', tag: 'Asia-Pacific Gateway' },
] as const;

export function GlobalPartnersNetwork(): React.JSX.Element {
  return (
    <section className="py-16 bg-slate-100/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E51919] block mb-2">
            Global Strategic Alliance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Global Logistics Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Seamlessly integrated with top airline freight carriers and premier international courier networks.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:border-red-300 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 mb-2">
                <Plane className="w-4 h-4 text-[#E51919]" />
              </div>
              <span className="font-bold text-sm text-slate-900">{partner.name}</span>
              <span className="text-[11px] text-slate-500 font-medium">{partner.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
