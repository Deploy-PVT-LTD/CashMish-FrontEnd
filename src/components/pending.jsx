import React from 'react';
import { Clock, MessageSquare } from 'lucide-react';
import Header from '../components/header.jsx';
export default function PendingPage() {
  return (
<div>    

    

    

  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center pt-4 pb-2 px-2 sm:px-4">
  <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 text-center">
    


    {/* Clock */}
    <div className="flex justify-center mb-3 sm:mb-6">
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-yellow-400 rounded-full p-2 sm:p-4">
          <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
        </div>
      </div>
    </div>

    {/* Heading */}
    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-4 px-1">
      Response Pending
    </h1>

    {/* Info Box */}
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 sm:p-4 mb-3 sm:mb-6">
      <div className="flex items-start">
        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
        <p className="text-xs sm:text-sm text-gray-700 text-left">
          Please wait. You will receive a response within <strong>24 hours</strong>.
        </p>
      </div>
    </div>

    <p className="text-xs sm:text-sm text-gray-600 mb-2 px-1">
      Your request has been received and is being processed.
    </p>

    {/* Footer */}
    <div className="mt-4 sm:mt-6 pt-3 sm:pt-6 border-t border-gray-200">
      <p className="text-[10px] sm:text-xs text-gray-500">We are working on your request</p>
      <p className="text-[10px] text-gray-400 mt-1">Thank you for your patience</p>
    </div>
  </div>
</div>
</div>

  );
}