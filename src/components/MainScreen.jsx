import React from 'react';
import phoneMockup from '../assets/image-removebg-preview.png';
import { Smartphone, Shield, Zap } from 'lucide-react';
import Header from '../components/header.jsx';

const  PhoneFlipLanding= () =>  {
  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-6 overflow-hidden">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              #1 Phone Trade-In Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Sell Your Phone at the Best <span className="text-blue-600">Price</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Get instant AI-powered price predictions for your device. Quick doorstep pickup and instant payment guaranteed.
            </p>
            
          {/* Buttons */}
<div className="flex flex-col sm:flex-row gap-3">
  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center">
    <a href="/brandselection">Get Your Price</a>   
    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
  <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors font-medium text-sm">
    <a href="/howitworks">How It Works</a>  
  </button>
</div>

            
            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">Instant Price Quote</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">Secure Transaction</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">All Brands Accepted</span>
              </div>
            </div>
          </div>

          {/* Right Column - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Verified Badge */}
<div className="absolute top-8 left-4 lg:left-auto lg:right-[18rem] bg-white rounded-xl shadow-lg px-6 py-3 flex items-center space-x-3 z-10 animate-pulse">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Verified</div>
                <div className="text-xs text-gray-600">100% Secure</div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="relative mt-16 lg:mt-0">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-8 shadow-2xl w-72 sm:w-80 transform rotate-3">
                {/* <div className="bg-white rounded-[2.5rem] p-8 h-96 flex flex-col items-center justify-center space-y-6 transform -rotate-3"> */}
                  {/* <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center"> */}
                    {/* <Smartphone className="w-12 h-12 text-blue-600" /> */}
                  {/* </div> */}
                  <div className="text-center">
                    {/* <div className="text-2xl font-bold text-gray-900">CashMish</div> */}
                    {/* <div className="text-gray-600 mt-2">Trade Smart</div> */}
                    <img src={phoneMockup} alt="phone" />
                  {/* </div> */}
                </div>
              </div>

              {/* Stats Badge */}
<div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg px-6 py-4">
                <div className="w-12 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">$45,000+</div>
                  <div className="text-xs text-gray-600">Phones Sold</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

    export default PhoneFlipLanding;