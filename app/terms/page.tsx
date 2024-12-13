export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-gray">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using Dividend Calculator, you accept and agree to be bound by these Terms of Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
          <p className="mb-4">
            Our calculator provides dividend investment calculations for informational purposes only. The information should not be considered as financial advice.
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>All calculations are estimates based on provided data</li>
            <li>Past performance does not guarantee future results</li>
            <li>Verify all information independently</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p className="mb-4">
            The service is provided "as is" without warranties of any kind. We are not responsible for any investment decisions made based on our calculations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
          <p className="mb-4">
            We reserve the right to modify or discontinue the service at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
          <p className="mb-4">
            For questions about these Terms, please contact:{' '}
            <a 
              href="mailto:feedback@dividend-calculator.org"
              className="text-[#4CAF50] hover:underline"
            >
              feedback@dividend-calculator.org
            </a>
          </p>
        </section>

        <section className="mb-8">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
}