import React from 'react';
import Header from './header';

const CookiePolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header simple={true} />
            <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
                <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter">
                    Cookie <span className="text-green-600">Policy</span>
                </h1>

                <div className="prose prose-slate max-w-none space-y-8 text-gray-600 font-medium leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">1. What Are Cookies</h2>
                        <p>
                            Cookies are small segments of data stored on your device that help us provide a better user experience and analyze our website traffic.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">2. How We Use Cookies</h2>
                        <p>
                            We use cookies for various reasons documented below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">3. Types of Cookies We Use</h2>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li><strong>Essential Cookies:</strong> Necessary for the website to function correctly (e.g., login sessions).</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the website.</li>
                            <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider">4. Managing Cookies</h2>
                        <p>
                            You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
