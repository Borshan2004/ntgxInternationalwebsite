// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(7),
  organizationName: z.string().min(2),
  organizationCode: z.string().min(2), // e.g. "ASI-BD"
  taxId: z.string().optional().nullable(),
  vatNumber: z.string().optional().nullable(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid registration details', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      phone,
      organizationName,
      organizationCode,
      taxId,
      vatNumber,
    } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email address is already registered.' },
        { status: 409 }
      );
    }

    // Generate 9-digit FedEx style account number: e.g. "987654321"
    const accountNumber = Math.floor(100000000 + Math.random() * 900000000).toString();

    // Create or link organization
    const org = await prisma.organization.upsert({
      where: { code: organizationCode },
      update: {},
      create: {
        name: organizationName,
        code: organizationCode,
        taxId: taxId ?? null,
        vatNumber: vatNumber ?? null,
        accountNumber,
        phone,
        email,
      },
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        organizationId: org.id,
        name,
        email,
        passwordHash,
        phone,
        role: 'CUSTOMER',
        status: 'PENDING_APPROVAL', // Requires Staff KYC verification
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        tenantId: org.id,
        action: 'USER_REGISTERED_PENDING_APPROVAL',
        entityType: 'User',
        entityId: newUser.id,
        metadataJson: {
          email,
          organizationCode,
          accountNumber,
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Registration received. Account is pending verification by operations staff.',
        userId: newUser.id,
        organizationId: org.id,
        status: newUser.status,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
