import React, { useState, useEffect } from 'react';
import { Target, Users, Award, CheckCircle2, TrendingUp, ShieldCheck, Rocket, Zap, Heart, ArrowRight, X, Star } from 'lucide-react';
import Header from "../components/header.jsx";
import Footer from "../components/Footer.jsx";
import imgg from "../assets/image-removebg-preview.png";
import { BASE_URL } from '../api/api';

export default function AboutUs({ isPage = false }) {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [marqueeReviews, setMarqueeReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/reviews/approved`);
        if (res.ok) {
          const data = await res.json();
          setMarqueeReviews(data);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  const stats = [
    { label: 'Successful Auctions', value: '5k+', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Active Sellers', value: '12k+', icon: <Users className="w-4 h-4" /> },
    { label: 'Countries Covered', value: '1', icon: <Rocket className="w-4 h-4" /> },
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest mb-8">
            <Heart size={12} fill="currentColor" />
            Trusted by thousands
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none">
            We are <span className="text-green-500">CashMish.</span>
          </h1>
          <p className="text-gray-400 text-base md:text-xl max-w-2xl font-medium leading-relaxed">
            Reimagining the device lifecycle. We turn your old tech into instant capital through AI-driven valuations and a seamless logistics network.
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
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
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
              <h3 className="text-green-600 text-xs font-black uppercase tracking-[0.2em]">Our Values</h3>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-[0.9]">
                Transparency is <br />
                <span className="text-gray-400">Our strongest currency.</span>
              </h2>
            </div>

            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              At CashMish, we believe every device has a story and a value. Our mission is to ensure you get the most accurate valuation without the headache of negotiation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-lg hover:border-green-500/30 transition-all group">
                <Zap className="text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-black text-gray-900 mb-2 uppercase text-sm tracking-tight">Instant Action</h4>
                <p className="text-xs text-gray-400 font-medium">Valuations in seconds, payments in minutes. We value your time as much as your tech.</p>
              </div>
              <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-lg hover:border-green-500/30 transition-all group">
                <ShieldCheck className="text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-black text-gray-900 mb-2 uppercase text-sm tracking-tight">Military Privacy</h4>
                <p className="text-xs text-gray-400 font-medium">Your data security is paramount. We ensure every device is wiped before processing.</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-green-500/20 rounded-3xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 p-8 aspect-square flex items-center justify-center">
              <img
                src={imgg}
                alt="Our Operations"
                className="w-full h-full object-contain rotate-6 hover:rotate-0 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Marquee Section */}
      <section className="py-20 bg-white overflow-hidden border-y border-gray-100 relative group">
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>

        {marqueeReviews.length > 0 ? (
          <div className="flex animate-marquee group-hover:[animation-play-state:paused] gap-12 whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-12 items-center">
                {marqueeReviews.map((review, idx) => (
                  <div key={idx} className="flex flex-col gap-1 cursor-pointer max-w-[280px]" onClick={() => window.location.href = '/reviews'}>
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, starIdx) => (
                        <Star key={starIdx} size={10} className={starIdx < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight italic whitespace-normal line-clamp-1">"{review.description}"</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">— {review.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm py-4">No reviews yet.</div>
        )}

        {/* CSS Animation for Marquee */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </section>

      {/* Blogs Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="space-y-4">
              <h3 className="text-green-600 text-xs font-black uppercase tracking-[0.2em]">Insights</h3>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-[0.9]">
                From our <br />
                <span className="text-gray-400">Latest Blogs.</span>
              </h2>
              <div className="pt-4">
                <a href="/blogs" className="group text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2 transition-all cursor-pointer">
                  View All Articles <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
            <p className="text-gray-500 font-medium max-w-sm text-sm md:text-base leading-relaxed">
              Discover tips on tech maintenance, market trends, and how to get the most value for your old devices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "How to maximize your phone's resale value",
                excerpt: "Learn the essential steps to keep your device in top condition for the highest possible payout.",
                fullContent: "To get the best price for your old phone, start by keeping the original box and accessories. Scratches and dents significantly reduce value, so using a screen protector and case from day one is crucial. Before selling, perform a factory reset to clear your data, and ensure all accounts like iCloud or Google are removed. A clean, well-maintained device with original parts can fetch up to 20% more than a poorly kept one.",
                date: "Oct 12, 2024",
                category: "Tips & Tricks",
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "The future of sustainable tech recycling",
                excerpt: "Why selling your old devices is more than just about the money — it's about the planet.",
                fullContent: "Electronic waste is one of the fastest-growing waste streams in the world. By selling your old devices to platforms like CashMish, you contribute to a circular economy. We ensure that devices are either refurbished for a second life or recycled using eco-friendly methods to recover precious metals like gold and copper. This reduces the need for destructive mining and keeps toxic chemicals out of landfills.",
                date: "Oct 08, 2024",
                category: "Sustainability",
                image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "E-waste: A goldmine in your drawer",
                excerpt: "Understanding the hidden value inside your old electronics and how we extract it.",
                fullContent: "Millions of dollars worth of precious materials are sitting in drawers across the country in the form of old electronics. Beyond the obvious resale value of working phones, even broken devices contain valuable components. Modern recycling technologies allow us to extract these materials efficiently. Selling your 'junk' tech not only nets you some quick cash but also provides the industry with the raw materials needed for next-generation devices.",
                date: "Sep 25, 2024",
                category: "Economy",
                image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800"
              }
            ].map((blog, i) => (
              <div key={i} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-[16/10] overflow-hidden relative cursor-pointer">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-green-600 shadow-sm">
                    {blog.category}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{blog.date}</div>
                  <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-tight group-hover:text-green-600 transition-colors">
                    {blog.title}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 italic">
                    "{blog.excerpt}"
                  </p>
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="pt-4 flex items-center gap-2 text-green-600 font-black uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all cursor-pointer"
                  >
                    Read More <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors z-10 cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="overflow-y-auto max-h-[90vh]">
              <div className="h-64 overflow-hidden">
                <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {selectedBlog.category}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {selectedBlog.date}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                  {selectedBlog.title}
                </h3>
                <div className="h-1 w-20 bg-green-500 rounded-full"></div>
                <p className="text-gray-600 leading-relaxed font-medium text-lg">
                  {selectedBlog.fullContent}
                </p>
                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    <Zap size={14} className="text-green-500" />
                    CashMish Insights
                  </div>
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-green-600 transition-colors shadow-lg cursor-pointer"
                  >
                    Close Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer is already included in App.jsx */}
    </div>
  );
}
