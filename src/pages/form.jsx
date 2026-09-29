import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from "../components/layout/header.jsx";
import {
  Search, CreditCard, MapPin, Phone,
  ArrowRight, Mail, Navigation, Loader2, User, Truck
} from 'lucide-react';
import favIcon from '../assets/cashmish-Fav.svg';
import Chatbot from '../components/Chatbot.jsx';

// USPS state abbreviations — used for the shipping-address dropdown.
const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'], ['FL', 'Florida'],
  ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'],
  ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'],
  ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'],
  ['OH', 'Ohio'], ['OK', 'Oklahoma'], ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'], ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'],
  ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'],
  ['WY', 'Wyoming'],
];

export default function UserForm() {
  const navigate = useNavigate();
  const location = useLocation();
  // Guards against firing "Continue" twice (double-click) before the
  // navigate() to the payment-method step goes through.
  const isSubmittingRef = useRef(false);

  // ✔ Pichle page se aayi hui images yahan milengi — carried forward to the
  // payment-method step, where the actual submission happens.
  const imagesToUpload = location.state?.files || [];

  const [showError, setShowError] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [deviceDetails, setDeviceDetails] = useState({
    brand: 'N/A', model: 'N/A', storage: 'N/A',
    condition: 'N/A', mobileId: '', carrier: 'N/A', conditionAnswers: {}
  });

  const [formData, setFormData] = useState({
    fullName: '', email: '', phoneNumber: '',
    streetAddress: '', city: '', state: '', zipCode: '', coords: null
  });

  useEffect(() => {
    let conditionAnswers = {};
    try {
      conditionAnswers = JSON.parse(localStorage.getItem('conditionAnswers') || '{}');
    } catch {
      conditionAnswers = {};
    }

    const details = {
      brand: localStorage.getItem('selectedBrand') || 'N/A',
      model: localStorage.getItem('selectedModel') || 'N/A',
      mobileId: localStorage.getItem('selectedMobileId') || '',
      storage: localStorage.getItem('selectedStorage') || '',
      condition: localStorage.getItem('selectedCondition') || 'Fair',
      conditionAnswers,
      carrier: localStorage.getItem('selectedCarrier') || ''
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

  // Tracking: "Personal Data Form" — fires once the contact details (name,
  // phone, email, address) are confirmed here. Named event for Meta Pixel +
  // Google Ads/GA4 + GTM so it's distinguishable from the earlier "Mobile
  // Form Submit" step in Events Manager. The actual backend submission now
  // happens one step later, on the payment-method page.
  const handleContinue = (e) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;

    const zipValid = /^\d{5}$/.test(formData.zipCode);
    if (!formData.fullName || !formData.phoneNumber || !formData.streetAddress || !formData.city || !formData.state || !zipValid) {
      setShowError(true);
      return;
    }

    isSubmittingRef.current = true;

    const estimatedPriceValue = Number(localStorage.getItem('estimatedPrice')) || 0;
    const deviceLabel = `${deviceDetails.brand} ${deviceDetails.model}`.trim();
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', 'PersonalDataForm', {
        value: estimatedPriceValue,
        currency: 'USD',
        content_name: deviceLabel,
      });
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'personal_data_form', {
        event_category: 'conversion',
        event_label: deviceLabel,
        value: estimatedPriceValue,
      });
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'personal_data_form',
      device: deviceLabel,
      estimatedPrice: estimatedPriceValue,
    });

    navigate('/paymentmethod', {
      state: {
        files: imagesToUpload,
        pickupDetails: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          coords: formData.coords,
        },
      },
    });
  };

  // US format as the user types: (555) 123-4567 — caps at 10 digits.
  const formatUSPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length < 4) return `(${digits}`;
    if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formatted = name === 'phoneNumber'
      ? formatUSPhone(value)
      : name === 'zipCode'
        ? value.replace(/\D/g, '').slice(0, 5)
        : value;
    setFormData(p => ({ ...p, [name]: formatted }));
    setShowError(false);
  };

  // "Use my location" — reverse-geocodes and fills street/city/state/zip
  // directly instead of one free-text address line.
  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
        const data = await res.json();
        const addr = data.address || {};
        const street = [addr.house_number, addr.road].filter(Boolean).join(' ');
        const city = addr.city || addr.town || addr.village || addr.suburb || '';
        const stateEntry = US_STATES.find(([, name]) => name.toLowerCase() === (addr.state || '').toLowerCase());
        setFormData(p => ({
          ...p,
          streetAddress: street || p.streetAddress,
          city: city || p.city,
          state: stateEntry ? stateEntry[0] : p.state,
          zipCode: (addr.postcode || '').slice(0, 5) || p.zipCode,
          coords: { lat: latitude, lng: longitude }
        }));
      } catch (err) {
        console.error("Location error:", err);
        alert("Couldn't determine your address — please enter it manually.");
      }
      setLocationLoading(false);
    }, () => {
      alert("Unable to get location");
      setLocationLoading(false);
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header simple />
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
                <div className="bg-green-100 p-3 rounded-xl"><Truck className="w-5 h-5 text-green-600" /></div>
                <div>
                  <h3 className="font-semibold text-sm">Shipping</h3>
                  <p className="text-xs text-gray-600">Free prepaid USPS label</p>
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
              <img src={favIcon} alt="logo" className="w-10 h-10 object-contain" />
            </div>
            <div className="space-y-3">
              <DetailRow label="Brand" value={deviceDetails.brand} />
              <DetailRow label="Model" value={deviceDetails.model} />
              <DetailRow label="Storage" value={deviceDetails.storage} />
              <DetailRow label="Condition" value={deviceDetails.condition} />
              <DetailRow label="Carrier" value={deviceDetails.carrier} />
            </div>
          </div>
        </div>

        {/* Form Panel (Functionality Merged)
            Intentionally a <div>, not a native <form>, so this never fires a
            native "submit" DOM event — GTM's built-in "All Forms" trigger
            auto-tracks any real form submission regardless of our own JS, so
            avoiding the native event is the only reliable way to keep it out
            of the "Form Submit"/gtm.formSubmit stream while still only
            sending our own explicit "PersonalDataForm" tracking event.
            Enter-to-submit UX is preserved via onKeyDown below. */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Your Details</h2>
          <div
            className="space-y-4"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                handleContinue(e);
              }
            }}
          >
            <Input icon={User} name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} error={showError && !formData.fullName} />
            <Input icon={Mail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} />
            <Input icon={Phone} type="tel" name="phoneNumber" placeholder="(555) 123-4567" value={formData.phoneNumber} onChange={handleInputChange} error={showError && !formData.phoneNumber} />

            <Input
              icon={MapPin} name="streetAddress" autoComplete="off" placeholder="Street Address"
              value={formData.streetAddress} onChange={handleInputChange}
              error={showError && !formData.streetAddress}
              rightIcon={
                <button type="button" onClick={fetchCurrentLocation} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  {locationLoading ? <Loader2 className="animate-spin text-green-800 w-4 h-4" /> : <Navigation className="text-green-600 w-4 h-4" />}
                </button>
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                name="city" autoComplete="off" placeholder="City"
                value={formData.city} onChange={handleInputChange}
                error={showError && !formData.city}
              />
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border text-sm focus:outline-none transition-all ${showError && !formData.state ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-600 focus:bg-white'}`}
              >
                <option value="">State</option>
                {US_STATES.map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>

            <Input
              name="zipCode" inputMode="numeric" autoComplete="off" placeholder="ZIP Code" maxLength={5}
              value={formData.zipCode} onChange={handleInputChange}
              error={showError && !/^\d{5}$/.test(formData.zipCode)}
            />

            <button type="button" onClick={handleContinue} className="w-full bg-green-800 cursor-pointer hover:bg-green-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg transition-all active:scale-[0.98]">
              Continue <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function DetailRow({ label, value }) {
  const formatValue = (val) => {
    if (!val) return 'N/A';
    if (label === 'Carrier') {
      if (val === 'att') return 'AT&T';
      if (val === 'tmobile') return 'T-Mobile';
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
    return val;
  };

  return (
    <div className="flex justify-between border-b border-white/10 py-2">
      <span className="text-green-100 text-sm">{label}</span>
      <span className="font-bold text-sm">{formatValue(value)}</span>
    </div>
  );
}

function Input({ icon: Icon, rightIcon, error, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-10 py-3 rounded-xl bg-gray-50 border text-sm focus:outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-600 focus:bg-white'}`}
      />
      {rightIcon && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightIcon}</div>}
    </div>
  );
}