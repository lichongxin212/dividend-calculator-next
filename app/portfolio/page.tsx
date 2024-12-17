import PortfolioCalculator from '@/components/PortfolioCalculator';
import FAQSection, { portfolioFaqs } from '@/components/FAQSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Portfolio Dividend Calculator",
  description: "Analyze your dividend portfolio, track multiple stocks, calculate total dividend income, and project future returns with real-time stock data.",
  openGraph: {
    title: "Free Portfolio Dividend Calculator",
    description: "Manage your dividend portfolio effectively. Track multiple stocks, analyze combined income, and optimize your dividend strategy with our comprehensive portfolio calculator.",
    type: "website",
    url: "https://dividend-calculator.org/portfolio",
  },
  keywords: [
    "portfolio dividend calculator",
    "dividend portfolio tracker",
    "portfolio income calculator",
    "portfolio yield calculator",
    "investment portfolio calculator",
  ].join(", "),
  alternates: {
    canonical: "https://dividend-calculator.org/portfolio"
  }
};

export default function PortfolioPage() {
  return (
    <div>
      <PortfolioCalculator />

      <section className="py-8 border-t border-gray-100">
        <div className="container">
          <FAQSection
            faqs={portfolioFaqs}
            title="Frequently Asked Questions About Portfolio Dividend Calculator"
          />
        </div>
      </section>
    </div>
  );
}
