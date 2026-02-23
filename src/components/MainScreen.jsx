import React, { useState, useEffect } from "react";
import phoneMockup from "../assets/image-removebg-preview.png";
import mobileimg from "../assets/iphones-cashmish-png.png"
import { Smartphone, Shield, Zap } from "lucide-react";
import Header from "../components/header.jsx";
import AboutUs from "./About.jsx";

const PhoneFlipLanding = () => {
  const fullText = "Sell Your Phone at the Best Price";
  const [displayText, setDisplayText] = useState("");

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 70);
    return () => clearInterval(interval);
  }, []);

  // Color "Price"
  const renderText = () => {
    const parts = displayText.split(" ");
    return parts.map((word, i) =>
      word === "Price" ? (
        <span key={i} className="text-green-700">
          {word}{" "}
        </span>
      ) : (
        word + " "
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-x-hidden">
      <Header />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-6 pb-24 lg:pt-8 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">

          {/* LEFT */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {renderText()}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Get instant Real-time market-based valuation for your device. Enjoy quick doorstep pickup and guaranteed payment.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="/brandselection"
                className="bg-green-800 text-white px-4 py-2 lg:py-3 rounded-lg font-medium text-sm flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                Sell Your Device
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>

              <a
                href="/howitworks"
                className="bg-white text-gray-700 px-4 py-2 lg:py-3 rounded-lg border border-gray-200 font-medium text-sm flex items-center justify-center hover:border-gray-300 transition-colors"
              >
                How It Works
              </a>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 pt-8">
              <Feature icon={<Zap />} text="Instant price quote" />
              <Feature icon={<Shield />} text="Secure transaction" />
              <Feature icon={<Smartphone />} text="Multiple brands accepted" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center lg:mt-8">

            {/* Verified Badge */}
            <div className="absolute top-6 -left-2 lg:left-8 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center space-x-3 z-20 animate-pulse">
              {/* Maine 'top-8' ko badal kar 'top-2' kar diya hai taake ye upar chala jaye */}
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Verified</div>
                <div className="text-xs text-gray-600">100% Secure</div>
              </div>
            </div>

            {/* PHONE CARD WITH ANIMATED BG */}
            {/* PHONE CARD SECTION */}
            {/* flex-center hata kar lg:justify-start kiya hai taake left side pe alignment ho jaye */}
            <div className="relative mt-16 lg:mt-0 flex justify-center items-center lg:translate-x-8">

              {/* Green Card */}
              <div
                className="relative rounded-[3rem] shadow-2xl
             w-52 sm:w-72 lg:w-80
             h-[340px] sm:h-[400px] lg:h-[480px]
             bg-gradient-to-br from-green-600 via-green-900 to-green-800
             animate-phone-card"
              >
                {/* Image — overflow-visible so it pops out of the card */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ overflow: 'visible' }}>
                  <img
                    src={mobileimg}
                    alt="phones spread"
                    className="w-[170%] sm:w-[140%] lg:w-[170%] max-w-none h-auto
                 transform lg:translate-x-8 -translate-y-4 lg:-translate-y-6
                 transition-all duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="absolute -bottom-12 -right-4 bg-white rounded-xl shadow-lg px-6 py-4">
                <div className="w-12 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">$45,000+</div>
                  <div className="text-xs text-gray-600">Phones Sold</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <AboutUs />
    </div>
  );
};

const Feature = ({ icon, text }) => (
  <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-green-200 group cursor-default">
    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-green-600 transition-colors">
      {React.cloneElement(icon, { className: "w-5 h-5 text-green-600 group-hover:text-white transition-colors" })}
    </div>
    <span className="text-gray-700 font-bold text-sm tracking-tight">{text}</span>
  </div>
);

export default PhoneFlipLanding;
