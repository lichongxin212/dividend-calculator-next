import PortfolioCalculator from '@/components/PortfolioCalculator';
import FAQSection, { portfolioFaqs } from '@/components/FAQSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Portfolio Dividend Calculator - Track and Analyze Your Dividend Investments",
  description: "Optimize your dividend portfolio with our free calculator. Track multiple stocks, analyze total dividend income, and project future returns. Monitor dividend growth, payment schedules, and portfolio diversification with real-time data.",
  openGraph: {
    title: "Portfolio Dividend Calculator | Multi-Stock Dividend Analysis Tool",
    description: "Manage your dividend portfolio effectively. Track multiple stocks, analyze combined income, and optimize your dividend strategy with our comprehensive portfolio calculator.",
    type: "website",
    url: "https://dividend-calculator.org/portfolio",
  },
  keywords: [
    "portfolio dividend calculator",
    "dividend portfolio tracker",
    "multiple stock calculator",
    "dividend portfolio analysis",
    "portfolio income calculator",
    "dividend diversification tool",
    "portfolio yield calculator",
    "dividend growth tracker",
    "investment portfolio calculator",
    "dividend payment scheduler"
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
