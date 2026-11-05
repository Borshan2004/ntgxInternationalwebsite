// src/app/(dashboard)/admin/rates/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Plus,
  Globe2,
  Percent,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import type { ServiceTier } from '@/types/shipment';

interface ZoneItem {
  readonly code: string;
  readonly name: string;
  readonly origin: string;
  readonly destinations: readonly string[];
  readonly hub: string;
  readonly transit: string;
}

interface RateCardItem {
  readonly id: string;
  readonly zoneCode: string;
  readonly zoneName: string;
  readonly serviceTier: ServiceTier;
  readonly baseRateUsd: number;
  readonly perAdditionalKgUsd: number;
  readonly fuelSurchargePct: number;
  readonly residentialFeeUsd: number;
  readonly directSigFeeUsd: number;
}

const DEFAULT_ZONES: readonly ZoneItem[] = [
  {
    code: 'ZONE_DOM',
    name: 'Bangladesh Domestic Express',
    origin: 'BD',
    destinations: ['BD (Dhaka, Chittagong, Sylhet)'],
    hub: 'DACA',
    transit: '1 - 2 Days',
  },
  {
    code: 'ZONE_ME',
    name: 'Middle East & GCC',
    origin: 'BD',
    destinations: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM'],
    hub: 'DXB',
    transit: '2 - 4 Days',
  },
  {
    code: 'ZONE_EU',
    name: 'Europe & United Kingdom',
    origin: 'BD',
    destinations: ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'DK'],
    hub: 'LHR',
    transit: '3 - 5 Days',
  },
  {
    code: 'ZONE_US_CA',
    name: 'North America (US & Canada)',
    origin: 'BD',
    destinations: ['US', 'CA'],
    hub: 'EWR',
    transit: '2 - 4 Days',
  },
];

export default function AdminRatesPage(): React.JSX.Element {
  const [zones, setZones] = useState<readonly ZoneItem[]>(DEFAULT_ZONES);
  const [rates, setRates] = useState<readonly RateCardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<string>('ZONE_US_CA');
  const [selectedTier, setSelectedTier] = useState<ServiceTier>('INTERNATIONAL_PRIORITY');
  const [baseRate, setBaseRate] = useState<string>('50.00');
  const [perKgRate, setPerKgRate] = useState<string>('18.00');
  const [fuelPct, setFuelPct] = useState<string>('14.5');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fetchRates = async (): Promise<void> => {
    try {
      const res = await fetch('/api/rates');
      if (res.ok) {
        const data = await res.json();
        if (data.zones && data.zones.length > 0) {
          setZones(data.zones);
        }
        if (data.rateCards) {
          setRates(data.rateCards);
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRates();
  }, []);

  const handleSaveRate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const payload = {
      zoneCode: selectedZone,
      serviceTier: selectedTier,
      baseRateUsd: parseFloat(baseRate) || 45.0,
      perAdditionalKgUsd: parseFloat(perKgRate) || 15.0,
      fuelSurchargePct: parseFloat(fuelPct) || 14.5,
      residentialFeeUsd: 4.5,
      directSigFeeUsd: 5.5,
    };

    try {
      await fetch('/api/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await fetchRates();
      setIsModalOpen(false);
      setSuccessNotice(`Rate card for ${selectedZone} (${selectedTier}) saved to PostgreSQL.`);
    } catch {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-border pb-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-textPrimary tracking-tight">
            Shipping Zones & Rate Cards
          </h1>
          <p className="text-sm text-neutral-textSecondary mt-1">
            Configure volumetric weight calculations, hub resolution, base rates, and fuel surcharge multipliers.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Rate Card
        </Button>
      </div>

      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg p-4 flex items-center gap-3 text-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successNotice}</span>
        </div>
      )}

      {/* Shipping Zones Overview */}
      <div className="bg-white border border-neutral-border rounded-xl shadow-card p-6">
        <h2 className="text-base font-bold text-neutral-textPrimary mb-4 flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-ntgx-red" />
          Configured Shipping Zones (Origin: Bangladesh / DACA)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((zone) => (
            <div key={zone.code} className="border border-neutral-border rounded-lg p-4 bg-neutral-canvas">
              <span className="text-xs font-mono font-bold text-ntgx-red block">{zone.code}</span>
              <h3 className="font-bold text-neutral-textPrimary text-sm mt-1">{zone.name}</h3>
              <div className="text-xs text-neutral-textSecondary mt-2 space-y-1">
                <div>
                  <span className="font-semibold">Destinations:</span> {zone.destinations.join(', ')}
                </div>
                <div>
                  <span className="font-semibold">Transit Hub:</span>{' '}
                  <span className="font-mono text-emerald-600 font-bold">{zone.hub}</span>
                </div>
                <div>
                  <span className="font-semibold">Transit SLA:</span> {zone.transit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Cards Table */}
      <div className="bg-white border border-neutral-border rounded-xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-neutral-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-textPrimary flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            Active Pricing Matrix & Surcharges
          </h3>
          <span className="text-xs text-neutral-textSecondary">Volumetric Factor: (L &times; W &times; H) / 5000</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-canvas border-b border-neutral-border text-neutral-textSecondary font-semibold">
              <tr>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Service Tier</th>
                <th className="py-3 px-4 text-right">Base Rate (0.5 kg)</th>
                <th className="py-3 px-4 text-right">Per Additional kg</th>
                <th className="py-3 px-4 text-right">Fuel Surcharge</th>
                <th className="py-3 px-4 text-right">Residential Fee</th>
                <th className="py-3 px-4 text-right">Direct Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-ntgx-red" />
                    Loading rate cards from PostgreSQL database...
                  </td>
                </tr>
              ) : rates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-neutral-textSecondary">
                    No rate cards found in database.
                  </td>
                </tr>
              ) : (
                rates.map((rc) => (
                <tr key={rc.id} className="hover:bg-neutral-surface/60">
                  <td className="py-3 px-4 font-semibold text-neutral-textPrimary">
                    {rc.zoneName}{' '}
                    <span className="text-[10px] font-mono text-neutral-textMuted">({rc.zoneCode})</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-ntgx-red">{rc.serviceTier}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">${rc.baseRateUsd.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono">${rc.perAdditionalKgUsd.toFixed(2)} / kg</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-700 font-bold">
                    <span className="flex items-center justify-end gap-1">
                      <Percent className="h-3 w-3" /> {rc.fuelSurchargePct}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">${rc.residentialFeeUsd.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-mono">${rc.directSigFeeUsd.toFixed(2)}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Rate Card Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Configure Rate Card">
        <form onSubmit={handleSaveRate} className="space-y-4">
          <Select
            label="Shipping Zone"
            options={zones.map((z) => ({ value: z.code, label: `${z.name} (${z.hub})` }))}
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
          />

          <Select
            label="Service Tier"
            options={[
              { value: 'INTERNATIONAL_PRIORITY', label: 'International Priority (IP EOD)' },
              { value: 'INTERNATIONAL_ECONOMY', label: 'International Economy (IE)' },
              { value: 'INTERNATIONAL_FIRST', label: 'International First (IF)' },
              { value: 'STANDARD_OVERNIGHT', label: 'Standard Overnight (Domestic)' },
            ]}
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as ServiceTier)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Base Rate USD (0.5 kg)"
              type="number"
              step="0.01"
              value={baseRate}
              onChange={(e) => setBaseRate(e.target.value)}
              required
            />
            <Input
              label="Rate per Additional kg"
              type="number"
              step="0.01"
              value={perKgRate}
              onChange={(e) => setPerKgRate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Fuel Surcharge %"
              type="number"
              step="0.1"
              value={fuelPct}
              onChange={(e) => setFuelPct(e.target.value)}
              required
            />
            <Input label="Residential Fee USD" type="number" defaultValue="4.50" readOnly />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-border">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Rate Card
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
