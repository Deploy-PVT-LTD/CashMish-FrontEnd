import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/header.jsx';
import Footer from '../components/layout/Footer.jsx';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { BASE_URL } from '../lib/api';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/blogs/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setBlog(data);
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 text-center text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 text-center">
                    <h2 className="text-2xl font-black text-gray-900 mb-4">Blog Not Found</h2>
                    <Link to="/blogs" className="text-green-600 font-bold uppercase text-sm tracking-widest hover:underline">
                        鈫?Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero */}
            <section className="pt-32 pb-16 px-6 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto">
                    <Link to="/blogs" className="inline-flex items-center gap-2 text-green-500 font-bold uppercase text-[10px] tracking-widest mb-8 hover:gap-3 transition-all">
                        <ArrowLeft size={14} /> Back to Blogs
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight mb-6">
                        {blog.title}
                    </h1>
                    <div className="flex items-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                            <User size={14} /> {blog.author}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </section>

            {/* Image */}
            {blog.image && (
                <section className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
                    <div className="rounded-2xl overflow-hidden shadow-2xl">
                        <img src={blog.image} alt={blog.title} className="w-full h-[300px] md:h-[450px] object-cover" />
                    </div>
                </section>
            )}

            {/* Content */}
            <section className="py-16 px-6 max-w-4xl mx-auto">
                <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100">
                    <p className="text-lg font-semibold text-green-700 mb-6 italic">
                        {blog.excerpt}
                    </p>
                    <div
                        className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-base
                            [&_h1]:text-3xl [&_h1]:font-black [&_h1]:mb-4 [&_h1]:text-gray-900
                            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-gray-800
                            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:text-gray-700
                            [&_p]:mb-3 [&_p]:leading-relaxed
                            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3
                            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
                            [&_li]:mb-1
                            [&_a]:text-green-600 [&_a]:underline [&_a]:hover:text-green-700
                            [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through"
                        dangerouslySetInnerHTML={{ __html: blog.content || `<p>${blog.excerpt}</p>` }}
                    />
                </div>

                <div className="mt-12 text-center">
                    <Link to="/blogs" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-green-600 transition-colors">
                        <ArrowLeft size={14} /> More Articles
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default BlogDetail;
