// src/app/(dashboard)/tracking/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TrackingTimeline } from '@/components/features/tracking/TrackingTimeline';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { FedExTrackApiResponse } from '@/types/shipment';

export default function TrackingDetailPage(): React.JSX.Element {
  const params = useParams();
  const router = useRouter();
  const trackingNumber = typeof params?.id === 'string' ? params.id : '';
  const [telemetry, setTelemetry] = useState<FedExTrackApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!trackingNumber) return;

    void fetch(`/api/track/v1/trackingnumbers?trackingNumber=${encodeURIComponent(trackingNumber)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setTelemetry(data as FedExTrackApiResponse);
      })
      .finally(() => setLoading(false));
  }, [trackingNumber]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <button
          type="button"
          onClick={() => router.push('/tracking')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-ntgx-red transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Tracking Search
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-xs font-semibold text-neutral-500">
          <Loader2 className="h-6 w-6 animate-spin text-ntgx-red mr-2" />
          Fetching live milestone scans for #{trackingNumber}…
        </div>
      ) : telemetry ? (
        <TrackingTimeline telemetry={telemetry} />
      ) : (
        <div className="p-8 text-center text-neutral-500 text-sm">
          No tracking telemetry available for {trackingNumber}.
        </div>
      )}
    </div>
  );
}
