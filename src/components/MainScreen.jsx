import React, { useState, useEffect } from 'react';
import phoneMockup from '../assets/image-removebg-preview.png';
import { Smartphone, Shield, Zap } from 'lucide-react';
import Header from '../components/header.jsx';

const PhoneFlipLanding = () => {
  const fullText = "Sell Your Phone at the Best Price";
  const [displayText, setDisplayText] = useState("");

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 70 ); // adjust speed here
    return () => clearInterval(interval);
  }, []);

  // Split text to color "Price"
  const renderText = () => {
    const parts = displayText.split(" ");
    return parts.map((word, i) =>
      word === "Price" ? <span key={i} className="text-blue-600">{word} </span> : word + " "
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
<main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 lg:py-4 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {renderText()}
              {/* <span className="border-r-2 border-gray-900 animate-pulse ml-1"></span> Blinking cursor */}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Get instant AI-powered price predictions for your device. Quick doorstep pickup and instant payment guaranteed.
            </p>

            {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
  <a 
    href="/brandselection" 
    className="bg-blue-600 text-white px-4 py-2 lg:py-3 rounded-lg font-medium text-sm flex items-center justify-center cursor-pointer 
               hover:bg-blue-700 sm:hover:bg-blue-700 transition-colors"
  >
    Get Your Price
    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </a>

  <a 
    href="/howitworks" 
    className="bg-white text-gray-700 px-4 py-2 lg:py-3 rounded-lg border border-gray-200 font-medium text-sm flex items-center justify-center cursor-pointer 
               hover:border-gray-300 sm:hover:border-gray-300 transition-colors"
  >
    How It Works
  </a>
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
<div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-8 shadow-xl w-72 sm:w-80 transform rotate-3">
                <div className="text-center">
                  <img src={phoneMockup} alt="phone" />
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
};

export default PhoneFlipLanding;
