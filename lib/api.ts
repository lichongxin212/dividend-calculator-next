import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

const API_KEY = "Y8hrbNpzzjb9CYjEANUWFHYvvQaS8f3p";
const BASE_URL = 'https://api.polygon.io';

export interface StockDetail {
    ticker: string;
    currentPrice: number;

    annualDividend: number;
    dividendYield: number;
    dividendHistory: StockDividend[];

    dividendGrowthRate: number;
    stockAppreciation: number;
}

export interface StockDividend {
    exDate: string;
    amount: number;
    declarationDate: string;
    recordDate: string;
    paymentDate: string;
    frequency: string;
}

export const getStockDetails = unstable_cache(
    async (ticker: string): Promise<StockDetail> => {
        try {
            const [dividendHistory, currentPrice] = await Promise.all([
                getDividendHistory(ticker),
                getCurrentPrice(ticker)
            ]);

            const annualDividend = calculateAnnualDividend(dividendHistory);
            const dividendYield = (annualDividend / currentPrice) * 100;

            // 设置每个股票的历史增长率
            const growthRates: { [key: string]: { dividend: number; price: number } } = {
                'SCHD': { dividend: 10.5, price: 11.4 },    // 参考过去10年数值
                'JEPI': { dividend: 0.5, price: 9.3 },    // 参考过去5年数值
                'JEPQ': { dividend: 3.86, price: 6.15 },    // 较新ETF，保守估计
                'VOO': { dividend: 7.8, price: 13.3 },    // 跟踪标普500
                'KO': { dividend: 3.5, price: 6.7 },      // 可口可乐60年增长历史
                'MSFT': { dividend: 10.2, price: 25 },  // 科技股高增长
                'BP': { dividend: 4.0, price: 7.5 },      // 石油公司稳定增长
                'T': { dividend: 0.5, price: 3.2 }        // AT&T重组后保守估计
            };

            const defaultRates = { dividend: 3, price: 5 }; // 默认保守估计
            const rates = growthRates[ticker] || defaultRates;

            return {
                ticker,
                annualDividend,
                currentPrice,
                dividendYield,
                dividendHistory,
                dividendGrowthRate: rates.dividend,
                stockAppreciation: rates.price
            };
        } catch (error) {
            console.error('Error fetching stock data:', error);
            throw new Error('Failed to fetch stock data');
        }
    },
    ['stock-details'],
    {
        revalidate: 600,
        tags: ['stock-details']
    }
);

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

export async function getDividendHistory(ticker: string) {
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

export async function getCurrentPrice(ticker: string) {
    const response = await fetch(
        `${BASE_URL}/v2/aggs/ticker/${ticker}/prev?apiKey=${API_KEY}`
    );
    const data = await response.json();
    return data.results[0].c;
}


export async function searchStocks(query: string) {
    const response = await fetch(
        `${BASE_URL}/v3/reference/tickers?search=${query}&active=true&sort=ticker&market=stocks&order=asc&limit=6&apiKey=${API_KEY}`
    );
    const data = await response.json();
    return data.results || [];
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