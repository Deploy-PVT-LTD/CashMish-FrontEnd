import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileCard from "../components/MobileCard";
import Header from '../components/header.jsx';
import axios from "axios";

const ModelSelection = () => {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // LocalStorage se selected brand (e.g., "Samsung")
  const brand = localStorage.getItem("selectedBrand");

  useEffect(() => {
    const fetchModelsByBrand = async () => {
      if (!brand) {
        navigate("/brandselection");
        return;
      }

      try {
        setLoading(true);
        // API call to fetch models based on brand
        const response = await axios.get(`http://localhost:5000/api/mobiles/brand?brand=${brand}`);
        
        console.log("Data received:", response.data);
        setModels(response.data);
      } catch (error) {
        console.error("Fetch Error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModelsByBrand();
  }, [brand, navigate]);

  const handleSelectModel = (modelName) => {
    localStorage.setItem("selectedModel", modelName);
console.log("Selected Model:", modelName);
    navigate("/ConditionSelection");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-6 w-full">
        
        <div className="text-center mb-6">
          <button onClick={() => navigate("/brandselection")} className="text-blue-500 hover:underline">
            ← Back to brands
          </button>
          <h1 className="text-3xl font-bold mt-4">Select Your {brand} Model</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {models.length > 0 ? (
              models.map((item) => (
                <MobileCard
                  key={item._id}
                  name={item.phoneModel} // Cards mein model ka naam display hoga
                  onClick={() => handleSelectModel(item.phoneModel)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500 bg-white rounded-2xl border-2 border-dashed">
                Afsos! {brand} ke liye koi models nahi mile database mein.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ModelSelection;