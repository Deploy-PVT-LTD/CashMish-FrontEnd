import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileCard from "../components/MobileCard";
import Header from "../components/header.jsx";
import axios from "axios";

const ModelSelection = () => {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const brand = localStorage.getItem("selectedBrand");

  useEffect(() => {
    const fetchModelsByBrand = async () => {
      if (!brand) {
        navigate("/brandselection");
        return;
      }
      try {
        setLoading(true);
        // API call se data fetch kiya
        const res = await axios.get(
          `http://localhost:5000/api/mobiles/brand?brand=${brand}`
        );

        // --- DEBUG LOGS START ---
        console.log("Full API Response:", res.data);
        if (res.data && res.data.length > 0) {
          // Check karein ke image field mein base64 string aa rahi hai ya nahi
          console.log("First Item Image Data:", res.data[0].image);
        } else {
          console.warn("No data found for this brand.");
        }
        // --- DEBUG LOGS END ---

        setModels(res.data);
      } catch (error) {
        console.error("Fetch Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModelsByBrand();
  }, [brand, navigate]);

  const handleSelectModel = (item) => {
    if (item && item._id) {
      localStorage.setItem("selectedModel", item.phoneModel);
      localStorage.setItem("selectedMobileId", item._id);
      localStorage.setItem("selectedMobileImage", item.image);
      navigate("/ConditionSelection");
    } else {
      alert("Something went wrong");
    }
  };

  const onBack = () => {
    navigate("/brandselection");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
 <div className="mb-10 sm:mb-16 flex justify-center">
  <div className="flex flex-wrap justify-center gap-4 max-w-full px-2">
    {[1, 2, 3, 4].map((step, i) => {
      const isCompleted = step === 1; // first step completed
      const isActive = step === 2;    // second step active

      return (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`rounded-full flex items-center justify-center font-semibold mb-2
                ${
                  isCompleted
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


        {/* Header Actions */}
        <div className="text-center mb-8">
          <button onClick={onBack} className="text-green-800 hover:underline text-sm font-medium mb-4 inline-block">
            ← Back to Brands
          </button>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
            Select Your <span className="text-green-800 uppercase">{brand}</span> Model
          </h1>
          <p className="text-gray-500 mt-2">Hum aapke phone ki sahi qeemat lagane mein madad karenge.</p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Fetching Models...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 max-w-6xl mx-auto">
            {models.length > 0 ? (
              models.map((item) => (
                <MobileCard
                  key={item._id}
                  name={item.phoneModel}
                  image={item.image} 
                  onClick={() => handleSelectModel(item)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                Is brand ke models filhal dastiyab nahi hain.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ModelSelection;