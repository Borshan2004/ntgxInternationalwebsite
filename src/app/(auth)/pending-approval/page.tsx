// src/app/(auth)/pending-approval/page.tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'NTGX Enterprise — Pending Approval',
};

export default function PendingApprovalPage(): React.JSX.Element {
  return (
    <div className="p-8 text-center">
      {/* Icon */}
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10">
        <svg
          className="h-10 w-10 text-brand-orange"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-neutral-textPrimary">Account Under Review</h1>
      <p className="mt-1 text-sm font-semibold text-brand-orange">Verification Pending</p>

      {/* Body */}
      <div className="mt-5 rounded-lg border border-neutral-border bg-neutral-50 px-5 py-4 text-left text-sm text-neutral-textSecondary space-y-2">
        <p>
          Your account is pending verification. Our compliance team will review your KYC documents
          within <span className="font-semibold text-neutral-textPrimary">24–48 business hours</span>.
        </p>
        <p>
          You will receive an email notification at your registered address once your account has
          been activated by an administrator.
        </p>
      </div>

      {/* Steps */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-neutral-textSecondary">
        {[
          { icon: '✅', label: 'Registration\nSubmitted' },
          { icon: '🔍', label: 'KYC Review\nIn Progress' },
          { icon: '🚀', label: 'Account\nActivation' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-lg border border-neutral-border bg-white py-3 px-2"
          >
            <span className="text-xl">{icon}</span>
            <span className="whitespace-pre-line text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col gap-2">
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-md border border-neutral-border bg-white px-4 py-2.5 text-sm font-medium text-neutral-textPrimary shadow-sm transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2"
        >
          ← Back to Home
        </Link>
        <Link
          href="/login"
          className="text-xs text-neutral-textSecondary hover:text-neutral-textPrimary underline underline-offset-2"
        >
          Sign in with a different account
        </Link>
      </div>
    </div>
  );
}
