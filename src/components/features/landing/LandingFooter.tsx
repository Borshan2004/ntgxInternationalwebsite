// src/components/features/landing/LandingFooter.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function LandingFooter(): React.JSX.Element {
  return (
    <footer id="contact" className="bg-[#07111E] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Overview (2 cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block mb-1">
              <BrandLogo size="md" variant="light" />
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
              NTGX Express &amp; Freight provides dependable international express courier, air freight forwarding,
              and garment export logistics from Bangladesh to 215+ global destinations.
            </p>
            <div className="flex items-center gap-2 text-slate-300 text-xs pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Licensed International Freight &amp; Courier Operator</span>
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
                  About NTGX
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-red-400 transition-colors">
                  Courier Services
                </a>
              </li>
              <li>
                <a href="#industries" className="hover:text-red-400 transition-colors">
                  RMG &amp; Garments Export
                </a>
              </li>
              <li>
                <a href="#tracking-section" className="hover:text-red-400 transition-colors">
                  Track Consignment
                </a>
              </li>
              <li>
                <a href="#rate-estimator" className="hover:text-red-400 transition-colors">
                  Instant Rate Estimator
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate Portal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Shipper Portal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-red-400 transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-red-400 transition-colors">
                  Apply for Corporate Account
                </Link>
              </li>
              <li>
                <Link href="/shipments/new" className="hover:text-red-400 transition-colors">
                  Create Air Waybill (AWB)
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-red-400 transition-colors">
                  Customs FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Dhaka Headquarters</h4>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Sector 4, Uttara, Airport Road, Dhaka-1230, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
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
                  WhatsApp Dispatch Desk
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <a href="mailto:operations@ntgx.com.bd" className="hover:text-white">
                  operations@ntgx.com.bd
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line & theme switcher */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>&copy; {new Date().getFullYear()} NTGX Express &amp; Freight International. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <ThemeToggle variant="pill" size="sm" className="bg-slate-800 text-slate-300 border-slate-700" />
            <a href="#faq" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#faq" className="hover:text-slate-400 transition-colors">
              Terms of Carriage
            </a>
            <a href="#faq" className="hover:text-slate-400 transition-colors">
              Prohibited Goods
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
