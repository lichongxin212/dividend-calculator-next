import { getCurrentPrice, getDividendHistory, getStockDetails } from '@/lib/api';
import StockDividendCalculator from '@/components/StockDividendCalculator';

export const revalidate = 3600; // 每小时重新验证一次数据

export default async function SCHDPage() {
  try {
    const stockDetails = await getStockDetails('SCHD');
    
    return <StockDividendCalculator stockDetail={stockDetails} />;
  } catch (error) {
    console.error('Error loading SCHD data:', error);
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Error loading SCHD data
        </h1>
        <p className="text-gray-600">
          Please try again later or check our other dividend stocks.
        </p>
      </div>
    );
  }
} 