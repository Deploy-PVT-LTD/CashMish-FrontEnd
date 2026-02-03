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
        const response = await axios.get(`http://localhost:5000/api/mobiles/brand?brand=${brand}`);
        setModels(response.data);
      } catch (error) {
        console.error("Fetch Error:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchModelsByBrand();
  }, [brand, navigate]);

  // ✅ FIX: Yahan poora 'item' object receive hoga
  const handleSelectModel = (item) => {
    console.log("Selected Full Item Object:", item); // Ab yahan object dikhega, string nahi

    if (item && item._id) {
      localStorage.setItem("selectedModel", item.phoneModel);
      localStorage.setItem("selectedMobileId", item._id); // 🔥 Ye ID ab save ho jayegi
      navigate("/ConditionSelection");
    } else {
      console.error("Error: Item object is missing _id!", item);
      alert("Something went wrong with the selection.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-6 w-full">
        {/* Progress Tracker Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Select Your {brand} Model</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {models.map((item) => (
              <MobileCard
                key={item._id}
                name={item.phoneModel}
                // ✅ FIX: Yahan 'item.phoneModel' ki jagah sirf 'item' pass karein
                onClick={() => handleSelectModel(item)} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ModelSelection;