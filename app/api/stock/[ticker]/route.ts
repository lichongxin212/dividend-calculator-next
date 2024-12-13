import { NextResponse } from 'next/server';

const API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';

function getFrequencyText(freq: number): string {
  const frequencies: { [key: number]: string } = {
    0: 'One-time',
    1: 'Annual',
    2: 'Bi-annual',
    4: 'Quarterly',
    12: 'Monthly'
  };
  return frequencies[freq] || 'Unknown';
}

async function getDividendHistory(ticker: string) {
  const response = await fetch(
    `${BASE_URL}/v3/reference/dividends?ticker=${ticker}&limit=12&apiKey=${API_KEY}`
  );
  const data = await response.json();
  return data.results.map((item: any) => ({
    exDate: item.ex_dividend_date,
    amount: item.cash_amount,
    declarationDate: item.declaration_date,
    recordDate: item.record_date,
    paymentDate: item.pay_date,
    frequency: getFrequencyText(item.frequency)
  }));
}

async function getCurrentPrice(ticker: string) {
  const response = await fetch(
    `${BASE_URL}/v2/aggs/ticker/${ticker}/prev?apiKey=${API_KEY}`
  );
  const data = await response.json();
  return data.results[0].c;
}

function calculateAnnualDividend(dividendHistory: any[]): number {
  if (dividendHistory.length === 0) return 0;

  // 获取最新的一次股息记录
  const latestDividend = dividendHistory
    .sort((a, b) => new Date(b.exDate).getTime() - new Date(a.exDate).getTime())[0];

  // 根据频率计算年度股息
  const frequencyMap: { [key: string]: number } = {
    'Monthly': 12,
    'Quarterly': 4,
    'Bi-annual': 2,
    'Annual': 1,
    'One-time': 0,
    'Unknown': 0
  };

  const frequency = frequencyMap[latestDividend.frequency];
  return latestDividend.amount * frequency;
}

export async function GET(
  request: Request,
  { params }: { params: { ticker: string } }
) {
  try {
    const ticker = params.ticker;
    const [dividendHistory, currentPrice] = await Promise.all([
      getDividendHistory(ticker),
      getCurrentPrice(ticker)
    ]);

    const annualDividend = calculateAnnualDividend(dividendHistory);
    const dividendYield = (annualDividend / currentPrice) * 100;

    return NextResponse.json({
      ticker,
      annualDividend,
      currentPrice,
      dividendYield,
      dividendHistory
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
} 