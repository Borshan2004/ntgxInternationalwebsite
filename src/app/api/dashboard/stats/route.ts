// src/app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  try {
    const [totalShipments, activeTrackings, pendingApprovals, revenueAggregate, recentShipments] =
      await Promise.all([
        prisma.shipment.count(),
        prisma.shipment.count({
          where: {
            status: {
              notIn: ['DELIVERED', 'CANCELLED'],
            },
          },
        }),
        prisma.user.count({
          where: {
            status: 'PENDING_APPROVAL',
          },
        }),
        prisma.shipment.aggregate({
          _sum: {
            totalShippingCostUsd: true,
          },
        }),
        prisma.shipment.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            trackingNumber: true,
            recipientName: true,
            recipientCompany: true,
            recipientCity: true,
            recipientCountry: true,
            status: true,
            serviceTier: true,
            totalChargeableWgtKg: true,
            totalShippingCostUsd: true,
            createdAt: true,
          },
        }),
      ]);

    const totalRevenue = revenueAggregate._sum.totalShippingCostUsd
      ? Number(revenueAggregate._sum.totalShippingCostUsd)
      : 0;

    const formattedRecent = recentShipments.map((s) => ({
      id: s.id,
      trackingNumber: s.trackingNumber,
      recipient: s.recipientCompany ? `${s.recipientName} (${s.recipientCompany})` : s.recipientName,
      destination: `${s.recipientCity}, ${s.recipientCountry}`,
      status: s.status,
      service: s.serviceTier.replace(/_/g, ' '),
      weight: `${Number(s.totalChargeableWgtKg).toFixed(2)} kg`,
      cost: `$${Number(s.totalShippingCostUsd).toFixed(2)}`,
      createdAt: s.createdAt.toISOString().split('T')[0],
    }));

    return NextResponse.json(
      {
        totalShipments,
        activeTrackings,
        pendingApprovals,
        totalRevenue: Math.round(totalRevenue),
        recentShipments: formattedRecent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to query dashboard statistics from database:', error);
    return NextResponse.json(
      {
        totalShipments: 0,
        activeTrackings: 0,
        pendingApprovals: 0,
        totalRevenue: 0,
        recentShipments: [],
      },
      { status: 500 }
    );
  }
}
