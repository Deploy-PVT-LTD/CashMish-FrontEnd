import React from 'react';
import Header from './header.jsx';
import Footer from './Footer.jsx';
import { Smartphone, Zap, Shield, DollarSign, CheckCircle2 } from 'lucide-react';

const SellMobile = () => {
    return (
        <div className="min-h-screen bg-white selection:bg-green-100 selection:text-green-900">
            <Header />

            <section className="pt-32 pb-24 px-6 bg-gray-900 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest">
                            <Smartphone size={12} /> Sell with confidence
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                            Get the Best  <span className="text-green-500">Value</span> For Your Phone.
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
                           We use real-time market data to ensure you get the best price for your smartphone, with instant payment and convenient doorstep pickup.
                        </p>
                        <div className="pt-4">
                            <a href="/brandselection" className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-500 transition-all shadow-xl inline-block cursor-pointer">
                                Sell My Phone Now
                            </a>
                        </div>
                    </div>
                    <div className="relative hidden lg:block">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-[120px]"></div>
                        <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 overflow-hidden group">
                            <div className="space-y-6">
                                {[
                                    { label: 'Market Value', val: '$840.00', color: 'text-green-500' },
                                    { label: 'Local Shop Offer', val: '$620.00', color: 'text-red-400' },
                                    { label: 'CashMish Offer', val: '$890.00', color: 'text-green-400 font-black' },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{row.label}</span>
                                        <span className={`text-xl ${row.color}`}>{row.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">Why Choose CashMish?</h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto">Skip the hassle of marketplaces and untrusted dealers. We offer a direct, safe way to sell tech.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        { icon: <Zap />, title: "Instant Price Estimate", desc: "Accurate valuation in seconds." },
                        { icon: <DollarSign />, title: "Highest Market Offers", desc: "We maximize your payout." },
                        { icon: <Shield />, title: "Fast & Hassle-Free Payment", desc: "No delays. No complications. " }
                    ].map((feat, i) => (
                        <div key={i} className="space-y-6 p-8 rounded-[2rem] border border-gray-100 hover:shadow-2xl transition-all group">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                {React.cloneElement(feat.icon, { size: 24 })}
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{feat.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* <Footer /> */}
        </div>
    );
};

export default SellMobile;
