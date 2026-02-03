import React from 'react';
import { Clock, MessageSquare } from 'lucide-react';
import Header from '../components/header.jsx';

export default function PendingPage() {
  return (
    /* h-screen aur overflow-hidden scroll ko khatam kar dega */
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* flex-grow bachi hui puri space le lega aur content ko center karega */}
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