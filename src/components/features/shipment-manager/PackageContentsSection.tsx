// src/components/features/shipment-manager/PackageContentsSection.tsx
'use client';

import React from 'react';
import type {
  CustomsContentType,
  CommodityLineItem,
  UnitOfMeasure,
} from '@/types/shipment';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Plus, Trash2 } from 'lucide-react';

export interface PackageContentsSectionProps {
  readonly contentType: CustomsContentType;
  readonly onContentTypeChange: (type: CustomsContentType) => void;
  readonly commodities: readonly CommodityLineItem[];
  readonly onUpdateCommodity: (index: number, partial: Partial<CommodityLineItem>) => void;
  readonly onAddCommodity: () => void;
  readonly onRemoveCommodity: (index: number) => void;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

const UOM_OPTIONS = [
  { value: 'PKS', label: 'PKS (Packs)' },
  { value: 'PCS', label: 'PCS (Pieces)' },
  { value: 'KGS', label: 'KGS (Kilograms)' },
  { value: 'DOZ', label: 'DOZ (Dozens)' },
  { value: 'MTR', label: 'MTR (Meters)' },
];

export const PackageContentsSection: React.FC<PackageContentsSectionProps> = ({
  contentType,
  onContentTypeChange,
  commodities,
  onUpdateCommodity,
  onAddCommodity,
  onRemoveCommodity,
  onNext,
  onBack,
}) => {
  const totalCustomsValue = commodities.reduce((acc, c) => acc + c.totalValueUsd, 0);

  return (
    <div className="space-y-5">
      <div className="flex gap-6 p-3 bg-neutral-surfaceMuted rounded-md border border-neutral-border">
        <label className="flex items-center gap-2 text-xs font-semibold text-neutral-textPrimary cursor-pointer">
          <input
            type="radio"
            name="customsContentType"
            checked={contentType === 'COMMODITIES'}
            onChange={() => onContentTypeChange('COMMODITIES')}
            className="text-brand-purple focus:ring-brand-purple"
          />
          Commercial Goods / Commodities (Customs Invoice Required)
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold text-neutral-textPrimary cursor-pointer">
          <input
            type="radio"
            name="customsContentType"
            checked={contentType === 'DOCUMENTS_ONLY'}
            onChange={() => onContentTypeChange('DOCUMENTS_ONLY')}
            className="text-brand-purple focus:ring-brand-purple"
          />
          Documents Only (No Commercial Value)
        </label>
      </div>

      {contentType === 'DOCUMENTS_ONLY' ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-800">
          <strong>Document Classification:</strong> Business correspondence, legal documents, contracts, or non-commercial paper records. No customs invoice or HS tariff declaration is needed.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-textSecondary">
              Itemized Commercial Declaration Line Items
            </span>
            <span className="text-xs font-bold text-brand-purple">
              Total Customs Declared: ${totalCustomsValue.toFixed(2)} USD
            </span>
          </div>

          <div className="space-y-3">
            {commodities.map((item, index) => (
              <div
                key={item.id || index}
                className="rounded-lg border border-neutral-border p-3.5 bg-white relative space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-neutral-border">
                  <span className="text-xs font-bold text-neutral-textSecondary">
                    Item #{index + 1}
                  </span>
                  {commodities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveCommodity(index)}
                      className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <Input
                      label="Commodity Description"
                      required
                      value={item.description}
                      onChange={(e) =>
                        onUpdateCommodity(index, { description: e.target.value })
                      }
                      placeholder="e.g. Sample of Men's Shorts (97% Cotton, 3% Spandex)"
                    />
                  </div>
                  <div>
                    <Input
                      label="Harmonized Tariff (HS) Code"
                      required
                      value={item.hsTariffCode}
                      onChange={(e) =>
                        onUpdateCommodity(index, { hsTariffCode: e.target.value })
                      }
                      placeholder="e.g. 98110060"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    required
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateCommodity(index, {
                        quantity: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <Select
                    label="UOM"
                    options={UOM_OPTIONS}
                    value={item.unitOfMeasure}
                    onChange={(e) =>
                      onUpdateCommodity(index, {
                        unitOfMeasure: e.target.value as UnitOfMeasure,
                      })
                    }
                  />
                  <Input
                    label="Net Weight (KG)"
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={item.netWeightKg}
                    onChange={(e) =>
                      onUpdateCommodity(index, {
                        netWeightKg: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <Input
                    label="Unit Value ($)"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={item.unitValueUsd}
                    onChange={(e) =>
                      onUpdateCommodity(index, {
                        unitValueUsd: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <Input
                    label="Total Value ($)"
                    type="number"
                    readOnly
                    value={item.totalValueUsd}
                    className="bg-neutral-surfaceMuted font-mono font-semibold"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onAddCommodity}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-purple text-brand-purple rounded-md text-xs font-semibold hover:bg-brand-purpleSubtle"
          >
            <Plus className="h-4 w-4" /> Add Commodity Line Item
          </button>
        </div>
      )}

      <div className="pt-2 flex items-center justify-between border-t border-neutral-border">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 text-xs text-neutral-textSecondary hover:text-neutral-textPrimary"
        >
          &larr; Back to Package Details
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 bg-brand-purple text-white text-xs font-semibold rounded hover:bg-brand-purpleHover"
        >
          Continue to Service Selection &rarr;
        </button>
      </div>
    </div>
  );
};
