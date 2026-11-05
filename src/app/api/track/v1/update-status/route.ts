// src/app/api/track/v1/update-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TrackingRegistryService } from '@/services/trackingRegistryService';
import type { ScanEventCode, ShipmentStatus } from '@/types/shipment';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const STATUS_DEFAULTS: Record<
  ShipmentStatus,
  { eventCode: ScanEventCode; description: string }
> = {
  DRAFT_INCOMPLETE: { eventCode: 'OC', description: 'Draft shipment initialized' },
  SHIPMENT_CREATED_PRINTED: { eventCode: 'OC', description: 'Shipment created and tender manifest registered' },
  PICKUP_SCHEDULED: { eventCode: 'PU', description: 'Pickup scheduled with courier' },
  PICKED_UP: { eventCode: 'PU', description: 'Package picked up by courier from shipper' },
  AT_ORIGIN_FACILITY: { eventCode: 'AF', description: 'Sorted and processed at NTGX Air Gateway' },
  IN_TRANSIT: { eventCode: 'IT', description: 'Departed origin hub via scheduled linehaul flight' },
  AT_DESTINATION_FACILITY: { eventCode: 'AR', description: 'Customs cleared at destination gateway terminal' },
  OUT_FOR_DELIVERY: { eventCode: 'OD', description: 'Package out for delivery with local courier' },
  DELIVERED: { eventCode: 'DL', description: 'Delivered to recipient and signature recorded' },
  DELIVERY_EXCEPTION: { eventCode: 'DE', description: 'Delivery exception / address or clearance verification required' },
  RETURNED_TO_SHIPPER: { eventCode: 'RS', description: 'Package returned to shipper' },
  CANCELLED: { eventCode: 'CA', description: 'Shipment cancelled by shipper/carrier' },
};

const updateStatusSchema = z.object({
  trackingNumber: z.string().min(1),
  status: z.enum([
    'DRAFT_INCOMPLETE',
    'SHIPMENT_CREATED_PRINTED',
    'PICKUP_SCHEDULED',
    'PICKED_UP',
    'AT_ORIGIN_FACILITY',
    'IN_TRANSIT',
    'AT_DESTINATION_FACILITY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'DELIVERY_EXCEPTION',
    'RETURNED_TO_SHIPPER',
    'CANCELLED',
  ]),
  eventCode: z.enum(['OC', 'PU', 'AF', 'DP', 'IT', 'AR', 'OD', 'DL', 'DE', 'RS', 'CA']).optional(),
  description: z.string().optional(),
  city: z.string().optional(),
  stateOrProvinceCode: z.string().optional(),
  countryCode: z.string().optional(),
  signedBy: z.string().optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid update payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      trackingNumber,
      status,
      eventCode,
      description,
      city,
      stateOrProvinceCode,
      countryCode,
      signedBy,
    } = parsed.data;

    const cleanedTrk = trackingNumber.replace(/\s+/g, '');

    // Look up existing database record if connected to pull fallbacks
    let dbShipment = null;
    try {
      dbShipment = await prisma.shipment.findFirst({
        where: {
          OR: [
            { trackingNumber: cleanedTrk },
            { id: cleanedTrk },
          ],
        },
      });
    } catch {
      // Database connection fallback
    }

    const targetStatus = status as ShipmentStatus;
    const defaults = STATUS_DEFAULTS[targetStatus] || {
      eventCode: 'IT' as ScanEventCode,
      description: `Shipment status updated to ${status}`,
    };

    const finalEventCode = (eventCode || defaults.eventCode) as ScanEventCode;
    const finalDescription = (description && description.trim().length > 0)
      ? description
      : defaults.description;

    const isOriginPhase = ['PICKUP_SCHEDULED', 'PICKED_UP', 'AT_ORIGIN_FACILITY'].includes(targetStatus);
    const finalCity = (city && city.trim().length > 0)
      ? city
      : (isOriginPhase ? dbShipment?.senderCity : (dbShipment?.recipientCity || dbShipment?.destAirportCode)) || 'Dhaka';

    const rawCountry = (countryCode && countryCode.trim().length > 0)
      ? countryCode.toUpperCase().slice(0, 2)
      : (isOriginPhase ? dbShipment?.senderCountry : dbShipment?.recipientCountry) || 'US';
    const finalCountry = rawCountry.length >= 2 ? rawCountry : 'US';

    const finalSignedBy = (targetStatus === 'DELIVERED')
      ? (signedBy || dbShipment?.recipientName || 'Authorized Signer')
      : signedBy;

    // 1. Update in-memory & file TrackingRegistryService
    const updatedTelemetry = TrackingRegistryService.updateShipmentMilestone({
      trackingNumber: dbShipment?.trackingNumber || cleanedTrk,
      newStatus: targetStatus,
      eventCode: finalEventCode,
      description: finalDescription,
      city: finalCity,
      stateOrProvinceCode,
      countryCode: finalCountry,
      signedBy: finalSignedBy,
    });

    // 2. Persist to Neon PostgreSQL
    if (dbShipment) {
      try {
        await prisma.shipment.update({
          where: { id: dbShipment.id },
          data: {
            status: targetStatus,
            ...(targetStatus === 'DELIVERED' ? { actualDelivery: new Date() } : {}),
            trackingEvents: {
              create: {
                eventCode: finalEventCode,
                statusTitle: finalDescription,
                city: finalCity,
                stateProvince: stateOrProvinceCode,
                countryCode: finalCountry,
                signedBy: finalSignedBy,
                timestamp: new Date(),
              },
            },
          },
        });
      } catch (dbErr) {
        // eslint-disable-next-line no-console
        console.error('[update-status] Prisma update error:', dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Shipment ${dbShipment?.trackingNumber || cleanedTrk} updated to ${targetStatus}.`,
        currentStatus: targetStatus,
        telemetry: updatedTelemetry,
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update tracking milestone';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
