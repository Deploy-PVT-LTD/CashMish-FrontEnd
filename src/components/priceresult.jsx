import React, { useEffect, useState } from "react";
import { TrendingUp, Info, ArrowRight, ShieldCheck, Zap, Truck, CheckCircle, Smartphone, Loader2 } from "lucide-react";
import Header from '../components/header.jsx';
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from '../api/api';

const PriceResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [displayPrice, setDisplayPrice] = useState(0);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gaugeOffset, setGaugeOffset] = useState(251);

  // Data from LocalStorage/State
  const brand = localStorage.getItem('selectedBrand') || 'Smartphone';
  const model = localStorage.getItem('selectedModel') || '';
  const storage = localStorage.getItem('selectedStorage') || '128GB';
  const mobileId = localStorage.getItem('selectedMobileId');

  // Assessment data (images) from previous page
  const assessmentFiles = location.state?.files || [];

  useEffect(() => {
    const fetchPriceFromBE = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/forms/estimate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobileId: mobileId,
            storage: storage,
            screenCondition: localStorage.getItem("screenCondition"),
            bodyCondition: localStorage.getItem("bodyCondition"),
            batteryCondition: localStorage.getItem("batteryCondition"),
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setEstimatedPrice(data.estimatedPrice);
          localStorage.setItem('estimatedPrice', data.estimatedPrice);
        }
      } catch (error) {
        console.error("Price fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceFromBE();
  }, [mobileId, storage]);

  // Price Counting Animation
  useEffect(() => {
    if (estimatedPrice > 0) {
      const duration = 1500;
      const steps = 50;
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

      // Calculate percentage: 0% at $0, 100% at $1500 or more
      const gaugePercentage = Math.min(Math.max((estimatedPrice / 1500) * 100, 0), 100);
      const targetOffset = 251 - (gaugePercentage / 100) * 251;
      setGaugeOffset(targetOffset);

      return () => clearInterval(timer);
    }
  }, [estimatedPrice]);

  const handleProceed = () => {
    // 🔥 CHECK LOGIN STATUS
    const userToken = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    const stateToPass = {
      files: assessmentFiles,
      estimatedPrice: estimatedPrice
    };

    if (userToken || userData) {
      // ✅ User Login hai -> Seedha User Data (Form) par bhejo
      navigate("/userdata", { state: stateToPass });
    } else {
      // ❌ User Login nahi hai -> Cart/Login page par bhejo
      navigate("/cartlogin", { state: stateToPass });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 font-bold text-gray-600">Calculating Best Price for you...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans pb-12">
      <Header />
      <main className="flex-1 flex flex-col items-center px-2 pt-5">
        {/* Step Indicator */}
        <div className="w-full max-w-md mb-8 flex justify-between items-end px-2">
          <div>
            <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-1">Step 3 of 4</p>
            <h1 className="text-xl font-black text-gray-900">Your Quote is Ready!</h1>
          </div>
          <div className="flex gap-1.5 mb-1">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1.5 w-5 rounded-full ${s <= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {/* Main Price Card */}
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white p-8 relative">
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full mb-6 border border-green-100">
                <Zap className="w-3 h-3 fill-green-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">Estimated Price</span>
              </div>

              {/* Gauge */}
              <div className="relative w-64 h-32 mx-auto mb-4">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f5f9" strokeWidth="14" strokeLinecap="round" />
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#premiumGradient)" strokeWidth="14" strokeLinecap="round" strokeDasharray="251" strokeDashoffset={gaugeOffset} style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.2, 0.8, 0.2, 1)' }} />
                  <defs>
                    <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end">
                  <span className="text-5xl font-black text-gray-900 tracking-tight">${displayPrice}</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-700 capitalize">{brand} {model}</h2>
                <p className="text-xs text-gray-400 font-medium">{storage} • {localStorage.getItem("screenCondition")} screen</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] font-bold text-gray-600 text-left leading-tight">Free Home Pickup</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] font-bold text-gray-600 text-left leading-tight">Secure Payment</span>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="group w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="text-sm uppercase tracking-wider">Confirm My Offer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PriceResult;