import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import Header from "../components/layout/header.jsx";
import Chatbot from '../components/Chatbot.jsx';
import { BASE_URL } from '../lib/api';
import {
  Landmark, Mail as MailIcon, Loader2, ArrowRight, ShieldCheck, Phone
} from 'lucide-react';

export default function PaymentMethod() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSubmittingRef = useRef(false);

  const pickupDetails = location.state?.pickupDetails;
  const imagesToUpload = location.state?.files || [];

  // Direct load / refresh with no state from the previous step — send them
  // back to re-enter their contact details rather than submit with nothing.
  useEffect(() => {
    if (!pickupDetails) {
      navigate('/userdata', { replace: true });
    }
  }, [pickupDetails, navigate]);

  const [method, setMethod] = useState('zelle');
  const [zelleContactType, setZelleContactType] = useState('email');
  const [zelleContact, setZelleContact] = useState('');
  const [bank, setBank] = useState({
    accountHolderName: '', routingNumber: '', accountNumber: '', confirmAccountNumber: '', accountType: 'checking'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const estimatedPrice = Number(localStorage.getItem('estimatedPrice')) || 0;

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBank((p) => ({ ...p, [name]: value }));
    setError('');
  };

  const validate = () => {
    if (method === 'zelle') {
      if (!zelleContact.trim()) return 'Please enter your Zelle email or phone number.';
      return '';
    }
    if (!bank.accountHolderName.trim()) return 'Account holder name is required.';
    if (!/^\d{9}$/.test(bank.routingNumber.trim())) return 'Routing number must be exactly 9 digits.';
    if (!/^\d{4,17}$/.test(bank.accountNumber.trim())) return 'Please enter a valid account number.';
    if (bank.accountNumber.trim() !== bank.confirmAccountNumber.trim()) return 'Account numbers do not match.';
    return '';
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    setError('');

    try {
      let conditionAnswers = {};
      try {
        conditionAnswers = JSON.parse(localStorage.getItem('conditionAnswers') || '{}');
      } catch {
        conditionAnswers = {};
      }

      const data = new FormData();
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user._id || user.id;

      if (userId) data.append("userId", userId);
      data.append("mobileId", localStorage.getItem('selectedMobileId') || '');
      data.append("storage", localStorage.getItem('selectedStorage') || '');
      data.append("condition", localStorage.getItem('selectedCondition') || 'Fair');
      data.append("conditionAnswers", JSON.stringify(conditionAnswers));
      const forcedGrade = localStorage.getItem("forcedGrade");
      if (forcedGrade) data.append("forcedGrade", forcedGrade);
      data.append("estimatedPrice", localStorage.getItem('estimatedPrice') || "0");
      data.append("carrier", localStorage.getItem('selectedCarrier') || "");

      const pickUpDetails = {
        fullName: pickupDetails.fullName,
        phoneNumber: pickupDetails.phoneNumber,
        email: pickupDetails.email,
        address: {
          addressText: pickupDetails.address,
          location: {
            type: "Point",
            coordinates: [pickupDetails.coords?.lng || 0, pickupDetails.coords?.lat || 0]
          }
        },
      };
      data.append("pickUpDetails", JSON.stringify(pickUpDetails));

      data.append("paymentMethod", method);
      if (method === 'zelle') {
        data.append("zelleDetails", JSON.stringify({ contact: zelleContact.trim(), contactType: zelleContactType }));
      } else {
        data.append("bankAccountDetails", JSON.stringify({
          accountHolderName: bank.accountHolderName.trim(),
          routingNumber: bank.routingNumber.trim(),
          accountNumber: bank.accountNumber.trim(),
          accountType: bank.accountType,
        }));
      }

      if (imagesToUpload.length > 0) {
        for (const file of imagesToUpload) {
          try {
            const compressedFile = await imageCompression(file, {
              maxSizeMB: 0.8,
              maxWidthOrHeight: 1200,
              useWebWorker: true,
            });
            data.append("images", compressedFile);
          } catch (err) {
            console.error("Image compression error:", err);
            data.append("images", file);
          }
        }
      }

      const res = await fetch(`${BASE_URL}/api/forms`, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: data
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to submit");

      localStorage.removeItem('forcedGrade');

      const guestOrders = JSON.parse(localStorage.getItem('myGuestOrders') || '[]');
      if (result._id && !guestOrders.includes(result._id)) {
        guestOrders.push(result._id);
        localStorage.setItem('myGuestOrders', JSON.stringify(guestOrders));
      }

      const draftUserId = userId;
      if (draftUserId) {
        fetch(`${BASE_URL}/api/drafts/${draftUserId}`, { method: 'DELETE' })
          .catch(err => console.error('Draft delete error:', err));
      }

      navigate("/pending");
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      isSubmittingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  if (!pickupDetails) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header simple />
      <Chatbot />
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">How do you want to receive your payment?</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            {estimatedPrice > 0 && <>Estimated payout: <span className="font-bold text-green-700">${estimatedPrice.toLocaleString()}</span> — </>}
            we'll send your payment within 48 hours of receiving your device.
          </p>

          {/* Method selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => { setMethod('zelle'); setError(''); }}
              className={`flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition-all ${method === 'zelle' ? 'border-green-700 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <MailIcon className={`w-6 h-6 ${method === 'zelle' ? 'text-green-700' : 'text-gray-400'}`} />
              <span className={`font-bold text-sm ${method === 'zelle' ? 'text-green-800' : 'text-gray-600'}`}>Zelle</span>
            </button>
            <button
              type="button"
              onClick={() => { setMethod('bank'); setError(''); }}
              className={`flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition-all ${method === 'bank' ? 'border-green-700 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <Landmark className={`w-6 h-6 ${method === 'bank' ? 'text-green-700' : 'text-gray-400'}`} />
              <span className={`font-bold text-sm ${method === 'bank' ? 'text-green-800' : 'text-gray-600'}`}>Bank Account</span>
            </button>
          </div>

          {/* Zelle fields */}
          {method === 'zelle' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button type="button" onClick={() => setZelleContactType('email')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${zelleContactType === 'email' ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-600'}`}>Email</button>
                <button type="button" onClick={() => setZelleContactType('phone')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${zelleContactType === 'phone' ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-600'}`}>Phone</button>
              </div>
              <Field
                icon={zelleContactType === 'email' ? MailIcon : Phone}
                type={zelleContactType === 'email' ? 'email' : 'tel'}
                placeholder={zelleContactType === 'email' ? 'zelle@email.com' : '(555) 123-4567'}
                value={zelleContact}
                onChange={(e) => setZelleContact(e.target.value)}
              />
            </div>
          )}

          {/* Bank fields — only what's required to send an ACH payment in the US */}
          {method === 'bank' && (
            <div className="space-y-4">
              <Field name="accountHolderName" placeholder="Account Holder Name" value={bank.accountHolderName} onChange={handleBankChange} />
              <Field name="routingNumber" placeholder="Routing Number (9 digits)" value={bank.routingNumber} onChange={handleBankChange} maxLength={9} inputMode="numeric" />
              <Field name="accountNumber" placeholder="Account Number" value={bank.accountNumber} onChange={handleBankChange} inputMode="numeric" />
              <Field name="confirmAccountNumber" placeholder="Confirm Account Number" value={bank.confirmAccountNumber} onChange={handleBankChange} inputMode="numeric" />
              <div className="flex gap-2">
                <button type="button" onClick={() => setBank(p => ({ ...p, accountType: 'checking' }))} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${bank.accountType === 'checking' ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-600'}`}>Checking</button>
                <button type="button" onClick={() => setBank(p => ({ ...p, accountType: 'savings' }))} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${bank.accountType === 'savings' ? 'bg-green-800 text-white' : 'bg-gray-100 text-gray-600'}`}>Savings</button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600 font-medium mt-4">{error}</p>}

          <div className="flex items-start gap-2 mt-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <ShieldCheck className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500">Your payment details are only used to send you money for this device — we never charge you anything.</p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full mt-6 bg-green-800 hover:bg-green-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Submit <ArrowRight size={20} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-green-600 focus:bg-white transition-all`}
      />
    </div>
  );
}
