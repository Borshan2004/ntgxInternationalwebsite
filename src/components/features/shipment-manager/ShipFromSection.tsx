// src/components/features/shipment-manager/ShipFromSection.tsx
'use client';

import React from 'react';
import type { PartyAddressData } from '@/types/shipment';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';

export interface ShipFromSectionProps {
  readonly data: PartyAddressData;
  readonly onChange: (updated: PartyAddressData) => void;
  readonly onNext: () => void;
}

const COUNTRY_OPTIONS = [
  { value: 'BD', label: 'Bangladesh (BD)' },
  { value: 'US', label: 'United States (US)' },
  { value: 'CA', label: 'Canada (CA)' },
  { value: 'GB', label: 'United Kingdom (GB)' },
  { value: 'DE', label: 'Germany (DE)' },
  { value: 'AE', label: 'United Arab Emirates (AE)' },
];

export const ShipFromSection: React.FC<ShipFromSectionProps> = ({
  data,
  onChange,
  onNext,
}) => {
  const updateField = <K extends keyof PartyAddressData>(
    field: K,
    val: PartyAddressData[K]
  ): void => {
    onChange({ ...data, [field]: val });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Contact Name"
          required
          value={data.contactName}
          onChange={(e) => updateField('contactName', e.target.value)}
          placeholder="e.g. Arafat / Gunjan"
        />
        <Input
          label="Company / Organization"
          value={data.company || ''}
          onChange={(e) => updateField('company', e.target.value)}
          placeholder="e.g. Apparel Sourcing International Inc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Tax ID / EORI / BIN"
          value={data.taxId || ''}
          onChange={(e) => updateField('taxId', e.target.value)}
          placeholder="e.g. BIN-908122-BD"
        />
        <Input
          label="Phone Number"
          required
          type="tel"
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="8801989451709"
        />
        <Input
          label="Email Address"
          required
          type="email"
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="shipping@company.com"
        />
      </div>

      <div className="space-y-2">
        <Input
          label="Address Line 1"
          required
          value={data.addressLine1}
          onChange={(e) => updateField('addressLine1', e.target.value)}
          placeholder="House # 30 (3rd Floor), Apt-B3"
        />
        <Input
          label="Address Line 2 (Optional)"
          value={data.addressLine2 || ''}
          onChange={(e) => updateField('addressLine2', e.target.value)}
          placeholder="Western Road, Banani DOHS"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="City"
          required
          value={data.city}
          onChange={(e) => updateField('city', e.target.value)}
          placeholder="Dhaka"
        />
        <Input
          label="State / Province"
          value={data.stateProvince || ''}
          onChange={(e) => updateField('stateProvince', e.target.value)}
          placeholder="Dhaka Division"
        />
        <Input
          label="Postal Code"
          required
          value={data.postalCode}
          onChange={(e) => updateField('postalCode', e.target.value)}
          placeholder="1206"
        />
        <Select
          label="Country / Territory"
          options={COUNTRY_OPTIONS}
          value={data.countryCode}
          onChange={(e) => updateField('countryCode', e.target.value)}
        />
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between border-t border-neutral-border gap-3">
        <div className="flex gap-4">
          <Checkbox
            label="Save to Address Book"
            checked={Boolean(data.saveToAddressBook)}
            onChange={(e) => updateField('saveToAddressBook', e.target.checked)}
          />
          <Checkbox
            label="Set as default sender"
            checked={Boolean(data.setAsDefaultSender)}
            onChange={(e) => updateField('setAsDefaultSender', e.target.checked)}
          />
        </div>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-brand-purple text-white text-xs font-semibold rounded hover:bg-brand-purpleHover"
        >
          Continue to Deliver To &rarr;
        </button>
      </div>
    </div>
  );
};
