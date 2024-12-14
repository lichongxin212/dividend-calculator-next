'use client';

import Link from 'next/link';

const POPULAR_ETFS = [
  { ticker: 'SCHD', name: 'Schwab US Dividend Equity ETF' },
  { ticker: 'JEPI', name: 'JPMorgan Equity Premium Income ETF' },
  { ticker: 'JEPQ', name: 'JPMorgan Nasdaq Equity Premium Income ETF' },
  { ticker: 'VOO', name: 'Vanguard S&P 500 ETF' },
];

const POPULAR_STOCKS = [
  { ticker: 'KO', name: 'Coca-Cola Company' },
  { ticker: 'MSFT', name: 'Microsoft Corporation' },
  { ticker: 'BP', name: 'BP p.l.c.' },
  { ticker: 'T', name: 'AT&T Inc.' },
];

export default function PopularStocks() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        Popular Dividend Stocks and ETFs
      </h2>
      
      {/* Popular ETFs */}
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {POPULAR_ETFS.map((etf) => (
            <Link
              key={etf.ticker}
              href={`/${etf.ticker.toLowerCase()}`}
              className="group flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-[#4CAF50] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-left"
            >
              <div className="flex-1">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">{etf.ticker}</span>
                  <span className="text-sm text-gray-600">{etf.name}</span>
                </div>
              </div>
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-[#4CAF50] group-hover:transform group-hover:translate-x-1 transition-all ml-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Stocks */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {POPULAR_STOCKS.map((stock) => (
            <Link
              key={stock.ticker}
              href={`/${stock.ticker.toLowerCase()}`}
              className="group flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-[#4CAF50] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-left"
            >
              <div className="flex-1">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">{stock.ticker}</span>
                  <span className="text-sm text-gray-600">{stock.name}</span>
                </div>
              </div>
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-[#4CAF50] group-hover:transform group-hover:translate-x-1 transition-all ml-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 