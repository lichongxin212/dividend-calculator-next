'use client';

import { useState } from 'react';
import { getStockInfo, type StockInfo } from '@/lib/api';
import ErrorMessage from './ErrorMessage';

interface StockSearchProps {
  onAddStock: (stock: StockInfo) => void;
}

export default function StockSearch({ onAddStock }: StockSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const stockInfo = await getStockInfo(searchTerm.toUpperCase());
      onAddStock(stockInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock info');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full relative">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter a stock name or ticker to calculate, e.g. Apple or AAPL"
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            type="button" 
            onClick={handleSearch}
            disabled={isLoading} 
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#4CAF50] text-white rounded-full hover:bg-[#45a049] transition-colors disabled:bg-gray-400"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Go'
            )}
          </button>
        </div>
        {error && <ErrorMessage message={error} />}
      </div>
    </div>
  );
} 