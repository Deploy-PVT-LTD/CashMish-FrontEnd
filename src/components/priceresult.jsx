import React, { useEffect, useState } from "react";
import { TrendingUp, Info, ArrowRight } from "lucide-react";
import Header from '../components/header.jsx';
import { useNavigate } from "react-router-dom";


const PriceResult = ({ phoneData = {}, onContinue }) => {
  const navigate = useNavigate();

  const [displayPrice, setDisplayPrice] = useState(0);
  const [gaugeOffset, setGaugeOffset] = useState(251);

  const brand = (phoneData?.brand || "other").toLowerCase();
  const condition = (phoneData?.condition || "good").toLowerCase();
  const storage = phoneData?.storage || "128GB";

  const calculatePrice = () => {
    let basePrice = 300;
    if (brand === "apple") basePrice = 450;
    else if (brand === "samsung") basePrice = 380;
    else if (brand === "google") basePrice = 350;
    if (condition === "mint") basePrice *= 1.2;
    else if (condition === "fair") basePrice *= 0.7;
    if (storage.includes("256")) basePrice *= 1.15;
    else if (storage.includes("512")) basePrice *= 1.3;
    else if (storage.includes("1TB")) basePrice *= 1.5;
    return Math.round(basePrice);
  };

  const estimatedPrice = calculatePrice();
  const minPrice = Math.round(estimatedPrice * 0.9);
  const maxPrice = Math.round(estimatedPrice * 1.1);
  const gaugePercentage = Math.min(((estimatedPrice - 100) / 800) * 100, 100);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = estimatedPrice / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= estimatedPrice) {
        setDisplayPrice(estimatedPrice);
        clearInterval(timer);
      } else {
        setDisplayPrice(Math.round(current));
      }
    }, duration / steps);

    const targetOffset = 251 - (gaugePercentage / 100) * 251;
    setGaugeOffset(targetOffset);
    return () => clearInterval(timer);
  }, [estimatedPrice, gaugePercentage]);

  return (
    
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <Header />
      
      {/* Main Container - Optimized for height */}
      <section className="flex-1 flex flex-col items-center justify-center p-4">
        
        
        <div className="w-full max-w-lg mx-auto"> {/* Max-width chota kiya (2xl to lg) */}
          <div className="bg-white rounded-[1.5rem] p-5 md:p-7 shadow-lg border border-gray-100 text-center">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full mb-4">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Estimate Ready</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Device Value</h2>

            {/* Compact Gauge Visualization */}
            <div className="relative w-48 h-24 mx-auto mb-10"> {/* Gauge size chota kiya */}
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset={gaugeOffset}
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-end justify-center">
                <span className="text-4xl font-black text-gray-800 leading-none">${displayPrice}</span>
              </div>
            </div>

            {/* Compact Range Display */}
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Min Value</p>
                <p className="text-base font-bold text-gray-700">${minPrice}</p>
              </div>
              <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Max Value</p>
                <p className="text-base font-bold text-gray-700">${maxPrice}</p>
              </div>
            </div>

            {/* Device Info */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span className="capitalize">{brand} • {storage} • {condition}</span>
            </div>

            {/* Action Button */}
          <button
  onClick={() => navigate("/Userdata")}
  className="cursor-pointer  w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
>
  <span className="text-sm">Proceed to Sell</span>
  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform " />
</button>

          </div>
        </div>
      </section>
    </div>
  );
};

export default PriceResult;