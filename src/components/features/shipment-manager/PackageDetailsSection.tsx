// src/components/features/shipment-manager/PackageDetailsSection.tsx
'use client';

import React from 'react';
import type {
  PackagingType,
  PackageDimensionItem,
  WeightUnit,
  DimensionUnit,
} from '@/types/shipment';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2 } from 'lucide-react';

export interface PackageDetailsSectionProps {
  readonly packagingType: PackagingType;
  readonly onPackagingTypeChange: (type: PackagingType) => void;
  readonly packages: readonly PackageDimensionItem[];
  readonly onUpdatePackage: (index: number, partial: Partial<PackageDimensionItem>) => void;
  readonly onAddPackage: () => void;
  readonly onRemovePackage: (index: number) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

const PACKAGING_OPTIONS = [
  { value: 'YOUR_PACKAGING', label: 'Your Packaging (Customer Box/Crate)' },
  { value: 'FEDEX_ENVELOPE', label: 'NTGX Express Envelope (Up to 0.5 KG)' },
  { value: 'FEDEX_PAK', label: 'NTGX Express Pak (Padded / Poly)' },
  { value: 'FEDEX_BOX_SMALL', label: 'NTGX Express Small Box' },
  { value: 'FEDEX_BOX_MEDIUM', label: 'NTGX Express Medium Box' },
  { value: 'FEDEX_BOX_LARGE', label: 'NTGX Express Large Box' },
  { value: 'FEDEX_TUBE', label: 'NTGX Express Tube' },
];

export const PackageDetailsSection: React.FC<PackageDetailsSectionProps> = ({
  packagingType,
  onPackagingTypeChange,
  packages,
  onUpdatePackage,
  onAddPackage,
  onRemovePackage,
  onNext,
  onBack,
}) => {
  const totalActual = packages.reduce(
    (acc, p) => acc + (p.weightUnit === 'LB' ? p.actualWeight * 0.45359237 : p.actualWeight),
    0
  );
  const totalVolumetric = packages.reduce((acc, p) => acc + p.volumetricWeightKg, 0);
  const totalChargeable = Math.max(totalActual, totalVolumetric);

  return (
    <div className="space-y-5">
      <div className="max-w-md">
        <Select
          label="Packaging Type"
          options={PACKAGING_OPTIONS}
          value={packagingType}
          onChange={(e) => onPackagingTypeChange(e.target.value as PackagingType)}
        />
      </div>

      <div className="space-y-4">
        {packages.map((pkg, index) => (
          <div
            key={pkg.id || index}
            className="rounded-lg border border-neutral-border p-4 bg-neutral-surfaceMuted/50 relative"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-border">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Package #{pkg.packageIndex}
              </span>
              {packages.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemovePackage(index)}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              <Input
                label="Gross Weight"
                type="number"
                step="0.1"
                min="0.1"
                required
                value={pkg.actualWeight}
                onChange={(e) =>
                  onUpdatePackage(index, { actualWeight: parseFloat(e.target.value) || 0 })
                }
                rightAddon={pkg.weightUnit}
              />
              <Select
                label="Weight Unit"
                options={[
                  { value: 'KG', label: 'KG' },
                  { value: 'LB', label: 'LB' },
                ]}
                value={pkg.weightUnit}
                onChange={(e) =>
                  onUpdatePackage(index, { weightUnit: e.target.value as WeightUnit })
                }
              />
              <Input
                label="Length"
                type="number"
                min="1"
                required
                value={pkg.length}
                onChange={(e) =>
                  onUpdatePackage(index, { length: parseFloat(e.target.value) || 0 })
                }
              />
              <Input
                label="Width"
                type="number"
                min="1"
                required
                value={pkg.width}
                onChange={(e) =>
                  onUpdatePackage(index, { width: parseFloat(e.target.value) || 0 })
                }
              />
              <Input
                label="Height"
                type="number"
                min="1"
                required
                value={pkg.height}
                onChange={(e) =>
                  onUpdatePackage(index, { height: parseFloat(e.target.value) || 0 })
                }
                rightAddon={pkg.dimensionUnit}
              />
              <Select
                label="Dim Unit"
                options={[
                  { value: 'CM', label: 'CM' },
                  { value: 'IN', label: 'IN' },
                ]}
                value={pkg.dimensionUnit}
                onChange={(e) =>
                  onUpdatePackage(index, { dimensionUnit: e.target.value as DimensionUnit })
                }
              />
            </div>

            <div className="mt-3 pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-textSecondary bg-white p-2.5 rounded border border-neutral-border">
              <div className="flex gap-4">
                <span>
                  Volumetric Wgt:{' '}
                  <strong className="text-neutral-textPrimary font-mono">
                    {pkg.volumetricWeightKg.toFixed(2)} KG
                  </strong>
                </span>
                <span>
                  Chargeable Wgt:{' '}
                  <strong className="text-brand-purple font-mono">
                    {pkg.chargeableWeightKg.toFixed(2)} KG
                  </strong>
                </span>
              </div>
              <div className="w-36">
                <Input
                  label="Declared Value ($)"
                  type="number"
                  min="0"
                  value={pkg.declaredValueUsd}
                  onChange={(e) =>
                    onUpdatePackage(index, {
                      declaredValueUsd: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="py-1 text-xs"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onAddPackage}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-purple text-brand-purple rounded-md text-xs font-semibold hover:bg-brand-purpleSubtle"
        >
          <Plus className="h-4 w-4" /> Add Another Package
        </button>

        {/* Aggregate Banner */}
        <div className="flex items-center gap-4 bg-brand-purpleSubtle px-4 py-2 rounded-md border border-purple-200 text-xs">
          <span>
            Total Packages: <strong>{packages.length}</strong>
          </span>
          <span>
            Actual Wgt: <strong>{totalActual.toFixed(2)} KG</strong>
          </span>
          <span>
            Volumetric Wgt: <strong>{totalVolumetric.toFixed(2)} KG</strong>
          </span>
          <span className="text-brand-purple font-bold">
            Total Chargeable: {totalChargeable.toFixed(2)} KG
          </span>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-neutral-border">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 text-xs text-neutral-textSecondary hover:text-neutral-textPrimary"
        >
          &larr; Back to Deliver To
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-brand-purple text-white text-xs font-semibold rounded hover:bg-brand-purpleHover"
        >
          Continue to Customs & Contents &rarr;
        </button>
      </div>
    </div>
  );
};
