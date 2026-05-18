import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Award, CheckCircle2, TrendingUp, ShieldCheck, Rocket, Zap, Heart, ArrowRight, X, Star, Volume2, VolumeX } from 'lucide-react';
import Header from "../components/layout/header.jsx";
import Footer from "../components/layout/Footer.jsx";
import cashmishbanner from "../assets/cashmish_banner1.webp";
import { BASE_URL } from '../lib/api';
import Chatbot from '../components/Chatbot.jsx';

// Cleans Microsoft Word HTML garbage (<o:p>, MsoNormal, &nbsp; spam, etc.)
const sanitizeWordHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<o:p>.*?<\/o:p>/gi, '')
    .replace(/<\/o:p>/gi, '')
    .replace(/<o:p>/gi, '')
    .replace(/class="Mso[^"]*"/gi, '')
    .replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<span[^>]*>\s*<\/span>/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export default function AboutUs({ isPage = false }) {
  const [marqueeReviews, setMarqueeReviews] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/reviews/approved`);
        if (res.ok) {
          const data = await res.json();
          setMarqueeReviews(data.slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/blogs/published`);
        if (res.ok) {
          const data = await res.json();
          setBlogs((data.blogs || data).slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }
    };
    fetchReviews();
    fetchBlogs();
  }, []);

  const stats = [
    { label: 'Successful Deals', value: '5k+', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Active sellers', value: '12k+', icon: <Users className="w-4 h-4" /> },
    { label: 'Country covered', value: '1', icon: <Rocket className="w-4 h-4" /> },
    { label: 'Rating', value: '4.9/5', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-green-100 selection:text-green-900">
      {isPage && <Header />}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gray-900 text-white">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black tracking-widest mb-8">
            <Heart size={12} fill="currentColor" />
            Trusted by thousands
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
            We are <span className="text-green-500">CashMish.</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl max-w-2xl font-medium leading-relaxed">
            Unlock the true market value of your devices with an instant, data-driven valuation and enjoy a seamless, hassle-free  shipping process and payment experience.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center lg:items-start space-y-2">
                <div className="text-green-600 mb-2">{stat.icon}</div>
                <div className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                <div className="text-[10px] font-bold text-gray-400 tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-green-600 text-xs font-black tracking-[0.2em]">Our Values</h3>
              <h2 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Transparency is <br />
                <span className="text-gray-400">Our Strongest Currency.</span>
              </h2>
            </div>

            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              At CashMish, we believe every device has a unique story and value. Our mission is to provide you with the most accurate quote without the hassle of negotiation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-lg hover:border-green-500/30 transition-all group">
                <Zap className="text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-black text-gray-900 mb-2 text-sm tracking-tight">Instant Action</h4>
                <p className="text-xs text-gray-400 font-medium">Valuations in seconds. Payments in minutes. We value your time as much as we value your tech.</p>
              </div>
              <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-lg hover:border-green-500/30 transition-all group">
                <ShieldCheck className="text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-black text-gray-900 mb-2 text-sm tracking-tight">Privacy</h4>
                <p className="text-xs text-gray-400 font-medium">Your data security is fully protected. We ensure every device is securely wiped before processing.</p>
              </div>
            </div>
          </div>

          <div className="relative group cursor-pointer" onClick={() => window.open(cashmishbanner, '_blank')}>
            <div className="absolute -inset-1 bg-green-500/20 blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gray-900 overflow-hidden">
              <img
                src={cashmishbanner}
                alt="Instant Cash iPhone"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="w-full relative overflow-hidden bg-black flex justify-center items-center">
        <video
          src="https://res.cloudinary.com/dan80selw/video/upload/v1779102373/WhatsApp_Video_2026-05-17_at_10.27.02_PM_bdpfon.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full max-h-[80vh] object-cover"
        />
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all z-10 shadow-lg border border-white/20"
        >
          {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
        </button>
      </section>

      {/* Blogs Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="space-y-4">
              <h3 className="text-green-600 text-xs font-black tracking-[0.2em]">Insights</h3>
              <h2 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-gray-900 leading-tight">
                From Our <br />
                <span className="text-gray-400">Latest Blogs.</span>
              </h2>
              <div className="pt-4">
                <a href="/blogs" className="group text-[10px] font-black tracking-widest text-green-600 flex items-center gap-2 transition-all cursor-pointer">
                  View All Articles <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
            <p className="text-gray-500 font-medium max-w-sm text-sm md:text-base leading-relaxed">
              Discover tips on tech maintenance, market trends, and how to get the most value for your old devices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogs.length > 0 ? blogs.map((blog, i) => (
              <Link
                key={i}
                to={`/blogs/${blog.slug || blog._id}`}
                className="block group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                {blog.image && (
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {blog.category && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-green-600 shadow-sm">
                        {blog.category}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-8 space-y-4">
                  {blog.createdAt && (
                    <div className="text-[10px] font-bold text-gray-400 tracking-widest">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}
                  <h4 className="text-xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-green-600 transition-colors">
                    {blog.title}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 italic">
                    "{blog.excerpt || blog.summary || blog.description}"
                  </p>
                  <div className="pt-4 flex items-center gap-2 text-green-600 font-black text-[10px] tracking-widest group-hover:gap-4 transition-all">
                    Read More <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-3 text-center text-gray-400 py-12 text-sm">Loading blogs...</div>
            )}
          </div>
        </div>
      </section>

      {/* <Chatbot /> */}
    </div>
  );
}