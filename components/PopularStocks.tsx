const POPULAR_STOCKS = [
  { ticker: 'SCHD', name: 'Schwab US Dividend Equity ETF' },
  { ticker: 'JEPI', name: 'JPMorgan Equity Premium Income ETF' },
  { ticker: 'JEPQ', name: 'JPMorgan Nasdaq Equity Premium Income ETF' },
  { ticker: 'BP', name: 'BP p.l.c.' },
  { ticker: 'VOO', name: 'Vanguard S&P 500 ETF' },
  { ticker: 'KO', name: 'Coca-Cola Company' },
  { ticker: 'MSFT', name: 'Microsoft Corporation' },
];

interface PopularStocksProps {
  onStockSelect?: (ticker: string) => void;
}

export default function PopularStocks({ onStockSelect }: PopularStocksProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Popular Dividend Stocks</h2>
      <div className="flex flex-wrap gap-2">
        {POPULAR_STOCKS.map((stock) => (
          <button
            key={stock.ticker}
            className="px-4 py-2 bg-white rounded-full border border-gray-200 hover:border-[#4CAF50] hover:text-[#4CAF50] transition-colors"
            title={stock.name}
            onClick={() => onStockSelect?.(stock.ticker)}
          >
            {stock.ticker}
          </button>
        ))}
      </div>
    </div>
  );
} 