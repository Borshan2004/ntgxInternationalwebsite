// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import type { UserRole } from '@/types/shipment';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: 'event', level: 'error' },
      { emit: 'stdout', level: 'warn' },
    ],
  });

// Filter out benign Neon serverless idle socket closure
// When Neon puts idle computes to sleep, PgBouncer closes the idle connection.
// Prisma reconnects automatically upon the next query.
(prisma as unknown as { $on: (event: string, cb: (e: { message: string }) => void) => void }).$on(
  'error',
  (e: { message: string }) => {
    if (e.message && (e.message.includes('kind: Closed') || e.message.includes('Closed, cause: None'))) {
      return;
    }
    console.error('Prisma database error:', e.message);
  }
);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export interface SessionTenantContext {
  readonly userId: string;
  readonly role: UserRole;
  readonly organizationId: string | null;
}

/**
 * Returns a tenant-scoped Prisma client.
 * - ADMIN and EMPLOYEE (staff members) have cross-tenant operational visibility.
 * - CUSTOMER is strictly isolated to their own organizationId.
 */
export function getTenantPrisma(session: SessionTenantContext) {
  return prisma.$extends({
    query: {
      shipment: {
        async findMany({ args, query }) {
          if (session.role === 'CUSTOMER') {
            if (!session.organizationId) {
              throw new Error('FORBIDDEN: Customer account lacks an active organizationId.');
            }
            args.where = { ...args.where, organizationId: session.organizationId };
          }
          return query(args);
        },
        async findFirst({ args, query }) {
          if (session.role === 'CUSTOMER') {
            if (!session.organizationId) {
              throw new Error('FORBIDDEN: Customer account lacks an active organizationId.');
            }
            args.where = { ...args.where, organizationId: session.organizationId };
          }
          return query(args);
        },
      },
      addressBookEntry: {
        async findMany({ args, query }) {
          if (session.role === 'CUSTOMER' && session.organizationId) {
            args.where = { ...args.where, organizationId: session.organizationId };
          }
          return query(args);
        },
      },
    },
  });
}

export default prisma;
