import { getStockDetails } from '@/lib/api';
import StockDividendCalculator from '@/components/StockCalculator';
import PopularStocks from '@/components/PopularStocks';
import SCHDFAQSection from '@/components/FAQSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "SCHD Dividend Calculator - Calculate Your SCHD Investment Returns",
  description: "Free SCHD dividend calculator to analyze Schwab US Dividend Equity ETF returns over time. Track dividend history, calculate yields, estimate monthly income, and project future dividend growth. Updated daily with latest SCHD data.",
  openGraph: {
    title: "SCHD Dividend Calculator | Calculate Your SCHD Investment Returns",
    description: "Calculate SCHD dividend yields, analyze payment history, and estimate future income with our free dividend calculator. Get real-time data for Schwab US Dividend Equity ETF.",
    type: "website",
    url: "https://dividend-calculator.org/schd",
  },
  keywords: [
    "SCHD dividend calculator",
    "Schwab US Dividend Equity ETF",
    "SCHD yield calculator",
    "SCHD dividend history",
    "SCHD ETF analysis",
    "dividend growth calculator",
    "monthly dividend income",
    "SCHD investment returns"
  ].join(", "),
  alternates: {
    canonical: "https://dividend-calculator.org/schd"
  }
};

export const revalidate = 3600; // 每小时重新验证一次数据


export default async function SCHDPage() {
  try {
    const stockDetails = await getStockDetails('SCHD');
    stockDetails.dividendGrowthRate = 10.5;
    stockDetails.stockAppreciation = 11.4;

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
            <SCHDFAQSection />
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error loading SCHD data:', error);
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Error loading SCHD data
        </h1>
        <p className="text-gray-600">
          Please try again later.
        </p>
      </div>
    );
  }
} 