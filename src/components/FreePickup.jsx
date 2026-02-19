import React from 'react';
import Header from './header.jsx';
import Footer from './Footer.jsx';
import { MapPin, Shield, Zap, Clock, Package } from 'lucide-react';

const FreePickup = () => {
    return (
        <div className="min-h-screen bg-white selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
            <Header />

            <section className="pt-32 pb-24 px-6 relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 -z-10 translate-x-1/4 skew-x-12"></div>
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-[10px] font-black uppercase tracking-widest">
                            <MapPin size={12} /> Doorstep Experience
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                            Zero Hassle. <br />
                            <span className="text-green-600">Zero Travel.</span>
                        </h1>
                        <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                            We come to your office, home, or your favorite coffee shop. Fast verification and instant cash at your convenience.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="/brandselection" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-600 transition-all shadow-xl cursor-pointer">
                                Book a Pickup
                            </a>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 space-y-4 translate-y-8">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                    <Clock size={24} />
                                </div>
                                <h3 className="font-black text-gray-900 uppercase tracking-tight">Flexible Hours</h3>
                                <p className="text-xs text-gray-400 font-medium">Pickups scheduled from 9 AM to 9 PM, 7 days a week.</p>
                            </div>
                            <div className="bg-gray-900 p-8 rounded-[3rem] shadow-xl space-y-4 text-white">
                                <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                                    <Shield size={24} />
                                </div>
                                <h3 className="font-black uppercase tracking-tight">Insured Pickups</h3>
                                <p className="text-xs text-gray-400 font-medium">All transit and verification processes are fully insured.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">Safe & Simple Process</h2>
                        <p className="text-gray-500 font-medium max-w-lg mx-auto italic">How our logistics network handles your tech with care.</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: "Order", icon: <Package />, text: "Book your pickup by accepting an offer online." },
                            { step: "Assign", icon: <MapPin />, text: "Technician assigned to your area within 4 hours." },
                            { step: "Verify", icon: <Zap />, text: "Brief 5-minute physical audit at your location." },
                            { step: "Pay", icon: <Shield />, text: "Instant fund transfer before the technician leaves." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 text-center space-y-4 group">
                                <div className="w-16 h-16 bg-gray-50 text-gray-900 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                                    {React.cloneElement(item.icon, { size: 24 })}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">{item.step}</h4>
                                    <p className="text-sm font-bold text-gray-500">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* <Footer /> */}
        </div>
    );
};

export default FreePickup;
