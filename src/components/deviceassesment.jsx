import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
// import { ChevronRight } from "lucide-react";
import { Upload, X, Check, Smartphone, Battery, Shield, Image as ImageIcon, ArrowRight, ChevronRight } from 'lucide-react';


export default function DeviceAssessmentForm() {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    screenCondition: '',
    bodyCondition: '',
    batteryCondition: '',
    images: [],
    estimatedPrice: null
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const screenConditions = [
    { value: 'perfect', label: 'Perfect', description: 'No scratches or marks', color: 'green' },
    { value: 'scratched', label: 'Scratched', description: 'Minor scratches visible', color: 'yellow' },
    { value: 'cracked', label: 'Cracked', description: 'Visible cracks or damage', color: 'red' }
  ];

  const bodyConditions = [
    { value: 'perfect', label: 'Perfect', description: 'Like new condition', color: 'green' },
    { value: 'scratched', label: 'Scratched', description: 'Minor wear and tear', color: 'yellow' },
    { value: 'damaged', label: 'Damaged', description: 'Visible dents or damage', color: 'red' }
  ];

  const batteryConditions = [
    { value: 'good', label: 'Good (80%+)', description: 'Battery health excellent', color: 'green' },
    { value: 'average', label: 'Average (60-80%)', description: 'Normal battery wear', color: 'yellow' },
    { value: 'poor', label: 'Poor (<60%)', description: 'Significant degradation', color: 'red' }
  ];

  const handleConditionSelect = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    calculateEstimatedPrice({ ...formData, [field]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Create previews
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setImagePreviews([...imagePreviews, ...newPreviews]);
    setFormData({
      ...formData,
      images: [...formData.images, ...files.map(f => f.name)]
    });
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = formData.images.filter((_, i) => i !== index);
    
    setImagePreviews(newPreviews);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const calculateEstimatedPrice = (data) => {
    let basePrice = 500;
    
    // Screen condition impact
    if (data.screenCondition === 'perfect') basePrice += 100;
    else if (data.screenCondition === 'scratched') basePrice += 50;
    else if (data.screenCondition === 'cracked') basePrice -= 50;
    
    // Body condition impact
    if (data.bodyCondition === 'perfect') basePrice += 50;
    else if (data.bodyCondition === 'scratched') basePrice += 20;
    else if (data.bodyCondition === 'damaged') basePrice -= 30;
    
    // Battery condition impact
    if (data.batteryCondition === 'good') basePrice += 30;
    else if (data.batteryCondition === 'average') basePrice += 10;
    else if (data.batteryCondition === 'poor') basePrice -= 20;
    
    setFormData(prev => ({
      ...prev,
      estimatedPrice: basePrice
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault(); // ❌ page reload rok diya
    if (isFormValid()) {
      navigate("/Userdata"); // ✅ React navigation
    }
  };
  const isFormValid = () => {
    return formData.screenCondition && 
           formData.bodyCondition && 
           formData.batteryCondition && 
           formData.images.length > 0;
  };

  const getColorClass = (color, selected) => {
    const colors = {
      green: selected ? 'bg-green-100 border-green-500 text-green-700' : 'border-green-200 hover:border-green-400',
      yellow: selected ? 'bg-yellow-100 border-yellow-500 text-yellow-700' : 'border-yellow-200 hover:border-yellow-400',
      red: selected ? 'bg-red-100 border-red-500 text-red-700' : 'border-red-200 hover:border-red-400'
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full mb-4">
            <Smartphone className="w-5 h-5 text-white" />
            <span className="text-xl font-bold text-gray-900"> <a href="/">CashMish</a> </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Device Assessment
          </h1>
          <p className="text-gray-600">
            Tell us about your device condition to get an instant estimate
          </p>
        </div>

        <form className="space-y-6">
          {/* Screen Condition */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Screen Condition</h2>
                <p className="text-sm text-gray-600">Select the condition of your device screen</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {screenConditions.map((condition) => (
                <button
                  key={condition.value}
                  type="button"
                  onClick={() => handleConditionSelect('screenCondition', condition.value)}
                  className={`relative p-4 border-2 rounded-xl transition-all ${
                    formData.screenCondition === condition.value
                      ? getColorClass(condition.color, true)
                      : `bg-white ${getColorClass(condition.color, false)}`
                  }`}
                >
                  {formData.screenCondition === condition.value && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-5 h-5 text-current" />
                    </div>
                  )}
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-1">{condition.label}</h3>
                    <p className="text-sm text-gray-600">{condition.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Body Condition */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Body Condition</h2>
                <p className="text-sm text-gray-600">Select the physical condition of your device</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {bodyConditions.map((condition) => (
                <button
                  key={condition.value}
                  type="button"
                  onClick={() => handleConditionSelect('bodyCondition', condition.value)}
                  className={`relative p-4 border-2 rounded-xl transition-all ${
                    formData.bodyCondition === condition.value
                      ? getColorClass(condition.color, true)
                      : `bg-white ${getColorClass(condition.color, false)}`
                  }`}
                >
                  {formData.bodyCondition === condition.value && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-5 h-5 text-current" />
                    </div>
                  )}
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-1">{condition.label}</h3>
                    <p className="text-sm text-gray-600">{condition.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Battery Condition */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-xl">
                <Battery className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Battery Health</h2>
                <p className="text-sm text-gray-600">Check your battery health in device settings</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {batteryConditions.map((condition) => (
                <button
                  key={condition.value}
                  type="button"
                  onClick={() => handleConditionSelect('batteryCondition', condition.value)}
                  className={`relative p-4 border-2 rounded-xl transition-all ${
                    formData.batteryCondition === condition.value
                      ? getColorClass(condition.color, true)
                      : `bg-white ${getColorClass(condition.color, false)}`
                  }`}
                >
                  {formData.batteryCondition === condition.value && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-5 h-5 text-current" />
                    </div>
                  )}
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 mb-1">{condition.label}</h3>
                    <p className="text-sm text-gray-600">{condition.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-xl">
                <ImageIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Device Images</h2>
                <p className="text-sm text-gray-600">Upload clear photos of your device (required)</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Upload Button */}
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{img.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* Submit Button */}
 <button
  type="button"
  disabled={!isFormValid()} // agar form complete nahi, disable
   onClick={() => {
    if (isFormValid()) navigate("/Userdata"); // valid ho to route change
  }}
 
  className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 group ${
    isFormValid()
      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-200"
      : "bg-gray-300 cursor-not-allowed"
  }`}
>
  {isFormValid() ? "Continue" : "Complete all fields to continue"
  }
</button>


        </form>

        {/* Progress Indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              1
            </div>
            <span className="font-medium">Assessment</span>
          </div>
          <ChevronRight className="w-4 h-4" />
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
              2
            </div>
            <span>Schedule Pickup</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-50" />
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
              3
            </div>
            <span>Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}