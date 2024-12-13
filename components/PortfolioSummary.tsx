'use client';

import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface PortfolioResults {
  totalAmount: number;
  annualDividend: number;
  portfolioYield: number;
  stockAllocation: Array<{
    ticker: string;
    amount: number;
  }>;
  monthlyDividends: Array<{
    month: string;
    amount: number;
  }>;
}

export default function PortfolioSummary({ results }: { results: PortfolioResults }) {
  const portfolioChartRef = useRef<HTMLCanvasElement>(null);
  const monthlyChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (portfolioChartRef.current && monthlyChartRef.current) {
      renderPortfolioChart();
      renderMonthlyDividendChart();
    }
  }, [results]);

  const renderPortfolioChart = () => {
    const ctx = portfolioChartRef.current?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: results.stockAllocation.map(item => item.ticker),
        datasets: [{
          data: results.stockAllocation.map(item => item.amount),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
          ]
        }]
      },
      options: {
        plugins: {
          datalabels: {
            formatter: (value: number, ctx: any) => {
              const sum = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
              const percentage = ((value * 100) / sum).toFixed(1) + '%';
              return percentage;
            },
            color: '#fff'
          }
        }
      }
    });
  };

  const renderMonthlyDividendChart = () => {
    const ctx = monthlyChartRef.current?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: results.monthlyDividends.map(item => item.month),
        datasets: [{
          label: 'Monthly Dividend Income',
          data: results.monthlyDividends.map(item => item.amount),
          backgroundColor: '#36A2EB'
        }]
      },
      options: {
        plugins: {
          datalabels: {
            formatter: (value) => `$${value.toFixed(2)}`,
            color: '#fff'
          }
        }
      }
    });
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Portfolio Amount</h3>
          <p className="text-2xl font-semibold text-[#4CAF50]">${results.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Annual Dividend Income (Est.)</h3>
          <p className="text-2xl font-semibold text-[#4CAF50]">${results.annualDividend.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Annual Dividend Yield (Est.)</h3>
          <p className="text-2xl font-semibold text-[#4CAF50]">{results.portfolioYield.toFixed(2)}%</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <canvas ref={portfolioChartRef}></canvas>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <canvas ref={monthlyChartRef}></canvas>
        </div>
      </div>
    </div>
  );
} 