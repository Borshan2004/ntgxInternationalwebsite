// src/app/api/track/v1/trackingnumbers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TrackingRegistryService } from '@/services/trackingRegistryService';
import type { FedExTrackApiResponse, FedExScanEvent, ScanEventCode } from '@/types/shipment';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const trk = (
    req.nextUrl.searchParams.get('trackingNumber') ||
    req.nextUrl.searchParams.get('query') ||
    req.nextUrl.searchParams.get('trk')
  )?.replace(/\s+/g, '');

  if (!trk) {
    return NextResponse.json({ error: 'Missing trackingNumber query parameter' }, { status: 400 });
  }

  try {
    const shipment = await prisma.shipment.findFirst({
      where: {
        OR: [
          { trackingNumber: trk },
          { id: trk },
        ],
      },
      include: {
        trackingEvents: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (shipment) {
      const latestEvent =
        shipment.trackingEvents.length > 0
          ? shipment.trackingEvents[shipment.trackingEvents.length - 1]
          : null;

      const events: readonly FedExScanEvent[] =
        shipment.trackingEvents.length > 0
          ? shipment.trackingEvents.map((ev) => ({
              timestamp: ev.timestamp.toISOString(),
              eventType: ev.eventCode as ScanEventCode,
              eventDescription: ev.statusTitle,
              scanLocation: {
                city: ev.city,
                stateOrProvinceCode: ev.stateProvince ?? undefined,
                postalCode: ev.postalCode ?? undefined,
                countryCode: ev.countryCode,
              },
              signedBy: ev.signedBy ?? undefined,
            }))
          : [
              {
                timestamp: shipment.createdAt.toISOString(),
                eventType: 'OC' as const,
                eventDescription: 'Shipment created and tender manifest registered',
                scanLocation: {
                  city: shipment.senderCity,
                  countryCode: shipment.senderCountry,
                },
              },
            ];

      const responsePayload: FedExTrackApiResponse = {
        trackingNumberInfo: {
          trackingNumber: shipment.trackingNumber,
          carrierCode: 'NTGX',
        },
        latestStatusDetail: {
          code: latestEvent?.eventCode ?? 'OC',
          statusBy: shipment.status,
          description: latestEvent?.statusTitle ?? 'Shipment information sent to NTGX',
          scanLocation: {
            city: latestEvent?.city ?? shipment.senderCity,
            stateOrProvinceCode: latestEvent?.stateProvince ?? undefined,
            countryCode: latestEvent?.countryCode ?? shipment.senderCountry,
          },
          estimatedDeliveryTime: shipment.estimatedDelivery
            ? shipment.estimatedDelivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' by 5:00 PM'
            : 'In Transit',
        },
        packageWeight: {
          units: 'KG',
          value: Number(shipment.totalChargeableWgtKg),
        },
        dateAndTime: [
          ...(shipment.estimatedDelivery
            ? [{ type: 'ESTIMATED_DELIVERY' as const, dateTime: shipment.estimatedDelivery.toISOString() }]
            : []),
          ...(shipment.actualDelivery
            ? [{ type: 'ACTUAL_DELIVERY' as const, dateTime: shipment.actualDelivery.toISOString() }]
            : []),
        ],
        scanEvents: events,
      };

      return NextResponse.json(responsePayload, { status: 200 });
    }
  } catch {
    // Database unreachable in demo/offline mode
  }

  // Resilient status-synchronized telemetry from TrackingRegistryService
  const telemetry = TrackingRegistryService.getTelemetry(trk);
  return NextResponse.json(telemetry, { status: 200 });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const trk = (
      body.trackingNumber ||
      body.query ||
      body.trackingInfo?.[0]?.trackingNumberInfo?.trackingNumber
    )?.replace(/\s+/g, '');

    if (!trk) {
      return NextResponse.json({ error: 'Missing trackingNumber in body' }, { status: 400 });
    }

    return GET(new NextRequest(new URL(`/api/track/v1/trackingnumbers?trackingNumber=${trk}`, req.url)));
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }
}
