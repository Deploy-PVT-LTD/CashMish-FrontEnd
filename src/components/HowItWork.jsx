import React, { useEffect, useState } from "react";
import { X, ArrowRight, Zap, Target, ShieldCheck, Truck, DollarSign } from "lucide-react";
import Header from "../components/header.jsx";
import Footer from "../components/Footer.jsx";

const HowItWorks = () => {

  const [selectedStep, setSelectedStep] = useState(null);

  const steps = [
    {
      number: "01",
      icon: <Target size={24} />,
      iconBg: "bg-green-100 text-green-700",
      title: "Doorstep Inspection",
      description: "Our expert visits your location at a time convenient for you to verify your device condition.",
      detail: "Usually within 24–48 hours",
      fullContent: "Once you schedule an appointment through our platform, a certified CashMish technician will visit your home or office. We perform a comprehensive 20-point diagnostic check to verify everything from screen functionality to battery health. This process ensures both the buyer and seller are on the same page, leading to a fair and transparent final valuation."
    },
    {
      number: "02",
      icon: <ShieldCheck size={24} />,
      iconBg: "bg-green-100 text-green-700",
      title: "Final Bid",
      description: "Receive your final offer based on physical inspection with zero hidden deductions.",
      detail: "Instant quote on the spot",
      fullContent: "After the inspection, our technician will provide an instant final bid. This price is calculated using our AI-driven market data, ensuring you get the most competitive value. There are no hidden fees or surprise deductions; the price we quote is exactly what you receive. You are under no obligation to accept the offer until you are completely satisfied."
    },
    {
      number: "03",
      icon: <DollarSign size={24} />,
      iconBg: "bg-green-100 text-green-700",
      title: "Instant Payment",
      description: "Accept the offer and get paid immediately via bank transfer or cash.",
      detail: "Secure & Reliable",
      fullContent: "The moment you accept our final bid, we initiate the payment process. We offer multiple payout methods including instant bank transfers and digital wallets. While 'instant' usually means within minutes for digital platforms, bank transfers may take a few hours depending on your bank's processing. We also provide a digital receipt for every transaction, ensuring a paper trail for your records."
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full selection:bg-green-100 selection:text-green-900">
        {/* Hero Section */}
        <section className="text-center px-6 py-16 md:py-24 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter leading-none">
              How <span className="text-green-500">{displayText}</span> Works
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-xl font-medium leading-relaxed">
              Sell your device in just three simple steps with full transparency
              and secure payment processing.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group bg-white rounded-3xl border border-gray-100 p-10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-[4rem] group-hover:scale-150 transition-transform duration-700"></div>

                {/* Top */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-black text-gray-300 uppercase tracking-widest">
                    Step {step.number}
                  </span>
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/10 transition-transform group-hover:rotate-12 ${step.iconBg}`}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight group-hover:text-green-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-6 italic">
                  "{step.description}"
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
                    {step.detail}
                  </span>
                  <button
                    onClick={() => setSelectedStep(step)}
                    className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all cursor-pointer"
                  >
                    Read More <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      {selectedStep && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] max-w-xl w-full p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setSelectedStep(null)}
              className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl">
                  {selectedStep.icon}
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {selectedStep.number}</span>
                  <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">{selectedStep.title}</h3>
                </div>
              </div>
              <div className="h-1 w-20 bg-green-500 rounded-full"></div>
              <p className="text-gray-600 leading-relaxed font-medium text-lg">
                {selectedStep.fullContent}
              </p>
              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  <Zap size={14} className="text-green-500" />
                  CashMish Process
                </div>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-green-600 transition-colors shadow-lg cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <Footer /> */}
    </div>
  );
};

export default HowItWorks;
