// src/components/features/documents/AirWaybillDocument.tsx
'use client';

import React from 'react';
import type { AirWaybillDocumentData, AwbPageCopyType } from '@/types/shipment';
import { generateCode128BarcodeSvg } from '@/services/barcodeService';
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

  // Helper to extract clean alphanumeric identifiers for routing barcodes
  const rawTrk = data.trackingNumberRaw.replace(/\s+/g, '');
  const destPostalClean = (data.recipient.postalCode || '50672').replace(/\s+/g, '').toUpperCase();
  const destCountryCode = (data.recipient.countryCode || 'MY').toUpperCase();
  const destAirport = (data.destAirportCode || 'KUL').toUpperCase();
  const originAirport = (data.originAirportCode || 'DAC').toUpperCase();

  // Secondary & Tertiary routing barcodes (matching DHL / Express Worldwide standard)
  const routingBarcode2Text = `(2L)${destCountryCode}${destPostalClean}+48000001`;
  const pieceIdText = `(J) JD01 4600 ${rawTrk.slice(-4)} 3022 1074`;

  // Render vector SVG barcodes
  const barcode1Svg = generateCode128BarcodeSvg(rawTrk);
  const barcode2Svg = generateCode128BarcodeSvg(rawTrk.slice(0, 10));
  const barcode3Svg = generateCode128BarcodeSvg(rawTrk.slice(2, 12));

  // Commodity / Content description
  const contentDescription = data.commoditySummaryLines[0]
    ? data.commoditySummaryLines[0].replace(/^DESC\d+:\s*/i, '').split('(')[0].trim()
    : 'Export Merchandise Samples';

  const renderPage = (copyLabel: AwbPageCopyType, pageIndex: number) => (
    <div
      key={copyLabel}
      className="awb-page bg-white text-black p-5 sm:p-6 border-2 border-black max-w-[640px] mx-auto my-6 shadow-md print:shadow-none print:m-0 print:border-2 print:border-black font-sans text-xs leading-tight"
      style={{ minHeight: '940px' }}
    >
      {/* ── 1. TOP HEADER ROW ── */}
      <div className="border-b-2 border-black pb-2 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-black">
            EXPRESS WORLDWIDE
          </div>
          <div className="text-[10px] font-mono text-neutral-600">
            {data.shipDateFormatted} {data.cadNumber}
          </div>
        </div>

        {/* WPX Inverted Box */}
        <div className="bg-black text-white font-black text-xl sm:text-2xl px-3 py-1 tracking-widest border border-black flex items-center justify-center">
          WPX
        </div>

        {/* Brand Logo & Origin Code */}
        <div className="text-right">
          <div className="text-lg sm:text-xl font-black tracking-tighter text-[#E51919] flex items-center justify-end gap-1">
            <span>NTGX</span>
            <span className="text-black font-extrabold text-sm tracking-normal">EXPRESS</span>
          </div>
          <div className="text-xs font-semibold text-neutral-700 mt-0.5">
            Origin: <strong className="text-sm font-black text-black">{originAirport}</strong>
          </div>
        </div>
      </div>

      {/* ── 2. SHIPPER'S ADDRESS & DETAILS (FROM) ── */}
      <div className="border-b-2 border-black py-2.5 flex justify-between items-start text-xs">
        <div className="max-w-[70%] space-y-0.5">
          <div className="font-bold text-neutral-800">
            From: <span className="font-black text-black uppercase">{data.sender.contactName}</span>
          </div>
          {data.sender.company && (
            <div className="font-bold uppercase text-neutral-900">{data.sender.company}</div>
          )}
          <div className="uppercase text-neutral-700 text-[11px]">
            {data.sender.addressLine1}
            {data.sender.addressLine2 ? `, ${data.sender.addressLine2}` : ''}
          </div>
          <div className="uppercase text-neutral-700 text-[11px]">
            {data.sender.postalCode} {data.sender.city}
          </div>
          <div className="font-bold uppercase text-black">
            {data.sender.countryCode === 'BD' ? 'BANGLADESH' : data.sender.countryCode}
          </div>
        </div>

        <div className="text-right font-mono text-[11px] text-neutral-800">
          <div>Contact:</div>
          <div className="font-bold">{data.sender.phone}</div>
        </div>
      </div>

      {/* ── 3. RECEIVER'S ADDRESS & DETAILS (TO with DHL-style Corner Brackets) ── */}
      <div className="relative border-b-2 border-black py-3 px-3 my-1">
        {/* Top-Left Bracket */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-black" />
        {/* Top-Right Bracket */}
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-black" />
        {/* Bottom-Left Bracket */}
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-black" />
        {/* Bottom-Right Bracket */}
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-black" />

        <div className="flex justify-between items-start">
          <div className="max-w-[70%] space-y-0.5 pl-1.5">
            <div className="text-sm font-black uppercase text-black">
              To: {data.recipient.contactName}
            </div>
            {data.recipient.company && (
              <div className="font-bold uppercase text-neutral-900 text-xs">
                {data.recipient.company}
              </div>
            )}
            <div className="uppercase text-neutral-800 text-[11px]">
              {data.recipient.addressLine1}
              {data.recipient.addressLine2 ? `, ${data.recipient.addressLine2}` : ''}
            </div>
            <div className="font-bold uppercase text-neutral-900 text-xs">
              {data.recipient.city} {data.recipient.stateProvince || ''} {data.recipient.postalCode}
            </div>
            <div className="text-base font-black uppercase text-black tracking-wide pt-1">
              {data.recipient.countryCode === 'MY'
                ? 'MALAYSIA'
                : data.recipient.countryCode === 'US'
                ? 'UNITED STATES'
                : data.recipient.countryCode === 'CA'
                ? 'CANADA'
                : data.recipient.countryCode === 'GB'
                ? 'UNITED KINGDOM'
                : data.recipient.countryCode === 'AE'
                ? 'UNITED ARAB EMIRATES'
                : data.recipient.countryCode}
            </div>
          </div>

          <div className="text-right font-mono text-[11px] text-neutral-800 pr-1.5">
            <div>Contact:</div>
            <div className="font-bold">{data.recipient.contactName}</div>
            <div className="font-bold">{data.recipient.phone}</div>
          </div>
        </div>
      </div>

      {/* ── 4. ROUTING CODE & GATEWAY STATION ── */}
      <div className="border-b-2 border-black py-2.5">
        <div className="text-2xl sm:text-3xl font-black tracking-wider text-black font-mono">
          {destCountryCode}-{destAirport}-EKL &nbsp;KLB1
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Solid Black Station Box */}
          <div className="bg-black text-white px-4 py-1 text-xl sm:text-2xl font-black tracking-widest">
            C-{destAirport}
          </div>

          <div className="text-right text-[10px] font-bold text-neutral-600 uppercase tracking-wider">
            Day &nbsp;&nbsp; Time
          </div>
        </div>
      </div>

      {/* ── 5. SHIPMENT DETAILS & WEIGHT ── */}
      <div className="border-b-2 border-black py-2 flex items-center justify-between text-xs">
        <div>
          <span className="text-neutral-600 font-bold">Ref: </span>
          <span className="font-mono font-bold text-black">{data.referenceCode}</span>
        </div>

        <div className="flex items-center gap-8">
          <div>
            <div className="text-[10px] text-neutral-500 font-semibold uppercase">Piece/Shpt Weight</div>
            <div className="text-base sm:text-lg font-black text-black">
              {data.actualWeightKg}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-neutral-500 font-semibold uppercase">Piece</div>
            <div className="text-base sm:text-lg font-black text-black">
              1/1
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. BARCODES SECTION ── */}
      <div className="pt-2 pb-1 space-y-4">
        {/* Contents Description */}
        <div className="text-right text-[11px] text-neutral-700 font-medium">
          Contents: <strong className="text-black">{contentDescription}</strong>
        </div>

        {/* Barcode 1: Primary Waybill Barcode */}
        <div className="flex flex-col items-center justify-center pt-1">
          <div
            className="w-full max-w-[460px] flex justify-center overflow-hidden"
            dangerouslySetInnerHTML={{ __html: barcode1Svg }}
          />
          <div className="font-mono text-xs sm:text-sm font-black tracking-widest text-black mt-1">
            WAYBILL {data.trackingNumberFormatted}
          </div>
        </div>

        {/* Barcode 2: Destination Postal Routing Barcode */}
        <div className="flex flex-col items-center justify-center pt-1">
          <div
            className="w-full max-w-[460px] flex justify-center overflow-hidden"
            dangerouslySetInnerHTML={{ __html: barcode2Svg }}
          />
          <div className="font-mono text-xs font-bold text-neutral-800 tracking-wider mt-1">
            {routingBarcode2Text}
          </div>
        </div>

        {/* Barcode 3: Piece Identifier Barcode */}
        <div className="flex flex-col items-center justify-center pt-1 pb-2">
          <div
            className="w-full max-w-[460px] flex justify-center overflow-hidden"
            dangerouslySetInnerHTML={{ __html: barcode3Svg }}
          />
          <div className="font-mono text-xs font-bold text-neutral-800 tracking-wider mt-1">
            {pieceIdText}
          </div>
        </div>
      </div>

      {/* ── 7. PAGE COPY FOOTER BANNER ── */}
      <div className="mt-3 pt-2 text-center font-black text-xs uppercase tracking-wider bg-black text-white py-2">
        PAGE {pageIndex + 1} OF 3 &mdash; {copyLabel}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* On-Screen Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-surfaceMuted p-4 rounded-xl border border-neutral-border print:hidden">
        <div>
          <span className="text-sm font-bold text-neutral-textPrimary block">
            3-Page Standard Air Waybill (Form 0430 / Express Worldwide)
          </span>
          <span className="text-xs text-neutral-500">
            Formatted to official thermal courier label standard with 3 distinct copies (Consignee, Carrier, Shipper).
          </span>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E51919] text-white text-xs font-bold rounded-lg hover:bg-[#C81212] shadow-sm transition-all shrink-0"
        >
          <Printer className="h-4 w-4" />
          <span>Print 3-Page Air Waybill</span>
        </button>
      </div>

      {/* The 3 Physical AWB Pages */}
      <div className="print:p-0">
        {data.copies.map((copyLabel, idx) => (
          <div key={copyLabel} className="space-y-2 mb-8 print:mb-0">
            <div className="text-center font-bold text-xs text-neutral-500 uppercase tracking-widest print:hidden">
              &bull; &bull; &bull; AWB PAGE {idx + 1} OF 3: {copyLabel} &bull; &bull; &bull;
            </div>
            {renderPage(copyLabel, idx)}
          </div>
        ))}
      </div>
    </div>
  );
};
