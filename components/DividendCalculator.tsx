'use client';

import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import StockSearch from '@/components/StockSearch';
import PortfolioTable from '@/components/PortfolioTable';
import PortfolioSummary from '@/components/PortfolioSummary';
import FAQSection from '@/components/FAQSection';

interface Stock {
  ticker: string;
  frequency: string;
  dividends12Month: number;
  currentPrice: number;
  dividendYield: number;
  quantity: number;
  investmentAmount: number;
}

export default function DividendCalculator() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolioResults, setPortfolioResults] = useState<any>(null);

  useEffect(() => {
    Chart.register(ChartDataLabels);
  }, []);

  const calculatePortfolio = () => {
    // 计算逻辑保持不变
    // ...
  };

  return (
    <div className="container">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Portfolio Dividend Calculator</h1>
      </header>

      {/* Search Section */}
      <section className="mb-12">
        <StockSearch buttonText="Add"/>
      </section>


      <div className="main-content">
        {/* Calculator Section */}
        <section className="calculator-section">
          <div className="section-title">
            <h2>Dividend Portfolio</h2>
          </div>

          <PortfolioTable
            stocks={stocks}
            onUpdateStock={(updatedStocks) => setStocks(updatedStocks)}
          />

          <button
            className="calculate-btn"
            onClick={calculatePortfolio}
          >
            Calculate Dividends
          </button>

          {portfolioResults && (
            <PortfolioSummary results={portfolioResults} />
          )}
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <FAQSection />
        </section>
      </div>
    </div>
  );
} 