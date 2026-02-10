import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/header.jsx';
import first from '../assets/first.png'
import second from '../assets/second.png'
import third from '../assets/third.png'
const ConditionSelection = ({ onSelectCondition }) => {
  const navigate = useNavigate();

  const conditions = [
    { name: 'Mint', description: 'Like new, no scratches', icon: <img src={first} alt="" />, color: 'green' },
    { name: 'Good', description: 'Minor signs of use', icon:  <img src={second} alt="" />, color: 'blue' },
    { name: 'Fair', description: 'Visible wear & tear', icon:  <img src={third} alt="" />, color: 'orange' }
  ];
  
  const onBack = () => {
    navigate("/ModelSelection");
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">

           {/* Progress Tracker */}
             <div className="mb-10 sm:mb-16 overflow-x-auto">
               <div className="flex items-center justify-center gap-6">
                 {[1, 2, 3, 4].map((step, i) => {
                   const isCompleted = step < 3; // step 1 done
                   const isActive = step === 3;  // step 2 active
       
                   return (
                     <React.Fragment key={step}>
                       <div className="flex flex-col items-center">
                         <div
                           className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2
                           ${
                             isCompleted
                               ? "bg-green-800 text-white"
                               : isActive
                               ? "bg-green-800 text-white"
                               : "bg-gray-200 text-gray-500"
                           }`}
                         >
                           {isCompleted ? "✓" : step}
                         </div>
                         <span className="text-xs text-gray-500">
                           {["Brand", "Model", "Condition", "Storage"][i]}
                         </span>
                       </div>
                       {step !== 4 && (
                         <div className="w-16 h-0.5 bg-gray-300"></div>
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
            Mobile Overall Condition?
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Be honest — it helps us give you an accurate price
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
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
                           p-6 sm:p-8 hover:border-green-800 hover:shadow-lg transition cursor-pointer"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full
                  flex items-center justify-center text-2xl sm:text-3xl
                  ${condition.color === 'green' ? 'bg-green-50' :
                    condition.color === 'blue' ? 'bg-blue-50' : 'bg-orange-50'}`}>
                  {condition.icon}
                </div>
                <div className="text-base sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
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
