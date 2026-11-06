// src/app/(auth)/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertTriangle, CheckCircle2, Shield, User, Truck, UserCheck } from 'lucide-react';
import type { LoginApiResponse } from '@/types/auth';

interface DemoAccount {
  readonly label: string;
  readonly email: string;
  readonly role: string;
  readonly icon: React.ElementType;
}

const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {
    label: 'Admin',
    email: 'admin@company.com',
    role: 'ADMIN',
    icon: Shield,
  },
  {
    label: 'Operations',
    email: 'staff1@company.com',
    role: 'EMPLOYEE',
    icon: UserCheck,
  },
  {
    label: 'Verified Shipper',
    email: 'export@apparelsourcing.bd',
    role: 'CUSTOMER',
    icon: User,
  },
  {
    label: 'Field Courier',
    email: 'courier.dhaka@company.com',
    role: 'DRIVER',
    icon: Truck,
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

      setSuccessMessage(`Welcome back, ${data.user.name}! Redirecting to your dashboard…`);

      // Persist in localStorage for instant client state resolution
      if (typeof window !== 'undefined') {
        localStorage.setItem('fedex_user_session', JSON.stringify(data.user));
      }

      setTimeout(() => {
        router.push(data.redirectTo || '/dashboard');
      }, 600);
    } catch {
      setErrorMessage('Network error connecting to authentication service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void performLogin(email, password);
  };

  const handleQuickSelect = (demo: DemoAccount): void => {
    setEmail(demo.email);
    setPassword('FedExPassword2026!');
    void performLogin(demo.email, 'FedExPassword2026!');
  };

  return (
    <div className="p-8 sm:p-10">
      {/* Title & Introduction */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to NTGX Portal
        </h1>
        <p className="mt-1.5 text-xs text-slate-500">
          Enter your corporate credentials to manage shipments, track manifests, and print AWBs.
        </p>
      </div>

      {/* Error / Success Feedback */}
      {errorMessage && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200/90 p-3.5 text-xs font-semibold text-red-700 flex items-start gap-2.5 animate-in fade-in">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200/90 p-3.5 text-xs font-semibold text-emerald-700 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@company.com"
              required
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Password
            </label>
            <a
              href="#contact"
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 px-4 bg-[#E51919] hover:bg-[#C81212] active:bg-[#9B0E0E] text-white font-bold rounded-xl shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
        >
          <span>{isLoading ? 'Authenticating…' : 'Sign In to Portal'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Compact, Classy 1-Click Demo Accounts */}
      <div className="mt-8 pt-6 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Quick 1-Click Demo Roles
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Password auto-filled</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((demo) => {
            const Icon = demo.icon;
            const isSelected = email === demo.email;
            return (
              <button
                key={demo.email}
                type="button"
                onClick={() => handleQuickSelect(demo)}
                disabled={isLoading}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-red-600 bg-red-50/60 text-red-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-100/60 text-slate-700'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-red-600 text-white' : 'bg-white text-slate-600 shadow-xs'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs truncate">{demo.label}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {demo.role}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Registration link */}
      <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
        <span>Need a corporate export account? </span>
        <Link href="/register" className="font-bold text-[#E51919] hover:underline">
          Register with NTGX &rarr;
        </Link>
      </div>
    </div>
  );
}
