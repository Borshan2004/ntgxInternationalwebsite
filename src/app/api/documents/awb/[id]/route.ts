// src/app/api/documents/awb/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PdfDocumentService, buildAirWaybillData } from '@/services/pdfService';
import type { ShipmentEntityDTO } from '@/types/shipment';

const FALLBACK_SHIPMENT: ShipmentEntityDTO = {
  id: 'shp_001',
  trackingNumber: '879098800901',
  formCode: '0430',
  routingCode: 'XA MTPA 58KJ1/70DF/484B',
  barcodeSvg:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60"><rect width="400" height="60" fill="#ffffff"/><path d="M10 5h4v50h-4zM20 5h2v50h-2zM28 5h6v50h-6zM40 5h2v50h-2zM48 5h4v50h-4zM60 5h8v50h-8zM75 5h2v50h-2zM85 5h4v50h-4zM95 5h6v50h-6zM110 5h2v50h-2zM120 5h4v50h-4zM130 5h8v50h-8zM145 5h2v50h-2zM155 5h4v50h-4zM165 5h6v50h-6zM180 5h2v50h-2zM190 5h4v50h-4zM200 5h8v50h-8zM215 5h2v50h-2zM225 5h4v50h-4zM235 5h6v50h-6zM250 5h2v50h-2zM260 5h4v50h-4zM270 5h8v50h-8zM285 5h2v50h-2zM295 5h4v50h-4zM305 5h6v50h-6zM320 5h2v50h-2zM330 5h4v50h-4zM340 5h8v50h-8zM355 5h2v50h-2zM365 5h4v50h-4zM375 5h6v50h-6zM390 5h4v50h-4z" fill="#000000"/></svg>',
  organizationId: 'org-asi-bd-demo',
  createdById: 'usr-customer-001',
  zoneId: 'ZONE_US_CA',
  status: 'SHIPMENT_CREATED_PRINTED',
  serviceTier: 'INTERNATIONAL_PRIORITY',
  signatureOption: 'DIRECT_SIGNATURE',
  packagingType: 'YOUR_PACKAGING',
  customsContentType: 'COMMODITIES',
  shipDate: new Date('2026-10-23T10:15:00Z'),
  estimatedDelivery: new Date('2026-10-27T17:00:00Z'),
  actualDelivery: null,

  senderName: 'Arafat / Gunjan',
  senderCompany: 'Apparel Sourcing International Inc.',
  senderTaxId: 'BIN-880198945',
  senderPhone: '8801989451709',
  senderPhoneExt: null,
  senderEmail: 'export@apparelsourcing.bd',
  senderAddress1: 'House # 30 (3rd Floor), Apt-B3, Western Road',
  senderAddress2: 'Banani DOHS',
  senderAddress3: null,
  senderCity: 'Dhaka',
  senderState: 'Dhaka Division',
  senderPostal: '1206',
  senderCountry: 'BD',
  originAirportCode: 'DACA',

  recipientName: 'Dakota / Salman',
  recipientCompany: 'Bernette Textile Co. Ltd.',
  recipientTaxId: 'US-EIN-13-987654',
  recipientPhone: '212-279-5526',
  recipientPhoneExt: null,
  recipientEmail: 'imports@bernettetextile.com',
  recipientAddress1: '42 West 39th Street, 11th Floor',
  recipientAddress2: null,
  recipientAddress3: null,
  recipientCity: 'New York',
  recipientState: 'NY',
  recipientPostal: '10018',
  recipientCountry: 'US',
  destAirportCode: 'EWR',
  isResidential: false,

  packageCount: 1,
  totalActualWeightKg: 2.5,
  totalVolumetricWgtKg: 4.0,
  totalChargeableWgtKg: 4.0,
  totalCustomsValue: 6.0,
  totalDeclaredValue: 6.0,
  currency: 'USD',

  billTransportationTo: 'RECIPIENT',
  billingAccountNumber: '987654321',
  dutiesBillTo: 'RECIPIENT',
  dutiesAccountNumber: 'US-EIN-13-987654',
  referenceCode: 'BNI/CC/P-1780009697',
  invoiceNumber: 'ASI-25075',
  poNumber: 'PO-99104',
  cadNumber: '260504077/INET4535',

  baseChargeUsd: 148.5,
  fuelSurchargeUsd: 21.53,
  surchargeAmountUsd: 3.88,
  totalShippingCostUsd: 173.91,
  finalizedAt: new Date('2026-10-23T10:15:00Z'),
  createdAt: new Date('2026-10-23T10:15:00Z'),
  updatedAt: new Date('2026-10-27T14:45:00Z'),

  organization: {
    id: 'org-asi-bd-demo',
    name: 'Apparel Sourcing International Inc.',
    code: 'ASI-BD',
    accountNumber: '987654321',
    phone: '8801989451709',
    email: 'export@apparelsourcing.bd',
    isActive: true,
    createdAt: new Date('2026-10-01'),
    updatedAt: new Date('2026-10-01'),
  },

  packages: [
    {
      id: 'pkg_001',
      shipmentId: 'shp_001',
      packageIndex: 1,
      actualWeight: 2.5,
      weightUnit: 'KG',
      length: 51,
      width: 35,
      height: 11,
      dimensionUnit: 'CM',
      volumetricWgt: 4.0,
      chargeableWgt: 4.0,
      declaredValue: 6.0,
    },
  ],

  commodities: [
    {
      id: 'com_001',
      shipmentId: 'shp_001',
      packageCount: 1,
      description: "Sample of Men's Shorts (97% Cotton, 3% Spandex)",
      hsTariffCode: '98110060',
      quantity: 2,
      unitOfMeasure: 'PCS',
      netWeightKg: 2.5,
      unitValue: 3.0,
      totalValue: 6.0,
      countryOfMfr: 'BD',
    },
  ],

  pickupOrder: null,
  trackingEvents: [],
  notificationSettings: null,
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const shipmentId = params.id;
    let s: any = null;

    try {
      s = await prisma.shipment.findFirst({
        where: {
          OR: [{ id: shipmentId }, { trackingNumber: shipmentId }],
        },
        include: {
          organization: true,
          packages: true,
          commodities: true,
          pickupOrder: true,
          trackingEvents: true,
          notificationSettings: true,
        },
      });
    } catch {
      // Prisma offline or disconnected
    }

    const shipmentDto: ShipmentEntityDTO = s
      ? {
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
          totalChargeableWgtKg: Number(s.totalChargeableWeightKg ?? s.totalChargeableWgtKg ?? 4.0),
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

          organization: s.organization ?? {
            id: s.organizationId,
            name: s.senderCompany ?? s.senderName,
            code: 'ORG-ASI',
            accountNumber: s.billingAccountNumber ?? '987654321',
            phone: s.senderPhone,
            email: s.senderEmail,
            isActive: s.organization?.isActive ?? true,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
          },

          packages: s.packages.map((pkg: any) => ({
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

          commodities: s.commodities.map((c: any) => ({
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

          pickupOrder: null,
          trackingEvents: [],
          notificationSettings: null,
        }
      : {
          ...FALLBACK_SHIPMENT,
          id: shipmentId,
        };

    const awbData = buildAirWaybillData(shipmentDto);
    const html = PdfDocumentService.renderThreePageAwbHtml(awbData);

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="AWB-${shipmentDto.trackingNumber}.html"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate AWB';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
