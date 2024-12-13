import { NextResponse } from 'next/server';
import { searchStocks } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  const filteredStocks = await searchStocks(query);

  return NextResponse.json(filteredStocks);
} 