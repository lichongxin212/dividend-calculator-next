'use client';

import StockSearch from '@/components/StockSearch';
import PopularStocks from '@/components/PopularStocks';

export default function HomePage() {
    return (
        <div className="container">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">Stock Dividend Calculator</h1>
            </header>

            {/* Search Section */}
            <section className="mb-12">
                <StockSearch />
            </section>

            <PopularStocks />
        </div>
    );
} 