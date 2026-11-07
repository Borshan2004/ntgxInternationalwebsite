// src/components/features/landing/LandingFooter.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, Linkedin, Facebook, Twitter, Youtube } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function LandingFooter(): React.JSX.Element {
  return (
    <footer id="contact" className="bg-[#08172B] dark:bg-[#040C17] text-slate-400 text-xs border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Overview (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block mb-1">
              <BrandLogo size="md" variant="light" />
            </Link>
            <p className="font-semibold text-xs tracking-wider uppercase text-[#E51B23]">
              Connecting Bangladesh to the World
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
              NTGX Express &amp; Freight provides dependable international express courier, air cargo forwarding,
              ocean freight, and garment export logistics from Bangladesh to 215+ destinations worldwide.
            </p>
            <div className="flex items-center gap-2 text-slate-300 text-xs pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Licensed International Freight Forwarder &bull; Dhaka Hub</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-red-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-red-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-red-400 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-red-400 transition-colors">
                  Air Routes
                </a>
              </li>
              <li>
                <a href="#tracking-section" className="hover:text-red-400 transition-colors">
                  Track Shipment
                </a>
              </li>
              <li>
                <a href="#rate-estimator" className="hover:text-red-400 transition-colors">
                  Quote Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="hover:text-red-400 transition-colors">
                  Air Freight Cargo
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-red-400 transition-colors">
                  Ocean / Sea Freight
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-red-400 transition-colors">
                  Courier Services
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-red-400 transition-colors">
                  Export Logistics
                </a>
              </li>
              <li>
                <Link href="/shipments/new" className="hover:text-red-400 transition-colors">
                  Book a Pickup
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Contact Us</h4>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E51B23] shrink-0 mt-0.5" />
                <span>Sector 4, Uttara, Airport Road, Dhaka-1230, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E51B23] shrink-0" />
                <a href="tel:+8801681637836" className="hover:text-white">
                  +880 1681 637836
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/8801681637836"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400"
                >
                  WhatsApp Support
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E51B23] shrink-0" />
                <a href="mailto:operations@ntgx.com.bd" className="hover:text-white">
                  operations@ntgx.com.bd
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line, social icons & legal */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>&copy; {new Date().getFullYear()} NTGX Express &amp; Freight Logistics. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#E51B23] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#E51B23] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#E51B23] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#E51B23] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <ThemeToggle variant="pill" size="sm" className="bg-slate-800 text-slate-300 border-slate-700" />
            <a href="#faq" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#faq" className="hover:text-slate-300 transition-colors">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}