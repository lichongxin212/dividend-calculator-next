import { getStockDetails } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { ticker: string } }
) {
  try {
    const ticker = params.ticker;
    const stockDetails = await getStockDetails(ticker);
    return NextResponse.json(stockDetails);
  } catch (error) {
    return NextResponse.json(
      { error: '获取股票数据失败' },
      { status: 500 }
    );
  }
} 