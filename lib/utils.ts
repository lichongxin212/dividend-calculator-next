export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
}

export function calculateDividendFrequency(dividendDates: string[]): string {
  if (dividendDates.length < 2) return 'Unknown';
  
  const dates = dividendDates.map(date => new Date(date));
  const intervals = [];
  
  for (let i = 1; i < dates.length; i++) {
    const months = (dates[i-1].getFullYear() - dates[i].getFullYear()) * 12 +
      dates[i-1].getMonth() - dates[i].getMonth();
    intervals.push(Math.abs(months));
  }
  
  const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  
  if (averageInterval <= 1) return 'Monthly';
  if (averageInterval <= 3) return 'Quarterly';
  if (averageInterval <= 6) return 'Semi-Annual';
  return 'Annual';
}

export function groupDividendsByMonth(dividends: Array<{
  amount: number;
  exDate: string;
}>): Array<{ month: string; amount: number }> {
  const monthlyDividends = new Map<string, number>();
  
  dividends.forEach(dividend => {
    const date = new Date(dividend.exDate);
    const monthKey = date.toLocaleString('en-US', { month: 'short' });
    const currentAmount = monthlyDividends.get(monthKey) || 0;
    monthlyDividends.set(monthKey, currentAmount + dividend.amount);
  });
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map(month => ({
    month,
    amount: monthlyDividends.get(month) || 0
  }));
}

export function calculateAnnualDividend(
  dividends: Array<{ amount: number }>,
  frequency: string
): number {
  const totalDividends = dividends.reduce((sum, div) => sum + div.amount, 0);
  
  switch (frequency.toLowerCase()) {
    case 'monthly':
      return totalDividends;
    case 'quarterly':
      return totalDividends * (12 / 3);
    case 'semi-annual':
      return totalDividends * (12 / 6);
    case 'annual':
      return totalDividends;
    default:
      return totalDividends;
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
} 