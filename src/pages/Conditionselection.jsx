import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/layout/header.jsx';
import { BASE_URL } from '../lib/api.js';
import first from '../assets/first.png'
import second from '../assets/second.png'
import third from '../assets/third.png'
import fourth from '../assets/fourth.png'
import Chatbot from '../components/Chatbot.jsx';
import Swal from 'sweetalert2';

const ConditionSelection = ({ onSelectCondition }) => {
  const navigate = useNavigate();

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

  const handleSelection = (conditionName) => {
    localStorage.setItem("selectedCondition", conditionName);
    onSelectCondition?.(conditionName);

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
          condition: conditionName,
          currentStep: 'condition'
        })
      }).catch(err => console.error('Draft save error:', err));
    }

    navigate("/Storageselection");
  };

  const showRequirements = (condition) => {
    if (!condition.requirements || condition.requirements.length === 0) {
      handleSelection(condition.name);
      return;
    }

    Swal.fire({
      title: `<strong>${condition.name} Requirements</strong>`,
      icon: 'info',
      html: `
        <div style="text-align: left; font-size: 0.95rem; line-height: 1.6;">
          <ul style="list-style-type: disc; margin-left: 20px;">
            ${condition.requirements.map(req => `<li>${req}</li>`).join('')}
          </ul>
          <p style="margin-top: 15px; font-weight: 500;">Does your device meet all these criteria?</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Yes, it matches',
      cancelButtonText: 'No, go back',
      confirmButtonColor: '#166534', // green-800
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSelection(condition.name);
      }
    });
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
                onClick={() => showRequirements(condition)}
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