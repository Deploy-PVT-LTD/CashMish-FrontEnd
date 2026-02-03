import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/header.jsx';
import { Upload, X, Check, Smartphone, Battery, Shield, Image as ImageIcon } from 'lucide-react';

const DeviceAssessmentForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    screenCondition: '',
    bodyCondition: '',
    batteryCondition: '',
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // Actual file objects storage

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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Add actual files for backend
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Create previews for UI
    const newPreviews = files.map(file => ({
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    return formData.screenCondition && formData.bodyCondition && formData.batteryCondition;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      localStorage.setItem("screenCondition", formData.screenCondition);
      localStorage.setItem("bodyCondition", formData.bodyCondition);
      localStorage.setItem("batteryCondition", formData.batteryCondition);

      const currentStorage = localStorage.getItem("selectedStorage") || "128GB";
      const currentPrice = localStorage.getItem("estimatedPrice") || "500";
      
      const assessmentSummary = {
        ...formData,
        storage: currentStorage,
        estimatedPrice: currentPrice,
        status: 'pending'
      };
      localStorage.setItem("assessmentSummary", JSON.stringify(assessmentSummary));

      // ✅ Pass files to the next route via state
      navigate("/userdata", { state: { files: selectedFiles } });
    }
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Device Assessment</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[ 
            { title: 'Screen Condition', icon: <Smartphone />, field: 'screenCondition', options: screenConditions },
            { title: 'Body Condition', icon: <Shield />, field: 'bodyCondition', options: bodyConditions },
            { title: 'Battery Health', icon: <Battery />, field: 'batteryCondition', options: batteryConditions }
          ].map((section) => (
            <div key={section.field} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6 font-bold text-xl">
                {section.icon} {section.title}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {section.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleConditionSelect(section.field, opt.value)}
                    className={`relative p-4 border-2 rounded-xl text-left transition-all ${
                      formData[section.field] === opt.value ? getColorClass(opt.color, true) : getColorClass(opt.color, false)
                    }`}
                  >
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-xs opacity-70">{opt.description}</div>
                    {formData[section.field] === opt.value && <Check className="absolute top-2 right-2 w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4 font-bold text-xl">
              <ImageIcon className="text-orange-500" /> Device Photos
            </div>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Upload photos to show condition</p>
              <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
            </label>

            {imagePreviews.length > 0 && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                {imagePreviews.map((img, i) => (
                  <div key={i} className="relative min-w-[120px] h-24">
                    <img src={img.preview} className="w-full h-full object-cover rounded-lg border shadow-sm" alt="device" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
              isFormValid() ? "bg-blue-600 hover:bg-blue-700 shadow-xl cursor-pointer" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isFormValid() ? "Save & Continue to Pickup" : "Complete Assessment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DeviceAssessmentForm;