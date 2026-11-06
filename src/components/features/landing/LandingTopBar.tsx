// src/components/features/landing/LandingTopBar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Mail, Globe, LogIn } from 'lucide-react';

export function LandingTopBar(): React.JSX.Element {
  return (
    <div className="bg-[#0f172a] text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2">
        {/* Contact links */}
        <div className="flex items-center flex-wrap gap-4 sm:gap-6">
          <a
            href="tel:+8801681637836"
            className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-orange-400" />
            <span>+880 1681 637836</span>
          </a>
          <a
            href="https://wa.me/8801681637836"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Support</span>
          </a>
          <a
            href="mailto:operations@ntgx.com.bd"
            className="hidden md:flex items-center gap-1.5 hover:text-orange-400 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-orange-400" />
            <span>operations@ntgx.com.bd</span>
          </a>
        </div>

        {/* Language switcher & Login link */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
            <Globe className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-medium">English</span>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-slate-200 hover:text-white bg-orange-600 hover:bg-orange-500 px-3 py-1 rounded font-semibold transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Portal Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
