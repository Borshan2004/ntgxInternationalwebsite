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
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-gradient-to-br from-[#071324] via-[#0b1e38] to-[#0f284a] text-white overflow-hidden">
      {/* Background Subtle Gradient & Grid Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none" />

      {/* Subtle aviation horizon glow */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
              <span>International Logistics &bull; Hub Dhaka</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              International Courier &amp; <br />
              Export Shipping from <br />
              <span className="text-[#E51919]">Bangladesh</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              Direct express flights and scheduled ocean freight from Dhaka and Chittagong.
              Professional customs clearance, tracking telemetry, and door-to-door delivery across 215+ countries.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <a
                href="#rate-estimator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#E51919] hover:bg-[#C81212] active:bg-[#9B0E0E] text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:-translate-y-0.5 transition-all text-center"
              >
                <span>Get a Shipping Quote</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#tracking-section"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-600 hover:border-slate-500 transition-all text-center"
              >
                <span>Track Consignment</span>
                <ArrowRight className="w-4 h-4 text-[#E51919]" />
              </a>
            </div>

            {/* Quick Contact Links */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-xs font-semibold text-slate-300 border-t border-slate-700/60 max-w-xl">
              <Link
                href="/shipments/new"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Clock className="w-4 h-4 text-[#E51919]" />
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
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#E51919]" />
                <span>Direct Hotline</span>
              </a>
            </div>
          </div>

          {/* Right Column: Floating Stat Cards */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/70 p-4 rounded-2xl flex items-center gap-4 hover:border-red-500/50 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 text-[#E51919] flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">215+ Countries</div>
                <div className="text-xs text-slate-400">Global Door-to-Door Delivery</div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/70 p-4 rounded-2xl flex items-center gap-4 hover:border-red-500/50 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Air &amp; Sea Cargo</div>
                <div className="text-xs text-slate-400">Commercial Cargo &amp; Daily Express Flights</div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/70 p-4 rounded-2xl flex items-center gap-4 hover:border-red-500/50 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Customs Clearance</div>
                <div className="text-xs text-slate-400">Complete Export Paperwork &amp; EXP Support</div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/70 p-4 rounded-2xl flex items-center gap-4 hover:border-red-500/50 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Corporate Tariffs</div>
                <div className="text-xs text-slate-400">Garments, Jute &amp; B2B Volume Rates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
