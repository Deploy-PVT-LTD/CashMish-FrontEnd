import React from 'react';
import Header from './header.jsx';
import Footer from './Footer.jsx';
import { Zap, Clock, Smartphone, Target, ArrowRight } from 'lucide-react';

const InstantQuote = () => {
    return (
        <div className="min-h-screen bg-white selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
            <Header />

            <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 bg-green-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                        <Clock size={12} /> Zero Waiting Time
                    </div>
                    <h1 className="text-[clamp(1.75rem,8vw,6rem)] font-black uppercase tracking-tighter leading-[0.85] md:leading-none break-words">
                        Instant <br /> <span className="text-green-900/40">Evaluation.</span>
                    </h1>
                    <p className="text-green-50 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        We provide a free, trackable prepaid shipping label so you can send your item(s) to us at no cost.                    </p>
                    <div className="pt-4">
                        <a href="/brandselection" className="bg-gray-900 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl inline-block cursor-pointer">
                            Start Appraisal
                        </a>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h3 className="text-green-600 text-xs font-black uppercase tracking-widest">How it works</h3>
                            <h2 className="text-[clamp(1.5rem,7vw,3.5rem)] font-black text-gray-900 uppercase tracking-tighter leading-[0.9] break-words">
                                Smart Pricing <br />
                                <span className="text-gray-400">Zero Negotiation.</span>
                            </h2>
                        </div>

                        <div className="space-y-8">
                            {[
                                { step: "01", title: "Select Device", desc: "Found your exact model from our database of 5,000+ variants." },
                                { step: "02", title: "Condition Audit", desc: "Select screen, body, and functional status in 5 quick taps." },
                                { step: "03", title: "Get Price", desc: "Our engine delivers an instant, non-obligatory cash quote." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start group">
                                    <span className="text-4xl font-black text-gray-100 group-hover:text-green-100 transition-colors uppercase tracking-tighter">{item.step}</span>
                                    <div>
                                        <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">{item.title}</h4>
                                        <p className="text-gray-500 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-gray-100 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="space-y-8 relative z-10">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">AI Appraisal Model v4.2</h3>
                            <div className="space-y-4">
                                {['Market Demand Analysis', 'Hardware Depreciation', 'Regional Pricing', 'Inventory Scarcity'].map((check, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="w-6 h-6 flex-shrink-0 bg-green-500 text-white rounded-lg flex items-center justify-center">
                                            <Target size={14} />
                                        </div>
                                        <span className="text-[11px] sm:text-sm font-bold text-gray-700 uppercase tracking-tight">{check}</span>
                                        <span className="ml-auto text-[9px] sm:text-[10px] font-black text-green-600">ACTIVE</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-gray-900 rounded-2xl text-white text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Our average spread</p>
                                <span className="text-3xl font-black tracking-tighter">± 3.2% of MSRP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <Footer /> */}
        </div>
    );
};

export default InstantQuote;
