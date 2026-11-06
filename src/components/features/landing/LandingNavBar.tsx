// src/components/features/landing/LandingNavBar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';

export function LandingNavBar(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size="md" variant="dark" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <Link href="/" className="text-orange-600 hover:text-orange-700 transition-colors">
              Home
            </Link>
            <a href="#about" className="hover:text-orange-600 transition-colors">
              About
            </a>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-orange-600 transition-colors py-2"
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-3 px-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <a
                    href="#services"
                    className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                  >
                    International Courier Express
                  </a>
                  <a
                    href="#services"
                    className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                  >
                    Air Freight Solutions
                  </a>
                  <a
                    href="#services"
                    className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                  >
                    Sea Freight Cargo
                  </a>
                  <a
                    href="#services"
                    className="block px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                  >
                    Garments & Export Logistics
                  </a>
                </div>
              )}
            </div>

            <a href="#industries" className="hover:text-orange-600 transition-colors">
              Industries
            </a>
            <a href="#process" className="hover:text-orange-600 transition-colors">
              How It Works
            </a>
            <a href="#faq" className="hover:text-orange-600 transition-colors">
              FAQ
            </a>
            <a href="#contact" className="hover:text-orange-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/shipments/new"
              className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-all"
            >
              Book a Shipment
            </Link>
            <a
              href="#tracking-section"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-orange-600 border border-slate-300 rounded-lg hover:border-orange-500 transition-all"
            >
              Track Shipment
            </a>
            <a
              href="#rate-estimator"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
            </a>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-bold text-white bg-orange-600 rounded-lg"
            >
              Login
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-orange-600 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top">
          <div className="flex flex-col space-y-3 font-semibold text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-orange-600"
            >
              Home
            </Link>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-orange-600"
            >
              About Us
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-orange-600"
            >
              Services
            </a>
            <a
              href="#industries"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-orange-600"
            >
              Industries Served
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-orange-600"
            >
              How It Works
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-orange-600"
            >
              FAQ
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-orange-600"
            >
              Contact Support
            </a>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/shipments/new"
              className="w-full text-center py-2.5 text-sm font-bold text-white bg-orange-600 rounded-lg"
            >
              Book a Shipment
            </Link>
            <a
              href="#rate-estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-bold text-slate-900 bg-slate-100 rounded-lg"
            >
              Get a Shipping Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
