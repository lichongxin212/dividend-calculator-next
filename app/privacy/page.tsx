export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="mb-4">
            We collect minimal information to provide and improve our dividend calculation service. This includes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Usage data through Google Analytics</li>
            <li>Feedback you choose to provide</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-4">
            We use the collected information to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Improve our calculator and user experience</li>
            <li>Analyze site usage patterns</li>
            <li>Respond to your feedback and inquiries</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your information. However, no internet transmission is completely secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy, please contact us at:{' '}
            <a 
              href="mailto:feedback@dividend-calculator.org"
              className="text-[#4CAF50] hover:underline"
            >
              feedback@dividend-calculator.org
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. The latest version will be posted on this page.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
} 