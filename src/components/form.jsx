import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "../components/header.jsx";
import { Search, CreditCard, Calendar, MapPin, Phone, ArrowRight, Mail, Navigation, Loader2, User } from 'lucide-react';
import deploy from '../assets/deploy-logo.png';

export default function UserForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const suggestionRef = useRef(null);

  // ✅ Pichle page se aayi hui images yahan milengi
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

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.name || user.email) {
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
        location: { type: "Point", coordinates: [formData.coords?.lng || 0, formData.coords?.lat || 0] }
      },
      pickUpDate: formData.date,
      timeSlot: selectedTimeSlot
    };
    data.append("pickUpDetails", JSON.stringify(pickUpDetails));

    // 3. 📸 IMAGES LOOP (Fix)
    if (imagesToUpload.length > 0) {
      imagesToUpload.forEach((file) => {
        data.append("images", file); // Key must match backend Multer field
      });
    }

    try {
      const res = await fetch("http://localhost:5000/api/forms", {
        method: "POST",
        headers: {
          // ⚠️ Content-Type set mat karna (FormData auto-handles it)
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
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-gray-600">Overall Condition:</span>
              <span className="text-green-700">{deviceDetails.condition}</span>
            </div>
            {imagesToUpload.length > 0 && (
              <p className="text-xs text-blue-600 mt-2">✓ {imagesToUpload.length} Photos ready to upload</p>
            )}
          </div>
          <div className="bg-green-800 rounded-2xl p-6 text-white shadow-xl">
             <h2 className="text-lg font-bold mb-4">Device: {deviceDetails.brand} {deviceDetails.model}</h2>
             <div className="text-sm opacity-90">Storage: {deviceDetails.storage}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input icon={User} name="fullName" placeholder="Name" value={formData.fullName} onChange={handleInputChange} />
            <Input icon={Mail} name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
            <Input icon={Phone} name="phoneNumber" placeholder="Phone" value={formData.phoneNumber} onChange={handleInputChange} />
            <Input icon={MapPin} name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
            <Input icon={Calendar} type="date" name="date" min={today} value={formData.date} onChange={handleInputChange} />
            
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map(slot => (
                <button type="button" key={slot} onClick={() => setSelectedTimeSlot(slot)} className={`py-2 rounded-lg text-xs font-bold ${selectedTimeSlot === slot ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {slot}
                </button>
              ))}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-green-800 text-white py-4 rounded-xl font-bold">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Confirm Pickup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input {...props} className="w-full pl-11 py-3 rounded-xl bg-gray-50 border text-sm" />
    </div>
  );
}