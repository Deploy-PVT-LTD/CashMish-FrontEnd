import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import Header from "../components/header.jsx";
import linkedinlogo from "../assets/linkedin-logo.svg";
import fblogo from "../assets/fb-logo.svg";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    // lg:h-screen desktop par height fix rakhega, lekin mobile par auto height allow karega
    // overflow-y-auto zaroori hai taake mobile par scroll ho sake
    <div className="min-h-screen lg:h-screen flex flex-col overflow-y-auto lg:overflow-hidden bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 lg:py-0">
        <div className="max-w-5xl w-full">
          
          <div className="text-center mb-4 lg:mb-6 animate-fade-in">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
              Get In Touch
            </h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-slide-up">
            <div className="grid lg:grid-cols-5">
              
              {/* Left Side - Info */}
              <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-cyan-600 p-6 sm:p-8 text-white relative">
                <div className="relative z-10">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    Contact Information
                  </h2>
                  <p className="text-blue-100 mb-6 sm:mb-10 text-xs sm:text-sm">
                    Fill up the form and our Team will get back to you within 24 hours.
                  </p>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="text-sm sm:text-base font-medium">+8801797794888</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="text-sm sm:text-base font-medium">Support@cashmish.com</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="text-sm sm:text-base font-medium">New York, USA</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="lg:col-span-3 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Your Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="hello@cashmish.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Quotation Inquiry"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3" 
                      placeholder="Write your message here..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm resize-none"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Footer Area */}
          <div className="mt-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex gap-4">
              <a href="/terms" className="hover:text-blue-600">Terms</a>
              <a href="/privacy-policy" className="hover:text-blue-600">Privacy</a>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-6 cursor-pointer"><a href="https://www.linkedin.com/"><img src={linkedinlogo} alt="Linked" /></a></div>
              <div className="w-5 h-6 cursor-pointer"><a href="https://www.facebook.com/"><img src={fblogo} alt="Facebook" /></a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}