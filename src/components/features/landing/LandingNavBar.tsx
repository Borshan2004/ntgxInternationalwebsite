// src/components/features/landing/LandingNavBar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function LandingNavBar(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <BrandLogo size="md" variant="dark" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Link href="/" className="text-[#E51919] hover:text-[#C81212] transition-colors">
              Home
            </Link>
            <a href="#about" className="hover:text-[#E51919] transition-colors">
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
                className="flex items-center gap-1 hover:text-[#E51919] transition-colors py-2"
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 px-1 z-50 animate-in fade-in slide-in-from-top-1">
                  <a
                    href="#services"
                    className="block px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-[#E51919] rounded-lg transition-colors"
                  >
                    International Courier Express
                  </a>
                  <a
                    href="#services"
                    className="block px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-[#E51919] rounded-lg transition-colors"
                  >
                    Air Freight Solutions
                  </a>
                  <a
                    href="#services"
                    className="block px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-[#E51919] rounded-lg transition-colors"
                  >
                    Ocean Cargo (FCL &amp; LCL)
                  </a>
                  <a
                    href="#services"
                    className="block px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-[#E51919] rounded-lg transition-colors"
                  >
                    RMG &amp; Garments Export Logistics
                  </a>
                </div>
              )}
            </div>

            <a href="#industries" className="hover:text-[#E51919] transition-colors">
              Industries
            </a>
            <a href="#process" className="hover:text-[#E51919] transition-colors">
              Process
            </a>
            <a href="#destinations" className="hover:text-[#E51919] transition-colors">
              Destinations
            </a>
            <a href="#faq" className="hover:text-[#E51919] transition-colors">
              FAQ
            </a>
            <a href="#contact" className="hover:text-[#E51919] transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/shipments/new"
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#E51919] hover:bg-[#C81212] active:bg-[#9B0E0E] rounded-lg shadow-sm transition-all"
            >
              Book a Shipment
            </Link>
            <a
              href="#tracking-section"
              className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-lg transition-all"
            >
              Track Shipment
            </a>
            <a
              href="#rate-estimator"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              <span>Get a Quote</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E51919]" />
            </a>

            {/* Dark Mode Toggle */}
            <ThemeToggle size="md" />
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle size="sm" />
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#E51919] rounded-lg"
            >
              Login
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-[#E51919] focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Theme Mode
            </span>
            <ThemeToggle variant="pill" size="sm" />
          </div>

          <div className="flex flex-col space-y-3 font-semibold text-slate-800 dark:text-slate-200 text-sm">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#E51919]"
            >
              Home
            </Link>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51919]"
            >
              About NTGX
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51919]"
            >
              Services
            </a>
            <a
              href="#industries"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51919]"
            >
              Industries Served
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51919]"
            >
              Shipping Process
            </a>
            <a
              href="#destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51919]"
            >
              Global Destinations
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51919]"
            >
              FAQ
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51919]"
            >
              Contact Support
            </a>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <Link
              href="/shipments/new"
              className="w-full text-center py-2.5 text-sm font-bold text-white bg-[#E51919] rounded-lg"
            >
              Book a Shipment
            </Link>
            <a
              href="#rate-estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 rounded-lg"
            >
              Get a Shipping Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
