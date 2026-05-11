import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/layout/header.jsx';
import { BASE_URL } from '../lib/api.js';
import first from '../assets/first.png'
import second from '../assets/second.png'
import third from '../assets/third.png'
import fourth from '../assets/fourth.png'
import Chatbot from '../components/Chatbot.jsx';
import { Check } from 'lucide-react';

const ConditionSelection = ({ onSelectCondition }) => {
  const navigate = useNavigate();
  const [selectedCondition, setSelectedCondition] = useState(null);

  const conditions = [
    { 
      name: 'Mint', 
      description: 'Like new, no scratches', 
      icon: <img src={first} alt="Mint condition iPhone" />, 
      color: 'green',
      requirements: [
        'Still in factory original packaging.',
        'Plastic film still on the device and has not been reapplied.',
        'Device is not activated.',
        'Must come with the original box with matching serial number.',
        'Contains original accessories sealed and untouched.',
        'Must be paid off and free of any financial obligations.'
      ]
    },
    { 
      name: 'Good', 
      description: 'Minor signs of use', 
      icon: <img src={second} alt="Good condition iPhone" />, 
      color: 'blue',
      requirements: [
        'Light to moderate signs of wear. Few light scratches and/or dents.',
        'Display is free of defects such as cracks, dead pixels, white spots, or burn-in.',
        'Original battery above 80% capacity.',
        'Powers on and functions 100% as intended.',
        'Must be paid off and free of any financial obligations.'
      ]
    },
    { 
      name: 'Fair', 
      description: 'Visible wear & tear', 
      icon: <img src={third} alt="Fair condition iPhone" />, 
      color: 'orange',
      requirements: [
        'Functionally defective or broken parts on either screen or body of the item.',
        'Cracked display or damaged housing.',
        'Display defects such as dead pixels, white spots, or burn-in.',
        'Shows no signs of liquid intrusion or water damage.'
      ]
    },
    { 
      name: 'Broken', 
      description: 'Cracks (regardless of size)', 
      icon: <img src={fourth} alt="Broken iPhone condition" />, 
      color: 'red',
      requirements: [
        'Heavy physical damage or multiple cracks.',
        'Liquid damage or water intrusion signs.',
        'Connectivity issues or sensor failures.',
        'Device does not power on or stays stuck on logo.'
      ]
    },
  ];

  const onBack = () => {
    navigate("/ModelSelection");
  };

  const handleNext = () => {
    if (!selectedCondition) return;

    localStorage.setItem("selectedCondition", selectedCondition.name);
    onSelectCondition?.(selectedCondition.name);

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
          condition: selectedCondition.name,
          currentStep: 'condition'
        })
      }).catch(err => console.error('Draft save error:', err));
    }

    navigate("/Storageselection");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Chatbot />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full pb-20">
        {/* Progress Tracker */}
        <div className="mb-10 sm:mb-16 flex justify-center">
          <div className="flex flex-wrap justify-center gap-4 max-w-full px-2">
            {[1, 2, 3, 4].map((step, i) => {
              const isCompleted = step === 1 || step === 2; 
              const isActive = step === 3;    

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

        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Select Your Phone’s Condition
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Accurate details help us offer the best price.
          </p>

          {/* Condition Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 max-w-5xl mx-auto mb-6">
            {conditions.map((condition) => (
              <button
                key={condition.name}
                onClick={() => setSelectedCondition(condition)}
                className={`bg-white border-2 rounded-xl p-4 sm:p-6 transition cursor-pointer relative overflow-hidden
                           ${selectedCondition?.name === condition.name 
                             ? 'border-green-800 shadow-md ring-1 ring-green-800' 
                             : 'border-gray-200 hover:border-green-800/50 hover:shadow-lg'}`}
              >
                {selectedCondition?.name === condition.name && (
                  <div className="absolute top-2 right-2 bg-green-800 text-white rounded-full p-0.5 sm:p-1">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                )}
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

          {/* Requirements & Next Button Section */}
          {selectedCondition && (
            <div className="max-w-5xl mx-auto bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 animate-fade-in-up">
              <div className="text-left">
                <ul className="space-y-2 mb-6">
                  {selectedCondition.requirements.map((req, idx) => (
                    <li key={idx} className="flex gap-3 items-start text-gray-700">
                      <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-green-50 text-green-700 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-sm sm:text-base leading-tight font-medium">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex border-t border-gray-100 pt-4 justify-end">
                <button
                  onClick={handleNext}
                  className="w-full sm:w-40 bg-green-800 text-white py-2.5 px-6 rounded-xl font-bold text-base 
                             hover:bg-green-700 transition shadow-md shadow-green-800/10 active:scale-95 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConditionSelection;