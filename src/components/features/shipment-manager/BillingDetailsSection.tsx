// src/components/features/shipment-manager/BillingDetailsSection.tsx
'use client';

import React from 'react';
import type {
  BillingAndNotificationData,
  BillTransportationTo,
} from '@/types/shipment';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';

export interface BillingDetailsSectionProps {
  readonly billing: BillingAndNotificationData;
  readonly onChange: (updated: BillingAndNotificationData) => void;
  readonly onSaveDraft: () => void;
  readonly onFinalize: () => void;
  readonly onBack: () => void;
  readonly isSubmitting?: boolean;
}

const BILL_TO_OPTIONS = [
  { value: 'MY_ACCOUNT', label: 'My Account (Sender Shipper)' },
  { value: 'RECIPIENT', label: 'Recipient (Collect Upon Delivery)' },
  { value: 'THIRD_PARTY', label: 'Third Party Billing' },
];

export const BillingDetailsSection: React.FC<BillingDetailsSectionProps> = ({
  billing,
  onChange,
  onSaveDraft,
  onFinalize,
  onBack,
  isSubmitting = false,
}) => {
  const updateField = <K extends keyof BillingAndNotificationData>(
    field: K,
    val: BillingAndNotificationData[K]
  ): void => {
    onChange({ ...billing, [field]: val });
  };

  const updateNotification = <K extends keyof BillingAndNotificationData['notifications']>(
    field: K,
    val: BillingAndNotificationData['notifications'][K]
  ): void => {
    onChange({
      ...billing,
      notifications: {
        ...billing.notifications,
        [field]: val,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Transportation & Customs Duties Billing */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-textSecondary">
          Transportation Freight & Customs Duties Billing
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Bill Transportation Freight To"
            options={BILL_TO_OPTIONS}
            value={billing.billTransportationTo}
            onChange={(e) =>
              updateField('billTransportationTo', e.target.value as BillTransportationTo)
            }
          />
          <Input
            label="FedEx Account Number"
            value={billing.billingAccountNumber || ''}
            onChange={(e) => updateField('billingAccountNumber', e.target.value)}
            placeholder="e.g. 987654321"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Bill Duties / Taxes / Fees To"
            options={BILL_TO_OPTIONS}
            value={billing.dutiesBillTo}
            onChange={(e) =>
              updateField('dutiesBillTo', e.target.value as BillTransportationTo)
            }
          />
          <Input
            label="Duties Account Number (If Third Party)"
            value={billing.dutiesAccountNumber || ''}
            onChange={(e) => updateField('dutiesAccountNumber', e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Corporate Reference Codes */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-textSecondary">
          Corporate Reference & Document Codes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Customer Reference (REF)"
            value={billing.referenceCode || ''}
            onChange={(e) => updateField('referenceCode', e.target.value)}
            placeholder="e.g. BNI/CC/P-1780009697"
          />
          <Input
            label="Commercial Invoice No."
            value={billing.invoiceNumber || ''}
            onChange={(e) => updateField('invoiceNumber', e.target.value)}
            placeholder="e.g. ASI-25075"
          />
          <Input
            label="Purchase Order No. (P.O.)"
            value={billing.poNumber || ''}
            onChange={(e) => updateField('poNumber', e.target.value)}
            placeholder="e.g. PO-99104"
          />
        </div>
      </div>

      {/* Dual Email Notifications */}
      <div className="space-y-3 rounded-lg border border-neutral-border p-4 bg-neutral-surfaceMuted/40">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
          Automated Dual-Email Notification Triggers
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Client Notification Email"
            type="email"
            required
            value={billing.notifications.clientEmail}
            onChange={(e) => updateNotification('clientEmail', e.target.value)}
          />
          <Input
            label="Company Operations Email"
            type="email"
            required
            value={billing.notifications.companyEmail}
            onChange={(e) => updateNotification('companyEmail', e.target.value)}
          />
        </div>

        <div className="pt-2">
          <span className="text-xs font-semibold text-neutral-textSecondary block mb-2">
            Notification Triggers:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Checkbox
              label="Shipment Created"
              checked={billing.notifications.notifyCreated}
              onChange={(e) => updateNotification('notifyCreated', e.target.checked)}
            />
            <Checkbox
              label="Courier Picked Up"
              checked={billing.notifications.notifyPickedUp}
              onChange={(e) => updateNotification('notifyPickedUp', e.target.checked)}
            />
            <Checkbox
              label="In Transit Milestones"
              checked={billing.notifications.notifyInTransit}
              onChange={(e) => updateNotification('notifyInTransit', e.target.checked)}
            />
            <Checkbox
              label="Delivered with Signature"
              checked={billing.notifications.notifyDelivered}
              onChange={(e) => updateNotification('notifyDelivered', e.target.checked)}
            />
            <Checkbox
              label="Delivery Exceptions"
              checked={billing.notifications.notifyException}
              onChange={(e) => updateNotification('notifyException', e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Form Submission Actions */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between border-t border-neutral-border gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 text-xs text-neutral-textSecondary hover:text-neutral-textPrimary"
        >
          &larr; Back to Pickup Details
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            isLoading={isSubmitting}
            className="w-full sm:w-auto text-xs"
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onFinalize}
            isLoading={isSubmitting}
            className="w-full sm:w-auto text-xs px-6 font-bold bg-brand-orange hover:bg-brand-orangeHover"
          >
            Finalize & Generate AWB &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
};
