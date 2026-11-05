// src/components/features/tracking/OperationsTrackingConsole.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Edit3,
  CheckCircle2,
  Clock,
  Truck,
  Plane,
  Building,
  AlertTriangle,
  PackageCheck,
  Eye,
  Loader2,
  X,
  MapPin,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatTrackingNumber } from '@/services/barcodeService';
import type { ShipmentSummaryItem, ShipmentStatus, ScanEventCode } from '@/types/shipment';
import { cn } from '@/lib/utils';

interface OperationsTrackingConsoleProps {
  readonly onInspectTracking: (trackingNumber: string) => void;
}

type CategoryFilter = 'ALL' | 'READY_FOR_PICKUP' | 'IN_TRANSIT' | 'DELIVERED' | 'EXCEPTIONS';
type SortOrder = 'NEWEST' | 'OLDEST' | 'TRACKING_ASC';

interface StatusPreset {
  readonly status: ShipmentStatus;
  readonly eventCode: ScanEventCode;
  readonly label: string;
  readonly defaultNote: string;
  readonly icon: React.ElementType;
  readonly color: string;
}

const STATUS_PRESETS: readonly StatusPreset[] = [
  {
    status: 'PICKED_UP',
    eventCode: 'PU',
    label: 'Picked Up by Courier',
    defaultNote: 'Courier collected parcel from shipper loading dock.',
    icon: Truck,
    color: 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100',
  },
  {
    status: 'AT_ORIGIN_FACILITY',
    eventCode: 'AF',
    label: 'Origin Air Gateway (DACA)',
    defaultNote: 'Parcel sorted and security screened at NTGX Air Gateway DACA.',
    icon: Building,
    color: 'border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100',
  },
  {
    status: 'IN_TRANSIT',
    eventCode: 'IT',
    label: 'Flight Departed (In Transit)',
    defaultNote: 'Departed origin hub via scheduled international linehaul flight.',
    icon: Plane,
    color: 'border-sky-300 text-sky-700 bg-sky-50 hover:bg-sky-100',
  },
  {
    status: 'AT_DESTINATION_FACILITY',
    eventCode: 'AR',
    label: 'Destination Hub (Customs Cleared)',
    defaultNote: 'Customs clearance completed at destination gateway terminal.',
    icon: Building,
    color: 'border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100',
  },
  {
    status: 'OUT_FOR_DELIVERY',
    eventCode: 'OD',
    label: 'Out for Delivery',
    defaultNote: 'Loaded on courier vehicle for final doorstep delivery handover.',
    icon: Truck,
    color: 'border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100',
  },
  {
    status: 'DELIVERED',
    eventCode: 'DL',
    label: 'Delivered & Signed',
    defaultNote: 'Delivered to recipient. Proof of delivery signature captured.',
    icon: PackageCheck,
    color: 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100',
  },
  {
    status: 'DELIVERY_EXCEPTION',
    eventCode: 'DE',
    label: 'Delivery Exception / Hold',
    defaultNote: 'Consignee address clearance documentation review required.',
    icon: AlertTriangle,
    color: 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100',
  },
];

export function OperationsTrackingConsole({
  onInspectTracking,
}: OperationsTrackingConsoleProps): React.JSX.Element {
  const [shipments, setShipments] = useState<readonly ShipmentSummaryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [category, setCategory] = useState<CategoryFilter>('ALL');
  const [sortOrder, setSortOrder] = useState<SortOrder>('NEWEST');

  // Modal Update State
  const [activeModalShipment, setActiveModalShipment] = useState<ShipmentSummaryItem | null>(null);
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('IN_TRANSIT');
  const [newEventCode, setNewEventCode] = useState<ScanEventCode>('IT');
  const [note, setNote] = useState<string>('');
  const [signedBy, setSignedBy] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateFeedback, setUpdateFeedback] = useState<{ success: boolean; text: string } | null>(null);

  const fetchShipments = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch('/api/shipments');
      if (res.ok) {
        const data = (await res.json()) as readonly ShipmentSummaryItem[];
        setShipments(data);
      }
    } catch {
      // Fetch error handled gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchShipments();
  }, []);

  // Filter & Categorize
  const filteredShipments = useMemo(() => {
    let result = [...shipments];

    // Status Category Filter
    if (category === 'READY_FOR_PICKUP') {
      result = result.filter((s) =>
        ['DRAFT_INCOMPLETE', 'SHIPMENT_CREATED_PRINTED', 'PICKUP_SCHEDULED'].includes(s.status)
      );
    } else if (category === 'IN_TRANSIT') {
      result = result.filter((s) =>
        ['PICKED_UP', 'AT_ORIGIN_FACILITY', 'IN_TRANSIT', 'AT_DESTINATION_FACILITY', 'OUT_FOR_DELIVERY'].includes(s.status)
      );
    } else if (category === 'DELIVERED') {
      result = result.filter((s) => s.status === 'DELIVERED');
    } else if (category === 'EXCEPTIONS') {
      result = result.filter((s) =>
        ['DELIVERY_EXCEPTION', 'RETURNED_TO_SHIPPER', 'CANCELLED'].includes(s.status)
      );
    }

    // Text Search Filter
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(q) ||
          s.recipient.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q) ||
          (s.sender && s.sender.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === 'NEWEST') {
        const dateA = a.createdDateTime || a.createdAt;
        const dateB = b.createdDateTime || b.createdAt;
        return dateB.localeCompare(dateA);
      }
      if (sortOrder === 'OLDEST') {
        const dateA = a.createdDateTime || a.createdAt;
        const dateB = b.createdDateTime || b.createdAt;
        return dateA.localeCompare(dateB);
      }
      if (sortOrder === 'TRACKING_ASC') {
        return a.trackingNumber.localeCompare(b.trackingNumber);
      }
      return 0;
    });

    return result;
  }, [shipments, category, searchQuery, sortOrder]);

  // Open Update Modal
  const handleOpenUpdateModal = (shipment: ShipmentSummaryItem): void => {
    setActiveModalShipment(shipment);
    setUpdateFeedback(null);

    // Recommend next natural milestone
    let nextSt: ShipmentStatus = 'IN_TRANSIT';
    let nextEv: ScanEventCode = 'IT';
    let defaultText = 'Parcel in transit via scheduled flight.';

    if (shipment.status === 'SHIPMENT_CREATED_PRINTED' || shipment.status === 'DRAFT_INCOMPLETE') {
      nextSt = 'PICKED_UP';
      nextEv = 'PU';
      defaultText = 'Courier collected parcel from shipper loading dock.';
    } else if (shipment.status === 'PICKUP_SCHEDULED') {
      nextSt = 'PICKED_UP';
      nextEv = 'PU';
      defaultText = 'Courier accepted package at shipper loading dock.';
    } else if (shipment.status === 'PICKED_UP') {
      nextSt = 'AT_ORIGIN_FACILITY';
      nextEv = 'AF';
      defaultText = 'Sorted and processed at NTGX Air Gateway DACA.';
    } else if (shipment.status === 'AT_ORIGIN_FACILITY') {
      nextSt = 'IN_TRANSIT';
      nextEv = 'IT';
      defaultText = 'Departed origin hub DACA via scheduled linehaul flight.';
    } else if (shipment.status === 'IN_TRANSIT') {
      nextSt = 'AT_DESTINATION_FACILITY';
      nextEv = 'AR';
      defaultText = 'Customs cleared at destination gateway terminal.';
    } else if (shipment.status === 'AT_DESTINATION_FACILITY') {
      nextSt = 'OUT_FOR_DELIVERY';
      nextEv = 'OD';
      defaultText = 'Package with local courier for final doorstep delivery.';
    } else if (shipment.status === 'OUT_FOR_DELIVERY') {
      nextSt = 'DELIVERED';
      nextEv = 'DL';
      defaultText = 'Delivered to recipient. Signature recorded.';
    }

    setNewStatus(nextSt);
    setNewEventCode(nextEv);
    setNote(defaultText);
    setSignedBy(shipment.recipient.split('(')[0].trim() || 'Consignee');
  };

  const handleSelectPreset = (preset: StatusPreset): void => {
    setNewStatus(preset.status);
    setNewEventCode(preset.eventCode);
    setNote(preset.defaultNote);
  };

  const handleSaveUpdate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!activeModalShipment) return;

    setUpdating(true);
    setUpdateFeedback(null);

    try {
      const res = await fetch('/api/track/v1/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingNumber: activeModalShipment.trackingNumber,
          status: newStatus,
          eventCode: newEventCode,
          description: note,
          signedBy: newStatus === 'DELIVERED' ? (signedBy || 'Consignee') : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update status');
      }

      const resData = (await res.json()) as { message?: string };
      setUpdateFeedback({
        success: true,
        text: resData.message || `Shipment ${activeModalShipment.trackingNumber} successfully updated to ${newStatus}.`,
      });

      // Update state in table immediately
      setShipments((prev) =>
        prev.map((s) =>
          s.trackingNumber === activeModalShipment.trackingNumber
            ? { ...s, status: newStatus }
            : s
        )
      );

      // Auto close modal after brief delay
      setTimeout(() => {
        setActiveModalShipment(null);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      setUpdateFeedback({ success: false, text: msg });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: ShipmentStatus): React.JSX.Element => {
    if (status === 'DELIVERED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-3 w-3" /> Delivered
        </span>
      );
    }
    if (['PICKED_UP', 'AT_ORIGIN_FACILITY', 'IN_TRANSIT', 'AT_DESTINATION_FACILITY', 'OUT_FOR_DELIVERY'].includes(status)) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
          <Plane className="h-3 w-3" /> {status.replace(/_/g, ' ')}
        </span>
      );
    }
    if (status === 'DELIVERY_EXCEPTION' || status === 'CANCELLED' || status === 'RETURNED_TO_SHIPPER') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
          <AlertTriangle className="h-3 w-3" /> {status.replace(/_/g, ' ')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
        <Clock className="h-3 w-3" /> {status.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & ACTION BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg font-black text-neutral-900 tracking-tight">
              Customer Shipments &amp; Milestone Operations
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Admin &amp; Employee hub to update parcel milestones regularly, categorize orders, and maintain real-time tracking accuracy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchShipments}
            isLoading={loading}
            className="text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh Orders
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. CATEGORY TABS & FILTER BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-100 pb-3">
          <button
            type="button"
            onClick={() => setCategory('ALL')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
              category === 'ALL'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            )}
          >
            All Shipments
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
              {shipments.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCategory('READY_FOR_PICKUP')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
              category === 'READY_FOR_PICKUP'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            )}
          >
            Ready for Pickup / New
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
              {
                shipments.filter((s) =>
                  ['DRAFT_INCOMPLETE', 'SHIPMENT_CREATED_PRINTED', 'PICKUP_SCHEDULED'].includes(s.status)
                ).length
              }
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCategory('IN_TRANSIT')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
              category === 'IN_TRANSIT'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            )}
          >
            In Transit &amp; Out for Delivery
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
              {
                shipments.filter((s) =>
                  ['PICKED_UP', 'AT_ORIGIN_FACILITY', 'IN_TRANSIT', 'AT_DESTINATION_FACILITY', 'OUT_FOR_DELIVERY'].includes(s.status)
                ).length
              }
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCategory('DELIVERED')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
              category === 'DELIVERED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            )}
          >
            Delivered
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
              {shipments.filter((s) => s.status === 'DELIVERED').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCategory('EXCEPTIONS')}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
              category === 'EXCEPTIONS'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            )}
          >
            Exceptions
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
              {
                shipments.filter((s) =>
                  ['DELIVERY_EXCEPTION', 'RETURNED_TO_SHIPPER', 'CANCELLED'].includes(s.status)
                ).length
              }
            </span>
          </button>
        </div>

        {/* Search and Sort Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tracking, recipient, or city…"
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5" /> Sort:
            </span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              aria-label="Sort shipments"
              className="text-xs font-semibold bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-ntgx-red"
            >
              <option value="NEWEST">Newest Date First</option>
              <option value="OLDEST">Oldest Date First</option>
              <option value="TRACKING_ASC">Tracking Number (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SHIPMENTS TABLE
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-ntgx-red mx-auto" />
            <div className="text-xs font-semibold text-neutral-600">Loading shipments database…</div>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Filter className="h-8 w-8 text-neutral-300 mx-auto" />
            <div className="text-sm font-bold text-neutral-700">No shipments found</div>
            <p className="text-xs text-neutral-500">
              Try adjusting your category filter or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="py-3 px-4">Tracking Number</th>
                  <th className="py-3 px-4">Recipient &amp; Destination</th>
                  <th className="py-3 px-4">Origin / Date</th>
                  <th className="py-3 px-4">Service &amp; Wgt</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Operations Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-neutral-50/80 transition-colors">
                    {/* Tracking Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900">
                      <div className="flex items-center gap-1.5">
                        <span>{formatTrackingNumber(s.trackingNumber)}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-normal">
                        ID: {s.id.slice(0, 8)}…
                      </span>
                    </td>

                    {/* Recipient & Destination */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900">{s.recipient}</div>
                      <div className="text-neutral-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-neutral-400 shrink-0" />
                        <span>{s.destination}</span>
                      </div>
                    </td>

                    {/* Origin & Date */}
                    <td className="py-3.5 px-4 text-neutral-600">
                      <div className="text-[11px]">{s.origin || 'Dhaka, BD'}</div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        <span>{s.createdAt}</span>
                      </div>
                    </td>

                    {/* Service & Weight */}
                    <td className="py-3.5 px-4 text-neutral-700">
                      <div className="font-medium text-[11px] truncate max-w-[140px]">{s.service}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{s.weight}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">{getStatusBadge(s.status)}</td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenUpdateModal(s)}
                          className="px-2.5 py-1.5 rounded-lg bg-ntgx-red hover:bg-ntgx-redHover text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Update Status</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onInspectTracking(s.trackingNumber)}
                          title="View Live Stepper Timeline"
                          className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-all cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MODAL: SIMPLE FOOLPROOF STATUS UPDATE FOR STAFF
          ───────────────────────────────────────────────────────────── */}
      {activeModalShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Operations Dispatch Scan
                </span>
                <h3 className="text-base font-black font-mono">
                  {formatTrackingNumber(activeModalShipment.trackingNumber)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalShipment(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUpdate} className="p-6 space-y-4">
              {/* Shipment Quick Info */}
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-xs text-neutral-700 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Recipient</span>
                  <span className="font-semibold">{activeModalShipment.recipient}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Current Status</span>
                  <span className="font-bold text-ntgx-red">{activeModalShipment.status.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {/* Fast 1-Click Milestone Presets */}
              <div>
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
                  1. Select Next Milestone (1-Click Preset)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_PRESETS.map((preset) => {
                    const IconComponent = preset.icon;
                    const isSelected = newStatus === preset.status;
                    return (
                      <button
                        key={preset.status}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={cn(
                          'p-2.5 rounded-lg border text-left text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer',
                          isSelected
                            ? 'border-ntgx-red bg-red-50 text-ntgx-red font-bold ring-1 ring-ntgx-red'
                            : preset.color
                        )}
                      >
                        <IconComponent className="h-4 w-4 shrink-0" />
                        <span className="truncate">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Note / Scan Description */}
              <div>
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1">
                  2. Scan Description / Milestone Note
                </label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Departed origin hub via scheduled flight"
                  className="text-xs"
                  required
                />
              </div>

              {/* Recipient Signature if Delivered */}
              {newStatus === 'DELIVERED' && (
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-1.5">
                  <label className="text-xs font-bold text-emerald-900 block flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Signature / Consignee Name (Proof of Delivery)
                  </label>
                  <Input
                    value={signedBy}
                    onChange={(e) => setSignedBy(e.target.value)}
                    placeholder="Recipient signature name (e.g. John Smith)"
                    className="text-xs bg-white"
                    required
                  />
                </div>
              )}

              {/* Feedback Alert */}
              {updateFeedback && (
                <div
                  className={cn(
                    'p-3 rounded-lg text-xs font-semibold flex items-center gap-2',
                    updateFeedback.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  )}
                >
                  {updateFeedback.success ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                  )}
                  <span>{updateFeedback.text}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveModalShipment(null)}
                  disabled={updating}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={updating}
                  className="bg-ntgx-red hover:bg-ntgx-redHover text-white text-xs font-bold shadow-xs px-5"
                >
                  <ShieldCheck className="h-4 w-4 mr-1.5" /> Confirm &amp; Save Milestone
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
