// src/app/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import { LandingTopBar } from '@/components/features/landing/LandingTopBar';
import { LandingNavBar } from '@/components/features/landing/LandingNavBar';
import { LandingHeroSection } from '@/components/features/landing/LandingHeroSection';
import { QuickCategoryBar } from '@/components/features/landing/QuickCategoryBar';
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
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
      {/* 1. Top bar with phone, WhatsApp, email, language & portal login */}
      <LandingTopBar />

      {/* 2. Main sticky navigation bar with NTGX logo & CTAs */}
      <LandingNavBar />

      <main className="flex-1">
        {/* 3. Hero Section with aviation backdrop & stats pills */}
        <LandingHeroSection />

        {/* 4. Quick Category Icons */}
        <QuickCategoryBar />

        {/* 5. Dual interactive widget: Instant Rate Calculator + Live Tracking */}
        <QuickCalculatorAndTracker />

        {/* 6. Proven Track Record Stats (8+ Years, 215+ Countries, 10k+ Shipments) */}
        <TrustStatsCounter />

        {/* 7. Why Choose NTGX - 6 Feature Cards */}
        <WhyChooseSection />

        {/* 8. Core Services Grid (Courier, Air Cargo, Ocean Freight, Export Logistics) */}
        <ServicesGridSection />

        {/* 9. Shipment Types Selector (Documents, Samples, Parcels, Commercial Cargo) */}
        <ShipmentTypesSection />

        {/* 10. Popular Global Destinations (USA, UK, Canada, UAE, Australia, Germany) */}
        <PopularDestinations />

        {/* 11. Simple 6-Step Shipping Process */}
        <HowItWorksProcess />

        {/* 12. Industry-Specific Solutions (Garments, Jute, Leather, E-commerce) + Case Study */}
        <IndustriesServedSection />

        {/* 13. Customer Reviews & Testimonials with 5-Star Ratings */}
        <CustomerTestimonials />

        {/* 14. Global Strategic Partner Airlines & Couriers Network */}
        <GlobalPartnersNetwork />

        {/* 15. Frequently Asked Questions Accordion */}
        <ShippingFaqAccordion />

        {/* 16. Shipping Knowledge Center & Export Documentation Guides */}
        <KnowledgeCenterSection />

        {/* 17. High-Conversion Bottom Call-To-Action Banner */}
        <FinalCtaBanner />
      </main>

      {/* 18. Comprehensive Corporate Footer */}
      <LandingFooter />

      {/* 19. Sticky Floating Action Pills (WhatsApp, Rate Calculator, Call, Scroll-to-Top) */}
      <FloatingActions />
    </div>
  );
}
