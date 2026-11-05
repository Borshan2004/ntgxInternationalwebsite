// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShipmentManagerContainer } from '@/components/features/shipment-manager/ShipmentManagerContainer';
import { TrackingTimeline } from '@/components/features/tracking/TrackingTimeline';
import { ExcelExportModal } from '@/components/features/reports/ExcelExportModal';
import type {
  FedExTrackApiResponse,
  ExcelReportFilterQuery,
  UserRole,
} from '@/types/shipment';
import { FileSpreadsheet, Package, Search, ShieldCheck, LayoutDashboard, LogIn } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

const SAMPLE_TRACKING_TELEMETRY: FedExTrackApiResponse = {
  trackingNumberInfo: {
    trackingNumber: '879098800901',
    carrierCode: 'FDXE',
  },
  latestStatusDetail: {
    code: 'IT',
    statusBy: 'In Transit',
    description: 'Departed sort facility via flight EK203',
    scanLocation: {
      city: 'DUBAI',
      stateOrProvinceCode: 'DXB',
      countryCode: 'AE',
    },
    estimatedDeliveryTime: 'Oct 31, 2026 by 5:00 PM',
  },
  packageWeight: {
    units: 'KG',
    value: 2.5,
  },
  dateAndTime: [
    { type: 'ACTUAL_PICKUP', dateTime: '2026-10-23T14:30:00+06:00' },
    { type: 'ESTIMATED_DELIVERY', dateTime: '2026-10-31T17:00:00-04:00' },
  ],
  scanEvents: [
    {
      timestamp: '2026-10-23T10:15:00+06:00',
      eventType: 'OC',
      eventDescription: 'Shipment information sent to FedEx',
      scanLocation: { city: 'Dhaka', countryCode: 'BD' },
    },
    {
      timestamp: '2026-10-23T14:30:00+06:00',
      eventType: 'PU',
      eventDescription: 'Picked up by FedEx courier',
      scanLocation: { city: 'Dhaka', countryCode: 'BD' },
    },
    {
      timestamp: '2026-10-24T02:10:00+06:00',
      eventType: 'AF',
      eventDescription: 'Arrived at origin consolidation hub (DACA)',
      scanLocation: { city: 'Dhaka', countryCode: 'BD' },
    },
    {
      timestamp: '2026-10-25T11:45:00+04:00',
      eventType: 'IT',
      eventDescription: 'In transit via Dubai sort hub (DXB)',
      scanLocation: { city: 'Dubai', stateOrProvinceCode: 'DXB', countryCode: 'AE' },
    },
  ],
};

export default function HomePage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<'ship' | 'track'>('ship');
  const [userRole, setUserRole] = useState<UserRole>('CUSTOMER');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [searchTracking, setSearchTracking] = useState<string>('8790 9880 0901');

  const handleExportExcel = async (query: ExcelReportFilterQuery): Promise<void> => {
    try {
      const res = await fetch('/api/reports/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });

      if (!res.ok) {
        throw new Error('Export network request failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FedEx-Shipments-${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Export failed';
      alert(`Export Error: ${msg}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-ntgx-dark text-white shadow-md select-none print:hidden border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* NTGX Brand Logo */}
            <Link href="/" className="flex items-center">
              <BrandLogo size="md" variant="light" />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('ship')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'ship'
                    ? 'bg-ntgx-red text-white shadow-xs'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Package className="h-4 w-4" /> Ship Manager
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('track')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'track'
                    ? 'bg-ntgx-red text-white shadow-xs'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Search className="h-4 w-4" /> Track API Telemetry
              </button>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-xs font-semibold rounded-md text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
              >
                <LayoutDashboard className="h-4 w-4" /> Operations Portal
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Multi-Tenant Account Badge */}
            <div className="hidden sm:flex flex-col text-right text-xs">
              <span className="font-bold text-white leading-tight">
                Apparel Sourcing Int&apos;l (ASI-BD)
              </span>
              <span className="text-2xs text-zinc-400 font-mono">
                Acct #987654321
              </span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-700 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <select
                aria-label="User Role"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-transparent text-white font-semibold text-xs border-none focus:outline-none cursor-pointer"
              >
                <option value="CUSTOMER" className="text-gray-900">
                  Role: CUSTOMER (Approved)
                </option>
                <option value="EMPLOYEE" className="text-gray-900">
                  Role: EMPLOYEE (Staff)
                </option>
                <option value="ADMIN" className="text-gray-900">
                  Role: ADMIN (Superuser)
                </option>
                <option value="DRIVER" className="text-gray-900">
                  Role: DRIVER (Courier)
                </option>
              </select>
            </div>

            {/* Sign In & Export Buttons */}
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-md shadow-xs transition-colors border border-zinc-700"
            >
              <LogIn className="h-4 w-4 text-ntgx-red" />
              <span>Sign In</span>
            </Link>

            {/* Excel Export Button */}
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ntgx-red hover:bg-ntgx-redHover text-white text-xs font-bold rounded-md shadow-xs transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'ship' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-border">
              <div>
                <h1 className="text-xl font-black text-neutral-textPrimary tracking-tight">
                  FedEx Ship Manager &trade; — Create International Shipment
                </h1>
                <p className="text-xs text-neutral-textSecondary mt-0.5">
                  Complete the 7-step pipeline to compute live dimensional rates,
                  generate 3-Page Air Waybills (Form 0430), and commercial customs
                  invoices.
                </p>
              </div>
            </div>

            <ShipmentManagerContainer
              organizationId="org_asi_bd"
              organizationName="Apparel Sourcing International Inc."
              onFinalizeSuccess={(trk) => {
                setSearchTracking(trk);
              }}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-border">
              <div>
                <h1 className="text-xl font-black text-neutral-textPrimary tracking-tight">
                  FedEx Track REST API v1 — Telemetry Timeline
                </h1>
                <p className="text-xs text-neutral-textSecondary mt-0.5">
                  Real-time package status, milestone progression, and granular scan
                  event telemetry.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchTracking}
                  onChange={(e) => setSearchTracking(e.target.value)}
                  placeholder="Enter 12-digit tracking #"
                  className="rounded-md border border-neutral-border px-3 py-1.5 text-xs font-mono text-neutral-textPrimary w-44"
                />
                <button
                  type="button"
                  onClick={() => alert(`Querying FedEx Track API for ${searchTracking}`)}
                  className="px-3 py-1.5 bg-brand-purple text-white text-xs font-bold rounded hover:bg-brand-purpleHover"
                >
                  Track
                </button>
              </div>
            </div>

            <TrackingTimeline telemetry={SAMPLE_TRACKING_TELEMETRY} />
          </div>
        )}
      </main>

      {/* Multi-Worksheet Excel Export Modal */}
      <ExcelExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        userRole={userRole}
        userOrganizationId="org_asi_bd"
        onExport={handleExportExcel}
      />
    </div>
  );
}
