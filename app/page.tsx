'use client';

import { useState, useEffect } from 'react';
import StockSearch from '@/components/StockSearch';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { type StockDetail } from '@/lib/api';

const POPULAR_STOCKS = [
    { ticker: 'SCHD', name: 'Schwab US Dividend Equity ETF' },
    { ticker: 'JEPI', name: 'JPMorgan Equity Premium Income ETF' },
    { ticker: 'JEPQ', name: 'JPMorgan Nasdaq Equity Premium Income ETF' },
    { ticker: 'BP', name: 'BP p.l.c.' },
    { ticker: 'VOO', name: 'Vanguard S&P 500 ETF' },
    { ticker: 'KO', name: 'Coca-Cola Company' },
    { ticker: 'MSFT', name: 'Microsoft Corporation' },
];

export default function StockDividendCalculator() {
    const [stockInfo, setStockInfo] = useState<StockDetail | null>(null);
    const [shares, setShares] = useState<string>('100');
    const [price, setPrice] = useState<string>('');
    const [investmentAmount, setInvestmentAmount] = useState<string>('');
    const [isUserInput, setIsUserInput] = useState(false);

    useEffect(() => {
        if (stockInfo) {
            setPrice(stockInfo.currentPrice.toString());
            setShares('100');
            setInvestmentAmount((100 * stockInfo.currentPrice).toFixed(2));
            setIsUserInput(false);
        }
    }, [stockInfo]);

    const numShares = Number(shares) || 0;
    const numPrice = Number(price) || 0;

    // 当股数或价格改变时，仅在非用户输入状态下更新投资金额
    useEffect(() => {
        if (!isUserInput) {
            const amount = numShares * numPrice;
            setInvestmentAmount(amount > 0 ? amount.toFixed(2) : '');
        }
    }, [numShares, numPrice, isUserInput]);

    const handleInvestmentChange = (value: string) => {
        setIsUserInput(true);  // 标记为用户输入状态
        setInvestmentAmount(value);
        
        const amount = Number(value);
        if (numPrice > 0 && amount > 0) {
            const newShares = Math.floor(amount / numPrice);
            setShares(newShares.toString());
        } else {
            setShares('');
        }
    };

    // 当其他输入改变时重置用户输入状态
    const handleSharesChange = (value: string) => {
        setShares(value);
        setIsUserInput(false);
    };

    const handlePriceChange = (value: string) => {
        setPrice(value);
        setIsUserInput(false);
    };

    return (
        <div className="container">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Stock Dividend Calculator</h1>
            </header>

            {/* Search Section */}
            <section className="mb-12">
                <StockSearch onAddStock={(stock) => setStockInfo(stock)} />
            </section>

            {stockInfo && (
                <>
                    {/* Calculator Section */}
                    <section className="bg-white rounded-lg shadow p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-gray-600 mb-2">Stock Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => handlePriceChange(e.target.value)}
                                        className="w-full p-2 pl-7 border rounded-md"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-2">Number of Shares</label>
                                <input
                                    type="number"
                                    value={shares}
                                    onChange={(e) => handleSharesChange(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    min="0"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-2">Investment Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={investmentAmount}
                                        onChange={(e) => handleInvestmentChange(e.target.value)}
                                        className="w-full p-2 pl-7 border rounded-md"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 新的卡片布局 */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-center">
                                <label className="block text-gray-600 text-sm mb-1">Dividend per Share</label>
                                <div className="text-2xl font-semibold text-[#4CAF50]">
                                    ${stockInfo.annualDividend.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Annual Estimate</div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-center">
                                <label className="block text-gray-600 text-sm mb-1">Dividend Yield</label>
                                <div className="text-2xl font-semibold text-[#4CAF50]">
                                    {(stockInfo.annualDividend / numPrice * 100).toFixed(2)}%
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Annual Rate</div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-center">
                                <label className="block text-gray-600 text-sm mb-1">Annual Dividend Income</label>
                                <div className="text-2xl font-semibold text-[#4CAF50]">
                                    ${(numShares * stockInfo.annualDividend).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Estimated</div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow text-center">
                                <label className="block text-gray-600 text-sm mb-1">Monthly Dividend Income</label>
                                <div className="text-2xl font-semibold text-[#4CAF50]">
                                    ${(numShares * stockInfo.annualDividend / 12).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Estimated</div>
                            </div>
                        </div>

                        {/* Dividend History Table */}
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4">Dividend History</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left">Ex Dividend Date</th>
                                            <th className="px-4 py-2 text-left">Frequency</th>
                                            <th className="px-4 py-2 text-left">Cash Amount</th>
                                            <th className="px-4 py-2 text-left">Declaration Date</th>
                                            <th className="px-4 py-2 text-left">Record Date</th>
                                            <th className="px-4 py-2 text-left">Payment Date</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockInfo.dividendHistory.map((dividend, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-2">{dividend.exDate}</td>
                                                <td className="px-4 py-2">{dividend.frequency}</td>
                                                <td className="px-4 py-2">${dividend.amount}</td>
                                                <td className="px-4 py-2">{dividend.declarationDate}</td>
                                                <td className="px-4 py-2">{dividend.recordDate}</td>
                                                <td className="px-4 py-2">{dividend.paymentDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </>
            )}


            {/* Popular Stocks */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Popular Dividend Stocks</h2>
                <div className="flex flex-wrap gap-2">
                    {POPULAR_STOCKS.map((stock) => (
                        <button
                            key={stock.ticker}
                            className="px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-[#4CAF50] hover:text-[#4CAF50] transition-colors"
                            title={stock.name}
                        >
                            {stock.ticker}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 