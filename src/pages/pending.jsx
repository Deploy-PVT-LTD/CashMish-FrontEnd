import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ShoppingCart, 
  ClipboardCheck, 
  DollarSign, 
  Smartphone,
  ChevronRight,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/layout/header.jsx';
import Chatbot from '../components/Chatbot.jsx';

const Step = ({ title, description, status, isLast }) => {
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  return (
    <div className="flex group">
      <div className="flex flex-col items-center mr-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${
          isCompleted ? 'bg-green-500 border-green-500' : 
          isActive ? 'bg-blue-600 border-blue-600 animate-pulse' : 
          'bg-white border-gray-200'
        }`}>
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-white" />
          ) : isActive ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          )}
        </div>
        {!isLast && (
          <div className={`w-0.5 h-16 transition-colors duration-500 ${
            isCompleted ? 'bg-green-500' : 'bg-gray-200'
          }`} />
        )}
      </div>
      <div className="pb-8">
        <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${
          isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'
        }`}>
          {isCompleted ? 'Completed' : isActive ? 'Processing' : 'Pending'}
        </p>
        <h3 className={`text-lg font-bold ${isCompleted || isActive ? 'text-gray-800' : 'text-gray-400'}`}>
          {title}
        </h3>
        <p className={`text-sm mt-1 max-w-xs ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default function PendingPage() {
  const location = useLocation();
  const estimatedPrice = location.state?.estimatedPrice || localStorage.getItem('estimatedPrice') || 0;

  const journeySteps = [
    {
      title: "Device Selection",
      description: "You've successfully selected your device, condition and storage requirements.",
      status: "completed"
    },
    {
      title: "Request Submitted",
      description: "Your information has been securely received by our valuation team.",
      status: "completed"
    },
    {
      title: "Download Free USPS Label",
      description: "Download your free prepaid shipping label to send your device to us securely and without any cost.",
      status: "completed"
    },
    {
      title: "Expert Valuation",
      description: "Our experts are currently reviewing your device details to provide the best possible bid.",
      status: "active"
    },
    {
      title: "Receive Cash Offer",
      description: "You will receive an official notification via email and SMS within 24 hours.",
      status: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <Chatbot />
      
      <div className="flex-grow pt-10 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Selling Journey</h1>
            <p className="mt-2 text-gray-600">Track the progress of your device sale in real-time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left: Journey Steps */}
            <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="relative">
                {journeySteps.map((step, index) => (
                  <Step 
                    key={index}
                    {...step}
                    isLast={index === journeySteps.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Right: Summary Card */}
            <div className="space-y-6">
              {/* Estimated Price Card */}
              {estimatedPrice > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transform transition-all hover:shadow-md">
                  <div className="bg-green-600 px-6 py-3">
                    <p className="text-white text-xs font-bold uppercase tracking-widest text-center">Preliminary Estimate</p>
                  </div>
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-2xl font-bold text-gray-900">$</span>
                      <span className="text-5xl font-black text-gray-900 tracking-tighter">{Number(estimatedPrice).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      This is an estimated value. Final quote depends on physical inspection.
                    </p>
                  </div>
                </div>
              )}

              {/* Action/Info Card */}
              <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold">Next Update</h4>
                </div>
                <p className="text-sm text-blue-50">
                  Our system will notify you as soon as the valuation is complete. Usually takes less than 24 hours.
                </p>
                <Link to="/cart" className="flex items-center justify-center gap-2 w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm transition-transform hover:scale-[1.02] active:scale-95 shadow-sm">
                  View in Cart
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Need Help? */}
              <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-4 border border-gray-200">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Need Help?</p>
                  <p className="text-xs text-gray-500">Chat with our support team</p>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400 font-medium">Thank you for choosing CashMish</p>
          </div>
        </div>
      </div>
    </div>
  );
}