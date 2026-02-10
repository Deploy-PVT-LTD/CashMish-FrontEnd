import React from 'react';
import { Target, Users, Award, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import Header from "../components/header.jsx";
import imgg from "../assets/image-removebg-preview.png";

export default function AboutUs() {
  const stats = [
    { label: 'Projects Done', value: '500+', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Happy Clients', value: '200+', icon: <Users className="w-4 h-4" /> },
    { label: 'Units Processed', value: '10k+', icon: <CheckCircle2 className="w-4 h-4" /> },
    { label: 'Expert Team', value: '15+', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] overflow-x-hidden font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 bg-slate-900 text-white overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-green-800/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-green-700/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium uppercase bg-green-800/10 border border-green-700/20 rounded-full text-green-700">
            Who We Are
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500">
              Journey
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto">
            CashMish was founded to redefine how you upgrade your tech. We provide a seamless alternative for turning surplus electronics into instant value.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto w-full -mt-12 px-6 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center hover:-translate-y-1 transition-all"
            >
              <div className="p-3 bg-green-100 rounded-xl text-green-800 mb-3 hover:bg-green-800 hover:text-white transition-colors">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-800 text-sm font-bold uppercase">
              <Target className="w-4 h-4" />
              Our Mission
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Value Driven Results & <br />
              <span className="text-green-800">Transparent Pricing</span>
            </h2>

            <p className="text-slate-600 text-lg">
              We ensure our customers receive the best market value through a fair and professional inspection process.
            </p>

            <div className="space-y-4">
              {[
                'Guaranteed Professional Inspection',
                'Transparent Payout Adjustments',
                'End-to-End Customer Support'
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-800" />
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-green-100 to-green-200 rounded-[2rem] -rotate-2"></div>

            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <div className="bg-white p-6 rounded-2xl shadow-md">
                  <Users className="w-8 h-8 text-green-800 mb-3" />
                  <h3 className="font-bold text-slate-800">Expert Team</h3>
                  <p className="text-xs text-slate-500">Certified technicians</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md">
                  <ShieldCheck className="w-8 h-8 text-green-700 mb-3" />
                  <h3 className="font-bold text-slate-800">Secure Process</h3>
                  <p className="text-xs text-slate-500">Your data is safe</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl shadow-inner flex items-center justify-center p-4">
                <img
                  src={imgg}
                  alt="Tech"
                  className="w-full object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      <footer className="py-12 border-t bg-white text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} CashMish. Empowering your tech journey.
      </footer>
    </div>
  );
}
