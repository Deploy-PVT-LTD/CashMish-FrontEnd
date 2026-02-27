import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import Header from "../components/layout/header.jsx";
import { BASE_URL } from '../lib/api';
import {
  Search, CreditCard, Calendar, MapPin, Phone,
  ArrowRight, Mail, Navigation, Loader2, User
} from 'lucide-react';
import deploy from '../assets/deploy-logo.png';
import Chatbot from '../components/Chatbot.jsx';

export default function UserForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const suggestionRef = useRef(null);

  // ✔ Pichle page se aayi hui images yahan milengi
  const imagesToUpload = location.state?.files || [];

  const [loading, setLoading] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [showError, setShowError] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [deviceDetails, setDeviceDetails] = useState({
    brand: 'N/A', model: 'N/A', storage: 'N/A',
    screen: 'N/A', body: 'N/A', battery: 'N/A',
    condition: 'N/A', mobileId: ''
  });

  const [formData, setFormData] = useState({
    fullName: '', email: '', phoneNumber: '',
    address: '', date: '', coords: null
  });

  const timeSlots = ['9:00 AM - 11:00 AM', '11:00 AM - 1:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const details = {
      brand: localStorage.getItem('selectedBrand') || 'N/A',
      model: localStorage.getItem('selectedModel') || 'N/A',
      mobileId: localStorage.getItem('selectedMobileId') || '',
      storage: localStorage.getItem('selectedStorage') || '128GB',
      condition: localStorage.getItem('selectedCondition') || 'Fair',
      screen: localStorage.getItem('screenCondition') || 'perfect',
      body: localStorage.getItem('bodyCondition') || 'perfect',
      battery: localStorage.getItem('batteryCondition') || 'good'
    };
    setDeviceDetails(details);

    // Pre-fill form for logged-in users
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && (user.name || user.email)) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.date || !selectedTimeSlot) {
      setShowError(true);
      return;
    }

    setLoading(true);
    const data = new FormData();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id || user.id;

    // 1. Device Info Append
    if (userId) data.append("userId", userId);
    data.append("mobileId", deviceDetails.mobileId);
    data.append("storage", deviceDetails.storage);
    data.append("condition", deviceDetails.condition);
    data.append("screenCondition", deviceDetails.screen);
    data.append("bodyCondition", deviceDetails.body);
    data.append("batteryCondition", deviceDetails.battery);
    data.append("estimatedPrice", localStorage.getItem('estimatedPrice') || "0");
    data.append("carrier", "Unlocked");

    // 2. Pickup Details
    const pickUpDetails = {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      address: {
        addressText: formData.address,
        location: {
          type: "Point",
          coordinates: [formData.coords?.lng || 0, formData.coords?.lat || 0]
        }
      },
      pickUpDate: formData.date,
      timeSlot: selectedTimeSlot
    };
    data.append("pickUpDetails", JSON.stringify(pickUpDetails));

    // 3. 馃摳 IMAGES LOOP (Fix for DB upload + Client Side Compression)
    if (imagesToUpload.length > 0) {
      for (const file of imagesToUpload) {
        try {
          const options = {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(file, options);
          data.append("images", compressedFile);
        } catch (error) {
          console.error("Image compression error:", error);
          // Fallback to original file if compression fails
          data.append("images", file);
        }
      }
    }

    try {
      const res = await fetch(`${BASE_URL}/api/forms`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: data
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to submit");

      navigate("/pending", { state: { estimatedPrice: result.estimatedPrice } });
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setShowError(false);
  };

  const fetchSuggestions = async (q) => {
    if (q.length < 3) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=5`);
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        setFormData(p => ({
          ...p,
          address: data.display_name,
          coords: { lat: latitude, lng: longitude }
        }));
        setShowSuggestions(false);
      } catch (err) {
        console.error("Location error:", err);
      }
      setLocationLoading(false);
    }, () => {
      alert("Unable to get location");
      setLocationLoading(false);
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <Chatbot />
      <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8">

        {/* Left Info Panel (UI Same as before) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl"><User className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <h3 className="font-semibold text-sm">Condition</h3>
                  <p className="text-xs text-gray-600">Overall: {deviceDetails.condition}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-xl"><Calendar className="w-5 h-5 text-green-600" /></div>
                <div>
                  {/* add estimated value  */}
                  <h3 className="font-semibold text-sm">Schedule</h3>
                  <p className="text-xs text-gray-600">Quick Pickup & Pay</p>
                </div>
              </div>
            </div>
            {imagesToUpload.length > 0 && (
              <p className="text-xs text-blue-600 mt-4 font-medium italic">✔ {imagesToUpload.length} Device photos attached</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-900 to-green-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Device</h2>
              <img src={deploy} alt="logo" className="w-8 h-8 opacity-80" />
            </div>
            <div className="space-y-3">
              <DetailRow label="Brand" value={deviceDetails.brand} />
              <DetailRow label="Model" value={deviceDetails.model} />
              <DetailRow label="Storage" value={deviceDetails.storage} />
              <DetailRow label="Condition" value={deviceDetails.condition} />
            </div>
          </div>
        </div>

        {/* Form Panel (Functionality Merged) */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Schedule Pickup</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input icon={User} name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} error={showError && !formData.fullName} />
            <Input icon={Mail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} />
            <Input icon={Phone} name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} error={showError && !formData.phoneNumber} />

            <div className="relative" ref={suggestionRef}>
              <Input
                icon={MapPin} name="address" autoComplete="off" placeholder="Pickup address"
                value={formData.address} onChange={(e) => { handleInputChange(e); fetchSuggestions(e.target.value); }}
                error={showError && !formData.address}
                rightIcon={
                  <button type="button" onClick={fetchCurrentLocation} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    {locationLoading ? <Loader2 className="animate-spin text-green-800 w-4 h-4" /> : <Navigation className="text-green-600 w-4 h-4" />}
                  </button>
                }
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-2xl max-h-48 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <div key={i} onClick={() => {
                      setFormData(p => ({ ...p, address: s.display_name, coords: { lat: parseFloat(s.lat), lng: parseFloat(s.lon) } }));
                      setShowSuggestions(false);
                    }} className="px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer border-b last:border-0">{s.display_name}</div>
                  ))}
                </div>
              )}
            </div>

            <Input type="date" icon={Calendar} name="date" min={today} value={formData.date} onChange={handleInputChange} error={showError && !formData.date} />

            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  type="button" key={slot} onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-3 rounded-xl text-[10px] cursor-pointer font-bold transition-all ${selectedTimeSlot === slot ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${showError && !selectedTimeSlot ? 'border border-red-500' : ''}`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <button disabled={loading} type="submit" className="w-full bg-green-800 cursor-pointer hover:bg-green-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg transition-all active:scale-[0.98]">
              {loading ? <Loader2 className="animate-spin" /> : <>Confirm Pickup <ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-white/10 py-2">
      <span className="text-green-100 text-sm">{label}</span>
      <span className="font-bold text-sm uppercase">{value}</span>
    </div>
  );
}

function Input({ icon: Icon, rightIcon, error, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        {...props}
        className={`w-full pl-11 pr-10 py-3 rounded-xl bg-gray-50 border text-sm focus:outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-600 focus:bg-white'}`}
      />
      {rightIcon && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightIcon}</div>}
    </div>
  );
}