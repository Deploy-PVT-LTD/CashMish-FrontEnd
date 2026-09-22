import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap, DollarSign, Truck, ShieldCheck, Clock, Heart, Star, Users, Award,
  ArrowRight, Leaf, MessageCircle, Check,
} from "lucide-react";
import Header from "../components/layout/header.jsx";
import Chatbot from "../components/Chatbot.jsx";

const REASONS = [
  {
    icon: Zap,
    title: "Instant Price Quote",
    desc: "Get a real, data-driven valuation for your device in under 60 seconds — no waiting, no back-and-forth.",
  },
  {
    icon: DollarSign,
    title: "Highest Market Offers",
    desc: "We price against live market data to make sure you're getting a fair, competitive offer — not a lowball one.",
  },
  {
    icon: Truck,
    title: "Free Shipping & Pickup",
    desc: "A prepaid shipping label, on us. No hidden shipping fees, no cost to you to send your device in.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-Level Data Security",
    desc: "We follow industry-leading data deletion processes to ensure your personal information is completely wiped from your device.",
  },
  {
    icon: Clock,
    title: "Fast, Reliable Payment",
    desc: "Once your device is verified, payment goes out right away — no delays, no chasing us for your money.",
  },
  {
    icon: Check,
    title: "No Hidden Fees",
    desc: "The price we quote is the price you get. No surprise deductions after the fact, ever.",
  },
  {
    icon: Leaf,
    title: "Better for the Planet",
    desc: "Every device we take in gets a second life instead of ending up as e-waste — same devices, a brighter tomorrow.",
  },
  {
    icon: MessageCircle,
    title: "Real Support, Real People",
    desc: "Questions at any step? Our support team is a chat away, not a maze of automated menus.",
  },
];

const STATS = [
  { icon: Star, value: "4.8/5", label: "Customer rating" },
  { icon: Users, value: "10,000+", label: "Devices purchased" },
  { icon: DollarSign, value: "$2.3M+", label: "Paid to customers" },
  { icon: Award, value: "100%", label: "Secure & verified" },
];

const WhyCashMish = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-green-100 selection:text-green-900">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gray-900 text-white">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black tracking-widest mb-8">
            <Heart size={12} fill="currentColor" />
            Trusted by thousands
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
            Why <span className="text-green-500">CashMish?</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl max-w-2xl font-medium leading-relaxed">
            Skip the hassle of marketplaces and untrusted dealers. Here's exactly why thousands of sellers trust us with their devices.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col items-center lg:items-start space-y-2">
                <div className="text-green-600 mb-2"><stat.icon className="w-4 h-4" /></div>
                <div className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                <div className="text-[10px] font-bold text-gray-400 tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reasons Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h3 className="text-green-600 text-xs font-black tracking-[0.2em]">Our Promise</h3>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            Everything that makes us different.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map((reason, i) => (
            <div
              key={i}
              className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-green-200 transition-all group"
            >
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all">
                <reason.icon className="w-5 h-5" />
              </div>
              <h4 className="font-black text-gray-900 mb-2 text-sm tracking-tight">{reason.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{reason.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6 max-w-4xl mx-auto text-center">
        <div className="bg-gray-900 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
              Ready to turn your old tech into cash?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Get your instant offer in less than 60 seconds — no strings attached.
            </p>
            <button
              onClick={() => navigate("/categoryselection")}
              className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-4 rounded-full inline-flex items-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              Get My Cash Offer
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <Chatbot />
    </div>
  );
};

export default WhyCashMish;
