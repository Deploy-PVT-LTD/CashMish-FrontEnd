import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowRight, Send } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 pt-6 pb-4 font-sans overflow-hidden relative border-t border-gray-800">
            {/* Decorative Gradient Blob */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

                    {/* Column 1: Brand & About */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 group cursor-default">
                            <div className="bg-green-600 p-1 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                                <Smartphone className="text-white" size={18} />
                            </div>
                            <span className="text-lg font-black text-white uppercase tracking-tighter">
                                Cash<span className="text-green-500">Mish</span>
                            </span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-gray-400 font-medium max-w-xs">
                            The smartest way to sell your old devices. Instant valuations,
                            secure pickups, and lightning-fast payouts.
                        </p>
                        <div className="flex items-center gap-2">
                            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
                                <a key={idx} href="#" className="p-1.5 bg-gray-800 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300">
                                    <Icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-3">
                        <h4 className="text-white font-black uppercase tracking-widest text-[9px] opacity-40">Quick Links</h4>
                        <ul className="space-y-1.5">
                            {['Home', 'How It Works', 'About Us', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : item === 'About Us' ? '/about' : `/${item.toLowerCase().replace(/\s+/g, '')}`}
                                        className="group flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors font-semibold text-[11px]"
                                    >
                                        <ArrowRight size={8} className="hidden group-hover:inline opacity-50" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Services */}
                    <div className="space-y-3">
                        <h4 className="text-white font-black uppercase tracking-widest text-[9px] opacity-40">Our Services</h4>
                        <ul className="space-y-1.5">
                            {['Sell Mobile', 'Instant Quote', 'Free Pickup', 'Bulk Selling'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors font-semibold text-[11px]">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Get In Touch */}
                    <div className="space-y-3">
                        <h4 className="text-white font-black uppercase tracking-widest text-[9px] opacity-40">Get In Touch</h4>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <MapPin size={12} className="text-green-500 mt-0.5 shrink-0" />
                                <span className="text-[11px] font-medium text-gray-400">Silicon Valley, California, USA</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={12} className="text-green-500 shrink-0" />
                                <a href="tel:+1234567890" className="text-[11px] font-medium text-gray-400 hover:text-green-500 transition-colors">+1 (234) 567-890</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={12} className="text-green-500 shrink-0" />
                                <a href="mailto:support@cashmish.com" className="text-[11px] font-medium text-gray-400 hover:text-green-500 transition-colors">support@cashmish.com</a>
                            </li>
                        </ul>

                        {/* Compact Subscription Form */}
                        <div className="pt-2">
                            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Get updates"
                                    className="flex-1 min-w-0 bg-gray-800/50 border border-gray-700 rounded-md px-2 py-1.5 text-[10px] font-semibold focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-600"
                                />
                                <button className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-md transition-all">
                                    <Send size={12} />
                                </button>
                            </form>
                        </div>
                    </div>

                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gray-800/50 mb-4"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">
                        © {currentYear} CashMish. <span className="hidden sm:inline">License: CM-2024-8892</span>
                    </p>
                    <div className="flex gap-4">
                        <Link to="/privacy" className="text-[9px] font-black uppercase text-gray-500 hover:text-green-500 transition-colors tracking-widest">Privacy</Link>
                        <Link to="/terms" className="text-[9px] font-black uppercase text-gray-500 hover:text-green-500 transition-colors tracking-widest">Terms</Link>
                        <Link to="/cookies" className="text-[9px] font-black uppercase text-gray-500 hover:text-green-500 transition-colors tracking-widest">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
