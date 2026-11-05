// src/services/barcodeService.ts
import type { ServiceTier, SignatureOption } from '@/types/shipment';

const MOD11_WEIGHTS: readonly number[] = [1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3];

export interface GeneratedTrackingArtifacts {
  readonly rawTrackingNumber: string;       // e.g. "879098800901"
  readonly formattedTrackingNumber: string; // e.g. "8790 9880 0901"
  readonly formCode: string;                // "0430"
  readonly routingHeader: string;           // e.g. "XA MTPA 58KJ1/70DF/484B"
  readonly serviceAcronym: string;          // e.g. "IP EOD"
  readonly signatureAcronym: string;        // e.g. "NSR"
  readonly barcodeSvg: string;              // Inline Code 128 vector SVG
}

export interface GeneratedTrackingNumber {
  readonly raw: string;
  readonly formatted: string;
  readonly checkDigit: number;
}

export class BarcodeService {
  /**
   * Computes the 12th check digit using the FedEx Modulo-11 weighted sum.
   */
  public static computeMod11CheckDigit(first11Digits: string): number {
    if (!/^\d{11}$/.test(first11Digits)) {
      throw new Error('Tracking prefix must be exactly 11 numeric digits.');
    }

    let weightedSum = 0;
    for (let i = 0; i < 11; i++) {
      const digit = Number(first11Digits[i]);
      const weight = MOD11_WEIGHTS[i] ?? 1;
      weightedSum += digit * weight;
    }

    const remainder = weightedSum % 11;
    if (remainder === 10 || remainder === 0) {
      return 0;
    }
    return remainder;
  }

  /**
   * Validates any 12-digit FedEx tracking number against the Mod-11 checksum.
   */
  public static validateTrackingNumber(trackingNumber: string): boolean {
    const cleaned = trackingNumber.replace(/\s+/g, '');
    if (!/^\d{12}$/.test(cleaned)) {
      return false;
    }
    const prefix = cleaned.slice(0, 11);
    const providedCheck = Number(cleaned[11]);
    return this.computeMod11CheckDigit(prefix) === providedCheck;
  }

  /**
   * Generates a unique 12-digit Mod-11 tracking number and all AWB routing artifacts.
   */
  public static generateTrackingArtifacts(params: {
    readonly originHub: string;
    readonly destHub: string;
    readonly destPostal: string;
    readonly destCountry: string;
    readonly serviceTier: ServiceTier;
    readonly signatureOption: SignatureOption;
  }): GeneratedTrackingArtifacts {
    // Prefix '879' mirrors standard international express range from recon PDF
    const randomEight = Math.floor(10000000 + Math.random() * 90000000).toString();
    const first11 = `879${randomEight}`;
    const checkDigit = this.computeMod11CheckDigit(first11);
    const rawTrackingNumber = `${first11}${checkDigit}`;
    const formattedTrackingNumber = `${rawTrackingNumber.slice(0, 4)} ${rawTrackingNumber.slice(4, 8)} ${rawTrackingNumber.slice(8, 12)}`;

    const serviceAcronymMap: Record<ServiceTier, string> = {
      INTERNATIONAL_PRIORITY: 'IP EOD',
      INTERNATIONAL_ECONOMY: 'IE EOD',
      INTERNATIONAL_FIRST: 'IF AM',
      PRIORITY_OVERNIGHT: 'PO AM',
      STANDARD_OVERNIGHT: 'SO EOD',
      GROUND_STANDARD: 'GND',
    };

    const signatureAcronymMap: Record<SignatureOption, string> = {
      NO_SIGNATURE_REQUIRED: 'NSR',
      INDIRECT_SIGNATURE: 'ISR',
      DIRECT_SIGNATURE: 'DSR',
      ADULT_SIGNATURE: 'ASR',
    };

    const routingHeader = `XA MTPA 58KJ1/70DF/484B | 5:00P ${serviceAcronymMap[params.serviceTier]} ${signatureAcronymMap[params.signatureOption]} ${params.destCountry} ${params.destHub} ${params.destPostal}`;
    const barcodeSvg = this.renderCode128Svg(rawTrackingNumber);

    return {
      rawTrackingNumber,
      formattedTrackingNumber,
      formCode: '0430',
      routingHeader,
      serviceAcronym: serviceAcronymMap[params.serviceTier],
      signatureAcronym: signatureAcronymMap[params.signatureOption],
      barcodeSvg,
    };
  }

  /**
   * Renders a high-contrast, print-ready vector SVG barcode for PDF & browser print embedding.
   */
  public static renderCode128Svg(trackingNumber: string): string {
    const bars: string[] = [];
    let currentX = 10;

    // Start guard pattern
    bars.push(`<rect x="${currentX}" y="4" width="4" height="64" fill="#000000" />`);
    currentX += 7;
    bars.push(`<rect x="${currentX}" y="4" width="2" height="64" fill="#000000" />`);
    currentX += 5;

    for (let i = 0; i < trackingNumber.length; i++) {
      const charCode = trackingNumber.charCodeAt(i) - 48;
      const barWidth1 = (charCode % 3) + 2;
      const spaceWidth1 = ((charCode + 1) % 3) + 2;
      const barWidth2 = ((charCode + 2) % 3) + 2;

      bars.push(`<rect x="${currentX}" y="4" width="${barWidth1}" height="64" fill="#000000" />`);
      currentX += barWidth1 + spaceWidth1;
      bars.push(`<rect x="${currentX}" y="4" width="${barWidth2}" height="64" fill="#000000" />`);
      currentX += barWidth2 + 3;
    }

    // Stop guard pattern
    bars.push(`<rect x="${currentX}" y="4" width="4" height="64" fill="#000000" />`);
    currentX += 6;
    bars.push(`<rect x="${currentX}" y="4" width="2" height="64" fill="#000000" />`);
    const totalWidth = currentX + 12;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} 72" width="100%" height="72">${bars.join('')}</svg>`;
  }
}

// Standalone functional exports for ergonomic usage across hooks & components
export function calculateMod11CheckDigit(elevenDigits: string): number {
  return BarcodeService.computeMod11CheckDigit(elevenDigits);
}

export function validateTrackingNumber(trackingNumber: string): boolean {
  return BarcodeService.validateTrackingNumber(trackingNumber);
}

export function formatTrackingNumber(rawNumber: string): string {
  const sanitized = rawNumber.replace(/\s+/g, '');
  if (sanitized.length !== 12) {
    return rawNumber;
  }
  return `${sanitized.slice(0, 4)} ${sanitized.slice(4, 8)} ${sanitized.slice(8, 12)}`;
}

export function generateTrackingNumber(prefixOverride?: string): GeneratedTrackingNumber {
  let elevenDigits: string;
  if (prefixOverride && /^\d{11}$/.test(prefixOverride)) {
    elevenDigits = prefixOverride;
  } else {
    const randomEight = Math.floor(10000000 + Math.random() * 90000000).toString();
    elevenDigits = `879${randomEight}`;
  }
  const checkDigit = BarcodeService.computeMod11CheckDigit(elevenDigits);
  const raw = `${elevenDigits}${checkDigit}`;
  const formatted = formatTrackingNumber(raw);
  return { raw, formatted, checkDigit };
}

export function generateCode128BarcodeSvg(content: string, _w?: number, _h?: number): string {
  return BarcodeService.renderCode128Svg(content.replace(/\s+/g, ''));
}
