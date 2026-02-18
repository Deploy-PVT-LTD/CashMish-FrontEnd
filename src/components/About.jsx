import React from 'react';
import { Target, Users, Award, CheckCircle2, TrendingUp, ShieldCheck, Rocket, Zap, Heart } from 'lucide-react';
import Header from "../components/header.jsx";
import Footer from "../components/Footer.jsx";
import imgg from "../assets/image-removebg-preview.png";

export default function AboutUs() {
  const stats = [
    { label: 'Successful Auctions', value: '5k+', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Active Sellers', value: '12k+', icon: <Users className="w-4 h-4" /> },
    { label: 'Countries Covered', value: '1', icon: <Rocket className="w-4 h-4" /> },
    { label: 'Rating', value: '4.9/5', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-green-100 selection:text-green-900">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gray-900 text-white">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest mb-8">
            <Heart size={12} fill="currentColor" />
            Trusted by thousands
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none">
            We are <span className="text-green-500">CashMish.</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl max-w-2xl font-medium leading-relaxed">
            Reimagining the device lifecycle. We turn your old tech into instant capital through AI-driven valuations and a seamless logistics network.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center lg:items-start space-y-2">
                <div className="text-green-600 mb-2">{stat.icon}</div>
                <div className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-green-600 text-xs font-black uppercase tracking-[0.2em]">Our Values</h3>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-[0.9]">
                Transparency is <br />
                <span className="text-gray-400">Our strongest currency.</span>
              </h2>
            </div>

            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              At CashMish, we believe every device has a story and a value. Our mission is to ensure you get the most accurate valuation without the headache of negotiation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-lg hover:border-green-500/30 transition-all group">
                <Zap className="text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-black text-gray-900 mb-2 uppercase text-sm tracking-tight">Instant Action</h4>
                <p className="text-xs text-gray-400 font-medium">Valuations in seconds, payments in minutes. We value your time as much as your tech.</p>
              </div>
              <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-lg hover:border-green-500/30 transition-all group">
                <ShieldCheck className="text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-black text-gray-900 mb-2 uppercase text-sm tracking-tight">Military Privacy</h4>
                <p className="text-xs text-gray-400 font-medium">Your data security is paramount. We ensure every device is wiped before processing.</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-green-500/20 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 p-8 aspect-square flex items-center justify-center">
              <img
                src={imgg}
                alt="Our Operations"
                className="w-full h-full object-contain rotate-6 hover:rotate-0 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Middle Banner */}
      <section className="py-20 bg-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-8">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">"Your tech doesn't belong in a drawer, it belongs in the economy."</h2>
          <div className="h-1 lg:w-32 bg-white/30 mx-auto"></div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
}
