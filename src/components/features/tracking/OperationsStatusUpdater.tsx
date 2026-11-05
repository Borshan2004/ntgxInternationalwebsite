// src/components/features/tracking/OperationsStatusUpdater.tsx
'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
  Loader2,
  CheckCircle2,
  Truck,
  Plane,
  Building,
  AlertTriangle,
  PackageCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { ShipmentStatus, ScanEventCode, FedExTrackApiResponse } from '@/types/shipment';

interface OperationsStatusUpdaterProps {
  readonly trackingNumber: string;
  readonly currentStatus: ShipmentStatus;
  readonly destinationCity: string;
  readonly destinationCountry: string;
  readonly onUpdated: (updatedTelemetry: FedExTrackApiResponse) => void;
}

interface MilestonePreset {
  readonly status: ShipmentStatus;
  readonly eventCode: ScanEventCode;
  readonly label: string;
  readonly defaultDescription: string;
  readonly locationCity?: string;
  readonly locationCountry?: string;
  readonly icon: React.ElementType;
}

const MILESTONE_PRESETS: readonly MilestonePreset[] = [
  {
    status: 'PICKED_UP',
    eventCode: 'PU',
    label: 'Picked Up by Courier',
    defaultDescription: 'Courier accepted package at shipper loading dock.',
    locationCity: 'Dhaka',
    locationCountry: 'BD',
    icon: Truck,
  },
  {
    status: 'AT_ORIGIN_FACILITY',
    eventCode: 'AF',
    label: 'Origin Gateway (DACA)',
    defaultDescription: 'Package sorted and processed at NTGX Air Gateway DACA.',
    locationCity: 'Dhaka',
    locationCountry: 'BD',
    icon: Building,
  },
  {
    status: 'IN_TRANSIT',
    eventCode: 'IT',
    label: 'Departed on Flight (In Transit)',
    defaultDescription: 'Departed origin hub DACA via scheduled linehaul flight.',
    locationCity: 'Dhaka',
    locationCountry: 'BD',
    icon: Plane,
  },
  {
    status: 'AT_DESTINATION_FACILITY',
    eventCode: 'AR',
    label: 'Dest Hub (Customs Cleared)',
    defaultDescription: 'Customs cleared at destination gateway terminal.',
    icon: Building,
  },
  {
    status: 'OUT_FOR_DELIVERY',
    eventCode: 'OD',
    label: 'Out for Delivery',
    defaultDescription: 'Package with local NTGX courier for final delivery handover.',
    icon: Truck,
  },
  {
    status: 'DELIVERED',
    eventCode: 'DL',
    label: 'Delivered & Signed',
    defaultDescription: 'Package delivered to recipient and signature recorded.',
    icon: PackageCheck,
  },
  {
    status: 'DELIVERY_EXCEPTION',
    eventCode: 'DE',
    label: 'Customs / Delivery Exception',
    defaultDescription: 'Consignee address clearance documentation review required.',
    icon: AlertTriangle,
  },
];

export function OperationsStatusUpdater({
  trackingNumber,
  currentStatus,
  destinationCity,
  destinationCountry,
  onUpdated,
}: OperationsStatusUpdaterProps): React.JSX.Element {
  const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus>(currentStatus);
  const [eventCode, setEventCode] = useState<ScanEventCode>('IT');
  const [description, setDescription] = useState<string>('Package processed at regional gateway.');
  const [city, setCity] = useState<string>(destinationCity || 'Dhaka');
  const [countryCode, setCountryCode] = useState<string>(destinationCountry || 'US');
  const [signedBy, setSignedBy] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const applyPreset = (preset: MilestonePreset): void => {
    setSelectedStatus(preset.status);
    setEventCode(preset.eventCode);
    setDescription(preset.defaultDescription);
    if (preset.locationCity) setCity(preset.locationCity);
    else setCity(destinationCity);
    if (preset.locationCountry) setCountryCode(preset.locationCountry);
    else setCountryCode(destinationCountry);
    if (preset.status === 'DELIVERED' && !signedBy) {
      setSignedBy('Authorized Signer');
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/track/v1/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingNumber,
          status: selectedStatus,
          eventCode,
          description,
          city,
          countryCode: countryCode.toUpperCase().slice(0, 2),
          signedBy: selectedStatus === 'DELIVERED' ? (signedBy || 'Consignee') : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to post milestone update');
      }

      const data = (await res.json()) as { telemetry: FedExTrackApiResponse; message: string };
      setMessage(data.message || 'Milestone update posted successfully.');
      onUpdated(data.telemetry);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      setMessage(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-ntgx-red/20 shadow-md p-6 space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-border gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-ntgx-red text-white flex items-center justify-center shrink-0">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-ntgx-red flex items-center gap-2">
              Staff Operations Console
              <span className="bg-red-100 text-ntgx-red text-[10px] font-bold px-2 py-0.5 rounded-full">
                Admin &amp; Employee Access Only
              </span>
            </div>
            <p className="text-2xs text-neutral-500 mt-0.5">
              Customers can only view tracking updates. Use this panel to advance the shipment timeline and log facility scans.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
            message.startsWith('Error')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Quick Milestone Advancement Buttons */}
      <div>
        <span className="text-2xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">
          1-Click Milestone Advancement Presets:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {MILESTONE_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedStatus === preset.status;
            return (
              <button
                key={preset.status}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between h-20 ${
                  isSelected
                    ? 'border-ntgx-red bg-red-50/70 text-ntgx-red shadow-xs font-bold'
                    : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50 text-neutral-700'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-ntgx-red' : 'text-neutral-500'}`} />
                <span className="text-[11px] leading-tight font-bold">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Details Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Select
              label="Shipment Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ShipmentStatus)}
              options={[
                { value: 'SHIPMENT_CREATED_PRINTED', label: 'Order Created' },
                { value: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled' },
                { value: 'PICKED_UP', label: 'Picked Up by Courier' },
                { value: 'AT_ORIGIN_FACILITY', label: 'At Origin Gateway (DACA)' },
                { value: 'IN_TRANSIT', label: 'In Transit / Linehaul' },
                { value: 'AT_DESTINATION_FACILITY', label: 'At Destination Facility' },
                { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
                { value: 'DELIVERED', label: 'Delivered' },
                { value: 'DELIVERY_EXCEPTION', label: 'Delivery Exception' },
              ]}
            />
          </div>

          <div>
            <Input
              label="Location (City)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Dhaka, New York, Berlin"
              required
            />
          </div>

          <div>
            <Input
              label="Country Code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              placeholder="e.g. BD, US, DE, CA"
              maxLength={2}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Input
              label="Event Description / Courier Remarks"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Scanned at outbound sorting belt"
              required
            />
          </div>

          <div>
            <Input
              label="Recipient Signed By (If Delivered)"
              value={signedBy}
              onChange={(e) => setSignedBy(e.target.value)}
              placeholder="e.g. J. O'Brien (Direct Signature)"
              disabled={selectedStatus !== 'DELIVERED'}
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="bg-ntgx-red hover:bg-ntgx-redHover text-white font-bold px-6 py-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <Send className="h-4 w-4 mr-1.5" />
            )}
            Post Milestone Scan &amp; Update Customer View
          </Button>
        </div>
      </form>
    </div>
  );
}
