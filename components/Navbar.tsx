'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <Image 
              src="/favicon-32x32.png"
              alt="Dividend Calculator"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-2xl font-semibold text-[#4CAF50]">
              Dividend Calculator
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-[#4CAF50]">Stock</a>
            <a href="#" className="text-gray-600 hover:text-[#4CAF50]">Monthly</a>
            <a 
              href="mailto:dividend-calculator@gmail.com?subject=Feedback%20for%20Dividend%20Calculator"
              className="text-gray-600 hover:text-[#4CAF50]"
            >
              Feedback
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-[#4CAF50]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-gray-600 hover:text-[#4CAF50]">Stock</a>
              <a href="#" className="text-gray-600 hover:text-[#4CAF50]">Monthly</a>
              
              <a 
                href="mailto:dividend-calculator@gmail.com?subject=Feedback%20for%20Dividend%20Calculator"
                className="text-gray-600 hover:text-[#4CAF50]"
              >
                Feedback
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 