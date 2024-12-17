import StockSearch from '@/components/StockSearch';
import PopularStocks from '@/components/PopularStocks';
import FAQSection, { generalStockFaqs } from '@/components/FAQSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Stock Dividend Calculator",
  description: "Calculate dividend yields, dividends growth and reinvestment returns easily with real-time stock data.",
  openGraph: {
    title: "Free Stock Dividend Calculator",
    description: "Calculate your potential dividends easily with our comprehensive calculator. Input investment details, analyze yields, and plan your dividend strategy with real-time market data. Perfect for dividend growth investors.",
    type: "website",
    url: "https://dividend-calculator.org",
  },
  keywords: [
    "dividend calculator",
    "dividend yield calculator",
    "investment return calculator",
    "DRIP calculator",
    "dividend growth calculator",
    "dividend reinvestment calculator",
    "dividend income calculator",
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
                        title={`Frequently Asked Questions About Stock Dividend Calculator`}
                    />
                </div>
            </section>
        </div>
    );
} 