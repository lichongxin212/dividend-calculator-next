import { NextResponse } from 'next/server';
import { getCurrentPrice } from '@/lib/api';

export async function GET(
  request: Request,
  { params }: { params: { ticker: string } }
) {
  try {
    const ticker = params.ticker;
    const currentPrice = await getCurrentPrice(ticker);

    return NextResponse.json({
      ticker,
      currentPrice,
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
} 