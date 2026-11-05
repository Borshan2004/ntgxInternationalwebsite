'use client';

import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly variant?: 'light' | 'dark'; // 'light' is for dark backgrounds (white text), 'dark' for light backgrounds
  readonly className?: string;
}

export function BrandLogo({
  size = 'md',
  variant = 'dark',
  className = '',
}: BrandLogoProps): React.JSX.Element {
  const heightMap = {
    sm: 26,
    md: 34,
    lg: 44,
    xl: 56,
  };

  const h = heightMap[size];

  return (
    <div className={`flex items-center gap-2 select-none ${variant === 'light' ? 'brightness-105' : ''} ${className}`}>
      {/* High-res image from user upload */}
      <div className="relative inline-flex items-center">
        <Image
          src="/images/ntgx-logo.png"
          alt="NTGX Express & Freight"
          width={h * 2.8}
          height={h}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

export function BrandIconOnly({
  size = 32,
  className = '',
}: {
  readonly size?: number;
  readonly className?: string;
}): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
    >
      <rect width="48" height="48" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
      {/* Speed lines */}
      <rect x="4" y="22" width="6" height="3" rx="1.5" fill="#E51919" />
      <rect x="7" y="27" width="9" height="3" rx="1.5" fill="#E51919" />
      <rect x="2" y="32" width="5" height="3" rx="1.5" fill="#E51919" />
      <rect x="8" y="32" width="12" height="3" rx="1.5" fill="#E51919" />
      {/* 3D Box in NTGX Red */}
      <path d="M25 10 L39 18 L25 26 L11 18 Z" fill="#FF1E1E" />
      <path d="M11 18 L25 26 L25 40 L11 32 Z" fill="#CC0000" />
      <path d="M25 26 L39 18 L39 32 L25 40 Z" fill="#E51919" />
      <path d="M25 10 L32 14 L18 22 L11 18 Z" fill="#FF4444" opacity="0.6" />
      <path d="M25 26 L35 20.5 L35 30 L25 35.5 Z" fill="#FFFFFF" opacity="0.25" />
    </svg>
  );
}
