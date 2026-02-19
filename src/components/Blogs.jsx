import React from 'react';
import Header from './header.jsx';
import Footer from './Footer.jsx';
import { ArrowRight, Calendar, User } from 'lucide-react';

const Blogs = () => {
    const allBlogs = [
        {
            id: 1,
            title: "How to maximize your phone's resale value",
            excerpt: "Learn the essential steps to keep your device in top condition for the highest possible payout.",
            date: "Oct 12, 2024",
            author: "Admin",
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 2,
            title: "The future of sustainable tech recycling",
            excerpt: "Why selling your old devices is more than just about the money — it's about the planet.",
            date: "Oct 08, 2024",
            author: "EcoTeam",
            image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800"
        },
        {
            id: 3,
            title: "E-waste: A goldmine in your drawer",
            excerpt: "Understanding the hidden value inside your old electronics and how we extract it.",
            date: "Sep 25, 2024",
            author: "MarketAnalyst",
            image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <section className="pt-32 pb-20 px-6 bg-gray-900 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
                        Our <span className="text-green-500">Blogs.</span>
                    </h1>
                    <p className="text-gray-400 text-lg font-medium">
                        Insights, tips, and the latest in tech recycling.
                    </p>
                </div>
            </section>

            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {allBlogs.map(blog => (
                        <div key={blog.id} className="group border border-gray-100 rounded-[2rem] p-6 hover:shadow-2xl transition-all">
                            <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {blog.date}</span>
                                    <span className="flex items-center gap-1"><User size={12} /> {blog.author}</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight group-hover:text-green-600 transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-500 font-medium line-clamp-2">
                                    {blog.excerpt}
                                </p>
                                <button className="flex items-center gap-2 text-green-600 font-black uppercase text-[10px] tracking-widest hover:gap-4 transition-all cursor-pointer">
                                    Read Full Article <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* <Footer /> */}
        </div>
    );
};

export default Blogs;
