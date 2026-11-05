// src/app/api/shipments/[id]/finalize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BarcodeService } from '@/services/barcodeService';
import { EmailNotificationService } from '@/services/emailService';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const shipmentId = params.id;

    const shipment = await prisma.shipment.findFirst({
      where: {
        OR: [{ id: shipmentId }, { trackingNumber: shipmentId }],
      },
      include: {
        organization: true,
        packages: true,
        commodities: true,
        pickupOrder: true,
        notificationSettings: true,
      },
    });

    if (!shipment) {
      return NextResponse.json({ error: `Shipment ${shipmentId} not found` }, { status: 404 });
    }

    if (shipment.status !== 'DRAFT_INCOMPLETE') {
      return NextResponse.json(
        { error: `Shipment is already finalized with status: ${shipment.status}` },
        { status: 400 }
      );
    }

    // Ensure tracking artifacts are generated
    let trackingArtifacts: ReturnType<typeof BarcodeService.generateTrackingArtifacts>;
    if (shipment.trackingNumber && BarcodeService.validateTrackingNumber(shipment.trackingNumber)) {
      trackingArtifacts = {
        rawTrackingNumber: shipment.trackingNumber,
        formattedTrackingNumber: `${shipment.trackingNumber.slice(0, 4)} ${shipment.trackingNumber.slice(4, 8)} ${shipment.trackingNumber.slice(8, 12)}`,
        formCode: shipment.formCode || '0430',
        routingHeader: shipment.routingCode || `XA MTPA 58KJ1/70DF/484B`,
        serviceAcronym: 'IP EOD',
        signatureAcronym: 'NSR',
        barcodeSvg: shipment.barcodeSvg || BarcodeService.renderCode128Svg(shipment.trackingNumber),
      };
    } else {
      trackingArtifacts = BarcodeService.generateTrackingArtifacts({
        originHub: shipment.originAirportCode,
        destHub: shipment.destAirportCode,
        destPostal: shipment.recipientPostal,
        destCountry: shipment.recipientCountry,
        serviceTier: shipment.serviceTier,
        signatureOption: shipment.signatureOption,
      });
    }

    // Update shipment state to finalized
    const updated = await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status: 'SHIPMENT_CREATED_PRINTED',
        trackingNumber: trackingArtifacts.rawTrackingNumber,
        formCode: trackingArtifacts.formCode,
        routingCode: trackingArtifacts.routingHeader,
        barcodeSvg: trackingArtifacts.barcodeSvg,
        finalizedAt: new Date(),
        trackingEvents: {
          create: {
            eventCode: 'OC',
            statusTitle: 'Shipment information sent to FedEx',
            description: 'Air Waybill and Commercial Invoice generated.',
            city: shipment.senderCity,
            countryCode: shipment.senderCountry,
            hubCode: shipment.originAirportCode,
          },
        },
      },
    });

    // Trigger dual emails
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const pickupWindow = shipment.pickupOrder
      ? `${shipment.pickupOrder.earliestTime} - ${shipment.pickupOrder.latestTime}`
      : 'Counter Drop-off';
    const pickupDateStr = shipment.pickupOrder
      ? shipment.pickupOrder.pickupDate.toISOString().split('T')[0]
      : shipment.shipDate.toISOString().split('T')[0];

    await EmailNotificationService.sendShipmentFinalizedEmails({
      trackingNumberFormatted: trackingArtifacts.formattedTrackingNumber,
      clientEmail: shipment.notificationSettings?.clientEmail ?? shipment.senderEmail,
      companyOperationsEmail:
        shipment.notificationSettings?.companyEmail ?? 'operations@company.com',
      senderCompanyOrName: shipment.senderCompany ?? shipment.senderName,
      recipientCompanyOrName: shipment.recipientCompany ?? shipment.recipientName,
      destinationCityCountry: `${shipment.recipientCity}, ${shipment.recipientCountry}`,
      serviceTier: shipment.serviceTier,
      chargeableWeightKg: Number(shipment.totalChargeableWgtKg),
      pickupDate: pickupDateStr,
      pickupWindow,
      awbDownloadUrl: `${appUrl}/api/documents/awb/${updated.id}`,
      invoiceDownloadUrl: `${appUrl}/api/documents/invoice/${updated.id}`,
      trackingUrl: `${appUrl}/tracking/${trackingArtifacts.rawTrackingNumber}`,
    });

    return NextResponse.json({
      shipmentId: updated.id,
      trackingNumber: trackingArtifacts.rawTrackingNumber,
      trackingNumberFormatted: trackingArtifacts.formattedTrackingNumber,
      status: updated.status,
      finalizedAt: updated.finalizedAt,
      documents: {
        awbUrl: `/api/documents/awb/${updated.id}`,
        commercialInvoiceUrl: `/api/documents/invoice/${updated.id}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Finalization failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
