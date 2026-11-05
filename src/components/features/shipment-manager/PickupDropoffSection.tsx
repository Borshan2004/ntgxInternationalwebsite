// src/components/features/shipment-manager/PickupDropoffSection.tsx
'use client';

import React from 'react';
import type { PickupScheduleData } from '@/types/shipment';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export interface PickupDropoffSectionProps {
  readonly pickup: PickupScheduleData;
  readonly onChange: (updated: PickupScheduleData) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

const TIME_WINDOWS = [
  { value: '08:00 AM', label: '08:00 AM' },
  { value: '09:00 AM', label: '09:00 AM' },
  { value: '10:00 AM', label: '10:00 AM' },
  { value: '11:00 AM', label: '11:00 AM' },
  { value: '12:00 PM', label: '12:00 PM' },
  { value: '01:30 PM', label: '01:30 PM' },
  { value: '03:00 PM', label: '03:00 PM' },
  { value: '05:00 PM', label: '05:00 PM' },
];

export const PickupDropoffSection: React.FC<PickupDropoffSectionProps> = ({
  pickup,
  onChange,
  onNext,
  onBack,
}) => {
  const updateField = <K extends keyof PickupScheduleData>(
    field: K,
    val: PickupScheduleData[K]
  ): void => {
    onChange({ ...pickup, [field]: val });
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-6 p-3 bg-neutral-surfaceMuted rounded-md border border-neutral-border">
        <label className="flex items-center gap-2 text-xs font-semibold text-neutral-textPrimary cursor-pointer">
          <input
            type="radio"
            name="isDropOff"
            checked={!pickup.isDropOff}
            onChange={() => updateField('isDropOff', false)}
            className="text-brand-purple focus:ring-brand-purple"
          />
          Schedule Courier Pickup at Shipper Facility
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold text-neutral-textPrimary cursor-pointer">
          <input
            type="radio"
            name="isDropOff"
            checked={pickup.isDropOff}
            onChange={() => updateField('isDropOff', true)}
            className="text-brand-purple focus:ring-brand-purple"
          />
          Self Drop-Off at Authorized NTGX Station / Counter
        </label>
      </div>

      {!pickup.isDropOff ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Pickup Date"
              type="date"
              required
              value={pickup.pickupDate}
              onChange={(e) => updateField('pickupDate', e.target.value)}
            />
            <Select
              label="Earliest Ready Time"
              options={TIME_WINDOWS}
              value={pickup.earliestTime}
              onChange={(e) => updateField('earliestTime', e.target.value)}
            />
            <Select
              label="Latest Courier Window"
              options={TIME_WINDOWS}
              value={pickup.latestTime}
              onChange={(e) => updateField('latestTime', e.target.value)}
            />
          </div>

          <Input
            label="Special Courier Instructions / Loading Dock Details"
            value={pickup.instructions || ''}
            onChange={(e) => updateField('instructions', e.target.value)}
            placeholder="e.g. Please call recipient upon pickup arrival at gate 2."
          />
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800">
          <strong>Station Counter Drop-Off Selected:</strong> You may drop off your sealed package with printed Form 0430 Air Waybills attached at any authorized NTGX Ship Center or Airport Cargo Intake Facility.
        </div>
      )}

      <div className="pt-2 flex items-center justify-between border-t border-neutral-border">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 text-xs text-neutral-textSecondary hover:text-neutral-textPrimary"
        >
          &larr; Back to Service Selection
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-brand-purple text-white text-xs font-semibold rounded hover:bg-brand-purpleHover"
        >
          Continue to Billing & Notifications &rarr;
        </button>
      </div>
    </div>
  );
};
