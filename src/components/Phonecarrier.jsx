import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone } from 'lucide-react';
import Header from '../components/header.jsx';

export default function CarrierSelection() {
  const [carrier, setCarrier] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({ model: ""});
  const navigate = useNavigate(); // ✅ useNavigate hook

  // Yeh data API se fetch hoga
  useEffect(() => {
    const selectedModel = localStorage.getItem("selectedModel"); // pehle wale component se
    setDeviceInfo({
      model: selectedModel || "Unknown Model"
    });
  }, []);


  return (
    <div>  {/* Header */}
        <Header simple />


<div className="bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-3xl w-full">
      
        {/* <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full mb-6">
            <Smartphone className="w-5 h-5" />
            <span className="font-bold text-lg">
              <a href="/">CashMish</a></span>
          </div>
        </div> */}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          {/* Device Info */}
          <div className="text-center mb-8">
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {deviceInfo.model}: <span className="text-green-600">{deviceInfo.condition}</span>
            </p>
          </div>

          {/* Carrier Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Please select the phone's carrier?
            </h2>
            <p className="text-gray-600 mb-6">
              Is your phone finance, blacklisted or activation locked?
            </p>

            {/* Carrier Buttons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
              <button
                onClick={() => setCarrier('att')}
                className={`cursor-pointer p-5 rounded-xl border-2 text-center font-semibold transition-all ${
                  carrier === 'att'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                AT&T
              </button>

              <button
                onClick={() => setCarrier('verizon')}
                className={`cursor-pointer p-5 rounded-xl border-2 text-center font-semibold transition-all ${
                  carrier === 'verizon'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                Verizon
              </button>

              <button
                onClick={() => setCarrier('sprint')}
                className={`cursor-pointer p-5 rounded-xl border-2 text-center font-semibold transition-all ${
                  carrier === 'sprint'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                Sprint
              </button>

              <button
                onClick={() => setCarrier('tmobile')}
                className={`cursor-pointer p-5 rounded-xl border-2 text-center font-semibold transition-all ${
                  carrier === 'tmobile'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                T-Mobile
              </button>

              <button
                onClick={() => setCarrier('unlocked')}
                className={`cursor-pointer p-5 rounded-xl border-2 text-center font-semibold transition-all ${
                  carrier === 'unlocked'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                Unlocked
              </button>

              <button
                onClick={() => setCarrier('other')}
                className={`cursor-pointer p-5 rounded-xl border-2 text-center font-semibold transition-all ${
                  carrier === 'other'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                Other Carrier
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={!carrier}
            onClick={() => navigate("/deviceassessment")} // ✅ correct navigation
            className={`w-full font-semibold py-4 rounded-xl transition-all shadow-lg cursor-pointer ${
              carrier
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>

        {/* Info Note */}
        {/* <p className="text-center text-sm text-gray-500 mt-6">
          Your device information is encrypted and secure
        </p> */}
      </div>
    </div>
    </div>
  );
}
