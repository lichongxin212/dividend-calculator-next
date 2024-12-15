import { getStockDetails } from '@/lib/api';
import StockDividendCalculator from '@/components/StockCalculator';
import PopularStocks from '@/components/PopularStocks';
import FAQSection, { jepiFaqs } from '@/components/FAQSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "JEPI Dividend Calculator - Calculate Your JPMorgan Equity Premium Income ETF Returns",
  description: "Free JEPI dividend calculator to analyze JPMorgan Equity Premium Income ETF returns. Track monthly dividend income, calculate yields, and project future returns with our real-time calculator. Updated daily with latest JEPI data.",
  openGraph: {
    title: "JEPI Dividend Calculator | Calculate Your Monthly Dividend Income",
    description: "Calculate JEPI dividend yields, analyze monthly payments, and estimate future income with our free calculator. Get real-time data for JPMorgan Equity Premium Income ETF.",
    type: "website",
    url: "https://dividend-calculator.org/jepi",
  },
  keywords: [
    "JEPI dividend calculator",
    "JPMorgan Equity Premium Income ETF",
    "JEPI yield calculator",
    "JEPI monthly dividends",
    "JEPI ETF analysis",
    "monthly income calculator",
    "options income ETF",
    "JEPI investment returns"
  ].join(", "),
  alternates: {
    canonical: "https://dividend-calculator.org/jepi"
  }
};

export const revalidate = 3600; // 每小时重新验证一次数据

export default async function JEPIPage() {
  try {
    const stockDetails = await getStockDetails('JEPI');

    return (
      <div>
        <StockDividendCalculator stockDetail={stockDetails} />
        
        <section className="py-8 border-t border-gray-100">
          <div className="container">
            <PopularStocks />
          </div>
        </section>

        <section className="py-8 border-t border-gray-100">
          <div className="container">
          <FAQSection
              faqs={jepiFaqs}
              title="Frequently Asked Questions About JEPI Dividend Calculator"
            />
          </div>
        </section>
      </div>
    );

  } catch (error) {
    console.error('Error loading JEPI data:', error);
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Error loading JEPI data
        </h1>
        <p className="text-gray-600">
          Please try again later.
        </p>
      </div>
    );
  }
} 