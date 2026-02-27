import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import { usePhoneFlip } from '@/context/PhoneFlipContext';
import {
  Calendar,
  MapPin,
  Phone,
  User,
  Smartphone,
  ArrowRight,
  CreditCard,
  Search,
} from 'lucide-react';

const UserForm = () => {
  const navigate = useNavigate();
  const { phoneData, setUserInfo } = usePhoneFlip();

  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    date: '',
  });

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!isFormComplete) return;

    setUserInfo({
      ...formData,
      timeSlot: selectedTimeSlot,
    });

    navigate('/pending');
  };

  const isFormComplete =
    formData.fullName.trim() &&
    formData.phoneNumber.trim() &&
    formData.address.trim() &&
    formData.date &&
    selectedTimeSlot;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6 sm:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        {/* der /><Hea */}

        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">How It Works</h2>

              {[
                { icon: Calendar, title: 'Schedule Pickup' },
                { icon: Search, title: 'Inspection' },
                { icon: CreditCard, title: 'Instant Payment' },
              ].map(({ icon: Icon, title }) => (
                <div key={title} className="flex gap-3 mb-3">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="font-medium">{title}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-600 text-white rounded-2xl shadow p-6">
              <h2 className="font-bold mb-3">Your Device</h2>
              {['brand', 'model', 'condition', 'storage'].map((key) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="opacity-80 capitalize">{key}</span>
                  <span>{phoneData[key]}</span>
                </div>
              ))}
              <div className="border-t border-white/30 mt-3 pt-3 flex justify-between">
                <span>Estimated Value</span>
                <span className="text-xl font-bold">
                  ${phoneData.price || 450}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Schedule Pickup</h2>

            <div className="space-y-4">
              {[
                { name: 'fullName', icon: User, placeholder: 'Full Name' },
                { name: 'phoneNumber', icon: Phone, placeholder: 'Phone Number' },
                { name: 'address', icon: MapPin, placeholder: 'Pickup Address' },
              ].map(({ name, icon: Icon, placeholder }) => (
                <div key={name} className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full pl-10 py-3 border rounded-xl"
                  />
                </div>
              ))}

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full py-3 px-4 border rounded-xl"
              />

              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`py-2 rounded-xl text-sm ${selectedTimeSlot === slot
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100'
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormComplete}
                className={`w-full py-3 rounded-xl font-semibold flex justify-center gap-2 ${isFormComplete
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                  }`}
              >
                Confirm Pickup <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
