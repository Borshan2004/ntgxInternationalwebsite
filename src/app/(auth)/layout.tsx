// src/app/(auth)/layout.tsx
import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'NTGX Express & Freight — Corporate Sign In',
  description: 'Enterprise operations and customer portal authentication',
};

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 antialiased selection:bg-red-600 selection:text-white">
      {/* Top subtle bar */}
      <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <BrandLogo size="md" variant="dark" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/90 overflow-hidden">
            {children}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit SSL Encrypted &bull; ISO/IEC 27001 Logistics Security Standard</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} NTGX Express &amp; Freight International. All rights reserved.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="/#faq" className="hover:text-slate-600">Privacy Policy</a>
            <span>&bull;</span>
            <a href="/#faq" className="hover:text-slate-600">Terms of Service</a>
            <span>&bull;</span>
            <a href="/#contact" className="hover:text-slate-600">Help Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
