import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';
import Header from '../components/layout/header.jsx';
import Footer from '../components/layout/Footer.jsx';

const faqs = [
    {
        question: "How do I sell my phone on CashMish?",
        answer: "Selling your phone is simple! Just select your brand, model, and condition. We'll give you an instant valuation. If you like the price, schedule a free pickup, and get paid instantly upon inspection."
    },
    {
        question: "What happens to my data?",
        answer: "Your privacy is our priority. We perform military-grade data wipes on every device we purchase to ensure your personal information is permanently deleted before the device is processed."
    },
    {
        question: "How long does the payment take?",
        answer: "Once our technician verifies the device condition at your doorstep, the payment is processed immediately via bank transfer or your preferred payment method."
    },
    {
        question: "What if my device is not listed?",
        answer: "If you can't find your device, don't worry! Contact our support team, and we'll provide a custom quote for you within 24 hours."
    },
    {
        question: "Is the pickup really free?",
        answer: "Yes, absolutely! We offer free doorstep pickup across all serviced locations. There are no hidden charges or convenience fees."
    }
];

export default function FAQs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [openIndex, setOpenIndex] = useState(null);

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            {/* Hero Section */}
            <section className="bg-gray-900 pt-32 pb-20 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6">
                        Frequently Asked <span className="text-green-500">Questions</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Everything you need to know about selling your devices with CashMish.
                    </p>

                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for questions..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-green-500 transition-all backdrop-blur-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-20 px-6 max-w-3xl mx-auto">
                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
                                >
                                    <span className=" font-bold text-gray-800 text-lg tracking-tight uppercase">
                                        {faq.question}
                                    </span>
                                    {openIndex === index ? (
                                        <ChevronUp className="text-green-500" size={20} />
                                    ) : (
                                        <ChevronDown className="text-gray-400" size={20} />
                                    )}
                                </button>
                                <div
                                    className={`px-6 transition-all duration-300 ease-in-out ${openIndex === index ? "pb-6 max-h-96 opacity-100" : "max-h-0 opacity-0"
                                        } overflow-hidden`}
                                >
                                    <p className="text-gray-500 leading-relaxed font-medium">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <HelpCircle className="mx-auto text-gray-300 mb-4" size={48} />
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No results found for "{searchTerm}"</p>
                        </div>
                    )}
                </div>

                {/* Contact Support CTA */}
                <div className="mt-12 p-8 bg-green-600 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Still have questions?</h3>
                        <p className="text-green-100 font-medium opacity-90 text-sm">Our support team is always ready to help you.</p>
                    </div>
                    <a
                        href="/contact"
                        className="relative z-10 flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-green-50 transition-colors shadow-lg"
                    >
                        Contact Support <ArrowRight size={14} />
                    </a>
                </div>
            </section>
        </div>
    );
}
