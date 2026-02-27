import React, { useState } from 'react';
import { Star, Quote, Heart, CheckCircle, Users, Award, X, Send } from 'lucide-react';
import Header from '../components/layout/header.jsx';
import Footer from '../components/layout/Footer.jsx';
import Swal from 'sweetalert2';
import { BASE_URL } from '../lib/api';
import Chatbot from '../components/Chatbot.jsx';

const Reviews = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        mobileName: '',
        description: ''
    });

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch approved reviews
    React.useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/reviews/approved`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Please Rate Us',
                text: 'Select a star rating before submitting!',
                confirmButtonColor: '#22c55e'
            });
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, rating }),
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Review Submitted!',
                    text: 'Thank you! Your review is pending approval and will be posted soon.',
                    confirmButtonColor: '#22c55e'
                });
                setIsModalOpen(false);
                setRating(0);
                setHover(0);
                setFormData({ name: '', mobileName: '', description: '' });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong. Please try again.',
                    confirmButtonColor: '#ef4444'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Please check your connection and try again.',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    // ... (stats array remains same) ...

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-green-100 selection:text-green-900 overflow-x-hidden">
            <Header />
            <Chatbot />
            {/* ... (Hero Section & Stats Section remain same) ... */}

            {/* Reviews Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                {loading ? (
                    <div className="text-center text-gray-400 py-10">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">No reviews yet. Be the first to share your experience!</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review, i) => (
                            <div key={i} className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative flex flex-col h-full cursor-pointer" onClick={() => setSelectedReview(review)}>
                                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-4 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <Quote size={20} fill="currentColor" />
                                </div>

                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                                    ))}
                                </div>

                                <p className="text-gray-600 font-medium leading-relaxed italic mb-8 flex-grow line-clamp-3">
                                    "{review.description}"
                                </p>

                                <div className="flex items-center gap-4 pt-6 border-t border-gray-50 mt-auto">
                                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-bold text-xl uppercase shadow-sm">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm">
                                            {review.name}
                                            <CheckCircle size={12} className="inline-block ml-1 text-green-500 fill-green-500/10" />
                                        </h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{review.mobileName}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="pb-24 px-6 max-w-4xl mx-auto text-center">
                <div className="bg-gray-900 rounded-[3rem] p-12 md:p-16 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                            Share Your <br /> <span className="text-green-500">Experience.</span>
                        </h2>
                        <p className="text-gray-400 font-medium max-w-sm mx-auto">
                            Sold your device already? Let others know how it went. We value every feedback.
                        </p>
                        <div className="pt-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-white text-gray-900 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-500 hover:text-white transition-all shadow-xl cursor-pointer"
                            >
                                Write a Review
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Review Submission Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-8 duration-500">
                        {/* Modal Header */}
                        <div className="bg-gray-900 p-8 text-white relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-3xl font-black uppercase tracking-tighter">Submit <span className="text-green-500">Review</span></h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Your Voice Matters</p>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Star Rating */}
                            <div className="text-center space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Rate Your Experience</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            className={`transition-all duration-200 transform hover:scale-125 cursor-pointer ${index <= (hover || rating) ? "text-yellow-400" : "text-gray-200"}`}
                                            onClick={() => setRating(index)}
                                            onMouseEnter={() => setHover(index)}
                                            onMouseLeave={() => setHover(rating)}
                                        >
                                            <Star
                                                size={28}
                                                fill={index <= (hover || rating) ? "currentColor" : "none"}
                                                strokeWidth={2.5}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="group relative">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="group relative">
                                    <input
                                        type="text"
                                        placeholder="Mobile Name (Device Model)"
                                        required
                                        className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-6 font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all"
                                        value={formData.mobileName}
                                        onChange={(e) => setFormData({ ...formData, mobileName: e.target.value })}
                                    />
                                </div>

                                <div className="group relative">
                                    <textarea
                                        placeholder="Tell us about your experience..."
                                        required
                                        rows="2"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-green-600/20 transition-all active:scale-95 flex items-center justify-center gap-3 group cursor-pointer"
                            >
                                Submit Review
                                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Review Detail Modal */}
            {selectedReview && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedReview(null)}>
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-gray-900 p-8 text-white relative">
                            <button
                                onClick={() => setSelectedReview(null)}
                                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400 font-black text-2xl uppercase">
                                    {selectedReview.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">
                                        {selectedReview.name}
                                        <CheckCircle size={14} className="inline-block ml-2 text-green-400" />
                                    </h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{selectedReview.mobileName}</p>
                                </div>
                            </div>
                            <div className="flex gap-1 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} className={i < selectedReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                                ))}
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-gray-600 font-medium leading-relaxed italic text-lg">
                                "{selectedReview.description}"
                            </p>
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => setSelectedReview(null)}
                                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-green-600 transition-colors shadow-lg cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* <Footer /> */}
        </div>
    );
};

export default Reviews;
