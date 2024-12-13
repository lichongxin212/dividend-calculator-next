export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Dividend Calculator. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="mailto:feedback@dividend-calculator.org?subject=Feedback%20for%20Dividend%20Calculator"
              className="text-gray-600 hover:text-[#4CAF50] text-sm transition-colors"
            >
              Feedback
            </a>
            <a 
              href="/privacy" 
              className="text-gray-600 hover:text-[#4CAF50] text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-gray-600 hover:text-[#4CAF50] text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}