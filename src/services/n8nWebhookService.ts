// src/services/n8nWebhookService.ts
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import type {
  N8nShipmentLifecyclePayload,
  N8nUserKycWebhookPayload,
  N8nWebhookDispatchResult,
  N8nWebhookEnvelope,
} from '@/types/n8n.types';

export class N8nWebhookService {
  private static readonly MAX_RETRIES = 3;
  private static readonly REQUEST_TIMEOUT_MS = 8000;

  private static getWebhookUrl(): string {
    return (
      process.env.N8N_LOGISTICS_WEBHOOK_URL ??
      'http://localhost:5678/webhook/fedex-logistics-events'
    );
  }

  private static getWebhookSecret(): string {
    return process.env.N8N_WEBHOOK_HMAC_SECRET ?? 'dev-fedex-n8n-hmac-secret';
  }

  /**
   * Computes an HMAC-SHA256 signature of the serialized JSON body so n8n can verify authenticity.
   */
  public static computeHmacSignature(rawBody: string, timestamp: string): string {
    const signingInput = `${timestamp}.${rawBody}`;
    return crypto
      .createHmac('sha256', this.getWebhookSecret())
      .update(signingInput, 'utf8')
      .digest('hex');
  }

  /**
   * Dispatches a strongly-typed shipment lifecycle event (Booked, In Transit, Out for Delivery, Delivered, Exception) to n8n.
   */
  public static async triggerShipmentLifecycleEvent(
    payload: N8nShipmentLifecyclePayload
  ): Promise<N8nWebhookDispatchResult> {
    return this.dispatchWithRetry(payload, payload.tenant.organizationId, payload.shipment.id);
  }

  /**
   * Dispatches KYC registration / approval events to n8n for staff and customer notifications.
   */
  public static async triggerUserKycEvent(
    payload: N8nUserKycWebhookPayload
  ): Promise<N8nWebhookDispatchResult> {
    return this.dispatchWithRetry(payload, null, payload.user.id);
  }

  private static async dispatchWithRetry(
    envelope: N8nWebhookEnvelope,
    tenantId: string | null,
    entityId: string
  ): Promise<N8nWebhookDispatchResult> {
    const rawBody = JSON.stringify(envelope);
    const timestamp = Date.now().toString();
    const signature = this.computeHmacSignature(rawBody, timestamp);
    const webhookUrl = this.getWebhookUrl();

    let lastError = 'Unknown webhook dispatch error';
    let lastStatusCode = 0;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-fedex-event-id': envelope.eventId,
            'x-fedex-event-type': envelope.eventType,
            'x-fedex-timestamp': timestamp,
            'x-fedex-hmac-sha256': `sha256=${signature}`,
          },
          body: rawBody,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        lastStatusCode = response.status;

        if (response.ok) {
          const responseJson = (await response.json().catch(() => ({}))) as {
            readonly executionId?: string;
          };

          await prisma.auditLog.create({
            data: {
              tenantId,
              action: `N8N_WEBHOOK_DISPATCHED_${envelope.eventType}`,
              entityType: 'N8N_WEBHOOK',
              entityId,
              metadataJson: {
                eventId: envelope.eventId,
                statusCode: response.status,
                attempt,
                executionId: responseJson.executionId ?? null,
              },
            },
          });

          return {
            success: true,
            eventId: envelope.eventId,
            statusCode: response.status,
            n8nExecutionId: responseJson.executionId,
            attemptCount: attempt,
          };
        }

        lastError = `HTTP ${response.status}: ${await response.text()}`;
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err instanceof Error ? err.message : 'Network timeout contacting n8n';
      }

      // Exponential backoff: 400ms, 800ms, 1600ms
      if (attempt < this.MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 400 * Math.pow(2, attempt - 1)));
      }
    }

    // Log failure in AuditLog so Admin/Employee dashboard can replay failed webhooks
    await prisma.auditLog.create({
      data: {
        tenantId,
        action: `N8N_WEBHOOK_FAILED_${envelope.eventType}`,
        entityType: 'N8N_WEBHOOK',
        entityId,
        metadataJson: {
          eventId: envelope.eventId,
          errorMessage: lastError,
          statusCode: lastStatusCode,
        },
      },
    });

    return {
      success: false,
      eventId: envelope.eventId,
      statusCode: lastStatusCode,
      errorMessage: lastError,
      attemptCount: this.MAX_RETRIES,
    };
  }
}
