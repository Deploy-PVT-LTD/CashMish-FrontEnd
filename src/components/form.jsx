import React, { useState } from 'react';
import { Search, CreditCard, Calendar, MapPin, Phone, ArrowRight, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header.jsx';

export default function UserForm() {
  const navigate = useNavigate();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    date: ''
  });
  const [showError, setShowError] = useState(false); // 🔴 error state

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.phoneNumber.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.date.trim() !== '' &&
      selectedTimeSlot !== ''
    );
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setShowError(false); // hide error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setShowError(true); // 🔴 show inline error
      return;
    }
    navigate('/pending');
  };

  return (
    <div>
     <Header simple />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto md:max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Schedule Pickup</h3>
                      <p className="text-gray-600 text-sm">
                        Choose a convenient time for our team to collect your device from your doorstep.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <Search className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Quick Inspection</h3>
                      <p className="text-gray-600 text-sm">
                        Our expert will verify the device condition and confirm the final offer.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Instant Payment</h3>
                      <p className="text-gray-600 text-sm">
                        Accept the offer and receive payment immediately via your preferred method.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
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
                          setShowError(false); // remove error when selected
                        }}
                        className={`py-3 px-4 rounded-xl font-medium transition-all ${
                          selectedTimeSlot === slot
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : showError
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

              {/* Inline Error Message */}
              {showError && (
                <p className="text-red-500 text-sm mt-2">Please fill all fields and select a time slot.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
