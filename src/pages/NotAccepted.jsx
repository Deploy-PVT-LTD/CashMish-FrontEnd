import React from 'react';
import { Home, ArrowLeft, Smartphone, AlertCircle, Mail } from 'lucide-react';
import Header from '../components/layout/header.jsx';
export default function RejectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-6">
            {/* Icon */}
            <div className="flex justify-center mb-3">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-orange-500" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
              We're Sorry
            </h1>

            {/* Message */}
            <p className="text-lg text-gray-600 text-center mb-8">
              We are not currently buying this series and model at this time.
            </p>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <h3 className="font-semibold text-gray-900 mb-2">Why was my phone not accepted?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our buying criteria change based on market demand and inventory levels. We may not be accepting certain models or series temporarily.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Try again in a few weeks as our inventory needs change</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Consider trading in a different device</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Contact us for alternative options</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center flex-col sm:flex-row gap-4 mb-3">
              <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                <Smartphone className="w-5 h-5" />
                <a href="/"> Try Another Device</a>

              </button>

              {/* <button className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors">
                <Home className="w-5 h-5" />
                Back to Home
              </button> */}
            </div>

            {/* Contact Section */}
            {/* <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 text-center mb-4">
                Have questions? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                  <Mail className="w-5 h-5" />
                  Contact Support
                </a>
                <span className="hidden sm:block text-gray-300">|</span>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-center">
                  View Accepted Models
                </a>
              </div>
            </div> */}
          </div>

          {/* Alternative Options */}
          {/* <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">What You Can Do Next</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Try Later</h4>
                <p className="text-sm text-gray-600">Check back in a few weeks</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Different Device</h4>
                <p className="text-sm text-gray-600">Submit another phone</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Contact Us</h4>
                <p className="text-sm text-gray-600">Get personalized help</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}