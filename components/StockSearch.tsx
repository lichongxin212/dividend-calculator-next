'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ErrorMessage from './ErrorMessage';
import { StockDetail } from '@/lib/api';

interface Suggestion {
  ticker: string;
  name: string;
}

interface StockSearchProps {
  buttonText: string;
  onAddStock?: (stock: StockDetail) => void;
}

export default function StockSearch({ buttonText, onAddStock }: StockSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchTimeout = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchTerm.trim().length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // 清除之前的定时器
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // 设置新的定时器
    searchTimeout.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/stock/search?q=${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleSearch = async (ticker: string = searchTerm) => {
    if (!ticker.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setShowSuggestions(false);
    
    try {
      const response = await fetch(`/api/stock/${ticker.toUpperCase()}`);
      if (!response.ok) {
        throw new Error('Stock not found. Please check the ticker symbol.');
      }
      const stockDetails = await response.json();
      
      if (onAddStock) {
        // 如果是添加模式，调用添加回调
        onAddStock(stockDetails);
        setSearchTerm(''); // 清空搜索框
      } else {
        // 如果是导航模式，跳转到股票页面
        router.push(`/${ticker.toLowerCase()}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSearch(suggestions[selectedIndex].ticker);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full relative">
          <input 
            ref={searchInputRef}
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a stock ticker symbol, e.g. SCHD"
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
          />
          <button 
            type="button" 
            onClick={() => handleSearch()}
            disabled={isLoading} 
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#4CAF50] text-white rounded-full hover:bg-[#45a049] transition-colors disabled:bg-gray-400"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              buttonText
            )}
          </button>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={suggestion.ticker}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                    index === selectedIndex ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleSearch(suggestion.ticker)}
                >
                  <span className="font-semibold">{suggestion.ticker}</span>
                  <span className="text-gray-600 ml-2">{suggestion.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && <ErrorMessage message={error} />}
      </div>
    </div>
  );
} 