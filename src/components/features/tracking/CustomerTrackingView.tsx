// src/components/features/tracking/CustomerTrackingView.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Search, AlertCircle, Loader2, Package } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TrackingTimeline } from '@/components/features/tracking/TrackingTimeline';
import type { FedExTrackApiResponse } from '@/types/shipment';

interface CustomerTrackingViewProps {
  readonly initialTrackingNumber?: string;
  readonly onSearchChange?: (trk: string) => void;
}

export function CustomerTrackingView({
  initialTrackingNumber = '',
  onSearchChange,
}: CustomerTrackingViewProps): React.JSX.Element {
  const [query, setQuery] = useState<string>(initialTrackingNumber);
  const [telemetry, setTelemetry] = useState<FedExTrackApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(Boolean(initialTrackingNumber));

  const performSearch = async (trkNum: string): Promise<void> => {
    const cleaned = trkNum.trim().replace(/\s+/g, '');
    if (!cleaned) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch(
        `/api/track/v1/trackingnumbers?trackingNumber=${encodeURIComponent(cleaned)}`
      );

      if (!res.ok) {
        throw new Error(
          `Unable to find tracking records for "${cleaned}". Please verify your 12-digit tracking number and try again.`
        );
      }

      const data = (await res.json()) as FedExTrackApiResponse;
      setTelemetry(data);
      if (onSearchChange) {
        onSearchChange(cleaned);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve tracking data';
      setError(msg);
      setTelemetry(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrackingNumber && initialTrackingNumber.trim()) {
      setQuery(initialTrackingNumber);
      void performSearch(initialTrackingNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTrackingNumber]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    void performSearch(query);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────
          1. CLEAN CUSTOMER SEARCH BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="max-w-2xl mx-auto text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Track Your NTGX Express Shipment
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Enter your 12-digit tracking number below to view live transit progress, customs status, and estimated delivery.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
            <Input
              name="trackingQuery"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 8790 9880 0901"
              className="pl-10 font-mono text-sm tracking-wide py-2.5 h-11"
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="sm:w-36 h-11 bg-ntgx-red hover:bg-ntgx-redHover text-white font-bold text-xs uppercase tracking-wider shadow-xs"
          >
            <Search className="h-4 w-4 mr-1.5" /> Track Now
          </Button>
        </form>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. ERROR NOTIFICATION
          ───────────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 animate-in fade-in">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Shipment Not Found</div>
            <div className="mt-0.5 text-neutral-600">{error}</div>
            <div className="mt-1 text-[11px] text-neutral-400">
              Your 12-digit tracking number can be found at the top-right of your Air Waybill or in your shipping confirmation email.
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. LOADING STATE
          ───────────────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-neutral-200 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-ntgx-red" />
          <div className="text-sm font-bold text-neutral-900">
            Querying Live Satellite &amp; Courier Telemetry…
          </div>
          <p className="text-xs text-neutral-500">
            Retrieving destination scans, flight linehauls, and delivery handover receipts.
          </p>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. TIMELINE DISPLAY (CLEAN CUSTOMER VIEW)
          ───────────────────────────────────────────────────────────── */}
      {!loading && telemetry && (
        <div className="animate-in fade-in duration-200">
          <TrackingTimeline
            telemetry={telemetry}
            onRefresh={() => void performSearch(query)}
          />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. EMPTY STATE (BEFORE SEARCH)
          ───────────────────────────────────────────────────────────── */}
      {!loading && !telemetry && !error && !hasSearched && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto text-ntgx-red">
            <Package className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              Ready to Follow Your Parcel?
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
              NTGX Express provides end-to-end tracking from initial courier pickup at Dhaka Air Gateway through international flight linehaul to recipient doorstep signature.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs">
              <span className="font-bold text-neutral-900 block mb-0.5">1. Pickup &amp; Origin</span>
              <p className="text-neutral-500 text-[11px]">
                Courier collection and export customs inspection at origin gateway.
              </p>
            </div>
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs">
              <span className="font-bold text-neutral-900 block mb-0.5">2. Flight In-Transit</span>
              <p className="text-neutral-500 text-[11px]">
                Air cargo transit with live flight status updates.
              </p>
            </div>
            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs">
              <span className="font-bold text-neutral-900 block mb-0.5">3. Doorstep Delivery</span>
              <p className="text-neutral-500 text-[11px]">
                Local vehicle dispatch with recipient digital signature proof.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
