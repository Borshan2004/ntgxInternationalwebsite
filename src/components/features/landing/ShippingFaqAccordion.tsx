// src/components/features/landing/ShippingFaqAccordion.tsx
'use client';

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: 'How can I get an accurate shipping quote?',
    answer:
      'You can use our online Rate Estimator on this homepage by providing your destination country and weight in kilograms. For commercial pallet shipments or containerized sea freight, click "Request a Bulk Quote" or message our Dhaka dispatch team on WhatsApp for volume-discounted tariffs.',
  },
  {
    question: 'How do I track my international shipment in real-time?',
    answer:
      'Enter your Air Waybill (AWB) or tracking number (e.g. 879098800901) into the search box on our homepage or visit our dedicated Tracking page. You will see every milestone scan from pickup in Bangladesh through international transit flights to final delivery.',
  },
  {
    question: 'How long does international delivery take from Bangladesh?',
    answer:
      'Transit times vary by destination and service tier: Express Priority to the USA, UK, and UAE typically takes 2 to 4 business days. Economy Freight to Europe and Canada takes 4 to 6 business days. Ocean freight from Chittagong port takes between 25 to 35 days depending on the destination harbor.',
  },
  {
    question: 'What documentation is required for export shipments?',
    answer:
      'For personal parcels and document couriers, only sender/recipient IDs and address declarations are required. For commercial export goods, a Commercial Invoice, Packing List, EXP form (for RMG/commercial shipments), and certificate of origin (if requested by the destination country) are required. Our operations desk assists you with all paperwork.',
  },
  {
    question: 'What items can and cannot be shipped internationally?',
    answer:
      'We handle garments, fabrics, handicrafts, leather goods, electronics, books, printed matter, and dry packaged goods. Hazardous materials (lithium batteries without MSDS, flammable liquids, weapons, counterfeit items, and perishable non-certified foods) are restricted under IATA and national customs regulations.',
  },
  {
    question: 'Do you handle customs clearance and destination duties?',
    answer:
      'Yes! We provide full export customs clearance in Bangladesh and coordinate with destination customs authorities. Shipments can be booked with Delivery Duty Unpaid (DDU/DAP) or Delivery Duty Paid (DDP) for commercial corporate accounts.',
  },
] as const;

export function ShippingFaqAccordion(): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E51919] block mb-2">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Common Questions About International Shipping
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Everything you need to know about rates, customs clearance, transit times, and documentation.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="border border-slate-200/90 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left font-bold text-slate-900 hover:text-[#E51919] bg-slate-50/60 hover:bg-red-50/20 transition-colors"
                >
                  <span className="text-sm sm:text-base pr-4 flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#E51919] shrink-0" />
                    {faq.question}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-[#E51919]" />
                    ) : (
                      <Plus className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 py-4 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100 animate-in fade-in duration-150 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
