import React from "react";
import { useEffect, useState } from "react";
import Header from "../components/header.jsx";

const HowItWorks = () => {

  const steps = [
    {
      number: "01",
      icon: "📍",
      iconBg: "bg-green-100 text-green-700",
      title: "Doorstep Inspection",
      description:
        "Our expert visits your location at a time convenient for you to verify your device condition.",
      detail: "Usually within 24–48 hours",
    },
    {
      number: "02",
      icon: "✅",
      iconBg: "bg-green-100 text-green-700",
      title: "Final Bid",
      description:
        "Receive your final offer based on physical inspection with zero hidden deductions.",
      detail: "Instant quote on the spot",
    },
    {
      number: "03",
      icon: "💵",
      iconBg: "bg-green-100 text-green-700",
      title: "Instant Payment",
      description:
        "Accept the offer and get paid immediately via bank transfer or cash.",
      detail: "Direct to your account",
    },
  ];

  const text = "CashMish";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, index + 1));
      index++;
      if (index === text.length) clearInterval(interval);
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="text-center px-4 py-8 md:py-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            How <span className="text-green-800">CashMish</span> Works
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Sell your device in just three simple steps with full transparency
            and instant payment.
          </p>
        </section>

        {/* Steps Section */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-semibold text-gray-400">
                    Step {step.number}
                  </span>
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${step.iconBg}`}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {step.description}
                </p>
                <p className="text-sm font-medium text-green-700">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HowItWorks;
