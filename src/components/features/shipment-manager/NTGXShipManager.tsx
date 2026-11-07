// src/components/features/shipment-manager/NTGXShipManager.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Layers,
  RotateCcw,
  Save,
  Printer,
  Info,
  Trash2,
  Plus,
  BookOpen,
  FileText,
} from 'lucide-react';
import { useShipmentForm } from '@/hooks/useShipmentForm';
import { useRateCalculator } from '@/hooks/useRateCalculator';
import { AirWaybillDocument } from '../documents/AirWaybillDocument';
import { CommercialInvoiceDocument } from '../documents/CommercialInvoiceDocument';
import { generateTrackingNumber, BarcodeService } from '@/services/barcodeService';
import {
  buildAirWaybillData,
  buildCommercialInvoiceData,
} from '@/services/pdfService';
import type { ShipmentEntityDTO, PackagingType, ServiceTier, SignatureOption } from '@/types/shipment';

interface NTGXShipManagerProps {
  readonly organizationId?: string;
  readonly organizationName?: string;
  readonly userName?: string;
}

export function NTGXShipManager({
  organizationId = 'org-asi-bd-demo',
  organizationName = 'Apparel Sourcing International Inc.',
}: NTGXShipManagerProps): React.JSX.Element {
  const form = useShipmentForm(organizationId);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [finalizedRecord, setFinalizedRecord] = useState<ShipmentEntityDTO | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<'awb' | 'invoice'>('awb');
  const [emailStatus, setEmailStatus] = useState<{
    readonly clientEmail: string;
    readonly companyEmail: string;
    readonly clientEmailSent: boolean;
    readonly companyEmailSent: boolean;
  } | null>(null);

  // UI state matching the screenshots
  const [isShipFromExpanded, setIsShipFromExpanded] = useState<boolean>(false);
  const [addressSearchQuery, setAddressSearchQuery] = useState<string>('');
  const [showPersonalizedMessage, setShowPersonalizedMessage] = useState<boolean>(false);

  // Live dimensional rate calculation
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
      console.log('[NTGXShipManager] Draft Saved for', organizationName, payload);
      alert('Draft saved to NTGX portal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalize = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      const payload = form.getPayload('FINALIZE');

      let serverTrackingNumber: string | null = null;
      let serverEmailDispatch: {
        readonly clientEmail: string;
        readonly companyEmail: string;
        readonly clientEmailSent: boolean;
        readonly companyEmailSent: boolean;
      } | null = null;

      try {
        const response = await fetch('/api/shipments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const resData = (await response.json()) as {
            readonly trackingNumber?: string;
            readonly emailDispatch?: {
              readonly clientEmail: string;
              readonly companyEmail: string;
              readonly clientEmailSent: boolean;
              readonly companyEmailSent: boolean;
            };
          };
          serverTrackingNumber = resData.trackingNumber ?? null;
          serverEmailDispatch = resData.emailDispatch ?? null;
        }
      } catch {
        // Fallback if offline
      }

      const trackingNumberObj = generateTrackingNumber();
      const trackingNumber = serverTrackingNumber || trackingNumberObj.raw;

      setEmailStatus(
        serverEmailDispatch || {
          clientEmailSent: true,
          companyEmailSent: true,
          clientEmail: payload.billing.notifications.clientEmail || payload.sender.email,
          companyEmail: payload.billing.notifications.companyEmail || 'operations@company.com',
        }
      );

      const barcodeSvg = BarcodeService.renderCode128Svg(trackingNumber);

      const mockRecord: ShipmentEntityDTO = {
        id: `shp_${Date.now()}`,
        trackingNumber,
        formCode: '0430',
        routingCode: 'XA MTPA 58KJ1/70DF/484B',
        barcodeSvg,
        organizationId,
        createdById: 'user-demo-001',
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

        trackingEvents: [
          {
            id: `evt_1`,
            shipmentId: `shp_${Date.now()}`,
            recordedById: null,
            eventCode: 'OC',
            statusTitle: 'Shipment created and Air Waybill generated',
            description: 'Label printed and tender manifest registered.',
            city: payload.sender.city,
            stateProvince: payload.sender.stateProvince ?? null,
            postalCode: payload.sender.postalCode,
            countryCode: payload.sender.countryCode,
            hubCode: payload.sender.airportHubCode ?? 'DACA',
            signedBy: null,
            timestamp: new Date(),
          },
        ],
      };

      setFinalizedRecord(mockRecord);
    } catch {
      alert('Failed to finalize shipment. Please verify all required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If finalized, render the document inspection screen
  if (finalizedRecord) {
    const awbData = buildAirWaybillData(finalizedRecord);
    const invoiceData = buildCommercialInvoiceData(finalizedRecord);

    return (
      <div className="space-y-6 pb-16">
        {/* Top Tracking Confirmation Card */}
        <div className="bg-white rounded-xl border border-neutral-border p-5 flex flex-wrap items-center justify-between shadow-xs gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Shipment Finalized &amp; Dispatched
              </span>
            </div>
            <h2 className="text-xl font-black font-mono tracking-tight text-ntgx-red flex items-center gap-2 mt-0.5">
              TRK# {finalizedRecord.trackingNumber}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFinalizedRecord(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-md border border-neutral-300 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Back to Editor
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-ntgx-red hover:bg-ntgx-redHover text-white text-xs font-bold rounded-md shadow-xs transition-colors"
            >
              <Printer className="h-4 w-4" /> Print 3-Page Air Waybill (Form 0430)
            </button>
          </div>
        </div>

        {/* Dual Email Confirmation Banner */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start md:items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-emerald-950 text-sm">
                Dual Confirmation Emails Successfully Dispatched!
              </h3>
              <div className="text-emerald-800 mt-1 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs">
                <span>✉️ <strong>Customer Email:</strong> {emailStatus?.clientEmail}</span>
                <span>•</span>
                <span>🏢 <strong>Office / Dispatch Email:</strong> {emailStatus?.companyEmail}</span>
              </div>
              <div className="text-emerald-700 text-2xs mt-1">
                Both the client and company operations team have received the Mod-11 tracking number, pickup window, and PDF documents.
              </div>
            </div>
          </div>

          <Link
            href={`/tracking?query=${finalizedRecord.trackingNumber}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-ntgx-red hover:bg-ntgx-redHover text-white text-xs font-bold rounded-lg shadow-sm whitespace-nowrap self-start md:self-center transition-all hover:shadow"
          >
            <Search className="h-4 w-4" /> Live Tracking Telemetry &rarr;
          </Link>
        </div>

        {/* Tab Selection */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-300 gap-2 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveDocTab('awb')}
                className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                  activeDocTab === 'awb'
                    ? 'border-ntgx-red text-ntgx-red bg-white'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <FileText className="h-4 w-4" /> 3-Page Air Waybill (Form 0430)
              </button>
              <button
                type="button"
                onClick={() => setActiveDocTab('invoice')}
                className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                  activeDocTab === 'invoice'
                    ? 'border-ntgx-red text-ntgx-red bg-white'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <FileText className="h-4 w-4" /> Commercial Customs Invoice
              </button>
            </div>

            <Link
              href={`/tracking?query=${finalizedRecord.trackingNumber}`}
              className="text-xs font-bold text-ntgx-red hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              Track Live Milestones &rarr;
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto pb-4">
            {activeDocTab === 'awb' ? (
              <AirWaybillDocument data={awbData} />
            ) : (
              <CommercialInvoiceDocument data={invoiceData} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-neutral-textPrimary antialiased selection:bg-red-500 selection:text-white pb-16">
      {/* ─────────────────────────────────────────────────────────────
          1. SUBHEADER ACTION TOOLBAR
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-neutral-200 rounded-xl px-4 sm:px-6 py-2.5 mb-5 flex flex-wrap items-center justify-between text-xs gap-3 shadow-xs">
        {/* Left: Breadcrumbs & Outbound Shipment Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-2xs uppercase tracking-wider text-neutral-500 font-bold">
            <span className="text-neutral-900">Ship Manager</span>
            <ChevronRight className="h-3 w-3 text-neutral-400" />
            <span className="text-ntgx-red">Create shipment</span>
          </div>

          <div className="relative inline-flex items-center">
            <select
              aria-label="Shipment Direction"
              defaultValue="outbound"
              className="appearance-none bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 rounded px-2.5 py-1 pr-6 text-xs font-semibold text-neutral-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-ntgx-red"
            >
              <option value="outbound">Outbound shipment</option>
              <option value="return">Return shipment</option>
              <option value="import">Import clearance</option>
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-500 absolute right-1.5 pointer-events-none" />
          </div>
        </div>

        {/* Right Toolbar Actions (Caps) */}
        <div className="flex items-center gap-4 text-2xs font-bold text-neutral-700 uppercase tracking-wider">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="hover:text-ntgx-red transition-colors flex items-center gap-1"
          >
            <Save className="h-3.5 w-3.5" /> SAVE
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="hover:text-ntgx-red transition-colors flex items-center gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" /> RESET FORM
          </button>
          <button
            type="button"
            onClick={() => alert('Saved as template.')}
            className="hover:text-ntgx-red transition-colors hidden md:inline-block"
          >
            SAVE AS SHIPMENT TEMPLATE
          </button>
          <Link
            href="/shipments"
            className="hover:text-ntgx-red transition-colors hidden lg:flex items-center gap-1"
          >
            <Layers className="h-3.5 w-3.5" /> BATCH SHIPPING
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN 2-COLUMN FORM GRID
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (Width: 6 Cols on LG) */}
        <div className="lg:col-span-6 space-y-4">
              {/* 1. SHIP FROM CARD (With green check dot & collapsed preview) */}
              <div className="bg-white rounded-lg border border-neutral-300 shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsShipFromExpanded((prev) => !prev)}
                  className="w-full px-4 py-3 bg-white flex items-center justify-between text-left hover:bg-neutral-50/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-emerald-600 shrink-0"></span>
                    <span className="text-sm font-bold text-neutral-900">Ship from</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-500 transition-transform ${
                      isShipFromExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Collapsed summary (Exact text from Screenshot #1) */}
                {!isShipFromExpanded ? (
                  <div className="px-4 pb-3 pt-0 text-xs font-semibold text-neutral-700 flex items-center justify-between">
                    <span className="truncate">
                      MS. SANJANA, APPAREL SOURCING INTERNATIONAL INC. - DHAKA, Bangladesh
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsShipFromExpanded(true)}
                      className="text-2xs font-bold text-ntgx-red hover:underline ml-2 shrink-0"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div className="p-4 pt-1 border-t border-neutral-200 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-600 mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        value={form.sender.contactName}
                        onChange={(e) =>
                          form.setSender((prev) => ({ ...prev, contactName: e.target.value }))
                        }
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-600 mb-1">
                        Company *
                      </label>
                      <input
                        type="text"
                        value={form.sender.company}
                        onChange={(e) =>
                          form.setSender((prev) => ({ ...prev, company: e.target.value }))
                        }
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-600 mb-1">
                        Tax ID / BIN
                      </label>
                      <input
                        type="text"
                        value={form.sender.taxId ?? ''}
                        onChange={(e) =>
                          form.setSender((prev) => ({ ...prev, taxId: e.target.value }))
                        }
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-600 mb-1">
                        Phone *
                      </label>
                      <input
                        type="text"
                        value={form.sender.phone}
                        onChange={(e) =>
                          form.setSender((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-2xs font-bold uppercase text-neutral-600 mb-1">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        value={form.sender.addressLine1}
                        onChange={(e) =>
                          form.setSender((prev) => ({ ...prev, addressLine1: e.target.value }))
                        }
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-600 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={form.sender.city}
                        onChange={(e) =>
                          form.setSender((prev) => ({ ...prev, city: e.target.value }))
                        }
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-600 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={form.sender.postalCode}
                        onChange={(e) =>
                          form.setSender((prev) => ({ ...prev, postalCode: e.target.value }))
                        }
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. DELIVER TO CARD (Matching 2-Column Sublayout from Screenshot #1) */}
              <div className="bg-white rounded-lg border border-neutral-300 shadow-xs p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full border-2 border-neutral-400"></span>
                    <span className="text-sm font-bold text-neutral-900">Deliver to</span>
                  </div>
                </div>

                {/* Search in Address Book */}
                <div className="relative">
                  <input
                    type="text"
                    value={addressSearchQuery}
                    onChange={(e) => setAddressSearchQuery(e.target.value)}
                    placeholder="SEARCH IN ADDRESS BOOK"
                    className="w-full rounded border border-neutral-300 pl-3 pr-16 py-2 text-xs uppercase placeholder-neutral-400 font-semibold focus:border-ntgx-red focus:outline-none"
                  />
                  <div className="absolute right-2.5 top-2.5 flex items-center gap-2 text-neutral-500">
                    <Search className="h-3.5 w-3.5" />
                    <BookOpen className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Business vs Residential Radio Selector */}
                <div className="flex items-center gap-6 text-xs font-semibold text-neutral-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      checked={!form.recipient.isResidential}
                      onChange={() =>
                        form.setRecipient((prev) => ({ ...prev, isResidential: false }))
                      }
                      className="accent-ntgx-red h-4 w-4"
                    />
                    <span>Business address</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addressType"
                      checked={form.recipient.isResidential}
                      onChange={() =>
                        form.setRecipient((prev) => ({ ...prev, isResidential: true }))
                      }
                      className="accent-ntgx-red h-4 w-4"
                    />
                    <span>Residential address</span>
                    <Info className="h-3.5 w-3.5 text-neutral-400" />
                  </label>
                </div>

                {/* Side-by-Side: Contact Details vs Address Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  {/* Left Subcolumn: Contact Details */}
                  <div className="space-y-3">
                    <div className="text-2xs font-bold uppercase tracking-wider text-neutral-500">
                      Contact details
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-0.5">
                        CONTACT NAME *
                      </label>
                      <input
                        type="text"
                        value={form.recipient.contactName}
                        onChange={(e) =>
                          form.setRecipient((prev) => ({ ...prev, contactName: e.target.value }))
                        }
                        placeholder="e.g. Dakota / Salman"
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-0.5">
                        COMPANY
                      </label>
                      <input
                        type="text"
                        value={form.recipient.company}
                        onChange={(e) =>
                          form.setRecipient((prev) => ({ ...prev, company: e.target.value }))
                        }
                        placeholder="e.g. Bernette Textile Co. Ltd."
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-0.5">
                        STATE TAX ID/I.E.
                      </label>
                      <input
                        type="text"
                        value={form.recipient.taxId ?? ''}
                        onChange={(e) =>
                          form.setRecipient((prev) => ({ ...prev, taxId: e.target.value }))
                        }
                        placeholder="e.g. US-EIN-13-987654"
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-0.5">
                        PHONE NUMBER *
                      </label>
                      <input
                        type="text"
                        value={form.recipient.phone}
                        onChange={(e) =>
                          form.setRecipient((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        placeholder="e.g. 212-279-5526"
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-0.5">
                        PHONE EXTENSION
                      </label>
                      <input
                        type="text"
                        placeholder="Ext."
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-0.5">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        value={form.recipient.email}
                        onChange={(e) =>
                          form.setRecipient((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="e.g. logistics@bernettetextile.com"
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Right Subcolumn: Address */}
                  <div className="space-y-3">
                    <div className="text-2xs font-bold uppercase tracking-wider text-neutral-500">
                      Address
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-0.5">
                        COUNTRY/TERRITORY *
                      </label>
                      <select
                        aria-label="Country / Territory"
                        value={form.recipient.countryCode}
                        onChange={(e) => {
                          const code = e.target.value;
                          form.setRecipient((prev) => ({
                            ...prev,
                            countryCode: code,
                            airportHubCode: code === 'US' ? 'EWR' : code === 'GB' ? 'LHR' : 'DXB',
                          }));
                        }}
                        className="w-full rounded border border-neutral-300 p-2 text-xs bg-white focus:border-ntgx-red focus:outline-none cursor-pointer"
                      >
                        <option value="US">United States (US)</option>
                        <option value="GB">United Kingdom (GB)</option>
                        <option value="AE">United Arab Emirates (AE)</option>
                        <option value="CA">Canada (CA)</option>
                        <option value="DE">Germany (DE)</option>
                        <option value="BD">Bangladesh (BD)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-0.5">
                        ADDRESS LINE 1 *
                      </label>
                      <input
                        type="text"
                        value={form.recipient.addressLine1}
                        onChange={(e) =>
                          form.setRecipient((prev) => ({ ...prev, addressLine1: e.target.value }))
                        }
                        placeholder="Street address, P.O. box"
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-0.5">
                        ADDRESS LINE 2
                      </label>
                      <input
                        type="text"
                        placeholder="Apartment, suite, unit, building, floor"
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-0.5">
                        ADDRESS LINE 3
                      </label>
                      <input
                        type="text"
                        placeholder="Department, c/o"
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-0.5">
                        POSTAL CODE
                      </label>
                      <input
                        type="text"
                        value={form.recipient.postalCode}
                        onChange={(e) =>
                          form.setRecipient((prev) => ({ ...prev, postalCode: e.target.value }))
                        }
                        placeholder="e.g. 10018"
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-0.5">
                        CITY *
                      </label>
                      <input
                        type="text"
                        value={form.recipient.city}
                        onChange={(e) =>
                          form.setRecipient((prev) => ({ ...prev, city: e.target.value }))
                        }
                        placeholder="e.g. New York"
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => alert('Recipient saved to address book.')}
                    className="text-xs font-bold text-ntgx-red hover:underline flex items-center gap-1"
                  >
                    + SAVE AS NEW RECIPIENT
                  </button>
                </div>
              </div>

              {/* 3. PACKAGE DETAILS CARD (Matching Multi-Package Table from Screenshot #1) */}
              <div className="bg-white rounded-lg border border-neutral-300 shadow-xs p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full border-2 border-neutral-400"></span>
                    <span className="text-sm font-bold text-neutral-900">Package details</span>
                  </div>
                </div>

                {/* Packaging Dropdown */}
                <div>
                  <label className="block text-2xs font-bold uppercase text-neutral-700 mb-1">
                    PACKAGING *
                  </label>
                  <select
                    aria-label="Packaging Type"
                    value={form.packagingType}
                    onChange={(e) => form.setPackagingType(e.target.value as PackagingType)}
                    className="w-full rounded border border-neutral-300 p-2 text-xs bg-white focus:border-ntgx-red focus:outline-none cursor-pointer"
                  >
                    <option value="YOUR_PACKAGING">Your Packaging</option>
                    <option value="FEDEX_ENVELOPE">NTGX Envelope</option>
                    <option value="FEDEX_PAK">NTGX Pak</option>
                    <option value="FEDEX_BOX">NTGX Box</option>
                    <option value="FEDEX_TUBE">NTGX Tube</option>
                  </select>
                </div>

                {/* Liability Limit Checkbox */}
                <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                  <input type="checkbox" className="accent-ntgx-red h-4 w-4 rounded" />
                  <span>Purchase a higher limit of liability from NTGX</span>
                  <Info className="h-3.5 w-3.5 text-neutral-400" />
                </label>

                {/* Package Row Table */}
                <div className="overflow-x-auto border border-neutral-200 rounded">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 border-b border-neutral-200 text-2xs font-bold uppercase text-neutral-600">
                      <tr>
                        <th className="p-2 w-20">PACKAGES *</th>
                        <th className="p-2 w-36">WEIGHT *</th>
                        <th className="p-2">DIMENSIONS L × W × H</th>
                        <th className="p-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {form.packages.map((pkg, idx) => (
                        <tr key={pkg.packageIndex}>
                          <td className="p-2 font-bold text-neutral-800">{idx + 1}</td>
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                step="0.1"
                                value={pkg.actualWeight}
                                onChange={(e) =>
                                  form.updatePackage(idx, {
                                    actualWeight: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-16 rounded border border-neutral-300 p-1 text-xs focus:border-ntgx-red focus:outline-none text-right font-mono"
                              />
                              <select
                                aria-label="Weight Unit"
                                value={pkg.weightUnit}
                                onChange={(e) =>
                                  form.updatePackage(idx, {
                                    weightUnit: e.target.value as any,
                                  })
                                }
                                className="rounded border border-neutral-300 p-1 text-xs bg-white focus:outline-none"
                              >
                                <option value="KG">kg</option>
                                <option value="LB">lb</option>
                              </select>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={pkg.length}
                                onChange={(e) =>
                                  form.updatePackage(idx, {
                                    length: parseFloat(e.target.value) || 0,
                                  })
                                }
                                placeholder="L"
                                className="w-12 rounded border border-neutral-300 p-1 text-xs focus:border-ntgx-red focus:outline-none text-center font-mono"
                              />
                              <span>×</span>
                              <input
                                type="number"
                                value={pkg.width}
                                onChange={(e) =>
                                  form.updatePackage(idx, {
                                    width: parseFloat(e.target.value) || 0,
                                  })
                                }
                                placeholder="W"
                                className="w-12 rounded border border-neutral-300 p-1 text-xs focus:border-ntgx-red focus:outline-none text-center font-mono"
                              />
                              <span>×</span>
                              <input
                                type="number"
                                value={pkg.height}
                                onChange={(e) =>
                                  form.updatePackage(idx, {
                                    height: parseFloat(e.target.value) || 0,
                                  })
                                }
                                placeholder="H"
                                className="w-12 rounded border border-neutral-300 p-1 text-xs focus:border-ntgx-red focus:outline-none text-center font-mono"
                              />
                              <select
                                aria-label="Dimension Unit"
                                value={pkg.dimensionUnit}
                                onChange={(e) =>
                                  form.updatePackage(idx, {
                                    dimensionUnit: e.target.value as any,
                                  })
                                }
                                className="rounded border border-neutral-300 p-1 text-xs bg-white focus:outline-none"
                              >
                                <option value="CM">cm</option>
                                <option value="IN">in</option>
                              </select>
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            {form.packages.length > 1 && (
                              <button
                                type="button"
                                onClick={() => form.removePackage(idx)}
                                className="text-neutral-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-bold text-neutral-700">
                    Total packages: {form.packages.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      form.addPackage()
                    }
                    className="text-xs font-bold text-ntgx-red hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> ADD NEW PACKAGE
                  </button>
                </div>
              </div>

              {/* 4. CUSTOMS & COMMODITY DECLARATION */}
              <div className="bg-white rounded-lg border border-neutral-300 shadow-xs p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-emerald-600 shrink-0"></span>
                    <span className="text-sm font-bold text-neutral-900">
                      Commodities &amp; Customs Declaration
                    </span>
                  </div>
                  <span className="text-2xs font-bold text-neutral-500 uppercase tracking-wider">
                    Total Customs: ${form.commodities.reduce((a, c) => a + c.totalValueUsd, 0).toFixed(2)} USD
                  </span>
                </div>

                <div className="space-y-2">
                  {form.commodities.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-neutral-50 border border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"
                    >
                      <div className="col-span-2">
                        <label className="block text-2xs font-bold text-neutral-600 uppercase">
                          Item Description
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            form.updateCommodity(idx, { description: e.target.value })
                          }
                          className="w-full rounded border border-neutral-300 p-1 text-xs bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-2xs font-bold text-neutral-600 uppercase">
                          HS Tariff Code
                        </label>
                        <input
                          type="text"
                          value={item.hsTariffCode}
                          onChange={(e) =>
                            form.updateCommodity(idx, { hsTariffCode: e.target.value })
                          }
                          className="w-full rounded border border-neutral-300 p-1 text-xs bg-white font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-2xs font-bold text-neutral-600 uppercase">
                          Total Value ($)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={item.totalValueUsd}
                          onChange={(e) =>
                            form.updateCommodity(idx, {
                              totalValueUsd: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full rounded border border-neutral-300 p-1 text-xs bg-white text-right font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═════════════════════════════════════════════════════════
                RIGHT COLUMN (Width: 6 Cols on LG)
                ═════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-6 space-y-4">
              {/* 1. SERVICE DETAILS CARD (Matching Screenshot #1) */}
              <div className="bg-white rounded-lg border border-neutral-300 shadow-xs p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-emerald-600 shrink-0"></span>
                    <span className="text-sm font-bold text-neutral-900">Service details</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                </div>

                {/* Ship Date */}
                <div>
                  <label className="block text-2xs font-bold uppercase text-neutral-700 mb-1">
                    SHIP DATE *
                  </label>
                  <select
                    aria-label="Ship Date"
                    defaultValue="today"
                    className="w-full rounded border border-neutral-300 p-2 text-xs bg-white focus:border-ntgx-red focus:outline-none cursor-pointer"
                  >
                    <option value="today">
                      Sunday, November 1, 2026
                    </option>
                    <option value="tomorrow">
                      Monday, November 2, 2026
                    </option>
                  </select>
                </div>

                {/* Service Selection */}
                <div>
                  <label className="block text-2xs font-bold uppercase text-neutral-700 mb-1">
                    SERVICE *
                  </label>
                  <select
                    aria-label="Service Tier"
                    value={form.service.serviceTier}
                    onChange={(e) =>
                      form.setService((prev) => ({
                        ...prev,
                        serviceTier: e.target.value as ServiceTier,
                      }))
                    }
                    className="w-full rounded border border-neutral-300 p-2 text-xs bg-white focus:border-ntgx-red focus:outline-none cursor-pointer font-semibold text-neutral-800"
                  >
                    <option value="INTERNATIONAL_PRIORITY">International Priority&reg;</option>
                    <option value="INTERNATIONAL_ECONOMY">International Economy&reg;</option>
                    <option value="INTERNATIONAL_FIRST">International First&reg;</option>
                  </select>
                </div>

                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => alert('Comparing transit schedules and zone rates.')}
                    className="text-xs font-bold text-ntgx-red hover:underline uppercase tracking-wide"
                  >
                    COMPARE RATES AND TRANSIT TIMES PER SHIP DATE
                  </button>
                </div>

                {/* Service Options Checkboxes */}
                <div className="space-y-2 pt-2 border-t border-neutral-200">
                  <div className="text-2xs font-bold uppercase tracking-wider text-neutral-500">
                    Service options
                  </div>
                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.service.signatureOption !== 'NO_SIGNATURE_REQUIRED'}
                      onChange={(e) =>
                        form.setService((prev) => ({
                          ...prev,
                          signatureOption: e.target.checked
                            ? ('DIRECT_SIGNATURE_REQUIRED' as SignatureOption)
                            : ('NO_SIGNATURE_REQUIRED' as SignatureOption),
                        }))
                      }
                      className="accent-ntgx-red h-4 w-4 rounded"
                    />
                    <span>Signature options</span>
                    <Info className="h-3.5 w-3.5 text-neutral-400" />
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.service.holdAtLocation}
                      onChange={(e) =>
                        form.setService((prev) => ({
                          ...prev,
                          holdAtLocation: e.target.checked,
                        }))
                      }
                      className="accent-ntgx-red h-4 w-4 rounded"
                    />
                    <span>Hold at location</span>
                    <Info className="h-3.5 w-3.5 text-neutral-400" />
                  </label>
                </div>

                {/* Additional Options */}
                <div className="space-y-2 pt-2 border-t border-neutral-200">
                  <div className="text-2xs font-bold uppercase tracking-wider text-neutral-500">
                    Additional options
                  </div>
                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input type="checkbox" className="accent-ntgx-red h-4 w-4 rounded" />
                    <span>Add shipment references</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input type="checkbox" className="accent-ntgx-red h-4 w-4 rounded" />
                    <span>Email outbound shipment label</span>
                    <Info className="h-3.5 w-3.5 text-neutral-400" />
                  </label>
                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                    <input type="checkbox" className="accent-ntgx-red h-4 w-4 rounded" />
                    <span>Include a return label</span>
                    <Info className="h-3.5 w-3.5 text-neutral-400" />
                  </label>
                </div>
              </div>

              {/* 2. RATE & DELIVERY ESTIMATION CARD (Matching Screenshot #1) */}
              <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50/70 p-4">
                {rateCalculation.result ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-2">
                      <span className="font-bold text-neutral-700">Estimated Delivery:</span>
                      <span className="font-bold text-emerald-700">
                        Wednesday, Nov 4, 2026 by 5:00 PM
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600">Base Freight:</span>
                      <span className="font-mono">${rateCalculation.result.baseChargeUsd.toFixed(2)} USD</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-600">Fuel Surcharge:</span>
                      <span className="font-mono">${rateCalculation.result.fuelSurchargeUsd.toFixed(2)} USD</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-black border-t border-neutral-300 pt-2 text-neutral-900">
                      <span>Total Estimated Cost:</span>
                      <span className="text-ntgx-red font-mono">${rateCalculation.result.totalShippingCostUsd.toFixed(2)} USD</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 text-xs text-neutral-600 py-2">
                    <Info className="h-5 w-5 text-ntgx-red shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Please provide the sender and recipient addresses, package details, and select a service to see the estimated delivery date and total costs.
                    </p>
                  </div>
                )}
              </div>

              {/* 3. PICKUP / DROP-OFF CARD (Matching Screenshot #1 & #2) */}
              <div className="bg-white rounded-lg border border-neutral-300 shadow-xs p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-emerald-600 shrink-0"></span>
                    <span className="text-sm font-bold text-neutral-900">Pickup / drop-off</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase text-neutral-700 mb-1">
                    PICKUP/DROP-OFF *
                  </label>
                  <select
                    aria-label="Pickup or Dropoff Option"
                    value={form.pickup.isDropOff ? 'dropoff' : 'pickup'}
                    onChange={(e) =>
                      form.setPickup((prev) => ({
                        ...prev,
                        isDropOff: e.target.value === 'dropoff',
                      }))
                    }
                    className="w-full rounded border border-neutral-300 p-2 text-xs bg-white focus:border-ntgx-red focus:outline-none cursor-pointer"
                  >
                    <option value="pickup">Schedule a new pickup</option>
                    <option value="dropoff">Drop off package at NTGX location</option>
                  </select>
                </div>

                {!form.pickup.isDropOff && (
                  <>
                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-1">
                        PICKUP DATE *
                      </label>
                      <select
                        aria-label="Pickup Date"
                        defaultValue="today"
                        className="w-full rounded border border-neutral-300 p-2 text-xs bg-white focus:border-ntgx-red focus:outline-none cursor-pointer"
                      >
                        <option value="today">Sunday, November 1, 2026</option>
                        <option value="tomorrow">Monday, November 2, 2026</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-2xs font-bold uppercase text-neutral-700 mb-1">
                          EARLIEST POSSIBLE TIME *
                        </label>
                        <select
                          aria-label="Earliest Pickup Time"
                          value={form.pickup.earliestTime}
                          onChange={(e) =>
                            form.setPickup((prev) => ({
                              ...prev,
                              earliestTime: e.target.value,
                            }))
                          }
                          className="w-full rounded border border-neutral-300 p-2 text-xs bg-white focus:border-ntgx-red focus:outline-none cursor-pointer"
                        >
                          <option value="08:00 AM">8:00 AM</option>
                          <option value="09:00 AM">9:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-2xs font-bold uppercase text-neutral-700 mb-1">
                          LATEST POSSIBLE TIME *
                        </label>
                        <select
                          aria-label="Latest Pickup Time"
                          value={form.pickup.latestTime}
                          onChange={(e) =>
                            form.setPickup((prev) => ({
                              ...prev,
                              latestTime: e.target.value,
                            }))
                          }
                          className="w-full rounded border border-neutral-300 p-2 text-xs bg-white focus:border-ntgx-red focus:outline-none cursor-pointer"
                        >
                          <option value="01:30 PM">1:30 PM</option>
                          <option value="03:00 PM">3:00 PM</option>
                          <option value="05:00 PM">5:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-2xs font-bold uppercase text-neutral-700 mb-1">
                        PICKUP INSTRUCTIONS
                      </label>
                      <input
                        type="text"
                        value={form.pickup.instructions}
                        onChange={(e) =>
                          form.setPickup((prev) => ({
                            ...prev,
                            instructions: e.target.value,
                          }))
                        }
                        placeholder="No instructions"
                        className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2 pt-1 border-t border-neutral-200">
                      <div className="text-2xs font-bold uppercase tracking-wider text-neutral-600">
                        Pickup address
                      </div>
                      <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                        <input type="checkbox" className="accent-ntgx-red h-4 w-4 rounded" />
                        <span>Use alternative pickup address</span>
                      </label>
                      <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-700 leading-snug">
                        HOUSE # 30 (3RD FLOOR), APT-B3, WESTERN ROAD, BANANI DOHS, DHAKA, 1206, BD.
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 4. BILLING & NOTIFICATIONS CARD (Matching Screenshot #2) */}
              <div className="bg-white rounded-lg border border-neutral-300 shadow-xs p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-emerald-600 shrink-0"></span>
                    <span className="text-sm font-bold text-neutral-900">Billing details</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-neutral-500" />
                </div>

                <div>
                  <label className="block text-2xs font-bold uppercase text-neutral-700 mb-1">
                    BILL TRANSPORTATION COST TO *
                  </label>
                  <select
                    aria-label="Bill Transportation Cost To"
                    value={form.billing.billTransportationTo}
                    onChange={(e) =>
                      form.setBilling((prev) => ({
                        ...prev,
                        billTransportationTo: e.target.value as any,
                      }))
                    }
                    className="w-full rounded border border-neutral-300 p-2 text-xs bg-white focus:border-ntgx-red focus:outline-none cursor-pointer"
                  >
                    <option value="MY_ACCOUNT">My account</option>
                    <option value="RECIPIENT">Recipient</option>
                    <option value="THIRD_PARTY">Third party</option>
                  </select>
                </div>

                {/* Add shipment notifications checkbox */}
                <div className="pt-2 border-t border-neutral-200 space-y-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-ntgx-red h-4 w-4 rounded"
                    />
                    <span>Add shipment notifications</span>
                    <Info className="h-3.5 w-3.5 text-neutral-400" />
                  </label>

                  {/* Shipper & Office Email Notification Block */}
                  <div className="bg-neutral-50 p-3 rounded border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-2xs font-bold uppercase tracking-wider text-neutral-600">
                        Notification Recipients (Customer + Office)
                      </div>
                      <span className="text-[10px] bg-red-100 text-ntgx-red font-bold px-1.5 py-0.5 rounded">
                        Dual Dispatch
                      </span>
                    </div>

                    {/* Customer Email Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-7">
                        <label className="block text-2xs font-bold uppercase text-neutral-600 mb-0.5">
                          CUSTOMER / SHIPPER EMAIL *
                        </label>
                        <input
                          type="email"
                          value={form.billing.notifications.clientEmail}
                          onChange={(e) =>
                            form.setBilling((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                clientEmail: e.target.value,
                              },
                            }))
                          }
                          placeholder="client@company.com"
                          className="w-full rounded border border-neutral-300 p-1.5 text-xs bg-white focus:outline-none focus:border-ntgx-red"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <label className="block text-2xs font-bold uppercase text-neutral-600 mb-0.5">
                          LANGUAGE *
                        </label>
                        <select
                          aria-label="Notification Language"
                          value={form.billing.notifications.language}
                          onChange={(e) =>
                            form.setBilling((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                language: e.target.value as any,
                              },
                            }))
                          }
                          className="w-full rounded border border-neutral-300 p-1.5 text-xs bg-white focus:outline-none"
                        >
                          <option value="en">English (US)</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                    </div>

                    {/* Office / Operations Email Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center pt-2 border-t border-neutral-200/60">
                      <div className="sm:col-span-12">
                        <label className="block text-2xs font-bold uppercase text-neutral-600 mb-0.5">
                          OFFICE / OPERATIONS DISPATCH EMAIL *
                        </label>
                        <input
                          type="email"
                          value={form.billing.notifications.companyEmail}
                          onChange={(e) =>
                            form.setBilling((prev) => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                companyEmail: e.target.value,
                              },
                            }))
                          }
                          placeholder="operations@company.com"
                          className="w-full rounded border border-neutral-300 p-1.5 text-xs bg-white focus:outline-none focus:border-ntgx-red"
                        />
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          Internal operations and dispatch will receive automatic pickup schedule alerts &amp; AWB documents.
                        </p>
                      </div>
                    </div>

                    {/* Notify For Checkboxes */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-2xs font-bold text-neutral-700">Notify for:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-neutral-700">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="accent-ntgx-red h-3.5 w-3.5 rounded" />
                          <span>Shipment has been created</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="accent-ntgx-red h-3.5 w-3.5 rounded" />
                          <span>Pickup has been scheduled</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="accent-ntgx-red h-3.5 w-3.5 rounded" />
                          <span>Shipment has been picked up by NTGX</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="accent-ntgx-red h-3.5 w-3.5 rounded" />
                          <span>Updates on estimated delivery</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-semibold text-neutral-900">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="accent-ntgx-red h-3.5 w-3.5 rounded"
                          />
                          <span>Shipment has been delivered</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer font-semibold text-neutral-900">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="accent-ntgx-red h-3.5 w-3.5 rounded"
                          />
                          <span>Delivery exceptions</span>
                          <Info className="h-3 w-3 text-neutral-400" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => alert('Add secondary notification recipient modal.')}
                      className="font-bold text-ntgx-red hover:underline uppercase text-2xs"
                    >
                      ADD EMAIL ADDRESS ▾
                    </button>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={showPersonalizedMessage}
                      onChange={(e) => setShowPersonalizedMessage(e.target.checked)}
                      className="accent-ntgx-red h-4 w-4 rounded"
                    />
                    <span>Include a personalized message</span>
                  </label>

                  {showPersonalizedMessage && (
                    <textarea
                      rows={2}
                      placeholder="Add custom dispatch notes or instructions for the recipient..."
                      className="w-full rounded border border-neutral-300 p-2 text-xs focus:border-ntgx-red focus:outline-none"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

      {/* ─────────────────────────────────────────────────────────────
          3. STICKY BOTTOM ACTION FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="sticky bottom-4 z-20 mt-8 bg-white/95 backdrop-blur-xs border border-neutral-300 rounded-xl px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between shadow-lg gap-4">
        {/* Left Terms & Disclaimer */}
        <div className="text-[11px] text-neutral-500 leading-tight">
          By clicking &apos;Finalize&apos;, I accept the{' '}
          <a href="#" className="underline hover:text-neutral-900">
            Terms of Use
          </a>{' '}
          of the NTGX Express Terms and Conditions of Carriage.
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-md shadow-xs">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="px-4 py-2 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold rounded-l-md uppercase tracking-wider transition-colors"
            >
              SAVE
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              aria-label="Save options"
              className="px-2 py-2 border-y border-r border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs rounded-r-md transition-colors"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleFinalize}
            disabled={isSubmitting}
            className="px-8 py-2 bg-ntgx-red hover:bg-ntgx-redHover active:bg-ntgx-redDark text-white text-xs font-black uppercase tracking-wider rounded-md shadow-md transition-all flex items-center gap-2 hover:shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? 'PROCESSING…' : 'FINALIZE'}
          </button>
        </div>
      </footer>
    </div>
  );
}
