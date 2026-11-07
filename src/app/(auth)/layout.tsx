// src/app/(auth)/layout.tsx
import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 antialiased selection:bg-red-600 selection:text-white transition-colors">
      {/* Top subtle bar */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <BrandLogo size="md" variant="dark" />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle size="sm" />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/90 dark:border-slate-800 overflow-hidden">
            {children}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit SSL Encrypted &bull; ISO/IEC 27001 Logistics Security Standard</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} NTGX Express &amp; Freight International. All rights reserved.</span>
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <a href="/#faq" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>
            <span>&bull;</span>
            <a href="/#faq" className="hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a>
            <span>&bull;</span>
            <a href="/#contact" className="hover:text-slate-600 dark:hover:text-slate-300">Help Desk</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
