// src/app/(auth)/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, UserCheck, AlertTriangle, Truck, User } from 'lucide-react';
import type { LoginApiResponse } from '@/types/auth';

interface DemoAccount {
  readonly label: string;
  readonly email: string;
  readonly role: string;
  readonly badgeColor: string;
  readonly icon: React.ElementType;
  readonly note: string;
}

const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {
    label: 'Superuser Admin',
    email: 'admin@company.com',
    role: 'ADMIN',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Shield,
    note: 'Full system control, rates & user KYC management',
  },
  {
    label: 'Operations Staff',
    email: 'staff1@company.com',
    role: 'EMPLOYEE',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: UserCheck,
    note: 'KYC approvals, manual scan overrides & reports',
  },
  {
    label: 'Verified Shipper (ASI-BD)',
    email: 'export@apparelsourcing.bd',
    role: 'CUSTOMER',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: User,
    note: 'Active shipper, create shipments & print AWBs',
  },
  {
    label: 'Pending KYC Client (BKE-BD)',
    email: 'info@bengalknit.bd',
    role: 'PENDING_APPROVAL',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: AlertTriangle,
    note: 'Tests the 403 Forbidden pending-approval gate',
  },
  {
    label: 'Field Courier',
    email: 'courier.dhaka@company.com',
    role: 'DRIVER',
    badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-200',
    icon: Truck,
    note: 'Barcode mobile scanner & milestone updates',
  },
] as const;

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>('admin@company.com');
  const [password, setPassword] = useState<string>('FedExPassword2026!');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const performLogin = async (loginEmail: string, loginPass: string): Promise<void> => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = (await res.json()) as LoginApiResponse;

      if (!res.ok || !data.success) {
        const errorMsg = !data.success && data.error ? data.error : 'Authentication failed. Please check credentials.';
        const redirectTarget = !data.success && data.redirectTo ? data.redirectTo : undefined;
        if (res.status === 403 && redirectTarget) {
          setErrorMessage(errorMsg);
          setTimeout(() => {
            router.push(redirectTarget);
          }, 1200);
          return;
        }
        setErrorMessage(errorMsg);
        return;
      }

      setSuccessMessage(`Welcome back, ${data.user.name}! Redirecting to portal…`);

      // Persist in localStorage for instant client state resolution
      if (typeof window !== 'undefined') {
        localStorage.setItem('fedex_user_session', JSON.stringify(data.user));
      }

      setTimeout(() => {
        router.push(data.redirectTo || '/dashboard');
      }, 700);
    } catch {
      setErrorMessage('Network error connecting to login service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void performLogin(email, password);
  };

  const handleQuickLogin = (demo: DemoAccount): void => {
    setEmail(demo.email);
    setPassword('FedExPassword2026!');
    void performLogin(demo.email, 'FedExPassword2026!');
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black text-neutral-textPrimary tracking-tight">Sign In</h1>
        <p className="mt-1 text-xs text-neutral-textSecondary">
          NTGX Express &amp; Freight Enterprise Operations &amp; Customer Portal
        </p>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <UserCheck className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@company.com"
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full font-bold shadow-sm"
        >
          Sign In to Portal
        </Button>
      </form>

      {/* Demo Quick Logins */}
      <div className="mt-6 pt-5 border-t border-neutral-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xs font-bold uppercase tracking-wider text-neutral-textSecondary">
            1-Click Demo Accounts (All 4 RBAC Roles)
          </span>
          <span className="text-2xs text-neutral-textSecondary font-mono">Password: DemoPassword2026!</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {DEMO_ACCOUNTS.map((demo) => {
            const Icon = demo.icon;
            return (
              <button
                key={demo.email}
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin(demo)}
                className="flex items-center justify-between p-2 rounded-lg border border-neutral-border hover:border-ntgx-red hover:bg-red-50/40 text-left transition-all text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-neutral-100 text-neutral-700 group-hover:bg-red-100 group-hover:text-ntgx-red transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-textPrimary group-hover:text-ntgx-red">
                      {demo.label}
                    </div>
                    <div className="text-2xs text-neutral-textSecondary font-mono">{demo.email}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${demo.badgeColor}`}
                  >
                    {demo.role}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-6 pt-4 border-t border-neutral-border text-center text-xs text-neutral-textSecondary flex justify-between items-center">
        <Link href="/" className="hover:text-ntgx-red hover:underline">
          &larr; Back to Home
        </Link>
        <div>
          <span>New Customer? </span>
          <Link href="/register" className="font-bold text-ntgx-red hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
}
