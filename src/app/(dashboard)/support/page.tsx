// src/app/(dashboard)/support/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  HelpCircle,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SupportPage(): React.JSX.Element {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="border-b border-neutral-border pb-4">
        <h1 className="text-2xl font-black text-neutral-textPrimary tracking-tight">
          NTGX Customer Support &amp; Help Center
        </h1>
        <p className="text-sm text-neutral-textSecondary mt-0.5">
          24/7 Global logistics dispatch, international freight support, and customs documentation assistance.
        </p>
      </div>

      {/* Emergency Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-l-ntgx-red">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 text-ntgx-red flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xs font-bold uppercase tracking-wider text-neutral-500">
                Operations Hotline
              </div>
              <div className="text-sm font-extrabold text-neutral-900 mt-0.5">
                +880 1989-451709
              </div>
              <div className="text-2xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3" /> 24/7 Live Dispatch Desk
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-ntgx-dark">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-zinc-100 text-neutral-900 flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xs font-bold uppercase tracking-wider text-neutral-500">
                Email Dispatch Desk
              </div>
              <div className="text-sm font-extrabold text-neutral-900 mt-0.5">
                operations@ntgx.com
              </div>
              <div className="text-2xs text-neutral-500 mt-0.5">
                Average response time: &lt; 15 mins
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-emerald-600">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xs font-bold uppercase tracking-wider text-neutral-500">
                Central Air Gateway Hub
              </div>
              <div className="text-sm font-extrabold text-neutral-900 mt-0.5">
                DACA Gateway (DAC)
              </div>
              <div className="text-2xs text-neutral-500 mt-0.5">
                House #30, Western Rd, Banani DOHS, BD
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Navigation Help Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping & Customs Guidance */}
        <div className="bg-white rounded-xl border border-neutral-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-ntgx-red" />
            <h2 className="text-base font-bold text-neutral-900">
              Shipping &amp; Documentation Guidelines
            </h2>
          </div>
          <ul className="space-y-3 text-xs text-neutral-600">
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>3-Page Air Waybill (Form 0430):</strong> Page 1 is the Consignee Copy (place on front of pouch), Page 2 is the Carrier Copy, and Page 3 is your Shipper Record.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Commercial Customs Invoices:</strong> Mandatory for all international non-document shipments. Must declare accurate 8-digit HS Tariff Codes and commercial values.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Pickup Windows:</strong> Outbound pickups scheduled before 01:30 PM are collected same-day by our local fleet couriers.
              </span>
            </li>
          </ul>

          <div className="pt-2">
            <Link href="/shipments/new">
              <Button variant="primary" className="bg-ntgx-red hover:bg-ntgx-redHover text-white text-xs font-bold">
                <Truck className="h-3.5 w-3.5 mr-1.5" /> Create New Outbound Shipment
              </Button>
            </Link>
          </div>
        </div>

        {/* Tracking & Telemetry Guidance */}
        <div className="bg-white rounded-xl border border-neutral-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-ntgx-red" />
            <h2 className="text-base font-bold text-neutral-900">
              Live Parcel Telemetry &amp; Scans
            </h2>
          </div>
          <ul className="space-y-3 text-xs text-neutral-600">
            <li className="flex items-start gap-2.5">
              <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Mod-11 Checksum Validation:</strong> NTGX uses 12-digit Mod-11 tracking numbers (e.g. <code>8790 9880 0901</code>) with high-density Code 128 barcodes.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Scan Milestones:</strong> Real-time status progression from Order Created (<code>OC</code>) &rarr; Picked Up (<code>PU</code>) &rarr; Gateway Departure (<code>DP</code>) &rarr; Delivery (<code>DL</code>).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Dual Confirmation Emails:</strong> Both client and operations teams receive automated PDF links and live tracking updates.
              </span>
            </li>
          </ul>

          <div className="pt-2">
            <Link href="/tracking">
              <Button variant="outline" className="border-neutral-300 text-neutral-800 hover:bg-neutral-50 text-xs font-bold">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Open Live Tracking Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
