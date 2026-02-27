import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/header.jsx';
import Footer from '../components/layout/Footer.jsx';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { BASE_URL } from '../lib/api';
import Chatbot from '../components/Chatbot.jsx';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/blogs/published`);
                if (response.ok) {
                    const data = await response.json();
                    setBlogs(data);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Chatbot />
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
                {loading ? (
                    <div className="text-center text-gray-400 py-10">Loading blogs...</div>
                ) : blogs.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">No blog posts yet. Stay tuned!</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {blogs.map(blog => (
                            <Link key={blog._id} to={`/blogs/${blog._id}`} className="block group border border-gray-100 rounded-[2rem] p-6 hover:shadow-2xl transition-all cursor-pointer">
                                {blog.image && (
                                    <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6">
                                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="flex items-center gap-1"><User size={12} /> {blog.author}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight group-hover:text-green-600 transition-colors">
                                        {blog.title}
                                    </h3>
                                    <p className="text-gray-500 font-medium line-clamp-2">
                                        {blog.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 text-green-600 font-black uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
                                        Read Full Article <ArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* <Footer /> */}
        </div>
    );
};

export default Blogs;
