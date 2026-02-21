import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/header.jsx';
import { Upload, X, Check, Smartphone, Battery, Shield, Image as ImageIcon, Camera, RotateCcw, ArrowUp, ArrowDown, Info, ChevronRight, ChevronLeft } from 'lucide-react';

const photoCategories = [
  { key: 'front', label: 'Front Side', desc: 'Take a clear photo of the screen facing the camera', icon: <Smartphone size={32} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', activeBorder: 'border-blue-500' },
  { key: 'back', label: 'Back Side', desc: 'Flip your phone and capture the back panel clearly', icon: <RotateCcw size={32} />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', activeBorder: 'border-purple-500' },
  { key: 'top', label: 'Top Side', desc: 'Capture the top edge of your phone', icon: <ArrowUp size={32} />, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', activeBorder: 'border-orange-500' },
  { key: 'bottom', label: 'Bottom Side', desc: 'Capture the bottom edge showing charging port', icon: <ArrowDown size={32} />, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', activeBorder: 'border-green-500' },
  { key: 'about', label: 'About Phone', desc: 'Go to Settings > About Phone and take a screenshot', icon: <Info size={32} />, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200', activeBorder: 'border-gray-500' },
];

const DeviceAssessmentForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    screenCondition: '',
    bodyCondition: '',
    batteryCondition: '',
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showUploadGuide, setShowUploadGuide] = useState(false);
  const [photoSlots, setPhotoSlots] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [activeSlot, setActiveSlot] = useState(null);
  const slotInputRef = useRef(null);

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

  const handleSlotUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlot) return;

    const preview = URL.createObjectURL(file);

    setPhotoSlots(prev => {
      const oldSlot = prev[activeSlot];
      if (oldSlot?.preview) URL.revokeObjectURL(oldSlot.preview);
      return { ...prev, [activeSlot]: { file, preview } };
    });

    setSelectedFiles(prev => {
      const oldSlot = photoSlots[activeSlot];
      if (oldSlot) {
        return [...prev.filter(f => f !== oldSlot.file), file];
      }
      return [...prev, file];
    });
    setImagePreviews(prev => {
      const oldSlot = photoSlots[activeSlot];
      if (oldSlot) {
        return [...prev.filter(p => p.preview !== oldSlot.preview), { preview, name: file.name }];
      }
      return [...prev, { preview, name: file.name }];
    });

    // Auto-advance to next step after upload
    if (currentStep < photoCategories.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 400);
    }

    setActiveSlot(null);
    e.target.value = '';
  };

  const handleUploadClick = () => {
    const cat = photoCategories[currentStep];
    setActiveSlot(cat.key);
    setTimeout(() => slotInputRef.current?.click(), 100);
  };

  const removeSlotPhoto = (key) => {
    const slot = photoSlots[key];
    if (!slot) return;
    setPhotoSlots(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    setSelectedFiles(prev => prev.filter(f => f !== slot.file));
    setImagePreviews(prev => prev.filter(p => p.preview !== slot.preview));
  };

  const removeImage = (index) => {
    const removedPreview = imagePreviews[index];
    const matchingSlotKey = Object.keys(photoSlots).find(k => photoSlots[k]?.preview === removedPreview?.preview);
    if (matchingSlotKey) {
      setPhotoSlots(prev => {
        const updated = { ...prev };
        delete updated[matchingSlotKey];
        return updated;
      });
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadedCount = Object.keys(photoSlots).length;
  const currentCategory = photoCategories[currentStep];
  const currentUploaded = photoSlots[currentCategory?.key];

  const isFormValid = () => {
    return formData.screenCondition && formData.bodyCondition && formData.batteryCondition && selectedFiles.length > 0;
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

      navigate("/priceresult", { state: { files: selectedFiles } });
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

  const openGuide = () => {
    setCurrentStep(0);
    setShowUploadGuide(true);
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
                    className={`relative p-4 border-2 rounded-xl text-left transition-all cursor-pointer ${formData[section.field] === opt.value ? getColorClass(opt.color, true) : getColorClass(opt.color, false)
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
              <span className="ml-1 text-[12px] text-red-500 font-black uppercase tracking-widest">*</span>
            </div>

            <div
              onClick={openGuide}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                {uploadedCount > 0 ? `${uploadedCount}/5 photos uploaded — tap to add more` : 'Upload photos to show condition'}
              </p>
            </div>

            {/* Hidden input for slot uploads */}
            <input ref={slotInputRef} type="file" className="hidden" accept="image/*" onChange={handleSlotUpload} />

            {imagePreviews.length > 0 && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                {imagePreviews.map((img, i) => (
                  <div key={i} className="relative min-w-[120px] h-24">
                    <img src={img.preview} className="w-full h-full object-cover rounded-lg border shadow-sm" alt="device" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors cursor-pointer">
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
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${isFormValid() ? "bg-green-800 hover:bg-green-700 shadow-xl cursor-pointer" : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            {isFormValid() ? "Save & Continue" : !selectedFiles.length && isFormValid() === false && formData.screenCondition && formData.bodyCondition && formData.batteryCondition ? "Please Upload Photos" : "Complete Assessment"}
          </button>
        </form>
      </div>

      {/* Step-by-Step Photo Upload Modal */}
      {showUploadGuide && currentCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gray-900 p-6 text-white relative">
              <button
                onClick={() => setShowUploadGuide(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Camera size={20} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Upload <span className="text-green-400">Photos</span></h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Step {currentStep + 1} of {photoCategories.length}</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="flex gap-1.5 mt-3">
                {photoCategories.map((cat, i) => (
                  <div
                    key={cat.key}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${photoSlots[cat.key] ? 'bg-green-400' : i === currentStep ? 'bg-white' : 'bg-white/20'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="p-6">
              {/* Step dots */}
              <div className="flex justify-center gap-2 mb-6">
                {photoCategories.map((cat, i) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCurrentStep(i)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all cursor-pointer ${photoSlots[cat.key]
                        ? 'bg-green-100 text-green-600 border-2 border-green-400'
                        : i === currentStep
                          ? 'bg-gray-900 text-white scale-110'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                  >
                    {photoSlots[cat.key] ? <Check size={14} /> : i + 1}
                  </button>
                ))}
              </div>

              {/* Current step card */}
              <div className={`rounded-2xl border-2 ${currentUploaded ? currentCategory.activeBorder : currentCategory.border} ${currentCategory.bg} p-6 text-center transition-all`}>
                {currentUploaded ? (
                  <div className="space-y-3">
                    <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-lg relative">
                      <img src={currentUploaded.preview} alt={currentCategory.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-green-500/10" />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Check size={16} className="text-green-600" />
                      <span className="text-sm font-black uppercase tracking-wider text-green-600">{currentCategory.label} Uploaded!</span>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="text-xs font-bold text-gray-500 underline cursor-pointer hover:text-gray-700"
                      >
                        Replace Photo
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => removeSlotPhoto(currentCategory.key)}
                        className="text-xs font-bold text-red-500 underline cursor-pointer hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-white shadow-md ${currentCategory.color}`}>
                      {currentCategory.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase tracking-tight text-gray-900">{currentCategory.label}</h4>
                      <p className="text-sm text-gray-500 font-medium mt-1">{currentCategory.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className={`w-full py-3.5 ${currentCategory.bg} border-2 ${currentCategory.border} ${currentCategory.color} font-black uppercase tracking-widest text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer hover:shadow-md`}
                    >
                      <Camera size={16} /> Tap to Upload
                    </button>
                  </div>
                )}
              </div>

              {/* Tip */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex items-start gap-2 mt-4">
                <span className="text-yellow-500 text-base">💡</span>
                <p className="text-[11px] font-semibold text-yellow-700">
                  Better photos = more accurate price! Well-lit, clear photos help us assess your device correctly.
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3 mt-5">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 font-black uppercase tracking-widest text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-200"
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                )}
                {currentStep < photoCategories.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className={`flex-1 py-3 font-black uppercase tracking-widest text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer ${currentUploaded
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                      }`}
                  >
                    {currentUploaded ? 'Next' : 'Skip'} <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowUploadGuide(false)}
                    className={`flex-1 py-3 font-black uppercase tracking-widest text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${uploadedCount > 0
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20'
                        : 'bg-gray-200 text-gray-500'
                      }`}
                  >
                    <Check size={14} /> Done — {uploadedCount} Photo{uploadedCount !== 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeviceAssessmentForm;