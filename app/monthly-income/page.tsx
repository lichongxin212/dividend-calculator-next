import DividendCalculator from '@/components/DividendCalculator'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dividend Calculator | Calculate dividend yield of your portfolio',
  description: 'Free online dividend calculator to analyze your stock portfolio\'s dividend income. Track dividend payments, calculate annual yields, view monthly dividend distribution, and analyze portfolio allocation. Support stocks and ETFs like JEPI, SCHD, VOO.',
  keywords: 'dividend calculator, portfolio dividend tracker, dividend yield calculator, annual dividend, monthly dividend income, stock dividend analysis, ETF dividend calculator, dividend payment tracker, JEPI dividend, SCHD dividend, SPYD dividend, portfolio dividend calculator, dividend history tracker'
}

export default function Home() {
  return <DividendCalculator />
}
