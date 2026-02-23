import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/header.jsx';
import axios from "axios";
import { BASE_URL } from '../api/api.js';

// 1. Logos ka mapping object
const brandLogos = {
  Apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  Samsung: "https://upload.wikimedia.org/wikipedia/commons/6/61/Samsung_old_logo_before_year_2015.svg",
  Google: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  Xiaomi: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg",
  Oppo: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Oppo_Logo.svg",
  Vivo: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_mobile_logo.svg",
  OnePlus: "https://upload.wikimedia.org/wikipedia/commons/a/ad/OnePlus_logo.svg",
  // Jo brand matching nahi milega, uske liye default icon chalega
};

const BrandSelection = ({ onSelectBrand }) => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandsFromBE = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/mobiles`);
        const allMobiles = response.data.mobiles; // Access the 'mobiles' array directly

        if (Array.isArray(allMobiles)) {
          // Unique brands extract karna
          const uniqueBrandNames = [...new Set(allMobiles.map(item => item.brand))];
          // Sort: Apple first, Samsung second, rest alphabetically
          const priority = { 'Apple': 0, 'Samsung': 1 };
          const sorted = uniqueBrandNames.sort((a, b) => {
            const pa = priority[a] ?? 99;
            const pb = priority[b] ?? 99;
            if (pa !== pb) return pa - pb;
            return a.localeCompare(b);
          });
          setBrands(sorted);
        } else {
          console.error("API response is not an array:", allMobiles);
          setBrands([]); // Set an empty array or handle accordingly
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]); // Set an empty array in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchBrandsFromBE();
  }, []);

  const handleBrandSelect = (brandName) => {
    localStorage.setItem("selectedBrand", brandName);
    onSelectBrand?.(brandName);
    navigate("/ModelSelection");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
        {/* Progress Tracker */}
        <div className="mb-10 sm:mb-16 flex justify-center">
          <div className="flex flex-wrap justify-center gap-4 max-w-full px-2">
            {[1, 2, 3, 4].map((step, i) => {
              const isActive = step === 1; // Adjust this as per your active step logic

              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-full flex items-center justify-center font-semibold mb-2
                        ${isActive ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-500'}
                        w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base
                      `}
                    >
                      {step}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                      {["Brand", "Model", "Condition", "Storage"][i]}
                    </span>
                  </div>

                  {step !== 4 && (
                    <div className="hidden sm:block w-12 h-0.5 bg-gray-300 self-center"></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-8">Select Your Phone Brand</h1>

          {loading ? (
            <div className="mt-20 flex justify-center items-center gap-2">
              <div className="w-6 h-6 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading Brands...</span>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 max-w-xl mx-auto">
              {brands.map((brandName) => (
                <button
                  key={brandName}
                  onClick={() => handleBrandSelect(brandName)}
                  className="bg-white border-2 border-gray-100 rounded-4xl p-6 hover:border-green-800 hover:shadow-xl transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group h-40 w-40 sm:w-48"
                >
                  {/* LOGO LOGIC */}
                  <div className="w-20 h-18 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {brandLogos[brandName] ? (
                      <img
                        src={brandLogos[brandName]}
                        alt={brandName}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      // Fallback: Agar logo nahi mila to Pehla Letter dikhao
                      <div className="w-16 h-16 bg-gray-100 text-green-800 rounded-full flex items-center justify-center text-3xl font-bold">
                        {brandName[0]}
                      </div>
                    )}
                  </div>

                  <div className="text-sm font-bold text-gray-700 uppercase tracking-wider">
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
