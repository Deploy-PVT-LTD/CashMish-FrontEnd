import React from 'react';
import Header from './header';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header simple={true} />
            <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
                <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter">
                    Privacy <span className="text-green-600">Policy</span>
                </h1>

                <div className="prose prose-slate max-w-none space-y-8 text-gray-600 font-medium leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">1. Introduction</h2>
                        <p>
                            At CashMish, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">2. Data We Collect</h2>
                        <p>
                            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                            <li><strong>Financial Data:</strong> includes bank account details for payouts.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">3. How We Use Your Data</h2>
                        <p>
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to process your trade-in requests, manage your account, and provide customer support.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">4. Data Security</h2>
                        <p>
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">5. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy or our privacy practices, please contact us at support@cashmish.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
