// src/components/features/documents/BarcodeRenderer.tsx
'use client';

import React from 'react';
import { generateCode128BarcodeSvg, formatTrackingNumber } from '@/services/barcodeService';

export interface BarcodeRendererProps {
  readonly trackingNumber: string;
  readonly width?: number;
  readonly height?: number;
  readonly showText?: boolean;
  readonly className?: string;
}

export const BarcodeRenderer: React.FC<BarcodeRendererProps> = ({
  trackingNumber,
  width = 320,
  height = 54,
  showText = true,
  className,
}) => {
  const svgMarkup = generateCode128BarcodeSvg(trackingNumber, width, height);
  const formatted = formatTrackingNumber(trackingNumber);

  return (
    <div className={`inline-flex flex-col items-center select-none ${className || ''}`}>
      <div
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
        className="overflow-hidden"
      />
      {showText && (
        <span className="font-mono text-xs font-bold tracking-widest text-neutral-textPrimary mt-1">
          TRK# {formatted}
        </span>
      )}
    </div>
  );
};
