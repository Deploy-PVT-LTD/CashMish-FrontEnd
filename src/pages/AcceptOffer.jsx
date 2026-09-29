import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, Smartphone, PackageX } from 'lucide-react';
import { BASE_URL } from '../lib/api';
import Header from '../components/layout/header.jsx';

export default function AcceptOffer() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [confirmingReject, setConfirmingReject] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/forms/offer/${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Offer not found');
        setOffer(data);
        if (data.status === 'accepted') setAccepted(true);
        if (data.status === 'rejected') setRejected(true);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/forms/offer/${token}/accept`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to accept offer');
      setAccepted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/forms/offer/${token}/reject`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reject offer');
      setRejected(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header simple />
      <div className="flex items-center justify-center px-4 py-16 min-h-[80vh]">
        {loading ? (
          <Loader2 className="w-8 h-8 text-green-700 animate-spin" />
        ) : error ? (
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900">{error}</h1>
            <p className="text-sm text-gray-500 mt-2">This link may have already been used or expired.</p>
          </div>
        ) : accepted ? (
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Offer Accepted!</h1>
            <p className="text-gray-600 mt-3">
              Thanks — you'll receive a confirmation email shortly.
              Your payment of <strong>${offer?.counterOfferPrice?.toLocaleString()}</strong> will be sent within
              48 hours of us receiving your device.
            </p>
          </div>
        ) : rejected ? (
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <PackageX className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Offer Declined</h1>
            <p className="text-gray-600 mt-3">
              No problem — your <strong>{offer?.deviceName}</strong> will be shipped back to you within
              <strong> 4–5 working days</strong>. You'll also get a confirmation email shortly.
            </p>
          </div>
        ) : (
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <Smartphone className="w-8 h-8 text-green-700" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 text-center">Counter Offer for Your {offer?.deviceName}</h1>
            <p className="text-sm text-gray-500 text-center mt-1">{offer?.storage}</p>

            <div className="mt-6 bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Original Estimate</span>
                <span className="line-through">${offer?.estimatedPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Counter Offer</span>
                <span className="text-3xl font-black text-green-700">${offer?.counterOfferPrice?.toLocaleString()}</span>
              </div>
            </div>

            {!confirmingReject ? (
              <>
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="w-full mt-6 bg-green-800 hover:bg-green-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg transition-all active:scale-[0.98]"
                >
                  {accepting ? <Loader2 className="animate-spin" /> : 'Accept Counter Offer'}
                </button>
                <button
                  onClick={() => setConfirmingReject(true)}
                  className="w-full mt-3 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 py-3.5 rounded-xl font-bold transition-all active:scale-[0.98]"
                >
                  Reject Offer
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Questions about this offer? Reply to the email you received.
                </p>
              </>
            ) : (
              <div className="mt-6">
                <p className="text-sm text-gray-700 text-center font-medium">
                  Are you sure? If you reject, your device will be shipped back to you instead — no payment will be made.
                </p>
                <button
                  onClick={handleReject}
                  disabled={rejecting}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg transition-all active:scale-[0.98]"
                >
                  {rejecting ? <Loader2 className="animate-spin" /> : 'Yes, Reject & Return My Device'}
                </button>
                <button
                  onClick={() => setConfirmingReject(false)}
                  disabled={rejecting}
                  className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-bold transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
