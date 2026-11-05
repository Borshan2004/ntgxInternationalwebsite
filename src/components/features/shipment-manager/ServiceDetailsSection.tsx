// src/components/features/shipment-manager/ServiceDetailsSection.tsx
'use client';

import React from 'react';
import type {
  ServiceSelectionData,
  ServiceTier,
  SignatureOption,
  RateCalculationResult,
} from '@/types/shipment';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';

export interface ServiceDetailsSectionProps {
  readonly service: ServiceSelectionData;
  readonly onChange: (updated: ServiceSelectionData) => void;
  readonly rateCalculation: RateCalculationResult | null;
  readonly isCalculatingRate: boolean;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

const SERVICE_TIER_OPTIONS = [
  {
    value: 'INTERNATIONAL_PRIORITY',
    label: 'NTGX International Priority (1-3 Business Days)',
  },
  {
    value: 'INTERNATIONAL_ECONOMY',
    label: 'NTGX International Economy (4-6 Business Days)',
  },
  {
    value: 'INTERNATIONAL_FIRST',
    label: 'NTGX International First (Early Morning Delivery)',
  },
  {
    value: 'STANDARD_OVERNIGHT',
    label: 'NTGX Standard Overnight (Next Afternoon)',
  },
  {
    value: 'PRIORITY_OVERNIGHT',
    label: 'NTGX Priority Overnight (Next Morning)',
  },
  {
    value: 'GROUND_STANDARD',
    label: 'NTGX Ground / Economy Regional',
  },
];

const SIGNATURE_OPTIONS = [
  { value: 'NO_SIGNATURE_REQUIRED', label: 'No Signature Required (NSR)' },
  { value: 'INDIRECT_SIGNATURE', label: 'Indirect Signature (Neighbor/Building Manager)' },
  { value: 'DIRECT_SIGNATURE', label: 'Direct Signature Required (DSR - Fee $5.50)' },
  { value: 'ADULT_SIGNATURE', label: 'Adult Signature Required (ASR - Fee $7.00)' },
];

export const ServiceDetailsSection: React.FC<ServiceDetailsSectionProps> = ({
  service,
  onChange,
  rateCalculation,
  isCalculatingRate,
  onNext,
  onBack,
}) => {
  const updateField = <K extends keyof ServiceSelectionData>(
    field: K,
    val: ServiceSelectionData[K]
  ): void => {
    onChange({ ...service, [field]: val });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Select
            label="NTGX Service Tier"
            options={SERVICE_TIER_OPTIONS}
            value={service.serviceTier}
            onChange={(e) => updateField('serviceTier', e.target.value as ServiceTier)}
          />
        </div>
        <div>
          <Input
            label="Ship Date"
            type="date"
            required
            value={service.shipDate}
            onChange={(e) => updateField('shipDate', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Special Delivery & Signature Option"
          options={SIGNATURE_OPTIONS}
          value={service.signatureOption}
          onChange={(e) =>
            updateField('signatureOption', e.target.value as SignatureOption)
          }
        />
        <div className="flex items-center pt-6">
          <Checkbox
            label="Hold at NTGX Station Location"
            checked={service.holdAtLocation}
            onChange={(e) => updateField('holdAtLocation', e.target.checked)}
          />
        </div>
      </div>

      {/* Real-Time Rate & Routing Telemetry Card */}
      <div className="rounded-lg border border-brand-purple/20 bg-brand-purpleSubtle/50 p-4">
        <div className="flex items-center justify-between pb-2 border-b border-brand-purple/10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
            Real-Time Carrier Rate & Transit Preview
          </span>
          {isCalculatingRate && (
            <span className="text-xs text-neutral-textSecondary animate-pulse">
              Recalculating live rates...
            </span>
          )}
        </div>

        {rateCalculation ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-xs">
            <div>
              <span className="text-neutral-textSecondary block">Routing Zone:</span>
              <strong className="text-neutral-textPrimary">
                {rateCalculation.zoneCode} ({rateCalculation.destAirportHub})
              </strong>
            </div>
            <div>
              <span className="text-neutral-textSecondary block">Chargeable Wgt:</span>
              <strong className="text-neutral-textPrimary">
                {rateCalculation.totalChargeableWeightKg} KG
              </strong>
            </div>
            <div>
              <span className="text-neutral-textSecondary block">Est. Delivery Date:</span>
              <strong className="text-emerald-700">
                {rateCalculation.estimatedDeliveryDate} (
                {rateCalculation.estimatedDeliveryMinDays}-
                {rateCalculation.estimatedDeliveryMaxDays} Days)
              </strong>
            </div>
            <div>
              <span className="text-neutral-textSecondary block">Total Rate (USD):</span>
              <strong className="text-brand-purple text-sm font-bold">
                ${rateCalculation.totalShippingCostUsd.toFixed(2)} USD
              </strong>
            </div>
          </div>
        ) : (
          <p className="text-xs text-neutral-textSecondary mt-2">
            Configure destination and package weight to view live rate quote.
          </p>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-neutral-border">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 text-xs text-neutral-textSecondary hover:text-neutral-textPrimary"
        >
          &larr; Back to Contents
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-brand-purple text-white text-xs font-semibold rounded hover:bg-brand-purpleHover"
        >
          Continue to Pickup Schedule &rarr;
        </button>
      </div>
    </div>
  );
};
