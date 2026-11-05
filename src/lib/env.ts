// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Neon Serverless PostgreSQL (PgBouncer connection pooling)
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .refine(
      (val) => val.startsWith('postgres://') || val.startsWith('postgresql://'),
      'DATABASE_URL must be a valid PostgreSQL connection string'
    ),

  // Direct connection for migrations (unpooled)
  DIRECT_URL: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith('postgres://') || val.startsWith('postgresql://'),
      'DIRECT_URL must be a valid PostgreSQL connection string'
    ),

  // Application Root URL
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // NextAuth / Session Secret
  NEXTAUTH_SECRET: z
    .string()
    .min(16, 'NEXTAUTH_SECRET must be at least 16 characters')
    .default('fedex-enterprise-replica-secret-key-32chars'),
  NEXTAUTH_URL: z.string().url().optional(),

  // n8n Workflow Automation
  N8N_LOGISTICS_WEBHOOK_URL: z
    .string()
    .url()
    .default('http://localhost:5678/webhook/fedex-logistics-events'),
  N8N_WEBHOOK_HMAC_SECRET: z
    .string()
    .min(8, 'N8N_WEBHOOK_HMAC_SECRET must be at least 8 characters')
    .default('dev-fedex-n8n-hmac-secret'),

  // Resend Transactional Email
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().default('logistics@company.com'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables configuration:');
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }

    // In development/test, we allow graceful fallbacks for local builds
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: Environment validation failed in production.');
    }

    // Return dummy valid object for local typing if building locally without .env
    return envSchema.parse({
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'postgresql://postgres:postgres@localhost:5432/fedex_replica?sslmode=disable',
      ...process.env,
    });
  }

  return parsed.data;
}

export const env: Env = validateEnv();
