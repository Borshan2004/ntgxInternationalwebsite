// src/types/landing.ts

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly isExternal?: boolean;
  readonly children?: readonly NavItem[];
}

export interface QuickStat {
  readonly value: string;
  readonly label: string;
  readonly iconName?: string;
}

export interface ShippingServiceCard {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly iconName: string;
  readonly imageUrl: string;
  readonly linkHref: string;
}

export interface ShippingCategoryItem {
  readonly title: string;
  readonly iconName: string;
  readonly description: string;
}

export interface PopularDestination {
  readonly country: string;
  readonly countryCode: string;
  readonly flagEmoji: string;
  readonly transitTime: string;
  readonly imageUrl: string;
  readonly tag: string;
}

export interface HowItWorksStep {
  readonly stepNumber: number;
  readonly title: string;
  readonly description: string;
}

export interface IndustrySolution {
  readonly title: string;
  readonly description: string;
  readonly imageUrl: string;
}

export interface TestimonialReview {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly location: string;
  readonly reviewText: string;
  readonly rating: number;
  readonly avatarUrl?: string;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface RateEstimateInput {
  originCountry: string;
  destinationCountry: string;
  shipmentType: 'DOCUMENT' | 'COMMODITY';
  weightKg: number;
}

export interface RateEstimateResult {
  readonly serviceName: string;
  readonly estimatedDays: string;
  readonly totalEstimatedUsd: number;
  readonly currency: string;
}
