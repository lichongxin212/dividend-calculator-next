export interface Stock {
  ticker: string;
  frequency: string;
  dividends12Month: number;
  currentPrice: number;
  dividendYield: number;
  quantity: number;
  investmentAmount: number;
}

export interface StockSearchResult {
  ticker: string;
  name: string;
  exchange: string;
}

export interface DividendData {
  amount: number;
  exDate: string;
  paymentDate: string;
  frequency: string;
}

export interface PortfolioResults {
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