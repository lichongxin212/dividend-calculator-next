export interface StockDividend {
  exDate: string;
  amount: number;
  declarationDate: string;
  recordDate: string;
  paymentDate: string;
  frequency: string;
}

export interface StockInfo {
  ticker: string;
  annualDividend: number;
  currentPrice: number;
  dividendYield: number;
  dividendHistory: StockDividend[];
}

export async function getStockInfo(ticker: string): Promise<StockInfo> {
  const response = await fetch(`/api/stock/${ticker}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch stock info');
  }
  return response.json();
} 