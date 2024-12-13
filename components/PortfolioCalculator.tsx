'use client';

import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import StockSearch from '@/components/StockSearch';
import { StockDetail } from '@/lib/api';
import { Pie, Bar } from 'react-chartjs-2';

interface PortfolioStock {
  ticker: string;
  frequency: string;
  dividendPerShare: number;
  currentPrice: number;
  dividendYield: number;
  numberOfShares: string;
  investmentAmount: string;
}

interface PortfolioResults {
  portfolioAmount: number;
  annualDividendIncome: number;
  annualDividendYield: number;
}

export default function PortfolioCalculator() {
  const [stocks, setStocks] = useState<PortfolioStock[]>([]);
  const [portfolioResults, setPortfolioResults] = useState<PortfolioResults | null>(null);
  const [activeField, setActiveField] = useState<'shares' | 'amount' | null>(null);

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold' as const,
          size: 11
        },
        padding: 6
      }
    }
  };

  useEffect(() => {
    Chart.register(ChartDataLabels);
  }, []);

  const updateQuantity = (index: number, quantity: string) => {
    const updatedStocks = [...stocks];
    updatedStocks[index].numberOfShares = quantity;

    if (quantity && !isNaN(Number(quantity))) {
      const amount = (Number(quantity) * updatedStocks[index].currentPrice).toFixed(2);
      updatedStocks[index].investmentAmount = amount;
    }

    setStocks(updatedStocks);
  };

  const updateInvestment = (index: number, amount: string) => {
    const updatedStocks = [...stocks];
    updatedStocks[index].investmentAmount = amount;

    if (amount && !isNaN(Number(amount))) {
      const shares = Math.floor(Number(amount) / updatedStocks[index].currentPrice).toString();
      updatedStocks[index].numberOfShares = shares;
    }

    setStocks(updatedStocks);
  };

  const calculatePortfolio = () => {
    const results = stocks.reduce((acc, stock) => {
      const shares = Number(stock.numberOfShares) || 0;
      const amount = Number(stock.investmentAmount) || 0;
      const annualDividend = shares * stock.dividendPerShare;

      return {
        portfolioAmount: acc.portfolioAmount + amount,
        annualDividendIncome: acc.annualDividendIncome + annualDividend,
        annualDividendYield: 0 // 稍后计算
      };
    }, {
      portfolioAmount: 0,
      annualDividendIncome: 0,
      annualDividendYield: 0
    });

    // 计算总股息收益率
    results.annualDividendYield = results.portfolioAmount > 0
      ? (results.annualDividendIncome / results.portfolioAmount) * 100
      : 0;

    setPortfolioResults(results);
  };

  const handleAddStock = (stockDetail: StockDetail) => {
    setStocks(prevStocks => [...prevStocks, {
      ticker: stockDetail.ticker,
      frequency: stockDetail.dividendHistory[0]?.frequency || 'Unknown',
      dividendPerShare: stockDetail.annualDividend,
      currentPrice: stockDetail.currentPrice,
      dividendYield: stockDetail.dividendYield,
      numberOfShares: '100',
      investmentAmount: (100 * stockDetail.currentPrice).toFixed(2)
    }]);
  };

  const removeStock = (index: number) => {
    setStocks(prevStocks => prevStocks.filter((_, i) => i !== index));
  };

  const generateChartData = () => {
    if (!stocks.length) return null;

    // Portfolio Distribution 数据
    const distributionData = {
      labels: stocks.map(stock => stock.ticker),
      datasets: [{
        data: stocks.map(stock => Number(stock.investmentAmount) || 0),
        backgroundColor: [
          '#4CAF50', '#45a049', '#357a38', '#2e6830', '#266b29',
          '#1e5e22', '#16511b', '#0e4414', '#06370d', '#002a06'
        ]
      }]
    };

    // Monthly Dividend Income 数据
    const monthlyData = Array(12).fill(0);
    stocks.forEach(stock => {
      const shares = Number(stock.numberOfShares) || 0;
      const monthlyDividend = Number((stock.dividendPerShare * shares) / 12);
      
      // 根据频率分配到不同月份
      switch (stock.frequency) {
        case 'Monthly':
          monthlyData.forEach((_, i) => monthlyData[i] += monthlyDividend);
          break;
        case 'Quarterly':
          [2, 5, 8, 11].forEach(month => monthlyData[month] += monthlyDividend * 3);
          break;
        case 'Bi-annual':
          [5, 11].forEach(month => monthlyData[month] += monthlyDividend * 6);
          break;
        case 'Annual':
          monthlyData[11] += monthlyDividend * 12;
          break;
      }
    });

    const monthlyChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Monthly Dividend Income',
        data: monthlyData,
        backgroundColor: '#4CAF50',
        borderRadius: 6,
        maxBarThickness: 50
      }]
    };

    return { distributionData, monthlyChartData };
  };

  return (
    <div className="container">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Portfolio Dividend Calculator</h1>
      </header>

      {/* Search Section */}
      <StockSearch buttonText="Add" onAddStock={handleAddStock} />

      {/* Portfolio Management Section */}
      <section className="my-8">
        <div className="w-full overflow-x-auto mb-6">
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-center font-semibold text-gray-600 border-b">Ticker</th>
                <th className="p-4 text-center font-semibold text-gray-600 border-b">Current Price</th>
                <th className="p-4 text-center font-semibold text-gray-600 border-b">Dividend per Share</th>
                <th className="p-4 text-center font-semibold text-gray-600 border-b">Frequency</th>
                <th className="p-4 text-center font-semibold text-gray-600 border-b">Dividend Yield</th>
                <th className="p-4 text-center font-semibold text-gray-600 border-b">Number of Shares</th>
                <th className="p-4 text-center font-semibold text-gray-600 border-b">Investment Amount</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => (
                <tr key={stock.ticker} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => removeStock(index)}
                        className="mr-2 text-gray-500 hover:text-red-500 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <circle cx="12" cy="12" r="10" strokeWidth={2} />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h8"
                          />
                        </svg>
                      </button>
                      <span>{stock.ticker}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">${stock.currentPrice.toFixed(2)}</td>
                  <td className="p-3 text-center">${stock.dividendPerShare.toFixed(2)}</td>
                  <td className="p-3 text-center">{stock.frequency}</td>
                  <td className="p-3 text-center">{(stock.dividendYield).toFixed(2)}%</td>
                  <td className="p-3 text-center">
                    <input
                      type="text"
                      value={stock.numberOfShares}
                      onChange={(e) => {
                        if (activeField === 'shares') {
                          updateQuantity(index, e.target.value);
                        }
                      }}
                      onFocus={() => setActiveField('shares')}
                      className="w-32 p-2 border rounded-md text-center"
                    />
                  </td>
                  <td className="p-3 text-center relative">
                    <div className="inline-block relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="text"
                        value={stock.investmentAmount}
                        onChange={(e) => {
                          if (activeField === 'amount') {
                            updateInvestment(index, e.target.value);
                          }
                        }}
                        onFocus={() => setActiveField('amount')}
                        className="w-36 p-2 pl-7 border rounded-md"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={calculatePortfolio}
          className="w-full p-2 bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Calculate
        </button>
      </section>

      {/* Results Section */}
      {portfolioResults && (
        <>
          <section className="my-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Portfolio Amount</h3>
                <p className="text-2xl font-bold text-[#4CAF50]">
                  ${portfolioResults.portfolioAmount.toFixed(2)}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Annual Dividend Income</h3>
                <p className="text-2xl font-bold text-[#4CAF50]">
                  ${portfolioResults.annualDividendIncome.toFixed(2)}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Annual Dividend Yield</h3>
                <p className="text-2xl font-bold text-[#4CAF50]">
                  {portfolioResults.annualDividendYield.toFixed(2)}%
                </p>
              </div>
            </div>
          </section>

          <section className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-4 text-center">Portfolio Distribution</h3>
              
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-4 text-center">Monthly Dividend Income</h3>
            </div>
          </section>
        </>
      )}

    </div>
  );
} 