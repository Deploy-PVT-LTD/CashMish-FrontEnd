import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/layout/header.jsx';
import storageimg from '../assets/storage.png'

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
      <Header />

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
        {/* Progress Tracker */}
        <div className="mb-10 sm:mb-16 flex justify-center">
          <div className="flex flex-wrap justify-center gap-4 max-w-full px-2">
            {[1, 2, 3, 4].map((step, i) => {
              const isCompleted = step === 1 || step === 2 || step === 3; // first step completed
              const isActive = step === 4;    // second step active

              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-full flex items-center justify-center font-semibold mb-2
                         ${isCompleted
                          ? 'bg-green-800 text-white'
                          : isActive
                            ? 'bg-green-800 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }
                         w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base
                       `}
                    >
                      {isCompleted ? "\u2713" : step}
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

        {/* Back */}
        <div className="text-center mb-6 ">
          <button
            onClick={() => onBack ? onBack() : navigate("/conditionselection")}
            className="text-green-800 hover:text-green-700 text-sm sm:text-base font-medium cursor-pointer"
          >
            ← Back to condition
          </button>
        </div>

        {/* Storage Selection */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Select Your Device Storage
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-10">
            Select the storage option that matches your device.
          </p>

          {/* Options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 max-w-200 mx-auto mb-8 sm:mb-12">
            {storageOptions.map((storage) => (
              <button
                key={storage}
                onClick={() => setSelectedStorage(storage)}
                className={`rounded-lg border-2 p-2 sm:p-4 transition cursor-pointer
        ${selectedStorage === storage
                    ? 'bg-gray-400 border-gray-500 text-white'
                    : 'bg-white border-gray-200 text-gray-900 hover:border-gray-500'
                  }`}
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 mb-1">
                  <img src={storageimg} alt="mobile storage option" className="w-full h-full object-contain" />
                </div>
                <div className="font-semibold text-xs sm:text-sm">
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
            className="w-44 sm:w-48 bg-green-800 text-white py-2.5 rounded-lg
                       font-semibold hover:bg-green-700 transition cursor-pointer"
          >
            Continue →
          </button>
        </div>
      </main>
    </div>
  );
};

export default StorageSelection;
