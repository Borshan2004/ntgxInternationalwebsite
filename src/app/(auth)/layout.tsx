// src/app/(auth)/layout.tsx
import React from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export const metadata = {
  title: 'NTGX Express & Freight — Authentication',
};

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black px-4 py-12">
      <div className="w-full max-w-md">
        {/* NTGX Brand Logo */}
        <div className="flex justify-center mb-8 bg-white/95 backdrop-blur-sm py-4 px-6 rounded-2xl shadow-xl w-fit mx-auto border border-white/20">
          <BrandLogo size="lg" variant="dark" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-zinc-400">
          &copy; {new Date().getFullYear()} NTGX Express &amp; Freight. All rights reserved.
        </p>
      </div>
    </div>
  );
}
