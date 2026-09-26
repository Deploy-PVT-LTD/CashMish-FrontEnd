import React from 'react';
import { Mail, CheckCircle2, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/header.jsx';
import Chatbot from '../components/Chatbot.jsx';

export default function PendingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header simple />
      <Chatbot />

      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Thanks for choosing CashMish!</h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Check your email for your free shipping label and a confirmation of your submission.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-500">We'll also email you as soon as your device is reviewed.</p>
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3 bg-green-800 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-transform hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
