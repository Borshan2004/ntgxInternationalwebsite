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
    <section id="faq" className="py-20 lg:py-24 bg-white dark:bg-[#0B0F19] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E51B23]">
            <span className="w-1.5 h-3.5 rounded-full bg-[#E51B23]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Common Questions About International Shipping
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal">
            Everything you need to know about rates, customs clearance, transit times, and export paperwork.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 bg-white dark:bg-[#111827]"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left font-bold text-slate-900 dark:text-slate-100 hover:text-[#E51B23] bg-slate-50/60 dark:bg-[#111827] hover:bg-red-50/20 dark:hover:bg-red-950/20 transition-colors"
                >
                  <span className="text-sm sm:text-base pr-4 flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#E51B23] shrink-0" />
                    {faq.question}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-[#E51B23]" />
                    ) : (
                      <Plus className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 py-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-[#161F30] border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-150 font-normal">
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
