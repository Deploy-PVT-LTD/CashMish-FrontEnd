import React from 'react';
import { Clock, MessageSquare, DollarSign } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/header.jsx';

export default function PendingPage() {
  const location = useLocation();
  const estimatedPrice = location.state?.estimatedPrice || 0;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <div className="flex-grow flex items-center justify-center px-4">
        
        <div className="w-full max-w-xs sm:max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center">
          
          {/* Clock Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-yellow-400 rounded-full p-3 sm:p-4">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            Response Pending
          </h1>

          {/* Info Box */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex items-start">
              <MessageSquare className="w-4 h-4 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
              <p className="text-sm text-gray-700 text-left">
                Please wait. You will receive a response within <strong>24 hours</strong>.
              </p>
            </div>
          </div>

          {/* 鉁?Estimated Price Section - INFO BOX KE NEECHE */}
          {estimatedPrice > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Estimated Price
                </span>
              </div>
              <p className="text-3xl font-bold text-green-600">
                ${estimatedPrice.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Final price may vary based on device inspection
              </p>
            </div>
          )}

          <p className="text-sm text-gray-600 mb-2">
            Your request has been received and is being processed.
            Check Your request in Cart
          </p>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium">We are working on your request</p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Thank you for your patience</p>
          </div>
        </div>
      </div>
    </div>
  );
}