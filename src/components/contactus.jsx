import React, { useState } from 'react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import Header from "../components/header.jsx";
import { BASE_URL } from '../api/api';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Failed to send.' });
      }
    } catch {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-white flex flex-col font-sans text-slate-900 overflow-x-hidden">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto">

        {/* LEFT */}
        <div className="w-full lg:w-[40%] p-6 sm:p-10 md:p-16 lg:p-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-green-100 bg-white">
          <span className="text-green-700 font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">
            Connect
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-none mb-6">
            Let’s <br className="hidden sm:block" />
            <span className="text-green-800">Talk.</span>
          </h1>

          <p className="text-slate-500 text-base sm:text-lg mb-10 max-w-xs font-medium">
            Have a question? Our team is here to help you 24/7.
          </p>

          <div className="space-y-8">
            <ContactInfoItem icon={<Phone size={18} />} label="Call us" value="+8801797794888" />
            <ContactInfoItem icon={<Mail size={18} />} label="Email" value="support@cashmish.com" />
            <ContactInfoItem icon={<MapPin size={18} />} label="Office" value="New York, USA" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 bg-green-50/50 p-6 sm:p-10 md:p-16 lg:p-24 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="max-w-xl w-full mx-auto space-y-6">

            {submitStatus.message && (
              <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${submitStatus.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-100'
                : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                {submitStatus.message}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              <InputBlock label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" disabled={isSubmitting} />
              <InputBlock label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="hello@cashmish.com" disabled={isSubmitting} />
            </div>

            <InputBlock label="Subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Quotation Inquiry" disabled={isSubmitting} />

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help?"
                rows="4"
                disabled={isSubmitting}
                required
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm
                focus:outline-none focus:ring-4 focus:ring-green-700/10 focus:border-green-700
                transition-all resize-none disabled:opacity-50 shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-800 hover:bg-green-700 text-white font-bold uppercase tracking-widest
              text-xs py-5 rounded-2xl flex items-center justify-center gap-3
              active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl mt-4 cursor-pointer"
            >
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

/* HELPERS */

const ContactInfoItem = ({ icon, label, value }) => (
  <div className="group flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center
      group-hover:bg-green-800 group-hover:text-white transition-all shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-green-800">{value}</p>
    </div>
  </div>
);

const InputBlock = ({ label, name, type = "text", value, onChange, placeholder, disabled }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required
      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm
      focus:outline-none focus:ring-4 focus:ring-green-700/10 focus:border-green-700
      transition-all disabled:opacity-50 shadow-sm"
    />
  </div>
);

const FooterLink = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-green-700 transition-colors"
  >
    {label}
  </a>
);
