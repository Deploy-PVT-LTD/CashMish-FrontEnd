import React, { useState, useEffect } from 'react';
import { Search, CreditCard, Calendar, MapPin, Phone, ArrowRight, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header.jsx';
import deploy from '../assets/deploy-logo.png';
import { Mail } from 'lucide-react';


export default function UserForm() {
  const navigate = useNavigate();
  
  // 1. All fields in state
  const [deviceDetails, setDeviceDetails] = useState({
    brand: 'N/A',
    model: 'N/A',
    storage: 'N/A',
    screen: 'N/A',
    body: 'N/A',
    battery: 'N/A',
    price: '0'
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',  
    phoneNumber: '',
    address: '',
    date: ''
  });
  const [showError, setShowError] = useState(false);

  // 2. Fetching all individual conditions
  useEffect(() => {
    setDeviceDetails({
      brand: localStorage.getItem("selectedBrand") || "Device",
      model: localStorage.getItem("selectedModel") || "Model",
      storage: localStorage.getItem("selectedStorage") || "N/A",
      price: localStorage.getItem("estimatedPrice") || "0",
      screen: localStorage.getItem("screenCondition") || "N/A",
      body: localStorage.getItem("bodyCondition") || "N/A",
      battery: localStorage.getItem("batteryCondition") || "N/A",
    });
  }, []);

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phoneNumber.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.date.trim() !== '' &&
      selectedTimeSlot !== ''
    );
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setShowError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setShowError(true);
      return;
    }
    
    localStorage.setItem("pickupDetails", JSON.stringify({
        ...formData,
        timeSlot: selectedTimeSlot
    }));
    
    navigate('/pending');
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              {/* How It Works Section (UI Same) */}
              <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto md:max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl"><Calendar className="w-6 h-6 text-blue-600" /></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Schedule Pickup</h3>
                      <p className="text-gray-600 text-sm">Choose a convenient time for doorstep collection.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl"><Search className="w-6 h-6 text-blue-600" /></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Quick Inspection</h3>
                      <p className="text-gray-600 text-sm">Expert verification of your device condition.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl"><CreditCard className="w-6 h-6 text-blue-600" /></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Instant Payment</h3>
                      <p className="text-gray-600 text-sm">Receive payment immediately after inspection.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ Blue Section - Ab yahan sari conditions hain */}
              <div className="bg-gradient-to-br max-w-sm p-6 from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto md:max-w-lg text-white">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">Your Device</h2>
                  {/* <div className="bg-white/20 p-2 rounded-lg"> */}
                  <a href="/"><img className="w-9 h-10" src={deploy} alt="logo" /></a>
                    {/* <Smartphone  /> */}
                  {/* </div> */}
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-blue-100 font-medium">Model</span>
                    <span className="font-semibold text-lg">{deviceDetails.brand} {deviceDetails.model}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-blue-100 font-medium">Storage</span>
                    <span className="font-semibold text-lg">{deviceDetails.storage}</span>
                  </div>
                  
                  {/* Detailed Conditions Start Here */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-2 capitalize">
                    <span className="text-blue-100 font-medium">Screen</span>
                    <span className="font-semibold">{deviceDetails.screen}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2 capitalize">
                    <span className="text-blue-100 font-medium">Body</span>
                    <span className="font-semibold">{deviceDetails.body}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2 capitalize">
                    <span className="text-blue-100 font-medium">Battery</span>
                    <span className="font-semibold">{deviceDetails.battery}</span>
                  </div>
                  
                  {/* Price Section */}
                  {/* <div className="mt-6 pt-4 border-t border-white/20">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100 font-bold text-xl">Expected Offer Between</span>
                      <span className="text-3xl font-black">${deviceDetails.price}</span>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Right Column - Form (UI Exactly as you provided) */}
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto md:max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule Pickup</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition ${
                      showError && formData.fullName.trim() === '' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>

                {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="johndoe@email.com"
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none transition ${
                    showError && formData.email.trim() === ''
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
              </div>
                </div>


                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none transition ${
                        showError && formData.phoneNumber.trim() === '' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Pickup Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your full address"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none transition ${
                        showError && formData.address.trim() === '' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none transition ${
                        showError && formData.date.trim() === '' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Time Slot</label>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setSelectedTimeSlot(slot);
                          setShowError(false);
                        }}
                        className={`py-3 px-4 rounded-xl font-medium transition-all ${
                          selectedTimeSlot === slot
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : showError && selectedTimeSlot === ''
                            ? 'bg-red-50 border border-red-500 text-red-700 hover:bg-red-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                >
                  Confirm Pickup
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}