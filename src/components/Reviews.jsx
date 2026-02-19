import React from 'react';
import { Star, Quote, Heart, CheckCircle, Users, Award } from 'lucide-react';
import Header from './header.jsx';
import Footer from './Footer.jsx';

const Reviews = () => {
    const reviews = [
        {
            name: "Alex Johnson",
            role: "iPhone 13 Pro Seller",
            content: "The process was incredibly smooth. I got a fair price and the payment was instant as promised. Highly recommend CashMish!",
            rating: 5,
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
        },
        {
            name: "Sarah Williams",
            role: "Samsung S21 Ultra User",
            content: "I was hesitant at first, but the doorstep inspection was professional and quick. No hidden deductions at all.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
        },
        {
            name: "Michael Chen",
            role: "MacBook Pro M1 Seller",
            content: "Best platform to sell old tech. Transparent valuation and great customer support throughout the process.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
        },
        {
            name: "Emily Davis",
            role: "Google Pixel 6 Seller",
            content: "Simple, honest, and efficient. Sold my phone within 24 hours of posting. Exceptional service!",
            rating: 4,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
        },
        {
            name: "James Wilson",
            role: "iPad Pro Seller",
            content: "CashMish made it so easy. The technician was friendly and I got my payment via bank transfer immediately.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
        },
        {
            name: "Olivia Brown",
            role: "Apple Watch Seller",
            content: "Quickest valuation I've ever experienced. The entire cycle from listing to payment was less than 48 hours.",
            rating: 5,
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
        }
    ];

    const stats = [
        { label: 'Happy Customers', value: '10k+', icon: <Users size={20} /> },
        { label: 'Average Rating', value: '4.9/5', icon: <Star size={20} /> },
        { label: 'Fast Payments', value: '100%', icon: <Award size={20} /> }
    ];

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-gray-900 text-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] -translate-y-1/2"></div>
                </div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest mb-8">
                        <Heart size={12} fill="currentColor" />
                        Customer Sentiments
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none">
                        What They <span className="text-green-500">Say.</span>
                    </h1>
                    <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Real stories from real users. See how we're changing the way people sell their old devices, one transaction at a time.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-20 max-w-5xl mx-auto px-4 -mt-10">
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {stats.map((stat, i) => (
                        <div key={i} className="space-y-2">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Reviews Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <div key={i} className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative flex flex-col h-full">
                            <div className="absolute -top-4 -right-4 bg-green-500 text-white p-4 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <Quote size={20} fill="currentColor" />
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                                ))}
                            </div>

                            <p className="text-gray-600 font-medium leading-relaxed italic mb-8 flex-grow">
                                "{review.content}"
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-gray-50 mt-auto">
                                <img src={review.image} alt={review.name} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all shadow-sm" />
                                <div>
                                    <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm">
                                        {review.name}
                                        <CheckCircle size={12} className="inline-block ml-1 text-green-500 fill-green-500/10" />
                                    </h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="pb-24 px-6 max-w-4xl mx-auto text-center">
                <div className="bg-gray-900 rounded-[3rem] p-12 md:p-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                            Share Your <br /> <span className="text-green-500">Experience.</span>
                        </h2>
                        <p className="text-gray-400 font-medium max-w-sm mx-auto">
                            Sold your device already? Let others know how it went. We value every feedback.
                        </p>
                        <div className="pt-4">
                            <button className="bg-white text-gray-900 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-500 hover:text-white transition-all shadow-xl cursor-pointer">
                                Write a Review
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* <Footer /> */}
        </div>
    );
};

export default Reviews;
