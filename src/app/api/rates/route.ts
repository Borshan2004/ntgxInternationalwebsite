// src/app/api/rates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ServiceTier } from '@/types/shipment';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  try {
    const zones = await prisma.shippingZone.findMany({
      include: {
        rateCards: true,
      },
      orderBy: { code: 'asc' },
    });

    const formattedZones = zones.map((z) => ({
      code: z.code,
      name: z.name,
      origin: z.originCountryCode,
      destinations: z.destCountryCodes,
      hub: z.defaultDestHubCode,
      transit: `${z.estimatedTransitMin} - ${z.estimatedTransitMax} Days`,
    }));

    const rateCardsList: any[] = [];
    zones.forEach((z) => {
      z.rateCards.forEach((rc) => {
        rateCardsList.push({
          id: rc.id,
          zoneCode: z.code,
          zoneName: z.name,
          serviceTier: rc.serviceTier,
          baseRateUsd: Number(rc.baseRateUsd),
          perAdditionalKgUsd: Number(rc.ratePerAdditionalKg),
          fuelSurchargePct: Number(rc.fuelSurchargePercent),
          residentialFeeUsd: Number(rc.residentialFeeUsd),
          directSigFeeUsd: Number(rc.directSignatureFee),
        });
      });
    });

    return NextResponse.json(
      {
        zones: formattedZones,
        rateCards: rateCardsList,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to query shipping rates from database:', error);
    return NextResponse.json({ error: 'Failed to retrieve rates' }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const {
      zoneCode,
      serviceTier,
      baseRateUsd,
      perAdditionalKgUsd,
      fuelSurchargePct,
      residentialFeeUsd,
      directSigFeeUsd,
    } = body;

    const zone = await prisma.shippingZone.findUnique({
      where: { code: zoneCode },
    });

    if (!zone) {
      return NextResponse.json({ error: `Shipping zone ${zoneCode} not found` }, { status: 404 });
    }

    const rateCard = await prisma.rateCard.upsert({
      where: {
        zoneId_serviceTier: {
          zoneId: zone.id,
          serviceTier: serviceTier as ServiceTier,
        },
      },
      update: {
        baseRateUsd: Number(baseRateUsd),
        ratePerAdditionalKg: Number(perAdditionalKgUsd),
        fuelSurchargePercent: Number(fuelSurchargePct),
        residentialFeeUsd: Number(residentialFeeUsd),
        directSignatureFee: Number(directSigFeeUsd),
      },
      create: {
        zoneId: zone.id,
        serviceTier: serviceTier as ServiceTier,
        baseRateUsd: Number(baseRateUsd),
        ratePerAdditionalKg: Number(perAdditionalKgUsd),
        fuelSurchargePercent: Number(fuelSurchargePct),
        residentialFeeUsd: Number(residentialFeeUsd),
        directSignatureFee: Number(directSigFeeUsd),
      },
    });

    return NextResponse.json({ success: true, rateCard }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to save rate card';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
