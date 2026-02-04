import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, CreditCard, Calendar, MapPin, Phone,
  ArrowRight, Mail, Navigation, Loader2, User
} from 'lucide-react';
import Header from '../components/header.jsx';
import deploy from '../assets/deploy-logo.png';

export default function UserForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const suggestionRef = useRef(null);

  const imagesToUpload = location.state?.files || [];

  const [loading, setLoading] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [showError, setShowError] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [deviceDetails, setDeviceDetails] = useState({
    brand: 'N/A', model: 'N/A', storage: 'N/A',
    screen: 'N/A', body: 'N/A', battery: 'N/A', mobileId: ''
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
      mobileId: localStorage.getItem('selectedMobileId') || 'MISSING!',
      storage: localStorage.getItem('selectedStorage') || '128GB',
      screen: localStorage.getItem('screenCondition') || 'perfect',
      body: localStorage.getItem('bodyCondition') || 'perfect',
      battery: localStorage.getItem('batteryCondition') || 'good'
    };
    setDeviceDetails(details);
  }, []);

 // handleSubmit function me ye changes karo:

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.date || !selectedTimeSlot) {
    setShowError(true);
    alert("Please fill all required fields");
    return;
  }

  const mId = localStorage.getItem('selectedMobileId');
  if (!mId || mId === 'MISSING!') {
    alert("Mobile selection ID is missing.");
    return;
  }

  setLoading(true);

  const data = new FormData();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || user._id;

  if (userId) {
    data.append('userId', userId);
  }

  data.append('mobileId', mId);
  data.append('storage', deviceDetails.storage);
  data.append('carrier', "Unlocked");
  data.append('screenCondition', deviceDetails.screen.toLowerCase());
  data.append('bodyCondition', deviceDetails.body.toLowerCase());
  data.append('batteryCondition', deviceDetails.battery.toLowerCase());

  const pickUpDetails = {
    fullName: formData.fullName,
    phoneNumber: formData.phoneNumber,
    address: {
      addressText: formData.address,
      location: {
        type: "Point",
        coordinates: formData.coords ? [formData.coords.lng, formData.coords.lat] : [0, 0]
      }
    },
    pickUpDate: formData.date,
    timeSlot: selectedTimeSlot
  };
  data.append('pickUpDetails', JSON.stringify(pickUpDetails));

  imagesToUpload.forEach((file) => {
    data.append('images', file);
  });

  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch("http://localhost:5000/api/forms", {
      method: "POST",
      headers: headers,
      body: data
    });

    const result = await response.json();
    console.log('📨 Backend response:', result);

    if (response.ok) {
      // Cart me save karo
      const cartKey = userId ? `userCart_${userId}` : 'userCart';
      const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');

      const cartEntry = {
        id: result._id || Date.now(),
        brand: deviceDetails.brand,
        name: deviceDetails.model,
        storage: deviceDetails.storage,
        condition: deviceDetails.screen,
        uploadDate: new Date(formData.date).toLocaleDateString(),
        status: 'pending',
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        timeSlot: selectedTimeSlot,
        fullName: formData.fullName,
        estimatedPrice: result.estimatedPrice // ✅ Ye add karo cart me bhi
      };

      const updatedCart = [...existingCart, cartEntry];
      localStorage.setItem('userCart', JSON.stringify(updatedCart));
      if (userId) {
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      }

      // ✅ YAHAN ESTIMATED PRICE PASS KARO
      navigate('/pending', { 
        state: { 
          estimatedPrice: result.estimatedPrice || 0 
        } 
      });
    } else {
      alert(`Error: ${result.message || "Something went wrong"}`);
    }
  } catch (error) {
    console.error('❌ Form submission error:', error);
    alert("Server error. Please check if backend is running on port 5000.");
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
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await res.json();
      setFormData(p => ({
        ...p, address: data.display_name,
        coords: { lat: latitude, lng: longitude }
      }));
      setLocationLoading(false);
      setShowSuggestions(false);
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">How It Works</h2>
            {[{ icon: Calendar, title: 'Schedule Pickup', text: 'Choose a convenient time.' },
              { icon: Search, title: 'Quick Inspection', text: 'Expert verification.' },
              { icon: CreditCard, title: 'Instant Payment', text: 'Get paid immediately.' }
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4 mb-5">
                <div className="bg-blue-100 p-3 rounded-xl"><Icon className="w-5 h-5 text-blue-600" /></div>
                <div><h3 className="font-semibold">{title}</h3><p className="text-sm text-gray-600">{text}</p></div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">Your Device</h2>
              <a href="/"><img src={deploy} alt="logo" className="w-10 h-10" /></a>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-white/10 py-2">
                <span className="text-blue-100">Brand</span>
                <span className="font-bold uppercase">{deviceDetails.brand}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 py-2">
                <span className="text-blue-100">Model</span>
                <span className="font-bold">{deviceDetails.model}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 py-2">
                <span className="text-blue-100">Storage</span>
                <span className="font-semibold">{deviceDetails.storage}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 h-fit">
          <h2 className="text-xl font-bold mb-6">Schedule Pickup</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input icon={User} name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} error={showError && !formData.fullName} />
            <Input icon={Mail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} error={showError && !formData.email} />
            <Input icon={Phone} name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} error={showError && !formData.phoneNumber} />

            <div className="relative" ref={suggestionRef}>
              <Input
                icon={MapPin} name="address" autoComplete="off" placeholder="Pickup address"
                value={formData.address} onChange={(e) => { handleInputChange(e); fetchSuggestions(e.target.value); }}
                error={showError && !formData.address}
                rightIcon={
                  <button type="button" onClick={fetchCurrentLocation}>
                    {locationLoading ? <Loader2 className="animate-spin text-blue-600 w-4 h-4" /> : <Navigation className="text-blue-600 w-4 h-4" />}
                  </button>
                }
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-2xl max-h-48 overflow-y-auto">
                  {suggestions.map((s, i) => (
                    <div key={i} onClick={() => { setFormData(p => ({ ...p, address: s.display_name })); setShowSuggestions(false); }}
                      className="px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer border-b last:border-0">{s.display_name}</div>
                  ))}
                </div>
              )}
            </div>

            <Input type="date" icon={Calendar} name="date" min={today} value={formData.date} onChange={handleInputChange} error={showError && !formData.date} />

            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button type="button" key={slot} onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-3 rounded-xl text-xs font-semibold transition-all ${selectedTimeSlot === slot ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'} ${showError && !selectedTimeSlot ? 'border border-red-500' : ''}`}>
                  {slot}
                </button>
              ))}
            </div>

            <button disabled={loading} type="submit" className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : <>Confirm Pickup <ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ icon: Icon, rightIcon, error, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input {...props} className={`w-full pl-11 pr-10 py-3 rounded-xl bg-gray-50 border text-sm focus:outline-none ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'}`} />
      {rightIcon && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightIcon}</div>}
    </div>
  );
}