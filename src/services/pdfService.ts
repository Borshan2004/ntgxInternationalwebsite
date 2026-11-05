// src/services/pdfService.ts
import type {
  AirWaybillDocumentData,
  AwbPageCopyType,
  CommercialInvoiceDocumentData,
  ShipmentEntityDTO,
} from '@/types/shipment';
import { formatTrackingNumber, generateCode128BarcodeSvg } from './barcodeService';

export class PdfDocumentService {
  public static readonly AWB_COPY_LABELS: readonly [
    AwbPageCopyType,
    AwbPageCopyType,
    AwbPageCopyType,
  ] = [
    'CONSIGNEE COPY - PLEASE PLACE IN FRONT OF POUCH',
    'NTGX / CARRIER AWB COPY - PLEASE PLACE BEHIND CONSIGNEE COPY',
    'SHIPPER / SENDER RECORD COPY',
  ];

  /**
   * Generates a 3-page print-ready HTML/PDF document mirroring Form 0430.
   * Can be piped directly into @react-pdf/renderer, Puppeteer, or browser print dialog.
   */
  public static renderThreePageAwbHtml(data: AirWaybillDocumentData): string {
    const pagesHtml = data.copies
      .map(
        (copyTitle, idx) => `
      <section class="awb-page" style="page-break-after: ${idx < 2 ? 'always' : 'auto'}; border: 2px solid #000; padding: 16px; font-family: 'Inter', Arial, sans-serif; color: #000; max-width: 760px; margin: 0 auto 24px auto; background: #fff;">
        <!-- Header Bar -->
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 8px;">
          <div style="font-size: 12px; line-height: 1.4;">
            <div><strong>SHIP DATE:</strong> ${data.shipDateFormatted}</div>
            <div><strong>ACTWGT:</strong> ${data.actualWeightKg} &nbsp;|&nbsp; <strong>CHGWGT:</strong> ${data.chargeableWeightKg}</div>
            <div><strong>CAD:</strong> ${data.cadNumber}</div>
            <div><strong>DIMS:</strong> ${data.dimensionsFormatted}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 24px; font-weight: 900; color: #E51919; letter-spacing: -0.5px;">NTGX <span style="color: #18181B; font-weight: 700; font-size: 16px;">EXPRESS</span></div>
            <div style="border: 2px solid #000; display: inline-block; padding: 2px 10px; font-weight: 800; font-size: 18px; margin-top: 4px;">E</div>
            <div style="font-size: 11px; font-weight: 700; margin-top: 4px;">${data.billToLabel}</div>
            <div style="font-size: 11px;"><strong>REF:</strong> ${data.referenceCode}</div>
          </div>
        </div>

        <!-- Shipper / Origin Block -->
        <div style="border-bottom: 1.5px solid #000; padding: 8px 0; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700;">
            <span>ORIGIN ID: ${data.originAirportCode}</span>
            <span>Tel: ${data.sender.phone}</span>
          </div>
          <div style="font-weight: 700; margin-top: 2px;">${data.sender.contactName.toUpperCase()}</div>
          ${data.sender.company ? `<div style="font-weight: 700;">${data.sender.company.toUpperCase()}</div>` : ''}
          <div>${data.sender.addressLine1.toUpperCase()} ${data.sender.addressLine2 ? ', ' + data.sender.addressLine2.toUpperCase() : ''}</div>
          <div>${data.sender.city.toUpperCase()}, ${data.sender.postalCode} ${data.sender.countryCode}</div>
        </div>

        <!-- Recipient / Destination Block -->
        <div style="border-bottom: 2px solid #000; padding: 10px 0; font-size: 14px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700;">
            <span>TO: ${data.recipient.contactName.toUpperCase()}</span>
            <span>Tel: ${data.recipient.phone}</span>
          </div>
          ${data.recipient.company ? `<div style="font-weight: 800; font-size: 15px;">${data.recipient.company.toUpperCase()}</div>` : ''}
          <div style="margin-top: 2px;">${data.recipient.addressLine1.toUpperCase()} ${data.recipient.addressLine2 ? ', ' + data.recipient.addressLine2.toUpperCase() : ''}</div>
          <div style="font-size: 16px; font-weight: 800; margin-top: 4px;">
            ${data.recipient.city.toUpperCase()} ${data.recipient.stateProvince ?? ''} ${data.recipient.postalCode}, ${data.recipient.countryCode}
          </div>
        </div>

        <!-- Routing & Hub Code Strip -->
        <div style="border-bottom: 2px solid #000; padding: 8px 0; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-family: monospace; font-size: 13px; font-weight: 700;">${data.routingHeader}</div>
          <div style="font-size: 20px; font-weight: 900; letter-spacing: 1px;">
            ${data.recipient.countryCode}-${data.destAirportCode} ${data.recipient.postalCode}
          </div>
        </div>

        <!-- Code 128 Barcode & Tracking Number -->
        <div style="border-bottom: 2px solid #000; padding: 14px 0; text-align: center;">
          <div style="max-width: 520px; margin: 0 auto;">${data.linearBarcodeSvg}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding: 0 24px;">
            <span style="font-size: 18px; font-weight: 800; letter-spacing: 1.5px;">TRK# ${data.trackingNumberFormatted}</span>
            <span style="font-size: 13px; font-weight: 700; border: 1px solid #000; padding: 2px 6px;">FORM ${data.formCode}</span>
          </div>
        </div>

        <!-- Commodity & Customs Summary -->
        <div style="border-bottom: 2px solid #000; padding: 8px 0; font-size: 11px;">
          <div style="font-weight: 700; margin-bottom: 4px;">COMMODITY DESCRIPTION:</div>
          ${data.commoditySummaryLines.map((line, i) => `<div>DESC${i + 1}: ${line}</div>`).join('')}
          <div style="display: flex; justify-content: space-between; font-weight: 700; margin-top: 6px;">
            <span>CUSTOMS VALUE: ${data.customsValueFormatted}</span>
            <span>CTRY/TERR MFR: ${data.countryOfManufacture}</span>
          </div>
        </div>

        <!-- Copy Footer Banner -->
        <div style="padding-top: 10px; text-align: center; font-size: 13px; font-weight: 900; letter-spacing: 0.5px; background: #F3F4F6; padding-bottom: 8px;">
          PAGE ${idx + 1} OF 3 — ${copyTitle}
        </div>
      </section>
    `
      )
      .join('\n');

    return `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>AWB ${data.trackingNumberFormatted}</title><style>@media print { body { margin: 0; padding: 0; } .awb-page { border: none !important; margin: 0 !important; width: 100% !important; } }</style></head><body>${pagesHtml}</body></html>`;
  }

  /**
   * Renders the Customs Commercial Invoice HTML/PDF document with HS Tariff table and legal signature block.
   */
  public static renderCommercialInvoiceHtml(invoice: CommercialInvoiceDocumentData): string {
    const rowsHtml = invoice.items
      .map(
        (item) => `
      <tr>
        <td style="border: 1px solid #000; padding: 6px; text-align: center;">${item.packageCount}</td>
        <td style="border: 1px solid #000; padding: 6px; text-align: right;">${item.quantity.toFixed(2)}</td>
        <td style="border: 1px solid #000; padding: 6px; text-align: center;">${item.unitOfMeasure}</td>
        <td style="border: 1px solid #000; padding: 6px;">${item.description}</td>
        <td style="border: 1px solid #000; padding: 6px; font-family: monospace;">${item.hsTariffCode}</td>
        <td style="border: 1px solid #000; padding: 6px; text-align: center;">${item.countryOfMfr}</td>
        <td style="border: 1px solid #000; padding: 6px; text-align: right;">$${item.unitValueUsd.toFixed(2)}</td>
        <td style="border: 1px solid #000; padding: 6px; text-align: right; font-weight: 700;">$${item.totalValueUsd.toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    return `<!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /><title>Commercial Invoice - ${invoice.invoiceNumber}</title><style>@media print { body { margin: 0; padding: 0; } }</style></head>
      <body style="font-family: 'Inter', Arial, sans-serif; color: #000; max-width: 800px; margin: 0 auto; padding: 20px; font-size: 12px; background: #fff;">
        <h1 style="text-align: center; font-size: 20px; letter-spacing: 1px; border-bottom: 2px solid #000; padding-bottom: 8px;">COMMERCIAL INVOICE</h1>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
          <div><strong>WAYBILL / TRACKING NO:</strong> ${invoice.trackingNumberFormatted}</div>
          <div><strong>INVOICE NO:</strong> ${invoice.invoiceNumber}</div>
          <div><strong>SHIP DATE:</strong> ${invoice.shipDateFormatted}</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div style="border: 1px solid #000; padding: 10px;">
            <div style="font-weight: 800; border-bottom: 1px solid #000; margin-bottom: 6px;">EXPORTER / SHIPPER</div>
            <div><strong>${invoice.exporter.company ?? invoice.exporter.contactName}</strong></div>
            <div>Attn: ${invoice.exporter.contactName}</div>
            <div>${invoice.exporter.addressLine1}</div>
            <div>${invoice.exporter.city}, ${invoice.exporter.postalCode}, ${invoice.exporter.countryCode}</div>
            <div>Tel: ${invoice.exporter.phone} | Tax ID: ${invoice.exporter.taxId ?? 'N/A'}</div>
          </div>
          <div style="border: 1px solid #000; padding: 10px;">
            <div style="font-weight: 800; border-bottom: 1px solid #000; margin-bottom: 6px;">CONSIGNEE / RECIPIENT</div>
            <div><strong>${invoice.consignee.company ?? invoice.consignee.contactName}</strong></div>
            <div>Attn: ${invoice.consignee.contactName}</div>
            <div>${invoice.consignee.addressLine1}</div>
            <div>${invoice.consignee.city}, ${invoice.consignee.postalCode}, ${invoice.consignee.countryCode}</div>
            <div>Tel: ${invoice.consignee.phone} | Tax ID: ${invoice.consignee.taxId ?? 'N/A'}</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <thead>
            <tr style="background: #F3F4F6;">
              <th style="border: 1px solid #000; padding: 6px;">Pkgs</th>
              <th style="border: 1px solid #000; padding: 6px;">Units</th>
              <th style="border: 1px solid #000; padding: 6px;">UOM</th>
              <th style="border: 1px solid #000; padding: 6px;">Description of Goods</th>
              <th style="border: 1px solid #000; padding: 6px;">HS Tariff Code</th>
              <th style="border: 1px solid #000; padding: 6px;">C/O</th>
              <th style="border: 1px solid #000; padding: 6px;">Unit Value (${invoice.currency})</th>
              <th style="border: 1px solid #000; padding: 6px;">Total Value (${invoice.currency})</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>

        <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
          <div style="width: 260px; border: 1px solid #000; padding: 10px;">
            <div style="display: flex; justify-content: space-between;"><span>Total Net Weight:</span><span>${invoice.totalNetWeightKg.toFixed(2)} KG</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Total Gross Weight:</span><span>${invoice.totalGrossWeightKg.toFixed(2)} KG</span></div>
            <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 14px; border-top: 1px solid #000; margin-top: 6px; padding-top: 6px;">
              <span>INVOICE TOTAL:</span><span>$${invoice.totalInvoiceValueUsd.toFixed(2)} ${invoice.currency}</span>
            </div>
          </div>
        </div>

        <div style="border-top: 1.5px solid #000; padding-top: 12px; font-size: 11px;">
          <p>${invoice.declarationStatement}</p>
          <div style="margin-top: 28px; display: flex; justify-content: space-between;">
            <span><strong>Authorized Signatory:</strong> ${invoice.authorizedSignatory}</span>
            <span><strong>Date:</strong> ${invoice.shipDateFormatted}</span>
          </div>
        </div>
      </body>
    </html>`;
  }
}

/**
 * Formats a JavaScript Date or ISO string into standard FedEx AWB date format: "23OCT26"
 */
export function formatFedExDate(dateInput?: Date | string | number | null): string {
  if (!dateInput) return '23OCT26';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (!date || isNaN(date.getTime())) return '23OCT26';
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = String(date.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
}

/**
 * Transforms a Shipment entity into structured AirWaybillDocumentData ready for rendering.
 */
export function buildAirWaybillData(
  shipment: ShipmentEntityDTO
): AirWaybillDocumentData {
  const formattedTrk = formatTrackingNumber(shipment.trackingNumber);
  const barcodeSvg =
    shipment.barcodeSvg || generateCode128BarcodeSvg(shipment.trackingNumber);

  const copies = PdfDocumentService.AWB_COPY_LABELS;

  const firstPkg = shipment.packages[0];
  const dimsFormatted = firstPkg
    ? `${Number(firstPkg.length).toFixed(0)}x${Number(firstPkg.width).toFixed(0)}x${Number(firstPkg.height).toFixed(0)} ${firstPkg.dimensionUnit}`
    : '51x35x11 CM';

  const commoditySummaryLines = shipment.commodities.map(
    (c, idx) => `DESC${idx + 1}: ${c.description} (HS: ${c.hsTariffCode})`
  );

  let signatureAcronym = 'NSR';
  if (shipment.signatureOption === 'DIRECT_SIGNATURE') {
    signatureAcronym = 'DSR';
  } else if (shipment.signatureOption === 'ADULT_SIGNATURE') {
    signatureAcronym = 'ASR';
  } else if (shipment.signatureOption === 'INDIRECT_SIGNATURE') {
    signatureAcronym = 'ISR';
  }

  const serviceCodeAcronym =
    shipment.serviceTier === 'INTERNATIONAL_PRIORITY'
      ? 'IP EOD'
      : shipment.serviceTier === 'INTERNATIONAL_ECONOMY'
      ? 'IE EOD'
      : 'STD';

  const billToLabel =
    shipment.billTransportationTo === 'RECIPIENT'
      ? 'BILL RECIPIENT'
      : shipment.billTransportationTo === 'THIRD_PARTY'
      ? 'BILL THIRD PARTY'
      : 'BILL SENDER';

  return {
    trackingNumberFormatted: formattedTrk,
    trackingNumberRaw: shipment.trackingNumber,
    formCode: shipment.formCode || '0430',
    shipDateFormatted: formatFedExDate(shipment.shipDate),
    cadNumber: shipment.cadNumber || '260504077/INET4535',
    actualWeightKg: `${Number(shipment.totalActualWeightKg || 1).toFixed(2)} KG`,
    chargeableWeightKg: `${Number(shipment.totalChargeableWgtKg || 1).toFixed(2)} KG`,
    dimensionsFormatted: dimsFormatted,
    billToLabel,
    referenceCode: shipment.referenceCode || 'N/A',
    originAirportCode: shipment.originAirportCode || 'DACA',
    destAirportCode: shipment.destAirportCode || 'EWR',
    routingHeader: shipment.routingCode || `XA MTPA 58KJ1/70DF/484B`,
    serviceCodeAcronym,
    signatureAcronym,
    sender: {
      contactName: shipment.senderName,
      company: shipment.senderCompany ?? undefined,
      taxId: shipment.senderTaxId ?? undefined,
      phone: shipment.senderPhone,
      email: shipment.senderEmail,
      addressLine1: shipment.senderAddress1,
      addressLine2: shipment.senderAddress2 ?? undefined,
      city: shipment.senderCity,
      stateProvince: shipment.senderState ?? undefined,
      postalCode: shipment.senderPostal,
      countryCode: shipment.senderCountry,
      isResidential: false,
    },
    recipient: {
      contactName: shipment.recipientName,
      company: shipment.recipientCompany ?? undefined,
      taxId: shipment.recipientTaxId ?? undefined,
      phone: shipment.recipientPhone,
      email: shipment.recipientEmail,
      addressLine1: shipment.recipientAddress1,
      addressLine2: shipment.recipientAddress2 ?? undefined,
      city: shipment.recipientCity,
      stateProvince: shipment.recipientState ?? undefined,
      postalCode: shipment.recipientPostal,
      countryCode: shipment.recipientCountry,
      isResidential: shipment.isResidential,
    },
    commoditySummaryLines,
    customsValueFormatted: `${Number(shipment.totalCustomsValue || 0).toFixed(2)} ${shipment.currency || 'USD'}`,
    countryOfManufacture: shipment.commodities?.[0]?.countryOfMfr ?? 'BD',
    linearBarcodeSvg: barcodeSvg,
    copies,
  };
}

/**
 * Transforms a Shipment entity into structured CommercialInvoiceDocumentData.
 */
export function buildCommercialInvoiceData(
  shipment: ShipmentEntityDTO
): CommercialInvoiceDocumentData {
  const formattedTrk = formatTrackingNumber(shipment.trackingNumber || '');

  const commodities = (shipment.commodities || []).map((c) => ({
    packageCount: c.packageCount || 1,
    description: c.description || 'Commodity goods',
    hsTariffCode: c.hsTariffCode || '98110060',
    quantity: Number(c.quantity) || 1,
    unitOfMeasure: (c.unitOfMeasure as 'PKS' | 'PCS' | 'KGS' | 'DOZ' | 'MTR') || 'PCS',
    netWeightKg: Number(c.netWeightKg) || 0,
    unitValueUsd: Number(c.unitValue) || 0,
    totalValueUsd: Number(c.totalValue) || 0,
    countryOfMfr: c.countryOfMfr || 'BD',
  }));

  const subtotal = commodities.reduce((acc, curr) => acc + curr.totalValueUsd, 0);
  const totalNet = commodities.reduce((acc, curr) => acc + curr.netWeightKg, 0);

  return {
    trackingNumberFormatted: formattedTrk,
    invoiceNumber: shipment.invoiceNumber || `INV-${(shipment.trackingNumber || '').slice(-6)}`,
    poNumber: shipment.poNumber ?? undefined,
    shipDateFormatted: formatFedExDate(shipment.shipDate),
    exporter: {
      contactName: shipment.senderName,
      company: shipment.senderCompany ?? undefined,
      taxId: shipment.senderTaxId ?? undefined,
      phone: shipment.senderPhone,
      email: shipment.senderEmail,
      addressLine1: shipment.senderAddress1,
      addressLine2: shipment.senderAddress2 ?? undefined,
      city: shipment.senderCity,
      stateProvince: shipment.senderState ?? undefined,
      postalCode: shipment.senderPostal,
      countryCode: shipment.senderCountry,
      isResidential: false,
    },
    consignee: {
      contactName: shipment.recipientName,
      company: shipment.recipientCompany ?? undefined,
      taxId: shipment.recipientTaxId ?? undefined,
      phone: shipment.recipientPhone,
      email: shipment.recipientEmail,
      addressLine1: shipment.recipientAddress1,
      addressLine2: shipment.recipientAddress2 ?? undefined,
      city: shipment.recipientCity,
      stateProvince: shipment.recipientState ?? undefined,
      postalCode: shipment.recipientPostal,
      countryCode: shipment.recipientCountry,
      isResidential: shipment.isResidential,
    },
    billToParty: (shipment.billTransportationTo || 'SENDER').replace(/_/g, ' '),
    items: commodities,
    totalPackages: shipment.packageCount || 1,
    totalNetWeightKg: Number(totalNet.toFixed(2)),
    totalGrossWeightKg: Number(Number(shipment.totalActualWeightKg || totalNet || 1).toFixed(2)),
    subtotalUsd: Number(subtotal.toFixed(2)),
    freightUsd: Number(Number(shipment.totalShippingCostUsd || 0).toFixed(2)),
    insuranceUsd: Number(Number(shipment.surchargeAmountUsd || 0).toFixed(2)),
    totalInvoiceValueUsd: Number((subtotal + Number(shipment.totalShippingCostUsd || 0)).toFixed(2)),
    currency: shipment.currency || 'USD',
    declarationStatement:
      'I declare that the information contained in this invoice is true and correct, and that the contents of this shipment are as stated above.',
    authorizedSignatory: shipment.senderName || 'Authorized Signatory',
  };
}
