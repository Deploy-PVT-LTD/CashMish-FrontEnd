import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, XCircle, Loader, Clock, User } from 'lucide-react';

export default function OfferAcceptancePage() {
  const [loading, setLoading] = useState(true);
  const [offer, setOffer] = useState(null);
  const [status, setStatus] = useState(null);

  // Simulating fetching data from database
  useEffect(() => {
    setTimeout(() => {
      // Mock data - replace with actual API call
      setOffer({
        phoneName: "iPhone 14 Pro Max",
        condition: "Good",
        price: 850
      });
      setLoading(false);
    }, 1500);
  }, []);

  const handleAccept = () => {
    setStatus('accepted');
    // Add API call here to update database
    console.log('Offer accepted');
  };

  const handleReject = () => {
    setStatus('rejected');
    // Add API call here to update database
    console.log('Offer rejected');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="text-center">
          <Loader className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 animate-spin mx-auto" />
          <p className="text-sm sm:text-base text-purple-200 mt-4 font-medium">Loading offer details...</p>
        </div>
      </div>
    );
  }

  if (status === 'accepted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="max-w-sm sm:max-w-md lg:max-w-lg w-full bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full p-4 sm:p-5 shadow-lg">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
            Offer Accepted!
          </h1>
          
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 sm:p-5 mb-5 sm:mb-6 border border-emerald-200">
            <p className="text-sm sm:text-base text-gray-700 text-center mb-3">
              Thank you for accepting our offer of
            </p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-600 text-center mb-3">
              ${offer.price.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              for your <strong>{offer.phoneName}</strong>
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
            <div className="flex items-start bg-white rounded-lg p-3 sm:p-4 shadow-md border border-gray-100">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Pickup Scheduled</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Our representative will visit you within <strong>24 hours</strong> to collect your device.
                </p>
              </div>
            </div>

            <div className="flex items-start bg-white rounded-lg p-3 sm:p-4 shadow-md border border-gray-100">
              <div className="bg-purple-100 rounded-full p-2 mr-3 flex-shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Next Steps</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  We will contact you shortly to confirm the pickup time and location.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 sm:p-4 border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 text-center">
              Please keep your device ready and ensure all personal data is backed up before our representative arrives.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="max-w-sm sm:max-w-md lg:max-w-lg w-full bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-br from-red-400 to-red-600 rounded-full p-4 sm:p-5 shadow-lg">
                <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Offer Declined
          </h1>
          
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 sm:p-5 mb-4 border border-red-200">
            <p className="text-sm sm:text-base text-gray-700 mb-2">
              You have declined our offer of
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
              ${offer.price.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              for your <strong>{offer.phoneName}</strong>
            </p>
          </div>
          
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            We understand this offer didn't meet your expectations.
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Feel free to contact us if you change your mind or have any questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-sm sm:max-w-md lg:max-w-lg w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-4 sm:p-5 shadow-lg">
                  <Smartphone className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 sm:mb-3">
              Device Offer
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              We have evaluated your device
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 mb-6 sm:mb-8 border border-purple-200 shadow-lg">
            <div className="mb-4 sm:mb-5">
              <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Device</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {offer.phoneName}
              </p>
            </div>
            
            <div className="mb-5 sm:mb-6">
              <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Condition</p>
              <span className="inline-block bg-green-100 text-green-700 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-sm sm:text-base font-semibold">
                {offer.condition}
              </span>
            </div>

            <div className="pt-4 sm:pt-5 border-t-2 border-purple-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Our Offer</p>
              <div className="flex items-baseline justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-gray-400 mr-1 sm:mr-2">$</span>
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {offer.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={handleAccept}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3.5 sm:py-4 md:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-2xl active:scale-95 transform"
            >
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              <span>Accept Offer</span>
            </button>

            <button
              onClick={handleReject}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-3.5 sm:py-4 md:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-base md:text-lg shadow-lg hover:shadow-2xl active:scale-95 transform"
            >
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              <span>Reject Offer</span>
            </button>
          </div>

          <div className="mt-5 sm:mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 sm:p-4 border border-amber-200">
            <div className="flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <p className="text-xs sm:text-sm font-semibold">
                This offer is valid for 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}