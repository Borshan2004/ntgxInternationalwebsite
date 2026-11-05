// src/components/features/documents/AirWaybillDocument.tsx
'use client';

import React from 'react';
import type { AirWaybillDocumentData, AwbPageCopyType } from '@/types/shipment';
import { BarcodeRenderer } from './BarcodeRenderer';
import { Printer } from 'lucide-react';

export interface AirWaybillDocumentProps {
  readonly data: AirWaybillDocumentData;
  readonly onPrint?: () => void;
}

export const AirWaybillDocument: React.FC<AirWaybillDocumentProps> = ({
  data,
  onPrint,
}) => {
  const handlePrint = (): void => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const renderPage = (copyLabel: AwbPageCopyType, pageIndex: number) => (
    <div
      key={copyLabel}
      className="awb-page bg-white text-black p-6 border-2 border-black max-w-[800px] mx-auto my-6 shadow-md print:shadow-none print:m-0 print:border-black print:page-break-after-always text-xs font-sans leading-tight"
      style={{ minHeight: '1020px' }}
    >
      {/* Top Header Row */}
      <div className="border-b-2 border-black pb-2 flex justify-between items-start">
        <div className="space-y-0.5">
          <div className="flex gap-6">
            <span>
              SHIP DATE: <strong>{data.shipDateFormatted}</strong>
            </span>
            <span>
              ACTWGT: <strong>{data.actualWeightKg}</strong>
            </span>
            <span>
              CHGWGT: <strong>{data.chargeableWeightKg}</strong>
            </span>
          </div>
          <div className="flex gap-6">
            <span>
              CAD: <strong>{data.cadNumber}</strong>
            </span>
            <span>
              DIMS: <strong>{data.dimensionsFormatted}</strong>
            </span>
          </div>
          <div className="flex gap-6">
            <span className="font-bold">{data.billToLabel}</span>
            <span>
              REF: <strong>{data.referenceCode}</strong>
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black tracking-tighter text-black">NTGX EXPRESS &amp; FREIGHT</div>
          <div className="text-sm font-bold tracking-widest">[ E ]</div>
        </div>
      </div>

      {/* Origin / Shipper Box */}
      <div className="border-b-2 border-black py-2">
        <div className="flex justify-between font-bold text-2xs uppercase text-gray-700">
          <span>ORIGIN ID: {data.originAirportCode}</span>
          <span>TEL: {data.sender.phone}</span>
        </div>
        <div className="font-bold text-sm uppercase">{data.sender.contactName}</div>
        {data.sender.company && (
          <div className="font-semibold uppercase">{data.sender.company}</div>
        )}
        <div className="uppercase">
          {data.sender.addressLine1}
          {data.sender.addressLine2 ? `, ${data.sender.addressLine2}` : ''}
        </div>
        <div className="uppercase">
          {data.sender.city}, {data.sender.postalCode} {data.sender.countryCode}
        </div>
      </div>

      {/* Recipient / Consignee Box */}
      <div className="border-b-2 border-black py-2.5">
        <div className="flex justify-between font-bold text-2xs uppercase text-gray-700">
          <span>DELIVERY TO:</span>
          <span>TEL: {data.recipient.phone}</span>
        </div>
        <div className="font-bold text-base uppercase">{data.recipient.contactName}</div>
        {data.recipient.company && (
          <div className="font-bold text-sm uppercase">{data.recipient.company}</div>
        )}
        <div className="uppercase">
          {data.recipient.addressLine1}
          {data.recipient.addressLine2 ? `, ${data.recipient.addressLine2}` : ''}
        </div>
        <div className="font-bold uppercase text-sm">
          {data.recipient.city} {data.recipient.stateProvince || ''}{' '}
          {data.recipient.postalCode}, {data.recipient.countryCode}
        </div>
      </div>

      {/* Routing Strip */}
      <div className="border-b-2 border-black py-2 flex justify-between items-center bg-gray-50 px-2">
        <div className="font-black text-sm tracking-wider font-mono">
          {data.routingHeader}
        </div>
        <div className="flex gap-4 font-bold text-xs">
          <span>{data.serviceCodeAcronym}</span>
          <span>{data.signatureAcronym}</span>
          <span className="text-sm bg-black text-white px-1.5 py-0.5">
            {data.destAirportCode}
          </span>
        </div>
      </div>

      {/* Barcode & Tracking Block */}
      <div className="border-b-2 border-black py-6 flex flex-col items-center justify-center">
        <BarcodeRenderer
          trackingNumber={data.trackingNumberRaw}
          width={420}
          height={68}
          showText={true}
        />
        <div className="w-full flex justify-between text-2xs font-mono font-bold px-2 mt-2">
          <span>FORM {data.formCode}</span>
          <span>PART# 158580-434</span>
        </div>
      </div>

      {/* Commodities & Customs Declaration Summary */}
      <div className="border-b-2 border-black py-2.5 space-y-1">
        <div className="text-2xs font-bold uppercase text-gray-700">
          COMMODITY CUSTOMS DECLARATION
        </div>
        {data.commoditySummaryLines.map((line, i) => (
          <div key={i} className="text-xs font-mono">
            {line}
          </div>
        ))}
        <div className="flex justify-between text-xs pt-1 font-semibold">
          <span>
            CUSTOMS VALUE: <strong>{data.customsValueFormatted}</strong>
          </span>
          <span>
            CTRY/TERR MFR: <strong>{data.countryOfManufacture}</strong>
          </span>
        </div>
      </div>

      {/* Legal & Service Notice */}
      <div className="py-2 text-[10px] text-gray-600 leading-tight border-b border-gray-300">
        By placing this order, you agree to the standard Conditions of Carriage.
        Carrier liability is limited to standard international conventions (Warsaw /
        Montreal) unless a higher declared value is specified and fees paid.
      </div>

      {/* Page Copy Banner */}
      <div className="mt-8 pt-2 text-center font-black text-xs uppercase tracking-wider bg-black text-white py-1.5">
        PAGE {pageIndex + 1}: {copyLabel}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Control Toolbar */}
      <div className="flex items-center justify-between bg-neutral-surfaceMuted p-3 rounded-md border border-neutral-border print:hidden">
        <span className="text-xs font-bold text-neutral-textPrimary">
          3-Page Standard Air Waybill (Form 0430)
        </span>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-purple text-white text-xs font-bold rounded-md hover:bg-brand-purpleHover shadow-xs"
        >
          <Printer className="h-4 w-4" /> Print 3-Page Air Waybill
        </button>
      </div>

      {/* The 3 Physical AWB Pages */}
      <div className="print:p-0">
        {data.copies.map((copyLabel, idx) => renderPage(copyLabel, idx))}
      </div>
    </div>
  );
};
