// src/lib/tokens.ts
import tokens from '../../design-tokens.json';
import type { ShipmentStatus } from '@/types/shipment';

export const designTokens = tokens;

export interface StatusBadgeStyle {
  readonly bg: string;
  readonly text: string;
  readonly border: string;
  readonly dot: string;
  readonly label: string;
}

export function getStatusBadgeStyle(status: ShipmentStatus): StatusBadgeStyle {
  switch (status) {
    case 'DRAFT_INCOMPLETE':
      return {
        ...tokens.colors.status.draft,
        label: 'Draft / Incomplete',
      };
    case 'SHIPMENT_CREATED_PRINTED':
      return {
        ...tokens.colors.status.printed,
        label: 'Label Created',
      };
    case 'PICKUP_SCHEDULED':
      return {
        ...tokens.colors.status.pickupScheduled,
        label: 'Pickup Scheduled',
      };
    case 'PICKED_UP':
    case 'AT_ORIGIN_FACILITY':
    case 'IN_TRANSIT':
    case 'AT_DESTINATION_FACILITY':
      return {
        ...tokens.colors.status.inTransit,
        label: status === 'IN_TRANSIT' ? 'In Transit' : status.replace(/_/g, ' '),
      };
    case 'OUT_FOR_DELIVERY':
      return {
        ...tokens.colors.status.outForDelivery,
        label: 'Out for Delivery',
      };
    case 'DELIVERED':
      return {
        ...tokens.colors.status.delivered,
        label: 'Delivered',
      };
    case 'DELIVERY_EXCEPTION':
    case 'RETURNED_TO_SHIPPER':
    case 'CANCELLED':
      return {
        ...tokens.colors.status.exception,
        label: status === 'DELIVERY_EXCEPTION' ? 'Exception' : status.replace(/_/g, ' '),
      };
    default:
      return {
        ...tokens.colors.status.draft,
        label: status,
      };
  }
}
