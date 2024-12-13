import { NextResponse } from 'next/server';
import { getDividendHistory, getCurrentPrice, calculateAnnualDividend } from '@/lib/api';

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