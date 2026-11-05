// src/app/api/webhooks/courier-status/route.ts
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { N8nWebhookService } from '@/services/n8nWebhookService';
import type { ScanEventCode, ShipmentStatus } from '@/types/shipment';

interface CourierScanUpdateRequest {
  readonly trackingNumber: string;
  readonly newStatus: ShipmentStatus;
  readonly eventCode: ScanEventCode;
  readonly statusTitle: string;
  readonly description?: string;
  readonly city: string;
  readonly stateProvince?: string;
  readonly countryCode: string;
  readonly hubCode?: string;
  readonly signedBy?: string;
  readonly signatureImage?: string;
  readonly recordedByUserId?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as CourierScanUpdateRequest;
    const cleanedTracking = body.trackingNumber.replace(/\s+/g, '');

    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber: cleanedTracking },
      include: {
        organization: true,
        pickupOrder: true,
        notificationSettings: true,
      },
    });

    if (!shipment) {
      return NextResponse.json(
        { error: `Shipment with tracking number ${cleanedTracking} not found.` },
        { status: 404 }
      );
    }

    const now = new Date();

    // 1. Atomically update Shipment status & insert new TrackingEvent scan
    const [updatedShipment, createdEvent] = await prisma.$transaction([
      prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          status: body.newStatus,
          ...(body.newStatus === 'DELIVERED' ? { actualDelivery: now } : {}),
        },
      }),
      prisma.trackingEvent.create({
        data: {
          shipmentId: shipment.id,
          recordedById: body.recordedByUserId ?? null,
          eventCode: body.eventCode,
          statusTitle: body.statusTitle,
          description: body.description,
          city: body.city,
          stateProvince: body.stateProvince,
          countryCode: body.countryCode,
          hubCode: body.hubCode,
          signedBy: body.signedBy,
          signatureImage: body.signatureImage,
          timestamp: now,
        },
      }),
    ]);

    const formattedTrk = `${shipment.trackingNumber.slice(0, 4)} ${shipment.trackingNumber.slice(4, 8)} ${shipment.trackingNumber.slice(8, 12)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    // 2. Trigger n8n multi-channel workflow (Email, SMS, PDF attachments, POD)
    const webhookResult = await N8nWebhookService.triggerShipmentLifecycleEvent({
      eventId: crypto.randomUUID(),
      eventType:
        body.newStatus === 'SHIPMENT_CREATED_PRINTED'
          ? 'SHIPMENT_BOOKED_FINALIZED'
          : 'SHIPMENT_STATUS_UPDATED',
      occurredAt: now.toISOString(),
      tenant: {
        organizationId: shipment.organization.id,
        companyName: shipment.organization.name,
        companyCode: shipment.organization.code,
      },
      shipment: {
        id: shipment.id,
        trackingNumberRaw: shipment.trackingNumber,
        trackingNumberFormatted: formattedTrk,
        status: updatedShipment.status,
        serviceTier: shipment.serviceTier,
        signatureOption: shipment.signatureOption,
        originAirportCode: shipment.originAirportCode,
        destAirportCode: shipment.destAirportCode,
        senderName: shipment.senderName,
        senderCompany: shipment.senderCompany ?? undefined,
        senderPhone: shipment.senderPhone,
        recipientName: shipment.recipientName,
        recipientCompany: shipment.recipientCompany ?? undefined,
        recipientCity: shipment.recipientCity,
        recipientCountry: shipment.recipientCountry,
        packageCount: shipment.packageCount,
        totalChargeableWeightKg: Number(shipment.totalChargeableWgtKg),
        totalCustomsValueUsd: Number(shipment.totalCustomsValue),
        totalShippingCostUsd: Number(shipment.totalShippingCostUsd),
        pickupWindow: shipment.pickupOrder
          ? {
              pickupDate: shipment.pickupOrder.pickupDate.toISOString().split('T')[0] ?? '',
              earliestTime: shipment.pickupOrder.earliestTime,
              latestTime: shipment.pickupOrder.latestTime,
            }
          : undefined,
        estimatedDeliveryDate: shipment.estimatedDelivery?.toISOString(),
      },
      latestScan: {
        eventCode: createdEvent.eventCode,
        statusTitle: createdEvent.statusTitle,
        description: createdEvent.description ?? undefined,
        city: createdEvent.city,
        stateProvince: createdEvent.stateProvince ?? undefined,
        countryCode: createdEvent.countryCode,
        hubCode: createdEvent.hubCode ?? undefined,
        signedBy: createdEvent.signedBy ?? undefined,
        timestamp: createdEvent.timestamp.toISOString(),
      },
      documents: {
        awbPdfUrl: `${appUrl}/api/documents/awb/${shipment.id}`,
        commercialInvoicePdfUrl: `${appUrl}/api/documents/invoice/${shipment.id}`,
        publicTrackingUrl: `${appUrl}/tracking/${shipment.trackingNumber}`,
      },
      notifications: {
        clientEmail: shipment.notificationSettings?.clientEmail ?? shipment.senderEmail,
        recipientEmail: shipment.notificationSettings?.recipientEmail ?? shipment.recipientEmail,
        recipientPhone: shipment.recipientPhone,
        companyOperationsEmail:
          shipment.notificationSettings?.companyEmail ?? 'operations@company.com',
        language: (shipment.notificationSettings?.language as 'en' | 'bn') ?? 'en',
        notifyCreated: shipment.notificationSettings?.notifyCreated ?? true,
        notifyScheduled: shipment.notificationSettings?.notifyScheduled ?? true,
        notifyPickedUp: shipment.notificationSettings?.notifyPickedUp ?? true,
        notifyInTransit: shipment.notificationSettings?.notifyInTransit ?? true,
        notifyDelivered: shipment.notificationSettings?.notifyDelivered ?? true,
        notifyException: shipment.notificationSettings?.notifyException ?? true,
      },
    });

    return NextResponse.json(
      {
        shipmentId: shipment.id,
        trackingNumber: formattedTrk,
        status: updatedShipment.status,
        scanEventId: createdEvent.id,
        n8nAutomation: webhookResult,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process courier scan';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
