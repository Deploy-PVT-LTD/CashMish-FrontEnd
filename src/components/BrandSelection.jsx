import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/header.jsx';
import axios from "axios";

const BrandSelection = ({ onSelectBrand }) => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Backend se data fetch karne ka logic
  useEffect(() => {
    const fetchBrandsFromBE = async () => {
      try {
        // Aapka backend endpoint: /api/mobiles
        const response = await axios.get("http://localhost:5000/api/mobiles");

        const allMobiles = response.data;
        const uniqueBrandNames = [...new Set(allMobiles.map(item => item.brand))];
        
        setBrands(uniqueBrandNames);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandsFromBE();
  }, []);

  const handleBrandSelect = (brandName) => {
    localStorage.setItem("selectedBrand", brandName); // Storage mein save
    console.log(brandName);
    
    onSelectBrand?.(brandName); // Parent state update
    navigate("/ModelSelection"); // Agla page
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
        
        {/* Progress Tracker UI */}
        <div className="mb-10 sm:mb-16 overflow-x-auto">
          <div className="flex items-center justify-center gap-6">
            {[1, 2, 3, 4].map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${step === 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                    {step}
                  </div>
                  <span className="text-xs text-gray-500">{["Brand", "Model", "Condition", "Storage"][i]}</span>
                </div>
                {step !== 4 && <div className="w-16 h-0.5 bg-gray-300"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">Select Your Phone Brand</h1>
          
          {loading ? (
            <div className="mt-20 flex justify-center items-center gap-2">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading Brands...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {brands.map((brandName) => (
                <button
                  key={brandName}
                  onClick={() => handleBrandSelect(brandName)}
                  className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition-all flex flex-col items-center gap-4 cursor-pointer group"
                >
                  {/* Default Dynamic Icon (Brand ka pehla letter) */}
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl font-bold group-hover:scale-110 transition-transform">
                    {brandName[0]}
                  </div>
                  <div className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                    {brandName}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BrandSelection;