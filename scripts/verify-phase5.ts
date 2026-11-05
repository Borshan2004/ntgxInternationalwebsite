// scripts/verify-phase5.ts
import { BarcodeService } from '../src/services/barcodeService';
import { RateEngineService } from '../src/services/rateEngineService';
import type { FedExTrackApiResponse } from '../src/types/shipment';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export interface DiagnosticAssertionResult {
  readonly module: string;
  readonly passed: boolean;
  readonly details: string;
}

export async function runPhase5VerificationSuite(): Promise<readonly DiagnosticAssertionResult[]> {
  const results: DiagnosticAssertionResult[] = [];

  // 1. Verify 12-Digit Mod-11 Tracking Algorithm & Checksum Validation
  const generated = BarcodeService.generateTrackingArtifacts({
    originHub: 'DACA',
    destHub: 'EWR',
    destPostal: '10018',
    destCountry: 'US',
    serviceTier: 'INTERNATIONAL_PRIORITY',
    signatureOption: 'NO_SIGNATURE_REQUIRED',
  });

  const isMod11Valid = BarcodeService.validateTrackingNumber(generated.rawTrackingNumber);
  const hasValidSvg =
    generated.barcodeSvg.startsWith('<svg') && generated.barcodeSvg.endsWith('</svg>');

  results.push({
    module: 'Mod-11 Tracking & Code 128 SVG Engine',
    passed: isMod11Valid && hasValidSvg && generated.rawTrackingNumber.length === 12,
    details: `Generated TRK# ${generated.formattedTrackingNumber} | Mod-11 Valid: ${isMod11Valid}`,
  });

  // 2. Verify Volumetric Weight & Rate Calculation Engine (51x35x11 CM @ 2.50 KG Actual)
  const weightCalc = RateEngineService.calculatePackageWeightsKg({
    actualWeight: 2.5,
    weightUnit: 'KG',
    length: 51,
    width: 35,
    height: 11,
    dimensionUnit: 'CM',
  });

  // (51 * 35 * 11) / 5000 = 3.927 -> rounded up to nearest 0.5 kg = 4.00 KG
  const volumetricPassed =
    weightCalc.actualWeightKg === 2.5 &&
    weightCalc.volumetricWeightKg === 4.0 &&
    weightCalc.chargeableWeightKg === 4.0;

  results.push({
    module: 'Volumetric & Chargeable Weight Engine',
    passed: volumetricPassed,
    details: `Actual: ${weightCalc.actualWeightKg} KG | Volumetric: ${weightCalc.volumetricWeightKg} KG | Chargeable: ${weightCalc.chargeableWeightKg} KG`,
  });

  // 3. Verify Live Shipment Creation & FedEx Track REST API v1 Parity
  try {
    const createRes = await fetch(`${BASE_URL}/api/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationId: 'org-asi-bd-demo',
        action: 'FINALIZE',
        sender: {
          contactName: 'Arafat / Gunjan',
          company: 'Apparel Sourcing International Inc.',
          taxId: 'BIN-880198945',
          phone: '8801989451709',
          email: 'export@apparelsourcing.bd',
          addressLine1: 'House # 30 (3rd Floor), Apt-B3, Western Road',
          addressLine2: 'Banani DOHS',
          city: 'Dhaka',
          postalCode: '1206',
          countryCode: 'BD',
          airportHubCode: 'DACA',
          isResidential: false,
        },
        recipient: {
          contactName: 'Dakota / Salman',
          company: 'Bernette Textile Co. Ltd.',
          phone: '212-279-5526',
          email: 'imports@bernettetextile.com',
          addressLine1: '42 West 39th Street, 11th Floor',
          city: 'New York',
          stateProvince: 'NY',
          postalCode: '10018',
          countryCode: 'US',
          airportHubCode: 'EWR',
          isResidential: false,
        },
        packagingType: 'YOUR_PACKAGING',
        packages: [
          {
            packageIndex: 1,
            actualWeight: 2.5,
            weightUnit: 'KG',
            length: 51,
            width: 35,
            height: 11,
            dimensionUnit: 'CM',
            volumetricWeightKg: 4.0,
            chargeableWeightKg: 4.0,
            declaredValueUsd: 6.0,
          },
        ],
        customsContentType: 'COMMODITIES',
        commodities: [
          {
            packageCount: 1,
            description: "Sample of Men's Shorts (97% Cotton, 3% Spandex)",
            hsTariffCode: '98110060',
            quantity: 4,
            unitOfMeasure: 'PKS',
            netWeightKg: 1.8,
            unitValueUsd: 1.25,
            totalValueUsd: 5.0,
            countryOfMfr: 'BD',
          },
          {
            packageCount: 1,
            description: 'Sample of Woven Fabric Swatch (98% Cotton, 2% Spandex)',
            hsTariffCode: '6307903010',
            quantity: 1,
            unitOfMeasure: 'PKS',
            netWeightKg: 0.7,
            unitValueUsd: 1.0,
            totalValueUsd: 1.0,
            countryOfMfr: 'BD',
          },
        ],
        currency: 'USD',
        service: {
          serviceTier: 'INTERNATIONAL_PRIORITY',
          shipDate: new Date().toISOString(),
          signatureOption: 'NO_SIGNATURE_REQUIRED',
          holdAtLocation: false,
        },
        pickup: {
          isDropOff: false,
          pickupDate: new Date().toISOString().split('T')[0] ?? '2026-11-01',
          earliestTime: '08:00 AM',
          latestTime: '01:30 PM',
        },
        billing: {
          billTransportationTo: 'RECIPIENT',
          dutiesBillTo: 'RECIPIENT',
          referenceCode: 'BNI/CC/P-1780009697',
          invoiceNumber: 'ASI-25075',
          notifications: {
            clientEmail: 'export@apparelsourcing.bd',
            recipientEmail: 'imports@bernettetextile.com',
            companyEmail: 'operations@company.com',
            language: 'en',
            notifyCreated: true,
            notifyScheduled: true,
            notifyPickedUp: true,
            notifyInTransit: true,
            notifyDelivered: true,
            notifyException: true,
          },
        },
      }),
    });

    if (createRes.ok) {
      const createdJson = (await createRes.json()) as {
        readonly trackingNumber: string;
        readonly shipmentId: string;
      };

      const trackRes = await fetch(
        `${BASE_URL}/api/track/v1/trackingnumbers?trackingNumber=${createdJson.trackingNumber}`
      );
      const trackData = (await trackRes.json()) as FedExTrackApiResponse;

      results.push({
        module: 'FedEx Track REST API v1 Endpoint Parity',
        passed:
          trackRes.ok &&
          trackData.trackingNumberInfo.trackingNumber === createdJson.trackingNumber &&
          trackData.scanEvents.length > 0 &&
          trackData.scanEvents[0]?.eventType === 'OC',
        details: `Verified /api/track/v1/trackingnumbers for TRK# ${createdJson.trackingNumber}`,
      });
    }
  } catch (err) {
    results.push({
      module: 'Live HTTP API & Track Endpoint Check',
      passed: false,
      details: err instanceof Error ? err.message : 'Server unreachable on localhost:3000',
    });
  }

  return results;
}

if (require.main === module) {
  runPhase5VerificationSuite().then((results) => {
    console.log('\n📊 Diagnostic Assertion Results:');
    let allPassed = true;
    for (const r of results) {
      const icon = r.passed ? '✅' : '❌';
      console.log(`${icon} [${r.module}]: ${r.details}`);
      if (!r.passed) allPassed = false;
    }
    process.exit(allPassed ? 0 : 1);
  });
}
