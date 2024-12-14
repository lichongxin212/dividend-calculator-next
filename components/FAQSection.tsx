'use client';

import { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: "How accurate is the SCHD dividend calculator?",
    answer: "Our SCHD dividend calculator uses real-time data and historical dividend information to provide accurate calculations. The default settings are based on SCHD's historical performance: 10.5% dividend growth (5-year average) and 11.4% stock appreciation (10-year average). However, future performance may vary due to market conditions and changes in SCHD's dividend policy."
  },
  {
    id: 2,
    question: "What is DRIP and how does it affect my dividend returns?",
    answer: "DRIP (Dividend Reinvestment Plan) automatically reinvests your dividend payments to purchase additional shares. The calculator shows both DRIP and non-DRIP scenarios, allowing you to compare the compound growth effect of reinvesting dividends versus receiving cash payments."
  },
  {
    id: 3,
    question: "How often does SCHD pay dividends?",
    answer: "SCHD pays dividends quarterly (four times per year). The calculator automatically factors in this payment frequency when projecting your dividend income and shows the distribution of payments across different months."
  },
  {
    id: 4,
    question: "Can I calculate returns with additional periodic investments?",
    answer: "Yes, the calculator allows you to include regular additional investments (monthly, quarterly, or annually) in your calculations. This helps you see how dollar-cost averaging and consistent investing can impact your long-term dividend income and total returns."
  },
  {
    id: 5,
    question: "What growth rates should I use for SCHD calculations?",
    answer: "Based on historical data, SCHD has shown strong performance with a 10.5% dividend growth rate (5-year average) and 11.4% stock appreciation (10-year average). However, for conservative estimates, consider using lower rates like 8.4% (SCHD's 5-year price appreciation), as past performance doesn't guarantee future results."
  }
];

export default function SCHDFAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        Frequently Asked Questions About the SCHD Dividend Calculator
      </h2>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-lg shadow-sm">
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-800 pr-8">{faq.question}</h3>
              <svg
                className={`w-6 h-6 text-gray-500 transform transition-transform ${
                  openId === faq.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openId === faq.id && (
              <div className="px-6 pb-6">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 