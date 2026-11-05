// src/components/features/tracking/TrackingTimeline.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import type { FedExTrackApiResponse, ScanEventCode } from '@/types/shipment';
import { formatTrackingNumber } from '@/services/barcodeService';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Truck,
  MapPin,
  PackageCheck,
  Building,
  Plane,
  FileText,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface TrackingTimelineProps {
  readonly telemetry: FedExTrackApiResponse;
  readonly onRefresh?: () => void;
}

const MILESTONE_ORDER: readonly { code: ScanEventCode; label: string; sublabel: string }[] = [
  { code: 'OC', label: 'Order Created', sublabel: 'Label Printed' },
  { code: 'PU', label: 'Picked Up', sublabel: 'Shipper Dock' },
  { code: 'AF', label: 'Origin Hub', sublabel: 'DACA Terminal' },
  { code: 'IT', label: 'In Transit', sublabel: 'Air Linehaul' },
  { code: 'AR', label: 'Dest Hub', sublabel: 'Customs Cleared' },
  { code: 'OD', label: 'Out for Delivery', sublabel: 'Courier Vehicle' },
  { code: 'DL', label: 'Delivered', sublabel: 'Signed Receipt' },
];

function resolveMilestoneIndex(code: string, statusBy?: string): number {
  if (statusBy === 'DELIVERED' || code === 'DL') return 6;
  if (statusBy === 'OUT_FOR_DELIVERY' || code === 'OD') return 5;
  if (statusBy === 'AT_DESTINATION_FACILITY' || code === 'AR') return 4;
  if (statusBy === 'IN_TRANSIT' || code === 'IT' || code === 'DP') return 3;
  if (statusBy === 'AT_ORIGIN_FACILITY' || code === 'AF') return 2;
  if (statusBy === 'PICKUP_SCHEDULED' || statusBy === 'PICKED_UP' || code === 'PU') return 1;
  return 0; // OC / DRAFT_INCOMPLETE / SHIPMENT_CREATED_PRINTED
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ telemetry, onRefresh }) => {
  const currentCode = telemetry.latestStatusDetail.code;
  const statusBy = telemetry.latestStatusDetail.statusBy;
  const currentMilestoneIndex = resolveMilestoneIndex(currentCode, statusBy);
  const formattedTrk = formatTrackingNumber(telemetry.trackingNumberInfo.trackingNumber);

  const isDelivered = statusBy === 'DELIVERED' || currentCode === 'DL';
  const isException = statusBy === 'DELIVERY_EXCEPTION' || currentCode === 'DE';

  const originEvent = telemetry.scanEvents[0];
  const latestEvent = telemetry.scanEvents[telemetry.scanEvents.length - 1] || originEvent;

  // Percentage for the animated horizontal progress fill line
  const progressPercent = Math.max(0, Math.min(100, (currentMilestoneIndex / (MILESTONE_ORDER.length - 1)) * 100));

  const getStatusIcon = (idx: number) => {
    if (idx < currentMilestoneIndex) {
      return <CheckCircle2 className="h-4 w-4 text-white" />;
    }
    if (idx === currentMilestoneIndex) {
      if (isDelivered) return <PackageCheck className="h-5 w-5 text-white" />;
      if (isException) return <AlertTriangle className="h-5 w-5 text-white" />;
      if (currentCode === 'OD') return <Truck className="h-5 w-5 text-white" />;
      if (currentCode === 'IT' || currentCode === 'DP') return <Plane className="h-5 w-5 text-white" />;
      return <CheckCircle2 className="h-5 w-5 text-white" />;
    }
    return <Clock className="h-3.5 w-3.5 text-neutral-400" />;
  };

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP TELEMETRY SUMMARY HERO CARD
          ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-neutral-border bg-white shadow-card overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <span className="text-2xs font-bold tracking-widest uppercase text-neutral-400">
                NTGX Express Live Telemetry Network
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                {formattedTrk}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="bg-neutral-800 border-neutral-700 text-neutral-200 hover:text-white hover:bg-neutral-700 text-xs"
              >
                Refresh Telemetry
              </Button>
            )}
            <Link href={`/shipments/${telemetry.trackingNumberInfo.trackingNumber}`}>
              <Button
                variant="primary"
                size="sm"
                className="bg-ntgx-red hover:bg-ntgx-redHover text-white text-xs font-bold"
              >
                <FileText className="h-3.5 w-3.5 mr-1" /> View AWB &amp; Invoice
              </Button>
            </Link>
          </div>
        </div>

        {/* Status & Key Metrics Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-b border-neutral-border bg-neutral-50/50">
          {/* Status Badge */}
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <span className="text-2xs font-bold uppercase tracking-wider text-neutral-500 block">
              Current Shipment Status
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider',
                  isDelivered
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : isException
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-red-100 text-ntgx-red border border-red-200'
                )}
              >
                {statusBy.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-1 font-medium truncate">
              {telemetry.latestStatusDetail.description}
            </p>
          </div>

          {/* Destination */}
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <span className="text-2xs font-bold uppercase tracking-wider text-neutral-500 block">
              Destination Location
            </span>
            <div className="mt-1 text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-ntgx-red shrink-0" />
              <span>
                {latestEvent.scanLocation.city}
                {latestEvent.scanLocation.stateOrProvinceCode ? `, ${latestEvent.scanLocation.stateOrProvinceCode}` : ''}
                , {latestEvent.scanLocation.countryCode}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Origin: Dhaka (DACA), BD
            </p>
          </div>

          {/* Estimated / Delivered Time */}
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <span className="text-2xs font-bold uppercase tracking-wider text-neutral-500 block">
              {isDelivered ? 'Delivered At' : 'Estimated Delivery'}
            </span>
            <div className="mt-1 text-sm font-bold text-emerald-700 flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{telemetry.latestStatusDetail.estimatedDeliveryTime || 'On Schedule'}</span>
            </div>
            {latestEvent.signedBy && (
              <p className="text-xs text-neutral-600 mt-1 font-medium">
                Signed by: <strong className="text-neutral-900">{latestEvent.signedBy}</strong>
              </p>
            )}
          </div>

          {/* Package Weight & Service */}
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <span className="text-2xs font-bold uppercase tracking-wider text-neutral-500 block">
              Service &amp; Chargeable Weight
            </span>
            <div className="mt-1 text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Building className="h-4 w-4 text-neutral-600 shrink-0" />
              <span>NTGX International Priority</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1 font-mono">
              Weight: {telemetry.packageWeight.value} {telemetry.packageWeight.units}
            </p>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. HORIZONTAL VISUAL MILESTONE STEPPER
            ───────────────────────────────────────────────────────────── */}
        <div className="p-6">
          <div className="text-2xs font-bold uppercase tracking-wider text-neutral-400 mb-6">
            Transit Milestones Progress
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="relative min-w-[700px] px-6">
              {/* Background Connection Track */}
              <div className="absolute top-5 left-10 right-10 h-1 bg-neutral-200 -z-0" />

              {/* Active Filled Progress Track */}
              <div
                className="absolute top-5 left-10 h-1 bg-emerald-600 -z-0 transition-all duration-700 ease-out"
                style={{ width: `calc((100% - 5rem) * ${progressPercent / 100})` }}
              />

              {/* Milestones Steps */}
              <div className="flex justify-between relative z-10">
                {MILESTONE_ORDER.map((milestone, idx) => {
                  const isPast = idx < currentMilestoneIndex;
                  const isCurrent = idx === currentMilestoneIndex;

                  return (
                    <div
                      key={milestone.code}
                      className="flex flex-col items-center text-center w-24"
                    >
                      {/* Step Circle Badge */}
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 border-2 select-none',
                          isCurrent
                            ? isException
                              ? 'bg-amber-500 border-amber-600 ring-4 ring-amber-100 shadow-md scale-110'
                              : isDelivered
                              ? 'bg-emerald-600 border-emerald-700 ring-4 ring-emerald-100 shadow-md scale-110'
                              : 'bg-ntgx-red border-red-700 ring-4 ring-red-100 shadow-md scale-110'
                            : isPast
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                            : 'bg-white border-neutral-300 text-neutral-400'
                        )}
                      >
                        {getStatusIcon(idx)}
                      </div>

                      {/* Label */}
                      <span
                        className={cn(
                          'text-xs font-bold mt-2.5 whitespace-nowrap',
                          isCurrent
                            ? isDelivered
                              ? 'text-emerald-700'
                              : 'text-ntgx-red'
                            : isPast
                            ? 'text-neutral-800'
                            : 'text-neutral-400'
                        )}
                      >
                        {milestone.label}
                      </span>

                      {/* Sublabel */}
                      <span className="text-[10px] text-neutral-500 mt-0.5 whitespace-nowrap">
                        {milestone.sublabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. GRANULAR SCAN TRAVEL HISTORY TABLE
          ───────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-neutral-border bg-white shadow-card overflow-hidden">
        <div className="border-b border-neutral-border px-6 py-4 bg-neutral-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Verified Telemetry &amp; Courier Scans
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Time-stamped audit events synchronized with regional NTGX gateway hubs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded-full">
              {telemetry.scanEvents.length} Recorded Milestones
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="text-xs font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 border border-neutral-300 rounded-md px-2.5 py-1 hover:bg-white transition-colors"
            >
              <Printer className="h-3 w-3" /> Print
            </button>
          </div>
        </div>

        <div className="divide-y divide-neutral-200 text-xs">
          {telemetry.scanEvents.map((ev, index) => {
            const dateObj = new Date(ev.timestamp);
            const dateStr = dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const timeStr = dateObj.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });

            const isLatestEvent = index === telemetry.scanEvents.length - 1;

            return (
              <div
                key={index}
                className={cn(
                  'flex flex-col sm:flex-row sm:items-center justify-between p-4 transition-colors gap-2',
                  isLatestEvent ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-neutral-50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {ev.eventType === 'DL' ? (
                      <PackageCheck className="h-4 w-4 text-emerald-600" />
                    ) : ev.eventType === 'OD' ? (
                      <Truck className="h-4 w-4 text-blue-600" />
                    ) : ev.eventType === 'IT' || ev.eventType === 'DP' ? (
                      <Plane className="h-4 w-4 text-ntgx-red" />
                    ) : (
                      <MapPin className="h-4 w-4 text-neutral-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 text-xs flex items-center gap-2">
                      <span>{ev.eventDescription}</span>
                      {isLatestEvent && (
                        <span className="bg-ntgx-red text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded-xs">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="text-neutral-500 text-2xs mt-0.5">
                      Location: {ev.scanLocation.city}
                      {ev.scanLocation.stateOrProvinceCode ? `, ${ev.scanLocation.stateOrProvinceCode}` : ''}
                      , {ev.scanLocation.countryCode}
                    </div>
                    {ev.signedBy && (
                      <div className="text-emerald-700 font-semibold text-2xs mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Signed Receipt: {ev.signedBy}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-neutral-600 shrink-0">
                  <div className="font-bold text-neutral-800">{dateStr}</div>
                  <div className="text-2xs text-neutral-500">{timeStr}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
