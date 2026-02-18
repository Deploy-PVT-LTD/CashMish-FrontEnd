import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowRight } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 font-sans overflow-hidden relative border-t border-gray-800">
            {/* Decorative Gradient Blob */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

                    {/* Column 1: Brand & About */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 group cursor-default">
                            <div className="bg-green-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                                <Smartphone className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-black text-white uppercase tracking-tighter">
                                Cash<span className="text-green-500">Mish</span>
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed text-gray-400 font-medium max-w-xs">
                            The smartest way to sell your old devices. Instant valuations,
                            secure pickups, and lightning-fast payouts.
                        </p>
                        <div className="flex items-center gap-3">
                            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
                                <a key={idx} href="#" className="p-1.5 bg-gray-800 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-white font-black uppercase tracking-widest text-[10px] opacity-50">Quick Links</h4>
                        <ul className="space-y-2">
                            {['Home', 'How It Works', 'About Us', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '')}`}
                                        className="group flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors font-semibold text-xs"
                                    >
                                        <ArrowRight size={10} className="hidden group-hover:inline transition-all duration-300" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Services */}
                    <div className="space-y-4">
                        <h4 className="text-white font-black uppercase tracking-widest text-[10px] opacity-50">Our Services</h4>
                        <ul className="space-y-2">
                            {['Sell Mobile', 'Instant Quote', 'Free Pickup', 'Bulk Selling'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors font-semibold text-xs">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-white font-black uppercase tracking-widest text-[10px] opacity-50">Get In Touch</h4>
                        <ul className="space-y-2.5">
                            <li className="flex items-start gap-2">
                                <MapPin size={14} className="text-green-500 mt-0.5 shrink-0" />
                                <span className="text-xs font-medium text-gray-400">
                                    123 Tech Avenue, Silicon Valley, CA
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={14} className="text-green-500 shrink-0" />
                                <a href="tel:+1234567890" className="text-xs font-medium text-gray-400 hover:text-green-500 transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="text-green-500 shrink-0">
                                    <Mail size={14} />
                                </div>
                                <a href="mailto:support@cashmish.com" className="text-xs font-medium text-gray-400 hover:text-green-500 transition-colors">
                                    support@cashmish.com
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Divider */}
                <div className="h-px w-full bg-gray-800 mb-6"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                            © {currentYear} CashMish. <span className="hidden sm:inline">All rights reserved.</span>
                            <span className="mx-2 text-gray-700">|</span>
                            License: CM-2024-8892
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/privacy" className="text-[9px] font-black uppercase text-gray-500 hover:text-green-500 transition-colors tracking-widest">Privacy Policy</Link>
                        <Link to="/terms" className="text-[9px] font-black uppercase text-gray-500 hover:text-green-500 transition-colors tracking-widest">Terms of Service</Link>
                        <Link to="/cookies" className="text-[9px] font-black uppercase text-gray-500 hover:text-green-500 transition-colors tracking-widest">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
