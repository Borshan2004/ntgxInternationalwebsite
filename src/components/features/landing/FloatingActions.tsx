// src/components/features/landing/FloatingActions.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, Calculator, MessageCircle, Phone } from 'lucide-react';

export function FloatingActions(): React.JSX.Element {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Quick contact and navigation shortcuts"
      className="fixed bottom-6 right-5 z-40 flex flex-col gap-2.5"
    >
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          className="w-11 h-11 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-orange-600 transition-all"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Quick Rate Estimator scroll */}
      <a
        href="#rate-estimator"
        aria-label="Jump to rate estimate calculator"
        className="w-11 h-11 rounded-full bg-orange-600 text-white shadow-xl flex items-center justify-center hover:bg-orange-500 transition-all hover:scale-105"
      >
        <Calculator className="w-5 h-5" />
      </a>

      {/* WhatsApp Dispatch */}
      <a
        href="https://wa.me/8801681637836"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with support on WhatsApp"
        className="w-11 h-11 rounded-full bg-emerald-600 text-white shadow-xl flex items-center justify-center hover:bg-emerald-500 transition-all hover:scale-105"
      >
        <MessageCircle className="w-5 h-5" />
      </a>

      {/* Direct Phone Call */}
      <a
        href="tel:+8801681637836"
        aria-label="Call support hotline"
        className="w-11 h-11 rounded-full bg-blue-900 text-white shadow-xl flex items-center justify-center hover:bg-blue-800 transition-all hover:scale-105"
      >
        <Phone className="w-5 h-5" />
      </a>
    </aside>
  );
}
