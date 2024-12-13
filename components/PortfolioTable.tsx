'use client';

import { useState } from 'react';

interface Stock {
  ticker: string;
  frequency: string;
  dividends12Month: number;
  currentPrice: number;
  dividendYield: number;
  quantity: number;
  investmentAmount: number;
}

interface PortfolioTableProps {
  stocks: Stock[];
  onUpdateStock: (stocks: Stock[]) => void;
}

export default function PortfolioTable({ stocks, onUpdateStock }: PortfolioTableProps) {
  const updateQuantity = (index: number, quantity: number) => {
    const updatedStocks = [...stocks];
    updatedStocks[index].quantity = quantity;
    updatedStocks[index].investmentAmount = quantity * updatedStocks[index].currentPrice;
    onUpdateStock(updatedStocks);
  };

  return (
    <div className="w-full overflow-x-auto my-4">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Ticker</th>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Dividend Frequency</th>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Last 12 Months Dividends</th>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Current Price</th>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Annual Dividend Yield</th>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Quantity</th>
            <th className="p-3 text-left bg-gray-50 font-semibold border-b">Investment Amount</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, index) => (
            <tr key={`${stock.ticker}-${index}`} className="border-b hover:bg-gray-50">
              <td className="p-3">{stock.ticker}</td>
              <td className="p-3">{stock.frequency}</td>
              <td className="p-3">${stock.dividends12Month.toFixed(2)}</td>
              <td className="p-3">${stock.currentPrice.toFixed(2)}</td>
              <td className="p-3">{(stock.dividendYield * 100).toFixed(2)}%</td>
              <td className="p-3">
                <input
                  type="number"
                  min="0"
                  value={stock.quantity}
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