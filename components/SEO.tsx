import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function SEO({ 
  title = 'Dividend Calculator | Calculate dividend yield of your portfolio',
  description = 'Free online dividend calculator to analyze your stock portfolio\'s dividend income. Track dividend payments, calculate annual yields, view monthly dividend distribution, and analyze portfolio allocation.',
  keywords = 'dividend calculator, portfolio dividend tracker, dividend yield calculator'
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
} 