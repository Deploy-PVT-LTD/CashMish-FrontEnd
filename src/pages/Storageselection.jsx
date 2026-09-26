import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/layout/header.jsx';
import { BASE_URL } from '../lib/api.js';
import storageimg from '../assets/storage.png'
import Chatbot from '../components/Chatbot.jsx';
import { getSelectedCategory, hasStorageStep, routeAfterStorage } from '../lib/categoryFlow';

// True if this storage's gradePricing bucket has at least one real (numeric)
// price set for either lock status — i.e. the admin has actually priced it.
const bucketHasAPrice = (bucket) => {
  if (!bucket) return false;
  const tiers = [bucket.unlocked, bucket.locked];
  return tiers.some((tier) => tier && Object.values(tier).some((v) => typeof v === 'number'));
};

const StorageSelection = ({
  selectedBrand,
  selectedModel,
  selectedCondition,
  onGetPrice,
  onBack
}) => {
  const navigate = useNavigate();
  const category = getSelectedCategory();

  const allStorageOptions = category?.storageOptions?.length > 0
    ? category.storageOptions
    : ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'];

  // Only offer storages the admin has actually priced for THIS specific product —
  // e.g. a 64GB iPhone 17 Pro Max was never made, so it shouldn't appear even
  // though 64GB is a valid size for the category in general. Falls back to
  // showing every category storage size if this product hasn't been migrated to
  // gradePricing at all yet (legacy percentage pricing doesn't care about storage).
  const [storageOptions, setStorageOptions] = useState(allStorageOptions);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const mobileId = localStorage.getItem('selectedMobileId');
    if (!mobileId) {
      setStorageOptions(allStorageOptions);
      setLoadingOptions(false);
      return;
    }

    let cancelled = false;
    fetch(`${BASE_URL}/api/mobiles/${mobileId}`)
      .then((res) => res.json())
      .then((mobile) => {
        if (cancelled) return;
        const gradePricing = mobile?.gradePricing || {};
        const hasAnyPricing = Object.keys(gradePricing).length > 0;
        const priced = hasAnyPricing
          ? allStorageOptions.filter((opt) => bucketHasAPrice(gradePricing[opt]))
          : allStorageOptions;
        setStorageOptions(priced.length > 0 ? priced : allStorageOptions);
      })
      .catch(() => {
        if (!cancelled) setStorageOptions(allStorageOptions);
      })
      .finally(() => {
        if (!cancelled) setLoadingOptions(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedStorage, setSelectedStorage] = React.useState(storageOptions[0]);
  // Once the real (filtered) options load, make sure the pre-selected one is
  // actually still valid — reset to the first available if not.
  useEffect(() => {
    if (!storageOptions.includes(selectedStorage)) {
      setSelectedStorage(storageOptions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageOptions]);

  useEffect(() => {
    // This category doesn't have a storage step — skip straight ahead (guards a
    // stale link/back-button landing here directly).
    if (!hasStorageStep(category)) {
      navigate(routeAfterStorage(category), { replace: true });
    }
  }, [category, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header simple />
      {/* chatbot */}
      <Chatbot />
      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
        {/* Progress Tracker */}
        <div className="mb-10 sm:mb-16 flex justify-center">
          <div className="flex flex-wrap justify-center gap-4 max-w-full px-2">
            {[1, 2, 3, 4, 5].map((step, i) => {
              const isCompleted = step === 1 || step === 2 || step === 3 || step === 4;
              const isActive = step === 5;

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
          {loadingOptions ? (
            <div className="max-w-4xl mx-auto mb-8 sm:mb-12 py-10 text-sm text-gray-400">
              Loading available storage sizes…
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto mb-8 sm:mb-12">
              {storageOptions.map((storage) => (
                <button
                  key={storage}
                  onClick={() => setSelectedStorage(storage)}
                  className={`w-24 sm:w-28 flex flex-col items-center rounded-lg border-2 p-2 sm:p-4 transition cursor-pointer
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
          )}

          {/* CTA */}
          <button
            onClick={() => {
              localStorage.setItem("selectedStorage", selectedStorage);
              console.log("Saved storage:", selectedStorage);
              if (onGetPrice) onGetPrice(selectedStorage);

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
                    condition: localStorage.getItem('selectedCondition'),
                    storage: selectedStorage,
                    currentStep: 'storage'
                  })
                }).catch(err => console.error('Draft save error:', err));
              }

              navigate(routeAfterStorage(category));
            }}
            disabled={loadingOptions}
            className="w-44 sm:w-48 bg-green-800 text-white py-2.5 rounded-lg
                       font-semibold hover:bg-green-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        </div>
      </main>
    </div>
  );
};

export default StorageSelection;
