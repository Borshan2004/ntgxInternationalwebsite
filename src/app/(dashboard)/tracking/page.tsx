// src/app/(dashboard)/tracking/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PackageSearch,
} from 'lucide-react';
import { OperationsTrackingConsole } from '@/components/features/tracking/OperationsTrackingConsole';
import { CustomerTrackingView } from '@/components/features/tracking/CustomerTrackingView';
import type { UserRole } from '@/types/shipment';
import type { AuthUser } from '@/types/auth';
import { cn } from '@/lib/utils';

type ActiveTab = 'OPERATIONS' | 'TRACK';

function TrackingContent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('query') || searchParams.get('trackingNumber') || '';

  const [userRole, setUserRole] = useState<UserRole>('ADMIN');
  const [activeTab, setActiveTab] = useState<ActiveTab>(urlQuery ? 'TRACK' : 'OPERATIONS');
  const [activeTrackingNumber, setActiveTrackingNumber] = useState<string>(urlQuery);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fedex_user_session');
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed.role) {
          setUserRole(parsed.role);
          if (parsed.role === 'CUSTOMER') {
            setActiveTab('TRACK');
          }
        }
      }
    } catch {
      // Fallback
    }

    void fetch('/api/auth/session')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.user?.role) {
          const role = data.user.role as UserRole;
          setUserRole(role);
          if (role === 'CUSTOMER') {
            setActiveTab('TRACK');
          }
        }
      })
      .catch(() => {
        // Fallback
      });
  }, []);

  useEffect(() => {
    if (urlQuery) {
      setActiveTrackingNumber(urlQuery);
      setActiveTab('TRACK');
    }
  }, [urlQuery]);

  const isStaff = userRole === 'ADMIN' || userRole === 'EMPLOYEE';

  const handleInspectTracking = (trk: string): void => {
    setActiveTrackingNumber(trk);
    setActiveTab('TRACK');
    router.push(`/tracking?query=${encodeURIComponent(trk)}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ─────────────────────────────────────────────────────────────
          1. CLEAN TOP HEADER WITH ROLE-BASED NAVIGATION TABS
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 dark:border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Parcel Tracking &amp; Milestones</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-slate-400 mt-0.5">
            {isStaff
              ? 'Operations dispatch console to manage customer shipments, update delivery milestones, and track live telemetry.'
              : 'Enter your tracking number to monitor real-time shipment milestones, flights, and delivery proof.'}
          </p>
        </div>

        {/* Tab Controls for Staff (Hidden for Customers to prevent clutter) */}
        {isStaff && (
          <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 dark:bg-slate-800 p-1 rounded-xl border border-neutral-200 dark:border-slate-700 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('OPERATIONS')}
              className={cn(
                'flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                activeTab === 'OPERATIONS'
                  ? 'bg-neutral-900 dark:bg-slate-900 text-white shadow-xs'
                  : 'text-neutral-600 dark:text-slate-300 hover:text-neutral-900 dark:hover:text-white'
              )}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Operations Dispatch</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('TRACK')}
              className={cn(
                'flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                activeTab === 'TRACK'
                  ? 'bg-ntgx-red text-white shadow-xs'
                  : 'text-neutral-600 dark:text-slate-300 hover:text-neutral-900 dark:hover:text-white'
              )}
            >
              <PackageSearch className="h-3.5 w-3.5" />
              <span>Track a Parcel</span>
            </button>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. VIEW SWITCHING
          ───────────────────────────────────────────────────────────── */}
      {isStaff && activeTab === 'OPERATIONS' ? (
        <OperationsTrackingConsole onInspectTracking={handleInspectTracking} />
      ) : (
        <CustomerTrackingView
          initialTrackingNumber={activeTrackingNumber}
          onSearchChange={(trk) => {
            setActiveTrackingNumber(trk);
            router.push(`/tracking?query=${encodeURIComponent(trk)}`);
          }}
        />
      )}
    </div>
  );
}

export default function TrackingPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs font-semibold text-neutral-500">
          Loading tracking system…
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
