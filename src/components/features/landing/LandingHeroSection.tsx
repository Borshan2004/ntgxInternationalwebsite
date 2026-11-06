// src/components/features/landing/LandingHeroSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Globe,
  Plane,
  ShieldCheck,
  Building2,
  Clock,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';

export function LandingHeroSection(): React.JSX.Element {
  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-gradient-to-br from-[#0a192f] via-[#0d2244] to-[#12315d] text-white overflow-hidden">
      {/* Background Overlay Pattern & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Decorative airplane runway horizon line */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <span>International Shipping From Bangladesh</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              International Courier &amp; <br />
              Export Shipping from <br />
              <span className="text-orange-500">Bangladesh</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              Ship parcels, documents, commercial cargo, and garments export shipments
              to global destinations with reliable end-to-end logistics support.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#rate-estimator"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 hover:-translate-y-0.5 transition-all"
              >
                <span>Get a Shipping Quote</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#tracking-section"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-600 hover:border-slate-500 transition-all"
              >
                <span>Track Shipment</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </a>
            </div>

            {/* Quick Contact Links */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-300 border-t border-slate-700/60 max-w-xl">
              <Link
                href="/shipments/new"
                className="flex items-center gap-2 hover:text-orange-400 transition-colors"
              >
                <Clock className="w-4 h-4 text-orange-400" />
                <span>Book a Pickup</span>
              </Link>
              <a
                href="https://wa.me/8801681637836"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Us</span>
              </a>
              <a
                href="tel:+8801681637836"
                className="flex items-center gap-2 hover:text-orange-400 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-orange-400" />
                <span>Call Us Direct</span>
              </a>
            </div>
          </div>

          {/* Right Column: Floating Stat Cards */}
          <div className="lg:col-span-4 flex flex-col gap-3.5">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/70 p-4 rounded-2xl flex items-center gap-4 hover:border-orange-500/50 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">215+ Countries</div>
                <div className="text-xs text-slate-400">Worldwide Door-to-Door Network</div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/70 p-4 rounded-2xl flex items-center gap-4 hover:border-orange-500/50 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Air &amp; Sea Freight</div>
                <div className="text-xs text-slate-400">Commercial Cargo &amp; Express Flights</div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/70 p-4 rounded-2xl flex items-center gap-4 hover:border-orange-500/50 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Customs Clearance</div>
                <div className="text-xs text-slate-400">Full Export Documentation Support</div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/70 p-4 rounded-2xl flex items-center gap-4 hover:border-orange-500/50 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Business Solutions</div>
                <div className="text-xs text-slate-400">Garments, Jute &amp; B2B Export Rates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
