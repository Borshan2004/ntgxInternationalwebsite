// src/hooks/useRateCalculator.ts
'use client';

import { useState, useEffect, useTransition } from 'react';
import type {
  RateCalculationInput,
  RateCalculationResult,
} from '@/types/shipment';
import { calculateShippingRate } from '@/services/rateEngineService';

export interface UseRateCalculatorReturn {
  readonly result: RateCalculationResult | null;
  readonly isCalculating: boolean;
  readonly error: string | null;
  readonly recalculate: () => void;
}

export function useRateCalculator(
  input: RateCalculationInput,
  debounceMs: number = 300
): UseRateCalculatorReturn {
  const [result, setResult] = useState<RateCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    destCountryCode,
    originCountryCode,
    serviceTier,
    packagingType,
    packages,
    isResidential,
    signatureOption,
  } = input;

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        try {
          if (!destCountryCode || packages.length === 0) {
            setResult(null);
            setError(null);
            return;
          }
          const calculation = calculateShippingRate({
            destCountryCode,
            originCountryCode,
            serviceTier,
            packagingType,
            packages,
            isResidential,
            signatureOption,
          });
          setResult(calculation);
          setError(null);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Failed to calculate rate.';
          setError(msg);
          setResult(null);
        }
      });
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [
    destCountryCode,
    originCountryCode,
    serviceTier,
    packagingType,
    packages,
    isResidential,
    signatureOption,
    debounceMs,
  ]);

  const recalculate = (): void => {
    try {
      const calculation = calculateShippingRate(input);
      setResult(calculation);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Calculation error';
      setError(msg);
    }
  };

  return {
    result,
    isCalculating: isPending,
    error,
    recalculate,
  };
}
