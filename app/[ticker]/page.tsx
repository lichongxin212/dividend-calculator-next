import { getStockDetails } from '@/lib/api';
import StockDividendCalculator from '@/components/StockCalculator';
import PopularStocks from '@/components/PopularStocks';
import FAQSection, { generalStockFaqs } from '@/components/FAQSection';
import { Metadata } from 'next';

export const revalidate = 3600; // 每小时重新验证一次数据

interface PageProps {
  params: {
    ticker: string;
  };
}

export default async function StockPage({ params }: PageProps) {
  const { ticker } = params;
  
  try {
    const stockDetails = await getStockDetails(ticker.toUpperCase());

    return (
      <div>
        <StockDividendCalculator stockDetail={stockDetails} />
        
        <section className="py-8 border-t border-gray-100">
          <div className="container">
            <FAQSection
              faqs={generalStockFaqs}
              title={`Frequently Asked Questions About ${params.ticker.toUpperCase()} Dividend Calculator`}
            />
          </div>
        </section>

        <section className="py-8 border-t border-gray-100">
          <div className="container">
            <PopularStocks />
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error(`Error loading ${ticker.toUpperCase()} data:`, error);
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Error loading {ticker.toUpperCase()} data
        </h1>
        <p className="text-gray-600">
          Please try again later.
        </p>
      </div>
    );
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ticker = params.ticker.toUpperCase();

  return {
    title: `${ticker} Dividend Calculator - Calculate ${ticker} Investment Returns`,
    description: `Free ${ticker} dividend calculator to track dividend history, calculate dividend yields, and estimate future income with real-time data.`,
    openGraph: {
      title: `${ticker} Dividend Calculator | Investment Return Analysis Tool`,
      description: `Calculate ${ticker} dividend yields and analyze payment history with our free calculator. Get real-time stock data and project future dividend income.`,
      type: "website",
      url: `https://dividend-calculator.org/${ticker.toLowerCase()}`,
    },
    keywords: [
      `${ticker} dividend calculator`,
      `${ticker} stock analysis`,
      `${ticker} yield calculator`,
      `${ticker} dividend history`,
      "dividend growth calculator",
      "investment return calculator",
      "stock dividend analysis",
      "dividend projection tool"
    ].join(", "),
    alternates: {
      canonical: `https://dividend-calculator.org/${ticker.toLowerCase()}`
    }
  };
} 