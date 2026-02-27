import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/layout/header.jsx';
import { Upload, X, Check, Smartphone, Battery, Shield, Image as ImageIcon, Camera, RotateCcw, ArrowUp, ArrowDown, Info, ChevronRight, ChevronLeft } from 'lucide-react';

import frontImg from '../assets/front.webp';
import backImg from '../assets/back.webp';
import leftImg from '../assets/left.webp';
import rightImg from '../assets/right.webp';
import batteryImg from '../assets/battery-health.webp';

import top from '../assets/top.webp';
import bottom from '../assets/bottom.webp';

const photoCategories = [
  { key: 'front', label: 'Front Side', desc: 'Take a clear photo of the screen facing the camera', icon: <img src={frontImg} alt="Front view iPhone" className="w-20 h-50 object-contain" />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', activeBorder: 'border-blue-500' },
  { key: 'back', label: 'Back Side', desc: 'Flip your phone and capture the back panel clearly', icon: <img src={backImg} alt="Back view iPhone" className="w-20 h-50 object-contain" />, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', activeBorder: 'border-purple-500' },
  { key: 'left', label: 'Left Side', desc: 'Capture the left edge showing volume buttons', icon: <img src={leftImg} alt="Left side view iPhone" className="w-20 h-50 object-contain" />, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', activeBorder: 'border-orange-500' },
  { key: 'right', label: 'Right Side', desc: 'Capture the right edge showing power button', icon: <img src={rightImg} alt="Right side view iPhone" className="w-20 h-50 object-contain" />, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', activeBorder: 'border-green-500' },
  { key: 'battery', label: 'Battery Health', desc: 'Go to Settings > Battery > Battery Health and take a Picture', icon: <img src={batteryImg} alt="iPhone battery health" className="w-20 h-50 object-contain" />, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200', activeBorder: 'border-gray-500' },
  { key: 'top', label: 'Top Side', desc: 'Capture the top edge of the phone clearly', icon: <img src={top} alt="Top view iPhone" className="w-20 h-50 object-contain" />, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', activeBorder: 'border-sky-500' },
  { key: 'bottom', label: 'Bottom Side', desc: 'Capture the bottom edge showing the charging port', icon: <img src={bottom} alt="Bottom view iPhone" className="w-20 h-50 object-contain" />, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', activeBorder: 'border-rose-500' },
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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [photoSlots, setPhotoSlots] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [activeSlot, setActiveSlot] = useState(null);
  const slotInputRef = useRef(null);

  const screenConditions = [
    { value: 'perfect', label: 'Perfect', description: 'No scratches, cracks, or visible marks', color: 'green' },
    { value: 'scratched', label: 'Scratched', description: 'Minor surface scratches visible', color: 'yellow' },
    { value: 'cracked', label: 'Cracked', description: 'Visible cracks, chips, or display damage', color: 'red' }
  ];

  const bodyConditions = [
    { value: 'perfect', label: 'Perfect', description: 'Like new with no visible wear', color: 'green' },
    { value: 'scratched', label: 'Scratched', description: 'Minor scratches or light wear', color: 'yellow' },
    { value: 'damaged', label: 'Damaged', description: 'Visible dents, cracks, or structural damage', color: 'red' }
  ];

  const batteryConditions = [
    { value: 'good', label: 'Good (80%+)', description: 'Battery health 80% or higher', color: 'green' },
    { value: 'average', label: 'Average (60-80%)', description: 'Battery health between 60%–79%', color: 'yellow' },
    { value: 'poor', label: 'Poor (<60%)', description: 'Battery health below 60%', color: 'red' }
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
    return formData.screenCondition && formData.bodyCondition && formData.batteryCondition && selectedFiles.length > 0 && acceptedTerms;
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
        <h1 className="text-3xl font-bold text-center mb-8">Device Condition Assessment</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { title: 'Screen Condition (Front Display)', icon: <Smartphone />, field: 'screenCondition', options: screenConditions },
            { title: 'Back & Frame Condition', icon: <Shield />, field: 'bodyCondition', options: bodyConditions },
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
                {uploadedCount > 0 ? `${uploadedCount}/7 photos uploaded — tap to add more` : 'Upload photos to show condition'}
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

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start gap-3">
              <div className="pt-1">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                  required
                />
              </div>
              <label htmlFor="terms" className="text-sm font-medium text-gray-700 leading-relaxed cursor-pointer">
                I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="text-green-600 font-bold hover:underline">Terms and Conditions</button> regarding the sale of my device.
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${isFormValid() ? "bg-green-800 hover:bg-green-700 shadow-xl cursor-pointer" : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            {isFormValid() ? "Get My Offer" : !acceptedTerms && formData.screenCondition && formData.bodyCondition && formData.batteryCondition && selectedFiles.length > 0 ? "Accept Terms to Continue" : !selectedFiles.length && isFormValid() === false && formData.screenCondition && formData.bodyCondition && formData.batteryCondition ? "Please Upload Photos" : "Get My Offer"}
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

              {/* Current step card — 2-column split layout */}
              <div className={`rounded-2xl border-2 overflow-hidden transition-all ${currentUploaded ? currentCategory.activeBorder : currentCategory.border}`}>
                {currentUploaded ? (
                  /* Uploaded: left = image preview (fixed height), right = info + controls */
                  <div className="flex h-[200px]">
                    {/* Left: Image Preview — fixed size, never grows */}
                    <div className="w-1/2 relative bg-gray-100 overflow-hidden">
                      <img
                        src={currentUploaded.preview}
                        alt={currentCategory.label}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-green-500/10" />
                      <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                        <Check size={12} />
                      </div>
                    </div>
                    {/* Right: Content */}
                    <div className={`w-1/2 ${currentCategory.bg} p-4 flex flex-col justify-between`}>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-gray-900">{currentCategory.label}</h4>
                        <p className="text-xs text-gray-500 font-medium mt-1">{currentCategory.desc}</p>
                      </div>
                      <div className="space-y-2 mt-3">
                        <button
                          type="button"
                          onClick={handleUploadClick}
                          className={`w-full py-2 border-2 ${currentCategory.border} ${currentCategory.color} font-black uppercase tracking-widest text-[10px] rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer hover:shadow-md bg-white`}
                        >
                          <Camera size={12} /> Tap to Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSlotPhoto(currentCategory.key)}
                          className="w-full text-[10px] font-bold text-red-500 underline cursor-pointer hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Not uploaded: left = reference image, right = upload prompt */
                  <div className="flex h-[200px]">
                    {/* Left: Reference Image */}
                    <div className={`w-1/2 ${currentCategory.bg} flex items-center justify-center overflow-hidden`}>
                      {currentCategory.icon}
                    </div>
                    {/* Right: Upload Prompt */}
                    <div className="w-1/2 bg-white p-4 flex flex-col justify-between border-l border-gray-100">
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-gray-900">{currentCategory.label}</h4>
                        <p className="text-xs text-gray-500 font-medium mt-1">{currentCategory.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className={`mt-3 w-full py-2.5 ${currentCategory.bg} border-2 ${currentCategory.border} ${currentCategory.color} font-black uppercase tracking-widest text-[10px] rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer hover:shadow-md`}
                      >
                        <Camera size={12} /> Tap to Upload
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tip */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 flex items-start gap-2 mt-4">
                <span className="text-yellow-500 text-base">💡</span>
                <p className="text-[11px] font-semibold text-yellow-700">
                  Clear photos mean a more accurate offer.<br></br>
                  Please upload well-lit images of the front, back, and sides of your device.

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
      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-gray-900 p-8 text-white relative">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                  <Shield size={24} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Terms & <span className="text-green-400">Conditions</span></h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">United States Edition</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="prose prose-sm max-w-none space-y-6">
                <p className="text-gray-600 font-medium italic">
                  {/* Cashmish.com - Complete Terms and Conditions (United States) */}
                </p>

                {[
                  { title: "1. Introduction", content: "These Terms and Conditions govern all transactions between Cashmish.com and customers selling devices through our platform within the United States. By submitting a device for sale, you agree to be bound by these Terms." },
                  { title: "2. Eligibility", content: "You must be at least 18 years old and the legal owner of the device being sold." },
                  { title: "3. Customer Representations", content: "By submitting a device, you confirm the device is legally owned, not lost or stolen, free from financial obligations, and that all personal data has been removed." },
                  { title: "4. Accuracy of Information", content: "Customers must provide accurate information including model, storage, carrier status, functional condition, cosmetic condition, repair history, and any damage. The estimated price shown is based solely on the provided information." },
                  { title: "5. Inspection & Verification", content: "All devices undergo professional lab testing and physical inspection upon receipt. If the device does not match the submitted details, Cashmish.com reserves the right to revise the offer price." },
                  { title: "6. Revised Offer Process", content: "If a revised offer is necessary, customers will be notified and may accept or decline. If declined, the device will be returned subject to return shipping fees if discrepancies resulted from incorrect information." },
                  { title: "7. Payment Processing", content: "Payments are processed within 1–3 business days after final offer acceptance and inspection clearance. Cashmish.com is not responsible for delays caused by third-party payment providers." },
                  { title: "8. Stolen or Fraudulent Devices", content: "Devices identified as stolen, blacklisted, activation locked, or associated with fraud may be rejected. Cashmish.com reserves the right to cooperate with law enforcement and report device details when necessary." },
                  { title: "9. Data Responsibility", content: "Customers are solely responsible for removing personal data and disabling activation locks before shipping devices." },
                  { title: "10. Shipping & Risk of Loss", content: "Risk of loss remains with the customer until the device is received and confirmed by Cashmish.com. Return shipping costs apply when applicable." },
                  { title: "11. Limitation of Liability", content: "To the fullest extent permitted by law, Cashmish.com's liability shall not exceed the final agreed purchase price of the device. Cashmish.com is not liable for indirect or consequential damages." },
                  { title: "12. Right to Refuse Service", content: "Cashmish.com reserves the right to refuse service, cancel offers, or return devices at its discretion in cases of policy violations, fraud suspicion, or misrepresentation." },
                  { title: "13. Dispute Resolution & Governing Law", content: "These Terms are governed by the laws of the United States and the state of registration of Cashmish.com. Disputes shall first be resolved through good faith negotiation and, if unresolved, binding arbitration. Customers waive participation in class-action lawsuits." },
                  { title: "14. Modifications", content: "Cashmish.com reserves the right to update these Terms at any time. Continued use of the platform constitutes acceptance of revised Terms." }
                ].map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-gray-900 font-black uppercase text-xs tracking-widest flex items-center gap-2">
                      <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                      {section.title}
                    </h4>
                    <p className="text-gray-500 leading-relaxed text-sm font-medium">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAcceptedTerms(true);
                  setShowTermsModal(false);
                }}
                className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-green-700 transition-all shadow-xl shadow-green-600/20 cursor-pointer active:scale-95"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #ddd;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #ccc;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default DeviceAssessmentForm;