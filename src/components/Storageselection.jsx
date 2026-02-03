import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/header.jsx';

const StorageSelection = ({
  selectedBrand,
  selectedModel,
  selectedCondition,
  onGetPrice,
  onBack
}) => {
  const navigate = useNavigate();

  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB'];
  const [selectedStorage, setSelectedStorage] = React.useState('64GB');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
 <Header  />

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
        {/* Progress Steps (scrollable on mobile) */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center justify-start sm:justify-center gap-4 min-w-[250px] sm:min-w-0">
            {['Brand', 'Model', 'Condition', 'Storage'].map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 text-white
                                  flex items-center justify-center font-semibold mb-1">
                    {index < 3 ? '✓' : '4'}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">{step}</span>
                </div>
                {index !== 3 && (
                  <div className="w-16 sm:w-24 h-0.5 bg-blue-500"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Back */}
        <div className="text-center mb-6 ">
          <button
            onClick={() => onBack ? onBack() : navigate("/conditionselection")}
            className="text-blue-500 hover:text-blue-600 text-sm sm:text-base font-medium cursor-pointer"
          >
            ← Back to condition
          </button>
        </div>

        {/* Storage Selection */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Storage Capacity
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-10">
            Select your device's storage size
          </p>

          {/* Options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto mb-8 sm:mb-12">
            {storageOptions.map((storage) => (
              <button
                key={storage}
                onClick={() => setSelectedStorage(storage)}
                className={`rounded-xl border-2 p-4 sm:p-5 transition cursor-pointer
                  ${selectedStorage === storage
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-200 text-gray-900 hover:border-blue-500'
                  }`}
              >
                <div className="text-xl sm:text-2xl mb-1">💾</div>
                <div className="font-semibold text-sm sm:text-base">
                  {storage}
                </div>
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              localStorage.setItem("selectedStorage", selectedStorage);
              console.log("Saved storage:", selectedStorage);
              if (onGetPrice) onGetPrice(selectedStorage);
              navigate("/carrierselection");
            }}
            className="w-44 sm:w-48 bg-blue-500 text-white py-2.5 rounded-lg
                       font-semibold hover:bg-blue-600 transition cursor-pointer"
          >
            Add Data →
          </button>
        </div>
      </main>
    </div>
  );
};

export default StorageSelection;
