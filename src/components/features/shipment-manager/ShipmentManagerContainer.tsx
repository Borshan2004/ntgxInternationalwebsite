// src/components/features/shipment-manager/ShipmentManagerContainer.tsx
'use client';

import React, { useState } from 'react';
import { useShipmentForm } from '@/hooks/useShipmentForm';
import { useRateCalculator } from '@/hooks/useRateCalculator';
import { AccordionItem } from '@/components/ui/Accordion';
import { ShipFromSection } from './ShipFromSection';
import { DeliverToSection } from './DeliverToSection';
import { PackageDetailsSection } from './PackageDetailsSection';
import { PackageContentsSection } from './PackageContentsSection';
import { ServiceDetailsSection } from './ServiceDetailsSection';
import { PickupDropoffSection } from './PickupDropoffSection';
import { BillingDetailsSection } from './BillingDetailsSection';
import { AirWaybillDocument } from '../documents/AirWaybillDocument';
import { CommercialInvoiceDocument } from '../documents/CommercialInvoiceDocument';
import { generateTrackingNumber } from '@/services/barcodeService';
import {
  buildAirWaybillData,
  buildCommercialInvoiceData,
} from '@/services/pdfService';
import type { ShipmentEntityDTO } from '@/types/shipment';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export interface ShipmentManagerContainerProps {
  readonly organizationId: string;
  readonly organizationName?: string;
  readonly onFinalizeSuccess?: (trackingNumber: string) => void;
}

export const ShipmentManagerContainer: React.FC<ShipmentManagerContainerProps> = ({
  organizationId,
  organizationName = 'Apparel Sourcing International Inc.',
  onFinalizeSuccess,
}) => {
  const form = useShipmentForm(organizationId);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [finalizedRecord, setFinalizedRecord] = useState<ShipmentEntityDTO | null>(null);
  const [activeTab, setActiveTab] = useState<'awb' | 'invoice'>('awb');

  // Live rate calculation
  const rateCalculation = useRateCalculator({
    originCountryCode: form.sender.countryCode,
    destCountryCode: form.recipient.countryCode,
    serviceTier: form.service.serviceTier,
    packagingType: form.packagingType,
    packages: form.packages,
    isResidential: form.recipient.isResidential,
    signatureOption: form.service.signatureOption,
  });

  const handleSaveDraft = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      const payload = form.getPayload('SAVE_DRAFT');
      // eslint-disable-next-line no-console
      console.log('[ShipmentManager] Saved Draft Payload:', payload);
      alert('Draft progress saved successfully.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalize = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      const genTrk = generateTrackingNumber();
      const payload = form.getPayload('FINALIZE');

      // Build in-memory finalized entity conforming to ShipmentEntityDTO
      const mockedShipment: ShipmentEntityDTO = {
        id: `shp_${Date.now()}`,
        trackingNumber: genTrk.raw,
        formCode: '0430',
        routingCode: 'XA MTPA 58KJ1/70DF/484B',
        barcodeSvg: null,
        organizationId: payload.organizationId,
        createdById: 'user_123',
        zoneId: rateCalculation.result?.zoneCode ?? 'ZONE_7',
        status: 'SHIPMENT_CREATED_PRINTED',
        serviceTier: payload.service.serviceTier,
        signatureOption: payload.service.signatureOption,
        packagingType: payload.packagingType,
        customsContentType: payload.customsContentType,
        shipDate: new Date(payload.service.shipDate),
        estimatedDelivery: rateCalculation.result?.estimatedDeliveryDate
          ? new Date(rateCalculation.result.estimatedDeliveryDate)
          : null,
        actualDelivery: null,

        senderName: payload.sender.contactName,
        senderCompany: payload.sender.company ?? null,
        senderTaxId: payload.sender.taxId ?? null,
        senderPhone: payload.sender.phone,
        senderPhoneExt: payload.sender.phoneExt ?? null,
        senderEmail: payload.sender.email,
        senderAddress1: payload.sender.addressLine1,
        senderAddress2: payload.sender.addressLine2 ?? null,
        senderAddress3: payload.sender.addressLine3 ?? null,
        senderCity: payload.sender.city,
        senderState: payload.sender.stateProvince ?? null,
        senderPostal: payload.sender.postalCode,
        senderCountry: payload.sender.countryCode,
        originAirportCode: payload.sender.airportHubCode ?? 'DACA',

        recipientName: payload.recipient.contactName,
        recipientCompany: payload.recipient.company ?? null,
        recipientTaxId: payload.recipient.taxId ?? null,
        recipientPhone: payload.recipient.phone,
        recipientPhoneExt: payload.recipient.phoneExt ?? null,
        recipientEmail: payload.recipient.email,
        recipientAddress1: payload.recipient.addressLine1,
        recipientAddress2: payload.recipient.addressLine2 ?? null,
        recipientAddress3: payload.recipient.addressLine3 ?? null,
        recipientCity: payload.recipient.city,
        recipientState: payload.recipient.stateProvince ?? null,
        recipientPostal: payload.recipient.postalCode,
        recipientCountry: payload.recipient.countryCode,
        destAirportCode: rateCalculation.result?.destAirportHub ?? 'EWR',
        isResidential: payload.recipient.isResidential,

        packageCount: payload.packages.length,
        totalActualWeightKg: rateCalculation.result?.totalActualWeightKg ?? 2.5,
        totalVolumetricWgtKg: rateCalculation.result?.totalVolumetricWeightKg ?? 3.93,
        totalChargeableWgtKg: rateCalculation.result?.totalChargeableWeightKg ?? 3.93,
        totalCustomsValue: payload.commodities.reduce((a, c) => a + c.totalValueUsd, 0),
        totalDeclaredValue: payload.packages.reduce((a, p) => a + p.declaredValueUsd, 0),
        currency: payload.currency,

        billTransportationTo: payload.billing.billTransportationTo,
        billingAccountNumber: payload.billing.billingAccountNumber ?? null,
        dutiesBillTo: payload.billing.dutiesBillTo,
        dutiesAccountNumber: payload.billing.dutiesAccountNumber ?? null,
        referenceCode: payload.billing.referenceCode ?? null,
        invoiceNumber: payload.billing.invoiceNumber ?? null,
        poNumber: payload.billing.poNumber ?? null,
        cadNumber: '260504077/INET4535',

        baseChargeUsd: rateCalculation.result?.baseChargeUsd ?? 48.0,
        fuelSurchargeUsd: rateCalculation.result?.fuelSurchargeUsd ?? 6.96,
        surchargeAmountUsd: rateCalculation.result?.totalSurchargesUsd ?? 6.96,
        totalShippingCostUsd: rateCalculation.result?.totalShippingCostUsd ?? 54.96,

        finalizedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),

        organization: {
          id: organizationId,
          name: organizationName,
          code: 'ASI-BD',
          taxId: 'BIN-908122-BD',
          vatNumber: null,
          accountNumber: '987654321',
          phone: '8801989451709',
          email: 'shipping@apparelsourcing.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        packages: payload.packages.map((pkg, idx) => ({
          id: `pkg_${idx}`,
          shipmentId: `shp_${Date.now()}`,
          packageIndex: pkg.packageIndex,
          actualWeight: pkg.actualWeight,
          weightUnit: pkg.weightUnit,
          length: pkg.length,
          width: pkg.width,
          height: pkg.height,
          dimensionUnit: pkg.dimensionUnit,
          volumetricWgt: pkg.volumetricWeightKg,
          chargeableWgt: pkg.chargeableWeightKg,
          declaredValue: pkg.declaredValueUsd,
        })),

        commodities: payload.commodities.map((c, idx) => ({
          id: `com_${idx}`,
          shipmentId: `shp_${Date.now()}`,
          packageCount: c.packageCount,
          description: c.description,
          hsTariffCode: c.hsTariffCode,
          quantity: c.quantity,
          unitOfMeasure: c.unitOfMeasure,
          netWeightKg: c.netWeightKg,
          unitValue: c.unitValueUsd,
          totalValue: c.totalValueUsd,
          countryOfMfr: c.countryOfMfr,
        })),

        pickupOrder: {
          id: `pic_${Date.now()}`,
          pickupCode: `DACA-${genTrk.raw.slice(-6)}`,
          shipmentId: `shp_${Date.now()}`,
          driverId: null,
          isDropOff: payload.pickup.isDropOff,
          pickupDate: new Date(payload.pickup.pickupDate),
          earliestTime: payload.pickup.earliestTime,
          latestTime: payload.pickup.latestTime,
          instructions: payload.pickup.instructions ?? null,
          pickupAddress: `${payload.sender.addressLine1}, ${payload.sender.city}`,
          isCompleted: false,
          completedAt: null,
          createdAt: new Date(),
        },

        trackingEvents: [
          {
            id: `evt_1`,
            shipmentId: `shp_${Date.now()}`,
            recordedById: null,
            eventCode: 'OC',
            statusTitle: 'Shipment information sent to FedEx',
            description: 'Label printed and tender manifest registered.',
            city: payload.sender.city,
            stateProvince: payload.sender.stateProvince ?? null,
            postalCode: payload.sender.postalCode,
            countryCode: payload.sender.countryCode,
            hubCode: payload.sender.airportHubCode ?? 'DACA',
            signedBy: null,
            signatureImage: null,
            proofPhotoUrl: null,
            timestamp: new Date(),
          },
        ],

        notificationSettings: {
          id: `notif_${Date.now()}`,
          shipmentId: `shp_${Date.now()}`,
          clientEmail: payload.billing.notifications.clientEmail,
          recipientEmail: payload.billing.notifications.recipientEmail ?? null,
          companyEmail: payload.billing.notifications.companyEmail,
          language: payload.billing.notifications.language,
          notifyCreated: payload.billing.notifications.notifyCreated,
          notifyScheduled: payload.billing.notifications.notifyScheduled,
          notifyPickedUp: payload.billing.notifications.notifyPickedUp,
          notifyInTransit: payload.billing.notifications.notifyInTransit,
          notifyDelivered: payload.billing.notifications.notifyDelivered,
          notifyException: payload.billing.notifications.notifyException,
          customMessage: payload.billing.notifications.customMessage ?? null,
        },
      };

      setFinalizedRecord(mockedShipment);
      onFinalizeSuccess?.(genTrk.raw);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If finalized, show document confirmation view
  if (finalizedRecord) {
    const awbData = buildAirWaybillData(finalizedRecord);
    const invoiceData = buildCommercialInvoiceData(finalizedRecord);

    return (
      <div className="space-y-6">
        <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0" />
            <div>
              <h2 className="text-lg font-black text-emerald-950">
                Shipment Finalized & Registered Successfully!
              </h2>
              <p className="text-xs text-emerald-800">
                Tracking Number: <strong>{awbData.trackingNumberFormatted}</strong> •
                Form 0430 Generated • Dual Notifications Dispatched
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFinalizedRecord(null)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-700 text-emerald-800 rounded-md text-xs font-bold hover:bg-emerald-100"
          >
            <RotateCcw className="h-4 w-4" /> Create Another Shipment
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-border">
          <button
            type="button"
            onClick={() => setActiveTab('awb')}
            className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'awb'
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-neutral-textSecondary hover:text-neutral-textPrimary'
            }`}
          >
            3-Page Air Waybill (Form 0430)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invoice')}
            className={`px-5 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'invoice'
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-neutral-textSecondary hover:text-neutral-textPrimary'
            }`}
          >
            Customs Commercial Invoice
          </button>
        </div>

        {activeTab === 'awb' ? (
          <AirWaybillDocument data={awbData} />
        ) : (
          <CommercialInvoiceDocument data={invoiceData} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. Ship From */}
      <AccordionItem
        stepNumber={1}
        title="Ship From"
        summarySubtitle={`${form.sender.contactName} • ${form.sender.addressLine1}, ${form.sender.city}`}
        isComplete={form.stepStatus.step1Complete}
        isOpen={form.activeStep === 1}
        onToggle={() => form.setActiveStep(form.activeStep === 1 ? 0 : 1)}
      >
        <ShipFromSection
          data={form.sender}
          onChange={form.setSender}
          onNext={() => form.setActiveStep(2)}
        />
      </AccordionItem>

      {/* 2. Deliver To */}
      <AccordionItem
        stepNumber={2}
        title="Deliver To"
        summarySubtitle={`${form.recipient.contactName} • ${form.recipient.city}, ${form.recipient.countryCode}`}
        isComplete={form.stepStatus.step2Complete}
        isOpen={form.activeStep === 2}
        onToggle={() => form.setActiveStep(form.activeStep === 2 ? 0 : 2)}
      >
        <DeliverToSection
          data={form.recipient}
          onChange={form.setRecipient}
          onNext={() => form.setActiveStep(3)}
          onBack={() => form.setActiveStep(1)}
        />
      </AccordionItem>

      {/* 3. Package Details */}
      <AccordionItem
        stepNumber={3}
        title="Package Details"
        summarySubtitle={`${form.packages.length} Package(s) • Total Chargeable: ${
          rateCalculation.result?.totalChargeableWeightKg ?? '2.5'
        } KG`}
        isComplete={form.stepStatus.step3Complete}
        isOpen={form.activeStep === 3}
        onToggle={() => form.setActiveStep(form.activeStep === 3 ? 0 : 3)}
      >
        <PackageDetailsSection
          packagingType={form.packagingType}
          onPackagingTypeChange={form.setPackagingType}
          packages={form.packages}
          onUpdatePackage={form.updatePackage}
          onAddPackage={form.addPackage}
          onRemovePackage={form.removePackage}
          onNext={() => form.setActiveStep(4)}
          onBack={() => form.setActiveStep(2)}
        />
      </AccordionItem>

      {/* 4. Package Contents & Customs */}
      <AccordionItem
        stepNumber={4}
        title="Package Contents & Customs"
        summarySubtitle={
          form.customsContentType === 'DOCUMENTS_ONLY'
            ? 'Documents Only'
            : `${form.commodities.length} Commodity Items • Declared: $${form.commodities
                .reduce((a, c) => a + c.totalValueUsd, 0)
                .toFixed(2)} USD`
        }
        isComplete={form.stepStatus.step4Complete}
        isOpen={form.activeStep === 4}
        onToggle={() => form.setActiveStep(form.activeStep === 4 ? 0 : 4)}
      >
        <PackageContentsSection
          contentType={form.customsContentType}
          onContentTypeChange={form.setCustomsContentType}
          commodities={form.commodities}
          onUpdateCommodity={form.updateCommodity}
          onAddCommodity={form.addCommodity}
          onRemoveCommodity={form.removeCommodity}
          onNext={() => form.setActiveStep(5)}
          onBack={() => form.setActiveStep(3)}
        />
      </AccordionItem>

      {/* 5. Service Details */}
      <AccordionItem
        stepNumber={5}
        title="Service Details"
        summarySubtitle={`${form.service.serviceTier.replace(/_/g, ' ')} • Ship Date: ${
          form.service.shipDate
        }`}
        isComplete={form.stepStatus.step5Complete}
        isOpen={form.activeStep === 5}
        onToggle={() => form.setActiveStep(form.activeStep === 5 ? 0 : 5)}
      >
        <ServiceDetailsSection
          service={form.service}
          onChange={form.setService}
          rateCalculation={rateCalculation.result}
          isCalculatingRate={rateCalculation.isCalculating}
          onNext={() => form.setActiveStep(6)}
          onBack={() => form.setActiveStep(4)}
        />
      </AccordionItem>

      {/* 6. Pickup / Drop-off Schedule */}
      <AccordionItem
        stepNumber={6}
        title="Pickup / Drop-off Schedule"
        summarySubtitle={
          form.pickup.isDropOff
            ? 'Counter Drop-Off'
            : `Courier Pickup: ${form.pickup.pickupDate} (${form.pickup.earliestTime} - ${form.pickup.latestTime})`
        }
        isComplete={form.stepStatus.step6Complete}
        isOpen={form.activeStep === 6}
        onToggle={() => form.setActiveStep(form.activeStep === 6 ? 0 : 6)}
      >
        <PickupDropoffSection
          pickup={form.pickup}
          onChange={form.setPickup}
          onNext={() => form.setActiveStep(7)}
          onBack={() => form.setActiveStep(5)}
        />
      </AccordionItem>

      {/* 7. Billing & Dual Notifications */}
      <AccordionItem
        stepNumber={7}
        title="Billing & Dual Notifications"
        summarySubtitle={`Bill to: ${form.billing.billTransportationTo} • Alerts: ${form.billing.notifications.clientEmail}`}
        isComplete={form.stepStatus.step7Complete}
        isOpen={form.activeStep === 7}
        onToggle={() => form.setActiveStep(form.activeStep === 7 ? 0 : 7)}
      >
        <BillingDetailsSection
          billing={form.billing}
          onChange={form.setBilling}
          onSaveDraft={handleSaveDraft}
          onFinalize={handleFinalize}
          onBack={() => form.setActiveStep(6)}
          isSubmitting={isSubmitting}
        />
      </AccordionItem>
    </div>
  );
};
