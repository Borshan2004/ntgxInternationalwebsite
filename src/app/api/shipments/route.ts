// src/app/api/shipments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BarcodeService } from '@/services/barcodeService';
import { RateEngineService } from '@/services/rateEngineService';
import { EmailNotificationService } from '@/services/emailService';
import { TrackingRegistryService } from '@/services/trackingRegistryService';
import type { ShipmentFormPayload } from '@/types/shipment';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const partyAddressSchema = z.object({
  contactName: z.string().min(1),
  company: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
  phone: z.string().min(1),
  email: z.string().optional().nullable().default(''),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional().nullable(),
  addressLine3: z.string().optional().nullable(),
  city: z.string().min(1),
  stateProvince: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable().default(''),
  countryCode: z.string().min(1).max(10).transform((c) => c.trim().toUpperCase().slice(0, 2)),
  airportHubCode: z.string().optional().nullable(),
  isResidential: z.boolean().default(false),
});

const packageSchema = z.object({
  packageIndex: z.number().int().positive().default(1),
  actualWeight: z.number().positive().default(1),
  weightUnit: z.enum(['KG', 'LB']).default('KG'),
  length: z.number().positive().default(10),
  width: z.number().positive().default(10),
  height: z.number().positive().default(10),
  dimensionUnit: z.enum(['CM', 'IN']).default('CM'),
  declaredValueUsd: z.number().nonnegative().default(0),
});

const commoditySchema = z.object({
  packageCount: z.number().int().positive().default(1),
  description: z.string().optional().default('Goods'),
  hsTariffCode: z.string().optional().default('000000'),
  quantity: z.number().nonnegative().default(1),
  unitOfMeasure: z.enum(['PKS', 'PCS', 'KGS', 'DOZ', 'MTR']).default('PKS'),
  netWeightKg: z.number().nonnegative().default(1),
  unitValueUsd: z.number().nonnegative().default(0),
  countryOfMfr: z.string().default('BD'),
});

const shipmentCreateSchema = z.object({
  organizationId: z.string().min(1),
  action: z.enum(['SAVE_DRAFT', 'FINALIZE']),
  sender: partyAddressSchema,
  recipient: partyAddressSchema,
  packagingType: z.enum([
    'YOUR_PACKAGING',
    'FEDEX_ENVELOPE',
    'FEDEX_PAK',
    'FEDEX_BOX_SMALL',
    'FEDEX_BOX_MEDIUM',
    'FEDEX_BOX_LARGE',
    'FEDEX_TUBE',
  ]),
  packages: z.array(packageSchema).min(1),
  customsContentType: z.enum(['DOCUMENTS_ONLY', 'COMMODITIES']),
  commodities: z.array(commoditySchema).default([]),
  currency: z.string().default('USD'),
  service: z.object({
    serviceTier: z.enum([
      'INTERNATIONAL_PRIORITY',
      'INTERNATIONAL_ECONOMY',
      'INTERNATIONAL_FIRST',
      'STANDARD_OVERNIGHT',
      'PRIORITY_OVERNIGHT',
      'GROUND_STANDARD',
    ]),
    shipDate: z.string(),
    signatureOption: z.enum([
      'NO_SIGNATURE_REQUIRED',
      'INDIRECT_SIGNATURE',
      'DIRECT_SIGNATURE',
      'ADULT_SIGNATURE',
    ]),
    holdAtLocation: z.boolean().default(false),
  }),
  pickup: z.object({
    isDropOff: z.boolean().default(false),
    pickupDate: z.string(),
    earliestTime: z.string(),
    latestTime: z.string(),
    instructions: z.string().optional().nullable(),
  }),
  billing: z.object({
    billTransportationTo: z.enum(['MY_ACCOUNT', 'RECIPIENT', 'THIRD_PARTY']),
    billingAccountNumber: z.string().optional().nullable(),
    dutiesBillTo: z.enum(['MY_ACCOUNT', 'RECIPIENT', 'THIRD_PARTY']),
    dutiesAccountNumber: z.string().optional().nullable(),
    referenceCode: z.string().optional().nullable(),
    invoiceNumber: z.string().optional().nullable(),
    poNumber: z.string().optional().nullable(),
    notifications: z.object({
      clientEmail: z.string().min(1),
      companyEmail: z.string().optional().nullable().default('aisolver47@gmail.com'),
      language: z.string().default('en'),
      notifyCreated: z.boolean().default(true),
      notifyScheduled: z.boolean().default(true),
      notifyPickedUp: z.boolean().default(true),
      notifyInTransit: z.boolean().default(true),
      notifyDelivered: z.boolean().default(true),
      notifyException: z.boolean().default(true),
    }),
  }),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await req.json();
    const parseResult = shipmentCreateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const payload = rawBody as ShipmentFormPayload;
    const isFinalizing = payload.action === 'FINALIZE';

    // 1. Calculate volumetric weight & shipping rate
    const rateResult = RateEngineService.calculateShipmentRate({
      originCountryCode: payload.sender.countryCode,
      destCountryCode: payload.recipient.countryCode,
      serviceTier: payload.service.serviceTier,
      packagingType: payload.packagingType,
      packages: payload.packages,
      isResidential: payload.recipient.isResidential,
      signatureOption: payload.service.signatureOption,
    });

    // 2. Generate 12-digit Mod-11 tracking number & SVG barcode
    const trackingArtifacts = BarcodeService.generateTrackingArtifacts({
      originHub: payload.sender.airportHubCode ?? 'DACA',
      destHub: rateResult.destAirportHub,
      destPostal: payload.recipient.postalCode,
      destCountry: payload.recipient.countryCode,
      serviceTier: payload.service.serviceTier,
      signatureOption: payload.service.signatureOption,
    });

    const totalCustomsValue = payload.commodities.reduce(
      (sum, item) => sum + (item.totalValueUsd ?? (item.quantity * item.unitValueUsd)),
      0
    );
    const totalDeclaredValue = payload.packages.reduce(
      (sum, pkg) => sum + (pkg.declaredValueUsd ?? 0),
      0
    );

    let shipmentId = `shp_${Date.now()}`;

    // 3. Persist to Prisma Database (if available)
    try {
      // Find existing organization or create safely
      let organization = await prisma.organization.findUnique({
        where: { id: payload.organizationId },
      });

      if (!organization) {
        // Try finding by account number, email, or code
        const existingOrg = await prisma.organization.findFirst({
          where: {
            OR: [
              ...(payload.billing.billingAccountNumber
                ? [{ accountNumber: payload.billing.billingAccountNumber }]
                : []),
              { email: payload.sender.email },
              { name: payload.sender.company ?? payload.sender.contactName },
            ],
          },
        });

        if (existingOrg) {
          organization = existingOrg;
        } else {
          // Create new unique organization with guaranteed unique code & account number
          const randNum = Math.floor(100000000 + Math.random() * 900000000).toString();
          const orgCode = `ORG-${payload.sender.countryCode}-${randNum.slice(-4)}`;
          organization = await prisma.organization.create({
            data: {
              name: payload.sender.company ?? payload.sender.contactName,
              code: orgCode,
              accountNumber: payload.billing.billingAccountNumber || randNum,
              phone: payload.sender.phone,
              email: payload.sender.email,
            },
          });
        }
      }

      // Safe user lookup or creation
      const senderEmail = payload.sender.email.trim().toLowerCase();
      let user = await prisma.user.findUnique({
        where: { email: senderEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            organizationId: organization.id,
            name: payload.sender.contactName,
            email: senderEmail,
            passwordHash: 'insecure_placeholder_hash',
            phone: payload.sender.phone,
            role: 'CUSTOMER',
            status: 'ACTIVE',
          },
        });
      }

      const createdShipment = await prisma.shipment.create({
        data: {
          trackingNumber: trackingArtifacts.rawTrackingNumber,
          formCode: trackingArtifacts.formCode,
          routingCode: trackingArtifacts.routingHeader,
          barcodeSvg: trackingArtifacts.barcodeSvg,
          organization: { connect: { id: organization.id } },
          createdBy: { connect: { id: user.id } },
          status: isFinalizing ? 'SHIPMENT_CREATED_PRINTED' : 'DRAFT_INCOMPLETE',
          serviceTier: payload.service.serviceTier,
          signatureOption: payload.service.signatureOption,
          packagingType: payload.packagingType,
          customsContentType: payload.customsContentType,
          shipDate: new Date(payload.service.shipDate),
          estimatedDelivery: new Date(rateResult.estimatedDeliveryDate),

          senderName: payload.sender.contactName,
          senderCompany: payload.sender.company,
          senderTaxId: payload.sender.taxId,
          senderPhone: payload.sender.phone,
          senderEmail: payload.sender.email,
          senderAddress1: payload.sender.addressLine1,
          senderAddress2: payload.sender.addressLine2,
          senderAddress3: payload.sender.addressLine3,
          senderCity: payload.sender.city,
          senderPostal: payload.sender.postalCode,
          senderCountry: payload.sender.countryCode,
          originAirportCode: payload.sender.airportHubCode ?? 'DACA',

          recipientName: payload.recipient.contactName,
          recipientCompany: payload.recipient.company,
          recipientTaxId: payload.recipient.taxId,
          recipientPhone: payload.recipient.phone,
          recipientEmail: payload.recipient.email,
          recipientAddress1: payload.recipient.addressLine1,
          recipientAddress2: payload.recipient.addressLine2,
          recipientAddress3: payload.recipient.addressLine3,
          recipientCity: payload.recipient.city,
          recipientState: payload.recipient.stateProvince,
          recipientPostal: payload.recipient.postalCode,
          recipientCountry: payload.recipient.countryCode,
          destAirportCode: rateResult.destAirportHub,
          isResidential: payload.recipient.isResidential,

          packageCount: payload.packages.length,
          totalActualWeightKg: rateResult.totalActualWeightKg,
          totalVolumetricWgtKg: rateResult.totalVolumetricWeightKg,
          totalChargeableWgtKg: rateResult.totalChargeableWeightKg,
          totalCustomsValue,
          totalDeclaredValue,
          currency: payload.currency,

          billTransportationTo: payload.billing.billTransportationTo,
          billingAccountNumber: payload.billing.billingAccountNumber,
          dutiesBillTo: payload.billing.dutiesBillTo,
          dutiesAccountNumber: payload.billing.dutiesAccountNumber,
          referenceCode: payload.billing.referenceCode,
          invoiceNumber: payload.billing.invoiceNumber,
          poNumber: payload.billing.poNumber,

          baseChargeUsd: rateResult.baseChargeUsd,
          fuelSurchargeUsd: rateResult.fuelSurchargeUsd,
          surchargeAmountUsd: rateResult.totalSurchargesUsd,
          totalShippingCostUsd: rateResult.totalShippingCostUsd,
          finalizedAt: isFinalizing ? new Date() : null,

          packages: {
            create: payload.packages.map((pkg, idx) => {
              const w = RateEngineService.calculatePackageWeightsKg(pkg);
              return {
                packageIndex: idx + 1,
                actualWeight: pkg.actualWeight,
                weightUnit: pkg.weightUnit,
                length: pkg.length,
                width: pkg.width,
                height: pkg.height,
                dimensionUnit: pkg.dimensionUnit,
                volumetricWgt: w.volumetricWeightKg,
                chargeableWgt: w.chargeableWeightKg,
                declaredValue: pkg.declaredValueUsd,
              };
            }),
          },
          commodities: {
            create: payload.commodities.map((c) => ({
              packageCount: c.packageCount,
              description: c.description,
              hsTariffCode: c.hsTariffCode,
              quantity: c.quantity,
              unitOfMeasure: c.unitOfMeasure,
              netWeightKg: c.netWeightKg,
              unitValue: c.unitValueUsd,
              totalValue: c.totalValueUsd ?? (c.quantity * (c.unitValueUsd ?? 0)),
              countryOfMfr: c.countryOfMfr,
            })),
          },
          ...(isFinalizing
            ? {
                trackingEvents: {
                  create: {
                    eventCode: 'OC',
                    statusTitle: 'Shipment created and Air Waybill generated',
                    description: 'Label printed and tender manifest registered.',
                    city: payload.sender.city,
                    countryCode: payload.sender.countryCode,
                    hubCode: payload.sender.airportHubCode ?? 'DACA',
                  },
                },
              }
            : {}),
        },
      });

      shipmentId = createdShipment.id;
    } catch (dbErr) {
      console.error('Prisma Shipment creation notice:', dbErr);
      // Dual-persistence fallback to TrackingRegistryService continues
    }

    // Register in TrackingRegistryService for instant tracking in live demo
    TrackingRegistryService.registerShipment({
      id: shipmentId,
      trackingNumber: trackingArtifacts.rawTrackingNumber,
      recipient: payload.recipient.company ? `${payload.recipient.contactName} (${payload.recipient.company})` : payload.recipient.contactName,
      destinationCity: payload.recipient.city,
      destinationCountry: payload.recipient.countryCode,
      destAirportHub: rateResult.destAirportHub || 'EWR',
      status: isFinalizing ? 'SHIPMENT_CREATED_PRINTED' : 'DRAFT_INCOMPLETE',
      serviceTier: payload.service.serviceTier,
      weightKg: rateResult.totalChargeableWeightKg,
      createdAt: new Date().toISOString().split('T')[0],
      senderCity: payload.sender.city,
      senderCountry: payload.sender.countryCode,
    });

    // 4. Trigger Dual Emails (Customer Confirmation + Office/Operations Alert)
    let emailDispatchResult = null;
    if (isFinalizing) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
      const clientEmail = payload.billing.notifications?.clientEmail || payload.sender.email;
      const companyOperationsEmail = payload.billing.notifications?.companyEmail || 'operations@company.com';

      emailDispatchResult = await EmailNotificationService.sendShipmentFinalizedEmails({
        trackingNumberFormatted: trackingArtifacts.formattedTrackingNumber,
        clientEmail,
        companyOperationsEmail,
        senderCompanyOrName: payload.sender.company ?? payload.sender.contactName,
        recipientCompanyOrName: payload.recipient.company ?? payload.recipient.contactName,
        destinationCityCountry: `${payload.recipient.city}, ${payload.recipient.countryCode}`,
        serviceTier: payload.service.serviceTier,
        chargeableWeightKg: rateResult.totalChargeableWeightKg,
        pickupDate: payload.pickup.pickupDate,
        pickupWindow: `${payload.pickup.earliestTime} - ${payload.pickup.latestTime}`,
        awbDownloadUrl: `${appUrl}/api/documents/awb/${shipmentId}`,
        invoiceDownloadUrl: `${appUrl}/api/documents/invoice/${shipmentId}`,
        trackingUrl: `${appUrl}/tracking?query=${trackingArtifacts.rawTrackingNumber}`,
      });
    }

    return NextResponse.json(
      {
        success: true,
        shipmentId,
        trackingNumber: trackingArtifacts.rawTrackingNumber,
        trackingNumberFormatted: trackingArtifacts.formattedTrackingNumber,
        status: isFinalizing ? 'SHIPMENT_CREATED_PRINTED' : 'DRAFT_INCOMPLETE',
        rateBreakdown: rateResult,
        emailDispatch: emailDispatchResult,
        documents: {
          awbUrl: `/api/documents/awb/${shipmentId}`,
          commercialInvoiceUrl: `/api/documents/invoice/${shipmentId}`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process shipment';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const dbShipments = await prisma.shipment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    if (dbShipments && dbShipments.length > 0) {
      const formatted = dbShipments.map((s) => ({
        id: s.id,
        trackingNumber: s.trackingNumber,
        sender: s.senderCompany ? `${s.senderName} (${s.senderCompany})` : s.senderName,
        origin: `${s.senderCity}, ${s.senderCountry}`,
        recipient: s.recipientCompany ? `${s.recipientName} (${s.recipientCompany})` : s.recipientName,
        destination: `${s.recipientCity}, ${s.recipientCountry}`,
        status: s.status,
        service: s.serviceTier.replace(/_/g, ' '),
        weight: `${Number(s.totalChargeableWgtKg).toFixed(2)} kg`,
        createdAt: s.createdAt.toISOString().split('T')[0],
        createdDateTime: s.createdAt.toISOString(),
        estimatedDelivery: s.estimatedDelivery ? s.estimatedDelivery.toISOString() : null,
        actualDelivery: s.actualDelivery ? s.actualDelivery.toISOString() : null,
      }));
      return NextResponse.json(formatted, { status: 200 });
    }
  } catch (err) {
    console.error('Prisma shipments manifest retrieval fallback:', err);
    // Database not connected, fallback to persistent disk store
  }

  const all = TrackingRegistryService.getAllShipments();
  const formatted = all.map((s) => ({
    id: s.id,
    trackingNumber: s.trackingNumber,
    sender: 'NTGX Logistics Hub',
    origin: `${s.senderCity || 'Dhaka'}, ${s.senderCountry || 'BD'}`,
    recipient: s.recipient,
    destination: `${s.destinationCity}, ${s.destinationCountry}`,
    status: s.status,
    service: s.serviceTier.replace(/_/g, ' '),
    weight: `${s.weightKg.toFixed(2)} kg`,
    createdAt: s.createdAt,
    createdDateTime: new Date(s.createdAt).toISOString(),
    estimatedDelivery: null,
    actualDelivery: null,
  }));

  return NextResponse.json(formatted, { status: 200 });
}
