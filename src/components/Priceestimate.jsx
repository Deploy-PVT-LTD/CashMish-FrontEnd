import React from 'react';
import Header from '../components/header.jsx';

// ==================== PRICE ESTIMATE COMPONENT (RESULT SCREEN) ====================
const PriceEstimate = ({ selectedBrand, selectedCondition, selectedStorage }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
     <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          {/* Price Display */}
          <div className="mb-8">
            <div className="relative inline-block">
              <svg className="w-48 h-48" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray="502"
                  strokeDashoffset="125"
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl font-bold text-blue-900">$450</div>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Low</div>
              <div className="text-2xl font-bold text-gray-900">$405</div>
            </div>
            <div className="text-gray-400">—</div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">High</div>
              <div className="text-2xl font-bold text-gray-900">$495</div>
            </div>
          </div>

          {/* Device Info */}
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
            <span className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <span className="text-xs">ℹ</span>
            </span>
            <span>{selectedBrand} • {selectedCondition} Condition • {selectedStorage}</span>
          </div>

          {/* CTA Button */}
          <button className="bg-blue-500 text-white px-12 py-4 rounded-lg font-semibold hover:bg-blue-600 transition text-lg">
            Proceed to Sell →
          </button>
        </div>

        {/* Features */}
        <div className="mt-8 flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Real-time market prices
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            No hidden fees
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Price lock for 7 days
          </div>
        </div>
      </main>
    </div>
  );
};

export default PriceEstimate;