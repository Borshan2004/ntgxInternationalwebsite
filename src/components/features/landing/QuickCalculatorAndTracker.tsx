// src/components/features/landing/QuickCalculatorAndTracker.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calculator,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plane,
  MapPin,
} from 'lucide-react';

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
    <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-16 sm:-mt-24 relative z-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Card: Premium Floating White Rate Calculator */}
        <div
          id="rate-estimator"
          className="lg:col-span-6 bg-white dark:bg-[#111827] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all relative overflow-hidden group"
        >
          {/* Subtle Faded Airplane Watermark in Background */}
          <div className="absolute -right-4 -top-4 text-slate-100 dark:text-slate-800/40 pointer-events-none select-none">
            <Plane className="w-36 h-36 transform -rotate-12" />
          </div>

          <div className="flex items-center gap-3.5 mb-2 relative z-10">
            <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#E51B23] flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/50 shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Shipping Rate Calculator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Get an instant quote for your shipment worldwide.
              </p>
            </div>
          </div>

          <form onSubmit={handleCalculateEstimate} className="mt-6 space-y-4 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* From Country */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  From Country
                </label>
                <div className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <span className="text-base">🇧🇩</span>
                  <span>Bangladesh (DAC)</span>
                </div>
              </div>

              {/* To Country */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  To Country
                </label>
                <select
                  value={destinationCode}
                  onChange={(e) => setDestinationCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E51B23]"
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Shipment Type
                </label>
                <select
                  value={shipmentType}
                  onChange={(e) => setShipmentType(e.target.value as 'DOCUMENT' | 'COMMODITY')}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E51B23]"
                >
                  <option value="COMMODITY">Package / Commercial Cargo</option>
                  <option value="DOCUMENT">Document / Business Letter</option>
                </select>
              </div>

              {/* Weight in KG */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1000"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E51B23]"
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
              className="w-full mt-2 py-3.5 px-4 bg-[#E51B23] hover:bg-[#C81212] active:bg-[#9B0E0E] text-white font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:scale-[1.01]"
            >
              <span>{isCalculating ? 'Calculating Tariffs…' : 'Calculate Rate'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Instant Result Box */}
            {estimateResult && (
              <div className="p-4 bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl animate-in fade-in space-y-2 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-950 dark:text-red-200 uppercase tracking-wider">
                    Estimated Cost
                  </span>
                  <span className="text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 px-2.5 py-0.5 rounded-full">
                    {estimateResult.transitDays}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#E51B23]">
                    ${estimateResult.usd} USD
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    (Approx. ৳{estimateResult.bdt.toLocaleString()} BDT)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-red-100 dark:border-red-900/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Includes door pickup, standard fuel surcharge &amp; tracking.</span>
                </div>
              </div>
            )}

            <div className="pt-1 text-center">
              <a
                href="#contact"
                className="text-xs font-semibold text-[#E51B23] hover:underline"
              >
                + Request a Volume Tariff for Commercial RMG Exports
              </a>
            </div>
          </form>
        </div>

        {/* Right Card: Premium Floating White Track Consignment Card */}
        <div
          id="tracking-section"
          className="lg:col-span-6 bg-white dark:bg-[#111827] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all relative overflow-hidden group"
        >
          {/* Subtle Location Pin Watermark in Background */}
          <div className="absolute -right-4 -top-4 text-slate-100 dark:text-slate-800/40 pointer-events-none select-none">
            <MapPin className="w-36 h-36 transform rotate-12" />
          </div>

          <div className="flex items-center gap-3.5 mb-2 relative z-10">
            <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/50 text-[#E51B23] flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/50 shadow-xs">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Track Your Shipment
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your tracking number to get real-time updates.
              </p>
            </div>
          </div>

          <form onSubmit={handleTrackSubmit} className="mt-6 space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Consignment / AWB Number
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value);
                    if (trackingError) setTrackingError(null);
                  }}
                  placeholder="Enter Tracking Number (e.g. 879098800901)"
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-[#161F30] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#E51B23]"
                >
                </input>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#E51B23] hover:bg-[#C81212] active:bg-[#9B0E0E] text-white font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all shrink-0 hover:scale-[1.01]"
                >
                  <span>Track</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {trackingError && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{trackingError}</span>
                </div>
              )}
            </div>

            {/* Demo tracking helper */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              <span className="font-bold text-[#E51B23] block">Try a demo tracking number:</span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setTrackingNumber('879098800901')}
                  className="font-mono text-slate-900 dark:text-white bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-[#E51B23] transition-colors shadow-xs"
                >
                  879098800901
                </button>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  (Delivered Dhaka &rarr; New York Shipment)
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Have a corporate account? </span>
              <a href="/login" className="text-[#E51B23] hover:underline font-semibold">
                Sign in to view full manifest &rarr;
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}