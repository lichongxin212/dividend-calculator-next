'use client';

import { StockDetail, StockDividend } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';
import PopularStocks from './PopularStocks';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface StockDividendCalculatorProps {
  stockDetail: StockDetail;
}

// 添加日期格式化函数
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}/${date.getFullYear()}`;
}

export default function StockDividendCalculator({ stockDetail }: StockDividendCalculatorProps) {
  const [shares, setShares] = useState<string>('100');
  const [price, setPrice] = useState<string>(stockDetail.currentPrice.toString());
  const [investmentAmount, setInvestmentAmount] = useState<string>((100 * stockDetail.currentPrice).toFixed(2));
  const [isUserInput, setIsUserInput] = useState(false);
  const [annualDividendPerShare, setAnnualDividendPerShare] = useState<string>(stockDetail.annualDividend.toString());
  const [extraInvestmentFrequency, setExtraInvestmentFrequency] = useState<string>('Monthly');
  const [extraInvestment, setExtraInvestment] = useState<string>('0');
  const [holdingPeriod, setHoldingPeriod] = useState<string>('10');
  const [isDRIP, setIsDRIP] = useState<boolean>(true);
  const [dividendGrowthRate, setDividendGrowthRate] = useState<string>('11.5');
  const [stockAppreciation, setStockAppreciation] = useState<string>('13');

  // 获取最后一次股息记录
  const latestDividend = stockDetail.dividendHistory
    .sort((a, b) => new Date(b.exDate).getTime() - new Date(a.exDate).getTime())[0];

  const [dividendPerShare, setDividendPerShare] = useState<string>(latestDividend.amount.toString());
  const [dividendFrequency, setDividendFrequency] = useState<string>(
    (() => {
      const frequencyMap: { [key: string]: string } = {
        'One-time': '0',
        'Annual': '1',
        'Bi-annual': '2',
        'Quarterly': '4',
        'Monthly': '12'
      };
      return frequencyMap[latestDividend.frequency] || '4';
    })()
  );

  useEffect(() => {
    setPrice(stockDetail.currentPrice.toString());
    setShares('100');
    setInvestmentAmount((100 * stockDetail.currentPrice).toFixed(2));
    setIsUserInput(false);
  }, [stockDetail]);

  const numShares = Number(shares) || 0;
  const numPrice = Number(price) || 0;

  // 当股数或价格改变时，仅在非用户输入状态下更新投资金额
  useEffect(() => {
    if (!isUserInput) {
      const amount = numShares * numPrice;
      setInvestmentAmount(amount > 0 ? amount.toFixed(2) : '');
    }
  }, [numShares, numPrice, isUserInput]);

  const handleInvestmentChange = (value: string) => {
    setIsUserInput(true);  // 标记为用户输入状态
    setInvestmentAmount(value);

    const amount = Number(value);
    if (numPrice > 0 && amount > 0) {
      const newShares = Math.floor(amount / numPrice);
      setShares(newShares.toString());
    } else {
      setShares('');
    }
  };

  // 当其他输入改变时重置用户输入状态
  const handleSharesChange = (value: string) => {
    setShares(value);
    setIsUserInput(false);
  };

  const handlePriceChange = (value: string) => {
    setPrice(value);
    setIsUserInput(false);
  };

  // 添加计算函数
  function calculateAnnualReturns(params: {
    initialShares: number;
    initialPrice: number;
    dividendPerShare: number;
    dividendFrequency: number;
    dividendGrowthRate: number;
    stockAppreciation: number;
    extraInvestment: number;
    extraInvestmentFrequency: string;
    holdingPeriod: number;
  }) {
    const {
      initialShares,
      initialPrice,
      dividendPerShare,
      dividendFrequency,
      dividendGrowthRate,
      stockAppreciation,
      extraInvestment,
      extraInvestmentFrequency,
      holdingPeriod,
    } = params;

    const annualExtraInvestment = extraInvestment *
      (extraInvestmentFrequency === 'Monthly' ? 12 :
        extraInvestmentFrequency === 'Quarterly' ? 4 : 1);

    const results = [];

    // DRIP 和非 DRIP 的初始值
    let sharesDRIP = initialShares;
    let sharesNoDRIP = initialShares;
    let currentPrice = initialPrice;
    let currentDividendPerShare = dividendPerShare * dividendFrequency;

    const dividendPaymentsPerYear = Number(dividendFrequency); // 每年发放股息次数

    let accumulatedDividendsNoDRIP = 0; // 添加���计股息变量

    for (let year = 1; year <= holdingPeriod; year++) {
      let yearStartShares = sharesDRIP;
      let yearStartSharesNoDRIP = sharesNoDRIP;

      // 计算当年每次派息的金额
      const currentDividendPerPayment = currentDividendPerShare / dividendPaymentsPerYear;

      // 1. 处理原始投资的股息
      let baseDividendsDRIP = 0;
      let baseDividendsNoDRIP = 0;

      for (let payment = 0; payment < dividendPaymentsPerYear; payment++) {
        // 使用当年的派息金额计算
        const dividendsDRIP = yearStartShares * currentDividendPerPayment;
        const dividendsNoDRIP = yearStartSharesNoDRIP * currentDividendPerPayment;

        baseDividendsDRIP += dividendsDRIP;
        baseDividendsNoDRIP += dividendsNoDRIP;

        // DRIP情况下更新股数
        if (isDRIP) {
          const newShares = dividendsDRIP / currentPrice;
          yearStartShares += newShares;
        }
      }

      // 2. 处理额外投资及其产生的股息
      let extraInvestmentShares = 0;
      let extraDividendsDRIP = 0;
      let extraDividendsNoDRIP = 0;

      const investmentTimes =
        extraInvestmentFrequency === 'Monthly' ? 12 :
          extraInvestmentFrequency === 'Quarterly' ? 4 : 1;

      for (let i = 0; i < investmentTimes; i++) {
        // 计算新增股��
        const newShares = extraInvestment / currentPrice;
        extraInvestmentShares += newShares;

        // 计算这些新股在剩余时间内产生的股息
        const remainingPayments = Math.ceil(dividendPaymentsPerYear *
          (1 - i / investmentTimes)); // 使用Math.ceil确保得到整数

        const extraDividend = newShares * currentDividendPerPayment * remainingPayments;

        if (isDRIP) {
          extraDividendsDRIP += extraDividend;
          const drippedShares = extraDividend / currentPrice;
          extraInvestmentShares += drippedShares;
        } else {
          extraDividendsNoDRIP += extraDividend;
        }
      }

      // 3. 更新年末总数据
      sharesDRIP = yearStartShares + extraInvestmentShares;
      sharesNoDRIP = yearStartSharesNoDRIP + extraInvestmentShares;

      // 计算年度总股息
      const annualDividendsDRIP = baseDividendsDRIP + extraDividendsDRIP;
      const annualDividendsNoDRIP = baseDividendsNoDRIP + extraDividendsNoDRIP;

      // 在计算完当年余额后，再更新累计股息（为下一年使用）
      accumulatedDividendsNoDRIP += annualDividendsNoDRIP;

      // 计算年终余额
      const balanceDRIP = sharesDRIP * currentPrice;
      const balanceNoDRIP = sharesNoDRIP * currentPrice;

      results.push({
        year,
        sharePrice: currentPrice,
        dividendPerShare: currentDividendPerShare,
        dividendYield: (currentDividendPerShare / currentPrice) * 100,
        totalInvestment: initialShares * initialPrice + year * annualExtraInvestment,
        annualDividendsDRIP,
        endBalanceDRIP: balanceDRIP,
        annualDividendsNoDRIP,
        accumulatedDividendsNoDRIP,
        endBalanceNoDRIP: balanceNoDRIP,
      });

      // 更新下一年的值
      currentPrice *= (1 + stockAppreciation / 100);
      currentDividendPerShare *= (1 + dividendGrowthRate / 100);
    }

    return results;
  }

  const results = calculateAnnualReturns({
    initialShares: numShares,
    initialPrice: numPrice,
    dividendPerShare: Number(dividendPerShare),
    dividendFrequency: Number(dividendFrequency),
    dividendGrowthRate: Number(dividendGrowthRate),
    stockAppreciation: Number(stockAppreciation),
    extraInvestment: Number(extraInvestment),
    extraInvestmentFrequency,
    holdingPeriod: Number(holdingPeriod),
  });

  // Annual Dividends 图表数据
  const annualDividendsData = {
    labels: results.map(row => `Year ${row.year}`),
    datasets: [
      {
        label: 'DRIP',
        data: results.map(row => row.annualDividendsDRIP),
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
      },
      {
        label: 'No DRIP',
        data: results.map(row => row.annualDividendsNoDRIP),
        backgroundColor: 'rgba(33, 150, 243, 0.6)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Total Balance 图表数据
  const totalBalanceData = {
    labels: results.map(row => `Year ${row.year}`),
    datasets: [
      {
        label: 'DRIP Balance',
        data: results.map(row => row.endBalanceDRIP),
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1,
      },
      {
        label: 'No DRIP Stock Value',
        data: results.map(row => row.endBalanceNoDRIP),
        backgroundColor: 'rgba(33, 150, 243, 0.6)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1,
        stack: 'stack1',
      },
      {
        label: 'No DRIP Accumulated Dividends',
        data: results.map(row => row.accumulatedDividendsNoDRIP),
        backgroundColor: 'rgba(13, 71, 161, 0.6)',
        borderColor: 'rgba(13, 71, 161, 1)',
        borderWidth: 1,
        stack: 'stack1',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: function (context: any) {
            return context[0].label;
          },
          label: function (context: any) {
            const datasetIndex = context.datasetIndex;
            const dataIndex = context.dataIndex;
            const datasets = context.chart.data.datasets;

            // Annual Dividends 图表
            if (datasets.length === 2) {
              const dripValue = datasets[0].data[dataIndex];
              const noDripValue = datasets[1].data[dataIndex];
              return [
                `DRIP: ${dripValue.toFixed(2)}`,
                `No DRIP: ${noDripValue.toFixed(2)}`
              ];
            }

            // Total Balance 图表
            if (datasets.length === 3) {
              const dripValue = datasets[0].data[dataIndex];
              const noDripStockValue = datasets[1].data[dataIndex];
              const noDripDividends = datasets[2].data[dataIndex];
              return [
                `DRIP Total: ${dripValue.toFixed(2)}`,
                `No DRIP Total: ${(noDripStockValue + noDripDividends).toFixed(2)}`,
                `- Stock Value: ${noDripStockValue.toFixed(2)}`,
                `- Accumulated Dividends: ${noDripDividends.toFixed(2)}`
              ];
            }

            return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
          }
        }
      },
      datalabels: {
        display: function (context: any) {
          const datasetCount = context.chart.data.datasets.length;
          if (datasetCount === 3) { // Total Balance 图表
            return context.datasetIndex === 0 || context.datasetIndex === 1 || context.datasetIndex === 2;
          }
          return true; // Annual Dividends 图表显示所有标签
        },
        color: '#000',
        anchor: function (context: any) {
          const datasetCount = context.chart.data.datasets.length;
          if (datasetCount === 3) { // Total Balance 图表
            if (context.datasetIndex === 0) { // DRIP Total
              return 'end';
            } else if (context.datasetIndex === 1) { // Stock Value
              return 'center';
            } else { // Accumulated Dividends
              return 'end';
            }
          }
          return 'end';
        },
        align: function (context: any) {
          const datasetCount = context.chart.data.datasets.length;
          if (datasetCount === 3) { // Total Balance 图表
            if (context.datasetIndex === 0) { // DRIP Total
              return 'top';
            } else if (context.datasetIndex === 1) { // Stock Value
              return 'center';
            } else { // Accumulated Dividends
              return 'top';
            }
          }
          return 'top';
        },
        formatter: function (value: number, context: any) {
          const datasetCount = context.chart.data.datasets.length;
          if (datasetCount === 3) { // Total Balance 图表
            if (context.datasetIndex === 0) { // DRIP Total
              return `$${value.toFixed(0)}`;
            } else if (context.datasetIndex === 1 || context.datasetIndex === 2) {
              return `$${value.toFixed(0)}`;
            }
          }
          return `$${value.toFixed(0)}`;
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  // 首先在组件顶部添加一个 ref
  const chartRef = useRef<HTMLDivElement>(null);

  // 添加滚动函数
  const scrollToChart = () => {
    chartRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">{stockDetail.ticker} Dividend Calculator</h1>
      </header>

      {/* Calculator Section */}
      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-600 mb-2">Current Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full p-2 pl-7 border rounded-md"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Number of Shares</label>
            <input
              type="number"
              value={shares}
              onChange={(e) => handleSharesChange(e.target.value)}
              className="w-full p-2 border rounded-md"
              min="0"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Initial Investment Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => handleInvestmentChange(e.target.value)}
                className="w-full p-2 pl-7 border rounded-md"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* 在Investment Amount后添加新的输入组件 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-gray-600 mb-2">Dividend per Share</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={dividendPerShare}
                readOnly
                className="w-full p-2 pl-7 border rounded-md bg-gray-50"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Dividend Frequency</label>
            <div className="relative">
              <select
                value={dividendFrequency}
                disabled
                className="w-full p-2 border rounded-md appearance-none bg-gray-50 cursor-not-allowed"
              >
                <option value="0">One-time</option>
                <option value="1">Annually</option>
                <option value="2">Bi-annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Ex-Dividend Date</label>
            <input
              type="date"
              value={latestDividend.exDate}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-50"
              data-display={formatDate(latestDividend.exDate)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-gray-600 mb-2">Extra Investment Frequency</label>
            <div className="relative">
              <select
                value={extraInvestmentFrequency}
                onChange={(e) => setExtraInvestmentFrequency(e.target.value)}
                className="w-full p-2 border rounded-md appearance-none bg-white cursor-pointer"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Extra Investment Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={extraInvestment}
                onChange={(e) => setExtraInvestment(e.target.value)}
                className="w-full p-2 pl-7 border rounded-md"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Holding Period</label>
            <div className="relative">
              <select
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(e.target.value)}
                className="w-full p-2 border rounded-md appearance-none bg-white cursor-pointer"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} year{i !== 0 ? 's' : ''}</option>
                ))}
                <option value="15">15 years</option>
                <option value="20">20 years</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Expected Dividend Growth Rate</label>
            <div className="relative">
              <input
                type="number"
                value={dividendGrowthRate}
                onChange={(e) => setDividendGrowthRate(e.target.value)}
                className="w-full p-2 pr-8 border rounded-md"
                min="0"
                step="0.1"
                placeholder="0.0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Expected Stock Appreciation</label>
            <div className="relative">
              <input
                type="number"
                value={stockAppreciation}
                onChange={(e) => setStockAppreciation(e.target.value)}
                className="w-full p-2 pr-8 border rounded-md"
                min="0"
                step="0.1"
                placeholder="0.0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>

          {/* 新增计算按钮 */}
          <div className="flex items-end">
            <button
              onClick={scrollToChart}
              className="w-full p-2 bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate
            </button>
          </div>
        </div>

        {/* 图表容器 */}
        <div className="mt-8 grid gap-8" ref={chartRef}>
          {/* Annual Dividend Income 图表 */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Annual Dividend Income</h3>
            <div className="relative h-[300px] md:h-[400px]">
              <Bar 
                data={annualDividendsData} 
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      position: window.innerWidth < 768 ? 'bottom' : 'top',
                      labels: {
                        boxWidth: window.innerWidth < 768 ? 12 : 40,
                        padding: window.innerWidth < 768 ? 10 : 20,
                        font: {
                          size: window.innerWidth < 768 ? 10 : 12
                        }
                      }
                    },
                    datalabels: {
                      ...chartOptions.plugins.datalabels,
                      display: window.innerWidth < 768 ? false : true,
                      font: {
                        size: window.innerWidth < 768 ? 10 : 12
                      }
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        font: {
                          size: window.innerWidth < 768 ? 8 : 12
                        }
                      }
                    },
                    y: {
                      ticks: {
                        font: {
                          size: window.innerWidth < 768 ? 8 : 12
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>

          {/* Total Balance 图表 */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Total Balance</h3>
            <div className="relative h-[300px] md:h-[400px]">
              <Bar 
                data={totalBalanceData} 
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      position: window.innerWidth < 768 ? 'bottom' : 'top',
                      labels: {
                        boxWidth: window.innerWidth < 768 ? 12 : 40,
                        padding: window.innerWidth < 768 ? 10 : 20,
                        font: {
                          size: window.innerWidth < 768 ? 10 : 12
                        }
                      }
                    },
                    datalabels: {
                      ...chartOptions.plugins.datalabels,
                      display: window.innerWidth < 768 ? false : true,
                      font: {
                        size: window.innerWidth < 768 ? 10 : 12
                      }
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        font: {
                          size: window.innerWidth < 768 ? 8 : 12
                        }
                      }
                    },
                    y: {
                      ticks: {
                        font: {
                          size: window.innerWidth < 768 ? 8 : 12
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* 表格容器 */}
        <div className="mt-8 -mx-6 md:mx-0">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Year</th>
                      <th className="px-4 py-2 text-left">Share Price</th>
                      <th className="px-4 py-2 text-left">Dividend per Share</th>
                      <th className="px-4 py-2 text-left">Dividend Yield</th>
                      <th className="px-4 py-2 text-left">Total Investment</th>
                      <th className="px-4 py-2 text-left border-l-2 border-gray-300">DRIP - Annual Dividends</th>
                      <th className="px-4 py-2 text-left">DRIP - Stock Value</th>
                      <th className="px-4 py-2 text-left border-l-2 border-gray-300">No DRIP - Annual Dividends</th>
                      <th className="px-4 py-2 text-left">No DRIP - Accumulated Dividends</th>
                      <th className="px-4 py-2 text-left">No DRIP - Stock Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row) => (
                      <tr key={row.year} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{row.year}</td>
                        <td className="px-4 py-2">${row.sharePrice.toFixed(2)}</td>
                        <td className="px-4 py-2">${row.dividendPerShare.toFixed(2)}</td>
                        <td className="px-4 py-2">{row.dividendYield.toFixed(2)}%</td>
                        <td className="px-4 py-2">${row.totalInvestment.toFixed(2)}</td>
                        <td className="px-4 py-2 border-l-2 border-gray-300">${row.annualDividendsDRIP.toFixed(2)}</td>
                        <td className="px-4 py-2">${row.endBalanceDRIP.toFixed(2)}</td>
                        <td className="px-4 py-2 border-l-2 border-gray-300">${row.annualDividendsNoDRIP.toFixed(2)}</td>
                        <td className="px-4 py-2">${row.accumulatedDividendsNoDRIP.toFixed(2)}</td>
                        <td className="px-4 py-2">${row.endBalanceNoDRIP.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Dividend History Table */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">SCHD Dividend History</h2>

          {/* 新的卡片布局 */}
          <div className="mt-8 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-3 hover:shadow-lg transition-shadow text-center">
              <label className="block text-gray-600 text-sm">Annual Dividend per Share</label>
              <div className="text-xl font-semibold text-[#4CAF50] mt-1">
                ${stockDetail.annualDividend.toFixed(2)}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-3 hover:shadow-lg transition-shadow text-center">
              <label className="block text-gray-600 text-sm">Annual Dividend Yield</label>
              <div className="text-xl font-semibold text-[#4CAF50] mt-1">
                {(stockDetail.annualDividend / numPrice * 100).toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Ex Dividend Date</th>
                  <th className="px-4 py-2 text-left">Frequency</th>
                  <th className="px-4 py-2 text-left">Cash Amount</th>
                  <th className="px-4 py-2 text-left">Declaration Date</th>
                  <th className="px-4 py-2 text-left">Record Date</th>
                  <th className="px-4 py-2 text-left">Payment Date</th>

                </tr>
              </thead>
              <tbody>
                {stockDetail.dividendHistory.map((dividend, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{formatDate(dividend.exDate)}</td>
                    <td className="px-4 py-2">{dividend.frequency}</td>
                    <td className="px-4 py-2">${dividend.amount}</td>
                    <td className="px-4 py-2">{formatDate(dividend.declarationDate)}</td>
                    <td className="px-4 py-2">{formatDate(dividend.recordDate)}</td>
                    <td className="px-4 py-2">{formatDate(dividend.paymentDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>
    </div>
  );
} 