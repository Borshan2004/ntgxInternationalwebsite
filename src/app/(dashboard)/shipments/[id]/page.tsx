// src/app/(dashboard)/shipments/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  FileText,
  Truck,
  Package,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AirWaybillDocument } from '@/components/features/documents/AirWaybillDocument';
import { CommercialInvoiceDocument } from '@/components/features/documents/CommercialInvoiceDocument';
import { TrackingTimeline } from '@/components/features/tracking/TrackingTimeline';
import { OperationsStatusUpdater } from '@/components/features/tracking/OperationsStatusUpdater';
import { buildAirWaybillData, buildCommercialInvoiceData } from '@/services/pdfService';
import type { ShipmentEntityDTO, FedExTrackApiResponse, UserRole, ShipmentStatus } from '@/types/shipment';
import type { AuthUser } from '@/types/auth';

const REFERENCE_SHIPMENT: ShipmentEntityDTO = {
  id: 'shp_001',
  trackingNumber: '879098800901',
  formCode: '0430',
  routingCode: 'XA MTPA 58KJ1/70DF/484B',
  barcodeSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60"><rect width="400" height="60" fill="#ffffff"/><path d="M10 5h4v50h-4zM20 5h2v50h-2zM28 5h6v50h-6zM40 5h2v50h-2zM48 5h4v50h-4zM60 5h8v50h-8zM75 5h2v50h-2zM85 5h4v50h-4zM95 5h6v50h-6zM110 5h2v50h-2zM120 5h4v50h-4zM130 5h8v50h-8zM145 5h2v50h-2zM155 5h4v50h-4zM165 5h6v50h-6zM180 5h2v50h-2zM190 5h4v50h-4zM200 5h8v50h-8zM215 5h2v50h-2zM225 5h4v50h-4zM235 5h6v50h-6zM250 5h2v50h-2zM260 5h4v50h-4zM270 5h8v50h-8zM285 5h2v50h-2zM295 5h4v50h-4zM305 5h6v50h-6zM320 5h2v50h-2zM330 5h4v50h-4zM340 5h8v50h-8zM355 5h2v50h-2zM365 5h4v50h-4zM375 5h6v50h-6zM390 5h4v50h-4z" fill="#000000"/></svg>',
  organizationId: 'org-asi-bd-demo',
  createdById: 'usr-customer-001',
  zoneId: 'ZONE_US_CA',
  status: 'DELIVERED',
  serviceTier: 'INTERNATIONAL_PRIORITY',
  signatureOption: 'DIRECT_SIGNATURE',
  packagingType: 'YOUR_PACKAGING',
  customsContentType: 'COMMODITIES',
  shipDate: new Date('2026-10-23T10:15:00Z'),
  estimatedDelivery: new Date('2026-10-27T17:00:00Z'),
  actualDelivery: new Date('2026-10-27T14:45:00Z'),

  senderName: 'Arafat / Gunjan',
  senderCompany: 'Apparel Sourcing International Inc.',
  senderTaxId: 'BIN-880198945',
  senderPhone: '8801989451709',
  senderPhoneExt: null,
  senderEmail: 'export@apparelsourcing.bd',
  senderAddress1: 'House # 30 (3rd Floor), Apt-B3, Western Road',
  senderAddress2: 'Banani DOHS',
  senderAddress3: null,
  senderCity: 'Dhaka',
  senderState: 'Dhaka Division',
  senderPostal: '1206',
  senderCountry: 'BD',
  originAirportCode: 'DACA',

  recipientName: 'Dakota / Salman',
  recipientCompany: 'Bernette Textile Co. Ltd.',
  recipientTaxId: 'US-EIN-13-987654',
  recipientPhone: '212-279-5526',
  recipientPhoneExt: null,
  recipientEmail: 'imports@bernettetextile.com',
  recipientAddress1: '42 West 39th Street, 11th Floor',
  recipientAddress2: null,
  recipientAddress3: null,
  recipientCity: 'New York',
  recipientState: 'NY',
  recipientPostal: '10018',
  recipientCountry: 'US',
  destAirportCode: 'EWR',
  isResidential: false,

  packageCount: 1,
  totalActualWeightKg: 2.5,
  totalVolumetricWgtKg: 4.0,
  totalChargeableWgtKg: 4.0,
  totalCustomsValue: 6.0,
  totalDeclaredValue: 6.0,
  currency: 'USD',

  billTransportationTo: 'RECIPIENT',
  billingAccountNumber: '987654321',
  dutiesBillTo: 'RECIPIENT',
  dutiesAccountNumber: 'US-EIN-13-987654',
  referenceCode: 'BNI/CC/P-1780009697',
  invoiceNumber: 'ASI-25075',
  poNumber: 'PO-99104',
  cadNumber: '260504077/INET4535',

  baseChargeUsd: 148.5,
  fuelSurchargeUsd: 21.53,
  surchargeAmountUsd: 3.88,
  totalShippingCostUsd: 173.91,
  finalizedAt: new Date('2026-10-23T10:15:00Z'),
  createdAt: new Date('2026-10-23T10:15:00Z'),
  updatedAt: new Date('2026-10-27T14:45:00Z'),

  packages: [
    {
      id: 'pkg_001',
      shipmentId: 'shp_001',
      packageIndex: 1,
      actualWeight: 2.5,
      weightUnit: 'KG',
      length: 51,
      width: 35,
      height: 11,
      dimensionUnit: 'CM',
      volumetricWgt: 4.0,
      chargeableWgt: 4.0,
      declaredValue: 6.0,
    },
  ],
  commodities: [
    {
      id: 'com_001',
      shipmentId: 'shp_001',
      packageCount: 1,
      description: "Sample of Men's Shorts (97% Cotton, 3% Spandex)",
      hsTariffCode: '98110060',
      quantity: 4,
      unitOfMeasure: 'PKS',
      netWeightKg: 1.8,
      unitValue: 1.25,
      totalValue: 5.0,
      countryOfMfr: 'BD',
    },
    {
      id: 'com_002',
      shipmentId: 'shp_001',
      packageCount: 1,
      description: 'Sample of Woven Fabric Swatch (98% Cotton, 2% Spandex)',
      hsTariffCode: '6307903010',
      quantity: 1,
      unitOfMeasure: 'PKS',
      netWeightKg: 0.7,
      unitValue: 1.0,
      totalValue: 1.0,
      countryOfMfr: 'BD',
    },
  ],
  organization: {
    id: 'org-asi-bd-demo',
    name: 'Apparel Sourcing International Inc.',
    code: 'ASI-BD',
    taxId: 'BIN-880198945',
    vatNumber: 'BD-VAT-908122',
    accountNumber: '987654321',
    phone: '8801989451709',
    email: 'export@apparelsourcing.bd',
    isActive: true,
    createdAt: new Date('2026-09-01T00:00:00Z'),
    updatedAt: new Date('2026-10-27T00:00:00Z'),
  },
  trackingEvents: [
    {
      id: 'evt_001',
      shipmentId: 'shp_001',
      eventCode: 'OC',
      statusTitle: 'Shipment information sent to FedEx',
      description: 'Shipment documentation generated and registered via API',
      city: 'Dhaka',
      countryCode: 'BD',
      timestamp: new Date('2026-10-23T10:15:00Z'),
    },
    {
      id: 'evt_002',
      shipmentId: 'shp_001',
      eventCode: 'DL',
      statusTitle: 'Delivered',
      description: 'Delivered to 42 West 39th Street. Signed by D.Salman',
      city: 'New York',
      countryCode: 'US',
      signedBy: 'D.Salman',
      timestamp: new Date('2026-10-27T14:45:00Z'),
    },
  ],
};

const REFERENCE_TELEMETRY: FedExTrackApiResponse = {
  trackingNumberInfo: {
    trackingNumber: '879098800901',
    carrierCode: 'NTGX',
  },
  latestStatusDetail: {
    code: 'DL',
    statusBy: 'DELIVERED',
    description: 'Delivered to recipient address. Signed for by D. Salman',
    scanLocation: {
      city: 'NEW YORK',
      stateOrProvinceCode: 'NY',
      countryCode: 'US',
    },
    estimatedDeliveryTime: 'Oct 27, 2026 by 2:45 PM',
  },
  packageWeight: { units: 'KG', value: 2.5 },
  dateAndTime: [
    { type: 'ACTUAL_PICKUP', dateTime: '2026-10-23T14:30:00Z' },
    { type: 'ACTUAL_DELIVERY', dateTime: '2026-10-27T14:45:00Z' },
  ],
  scanEvents: [
    {
      timestamp: '2026-10-23T10:15:00Z',
      eventType: 'OC',
      eventDescription: 'Shipment created and Air Waybill generated',
      scanLocation: { city: 'Dhaka', countryCode: 'BD' },
    },
    {
      timestamp: '2026-10-23T14:30:00Z',
      eventType: 'PU',
      eventDescription: 'Picked up by NTGX Express courier',
      scanLocation: { city: 'Dhaka', countryCode: 'BD' },
    },
    {
      timestamp: '2026-10-24T02:10:00Z',
      eventType: 'DP',
      eventDescription: 'Departed Hazrat Shahjalal Int Airport on flight EK587',
      scanLocation: { city: 'Dhaka', countryCode: 'BD' },
    },
    {
      timestamp: '2026-10-25T13:45:00Z',
      eventType: 'AR',
      eventDescription: 'Sorted at Dubai International Air Express Hub (DXB)',
      scanLocation: { city: 'Dubai', countryCode: 'AE' },
    },
    {
      timestamp: '2026-10-27T08:15:00Z',
      eventType: 'OD',
      eventDescription: 'On NTGX vehicle for delivery',
      scanLocation: { city: 'New York', stateOrProvinceCode: 'NY', countryCode: 'US' },
    },
    {
      timestamp: '2026-10-27T14:45:00Z',
      eventType: 'DL',
      eventDescription: 'Delivered. Signed for by D. Salman',
      scanLocation: { city: 'New York', stateOrProvinceCode: 'NY', countryCode: 'US' },
    },
  ],
};

export default function ShipmentDetailPage({
  params,
}: {
  readonly params: { readonly id: string };
}): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'AWB' | 'INVOICE' | 'TRACKING'>('AWB');
  const [shipment, setShipment] = useState<ShipmentEntityDTO>({
    ...REFERENCE_SHIPMENT,
    id: params.id,
  });
  const [telemetry, setTelemetry] = useState<FedExTrackApiResponse>(REFERENCE_TELEMETRY);
  const [userRole, setUserRole] = useState<UserRole>('ADMIN');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fedex_user_session');
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed.role) setUserRole(parsed.role);
      }
    } catch {
      // Fallback
    }

    // 1. Fetch real shipment record from database
    void fetch(`/api/shipments/${encodeURIComponent(params.id)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.trackingNumber) {
          setShipment({
            ...data,
            shipDate: data.shipDate ? new Date(data.shipDate) : new Date(),
            estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery) : null,
            actualDelivery: data.actualDelivery ? new Date(data.actualDelivery) : null,
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
          });
        }
      })
      .catch(() => {
        // Fallback to reference
      });

    // 2. Fetch live telemetry from database
    void fetch(`/api/track/v1/trackingnumbers?trackingNumber=${encodeURIComponent(params.id)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setTelemetry(data as FedExTrackApiResponse);
      })
      .catch(() => {
        // Fallback
      });
  }, [params.id]);

  const awbData = buildAirWaybillData(shipment);
  const invoiceData = buildCommercialInvoiceData(shipment);

  const isStaff = userRole === 'ADMIN' || userRole === 'EMPLOYEE';

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-border dark:border-slate-800 pb-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/shipments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Shipments
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-mono font-black text-ntgx-red">
                TRK # {shipment.trackingNumber}
              </h1>
              <Badge status={telemetry.latestStatusDetail.statusBy as ShipmentStatus} />
            </div>
            <p className="text-xs text-neutral-textSecondary dark:text-slate-400 mt-0.5">
              Route: <span className="font-bold text-neutral-textPrimary dark:text-neutral-100">{shipment.originAirportCode || 'DACA'}</span> ({shipment.senderCity}, {shipment.senderCountry}) &rarr;{' '}
              <span className="font-bold text-neutral-textPrimary dark:text-neutral-100">{shipment.destAirportCode || 'EWR'}</span> ({shipment.recipientCity}, {shipment.recipientCountry}) • CAD: {shipment.cadNumber || '260504077/INET4535'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={activeTab === 'INVOICE' ? `/api/documents/invoice/${shipment.id}` : `/api/documents/awb/${shipment.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            <span>Open Clean Print View</span>
          </a>

          <Button
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            className="bg-[#E51919] hover:bg-[#C81212] text-white"
          >
            <Printer className="h-3.5 w-3.5 mr-1.5" /> Print {activeTab === 'AWB' ? '3-Page AWB' : activeTab === 'INVOICE' ? 'Invoice' : 'Document'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-border dark:border-slate-800 space-x-4 sm:space-x-6 text-xs sm:text-sm font-semibold overflow-x-auto pb-0.5 print:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('AWB')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors shrink-0 whitespace-nowrap ${
            activeTab === 'AWB'
              ? 'border-ntgx-red text-ntgx-red'
              : 'border-transparent text-neutral-textSecondary hover:text-neutral-textPrimary dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="h-4 w-4" /> 3-Page Air Waybill (Form 0430)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('INVOICE')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors shrink-0 whitespace-nowrap ${
            activeTab === 'INVOICE'
              ? 'border-ntgx-red text-ntgx-red'
              : 'border-transparent text-neutral-textSecondary hover:text-neutral-textPrimary dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Package className="h-4 w-4" /> Customs Commercial Invoice
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TRACKING')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors shrink-0 whitespace-nowrap ${
            activeTab === 'TRACKING'
              ? 'border-ntgx-red text-ntgx-red'
              : 'border-transparent text-neutral-textSecondary hover:text-neutral-textPrimary dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Truck className="h-4 w-4" /> Transit Milestones & Telemetry
        </button>
      </div>

      {/* Document & Telemetry Content */}
      <div className="overflow-x-auto pb-4">
        {activeTab === 'AWB' && (
          <AirWaybillDocument data={awbData} onPrint={() => window.print()} />
        )}

        {activeTab === 'INVOICE' && (
          <CommercialInvoiceDocument data={invoiceData} onPrint={() => window.print()} />
        )}
      </div>

      {activeTab === 'TRACKING' && (
        <div className="space-y-6">
          {isStaff && (
            <OperationsStatusUpdater
              trackingNumber={shipment.trackingNumber}
              currentStatus={telemetry.latestStatusDetail.statusBy as ShipmentStatus}
              destinationCity={telemetry.latestStatusDetail.scanLocation.city}
              destinationCountry={telemetry.latestStatusDetail.scanLocation.countryCode}
              onUpdated={(updated) => setTelemetry(updated)}
            />
          )}
          <TrackingTimeline telemetry={telemetry} />
        </div>
      )}
    </div>
  );
}
