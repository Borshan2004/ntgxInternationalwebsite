// src/components/features/documents/CommercialInvoiceDocument.tsx
'use client';

import React from 'react';
import type { CommercialInvoiceDocumentData } from '@/types/shipment';
import { Printer } from 'lucide-react';

export interface CommercialInvoiceDocumentProps {
  readonly data: CommercialInvoiceDocumentData;
  readonly onPrint?: () => void;
}

export const CommercialInvoiceDocument: React.FC<CommercialInvoiceDocumentProps> = ({
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

  const safeNum = (val: number | string | undefined | null, decimals = 2): string => {
    if (val === undefined || val === null || val === '') return '0.00';
    const n = Number(val);
    return isNaN(n) ? '0.00' : n.toFixed(decimals);
  };

  return (
    <div className="space-y-4">
      {/* Control Toolbar */}
      <div className="flex items-center justify-between bg-neutral-surfaceMuted p-3 rounded-md border border-neutral-border print:hidden">
        <div>
          <span className="text-xs font-bold text-neutral-textPrimary block">
            Official Customs Commercial Invoice
          </span>
          <span className="text-2xs text-neutral-500">
            Form approved for International Customs clearance &amp; HS declaration.
          </span>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E51919] text-white text-xs font-bold rounded-md hover:bg-[#C81212] shadow-xs transition-colors"
        >
          <Printer className="h-4 w-4" /> Print Commercial Invoice
        </button>
      </div>

      <div
        className="ci-page bg-white text-black p-8 border-2 border-black max-w-[800px] mx-auto my-6 shadow-md print:shadow-none print:m-0 print:border-black text-xs font-sans leading-tight"
        style={{ minHeight: '1020px' }}
      >
        {/* Document Title Header */}
        <div className="text-center border-b-2 border-black pb-3 mb-4">
          <h1 className="text-xl font-black uppercase tracking-tight">
            Commercial Invoice / Facture Commerciale
          </h1>
          <p className="text-2xs text-gray-600 uppercase mt-0.5">
            International Customs Declaration for Cross-Border Transport
          </p>
        </div>

        {/* References Matrix */}
        <div className="grid grid-cols-2 border border-black mb-4 divide-x divide-black text-2xs">
          <div className="p-2 space-y-1">
            <div>
              AIR WAYBILL NO: <strong>{data.trackingNumberFormatted}</strong>
            </div>
            <div>
              INVOICE NO: <strong>{data.invoiceNumber}</strong>
            </div>
            {data.poNumber && (
              <div>
                PURCHASE ORDER NO: <strong>{data.poNumber}</strong>
              </div>
            )}
          </div>
          <div className="p-2 space-y-1">
            <div>
              DATE OF EXPORTATION: <strong>{data.shipDateFormatted}</strong>
            </div>
            <div>
              PAYMENT TERMS / BILL TO: <strong>{data.billToParty}</strong>
            </div>
            <div>
              CURRENCY: <strong>{data.currency}</strong>
            </div>
          </div>
        </div>

        {/* Exporter and Consignee Blocks */}
        <div className="grid grid-cols-2 border border-black mb-4 divide-x divide-black">
          <div className="p-3 space-y-1">
            <div className="font-bold text-2xs uppercase text-gray-600 border-b border-gray-300 pb-1 mb-1">
              SHIPPER / EXPORTER (Vendeur)
            </div>
            <div className="font-bold text-sm uppercase">{data.exporter.contactName}</div>
            {data.exporter.company && (
              <div className="font-semibold uppercase">{data.exporter.company}</div>
            )}
            <div className="uppercase">{data.exporter.addressLine1}</div>
            <div className="uppercase">
              {data.exporter.city}, {data.exporter.postalCode} {data.exporter.countryCode}
            </div>
            <div>Tel: {data.exporter.phone}</div>
            {data.exporter.taxId && (
              <div className="font-mono text-2xs">Tax ID/BIN: {data.exporter.taxId}</div>
            )}
          </div>

          <div className="p-3 space-y-1">
            <div className="font-bold text-2xs uppercase text-gray-600 border-b border-gray-300 pb-1 mb-1">
              CONSIGNEE / IMPORTER (Acheteur)
            </div>
            <div className="font-bold text-sm uppercase">{data.consignee.contactName}</div>
            {data.consignee.company && (
              <div className="font-semibold uppercase">{data.consignee.company}</div>
            )}
            <div className="uppercase">{data.consignee.addressLine1}</div>
            <div className="uppercase">
              {data.consignee.city} {data.consignee.stateProvince || ''}{' '}
              {data.consignee.postalCode}, {data.consignee.countryCode}
            </div>
            <div>Tel: {data.consignee.phone}</div>
            {data.consignee.taxId && (
              <div className="font-mono text-2xs">Tax ID/EIN: {data.consignee.taxId}</div>
            )}
          </div>
        </div>

        {/* Commodity Line Items Table */}
        <div className="border border-black mb-4 overflow-hidden">
          <table className="w-full text-left text-2xs border-collapse">
            <thead className="bg-gray-100 border-b border-black font-bold uppercase">
              <tr>
                <th className="p-1.5 border-r border-black w-8 text-center">No.</th>
                <th className="p-1.5 border-r border-black w-24">HS Tariff</th>
                <th className="p-1.5 border-r border-black">Description of Goods</th>
                <th className="p-1.5 border-r border-black w-14 text-center">Qty</th>
                <th className="p-1.5 border-r border-black w-12 text-center">UOM</th>
                <th className="p-1.5 border-r border-black w-14 text-right">Net Wgt</th>
                <th className="p-1.5 border-r border-black w-16 text-right">Unit Price</th>
                <th className="p-1.5 text-right w-20">Total ({data.currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {data.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="p-1.5 border-r border-black text-center">{idx + 1}</td>
                  <td className="p-1.5 border-r border-black font-mono font-semibold">
                    {item.hsTariffCode}
                  </td>
                  <td className="p-1.5 border-r border-black">{item.description}</td>
                  <td className="p-1.5 border-r border-black text-center font-mono">
                    {item.quantity}
                  </td>
                  <td className="p-1.5 border-r border-black text-center">{item.unitOfMeasure}</td>
                  <td className="p-1.5 border-r border-black text-right font-mono">
                    {safeNum(item.netWeightKg)} KG
                  </td>
                  <td className="p-1.5 border-r border-black text-right font-mono">
                    ${safeNum(item.unitValueUsd)}
                  </td>
                  <td className="p-1.5 text-right font-mono font-bold">
                    ${safeNum(item.totalValueUsd)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary Breakdown */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-black p-2 text-2xs space-y-1">
            <div>
              TOTAL PACKAGES: <strong>{data.totalPackages}</strong>
            </div>
            <div>
              TOTAL NET WEIGHT: <strong>{safeNum(data.totalNetWeightKg)} KG</strong>
            </div>
            <div>
              TOTAL GROSS WEIGHT: <strong>{safeNum(data.totalGrossWeightKg)} KG</strong>
            </div>
          </div>
          <div className="border border-black p-2 text-2xs space-y-1 text-right">
            <div className="flex justify-between">
              <span>SUBTOTAL COMMODITIES:</span>
              <strong className="font-mono">${safeNum(data.subtotalUsd)}</strong>
            </div>
            <div className="flex justify-between">
              <span>FREIGHT / SHIPPING CHARGES:</span>
              <strong className="font-mono">${safeNum(data.freightUsd)}</strong>
            </div>
            <div className="flex justify-between">
              <span>INSURANCE &amp; SURCHARGES:</span>
              <strong className="font-mono">${safeNum(data.insuranceUsd)}</strong>
            </div>
            <div className="flex justify-between border-t border-black pt-1 text-xs font-black">
              <span>TOTAL INVOICE VALUE ({data.currency}):</span>
              <span className="font-mono">${safeNum(data.totalInvoiceValueUsd)}</span>
            </div>
          </div>
        </div>

        {/* Legal Declaration Statement & Signature */}
        <div className="border border-black p-3 text-2xs space-y-3">
          <p className="leading-tight text-gray-700 italic">
            &quot;{data.declarationStatement}&quot;
          </p>
          <div className="pt-6 flex justify-between items-end">
            <div>
              <div className="border-b border-black w-48 mb-1" />
              <div className="font-bold uppercase">
                Authorized Signatory: {data.authorizedSignatory}
              </div>
              <div className="text-gray-600">Company Representative</div>
            </div>
            <div className="text-right">
              <div>Date: {data.shipDateFormatted}</div>
              <div className="text-gray-600 font-mono text-[9px]">DOC-VERIFIED: OK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
