// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  try {
    const users = await prisma.user.findMany({
      include: {
        organization: true,
        approvedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      organization: u.organization ? `${u.organization.name} (${u.organization.code})` : 'Individual Customer',
      organizationId: u.organizationId,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt.toISOString().split('T')[0],
      approvedBy: u.approvedBy?.name,
      approvedAt: u.approvedAt ? u.approvedAt.toISOString() : undefined,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error('Failed to retrieve users from database:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}
