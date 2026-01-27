import React from "react";
import { useNavigate } from "react-router-dom";
import MobileCard from "../components/MobileCard";
import Header from '../components/header.jsx';
const ModelSelection = ({ selectedBrand }) => {
  const navigate = useNavigate();

  // ✅ Static models (abhi backend nahi)
  const models = [
    { id: 1, name: "iPhone 15 Pro", icon: "📱" },
    { id: 2, name: "iPhone 15", icon: "📱" },
    { id: 3, name: "iPhone 14 Pro", icon: "📱" },
    { id: 4, name: "iPhone 14", icon: "📱" },
  ];

  // ✅ Model select handler
  const handleSelectModel = (modelName) => {
    localStorage.setItem("selectedModel", modelName);
    navigate("/ConditionSelection");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ================= HEADER ================= */}
       <Header />
 
      {/* ================= MAIN ================= */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-6 w-full">

        {/* ===== Progress Steps ===== */}
{/* ===== Progress Steps ===== */}

  <div className="mb-8 sm:mb-1 overflow-x-auto">
  <div className="flex items-center justify-start sm:justify-center gap-6 min-w-[250px] sm:min-w-0">
    {[1, 2, 3, 4].map((step, i) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold mb-1 sm:mb-2
              ${step === 1 || step === 2 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}
          >
            {step === 1 ? "✓" : step}
          </div>
          <span className="text-xs sm:text-sm text-gray-500">
            {["Brand", "Model", "Condition", "Storage"][i]}
          </span>
        </div>
        {step !== 4 && <div className="w-16 sm:w-24 h-0.5 bg-gray-300"></div>}
      </React.Fragment>
    ))}
  </div>
</div>



        {/* ===== Back Button ===== */}
        <div className="text-center mb-3">
          <button
            onClick={() => navigate("/brandselection")}
            className="text-blue-500 font-medium hover:underline cursor-pointer"
          >
            ← Back to brands
          </button>
        </div>

        {/* ===== Model Selection ===== */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Select Your Model</h1>
          <p className="text-gray-600 mb-8">
            Choose the model of your {selectedBrand || "phone"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto ">
            {models.map((model) => (
              <MobileCard
                key={model.id}
                name={model.name}
                onClick={() => handleSelectModel(model.name)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelSelection;
