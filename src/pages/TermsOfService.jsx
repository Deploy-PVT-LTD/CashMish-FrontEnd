import React from 'react';
import Header from '../components/layout/header';
import Chatbot from '../components/Chatbot';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />
            <Chatbot />
            <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
                <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter">
                    Terms of <span className="text-green-600">Service</span>
                </h1>

                <div className="prose prose-slate max-w-none space-y-8 text-gray-600 font-medium leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using CashMish, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">2. Selling Your Device</h2>
                        <p>
                            When you use our service to sell a device, you represent and warrant that you are the sole owner of the device and have the right to sell it. All descriptions provided must be accurate and truthful.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">3. Payouts</h2>
                        <p>
                            Payouts are processed once the device has been received and its condition verified by our team. We reserve the right to adjust the final offer if the device condition differs from your initial assessment.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">4. Prohibited Acts</h2>
                        <p>
                            You may not use our service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">5. Changes to Terms</h2>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your responsibility to check these Terms periodically for changes.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
