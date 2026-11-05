// src/services/rateEngineService.ts
import type {
  RateCalculationInput,
  RateCalculationResult,
  ServiceTier,
  SignatureOption,
} from '@/types/shipment';

interface ZoneDefinition {
  readonly zoneCode: string;
  readonly zoneName: string;
  readonly destAirportHub: string;
  readonly baseRateUsd: number;
  readonly ratePerKgUsd: number;
  readonly transitMinDays: number;
  readonly transitMaxDays: number;
}

const DEFAULT_ZONE_MAP: Record<string, ZoneDefinition> = {
  BD: {
    zoneCode: 'ZONE_1',
    zoneName: 'Domestic Bangladesh',
    destAirportHub: 'DACA',
    baseRateUsd: 8.5,
    ratePerKgUsd: 2.25,
    transitMinDays: 1,
    transitMaxDays: 2,
  },
  AE: {
    zoneCode: 'ZONE_3',
    zoneName: 'Middle East & GCC Hub',
    destAirportHub: 'DXB',
    baseRateUsd: 34.0,
    ratePerKgUsd: 9.5,
    transitMinDays: 2,
    transitMaxDays: 4,
  },
  GB: {
    zoneCode: 'ZONE_5',
    zoneName: 'United Kingdom & Western Europe',
    destAirportHub: 'LHR',
    baseRateUsd: 46.0,
    ratePerKgUsd: 12.75,
    transitMinDays: 3,
    transitMaxDays: 5,
  },
  DE: {
    zoneCode: 'ZONE_5',
    zoneName: 'Western Europe (Germany)',
    destAirportHub: 'FRA',
    baseRateUsd: 46.0,
    ratePerKgUsd: 12.75,
    transitMinDays: 3,
    transitMaxDays: 5,
  },
  US: {
    zoneCode: 'ZONE_7',
    zoneName: 'North America (US & Canada)',
    destAirportHub: 'EWR',
    baseRateUsd: 54.0,
    ratePerKgUsd: 14.5,
    transitMinDays: 3,
    transitMaxDays: 5,
  },
  CA: {
    zoneCode: 'ZONE_7',
    zoneName: 'North America (Canada)',
    destAirportHub: 'YYZ',
    baseRateUsd: 54.0,
    ratePerKgUsd: 14.5,
    transitMinDays: 3,
    transitMaxDays: 5,
  },
};

const SERVICE_MULTIPLIERS: Record<ServiceTier, number> = {
  INTERNATIONAL_FIRST: 1.65,
  INTERNATIONAL_PRIORITY: 1.4,
  PRIORITY_OVERNIGHT: 1.35,
  STANDARD_OVERNIGHT: 1.25,
  INTERNATIONAL_ECONOMY: 1.0,
  GROUND_STANDARD: 0.75,
};

const SIGNATURE_FEES_USD: Record<SignatureOption, number> = {
  NO_SIGNATURE_REQUIRED: 0.0,
  INDIRECT_SIGNATURE: 3.5,
  DIRECT_SIGNATURE: 5.5,
  ADULT_SIGNATURE: 7.0,
};

export class RateEngineService {
  private static readonly METRIC_DIM_DIVISOR = 5000;
  private static readonly IMPERIAL_DIM_DIVISOR = 139;
  private static readonly LB_TO_KG_FACTOR = 0.45359237;
  private static readonly FUEL_SURCHARGE_RATE = 0.145; // 14.5%
  private static readonly RESIDENTIAL_FEE_USD = 4.5;

  public static calculatePackageWeightsKg(pkg: {
    readonly actualWeight: number;
    readonly weightUnit: 'KG' | 'LB';
    readonly length: number;
    readonly width: number;
    readonly height: number;
    readonly dimensionUnit: 'CM' | 'IN';
  }): {
    readonly actualWeightKg: number;
    readonly volumetricWeightKg: number;
    readonly chargeableWeightKg: number;
  } {
    const actualWeightKg =
      pkg.weightUnit === 'LB'
        ? Number((pkg.actualWeight * this.LB_TO_KG_FACTOR).toFixed(2))
        : Number(pkg.actualWeight.toFixed(2));

    const rawVolumetric =
      pkg.dimensionUnit === 'IN'
        ? ((pkg.length * pkg.width * pkg.height) / this.IMPERIAL_DIM_DIVISOR) *
          this.LB_TO_KG_FACTOR
        : (pkg.length * pkg.width * pkg.height) / this.METRIC_DIM_DIVISOR;

    // Carrier standard: round up to nearest 0.5 kg increment
    const volumetricWeightKg = Number((Math.ceil(rawVolumetric * 2) / 2).toFixed(2));
    const chargeableWeightKg = Math.max(actualWeightKg, volumetricWeightKg);

    return {
      actualWeightKg,
      volumetricWeightKg,
      chargeableWeightKg,
    };
  }

  public static calculateShipmentRate(input: RateCalculationInput): RateCalculationResult {
    const destCode = input.destCountryCode.toUpperCase();
    const zone: ZoneDefinition = DEFAULT_ZONE_MAP[destCode] ?? {
      zoneCode: 'ZONE_8',
      zoneName: 'Rest of World International',
      destAirportHub: 'FRA',
      baseRateUsd: 62.0,
      ratePerKgUsd: 16.0,
      transitMinDays: 4,
      transitMaxDays: 7,
    };

    let totalActualWeightKg = 0;
    let totalVolumetricWeightKg = 0;
    let totalDeclaredValueUsd = 0;

    for (const pkg of input.packages) {
      const weights = this.calculatePackageWeightsKg(pkg);
      totalActualWeightKg += weights.actualWeightKg;
      totalVolumetricWeightKg += weights.volumetricWeightKg;
      totalDeclaredValueUsd += pkg.declaredValueUsd;
    }

    const totalChargeableWeightKg = Number(
      Math.max(totalActualWeightKg, totalVolumetricWeightKg).toFixed(2)
    );

    const additionalKg = Math.max(0, totalChargeableWeightKg - 0.5);
    const rawZoneCharge = zone.baseRateUsd + additionalKg * zone.ratePerKgUsd;
    const multiplier = SERVICE_MULTIPLIERS[input.serviceTier];
    const baseChargeUsd = Number((rawZoneCharge * multiplier).toFixed(2));

    const fuelSurchargeUsd = Number((baseChargeUsd * this.FUEL_SURCHARGE_RATE).toFixed(2));
    const residentialFeeUsd = input.isResidential ? this.RESIDENTIAL_FEE_USD : 0.0;
    const signatureFeeUsd = SIGNATURE_FEES_USD[input.signatureOption];

    // Insurance: $1.00 per $100 declared value over $100 free carrier liability
    const insurableExcess = Math.max(0, totalDeclaredValueUsd - 100);
    const insuranceFeeUsd = Number((Math.ceil(insurableExcess / 100) * 1.0).toFixed(2));

    const totalSurchargesUsd = Number(
      (fuelSurchargeUsd + residentialFeeUsd + signatureFeeUsd + insuranceFeeUsd).toFixed(2)
    );
    const totalShippingCostUsd = Number((baseChargeUsd + totalSurchargesUsd).toFixed(2));

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + zone.transitMaxDays);

    return {
      zoneCode: zone.zoneCode,
      zoneName: zone.zoneName,
      destAirportHub: zone.destAirportHub,
      totalActualWeightKg: Number(totalActualWeightKg.toFixed(2)),
      totalVolumetricWeightKg: Number(totalVolumetricWeightKg.toFixed(2)),
      totalChargeableWeightKg,
      baseChargeUsd,
      fuelSurchargeUsd,
      residentialFeeUsd,
      signatureFeeUsd,
      insuranceFeeUsd,
      totalSurchargesUsd,
      totalShippingCostUsd,
      currency: 'USD',
      estimatedDeliveryMinDays: zone.transitMinDays,
      estimatedDeliveryMaxDays: zone.transitMaxDays,
      estimatedDeliveryDate: estDate.toISOString().split('T')[0],
    };
  }
}

// Standalone functional exports
export function calculateVolumetricWeightKg(
  length: number,
  width: number,
  height: number,
  unit: 'CM' | 'IN'
): number {
  const res = RateEngineService.calculatePackageWeightsKg({
    actualWeight: 0,
    weightUnit: 'KG',
    length,
    width,
    height,
    dimensionUnit: unit,
  });
  return res.volumetricWeightKg;
}

export function calculateShippingRate(input: RateCalculationInput): RateCalculationResult {
  return RateEngineService.calculateShipmentRate(input);
}
