import { getStockDetails } from '@/lib/api';
import StockDividendCalculator from '@/components/StockCalculator';
import PopularStocks from '@/components/PopularStocks';

export const revalidate = 3600; // 每小时重新验证一次数据

export default async function JEPIPage() {
  try {
    const stockDetails = await getStockDetails('JEPI');

    return (
      <div>
        <StockDividendCalculator stockDetail={stockDetails} />
        <PopularStocks />
      </div>
    );
  } catch (error) {
    console.error('Error loading JEPI data:', error);
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Error loading JEPI data
        </h1>
        <p className="text-gray-600">
          Please try again later.
        </p>
      </div>
    );
  }
} 