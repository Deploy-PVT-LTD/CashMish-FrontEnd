import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/layout/header.jsx';
import { BASE_URL } from '../lib/api.js';
import Chatbot from "../components/Chatbot.jsx";

const CarrierSelection = () => {
  const [carrier, setCarrier] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({ model: "", condition: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Pichle pages se data uthayein
    const selectedModel = localStorage.getItem("selectedModel");
    const selectedCondition = localStorage.getItem("selectedCondition");

    setDeviceInfo({
      model: selectedModel || "Unknown Model",
      condition: selectedCondition || ""
    });
  }, []);

  // Data save karne ka function
  const handleContinue = () => {
    if (carrier) {
      localStorage.setItem("selectedCarrier", carrier);
      console.log("Saved Carrier:", carrier);

      // Auto-save draft to DB for logged-in users
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id;
      if (userId) {
        fetch(`${BASE_URL}/api/drafts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            brand: localStorage.getItem('selectedBrand'),
            model: localStorage.getItem('selectedModel'),
            mobileId: localStorage.getItem('selectedMobileId'),
            mobileImage: localStorage.getItem('selectedMobileImage'),
            condition: localStorage.getItem('selectedCondition'),
            storage: localStorage.getItem('selectedStorage'),
            carrier,
            currentStep: 'carrier'
          })
        }).catch(err => console.error('Draft save error:', err));
      }

      navigate("/deviceassessment");
    }
  };

  return (
    <div>
      <Header />
      {/* chatbot */}
      <Chatbot />
      <div className="bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-3xl w-full">
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
                Choose your phone’s carrier
              </h2>
              <p className="text-gray-600 mb-6">
                Is the device financed, blacklisted, or activation locked?
              </p>

              {/* Carrier Buttons Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['att', 'verizon', 'sprint', 'tmobile', 'unlocked', 'other'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCarrier(c)}
                    className={`cursor-pointer p-5 rounded-xl border-2 text-center font-semibold transition-all capitalize ${carrier === c
                      ? 'border-greem-800 bg-blue-50 text-green-700 shadow-sm'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {c === 'att' ? 'AT&T' : c === 'tmobile' ? 'T-Mobile' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={!carrier}
              onClick={handleContinue} // Ab ye save bhi karega
              className={`w-full font-semibold py-4 rounded-xl transition-all shadow-lg cursor-pointer ${carrier
                ? "bg-green-800 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarrierSelection;