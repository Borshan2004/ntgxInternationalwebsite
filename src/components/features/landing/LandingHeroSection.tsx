// src/components/features/landing/LandingHeroSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  MapPin,
  Plane,
  Star,
  Clock,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

export function LandingHeroSection(): React.JSX.Element {
  return (
    <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center bg-[#08172B] text-white overflow-hidden pb-12 sm:pb-20">
      {/* Background: Photorealistic Container Port at Sunset with Flying Airplane */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-port-sunset.jpg"
          alt="International Container Port and Air Freight Terminal at Sunset"
          fill
          priority
          sizes="100vw"
          quality={95}
          className="object-cover object-[65%_center] lg:object-center select-none"
        />

        {/* Cinematic Gradient Overlays: Deep navy vignette preserving visibility of cranes, port, and airplane */}
        {/* Left-to-right fade: Deep navy on text column, semi-translucent over the sunset port */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08172B] via-[#08172B]/95 sm:via-[#08172B]/85 lg:via-[#08172B]/60 to-[#08172B]/35" />

        {/* Top subtle vignette */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#08172B]/90 to-transparent" />

        {/* Bottom smooth fade into the floating cards section */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#08172B] via-[#08172B]/80 to-transparent" />

        {/* Ambient red & blue lens glow accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E51B23]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline, Subtitle, and Primary CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tag Badge with Red Accent Line */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#E51B23]/15 border border-[#E51B23]/30 text-red-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <span className="w-1.5 h-3.5 rounded-full bg-[#E51B23]" />
              <span>International Logistics &bull; Bangladesh</span>
            </div>

            {/* Main Headline from User Design Reference */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              Fast-Track Your <br />
              International <br />
              <span className="text-[#E51B23] drop-shadow-[0_2px_14px_rgba(229,27,35,0.45)]">
                Shipments
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-xl leading-relaxed font-normal">
              Deliver your goods anywhere in the world within 24&ndash;72 hours.
              Our dedicated logistics network ensures your cargo arrives on time, every time.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-2">
              <a
                href="#rate-estimator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#E51B23] hover:bg-[#C81212] active:bg-[#9B0E0E] text-white shadow-lg shadow-red-600/35 hover:shadow-red-600/55 hover:-translate-y-0.5 transition-all text-center"
              >
                <span>Get a Shipping Quote</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#tracking-section"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-slate-500 backdrop-blur-md transition-all text-center shadow-md"
              >
                <MapPin className="w-4 h-4 text-[#E51B23]" />
                <span>Track Consignment</span>
              </a>
            </div>

            {/* Quick Contact & Dispatch Links */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 text-xs font-semibold text-slate-300 border-t border-white/10 max-w-xl">
              <Link
                href="/shipments/new"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Clock className="w-4 h-4 text-[#E51B23]" />
                <span>Book a Pickup</span>
              </Link>
              <a
                href="https://wa.me/8801681637836"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Dispatch</span>
              </a>
              <a
                href="tel:+8801681637836"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#E51B23]" />
                <span>+880 1681 637836</span>
              </a>
            </div>
          </div>

          {/* Right Column: Floating Skyline-Style Cinematic Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4 items-end justify-center">
            {/* 1. Floating Customer Testimonials Card */}
            <div className="w-full sm:w-80 bg-white text-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-100 transform hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-3">
                {/* 3 User Avatar Bubbles */}
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                    MR
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#E51B23] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                    EC
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                    FN
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200/60 px-2 py-0.5 rounded-full text-xs font-bold">
                  <span>4.9</span>
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </div>
              </div>

              <div className="text-xs font-bold text-[#E51B23] uppercase tracking-wider mb-1">
                Customer Testimonials
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Trusted by 5,350+ businesses worldwide for urgent air &amp; export freight solutions across 215+ destinations.
              </p>
            </div>

            {/* 2. Floating Flight Telemetry Route Card */}
            <div className="w-full sm:w-80 bg-[#10243D]/90 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-2xl text-white transform hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                <span>DAC &bull; Dhaka BD</span>
                <span className="text-[#E51B23]">JFK / LHR &bull; Express</span>
              </div>

              {/* Progress Bar with Airplane */}
              <div className="relative my-2.5">
                <div className="h-1.5 w-full bg-slate-700/80 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-[#E51B23] to-red-400 rounded-full" />
                </div>
                <div className="absolute left-[63%] -top-2 transform -translate-x-1/2">
                  <div className="w-5 h-5 rounded-full bg-[#E51B23] text-white flex items-center justify-center shadow-md">
                    <Plane className="w-3 h-3 transform rotate-45" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-1">
                <span>Daily Express Flights</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> On Schedule
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}