import React from "react";
import { useNavigate } from "react-router-dom";
import iphone from "../assets/apple.png";
import samsung from "../assets/samsung.png";
import Header from '../components/header.jsx';

const BrandSelection = ({ onSelectBrand }) => {
  const navigate = useNavigate();

  const brands = [
    { name: "Apple", icon: iphone },
    { name: "Samsung", icon: samsung },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
     <Header />

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
        {/* Progress Steps */}
        <div className="mb-10 sm:mb-16 overflow-x-auto">
          <div className="flex items-center justify-start sm:justify-center gap-6 min-w-[250px] sm:min-w-0">
            {[1, 2, 3, 4].map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold mb-1 sm:mb-2
                    ${step === 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    {step}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {["Brand", "Model", "Condition", "Storage"][i]}
                  </span>
                </div>
                {step !== 4 && (
                  <div className="w-16 sm:w-24 h-0.5 bg-gray-300"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Brand Selection */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Select Your Phone Brand
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-12">
            Choose the manufacturer of your device
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {brands.map((brand) => (
              <button
                key={brand.name}
                onClick={() => {
                  onSelectBrand?.(brand.name);
                  navigate("/ModelSelection");
                }}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8
                           hover:border-blue-500 hover:shadow-lg transition flex flex-col items-center gap-3"
              >
                <img 
                  src={brand.icon} 
                  alt={brand.name} 
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain" 
                />
                <div className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-500">
                  {brand.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrandSelection;
