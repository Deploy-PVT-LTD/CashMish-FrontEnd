import React from 'react';
import { Home, ArrowLeft, Smartphone } from 'lucide-react';
import Header from '../components/header.jsx';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}

 <Header />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
              #1 Phone Trade-In Platform
            </div>

            {/* 404 Text */}
            <h1 className="text-8xl md:text-9xl font-bold text-gray-900 mb-4">
              404
            </h1>

            {/* Error Message */}
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              The page you're looking for doesn't exist. Get instant AI-powered price predictions for your device on our homepage instead.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
               <a href="/login">Get Your Price</a> 
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
              
              <button className="flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors">
                <Home className="w-5 h-5" />
                <a href="/">Back to Home</a>
                
              </button>
            </div>

            {/* Features */}
            {/* <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Price Quote</h3>
                <p className="text-sm text-gray-600">Get AI-powered pricing instantly</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Transaction</h3>
                <p className="text-sm text-gray-600">100% safe and verified</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">All Brands Accepted</h3>
                <p className="text-sm text-gray-600">We accept all phone brands</p>
              </div>
            </div> */}

            {/* Stats Badge */}
            {/* <div className="mt-12 inline-flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-200">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-bold text-gray-900">$45,000+</span>
              <span className="text-gray-600">Phones Sold</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}