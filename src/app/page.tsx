// src/app/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { LandingTopBar } from '@/components/features/landing/LandingTopBar';
import { LandingNavBar } from '@/components/features/landing/LandingNavBar';
import { LandingHeroSection } from '@/components/features/landing/LandingHeroSection';
import { QuickCalculatorAndTracker } from '@/components/features/landing/QuickCalculatorAndTracker';
import { TrustStatsCounter } from '@/components/features/landing/TrustStatsCounter';
import { WhyChooseSection } from '@/components/features/landing/WhyChooseSection';
import { ServicesGridSection } from '@/components/features/landing/ServicesGridSection';
import { ShipmentTypesSection } from '@/components/features/landing/ShipmentTypesSection';
import { PopularDestinations } from '@/components/features/landing/PopularDestinations';
import { HowItWorksProcess } from '@/components/features/landing/HowItWorksProcess';
import { IndustriesServedSection } from '@/components/features/landing/IndustriesServedSection';
import { CustomerTestimonials } from '@/components/features/landing/CustomerTestimonials';
import { GlobalPartnersNetwork } from '@/components/features/landing/GlobalPartnersNetwork';
import { ShippingFaqAccordion } from '@/components/features/landing/ShippingFaqAccordion';
import { KnowledgeCenterSection } from '@/components/features/landing/KnowledgeCenterSection';
import { FinalCtaBanner } from '@/components/features/landing/FinalCtaBanner';
import { LandingFooter } from '@/components/features/landing/LandingFooter';
import { FloatingActions } from '@/components/features/landing/FloatingActions';

export const metadata: Metadata = {
  title: 'NTGX Express & Freight Logistics | International Courier & Export Shipping from Bangladesh',
  description:
    'Reliable international courier, air freight forwarding, customs clearance, and garment export logistics from Bangladesh to 215+ countries worldwide.',
};

export default function HomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-[#E51B23] selection:text-white transition-colors duration-200">
      {/* 1. Top bar with phone, WhatsApp, email, language & portal login */}
      <LandingTopBar />

      {/* 2. Main sticky navigation bar with NTGX logo & glass backdrop */}
      <LandingNavBar />

      <main className="flex-1">
        {/* 3. Hero Section with cinematic container port & flight telemetry */}
        <LandingHeroSection />

        {/* 4. Floating white shipping cards: Rate Calculator + Live Tracking */}
        <QuickCalculatorAndTracker />

        {/* 5. Proven Track Record Stats (8+ Years, 215+ Countries, 10k+ Shipments) */}
        <TrustStatsCounter />

        {/* 6. Why Choose NTGX - 2-Column with 3 White Cards & Global Network graphic */}
        <WhyChooseSection />

        {/* 7. Core Services Grid (Photorealistic cards: Courier, Air Cargo, Ocean, Export) */}
        <ServicesGridSection />

        {/* 8. Shipment Types Selector (Documents, Samples, Parcels, Commercial Cargo) */}
        <ShipmentTypesSection />

        {/* 9. Popular Global Destinations (Cinematic Navy World Map with Red Flight Arcs) */}
        <PopularDestinations />

        {/* 10. Simple 6-Step Shipping Process Timeline */}
        <HowItWorksProcess />

        {/* 11. Industry-Specific Solutions (Real Garments & Machinery Photos + Case Study) */}
        <IndustriesServedSection />

        {/* 12. Customer Reviews & Testimonials with 5-Star Ratings */}
        <CustomerTestimonials />

        {/* 13. Global Strategic Partner Airlines & Couriers Network */}
        <GlobalPartnersNetwork />

        {/* 14. Frequently Asked Questions Accordion */}
        <ShippingFaqAccordion />

        {/* 15. Shipping Knowledge Center & Export Documentation Guides */}
        <KnowledgeCenterSection />

        {/* 16. Cinematic Navy Bottom Call-To-Action Banner */}
        <FinalCtaBanner />
      </main>

      {/* 17. Comprehensive Deep Navy Corporate Footer */}
      <LandingFooter />

      {/* 18. Sticky Floating Action Pills (WhatsApp, Rate Calculator, Call, Scroll-to-Top) */}
      <FloatingActions />
    </div>
  );
}