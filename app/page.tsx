import StockSearch from '@/components/StockSearch';
import PopularStocks from '@/components/PopularStocks';
import FAQSection, { generalStockFaqs } from '@/components/FAQSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Dividend Calculator - Calculate Stock Dividend Returns and Income Easily",
  description: "Calculate your dividends growth easily with our free calculator. Input investment amount, analyze dividend yields, and estimate future earnings. Track dividend growth, reinvestment returns, and maximize your portfolio income with real-time stock data.",
  openGraph: {
    title: "Free Stock Dividend Calculator | Investment Return Analysis Tool",
    description: "Calculate your potential dividends easily with our comprehensive calculator. Input investment details, analyze yields, and plan your dividend strategy with real-time market data. Perfect for dividend growth investors.",
    type: "website",
    url: "https://dividend-calculator.org",
  },
  keywords: [
    "dividend calculator",
    "dividend yield calculator",
    "stock dividend analysis",
    "investment return calculator",
    "DRIP calculator",
    "dividend growth calculator",
    "dividend reinvestment calculator",
    "stock investment tool",
    "dividend income calculator",
    "portfolio return calculator"
  ].join(", "),
  alternates: {
    canonical: "https://dividend-calculator.org"
  }
};

export default function HomePage() {
    return (
        <div className="container">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Stock Dividend Calculator</h1>
            </header>

            {/* Search Section */}
            <section className="mb-12">
                <StockSearch buttonText="Go" />
            </section>

            <section className="py-8 border-t border-gray-100">
                <div className="container">
                    <PopularStocks />
                </div>
            </section>

            <section className="py-8 border-t border-gray-100">
                <div className="container">
                    <FAQSection
                        faqs={generalStockFaqs}
                        title={`Frequently Asked Questions About Dividend Calculator`}
                    />
                </div>
            </section>
        </div>
    );
} 