import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/layout/header.jsx';
import first from '../assets/first.png'
import second from '../assets/second.png'
import third from '../assets/third.png'
import fourth from '../assets/fourth.png'
import Chatbot from '../components/Chatbot.jsx';
const ConditionSelection = ({ onSelectCondition }) => {
  const navigate = useNavigate();

  const conditions = [
    { name: 'Mint', description: 'Like new, no scratches', icon: <img src={first} alt="" />, color: 'green' },
    { name: 'Good', description: 'Minor signs of use', icon: <img src={second} alt="" />, color: 'blue' },
    { name: 'Fair', description: 'Visible wear & tear', icon: <img src={third} alt="" />, color: 'orange' },
    { name: 'Broken', description: 'Cracks (regardless of size)', icon: <img src={fourth} alt="" />, color: 'red' },
  ];

  const onBack = () => {
    navigate("/ModelSelection");
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />
      {/* chatbot */}
      <Chatbot />
      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
        {/* Progress Tracker */}
        <div className="mb-10 sm:mb-16 flex justify-center">
          <div className="flex flex-wrap justify-center gap-4 max-w-full px-2">
            {[1, 2, 3, 4].map((step, i) => {
              const isCompleted = step === 1 || step === 2; // first step completed
              const isActive = step === 3;    // second step active

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
                      {isCompleted ? "✓" : step}
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
        <div className="text-center mb-6">
          <button
            onClick={onBack}
            className="text-green-800 hover:text-green-700 text-sm sm:text-base font-medium cursor-pointer"
          >
            ← Back to models
          </button>
        </div>

        {/* Condition Cards */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Select Your Phone’s Condition
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Accurate details help us offer the best price.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 max-w-5xl mx-auto">
            {conditions.map((condition) => (
              <button
                key={condition.name}
                onClick={() => {
                  localStorage.setItem("selectedCondition", condition.name);
                  console.log("Saved Condition:", condition.name);
                  onSelectCondition?.(condition.name);
                  navigate("/Storageselection");
                }}
                className="bg-white border-2 border-gray-200 rounded-xl
                           p-4 sm:p-6 hover:border-green-800 hover:shadow-lg transition cursor-pointer"
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 rounded-full
                  flex items-center justify-center text-2xl sm:text-3xl
                  ${condition.color === 'green' ? 'bg-green-50' :
                    condition.color === 'blue' ? 'bg-blue-50' :
                      condition.color === 'red' ? 'bg-red-50' : 'bg-orange-50'}`}>
                  {condition.icon}
                </div>
                <div className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                  {condition.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {condition.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConditionSelection;