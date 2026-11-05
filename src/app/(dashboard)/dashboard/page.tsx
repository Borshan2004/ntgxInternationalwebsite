// src/app/(dashboard)/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  DollarSign,
  Plus,
  Users,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getStatusBadgeStyle } from '@/lib/tokens';
import type { ShipmentStatus } from '@/types/shipment';

interface DashboardStats {
  readonly totalShipments: number;
  readonly activeTrackings: number;
  readonly pendingApprovals: number;
  readonly totalRevenue: number;
  readonly recentShipments: readonly {
    readonly id: string;
    readonly trackingNumber: string;
    readonly recipient: string;
    readonly destination: string;
    readonly status: ShipmentStatus;
    readonly service: string;
    readonly weight: string;
    readonly cost: string;
    readonly createdAt: string;
  }[];
}

export default function DashboardHomePage(): React.JSX.Element {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    void fetch('/api/dashboard/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setStats(data);
        }
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & New Shipment Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Operations Dashboard
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
              Live DB
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-tenant telemetry and manifests from PostgreSQL.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/tracking">
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              <Search className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> Track Parcel
            </Button>
          </Link>
          <Link href="/shipments/new">
            <Button variant="primary" size="sm" className="bg-ntgx-red hover:bg-ntgx-redHover text-white shadow-xs font-bold">
              <Plus className="h-4 w-4 mr-1.5" /> Create Shipment
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Shipments */}
        <Card className="p-4 bg-white border border-slate-200 shadow-xs rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Total Shipments
            </span>
            <div className="h-8 w-8 rounded-lg bg-red-50 text-ntgx-red flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 font-mono">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
              ) : (
                stats?.totalShipments ?? 0
              )}
            </span>
          </div>
          <Link
            href="/shipments"
            className="text-2xs font-bold text-ntgx-red hover:underline mt-3 inline-flex items-center gap-1"
          >
            View manifest <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>

        {/* Active In-Transit */}
        <Card className="p-4 bg-white border border-slate-200 shadow-xs rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Active In-Transit
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 font-mono">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
              ) : (
                stats?.activeTrackings ?? 0
              )}
            </span>
          </div>
          <Link
            href="/tracking"
            className="text-2xs font-bold text-blue-600 hover:underline mt-3 inline-flex items-center gap-1"
          >
            Live telemetry <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>

        {/* Total Freight Value */}
        <Card className="p-4 bg-white border border-slate-200 shadow-xs rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              Freight Volume (USD)
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 font-mono">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
              ) : (
                `$${(stats?.totalRevenue ?? 0).toLocaleString()}`
              )}
            </span>
          </div>
          <Link
            href="/reports"
            className="text-2xs font-bold text-emerald-600 hover:underline mt-3 inline-flex items-center gap-1"
          >
            Export financials <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>

        {/* KYC Approvals */}
        <Card className="p-4 bg-white border border-slate-200 shadow-xs rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">
              KYC Verification
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 font-mono">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
              ) : (
                stats?.pendingApprovals ?? 0
              )}
            </span>
          </div>
          <Link
            href="/admin/users"
            className="text-2xs font-bold text-amber-600 hover:underline mt-3 inline-flex items-center gap-1"
          >
            Review accounts <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>
      </div>

      {/* Recent Live Database Shipments Section */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Recent Dispatched Shipments
            </h2>
            <p className="text-2xs text-slate-500">
              Direct live sync from PostgreSQL database table.
            </p>
          </div>
          <Link
            href="/shipments"
            className="text-xs font-bold text-ntgx-red hover:underline inline-flex items-center gap-1"
          >
            Full Manifest &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Tracking Number</th>
                <th className="px-6 py-3">Recipient</th>
                <th className="px-6 py-3">Destination</th>
                <th className="px-6 py-3">Service Tier</th>
                <th className="px-6 py-3">Weight</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-slate-300" />
                    Querying live PostgreSQL database...
                  </td>
                </tr>
              ) : (stats?.recentShipments?.length ?? 0) === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No shipments found in database.
                  </td>
                </tr>
              ) : (
                stats?.recentShipments.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3 font-mono font-bold text-slate-900">
                      <Link
                        href={`/tracking?query=${row.trackingNumber}`}
                        className="hover:text-ntgx-red transition-colors"
                      >
                        {row.trackingNumber.slice(0, 4)} {row.trackingNumber.slice(4, 8)} {row.trackingNumber.slice(8, 12)}
                      </Link>
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-800">{row.recipient}</td>
                    <td className="px-6 py-3 text-slate-600">{row.destination}</td>
                    <td className="px-6 py-3 text-slate-600 font-medium">{row.service}</td>
                    <td className="px-6 py-3 font-mono text-slate-600">{row.weight}</td>
                    <td className="px-6 py-3">
                      <Badge style={getStatusBadgeStyle(row.status)}>
                        {row.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link
                        href={`/tracking?query=${row.trackingNumber}`}
                        className="text-ntgx-red hover:underline font-bold text-2xs"
                      >
                        Track &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
