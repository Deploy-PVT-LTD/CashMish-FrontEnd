import React from "react";
import Header from '../components/header.jsx';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: "📍",
      iconBg: "bg-blue-100",
      title: "Doorstep Inspection",
      description:
        "Our expert visits your location at a time convenient for you to verify device condition.",
      detail: "Usually within 24–48 hours",
    },
    {
      number: 2,
      icon: "✅",
      iconBg: "bg-indigo-100",
      title: "Final Bid",
      description:
        "Receive your final offer based on the physical inspection. No hidden deductions.",
      detail: "Instant quote on the spot",
    },
    {
      number: 3,
      icon: "💵",
      iconBg: "bg-green-100",
      title: "Instant Payment",
      description:
        "Accept the offer and receive payment immediately via bank transfer or cash.",
      detail: "Direct to your account",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-14 w-full">
        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How CashMish Works
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sell your device in just 3 simple steps with complete transparency
            and instant payment.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm font-semibold text-gray-400">
                  Step {step.number}
                </div>
                <div
                  className={`w-14 h-14 ${step.iconBg} rounded-full flex items-center justify-center text-2xl`}
                >
                  {step.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {step.description}
              </p>
              <p className="text-blue-500 font-medium text-sm">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      
      </main>
    </div>
  );
};

export default HowItWorks;
