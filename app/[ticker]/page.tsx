import { getStockDetails } from '@/lib/api';
import StockDividendCalculator from '@/components/StockCalculator';
import PopularStocks from '@/components/PopularStocks';

export const revalidate = 3600; // 每小时重新验证一次数据

interface PageProps {
  params: {
    ticker: string;
  };
}

export default async function StockPage({ params }: PageProps) {
  const { ticker } = params;
  
  try {
    const stockDetails = await getStockDetails(ticker.toUpperCase());

    return (
      <div>
        <StockDividendCalculator stockDetail={stockDetails} />
        <PopularStocks />
      </div>
    );
  } catch (error) {
    console.error(`Error loading ${ticker.toUpperCase()} data:`, error);
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Error loading {ticker.toUpperCase()} data
        </h1>
        <p className="text-gray-600">
          Please try again later.
        </p>
      </div>
    );
  }
} 