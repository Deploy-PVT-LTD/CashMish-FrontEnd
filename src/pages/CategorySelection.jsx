import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/layout/header.jsx';
import axios from "axios";
import { BASE_URL } from '../lib/api.js';
import Chatbot from "../components/Chatbot.jsx";
import { Smartphone, Laptop, Gamepad2, Watch, Tablet, LayoutGrid } from 'lucide-react';

// Fallback icons for categories that don't have a custom icon set in the admin panel,
// matched loosely by slug/name so common categories still look right out of the box.
const fallbackIconFor = (category) => {
  const key = `${category.slug || ''} ${category.name || ''}`.toLowerCase();
  if (key.includes('laptop')) return Laptop;
  if (key.includes('game') || key.includes('console')) return Gamepad2;
  if (key.includes('watch')) return Watch;
  if (key.includes('tablet') || key.includes('ipad')) return Tablet;
  if (key.includes('phone') || key.includes('mobile')) return Smartphone;
  return LayoutGrid;
};

const CategorySelection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    // Fresh funnel each time a category is (re)selected — don't let a previous
    // category's brand/model/condition/storage bleed into this one.
    [
      'selectedBrand', 'selectedModel', 'selectedMobileId', 'selectedMobileImage',
      'selectedCarrier', 'selectedStorage', 'selectedCondition',
      'screenCondition', 'bodyCondition', 'batteryCondition', 'conditionAnswers', 'estimatedPrice'
    ].forEach((key) => localStorage.removeItem(key));

    localStorage.setItem("selectedCategory", category.slug);
    localStorage.setItem("selectedCategoryName", category.name);
    // Cache the full category object so downstream steps (storage/carrier/assessment)
    // know their own config without re-fetching the category list on every page.
    localStorage.setItem("selectedCategoryData", JSON.stringify(category));
    navigate("/brandselection");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header simple />
      <Chatbot />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
        {/* Progress Tracker */}
        <div className="mb-10 sm:mb-16 flex justify-center">
          <div className="flex flex-wrap justify-center gap-4 max-w-full px-2">
            {[1, 2, 3, 4, 5].map((step, i) => {
              const isActive = step === 1;

              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-full flex items-center justify-center font-semibold mb-2
                        ${isActive ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-500'}
                        w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base
                      `}
                    >
                      {step}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                      {["Category", "Brand", "Model", "Condition", "Storage"][i]}
                    </span>
                  </div>

                  {step !== 5 && (
                    <div className="hidden sm:block w-12 h-0.5 bg-gray-300 self-center"></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-8">What Are You Selling Today?</h1>

          {loading ? (
            <div className="mt-20 flex justify-center items-center gap-2">
              <div className="w-6 h-6 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading Categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="mt-20 text-gray-500">No categories available right now. Please check back soon.</div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
              {categories.map((category) => {
                const isImageIcon = category.icon && category.icon.startsWith('http');
                const isEmojiIcon = category.icon && !isImageIcon;
                const FallbackIcon = fallbackIconFor(category);

                return (
                  <button
                    key={category._id}
                    onClick={() => handleCategorySelect(category)}
                    className="bg-white border-2 border-gray-100 rounded-4xl p-6 hover:border-green-800 hover:shadow-xl transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group h-40 w-40 sm:w-48"
                  >
                    <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {isImageIcon ? (
                        <img src={category.icon} alt={category.name} className="w-full h-full object-contain" />
                      ) : isEmojiIcon ? (
                        <span className="text-5xl leading-none">{category.icon}</span>
                      ) : (
                        <FallbackIcon className="w-12 h-12 text-green-800" strokeWidth={1.5} />
                      )}
                    </div>

                    <div className="text-sm font-bold text-gray-700 uppercase tracking-wider text-center">
                      {category.name}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategorySelection;
