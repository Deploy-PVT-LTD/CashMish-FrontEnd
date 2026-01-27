import React, { useState } from 'react';

// ==================== DATA STRUCTURE (Easy to replace with database) ====================
const PHONE_DATA = {
  Apple: [
    'iPhone 15 Pro Max',
    'iPhone 15 Pro',
    'iPhone 15 Plus',
    'iPhone 15',
    'iPhone 14 Pro Max',
    'iPhone 14 Pro',
    'iPhone 14 Plus',
    'iPhone 14',
    'iPhone 13 Pro Max',
    'iPhone 13 Pro',
    'iPhone 13',
    'iPhone 12 Pro Max',
    'iPhone 12 Pro',
    'iPhone 12',
    'iPhone 11 Pro Max',
    'iPhone 11 Pro',
    'iPhone 11'
  ],
  Samsung: [
    'Galaxy S24 Ultra',
    'Galaxy S24+',
    'Galaxy S24',
    'Galaxy S23 Ultra',
    'Galaxy S23+',
    'Galaxy S23',
    'Galaxy S22 Ultra',
    'Galaxy S22+',
    'Galaxy S22',
    'Galaxy Z Fold 5',
    'Galaxy Z Fold 4',
    'Galaxy Z Flip 5',
    'Galaxy Z Flip 4',
    'Galaxy Note 20 Ultra',
    'Galaxy A54',
    'Galaxy A34'
  ],
  Google: [
    'Pixel 8 Pro',
    'Pixel 8',
    'Pixel 7 Pro',
    'Pixel 7',
    'Pixel 7a',
    'Pixel 6 Pro',
    'Pixel 6',
    'Pixel 6a',
    'Pixel 5',
    'Pixel 4a 5G',
    'Pixel 4a'
  ],
  OnePlus: [
    'OnePlus 12',
    'OnePlus 11',
    'OnePlus 10 Pro',
    'OnePlus 10T',
    'OnePlus 9 Pro',
    'OnePlus 9',
    'OnePlus 8 Pro',
    'OnePlus 8T',
    'OnePlus 8',
    'OnePlus Nord 3',
    'OnePlus Nord 2T',
    'OnePlus Nord CE 3'
  ]
};

// ==================== HEADER COMPONENT ====================
const Header = () => (
  <header className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-2xl">📱</span>
        </div>
        <span className="text-xl font-bold text-gray-900">PhoneFlip</span>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
        <a href="/Howitworks" className="text-gray-600 hover:text-gray-900">How It Works</a>
        <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
          <a href="/login">Get Started</a>
        </button>
      </nav>
    </div>
  </header>
);

// ==================== PROGRESS STEPS COMPONENT ====================
const ProgressSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Brand' },
    { number: 2, label: 'Model' },
    { number: 3, label: 'Condition' },
    { number: 4, label: 'Storage' }
  ];

  return (
    <div className="mb-16">
      <div className="flex items-center justify-center gap-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold mb-2 ${
                step.number < currentStep 
                  ? 'bg-blue-500 text-white'
                  : step.number === currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step.number < currentStep ? '✓' : step.number}
              </div>
              <span className={`text-sm ${
                step.number <= currentStep ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-24 h-0.5 ${
                step.number < currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ==================== STEP 1: BRAND SELECTION ====================
const BrandSelection = ({ onSelectBrand }) => {
  const brands = [
    { name: 'Apple', icon: '🍎' },
    { name: 'Samsung', icon: '📱' },
    { name: 'Google', icon: '🔍' },
    { name: 'OnePlus', icon: '⚡' }
  ];

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Select Your Phone Brand
      </h1>
      <p className="text-gray-600 mb-12">
        Choose the manufacturer of your device
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {brands.map((brand) => (
          <button
            key={brand.name}
            onClick={() => onSelectBrand(brand.name)}
            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-lg transition group"
          >
            <div className="text-6xl mb-4">{brand.icon}</div>
            <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-500">
              {brand.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ==================== STEP 2: MODEL SELECTION ====================
const ModelSelection = ({ selectedBrand, models, onSelectModel, onBack }) => {
  return (
    <div className="text-center">
      <button
        onClick={onBack}
        className="text-blue-500 hover:text-blue-600 font-medium mb-8"
      >
        ← Back to brands
      </button>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Select Your Model
      </h1>
      <p className="text-gray-600 mb-12">
        Choose the specific model of your {selectedBrand} device
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {models.map((model) => (
          <button
            key={model}
            onClick={() => onSelectModel(model)}
            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition text-left flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
              📱
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {model}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ==================== STEP 3: CONDITION SELECTION ====================
const ConditionSelection = ({ onSelectCondition, onBack }) => {
  const conditions = [
    { 
      name: 'Mint', 
      description: 'Like new, no scratches',
      icon: '✨',
      color: 'green'
    },
    { 
      name: 'Good', 
      description: 'Minor signs of use',
      icon: '👍',
      color: 'blue'
    },
    { 
      name: 'Fair', 
      description: 'Visible wear & tear',
      icon: '📋',
      color: 'orange'
    }
  ];

  return (
    <div className="text-center">
      <button
        onClick={onBack}
        className="text-blue-500 hover:text-blue-600 font-medium mb-8"
      >
        ← Back to models
      </button>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        What's the Condition?
      </h1>
      <p className="text-gray-600 mb-12">
        Be honest - it helps us give you an accurate price
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {conditions.map((condition) => (
          <button
            key={condition.name}
            onClick={() => onSelectCondition(condition.name)}
            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-lg transition"
          >
            <div className="text-6xl mb-4">{condition.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {condition.name}
            </h3>
            <p className="text-gray-600 text-sm">
              {condition.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

// ==================== STEP 4: STORAGE SELECTION ====================
const StorageSelection = ({ selection, onSelectStorage, onBack, onComplete }) => {
  const storages = ['64GB', '128GB', '256GB', '512GB', '1TB'];

  return (
    <div className="text-center">
      <button
        onClick={onBack}
        className="text-blue-500 hover:text-blue-600 font-medium mb-8"
      >
        ← Back to condition
      </button>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Storage Capacity
      </h1>
      <p className="text-gray-600 mb-12">
        Select your device's storage size
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {storages.map((storage) => (
          <button
            key={storage}
            onClick={() => onSelectStorage(storage)}
            className={`px-8 py-4 rounded-xl border-2 transition ${
              selection.storage === storage
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'bg-white border-gray-200 text-gray-900 hover:border-blue-500'
            }`}
          >
            <div className="font-bold text-lg">{storage}</div>
          </button>
        ))}
      </div>

      {selection.storage && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Your Selection</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Brand</p>
              <p className="font-semibold text-gray-900">{selection.brand}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Model</p>
              <p className="font-semibold text-gray-900">{selection.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Condition</p>
              <p className="font-semibold text-gray-900">{selection.condition}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Storage</p>
              <p className="font-semibold text-gray-900">{selection.storage}</p>
            </div>
          </div>
          <button
            onClick={onComplete}
            className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            Get My Price Estimate →
          </button>
        </div>
      )}
    </div>
  );
};

// ==================== STEP 5: PRICE ESTIMATE (NEW COMPONENT) ====================
const PriceEstimate = ({ selection, onNext }) => {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Your Estimate
      </h1>
      <p className="text-gray-600 mb-12">
        Based on your device details
      </p>

      <div className="bg-white rounded-3xl shadow-xl p-12">
        {/* Price Display */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-blue-500 mb-4">$450</div>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Low</p>
              <p className="text-xl font-bold text-gray-900">$405</p>
            </div>
            <span className="text-gray-400">—</span>
            <div className="text-center">
              <p className="text-sm text-gray-600">High</p>
              <p className="text-xl font-bold text-gray-900">$495</p>
            </div>
          </div>
        </div>

        {/* Device Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8">
          <div className="text-sm text-gray-600">
            {selection.brand} • {selection.model} • {selection.condition} • {selection.storage}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onNext}
          className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition"
        >
          Proceed to Sell →
        </button>
      </div>

      {/* Features */}
      <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Real-time market prices</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>No hidden fees</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Price lock for 7 days</span>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP COMPONENT ====================
export default function PhoneFlipApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selection, setSelection] = useState({
    brand: '',
    model: '',
    condition: '',
    storage: ''
  });

  // Step 1: Brand Selection
  const handleBrandSelect = (brand) => {
    setSelection({ ...selection, brand });
    setCurrentStep(2);
  };

  // Step 2: Model Selection
  const handleModelSelect = (model) => {
    setSelection({ ...selection, model });
    setCurrentStep(3);
  };

  // Step 3: Condition Selection
  const handleConditionSelect = (condition) => {
    setSelection({ ...selection, condition });
    setCurrentStep(4);
  };

  // Step 4: Storage Selection
  const handleStorageSelect = (storage) => {
    setSelection({ ...selection, storage });
  };

  // Complete Selection (Go to Price Estimate)
  const handleComplete = () => {
    console.log('Final Selection:', selection);
    setCurrentStep(5);
  };

  // Next step from Price Estimate
  const handleProceed = () => {
    console.log('Proceeding to sell...');
    // Yahan aap next page pe redirect kar sakte ho
    // window.location.href = '/sell';
  };

  // Back navigation
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get models for selected brand
  const getModelsForBrand = () => {
    return PHONE_DATA[selection.brand] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full">
        {currentStep <= 4 && <ProgressSteps currentStep={currentStep} />}

        {currentStep === 1 && (
          <BrandSelection onSelectBrand={handleBrandSelect} />
        )}

        {currentStep === 2 && (
          <ModelSelection
            selectedBrand={selection.brand}
            models={getModelsForBrand()}
            onSelectModel={handleModelSelect}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <ConditionSelection
            onSelectCondition={handleConditionSelect}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && (
          <StorageSelection
            selection={selection}
            onSelectStorage={handleStorageSelect}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        )}

        {currentStep === 5 && (
          <PriceEstimate
            selection={selection}
            onNext={handleProceed}
          />
        )}
      </main>

      {/* Debug Info */}
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border-2 border-gray-200 text-sm max-w-xs">
        {/* <div className="font-bold mb-2">Debug Info:</div> */}
        {/* <div>Step: {currentStep}</div>
        <div>Brand: {selection.brand || 'None'}</div>
        <div>Model: {selection.model || 'None'}</div>
        <div>Condition: {selection.condition || 'None'}</div>
        <div>Storage: {selection.storage || 'None'}</div> */}
      </div>
    </div>
  );
}

/* 
==================== HOW TO ADD NEW COMPONENT ====================

Naya component add karne ke liye ye steps follow karo:

1. NEW COMPONENT BANAO:
   const YourNewComponent = ({ onNext, onBack }) => {
     return (
       <div>
         <h1>Your Component</h1>
         <button onClick={onNext}>Next</button>
       </div>
     );
   };

2. MAIN APP MEIN ADD KARO:
   {currentStep === 6 && (
     <YourNewComponent 
       onNext={() => setCurrentStep(7)}
       onBack={handleBack}
     />
   )}

3. HANDLER FUNCTION BANAO (if needed):
   const handleYourAction = (data) => {
     setSelection({ ...selection, yourData: data });
     setCurrentStep(nextStep);
   };

That's it! Bas component bana ke currentStep check karo aur render kar do!
*/