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
    <header className="sticky top-0 z-50 bg-[#08172B]/95 dark:bg-[#040C17]/95 backdrop-blur-md border-b border-white/10 text-white shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <BrandLogo size="md" variant="light" className="scale-90 sm:scale-100 origin-left" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-200">
            <Link href="/" className="text-[#E51B23] hover:text-[#C81212] transition-colors">
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-[#E51B23] transition-colors py-2"
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#E51B23] transition-transform" />
              </button>
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-[#10243D] border border-white/10 rounded-xl shadow-2xl py-2 px-1 z-50 animate-in fade-in slide-in-from-top-1">
                  <a
                    href="#services"
                    className="block px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-[#E51B23]/15 hover:text-[#E51B23] rounded-lg transition-colors"
                  >
                    International Courier Express
                  </a>
                  <a
                    href="#services"
                    className="block px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-[#E51B23]/15 hover:text-[#E51B23] rounded-lg transition-colors"
                  >
                    Air Freight Solutions
                  </a>
                  <a
                    href="#services"
                    className="block px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-[#E51B23]/15 hover:text-[#E51B23] rounded-lg transition-colors"
                  >
                    Ocean / Sea Freight (FCL &amp; LCL)
                  </a>
                  <a
                    href="#services"
                    className="block px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-[#E51B23]/15 hover:text-[#E51B23] rounded-lg transition-colors"
                  >
                    Export Logistics &amp; Compliance
                  </a>
                </div>
              )}
            </div>

            <a href="#destinations" className="hover:text-[#E51B23] transition-colors">
              Air Routes
            </a>
            <a href="#tracking-section" className="hover:text-[#E51B23] transition-colors">
              Track Shipment
            </a>
            <a href="#rate-estimator" className="hover:text-[#E51B23] transition-colors">
              Quote Calculator
            </a>
            <a href="#about" className="hover:text-[#E51B23] transition-colors">
              About Us
            </a>
            <a href="#contact" className="hover:text-[#E51B23] transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#tracking-section"
              className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-500 rounded-lg transition-all"
            >
              Track Consignment
            </a>

            <a
              href="#rate-estimator"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#E51B23] hover:bg-[#C81212] active:bg-[#9B0E0E] rounded-full shadow-md shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Get Instant Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Dark Mode Toggle */}
            <ThemeToggle size="md" className="bg-slate-800/80 border-slate-700/80 text-amber-300 hover:text-amber-200" />
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle size="sm" className="bg-slate-800/80 border-slate-700/80 text-amber-300 hover:text-amber-200" />
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#E51B23] rounded-lg"
            >
              Login
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-[#E51B23] focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#08172B] border-t border-slate-800 px-6 py-5 space-y-4 shadow-2xl animate-in slide-in-from-top">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Theme Mode
            </span>
            <ThemeToggle variant="pill" size="sm" />
          </div>

          <div className="flex flex-col space-y-3 font-semibold text-slate-200 text-sm">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#E51B23]"
            >
              Home
            </Link>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51B23]"
            >
              About NTGX
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51B23]"
            >
              Services
            </a>
            <a
              href="#destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51B23]"
            >
              Air Routes
            </a>
            <a
              href="#industries"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51B23]"
            >
              Industries Served
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51B23]"
            >
              Shipping Process
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51B23]"
            >
              FAQ
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#E51B23]"
            >
              Contact Support
            </a>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            <Link
              href="/shipments/new"
              className="w-full text-center py-2.5 text-sm font-bold text-white bg-[#E51B23] rounded-lg shadow-sm"
            >
              Book a Shipment
            </Link>
            <a
              href="#rate-estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg"
            >
              Get Instant Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}