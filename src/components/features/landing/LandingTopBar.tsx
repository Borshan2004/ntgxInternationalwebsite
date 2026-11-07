// src/components/features/landing/LandingTopBar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Mail, Globe, LogIn } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function LandingTopBar(): React.JSX.Element {
  return (
    <div className="bg-[#08172B] dark:bg-[#040C17] text-slate-300 text-[11px] sm:text-xs py-2 px-3.5 sm:px-6 lg:px-8 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        {/* Contact links */}
        <div className="flex items-center flex-wrap gap-3 sm:gap-6">
          <a
            href="tel:+8801681637836"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#E51B23]" />
            <span className="font-medium">+880 1681 637836</span>
          </a>
          <a
            href="https://wa.me/8801681637836"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium hidden xs:inline">WhatsApp Dispatch</span>
            <span className="font-medium xs:hidden">WhatsApp</span>
          </a>
          <a
            href="mailto:operations@ntgx.com.bd"
            className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#E51B23]" />
            <span>operations@ntgx.com.bd</span>
          </a>
        </div>

        {/* Theme toggle, Language switcher & Login link */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <ThemeToggle size="sm" className="bg-slate-800/80 border-slate-700/80 text-amber-300 hover:text-amber-200" />
          <div className="flex items-center gap-1 text-slate-300 bg-slate-800/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-slate-700/60 text-[10px] sm:text-[11px]">
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
            <span className="font-medium">English</span>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-white bg-[#E51B23] hover:bg-[#C81212] active:bg-[#9B0E0E] px-3 sm:px-3.5 py-1 rounded-md font-semibold text-[11px] sm:text-xs transition-colors shadow-xs"
          >
            <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Client Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
