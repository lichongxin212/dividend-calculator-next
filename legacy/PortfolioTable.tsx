'use client';

import { useState } from 'react';

interface PortfolioStock {
  ticker: string;
  frequency: string;
  dividendPerShare: number;
  currentPrice: number;
  dividendYield: number;
  numberOfShares: number;
  investmentAmount: number;
}

interface PortfolioTableProps {
  stocks: PortfolioStock[];
  onUpdateStock: (stocks: PortfolioStock[]) => void;
}

export default function PortfolioTable({ stocks, onUpdateStock }: PortfolioTableProps) {
  const updateQuantity = (index: number, quantity: number) => {
    const updatedStocks = [...stocks];
    updatedStocks[index].numberOfShares = quantity;
    updatedStocks[index].investmentAmount = quantity * updatedStocks[index].currentPrice;
    onUpdateStock(updatedStocks);
  };

  return (
    <div className="w-full overflow-x-auto my-4">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Ticker</th>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Current Price</th>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Dividend per Share</th>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Frequency</th>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Dividend Yield</th>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Number of Shares</th>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Investment Amount</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={stock.ticker} className="border-b hover:bg-gray-50">
              <td className="p-3">{stock.ticker}</td>
              <td className="p-3">${stock.currentPrice.toFixed(2)}</td>
              <td className="p-3">${stock.dividendPerShare.toFixed(2)}</td>
              <td className="p-3">{stock.frequency}</td>
              <td className="p-3">{(stock.dividendYield).toFixed(2)}%</td>
              <td className="p-3">
                <input
                  type="number"
                  min="0"
                  value={stock.numberOfShares}
                  onChange={(e) => updateQuantity(index, Number(e.target.value))}
                  className="w-20 p-2 border rounded-md"
                />
              </td>
              <td className="p-3">${stock.investmentAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 