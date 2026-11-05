// src/components/features/shipment-manager/DeliverToSection.tsx
'use client';

import React from 'react';
import type { PartyAddressData } from '@/types/shipment';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';

export interface DeliverToSectionProps {
  readonly data: PartyAddressData;
  readonly onChange: (updated: PartyAddressData) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

const DEST_COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States (US)' },
  { value: 'CA', label: 'Canada (CA)' },
  { value: 'GB', label: 'United Kingdom (GB)' },
  { value: 'DE', label: 'Germany (DE)' },
  { value: 'AE', label: 'United Arab Emirates (AE)' },
  { value: 'BD', label: 'Bangladesh (BD)' },
];

export const DeliverToSection: React.FC<DeliverToSectionProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  const updateField = <K extends keyof PartyAddressData>(
    field: K,
    val: PartyAddressData[K]
  ): void => {
    onChange({ ...data, [field]: val });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-border">
        <span className="text-xs font-semibold text-neutral-textSecondary uppercase tracking-wider">
          Destination & Consignee Information
        </span>
        <Checkbox
          label="This is a residential address (Fee applies)"
          checked={data.isResidential}
          onChange={(e) => updateField('isResidential', e.target.checked)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Recipient Contact Name"
          required
          value={data.contactName}
          onChange={(e) => updateField('contactName', e.target.value)}
          placeholder="e.g. Dakota / Salman"
        />
        <Input
          label="Recipient Company"
          value={data.company || ''}
          onChange={(e) => updateField('company', e.target.value)}
          placeholder="e.g. Bernette Textile Co. Ltd."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Recipient Tax ID / State Tax"
          value={data.taxId || ''}
          onChange={(e) => updateField('taxId', e.target.value)}
          placeholder="e.g. US-EIN-13-987654"
        />
        <Input
          label="Recipient Phone"
          required
          type="tel"
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="212-279-5526"
        />
        <Input
          label="Recipient Email"
          required
          type="email"
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="logistics@recipient.com"
        />
      </div>

      <div className="space-y-2">
        <Input
          label="Delivery Street Address"
          required
          value={data.addressLine1}
          onChange={(e) => updateField('addressLine1', e.target.value)}
          placeholder="42 West 39th Street, 11th Floor"
        />
        <Input
          label="Address Line 2 (Suite, Apt, Dept)"
          value={data.addressLine2 || ''}
          onChange={(e) => updateField('addressLine2', e.target.value)}
          placeholder="Suite 1102"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="City"
          required
          value={data.city}
          onChange={(e) => updateField('city', e.target.value)}
          placeholder="New York"
        />
        <Input
          label="State / Province"
          value={data.stateProvince || ''}
          onChange={(e) => updateField('stateProvince', e.target.value)}
          placeholder="NY"
        />
        <Input
          label="Postal / ZIP Code"
          required
          value={data.postalCode}
          onChange={(e) => updateField('postalCode', e.target.value)}
          placeholder="10018"
        />
        <Select
          label="Destination Country"
          options={DEST_COUNTRY_OPTIONS}
          value={data.countryCode}
          onChange={(e) => updateField('countryCode', e.target.value)}
        />
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-neutral-border">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 text-xs text-neutral-textSecondary hover:text-neutral-textPrimary"
        >
          &larr; Back to Ship From
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-brand-purple text-white text-xs font-semibold rounded hover:bg-brand-purpleHover"
        >
          Continue to Package Details &rarr;
        </button>
      </div>
    </div>
  );
};
