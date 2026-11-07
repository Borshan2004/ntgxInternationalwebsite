// src/components/features/landing/QuickCalculatorAndTracker.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calculator, Search, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface EstimateDisplay {
  service: string;
  usd: number;
  bdt: number;
  transitDays: string;
}

const POPULAR_DESTINATIONS = [
  { code: 'US', name: 'United States (USA)', baseRate: 48, ratePerKg: 14, days: '3-5 Business Days' },
  { code: 'GB', name: 'United Kingdom (UK)', baseRate: 42, ratePerKg: 12, days: '2-4 Business Days' },
  { code: 'CA', name: 'Canada', baseRate: 52, ratePerKg: 15, days: '3-5 Business Days' },
  { code: 'AE', name: 'United Arab Emirates (UAE)', baseRate: 35, ratePerKg: 9, days: '2-3 Business Days' },
  { code: 'AU', name: 'Australia', baseRate: 55, ratePerKg: 16, days: '4-6 Business Days' },
  { code: 'DE', name: 'Germany', baseRate: 44, ratePerKg: 13, days: '3-4 Business Days' },
  { code: 'SA', name: 'Saudi Arabia', baseRate: 38, ratePerKg: 10, days: '3-4 Business Days' },
  { code: 'SG', name: 'Singapore', baseRate: 32, ratePerKg: 8, days: '2-3 Business Days' },
];

export function QuickCalculatorAndTracker(): React.JSX.Element {
  const router = useRouter();

  // Tracking state
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Rate calculator state
  const [destinationCode, setDestinationCode] = useState('US');
  const [shipmentType, setShipmentType] = useState<'DOCUMENT' | 'COMMODITY'>('COMMODITY');
  const [weightKg, setWeightKg] = useState<number>(1.5);
  const [estimateResult, setEstimateResult] = useState<EstimateDisplay | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const cleaned = trackingNumber.trim().replace(/\s+/g, '');
    if (!cleaned) {
      setTrackingError('Please enter a valid tracking number.');
      return;
    }
    setTrackingError(null);
    router.push(`/tracking/${cleaned}`);
  };

  const handleCalculateEstimate = (e: React.FormEvent): void => {
    e.preventDefault();
    setIsCalculating(true);

    const dest = POPULAR_DESTINATIONS.find((d) => d.code === destinationCode) || POPULAR_DESTINATIONS[0];
    const weight = Math.max(0.5, weightKg || 1);

    // Calculate approximate international express rate
    const multiplier = shipmentType === 'DOCUMENT' ? 0.8 : 1.0;
    const additionalKg = Math.max(0, weight - 0.5);
    const calculatedUsd = Math.round((dest.baseRate + additionalKg * dest.ratePerKg) * multiplier);
    const calculatedBdt = Math.round(calculatedUsd * 122); // Approximate current USD to BDT

    setTimeout(() => {
      setEstimateResult({
        service: shipmentType === 'DOCUMENT' ? 'International Priority Document' : 'International Express Freight',
        usd: calculatedUsd,
        bdt: calculatedBdt,
        transitDays: dest.days,
      });
      setIsCalculating(false);
    }, 250);
  };

  return (
    <section className="py-8 sm:py-12 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-6 sm:-mt-8 relative z-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Card: Get a Shipping Estimate */}
        <div
          id="rate-estimator"
          className="lg:col-span-6 bg-white dark:bg-[#111827] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 transition-all"
        >
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#E51919] flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/50">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Get a Shipping Estimate</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent international rates based on destination and weight.
              </p>
            </div>
          </div>

          <form onSubmit={handleCalculateEstimate} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* From Country */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Origin</label>
                <div className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <span className="text-base">🇧🇩</span>
                  <span>Bangladesh (DAC)</span>
                </div>
              </div>

              {/* To Country */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Destination</label>
                <select
                  value={destinationCode}
                  onChange={(e) => setDestinationCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E51919]"
                >
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <option key={dest.code} value={dest.code}>
                      {dest.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shipment Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Shipment Type</label>
                <select
                  value={shipmentType}
                  onChange={(e) => setShipmentType(e.target.value as 'DOCUMENT' | 'COMMODITY')}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E51919]"
                >
                  <option value="COMMODITY">Package / Commercial Cargo</option>
                  <option value="DOCUMENT">Document / Business Letter</option>
                </select>
              </div>

              {/* Weight in KG */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Chargeable Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1000"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E51919]"
                    placeholder="1.0"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">KG</span>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full mt-2 py-3.5 px-4 bg-[#E51919] hover:bg-[#C81212] active:bg-[#9B0E0E] text-white font-bold rounded-xl shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              <span>{isCalculating ? 'Calculating Rates…' : 'Calculate Shipping Estimate'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Instant Result Box */}
            {estimateResult && (
              <div className="p-4 bg-red-50/60 border border-red-200/90 rounded-2xl animate-in fade-in space-y-2 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-950 uppercase tracking-wider">Estimated Cost</span>
                  <span className="text-xs font-semibold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                    {estimateResult.transitDays}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#E51919]">
                    ${estimateResult.usd} USD
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    (Approx. ৳{estimateResult.bdt.toLocaleString()} BDT)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1 border-t border-red-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Includes door pickup, standard fuel surcharge &amp; tracking.</span>
                </div>
              </div>
            )}

            <div className="pt-1 text-center">
              <a
                href="#contact"
                className="text-xs font-semibold text-[#E51919] hover:underline"
              >
                + Request a Volume Tariff for Commercial RMG Exports
              </a>
            </div>
          </form>
        </div>

        {/* Right Card: Track Your Shipment */}
        <div
          id="tracking-section"
          className="lg:col-span-6 bg-gradient-to-br from-[#091527] via-[#0E203B] to-[#091527] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-700/80 text-white relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5 mb-2 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#E51919] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Track Your Shipment</h2>
              <p className="text-xs text-slate-300">
                Enter your Air Waybill (AWB) to view live checkpoint milestones.
              </p>
            </div>
          </div>

          <form onSubmit={handleTrackSubmit} className="mt-8 space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Tracking Number
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value);
                    if (trackingError) setTrackingError(null);
                  }}
                  placeholder="e.g. 879098800901"
                  className="flex-1 px-4 py-3.5 bg-slate-800/90 border border-slate-600/90 rounded-xl text-white placeholder-slate-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#E51919]"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#E51919] hover:bg-[#C81212] active:bg-[#9B0E0E] text-white font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all shrink-0"
                >
                  <span>Track Consignment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {trackingError && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{trackingError}</span>
                </div>
              )}
            </div>

            {/* Demo tracking helper */}
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
              <span className="font-bold text-red-400 block">Try a demo tracking number:</span>
              <button
                type="button"
                onClick={() => setTrackingNumber('879098800901')}
                className="font-mono text-white bg-slate-700 hover:bg-slate-600 px-2.5 py-1 rounded border border-slate-600 hover:border-red-500 transition-colors"
              >
                879098800901
              </button>
              <span className="text-slate-400 ml-2">(Live Delivered BD to USA Shipment)</span>
            </div>

            <div className="pt-2 text-xs text-slate-400">
              <span>Have a corporate account? </span>
              <a href="/login" className="text-red-400 hover:underline font-semibold">
                Sign in to view full manifest &rarr;
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
