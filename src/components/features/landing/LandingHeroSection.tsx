// src/components/features/landing/LandingHeroSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <section className="relative min-h-[620px] lg:min-h-[700px] flex items-center bg-[#060e1b] text-white overflow-hidden">
      {/* Hero Banner Background Illustration */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/ntgx-hero-banner.jpg"
          alt="NTGX Express & Freight Global Logistics Network"
          fill
          priority
          sizes="100vw"
          quality={95}
          className="object-cover object-[78%_center] lg:object-right-center select-none"
        />
        {/* Layered Gradient Overlays for optimal text contrast and seamless blending */}
        {/* Left-to-right fade: deep navy behind text on left, transparent on right to showcase fleet, plane & cargo ship */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060e1b] via-[#060e1b]/95 sm:via-[#060e1b]/80 lg:via-[#060e1b]/55 to-transparent" />
        {/* Top subtle vignette */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#060e1b]/80 to-transparent" />
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#060e1b] via-[#060e1b]/60 to-transparent" />
        {/* Subtle radial glow accent */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines, CTA Buttons & Compact Feature Badges */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>International Express &bull; Global Freight &bull; Hub Dhaka</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] drop-shadow-md">
              International Courier &amp; <br />
              Export Shipping from <br />
              <span className="text-[#E51919] drop-shadow-[0_2px_12px_rgba(229,25,25,0.4)]">
                Bangladesh
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-xl leading-relaxed font-normal drop-shadow-sm">
              Direct express flights and scheduled ocean freight from Dhaka and Chittagong.
              Professional customs clearance, live telemetry, and reliable door-to-door delivery across 215+ countries worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <a
                href="#rate-estimator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#E51919] hover:bg-[#C81212] active:bg-[#9B0E0E] text-white shadow-lg shadow-red-600/35 hover:shadow-red-600/55 hover:-translate-y-0.5 transition-all text-center"
              >
                <span>Get a Shipping Quote</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#tracking-section"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-900/80 hover:bg-slate-800/90 text-white border border-slate-600/80 hover:border-slate-500 backdrop-blur-md transition-all text-center shadow-md"
              >
                <span>Track Consignment</span>
                <ArrowRight className="w-4 h-4 text-[#E51919]" />
              </a>
            </div>

            {/* Quick Contact Links */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 text-xs font-semibold text-slate-200 border-t border-white/10 max-w-xl">
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

            {/* Sleek Translucent Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 max-w-2xl">
              <div className="bg-slate-900/70 backdrop-blur-md border border-white/10 hover:border-red-500/40 p-3 rounded-xl transition-all shadow-md">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold text-white">215+ Nations</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">Worldwide Door-to-Door</p>
              </div>

              <div className="bg-slate-900/70 backdrop-blur-md border border-white/10 hover:border-blue-500/40 p-3 rounded-xl transition-all shadow-md">
                <div className="flex items-center gap-2 mb-1">
                  <Plane className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white">Air &amp; Sea Cargo</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">Express &amp; Bulk Freight</p>
              </div>

              <div className="bg-slate-900/70 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 p-3 rounded-xl transition-all shadow-md">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Customs Clearance</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">EXP &amp; HS Compliance</p>
              </div>

              <div className="bg-slate-900/70 backdrop-blur-md border border-white/10 hover:border-purple-500/40 p-3 rounded-xl transition-all shadow-md">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">Corporate Tariffs</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">Garment &amp; B2B Volume</p>
              </div>
            </div>
          </div>

          {/* Right Column: Open space to showcase the NTGX fleet banner */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 justify-end items-end min-h-[460px] pointer-events-none">
            {/* Floating Live Status Pill */}
            <div className="bg-slate-950/80 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto transform hover:scale-105 transition-all">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="text-xs font-medium text-slate-200">
                <span className="font-bold text-white">Daily Flights Active</span> &bull; DAC / CGP Departures
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
