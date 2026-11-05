// src/app/api/shipments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ShipmentEntityDTO } from '@/types/shipment';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const shipmentId = params.id;

    const s = await prisma.shipment.findFirst({
      where: {
        OR: [{ id: shipmentId }, { trackingNumber: shipmentId }],
      },
      include: {
        organization: true,
        packages: { orderBy: { packageIndex: 'asc' } },
        commodities: true,
        pickupOrder: true,
        trackingEvents: { orderBy: { timestamp: 'asc' } },
        notificationSettings: true,
      },
    });

    if (!s) {
      return NextResponse.json(
        { error: `Shipment with identifier ${shipmentId} not found.` },
        { status: 404 }
      );
    }

    const shipmentDto: ShipmentEntityDTO = {
      id: s.id,
      trackingNumber: s.trackingNumber,
      formCode: s.formCode,
      routingCode: s.routingCode,
      barcodeSvg: s.barcodeSvg,
      organizationId: s.organizationId,
      createdById: s.createdById,
      zoneId: s.zoneId,
      status: s.status,
      serviceTier: s.serviceTier,
      signatureOption: s.signatureOption,
      packagingType: s.packagingType,
      customsContentType: s.customsContentType,
      shipDate: s.shipDate,
      estimatedDelivery: s.estimatedDelivery,
      actualDelivery: s.actualDelivery,

      senderName: s.senderName,
      senderCompany: s.senderCompany,
      senderTaxId: s.senderTaxId,
      senderPhone: s.senderPhone,
      senderPhoneExt: s.senderPhoneExt,
      senderEmail: s.senderEmail,
      senderAddress1: s.senderAddress1,
      senderAddress2: s.senderAddress2,
      senderAddress3: s.senderAddress3,
      senderCity: s.senderCity,
      senderState: s.senderState,
      senderPostal: s.senderPostal,
      senderCountry: s.senderCountry,
      originAirportCode: s.originAirportCode,

      recipientName: s.recipientName,
      recipientCompany: s.recipientCompany,
      recipientTaxId: s.recipientTaxId,
      recipientPhone: s.recipientPhone,
      recipientPhoneExt: s.recipientPhoneExt,
      recipientEmail: s.recipientEmail,
      recipientAddress1: s.recipientAddress1,
      recipientAddress2: s.recipientAddress2,
      recipientAddress3: s.recipientAddress3,
      recipientCity: s.recipientCity,
      recipientState: s.recipientState,
      recipientPostal: s.recipientPostal,
      recipientCountry: s.recipientCountry,
      destAirportCode: s.destAirportCode,
      isResidential: s.isResidential,

      packageCount: s.packageCount,
      totalActualWeightKg: Number(s.totalActualWeightKg),
      totalVolumetricWgtKg: Number(s.totalVolumetricWgtKg),
      totalChargeableWgtKg: Number(s.totalChargeableWgtKg),
      totalCustomsValue: Number(s.totalCustomsValue),
      totalDeclaredValue: Number(s.totalDeclaredValue),
      currency: s.currency,

      billTransportationTo: s.billTransportationTo,
      billingAccountNumber: s.billingAccountNumber,
      dutiesBillTo: s.dutiesBillTo,
      dutiesAccountNumber: s.dutiesAccountNumber,
      referenceCode: s.referenceCode,
      invoiceNumber: s.invoiceNumber,
      poNumber: s.poNumber,
      cadNumber: s.cadNumber,

      baseChargeUsd: Number(s.baseChargeUsd),
      fuelSurchargeUsd: Number(s.fuelSurchargeUsd),
      surchargeAmountUsd: Number(s.surchargeAmountUsd),
      totalShippingCostUsd: Number(s.totalShippingCostUsd),
      finalizedAt: s.finalizedAt,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,

      organization: s.organization,
      packages: s.packages.map((pkg) => ({
        id: pkg.id,
        shipmentId: pkg.shipmentId,
        packageIndex: pkg.packageIndex,
        actualWeight: Number(pkg.actualWeight),
        weightUnit: pkg.weightUnit,
        length: Number(pkg.length),
        width: Number(pkg.width),
        height: Number(pkg.height),
        dimensionUnit: pkg.dimensionUnit,
        volumetricWgt: Number(pkg.volumetricWgt),
        chargeableWgt: Number(pkg.chargeableWgt),
        declaredValue: Number(pkg.declaredValue),
      })),
      commodities: s.commodities.map((c) => ({
        id: c.id,
        shipmentId: c.shipmentId,
        packageCount: c.packageCount,
        description: c.description,
        hsTariffCode: c.hsTariffCode,
        quantity: Number(c.quantity),
        unitOfMeasure: c.unitOfMeasure,
        netWeightKg: Number(c.netWeightKg),
        unitValue: Number(c.unitValue),
        totalValue: Number(c.totalValue),
        countryOfMfr: c.countryOfMfr,
      })),
      pickupOrder: s.pickupOrder,
      trackingEvents: s.trackingEvents.map((ev) => ({
        id: ev.id,
        shipmentId: ev.shipmentId,
        eventCode: ev.eventCode,
        statusTitle: ev.statusTitle,
        description: ev.description,
        city: ev.city,
        stateProvince: ev.stateProvince,
        countryCode: ev.countryCode,
        hubCode: ev.hubCode,
        signedBy: ev.signedBy,
        timestamp: ev.timestamp,
      })),
      notificationSettings: s.notificationSettings,
    };

    return NextResponse.json(shipmentDto, { status: 200 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to retrieve shipment';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
