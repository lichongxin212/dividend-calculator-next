export default function FAQSection() {
  return (
    <section className="my-16">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">FAQs</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">How to calculate stock dividend yield?</h3>
          <p className="text-gray-600 mb-4">Dividend yield is calculated by dividing the total dividends paid over the past 12 months by the current stock price. For example, if a stock paid $2 in dividends over the last year and currently trades at $50, its dividend yield would be 4% ($2/$50 × 100%).</p>
          <p className="text-gray-600">This calculator automatically fetches the last 12 months of actual dividend payments and current stock prices to provide accurate dividend yields.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">How to calculate portfolio dividend yield?</h3>
          <p className="text-gray-600 mb-4">Portfolio dividend yield is calculated by dividing the total annual dividend income by the total portfolio value. The calculator sums up all individual stock positions' dividend income and investment amounts to determine the overall portfolio yield.</p>
          <p className="text-gray-600">For example, if your portfolio value is $10,000 and generates $400 in annual dividends, your portfolio dividend yield would be 4%.</p>
        </div>
      </div>
    </section>
  );
}