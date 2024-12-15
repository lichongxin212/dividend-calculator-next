'use client';

import { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const schdFaqs: FAQItem[] = [
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

const jepiFaqs: FAQItem[] = [
  {
    id: 1,
    question: "How accurate is the JEPI dividend calculator?",
    answer: "Our JEPI dividend calculator uses real-time data and historical dividend information to provide accurate calculations. The default settings reflect JEPI's historical performance, with relatively stable monthly dividends and approximately 9.3% annual price appreciation (3-year average). However, future performance may vary due to market conditions and the fund's options-based income strategy."
  },
  {
    id: 2,
    question: "How often does JEPI pay dividends?",
    answer: "JEPI pays dividends monthly (twelve times per year), which is different from many other ETFs that pay quarterly. The calculator factors in this monthly payment frequency when projecting your dividend income, providing a more detailed month-by-month distribution of expected payments."
  },
  {
    id: 3,
    question: "Why do JEPI's dividend payments fluctuate?",
    answer: "JEPI's dividend payments can vary month to month because they're derived from two sources: equity dividends and options premium income. The fund uses an options strategy to generate additional income, which can lead to variations in monthly payments depending on market conditions and options premiums received."
  },
  {
    id: 4,
    question: "What growth rates should I use for JEPI calculations?",
    answer: "For JEPI calculations, consider using around 9.3% for stock appreciation (based on 3-year historical data). For dividend growth, it's important to note that JEPI focuses on providing high current income rather than dividend growth, so conservative dividend growth assumptions may be more appropriate."
  },
  {
    id: 5,
    question: "How does JEPI's income strategy differ from traditional dividend ETFs?",
    answer: "JEPI uses a unique strategy that combines equity investments with an options overlay to generate income. Unlike traditional dividend ETFs that rely solely on dividend payments from stocks, JEPI's income comes from both stock dividends and options premiums. This strategy typically results in higher current yield but may have different growth characteristics compared to traditional dividend ETFs."
  }
];

const generalStockFaqs: FAQItem[] = [
  {
    id: 1,
    question: "How does the dividend calculator work?",
    answer: "Our dividend calculator uses real-time stock data and historical dividend information to project potential returns. It factors in your initial investment, dividend reinvestment (DRIP) options, additional periodic investments, and customizable growth rates to provide comprehensive dividend income projections."
  },
  {
    id: 2,
    question: "What is DRIP and should I enable it?",
    answer: "DRIP (Dividend Reinvestment Plan) automatically reinvests your dividend payments to purchase additional shares. Enabling DRIP can help accelerate wealth building through compound growth, but the choice depends on your investment goals. The calculator shows both scenarios to help you make an informed decision."
  },
  {
    id: 3,
    question: "How should I set growth rate expectations?",
    answer: "When setting growth rates, consider both historical performance and future outlook. For conservative estimates, you might want to use lower rates than historical averages. The calculator allows you to adjust both dividend growth and stock appreciation rates to model different scenarios."
  },
  {
    id: 4,
    question: "Can I model additional investments over time?",
    answer: "Yes, you can include regular additional investments on a monthly, quarterly, or annual basis. This feature helps you understand how dollar-cost averaging and consistent investing may impact your long-term dividend income and total returns."
  },
  {
    id: 5,
    question: "How accurate are the dividend projections?",
    answer: "While our calculator uses actual current dividend rates and stock prices, future projections are estimates based on your input parameters. Market conditions, company performance, and dividend policies can change. It's recommended to regularly review and adjust your assumptions."
  }
];

interface FAQSectionProps {
  faqs: FAQItem[];
  title: string;
}

export default function FAQSection({ faqs, title }: FAQSectionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        {title}
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

export { schdFaqs, jepiFaqs, generalStockFaqs }; 