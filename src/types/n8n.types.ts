// src/types/n8n.types.ts
import type {
  ScanEventCode,
  ServiceTier,
  ShipmentStatus,
  SignatureOption,
} from '@/types/shipment';

export type N8nLogisticsEventType =
  | 'SHIPMENT_BOOKED_FINALIZED'
  | 'SHIPMENT_STATUS_UPDATED'
  | 'USER_REGISTRATION_PENDING'
  | 'USER_ACCOUNT_APPROVED';

export interface N8nDocumentUrls {
  readonly awbPdfUrl: string;
  readonly commercialInvoicePdfUrl: string;
  readonly publicTrackingUrl: string;
}

export interface N8nScanMilestoneData {
  readonly eventCode: ScanEventCode;
  readonly statusTitle: string;
  readonly description?: string;
  readonly city: string;
  readonly stateProvince?: string;
  readonly countryCode: string;
  readonly hubCode?: string;
  readonly signedBy?: string;
  readonly signatureImageUrl?: string;
  readonly timestamp: string;
}

export interface N8nNotificationPreferences {
  readonly clientEmail: string;
  readonly recipientEmail?: string;
  readonly recipientPhone: string;
  readonly companyOperationsEmail: string;
  readonly language: 'en' | 'bn';
  readonly notifyCreated: boolean;
  readonly notifyScheduled: boolean;
  readonly notifyPickedUp: boolean;
  readonly notifyInTransit: boolean;
  readonly notifyDelivered: boolean;
  readonly notifyException: boolean;
}

export interface N8nShipmentLifecyclePayload {
  readonly eventId: string;
  readonly eventType: 'SHIPMENT_BOOKED_FINALIZED' | 'SHIPMENT_STATUS_UPDATED';
  readonly occurredAt: string;
  readonly tenant: {
    readonly organizationId: string;
    readonly companyName: string;
    readonly companyCode: string;
  };
  readonly shipment: {
    readonly id: string;
    readonly trackingNumberRaw: string;
    readonly trackingNumberFormatted: string;
    readonly status: ShipmentStatus;
    readonly serviceTier: ServiceTier;
    readonly signatureOption: SignatureOption;
    readonly originAirportCode: string;
    readonly destAirportCode: string;
    readonly senderName: string;
    readonly senderCompany?: string;
    readonly senderPhone: string;
    readonly recipientName: string;
    readonly recipientCompany?: string;
    readonly recipientCity: string;
    readonly recipientCountry: string;
    readonly packageCount: number;
    readonly totalChargeableWeightKg: number;
    readonly totalCustomsValueUsd: number;
    readonly totalShippingCostUsd: number;
    readonly pickupWindow?: {
      readonly pickupDate: string;
      readonly earliestTime: string;
      readonly latestTime: string;
    };
    readonly estimatedDeliveryDate?: string;
  };
  readonly latestScan: N8nScanMilestoneData;
  readonly documents: N8nDocumentUrls;
  readonly notifications: N8nNotificationPreferences;
}

export interface N8nUserKycWebhookPayload {
  readonly eventId: string;
  readonly eventType: 'USER_REGISTRATION_PENDING' | 'USER_ACCOUNT_APPROVED';
  readonly occurredAt: string;
  readonly user: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly companyName: string;
    readonly taxId?: string;
    readonly status: 'PENDING_APPROVAL' | 'ACTIVE';
    readonly approvedByStaffName?: string;
  };
  readonly adminPortalUrl: string;
}

export type N8nWebhookEnvelope =
  | N8nShipmentLifecyclePayload
  | N8nUserKycWebhookPayload;

export interface N8nWebhookDispatchResult {
  readonly success: boolean;
  readonly eventId: string;
  readonly statusCode: number;
  readonly n8nExecutionId?: string;
  readonly errorMessage?: string;
  readonly attemptCount: number;
}
